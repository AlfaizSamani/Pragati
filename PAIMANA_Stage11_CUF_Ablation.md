# Stage 11 — CUF vs Additional Variables Experiment

This directly answers PS technical dimension (c): *"the extent to which predictive performance is attributable to current CUF fields vis-à-vis additional variables not presently captured."* Re-run on the final, fully bug-fixed 3-month composite pipeline (post Stage-consolidation fixes) so this number is consistent with everything else now locked in.

## Three-tier ablation, not just two

| Feature tier | # features | Row ROC-AUC | Row PR-AUC | Project ROC-AUC | Project PR-AUC |
|---|---|---|---|---|---|
| **Tier 1 — CUF-only** (raw/derived-from-CUF fields: cost, dates, progress, sector, ministry) | 17 | 0.903 | 0.876 | 0.922 | 0.922 |
| **Tier 1+2 — + trajectory** (velocity, acceleration, revision counts/recency, stall streak) | 28 | **0.899** | **0.874** | 0.920 | 0.924 |
| **Tier 1+2+3 — full Enhanced** (+ sector peer percentile, agency history, ministry-gap flag) | 34 | 0.905 | 0.889 | 0.923 | 0.930 |

## The honest, non-obvious finding

**Adding trajectory features alone (Tier 2) doesn't help — it very slightly hurts.** Row ROC-AUC drops from 0.903 to 0.899, PR-AUC from 0.876 to 0.874. This isn't noise-chasing avoidance talking; it's the actual number, and it's worth sitting with rather than smoothing over. Only when **peer/historical context (Tier 3)** is added on top does performance recover and edge past the CUF-only baseline — and even then, the total gain over CUF-only alone is modest: **+0.2 points ROC-AUC, +1.3 points PR-AUC** at the row level.

**What this means, stated plainly:** the current CUF fields already capture the large majority of achievable predictive signal for this problem. Trajectory-derived features (how fast is progress moving, how many revisions so far) don't reliably add value *on their own* — plausibly because, on a dataset this size, they add model complexity and potential overfitting surface without enough independent signal to earn it back. The real, if modest, gain comes specifically from **peer-comparison and agency-history context** — information that isn't in any single month's CUF submission at all, but requires the kind of longitudinal, cross-project database that OCMS/PAIMANA's multi-year history uniquely provides.

## The direct, MoSPI-relevant recommendation this supports

If dimension (c) is really asking "should CUF be expanded," the honest answer from this data is **not simply "add more monthly fields."** The evidence points somewhere more specific: **the value isn't in more granular per-project monthly detail, it's in systematic peer-benchmarking and agency-track-record infrastructure** — exactly the kind of cross-project historical continuity that a modernized, well-integrated PAIMANA (rather than CUF form fields themselves) is positioned to provide. This is a more precise, evidence-backed version of the "what should the next CUF capture" question the very first architecture discussion raised speculatively — now it has a real answer, not a guess.

## Consistency check

The full-Enhanced row (0.905/0.889, project 0.923/0.930) matches the currently locked final model numbers exactly, confirming this ablation was run against the same final pipeline as everything else, not a stale or divergent version.

## Files

`stage11_ablation_results.json`.

That's Stages 0-11 complete. Stage 12 (Dashboard) is next — the first stage where all of this analytical work actually becomes something a judge can see and click through, rather than a document.
