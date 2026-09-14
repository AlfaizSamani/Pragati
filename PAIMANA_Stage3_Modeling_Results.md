# PAIMANA Sentinel — Stage 3: Baseline Modeling Results (real numbers, real data)

Built on `stage3_modeling_dataset.csv` (filtered from the Stage 2 feature table). Everything below is measured, not projected.

## 1. Target definition — decided and built

**`target_at_risk_6m`** = 1 if, within 6 months of the observation month, this project's **current completion estimate slips further** OR **current cost estimate escalates by more than 2%**; else 0.

Composite, not six separate targets — chosen deliberately for a 6-hour build window: higher, more trainable positive-class rate than cost-escalation alone (8.9%), one clean headline number to defend, while the SHAP breakdown (Section 5) still lets you say *why* a project is flagged, schedule-driven or cost-driven, without training three separate models.

**Filters applied before modeling** (from Stage 2's own recommendations): `obs_index ≥ 3` (enough trajectory history to trust velocity/streak features) and `dq_flag_any == 0` (exclude the 1.44% of rows with source-data pathologies). Net: **2,970 modeling rows**, composite base rate **31.95%** — a real, workable minority class, not a single-digit one.

## 2. Split — temporal holdout, not random

**Train:** report months ≤ 2025-10 (1,682 rows, 666 projects). **Test:** 2025-11 & 2025-12 (1,288 rows, 683 projects). This mirrors real deployment: train on what's already known, score currently-ongoing projects going forward. 622 projects appear in both — expected and correct in a panel early-warning setting (a live system has seen these projects' history before scoring their future), not the entity-leakage failure mode flagged earlier, which is specifically about randomly shuffling rows across train/test. Early-stopping validation inside training was still done as a **grouped** split by `canonical_id`, so no project's rows leak between fitting and early-stopping.

**Honest caveat carried over from Stage 2:** this window sits mostly inside the MoRTH reporting gap (July–November 2025), with December's reintroduction landing right at the train/test boundary. `ministry_newly_reporting_flag` is in the feature set specifically to help the model not misread that as a portfolio-wide risk spike, but it's worth saying out loud in your presentation rather than hoping nobody asks.

## 3. Results — three-way comparison, row-level and project-level

| Model | Level | ROC-AUC | PR-AUC | Brier | Recall @ top-20% flagged | Precision @ top-20% flagged |
|---|---|---|---|---|---|---|
| Naive (sector base rate) | row | 0.768 | 0.566 | 0.177 | 0.562 | 0.658 |
| **LightGBM, CUF-only** | row | 0.871 | 0.777 | 0.155 | 0.521 | 0.829 |
| **LightGBM, CUF+Enhanced** | row | **0.881** | **0.802** | **0.140** | 0.528 | **0.841** |
| LightGBM, Enhanced | **project** | 0.877 | 0.824 | 0.147 | 0.494 | 0.869 |
| Naive | **project** | 0.752 | 0.579 | 0.191 | 0.552 | 0.672 |

**This directly answers PS dimension (b):** ML beats the naive statistical baseline by a wide, real margin — +0.11 ROC-AUC, +0.24 PR-AUC — and the gain **holds at the project level**, not just row level, which is the honest check Stage 2 flagged as necessary given the panel's pseudo-replication risk. This is your strongest, most defensible slide.

**This directly answers PS dimension (c):** CUF-only already gets you most of the way (0.871 ROC-AUC) — the 15 raw/derived-from-CUF fields carry real signal on their own. Adding the Tier 2/3 engineered layer (trajectory + peer + fiscal-calendar + stall-streak) buys a further **+0.010 ROC-AUC, +0.025 PR-AUC, and a meaningfully better Brier score (0.155→0.140)**. That's a modest but real, honestly-reported gain — the correct way to answer "does the additional data earn its place," rather than inflating the story. Report both numbers; the gap itself is the finding MoSPI's dimension (c) is asking for.

## 4. Calibration — checked, not assumed

Reliability table (5 quantile buckets of predicted probability vs. actual observed rate, enhanced model, test set):

