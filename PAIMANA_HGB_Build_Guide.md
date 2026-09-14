# PAIMANA Sentinel — HistGradientBoosting Parallel Build & Deployment Architecture Guide
**For an IDE coding agent (Copilot / Antigravity / Devin). Paste this whole document as context.**

---

## 0. Why this build exists, stated plainly

The locked production model is a tuned LightGBM (DART boosting), Platt-calibrated, achieving project-level ROC-AUC 0.923 / PR-AUC 0.930 on an untouched Feb-Mar 2026 holdout. Multiple external reports have claimed a HistGradientBoostingClassifier (HGB) pipeline outperforms this. **One fair, controlled, one-shot comparison has already been run** (same target, same split, same feature completeness) and found **no statistically significant difference** - bootstrap 95% CI on the PR-AUC delta was [-0.007, +0.0128], including zero. This build exists to let you **independently verify that finding**, not to manufacture a win. If your result also lands within noise of the locked model, that is the expected, correct outcome - not a failure of this exercise.

## 1. What you're building

A complete, independently-built HGB pipeline, replicating every stage of the audited DART pipeline's rigor: leak-safe features, calendar-aware trajectory construction, train-only category encoding, grouped/temporal splits, proper calibration, and honest small-n disclosure. You are **not** rebuilding the data pipeline from scratch - reuse the already-verified, twice-audited artifacts below. You are building the **model layer** in parallel, to the same standard.

## 2. Files to use as-is (do not regenerate)

| File | Use it for |
|---|---|
| `panel_long_13months.csv` | The entity-resolved raw panel (18,033 rows, 2,650 projects) - already verified against MoSPI's own published totals digit-for-digit. |
| `feature_table.csv` | The full engineered feature table (Tier 1/2/3), gap-normalized, leak-checked across 7 confirmed bug fixes. Use this directly - do not recompute features independently, or you introduce a second uncontrolled variable into the comparison. |
| `train_stage3.py` | Defines `CUF_ONLY_NUM`/`CAT`, `ENHANCED_NUM`/`CAT`, `load_and_filter()`, `prep_xy()`, `temporal_split()`. **Import these, don't hand-copy the lists.** |

## 3. Non-negotiable methodology - identical to the locked pipeline, no exceptions

1. **Target**: `target_at_risk_3m` = schedule deterioration OR cost escalation within 3 calendar months (calendar-exact join on `canonical_id` + `report_month + 3`, not row-position shift). Deliberately excludes progress-stall alone - do not add it; that would make this a different, non-comparable target (this exact mistake caused a major confusion in an earlier external report).
2. **Filter**: `obs_index >= 3`, `dq_flag_any == 0`, `target_valid_3m == 1`.
3. **Split**: train = `report_month <= '2026-01'`, test = `report_month in ['2026-02','2026-03']`. Never random-shuffle across this boundary.
4. **Category encoding (agency/state capping) must use TRAIN-ONLY frequency**, not the full dataset. This exact leak was found and fixed twice in the locked pipeline (once in the composite model, once - caught in a later bounded re-check - in the standalone models). Compute top-20 agencies / top-25 states from `df[df.report_month <= '2026-01']` only, then apply that mapping to all rows.
5. **Any internal CV/hyperparameter search**: `GroupKFold` grouped by `canonical_id`, `random_state=42` throughout.
6. **Calibration**: fit HGB on 85% of train (grouped), hold out 15% (grouped) for a Platt-scaling (`LogisticRegression`) calibrator, apply to test. Do not evaluate on raw uncalibrated `predict_proba` - an earlier external report did this and it inflated apparent precision.
7. **Report both row-level and project-level metrics** (project = `groupby('canonical_id')`, `max` of true label and prediction in the test window). Project-level is the metric that decides anything - row-level is context only.
8. **Report `n_pos` alongside every metric.** A result on fewer than ~30 positives needs its sample size stated in the same sentence, not a footnote.

## 4. Build steps

