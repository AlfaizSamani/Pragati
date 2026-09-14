# Stage 8 — Early Warning Engine

## 1. Scored the full live panel, not just the test set

Every eligible project-month (`obs_index≥3`, `dq_flag_any==0`) across all 13 months — **13,035 project-months** — was scored with the final frozen model, this time with the Platt calibrator explicitly saved (`model_and_calibrator_FINAL.joblib`) so it can score new, unlabeled months going forward, which is what a live monitoring system actually needs to do every month.

**One honest observation from the full scoring run, worth knowing before anyone presents it as "portfolio risk is rising":** average risk score jumps from ~21-23 in mid-2025 to ~41-45 from January 2026 onward. This is very likely a **compositional effect, not projects getting riskier** — January 2026 is when Roads & Highways projects (which we already know run ~73% schedule-deterioration rate) first accumulate enough history to enter the scored population after the MoRTH gap. State this as "the monitored portfolio's risk profile shifted as Roads entered scoring," not "projects got worse," if it comes up.

## 2. Momentum — computed correctly, but an honest null result

`risk_momentum` = calendar-correct rate of change in risk score per month (same gap-normalization discipline as everything else in this pipeline — not a raw row-to-row diff).

**I tested whether momentum adds real signal beyond current risk level, and it mostly doesn't, in this simple form.** Bucketing by current score and comparing outcome rates for Rising vs Falling vs Stable momentum:

| Current score band | Rising | Falling | Stable |
|---|---|---|---|
| 0-25 | 8.2% | 10.4% | 2.6% |
| 25-55 | 33.1% | 37.9% | 42.1% |
| 55-80 | 80.2% | 79.8% | 93.6% |

**This is not the clean "rising momentum = worse outcomes" story the original architecture vision expected, and I'm reporting that plainly rather than reshaping the test until it looks better.** The most likely explanation: the risk score itself is already built from trajectory features (progress velocity, revision counts, peer percentile) as model inputs — so a *second*, separate momentum signal computed from the score's own output is largely redundant with information the score already used, and what's left over looks like noise at this sample size. **Practical conclusion: don't present risk momentum as a validated predictive enhancement.** It's still operationally reasonable to keep `rapid_escalation_flag` (601 project-months flagged) as a triage convenience — "show me what's moving fast" is a legitimate thing for a monitoring officer to want to see regardless of whether it improves AUC — but label it as an operational aid, not a proven early-warning signal, if a judge asks.

## 3. The real flagship metric: early-warning lead time, backtested against actual events

This is the one worth leading with. For every project that had a **real, dateable first schedule revision** recorded anywhere in the panel, I checked how many months before that revision the risk score had already crossed the "High" (≥55) threshold.

**337 projects had both a real revision event and a prior High-risk score to check against.**

| | Value |
|---|---|
| Median lead time | **2 months** |
| Mean lead time | 1.99 months |
| Range | 1-7 months |
| Distribution | 1mo: 114 projects · 2mo: 142 · 3mo: 60 · 4mo: 18 · 5mo: 1 · 7mo: 2 |

**Correction, added after a second review caught that the denominator matters here:** 337 is not "out of all projects that got revised" — it's out of the subset that *could* have been caught at all. The full breakdown: of ~1,400 projects with a real revision event, ~960 never had 3+ months of scored history before their revision even happened (too early in their lifecycle to be scoreable — a panel-length limitation, not a model failure), 110 had scored history but the model never reached "High" before the revision (a genuine miss), and 337 were correctly flagged in advance. **The fair catch rate is 337/(337+110) ≈ 75%** among projects where a warning was structurally possible. Report both numbers together: the 2-month median lead time, and the 75% catch rate conditional on scoreability — not the lead time alone, which would overstate real-world coverage if presented without its denominator.

**This is a genuine, backtested answer to "how early does this actually catch problems" — not a projection, a measurement against 337 real projects' real revision events.** "The system flagged elevated risk a median of 2 months before the project's first recorded schedule revision, validated across 337 projects" is a defensible, real sentence for your presentation, and it's the number that most directly answers what the problem statement means by "before such issues materialise."

## Files

`stage8_scored_with_momentum.csv` (full scored panel with risk_score, momentum, tier, escalation flag), `model_and_calibrator_FINAL.joblib` (deployable model bundle for scoring new months).

Stage 9 (Benchmarking) next whenever you're ready.