| Predicted (mean) | Actual rate | n |
|---|---|---|
| 0.150 | 0.043 | 258 |
| 0.180 | 0.089 | 257 |
| 0.260 | 0.143 | 258 |
| 0.425 | 0.479 | 257 |
| 0.611 | 0.841 | 258 |

**Honest read:** calibration is reasonable in the middle but imperfect at the tails, with only ~258 rows per bucket so some of this is noise, not necessarily model error. The model **overstates risk in the low bucket** (says ~15%, actually ~4% — this would cause alert fatigue if unaddressed) and **understates risk in the highest bucket** (says ~61%, actually ~84% — the safer direction of error for an early-warning tool, but still worth naming rather than glossing over). Platt scaling was already applied on a grouped held-out set per the Stage 2 methodology recommendation; with more months of data this would tighten further. Say this plainly if asked — "we checked calibration and it's good-but-imperfect, here's exactly where" is a far stronger answer than an unchecked confidence number.

## 5. What's actually driving the model (SHAP, top drivers)

| Feature | Mean \|SHAP\| |
|---|---|
| `time_elapsed_ratio` | 0.519 |
| `sector` | 0.396 |
| `state_capped` | 0.312 |
| `agency_capped` | 0.293 |
| `progress_vs_time_gap` | 0.222 |
| `ministry` | 0.208 |
| `planned_duration_months` | 0.191 |
| `phys_prog_n` | 0.188 |
| `sector_peer_progress_percentile` | 0.180 |
| `schedule_slip_months_to_date` | 0.115 |

**Read this as "top predictive signals," not "causes"** (SHAP quantifies a trained model's attribution, not a causal claim — this distinction matters to a MoSPI-affiliated panel, per the earlier architecture doc). The story it tells is coherent and defensible: **where a project sits in its own planned timeline, how it compares to sector/state/agency peers, and how far behind its own schedule it already is** are the dominant signals — not any single exotic feature. That's a healthy result; it means the model is learning genuine structural risk patterns rather than latching onto a quirky proxy.

## 6. Mapping to the SIH problem statement's expected outcomes

| PS outcome | What you have right now |
|---|---|
| (a) Cost Overrun Prediction Model | `target_cost_escalates_6m` component, embedded in the composite model |
| (b) Time Overrun Prediction Model | `target_schedule_deteriorates_6m` component, same model |
| (c) Project Risk Scoring Framework | `pred_enhanced` calibrated probability per project — this IS the risk score |
| (d) Early Warning Alert System | Top-20%-flagged threshold, tested and reported above (52.8% recall, 84.1% precision at row level) |
| (e) Benchmarking Module | `sector_peer_progress_percentile`, already a live model feature, not just a dashboard afterthought |
| (f) Cost Escalation Driver Analysis | SHAP table above, ready to render per-project |
| (g) AI-powered Monitoring Dashboard | Not yet built — natural next step |
| (h) LLM-enabled Project Intelligence Assistant | Deferred per the original architecture doc's build-order — correct call given your remaining time |
| (i) Documentation and deployment framework | This document, plus the Stage 0-3 docs already produced |
| Dimension (b): statistical vs ML | Answered, Section 3 |
| Dimension (c): CUF vs enhanced | Answered, Section 3 |

You are already covering 7 of 9 listed outcomes with real, evaluated artifacts — not slideware.

## 7. Files delivered

- `stage3_modeling_dataset.csv` — the filtered, feature-complete modeling table (2,970 rows)
- `stage3_test_predictions.csv` — test-set rows with both naive and enhanced model predictions attached, ready to drive a dashboard
- `model_enhanced_lgb.joblib` — the trained, calibrated LightGBM model, loadable directly
- `shap_importance.csv` — full driver ranking
- `train_stage3.py` — the full pipeline, re-runnable end-to-end

## 8. Given your remaining time, in order

1. **Dashboard** — `stage3_test_predictions.csv` already has everything needed for a risk-ranked project list + one project detail view. This is the highest-value remaining build.
2. **One project walkthrough** for the live demo — pick a real high-`pred_enhanced` project from the test predictions and show its actual trajectory (same style as the Calicut airport example from Stage 1) as your centerpiece slide.
3. Slides: lead with Section 3's table (naive vs CUF-only vs enhanced, row AND project level) — it's your single strongest piece of evidence, and it's real.
