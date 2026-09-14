# PAIMANA Sentinel — Stage 2: Feature Engineering (real data, leak-checked)

Built directly on `panel_long_13months.csv` (18,033 project-month rows, 2,650 projects). Output: `feature_table.csv`, 79 columns. Every feature below was computed, not assumed — the numbers quoted are what actually came out of your 13 reports.

## 1. The one rule everything else follows

A feature for `(project, month=t)` may only use information dated `≤ t` for that project, or same-month cross-sectional data from other projects. Targets use `month > t` and live in a separate, clearly-prefixed `target_*` namespace, computed last, after every feature. This is enforced structurally in the code (`shift(+k)` for features, `shift(-k)` only inside `build_targets`), not just by convention — I ran a manual trace on a 13-month project (`612786`... see below) to confirm the running counts and velocities only ever look backward.

## 2. Tier 1 — Point-in-time snapshot features (13 features)

These need no history — one row is enough.

| Feature | What it captures | Why it matters |
|---|---|---|
| `time_elapsed_ratio` | elapsed months since approval ÷ planned duration | The core "how far along *should* this project be" denominator everything else compares against |
| `progress_vs_time_gap` | actual physical progress − expected progress from `time_elapsed_ratio` | The single most direct leading indicator — a project 25 points behind its own timeline is the clearest signal there is |
| `cost_utilization_ratio` / `cost_progress_divergence` | spend rate vs. build rate | Catches the "money moving, concrete not moving" pattern distinct from pure schedule slip |
| `schedule_slip_months_to_date`, `cost_escalation_pct_to_date` | cumulative slip/escalation *as officially recorded* as of month t | Careful: this is deliberately the value **already known and published** at time t — using it to predict a *future* slip is legitimate; using a *later* month's value here would be the leakage bug from the architecture doc |
| `is_overdue_original` / `is_overdue_current` | binary overdue flags against original vs. current-revised deadline | Distinguishes "was always going to be late" from "was fine, now newly late" |
| `has_been_cost_revised` / `has_been_schedule_revised` | has this project ever had an official revision logged | A cheap, strong prior — revision history correlates with more revisions |

## 3. Tier 2 — Trajectory features (require prior months of the same project)

This is the layer that makes this a *trajectory* model rather than a snapshot classifier — the entire reason the Stage 0/1 panel build mattered.

- **`progress_velocity_1m` / `progress_velocity_3m`** — month-over-month and quarter-over-quarter change in physical progress. Real distribution: median 0.0, mean +1.73 pts/month, but with genuine variance (std ≈ 9.8) — most projects barely move most months, a minority move a lot.
- **`progress_accel_1m`** — is the velocity itself slowing down. This is the "deceleration before failure" signal from the original brainstorm, now computed on real numbers instead of a hypothetical.
- **`cost_revision_count_to_date` / `schedule_revision_count_to_date`** — running count of how many times this project's official cost/date has actually changed. Verified end-to-end on project `705507` (13 months): 2 cost revisions logged by month 2, 1 schedule revision logged by month 6, counts correctly hold steady afterward — confirms the cumulative-count logic isn't double-counting or leaking forward.
- **`months_since_last_cost_revision` / `months_since_last_schedule_revision`** — recency of the last change. A project revised 8 months ago and quiet since behaves differently from one revised last month.
- **`obs_index`** — how many months of history this project has *so far*. This isn't a risk signal, it's a **reliability weight**: a trajectory feature computed from 2 months of history is much noisier than one from 12. Use this to downweight or filter low-`obs_index` rows in modeling, not to build risk features from an unstable base.

## 4. Tier 3 — Cross-sectional / cohort features (same-month peers only — no future leakage possible by construction)

- **`sector_peer_progress_percentile`** — where this project sits in physical progress relative to every other project in the *same sector, same reporting month*. Directly implements the "benchmarking" outcome from the problem statement without needing an external dataset.
- **`agency_hist_overdue_rate`** — an agency's historical overdue rate, computed as an **expanding average using only strictly prior months** (`shift(1).expanding().mean()`). This is deliberately conservative: an agency's very first appearance in the panel has no history yet and gets `NaN`, not a default value — a real senior-DS instinct is to let "no data yet" be `NaN`, not silently `0` (which would look like "great track record" for a brand-new agency).
- **`ministry_newly_reporting_flag`** — flags a project whose ministry wasn't present in the *previous* month's report at all. This exists specifically because of the MoRTH gap you already know about (July–November 2025) — it lets a model (or you, manually) exclude the December 2025 re-entry month from being scored as "823 → 1,345 projects suddenly appeared" in a way that would otherwise look like a portfolio-risk event.

