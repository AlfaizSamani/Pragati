# Stage 3b — Standalone Cost Overrun & Time Overrun Models

The Stage 3 composite (`target_at_risk_6m`) is a good "overall risk" score, but PS 26103 lists Cost Overrun and Time Overrun as two separate expected outcomes. These are the real, standalone models for each, at both horizons — same feature set, same leak-safe temporal split, same calibration approach as Stage 3.

## Results

| Model | Level | ROC-AUC: Naive → LGBM | PR-AUC: Naive → LGBM | Test positives (n) |
|---|---|---|---|---|
| **Cost Overrun, 6-month** | row / project | 0.596 → **0.822** / 0.617 → **0.831** | 0.051 → 0.508 / 0.058 → 0.608 | 47 / 27 |
| **Time Overrun, 6-month** | row / project | 0.766 → **0.879** / 0.750 → **0.874** | 0.553 → 0.788 / 0.566 → 0.806 | 399 / 234 |
| **Cost Overrun, 3-month** | row / project | 0.756 → **0.936** / 0.781 → **0.939** | 0.029 → 0.663 / 0.031 → 0.671 | 31 / 17 |
| **Time Overrun, 3-month** | row / project | 0.810 → **0.904** / 0.790 → **0.924** | 0.710 → 0.882 / 0.733 → 0.927 | 1,232 / 791 |

## Reading these honestly

- **Time Overrun models are your most reliable result** — large positive-class counts (234-1,232), consistent, strong gains over naive at both horizons and both levels. This is the one you can defend under hard questioning without caveats.
- **Cost Overrun models look spectacular (0.82-0.94 ROC-AUC) but rest on very few positive examples** — 27 projects at 6-month, only **17 projects** at 3-month. A metric computed on 17 positives has a wide, unstated confidence interval; a couple of different projects landing in the test window either way could move that PR-AUC by a lot. **Report the number, but report the n alongside it every time** — "0.94 ROC-AUC on 17 positive test cases" is honest and still impressive; "0.94 ROC-AUC" alone invites a judge to assume more data than you have, and getting caught overstating this is far worse than the honest version.
- Cost overruns are genuinely rarer events in this data (3.6-4.3% base rate depending on horizon) than schedule slips (31-45%) — which is exactly why they're harder to model confidently and why India's infrastructure monitoring conversation focuses so much on schedule slippage as the earlier, more frequent warning sign.

## What this gives you for the submission

Two real, separately-evaluated models directly satisfying PS outcomes (a) and (b), plus the Stage 3 composite as the unified "overall risk score" (outcome c). All three share one feature backbone and one evaluation methodology, so the story is coherent: same rigor applied three ways, not three different ad-hoc approaches bolted together.

## Files

`train_stage3b.py` (pipeline), `stage3b_results.json` (full metrics for all four models).

## Next

Dashboard, using `stage3_test_predictions.csv` (composite) plus these four models' outputs for the per-outcome breakdown on a project detail view.
