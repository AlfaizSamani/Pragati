# PAIMANA Sentinel — Stage 11 Follow-Up Experiment Pack
**Prompt for an IDE coding agent (Copilot / Devin / Antigravity). Paste this whole document as context.**

---

## 0. What this project is, in one paragraph

This is a project-risk early-warning model built on 13 months (June 2025–June 2026) of India's PAIMANA infrastructure project-monitoring data. The pipeline (data parsing → panel build → feature engineering → modeling) is **already built, already debugged twice via independent audit, and already locked as a final result**. This experiment pack does **not** touch the locked pipeline. It runs a set of narrowly-scoped statistical checks and alternative feature/model formulations *on top of* the existing files to answer one question: **is a small observed performance drop (Tier1: 0.903 ROC-AUC → Tier1+2: 0.899 ROC-AUC) a real effect of adding trajectory features, or is it noise?** And if real, which of several plausible causes explains it.

## 1. Files you have and what's in them

| File | What it is |
|---|---|
| `feature_table.csv` | The full engineered feature table, ~18,000 rows, one row per (project, report-month). Contains raw fields, Tier 1/2/3 engineered features, and target columns (`target_schedule_deteriorates_3m`, `target_cost_escalates_3m`, `target_valid_3m`, plus 6-month equivalents). This is your primary data source for all experiments. |
| `panel_long_13months.csv` | The raw panel before feature engineering (project-month rows with raw cost/date/progress fields). Reference only — don't rebuild from here unless an experiment specifically requires re-deriving a feature differently. |
| `build_features.py` | The feature-engineering pipeline. **Read this to understand exactly how each Tier 2 feature (velocity, acceleration, revision counts, stall streak) is currently computed** before proposing an alternative — several past bugs were exactly "this looked right but wasn't calendar-aware," so read the actual gap-normalization logic already in place. |
| `train_stage3.py` | Defines `CUF_ONLY_NUM`/`CUF_ONLY_CAT` (Tier 1, 17 features), `ENHANCED_NUM`/`ENHANCED_CAT` (Tier 1+2+3, 34 features), `load_and_filter()`, `prep_xy()`, `temporal_split()`. This is your canonical feature-list source — don't hand-copy lists from prose, import from here. |
| `tune_stage4.py` | Has `final_train_eval()` — the standard train/calibrate/evaluate function used everywhere in this project. Reuse it for consistency unless an experiment specifically needs a different training loop (e.g., the logistic-regression baseline). |
| `stage4_tuning_results.json` | Contains `dart_params` — the currently-used tuned LightGBM DART hyperparameters, applied identically to all three tiers in the original Stage 11 run. **This uniform-hyperparameter choice is itself one of the things being tested below.** |
| `model_FINAL_v2_dart.joblib`, `model_and_calibrator_FINAL.joblib` | The locked final model. Don't retrain over these files — save any new model under a new filename. |

## 2. Non-negotiable methodology (apply to every experiment below, no exceptions)

1. **Split**: train = rows with `report_month <= '2026-01'`, test = rows with `report_month` in `['2026-02','2026-03']`. Never random-shuffle across this boundary.
2. **Any internal cross-validation or hyperparameter search** must use `GroupKFold` (or `GroupShuffleSplit`) grouped by `canonical_id`, **not** plain `KFold` — the same project's rows must never split across train/validation within a fold.
3. **Fix `random_state=42`** everywhere a seed is settable, for every experiment, so comparisons across experiments are apples-to-apples and not confounded by different random splits.
4. **Filter**: `obs_index >= 3` and `dq_flag_any == 0` and `target_valid_3m == 1`, same as the locked pipeline. Don't change these filters as part of a feature experiment — that would confound two things being changed at once.
5. **Never touch the Feb–Mar 2026 test set** during feature selection, hyperparameter search, or any exploratory decision-making. It gets used exactly once per configuration, for final reporting only.
6. **Report both row-level and project-level metrics.** Project-level = `groupby('canonical_id')` then `max` of both true label and prediction within the test window. This project accepted real evidence in earlier stages that row-level metrics alone overstate confidence due to the same project appearing in multiple test rows (pseudo-replication) — don't regress on that discipline here.
7. **Report positive-class counts (`n_pos`) alongside every AUC/PR-AUC number.** A metric with under ~30 positive examples needs its `n_pos` stated in the same breath, per this project's established convention (the Cost Overrun model's small-n disclosure is the template to follow).
8. **Any new feature must be calendar-aware, not row-position-based.** This codebase has already found and fixed five bugs of exactly the shape "counted rows instead of calendar months across a reporting gap." Before adding any new `diff()`/`shift()`-based feature, check it against `gap_months` (already a column in `feature_table.csv`) the same way `progress_velocity_1m` already does.