## 5. Targets — 3-month and 6-month horizons, three target families each

- `target_schedule_deteriorates_{3,6}m` — does the *current* completion estimate slip further within the horizon
- `target_progress_stalls_{3,6}m` — does physical progress gain less than 5 points within the horizon
- `target_cost_escalates_{3,6}m` — does current cost estimate rise more than 2% within the horizon

**Real base rates at the 6-month horizon (5,536 valid rows — see the caveat in §7 before treating this as "plenty of data"):**
- Schedule deteriorates further: **43.3%**
- Progress stalls (<5pp gain in 6 months): **49.5%**
- Cost escalates >2%: **8.9%**

The cost-escalation target is the one genuinely rare, high-value event — closest to the "catch it before it happens" framing the whole project is built around. The other two are closer to 50/50, which is actually good news for a first model (easier to learn, easier to demonstrate a lift over the naive baseline) but means they're measuring something closer to "normal churn" than "crisis," and your presentation should be honest about that distinction rather than calling every predicted "1" a red alert.

## 6. Data-quality issues found and handled (this matters for your credibility with a MoSPI-affiliated panel)

I did not clean these silently. Every one is flagged, not deleted, so you can decide the policy:

| Flag | Rows affected | Root cause |
|---|---|---|
| `dq_flag_bad_duration` | 36 | Planned duration ≤ 0 months — `doc_original` on/before `approval_date` in the source report (e.g. a metro project listing both dates as 03/2018) |
| `dq_flag_extreme_slip` | 171 | \|schedule slip\| > 10 years. Spot-checked several: some are **real** (Subansiri Lower HE — a well-documented multi-decade-delayed hydro project), some are **source typos** (a coal-mining project with `doc_original = 12/2056`, producing a nonsensical -356 month "slip"). Cannot distinguish automatically — flagged for a human decision at modeling time, not deleted |
| `dq_flag_implausible_utilization` | 56 | Cumulative expenditure > 5x current approved cost while physical progress is well under 100% (one case: ₹89,486 Cr spent against a ₹2,018 Cr project — a 44x ratio). Near-certainly a units/entry error upstream (e.g., lakhs entered where crores were expected), not a real 44x overspend |
| **Total flagged (`dq_flag_any`)** | **260 / 18,033 (1.44%)** | — |

**Recommendation:** exclude `dq_flag_any == 1` rows from initial model training (not from the panel itself — keep them, just don't train on them), and revisit the extreme-slip cases manually before your final presentation; a couple of those (Subansiri Lower especially) may be worth keeping in as genuinely instructive examples of real multi-decade project risk, which is a good story to tell a judging panel, as long as you can say confidently which ones are real.

## 7. The caveat a careful reviewer will ask about, so get ahead of it

**5,536 "valid" 6-month-horizon rows is not 5,536 independent observations.** With only 13 months of panel and a 6-month horizon, each project contributes at most 7 overlapping windows (month 1→7, month 2→8, ... month 7→13), and consecutive windows for the same project are highly autocorrelated — a project that's stalling in month 3 is very likely still stalling in month 4's window too. This is **pseudo-replication**, and it matters concretely: your **train/validation split must be grouped by `canonical_id`**, exactly as flagged in the architecture doc, or you will get a validation score that looks great and means much less than it appears to, because the model is effectively being tested on near-duplicate windows of projects it already saw. When you report metrics, report them per-project as well as per-row where you can (e.g. "correctly flagged the eventual outcome for X% of projects," not just "X% of project-months"), since that's the number that will actually hold up under a skeptical judge's question.

## 8. What's next

Stage 2 is done and grounded in real numbers. The natural next step is **Stage 3: a first model** — a leak-checked, group-aware, calibrated gradient-boosting classifier on `target_progress_stalls_6m` or `target_cost_escalates_6m` (the more interesting minority-class target), benchmarked against the naive baseline (sector-average rate) exactly as the problem statement's dimension (b) asks. I'd suggest `target_cost_escalates_6m` as the headline model — it's rarer, harder, and closer to what "early warning" actually means — with the schedule/progress targets as supporting evidence. Say the word and I'll build and evaluate it against this exact feature table.
