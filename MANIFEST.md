# PAIMANA Sentinel — File Manifest: What's Actually Final

If you only look at one file, look at this one. Everything below is grouped by
"USE THIS" vs "historical/superseded, kept for audit trail only."

## THE CORE FILES YOU ACTUALLY NEED (in /paimana_panel/)

| File | What it is |
|---|---|
| `panel_long_13months.csv` | Locked baseline panel (18,033 rows). The source of truth. |
| `feature_table.csv` | Final feature table - reflects ALL 5 calendar/leakage bug fixes. |
| `build_features.py` | Final feature-engineering code - matches feature_table.csv exactly. |
| `train_stage3.py` | Final composite-model code - includes the category-capping fix. |
| `train_stage3b.py` | Final standalone Cost/Time model code - includes ITS category-capping fix too (found later, in the bounded re-check). |
| `model_and_calibrator_FINAL.joblib` | **THE frozen model.** Trained after every fix above. Use this one, not any other `.joblib` file. |
| `stage_FINAL_v2_test_predictions.csv` | The real held-out test results this model produced. |

## THE FINAL DELIVERABLES

| File | What it is |
|---|---|
| `PAIMANA_Sentinel_Dashboard.html` | The dashboard. Open this directly in a browser - it's self-contained. |
| `PAIMANA_HGB_Build_Guide.md` | Handoff doc if you want another AI to independently verify HGB vs DART. |
| `monthly_refresh/monthly_ingest_pipeline.py` + `api_service.py` | The real, tested monthly-ingestion + API layer. |
| `monthly_refresh/panel_long_14months.csv`, `feature_table_14months.csv`, `july2026_scored.csv` | The 14-month version - only used to TEST the monthly pipeline. The 13-month files above remain the real locked baseline. |

## ONE KNOWN, DISCLOSED, MEASURED GAP

`stage7_risk_scores.csv`, `stage8_scored_with_momentum.csv`, `stage9_benchmarked.csv`, `stage10_priority_queue.csv`, and the dashboard's data all pull cost/time predictions from `train_stage3b.py` **before** its category-capping fix. Measured impact when the fix went in: ROC-AUC moved by ~0.004-0.005 - confirmed negligible, not silently ignored. Safe to use as-is; noted here so it's a known fact, not a surprise.

## EVERYTHING ELSE = SUPERSEDED, KEEP FOR AUDIT TRAIL ONLY, DON'T BUILD ON THESE

- Any `stage3_modeling_dataset.csv`, `stage3_test_predictions.csv`, `model_enhanced_lgb.joblib` (the very first model, 6-month horizon, pre-bug-fixes)
- `stage_FINAL_test_predictions.csv` (no "v2" suffix) and `model_FINAL_dart.joblib` (superseded by the "v2" versions)
- `PAIMANA_Stage3...` through `PAIMANA_Stage6...` markdown reports (numbers in these predate the bug fixes - the *methodology* described is still accurate, the *numbers* are not)
- `survival_dataset.csv` (uncorrected version - use `survival_dataset_corrected.csv`)
- Everything under `friend_reconciliation/` and the various external audit `.md`/`.csv` files you were sent - these were inputs to the process, already incorporated into the fixes above, not something to build on directly

## THE ONE-LINE VERSION

**Data:** `panel_long_13months.csv` → **Features:** `feature_table.csv` → **Model:** `model_and_calibrator_FINAL.joblib` → **Results:** `stage_FINAL_v2_test_predictions.csv` → **Demo:** `PAIMANA_Sentinel_Dashboard.html`. Everything with "FINAL" or "v2" in the name is current. Everything without it is history.