```python
import pandas as pd, numpy as np, optuna
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import GroupKFold
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss
import train_stage3 as s3

# Step 1: load - reuse the verified pipeline's own loader
full_df, _ = s3.load_and_filter(train_cutoff='2026-01')
full_df = full_df.drop(columns=['target_at_risk_6m'])
full_df['target_at_risk_3m'] = ((full_df['target_schedule_deteriorates_3m']==1)|(full_df['target_cost_escalates_3m']==1)).astype('Int64')
full_df.loc[full_df['target_valid_3m']!=1, 'target_at_risk_3m'] = pd.NA
filt = (full_df['obs_index']>=3) & (full_df['dq_flag_any']==0) & (full_df['target_valid_3m']==1)
m3 = full_df[filt].copy()
m3['target_at_risk_3m'] = m3['target_at_risk_3m'].astype(int)
train = m3[m3['report_month']<='2026-01']
test = m3[m3['report_month'].isin(['2026-02','2026-03'])]

# Step 2: hyperparameter search - GroupKFold on TRAIN ONLY, never touch test here
def objective(trial):
    params = dict(
        max_iter=trial.suggest_int('max_iter', 100, 500),
        max_depth=trial.suggest_int('max_depth', 3, 10),
        max_leaf_nodes=trial.suggest_int('max_leaf_nodes', 7, 63),
        learning_rate=trial.suggest_float('learning_rate', 0.01, 0.2, log=True),
        l2_regularization=trial.suggest_float('l2_regularization', 0.0, 3.0),
        min_samples_leaf=trial.suggest_int('min_samples_leaf', 10, 50),
    )
    gkf = GroupKFold(n_splits=4)
    X = train[s3.ENHANCED_NUM + s3.ENHANCED_CAT].copy()
    for c in s3.ENHANCED_CAT: X[c] = X[c].astype('category')
    y = train['target_at_risk_3m']
    scores = []
    for tr_i, va_i in gkf.split(X, y, train['canonical_id']):
        m = HistGradientBoostingClassifier(categorical_features=[c in s3.ENHANCED_CAT for c in s3.ENHANCED_NUM+s3.ENHANCED_CAT],
                                            class_weight='balanced', random_state=42, **params)
        m.fit(X.iloc[tr_i], y.iloc[tr_i])
        scores.append(average_precision_score(y.iloc[va_i], m.predict_proba(X.iloc[va_i])[:,1]))
    return np.mean(scores)

study = optuna.create_study(direction='maximize', sampler=optuna.samplers.TPESampler(seed=42))
study.optimize(objective, n_trials=40)

# Step 3: final fit with grouped calibration holdout, evaluate ONCE on test
# (mirror train_stage3.py's final_train_eval() structure exactly - grouped 15% holdout,
#  Platt calibration, then score test once)
```

Run this for **three feature tiers** (CUF-only, Tier1+2, full Enhanced) to reproduce Stage 11's ablation with HGB, and report the same table format already established:

| Feature tier | Row ROC/PR | Project ROC/PR | n_pos |
|---|---|---|---|

## 5. What "success" means here - decided before you see results

Per the pre-registration discipline already established in this project: **project-level PR-AUC is the primary metric.** Bootstrap a 95% CI on (HGB PR-AUC minus DART's locked 0.930) using the same project-grouped resampling method as the earlier comparison. Three honest outcomes are possible, and all three are acceptable - do not keep re-tuning until you get a specific one:
- **CI excludes zero, HGB higher** -> real finding, worth adopting, but only after this same result also holds on a fresh, never-touched holdout (if one becomes available in a later month).
- **CI includes zero** -> confirms the existing finding. Report it as confirmation, not a null result to bury.
- **CI excludes zero, HGB lower** -> also a real, valid finding. Report it.

## 6. Monthly / API-based ingestion architecture (deployment framework, PS requirement (i))

The problem statement states PAIMANA data is "updated on a monthly basis, through role-based access and APIs." This project's entire pipeline was built from 13 static Flash Report PDFs - a legitimate approach given no live credentials were available, but a deployment-framework submission should show the intended production path, not just what was used to build the prototype. Build this as a documented architecture, not necessarily a live connection (unless API credentials are actually available):

```
MONTHLY REFRESH CYCLE
----------------------
1. INGEST: pull that month's project-monitoring data via PAIMANA's role-based API
   (falls back to Flash Report PDF parsing via parse_reports.py if API access
   is unavailable - this project's existing parser remains the fallback path)
2. ENTITY RESOLUTION: match new rows to canonical_id using the existing crosswalk;
   for genuinely new projects, assign a new canonical_id and flag as cold-start
3. FEATURE REFRESH: append the new month to feature_table.csv using build_features.py's
   existing gap-aware logic (unchanged - already handles reporting gaps correctly)
4. SCORE: apply the current frozen model + calibrator (model_and_calibrator_FINAL.joblib)
   to all eligible rows (obs_index>=3) for risk scoring; apply the CUF-only fallback
   model to cold-start rows (obs_index<3), exactly as Stage 8 already established
5. RETRAIN CADENCE: given the in-window temporal decay finding from the external audit
   (Feb 2026 test performance 0.942 ROC-AUC vs March 2026's 0.860 on the same frozen
   model), retrain monthly, not quarterly - staleness degrades real performance
6. DASHBOARD REFRESH: update dashboard_master.json from the new month's scored panel
```

**This is a design document, not a mandate to build a live scraper against PAIMANA's real infrastructure without authorization** - if no legitimate API credentials exist, document this architecture as the intended production path and keep the PDF-parsing fallback as the actual working system for the submission.

## 7. My honest prediction, for what it's worth

Based on everything already tested in this project - CatBoost vs DART (tied), isotonic vs Platt (tied), four alternative scikit-learn model families vs DART in an independent audit (all lost by 1-3 points), and the specific HGB-vs-DART comparison already run (CI includes zero) - **I expect this independent HGB build to also land within noise of the locked model.** That's not a reason to skip building it; independent replication is exactly how you'd want to confirm that before betting a submission on it. But calibrate your expectations: five negative results in a row on the same dataset is a real pattern, not bad luck, and a sixth attempt landing meaningfully different would itself be worth double-checking for a new bug before celebrating.
