# Stage 10 — Intervention Prioritization / Prescriptive Layer

## 1. The real tradeoff: catching the most projects vs. protecting the most rupees

Tested on the Feb-Mar 2026 held-out test set (real outcomes, not the unlabeled latest snapshot):

| Priority formula | Top-10%-flagged hit rate | Share of total ₹-at-risk captured |
|---|---|---|
| Risk score alone | 97% | 18.4% |
| 70% risk / 30% exposure | 95% | 25.8% |
| **50% risk / 50% exposure** | 94% | **39.7%** |

**This is a genuine policy choice, not a tuning knob to hide.** Ranking by risk alone is extremely accurate (97% of flagged projects really do deteriorate) but systematically favors small, risky projects over large ones — it would let a ₹10,000 Cr project with moderate risk slip behind a ₹50 Cr project with slightly higher risk. Weighting in cost exposure 50/50 trades 3 points of accuracy for **more than double the real financial exposure caught**. Given the problem statement frames this as "prioritizing interventions" for a monitoring agency managing ₹40+ lakh crore in aggregate exposure, capturing rupees-at-risk is arguably the more relevant objective — **chosen: 50/50 risk-exposure weighting**, with the tradeoff table above kept as the transparent justification, not asserted as obviously correct.

## 2. Driver attribution extended to the full panel

Stage 7's cost/time driver labels only covered the original test-set rows. Scored the full panel with both standalone models to extend this everywhere: **8,922 schedule-driven, 3,938 mixed, only 175 cost-driven** project-months — consistent with everything found since Stage 3 (cost escalation is a genuinely rare event in this data; schedule slippage is common).

## 3. The queue, and an honest observation about it

Top 10, June 2026 snapshot, ranked by the 50/50 priority score:

| # | Project | Sector | ₹ at stake | Risk | Recommended review |
|---|---|---|---|---|---|
| 1 | Daman Upside Development Project | Oil & Gas | ₹6,407 Cr | 75 | Implementation/milestone |
| 2 | Transmission System, Rajasthan REZ evacuation | Transmission & Distribution | ₹4,741 Cr | 76 | Implementation/milestone |
| 3 | Transmission Scheme, Renewable Energy Integration | Transmission & Distribution | ₹4,445 Cr | 76 | Implementation/milestone |
| 5 | Paradip-Numaligarh Crude Oil Pipeline | Energy Storage | ₹12,407 Cr | 71 | Implementation/milestone |
| 8 | NMDC Slurry Pipeline Phase-1 | Steel | ₹5,427 Cr | 73 | Implementation/milestone |

**Honest observation, worth naming rather than presenting as a coincidence:** every project in the top 10 is schedule-driven, and several are large transmission/energy projects. This isn't a queue-construction artifact — it directly reflects two things already established: cost-overrun events are rare in this data (175 of 13,035 project-months), and Transmission & Distribution ranked as one of the highest average-risk sectors in Stage 9's benchmarking. The queue is internally consistent with the rest of the pipeline's findings, not an isolated result.

**Review-type mapping is deliberately conservative**, matching the original architecture principle: the system recommends a review *focus* (financial/contract vs. implementation/milestone vs. combined), it does not invent a new escalation authority or bypass the real PMG→PRAGATI structure already in use.

## Files

`stage10_priority_queue.csv` — full latest snapshot with priority score, rank, driver, and recommended review type per project. `stage10_driver_lookup.csv` — cost/time probabilities and driver label for every project-month in the panel.

Stage 11 (CUF vs Additional Variables Experiment) next — this one's largely already answered back in Stage 3's ablation, so it should mostly be a clean consolidation rather than new modeling work.
