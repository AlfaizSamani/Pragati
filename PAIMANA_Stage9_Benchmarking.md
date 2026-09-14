# Stage 9 — Benchmarking & Comparative Analytics

## 1. Cohort granularity — tested, and the obvious design was too fine

The natural instinct (sector × cost-quartile × age-quartile, matching similar-sized, similar-age projects) was tested first and **rejected on the evidence**: median cohort size was just 2 projects, and 75% of cohorts had fewer than 5 peers. A percentile rank against 1-2 other projects isn't a real benchmark — it's noise dressed up as a statistic.

**Adaptive design used instead**: sector × cost-band (median split — Lower-cost half / Higher-cost half within each sector), with **automatic fallback to sector-only comparison whenever the tighter cohort has under 5 peers in that month.** Result: median cohort size **117**, only **1.8% of rows fall back** to the coarser sector-level comparison. This is the honest granularity this dataset actually supports — tight enough to mean something, coarse enough to be statistically real.

## 2. Two percentiles per project, same direction convention (higher = better/safer)

- **`peer_progress_percentile`** — how far along vs. cohort peers at the same reporting month.
- **`peer_risk_percentile`** — how safe vs. cohort peers (higher = safer than peers, lower = riskier than peers — same "higher is better" direction as progress, so the two numbers read consistently side by side).

## 3. Real worked examples (June 2026 snapshot)

| Project | Cohort (n) | Progress percentile | Risk percentile |
|---|---|---|---|
| Additional Transmission System, Power evacuation | Transmission & Distribution, Lower-cost half (n=33) | 88th (ahead of peers) | **3rd (far riskier than peers despite good progress)** |
| 4-lane road widening project | Roads & Highways, Higher-cost half (n=510) | 61st | 0th (riskiest in a 510-peer cohort) |
| Silchar-Dhanehari road section | Roads & Highways, Higher-cost half (n=510) | 38th | 0th |

**The Transmission project is the interesting case worth pointing out in a demo**: 88th percentile on progress but 3rd percentile on safety — ahead of schedule, yet flagged as far riskier than comparable peers, almost certainly a cost-driven signal (per Stage 7's driver attribution) rather than a schedule one. This is exactly the kind of thing a raw progress number would hide and the benchmarking + driver combination catches.

## 4. Portfolio-level sector ranking (also a real dashboard output, not just per-project)

June 2026 snapshot, average risk score by sector:

| Sector | Avg risk score | n |
|---|---|---|
| Waste & Water | 60.0 | 23 |
| Transmission & Distribution | 48.1 | 64 |
| Aviation & Aviation Infrastructure | 47.1 | 25 |
| Roads & Highways | 46.2 | **986** |
| Oil & Gas | 33.3 | 88 |
| Healthcare | 31.4 | 32 |

Roads & Highways' 46.2 average, backed by 986 projects, is a real, trustworthy portfolio-level number now — worth remembering given Stage 1's finding that this sector was completely invisible in the original data pull. Sectors with n=1 (e.g., Tourism, Inland Waterways) are shown for completeness but shouldn't be presented as reliable averages — flag or exclude single-project sectors in the dashboard rather than implying a trend from one data point.

## Files

`stage9_benchmarked.csv` — full panel with cohort assignment, cohort size, fallback flag, and both percentiles per project-month.

Stage 10 (Intervention Prioritization) next whenever you're ready.