## 2.5. Pre-registration — decided now, before any results exist, and not revisited afterward

This is the part that keeps this experiment pack from becoming exploratory noise dressed up as a finding. With 7 experiments × row/project granularity × ROC-AUC/PR-AUC, there are enough independent looks at the data that something will appear to win by chance alone even if nothing here is real — the "researcher degrees of freedom" problem. The fix is structural, not more careful analysis within each experiment:

**Two stages, not one:**
- **Stage A — Exploratory (all of Experiments 1–7, run on training-set folds / bootstrap only).** Their only job is to produce a short list of candidates worth taking seriously. Nothing from Stage A gets reported as a conclusion. "No detectable difference" (Experiment 1) or "this specific alternative construction looks promising" are the only two permitted outputs of this stage — not "trajectory features are bad" or "trend-slope wins," full stop.
- **Stage B — Confirmatory (at most 1, ideally not more than 3, candidates that survived Stage A).** Each surviving candidate gets evaluated **exactly once** against the Feb–Mar 2026 holdout — the same holdout already established as untouched-during-exploration throughout this project. Touching it more than once per candidate, or running it against more than a small handful of candidates, turns it into just another validation fold you've silently overfit to by selection. **Budget it like it's scarce, because statistically it is.**

**Primary metric, chosen now, not after seeing which number moved most:** **project-level PR-AUC.** This is the number closest to what a decision-maker (a monitoring officer scanning the risk-ranked project list) actually acts on, and it's already one of this project's two standard reporting metrics, not a new one invented for this test. Row-level and ROC-AUC numbers are still reported for context, exactly as this project has always done — but they do not decide the outcome. If project-level PR-AUC and everything else disagree, project-level PR-AUC wins the decision, and that disagreement itself gets reported honestly rather than quietly resolved in favor of whichever metric looks best.

**Promotion bar, written now, in full, before running anything:**

> An alternative Tier-2 feature construction (from Experiment 4, 7, or elsewhere) only replaces the current Tier 1+2 features in the locked pipeline if **all three** hold: (1) its bootstrap 95% CI on project-level PR-AUC, measured on the training-set folds, excludes zero improvement over Tier1-only; (2) it beats the current Tier1+2's project-level PR-AUC (0.924) on those same training-set folds; (3) it holds — meaning it still beats both Tier1-only and current-Tier1+2 on project-level PR-AUC — on the single, one-shot Feb–Mar 2026 holdout evaluation in Stage B.

If a candidate passes (1) and (2) but fails (3), the honest conclusion is "did not replicate on held-out data," not a second attempt at the holdout with a tweaked version of the same idea — that would just be Stage A exploration wearing Stage B's credibility.

## 3. Experiments, in priority order — all of these are Stage A (exploratory). None of their individual results get reported as a conclusion. Their job is to produce a short list of candidates for the one-shot Stage B confirmation.

### Experiment 1 (do this first, before anything else): Is the Tier1 vs Tier1+2 drop even real?

**Goal**: get a confidence interval on the delta (Tier1 ROC-AUC − Tier1+2 ROC-AUC), not just the point estimate.

