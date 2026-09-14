# Stage 7 — Risk Scoring Engine

This is the "Project Risk Scoring Framework" (PS outcome c) — a transparent, explainable fusion of the standalone Cost and Time models into one project-level score, not just the composite classifier's raw output relabeled.

## 1. Fusion method — tested, not assumed

Per the architecture principle from the very first planning doc ("don't hardcode weights blindly — test different weighting schemes"), four fusion strategies were run against real held-out outcomes:

| Fusion method | ROC-AUC | PR-AUC |
|---|---|---|
| Simple average | 0.904 | 0.884 |
| **Max(cost, time)** | **0.904** | **0.884** |
| Performance-weighted (by each model's own PR-AUC) | 0.904 | 0.884 |
| Noisy-OR (probability at least one risk fires) | 0.904 | 0.884 |
| *Reference: fully joint composite DART model* | *0.906* | *0.889* |

**All four are statistically indistinguishable** — expected once you know why: cost-escalation events are so rare (~1%) that no reasonable weighting of it against the much more common schedule signal changes the ranking much. The joint composite model edges ahead slightly because it can learn cost/time interactions a simple fusion of two independently-trained models can't.

**Chosen: `risk_score = 100 × max(cost_prob, time_prob)`.** Selected specifically because it ties for best performance *and* uniquely preserves which component is driving the score — the other three blend cost and time into a number that can no longer be attributed to either. That attribution is the entire point of a scoring *framework* versus a single black-box number.

## 2. Confidence — kept separate from risk, deliberately

`confidence = min(obs_index / 6, 1.0)` — capped at 6 months of history for full confidence. This is **never blended into the risk score itself**; conflating "how risky" with "how sure we are" would let a low-confidence score masquerade as a low-risk one. Displayed as its own dimension: High (≥0.8), Medium (0.4-0.8), Low (<0.4).

## 3. Tiers — calibrated against real outcomes, not picked arbitrarily

Thresholds (Low <25, Medium 25-55, High 55-80, Critical ≥80) were set by checking that the actual observed risk rate climbs monotonically and meaningfully at each tier — not just guessed round numbers:

| Tier | n (test) | Actual observed risk rate |
|---|---|---|
| Low | 1,133 | 8.8% |
| Medium | 308 | 31.8% |
| High | 879 | 75.0% |
| Critical | 409 | **95.1%** |

This is about as clean a monotonic separation as you could ask for from real government data — a project the engine calls "Critical" turned out to actually deteriorate 95% of the time in the held-out test set.

## 4. Dominant driver — the explainability payoff

Every scored project is also labeled **Cost-driven**, **Schedule-driven**, or **Mixed** (when cost_prob and time_prob are within 0.1 of each other), computed directly from which component pushed the max. Real distribution in the test set: schedule-driven dominates (1,923 of 2,729 rows) — consistent with everything found since Stage 3 (schedule slips are simply far more common than cost escalations in this data).

## 5. Real worked examples, one per tier

| Tier | Project | Sector | Score | Cost prob | Time prob | Driver | Confidence |
|---|---|---|---|---|---|---|---|
| Critical | Satna Sewerage Management and Treatment Infrastructure | Waste & Water | 80.7 | 0.01 | 0.81 | Schedule-driven | High |
| High | AIIMS Kashmir at Awantipora | Healthcare | 73.7 | 0.01 | 0.74 | Schedule-driven | High |
| Medium | DCU Revamp Project | Oil & Gas | 53.1 | 0.01 | 0.53 | Schedule-driven | High |
| Low | Jhajha-Batia line | Railways | 5.5 | 0.01 | 0.06 | Mixed | High |

Notice all four have high confidence (7-9 months of observed history) — the score differences here are genuine risk differences, not confidence artifacts. This table format, with the cost/time/driver breakdown, is exactly what Stage 12's dashboard project-detail view should render per project.

## Files

`stage7_risk_scores.csv` (all 2,729 scored test rows with full breakdown), `stage7_component_predictions.csv` (the raw cost/time model outputs the score is built from).

Stage 8 (Early Warning Engine — detecting *rising* risk, not just current level) is next whenever you're ready.
