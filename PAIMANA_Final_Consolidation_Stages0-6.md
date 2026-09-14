# Final consolidation, Stages 0-6 — locking this in before moving forward

Everything below reflects the corrected feature pipeline (gap-normalized trajectory features) and every genuine alternative that was actually tried, not assumed.

## The two real bugs, both fixed and their impact measured

1. **Roads/MoRTH structural blind spot** (composite model had zero Roads rows) → fixed by moving to a 3-month horizon. Verified: Roads-specific performance now tracks non-Roads closely.
2. **Trajectory-feature gap-normalization bug** (a diff across a 6-month gap was mislabeled as 1-month) → fixed at the source in `build_features.py`. Impact: negligible for classification (0.906→0.904 ROC-AUC), but **reversed a real finding in the survival model** — Roads & Highways goes from "most stable sector" (wrong) to "one of the highest-hazard sectors, 1.98x baseline, median 3 months to first revision" (correct).

## Alternatives tried, honestly reported as not-better, so this doesn't need revisiting

| Question | Tried | Result | Verdict |
|---|---|---|---|
| Does CatBoost beat DART? | Optuna-tuned CatBoost, same features, same split | ROC-AUC 0.903 vs DART's 0.904, PR-AUC 0.874 vs 0.887, Roads 0.829 vs 0.830 | **No meaningful difference. DART stays the model of record.** |
| Does isotonic calibration beat Platt? | Isotonic on the larger 3m calibration set | Brier 0.1257 vs Platt's 0.1255, ROC-AUC 0.901 vs 0.904 | **No improvement, slightly worse. Platt stays.** |
| Does the standalone Time Overrun model generalize to Roads? | Direct Roads-vs-non-Roads split on the 3m model | 0.838 vs 0.838 — identical | **Confirmed robust, no fix needed.** |
| Does the standalone Cost Overrun model generalize to Roads? | Same check | **Zero positive Roads examples in test — literally unevaluable** | **Honest limitation, not a pass or fail. State this plainly if asked; don't claim coverage you don't have.** |

## Locked-in model of record, final

- **Primary risk model**: composite `target_at_risk_3m`, tuned DART, Platt-calibrated. ROC-AUC 0.904, PR-AUC 0.887, Brier 0.125 (row-level, held-out test).
- **Supporting models**: standalone Cost Overrun and Time Overrun (3m and 6m), Stage 3b, unchanged in method, re-run on corrected features.
- **Cold-start fallback**: CUF-only model for projects with under 3 months of history (ROC-AUC 0.785).
- **Survival/hazard model**: corrected version, concordance 0.619, sector hazard ratios now trustworthy.

## Why we're stopping the search here, not because we ran out of ideas

Per the earlier Goodhart's-law caution: two real alternatives were tried and both came back negative. That's the signal to stop, not a reason to try a third — a dataset of this size (≈2,650 projects, 13 months) has a real ceiling, and continuing to search past two honest negative results risks tuning to noise rather than finding a genuine improvement. 0.90-0.91 ROC-AUC, honestly validated including on the sector it was blind to, is the right number to build on top of.

## Files updated

`feature_table.csv`, `build_features.py` (gap-normalization fix), `survival_dataset_corrected.csv`, `train_stage3b.py` (JSON export fix).

Stages 0-6 are done. Ready for Stage 7 (Risk Scoring Engine) whenever you say go.