**Method**:
- Using the training set only, run 4-fold `GroupKFold` (grouped by `canonical_id`, seed=42) for both Tier 1 and Tier 1+2 feature sets, using the exact same fold assignments for both (i.e., generate the fold split once, reuse it for both feature sets — this directly answers the reviewer's "were both tiers evaluated on the exact same folds" question).
- For each fold, train on the fold's train-portion, score the fold's held-out portion, record ROC-AUC and PR-AUC for both tiers.
- Compute the per-fold delta (Tier1+2 − Tier1) for each of the 4 folds.
- Additionally: bootstrap the final held-out Feb–Mar test set 2,000 times (resample rows with replacement, respecting `canonical_id` grouping — resample projects, not individual rows, then take all of a resampled project's rows), recomputing both tiers' ROC-AUC each time, and report the 95% CI of the delta.

**Report back**: a table of the 4 fold-level deltas, their mean and std, and the bootstrap 95% CI on the test-set delta. State plainly whether zero falls inside that CI.

---

### Experiment 2: Per-tier hyperparameter retuning (fair-comparison check)

**Goal**: check whether the apparent Tier1+2 underperformance is really "more features need more regularization, and we didn't give it any."

**Method**: Using `tune_stage4.py`'s existing Optuna + `GroupKFold` search machinery (same approach already used for the original DART tuning — read that file's `run_search()` function and reuse it), run a **separate** hyperparameter search for the Tier1+2 feature set specifically (don't reuse Tier1's `dart_params`). 30–40 trials is enough given this project's existing search budget precedent. Compare the *tuned* Tier1+2 result against the already-tuned Tier1 baseline (0.903 ROC-AUC) and against the original untuned-per-tier Tier1+2 result (0.899).

**Report back**: tuned Tier1+2 hyperparameters found, and its row/project ROC-AUC/PR-AUC, next to the original 0.899 for direct comparison.

---

### Experiment 3: Missingness-encoding check for revision-recency features

**Goal**: check whether `months_since_last_cost_revision` / `months_since_last_schedule_revision` conflate "never revised" with "revised very recently" through bad missing-value encoding.

**Method**: Inspect (`.isna().sum()`, `.describe()`) these two columns in `feature_table.csv` directly. Check what value a project with **zero** revisions so far actually gets (should be `NaN`, per `build_features.py`'s `months_since_flag_calendar` function — confirm this is what LightGBM actually receives, since LightGBM's native NaN handling treats missing as "go whichever split direction is better," which the model might exploit correctly or might not). If any imputation to `0` is happening anywhere in `prep_xy()` or the training call, that's the bug the reviewer is describing. If it's genuinely staying `NaN` end to end, report that as a clean bill of health for this specific concern rather than assuming a problem exists.

**Report back**: one paragraph — either "confirmed NaN throughout, not a bug" or "found unintended imputation at \<location\>, fixed, re-ran Tier1+2, new number is X."

---

### Experiment 4: Alternative feature formulations (feature-side fixes)

Try each of these as a **replacement** for the raw velocity/acceleration features in the Tier 1+2 set (not additions — you're testing whether a smoother formulation recovers the lost performance, so keep the feature *count* comparable):

**4a. Least-squares trend slope** instead of simple differencing: for each project at each month, fit a simple linear regression of `phys_prog_n` against `month_p` (converted to an ordinal) over all available prior observations (up to that month), and use the fitted slope as `progress_trend_slope`. This needs at least 2 prior points; fewer than that should be `NaN`, consistent with this project's existing missing-data conventions.

**4b. Categorical trend direction** instead of continuous velocity: bucket `progress_velocity_1m` into `{Improving, Flat, Worsening}` using thresholds you choose and justify in one sentence (e.g., ±1 point/month as the flat band) — the goal is throwing away noise-sensitive magnitude precision, so don't overfit the threshold choice to the test set.

**4c. Interaction feature**: `progress_velocity_1m * is_overdue_current` (and the schedule-slip equivalent) — testing the hypothesis that trajectory only matters *conditional on* already being behind, not as a standalone signal.

**Method for all three**: swap the relevant column(s) into the Tier1+2 feature list, retrain with `final_train_eval()` using the **already-tuned Tier1 hyperparameters** (to isolate the feature-formulation effect from the hyperparameter effect — Experiment 2 already covers the hyperparameter axis separately), evaluate on the same locked test split.

**Report back**: a table, one row per variant (4a/4b/4c), with row/project ROC-AUC/PR-AUC, next to the original Tier1 (0.903) and original Tier1+2 (0.899) for comparison.

---

### Experiment 5: Permutation importance on Tier2-only features

**Goal**: directly test whether the Tier 2 features carry any signal above shuffled noise, rather than inferring it indirectly from an aggregate AUC delta.

**Method**: Using the full Tier1+2+3 (Enhanced) model already trained (or retrain it fresh with `final_train_eval`), run `sklearn.inspection.permutation_importance` on the **test set**, scoring on ROC-AUC, with `n_repeats=30`, `random_state=42`. Report the importance (mean and std of the score drop) for each Tier-2-specific feature individually (`progress_velocity_1m`, `progress_velocity_3m`, `progress_accel_1m`, `expenditure_velocity_1m`, `cost_revision_count_to_date`, `schedule_revision_count_to_date`, `months_since_last_cost_revision`, `months_since_last_schedule_revision`, `stall_streak_months`).

**Report back**: the full importance table, sorted descending. State plainly which Tier-2 features have an importance whose confidence interval (mean ± std) includes zero — those are the ones with no detectable individual contribution.

---

### Experiment 6: Simple linear baseline on Tier2-only features

**Goal**: check whether Tier 2 has *any* linear signal at all, independent of whether a GBDT is the right tool to extract it (GBDTs can overfit noisy splits in a way a regularized linear model won't).

**Method**: Train `sklearn.linear_model.LogisticRegression` (with `class_weight='balanced'`, `C` chosen via the same `GroupKFold` approach as Experiment 1) using **only** the 11 Tier-2-specific numeric features (no Tier 1, no categoricals) against the composite target. Compare its test-set ROC-AUC/PR-AUC against a null/dummy classifier (predicting the training base rate for every row) on the same features-restricted setup.

**Report back**: LogisticRegression's ROC-AUC/PR-AUC vs the null baseline's. If LogisticRegression barely beats the null, that's independent evidence Tier 2 alone doesn't carry much extractable signal, consistent with (or contradicting) the GBDT finding.

---

### Experiment 7 (optional, do only if 1–6 leave real ambiguity): Monotonic constraints

**Method**: If there's a domain-justified direction (e.g., negative progress velocity should never *decrease* predicted risk), add LightGBM's `monotone_constraints` parameter for `progress_velocity_1m` and `progress_vs_time_gap` in the Tier1+2 model, forcing risk to move only one way as these features move. Compare against the unconstrained Tier1+2 result.

**Report back**: constrained vs unconstrained row/project ROC-AUC/PR-AUC.

---

## 4. What to send back

Send Stage A results for all experiments you run, in the format each experiment's section specifies. From those, we'll jointly pick **at most 1–3 candidates** that meet the promotion bar's conditions (1) and (2) on training-fold evidence. Then — and only then — one of us runs **Stage B**: each surviving candidate scored exactly once against the untouched Feb–Mar 2026 holdout, decided on project-level PR-AUC per the pre-registered bar above. That single Stage B result, not any Stage A number, is what gets written into Stage 11's conclusions as a real finding.

**Do not let the agent modify `feature_table.csv`, `model_FINAL_v2_dart.joblib`, or `model_and_calibrator_FINAL.joblib` in place.** All experiments should read these as input and write new, separately-named output files.

**Do not let the agent touch the Feb–Mar 2026 rows for anything in Stage A** — not for training, not for validation, not for a "quick check." If you're unsure whether a step counts as touching the holdout, it does; ask before running it rather than after.
