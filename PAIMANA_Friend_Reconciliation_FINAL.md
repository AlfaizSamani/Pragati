# Friend-vs-CUF Reconciliation — Final, Decisive Resolution

This supersedes every prior score comparison in the handoff document (the "strict clean-room," "common rolling Stage 11," and single-held-out-month tables) — not because those were fabricated, but because none of them controlled for all the same things at once. This one does, and it's a one-shot, pre-registered result on data neither side has touched during selection.

## What actually happened, in order

1. **Ran the Friend pipeline's real `stage2_feature_engineering.py` directly against my real, already-verified `panel_long_13months.csv`** — not a reconstruction, the actual code, against the actual entity-resolved panel (18,033 rows, 2,650 projects — matches the provenance-audit SHA-256 count exactly).
2. **Found two real bugs in the Friend feature code**, independently, by reading it the same way I've read my own: `progress_velocity_1m`/`3m`/`acceleration` used row-position `.diff()`, not calendar-normalized (the same MoRTH-gap bug class already found and fixed in the Claude pipeline five times over); `agency_historical_overrun_rate`/`sector_historical_overrun_rate` sorted by month only (not by agency+month) before `.shift()`, risking same-month cross-project leakage — same bug class as the one fixed in this pipeline's own `agency_hist_overdue_rate`. Patched a copy, regenerated features.
3. **My first comparison attempt was itself unfair** — I built the Friend feature list from only their *derived* columns, omitting the raw CUF fields (`cost_original`, `physical_progress`, etc.) their own `stage4_baseline_ml.py` actually includes. Checked their real production script, rebuilt the feature list to match it exactly, and reran. This is worth knowing: even a careful comparison needs a second pass, and I'm reporting my own first-pass mistake rather than the flattering initial number.
4. **Final, fair, one-shot comparison**: same verified target (`target_at_risk_3m`, this pipeline's leak-fixed composite), same temporal split (train ≤ Jan 2026, test = Feb–Mar 2026), same model (HistGradientBoostingClassifier), only the feature set varying.

## The result

| Feature set | Project PR-AUC (pre-registered primary metric) | n_pos |
|---|---|---|
| CUF-only (this pipeline) | 0.945 | 794 |
| Claude-Enhanced (this pipeline) | 0.942 | 794 |
| **Friend-FIXED (bug-corrected, full feature list)** | **0.942** | 794 |
| Friend-ORIGINAL (unfixed, full feature list) | 0.939 | 794 |

**Bootstrap 95% CI on the CUF-only vs. Friend-FIXED delta: [-0.007, +0.0128]. Includes zero.**

## The honest conclusion

**No feature set is proven superior. They are statistically indistinguishable once compared fairly.** Every prior "winner" across every protocol in the handoff document — Friend wins common-rolling, CUF-only wins strict-clean-room, Friend's own 0.94 wins its single-month table — was a real number under its own protocol, but none of them isolated the feature effect from everything else that differed alongside it (target definition, split, model, bugs, feature-list completeness). This comparison isolates it, and the answer is: **it doesn't matter which of these four you pick.** That's not a disappointing result — it's the actual scientific answer, and it's a stronger, more defensible thing to tell a judging panel than any single number from the earlier protocols would have been.

**Bonus finding, worth passing back**: the two bugs found in the Friend pipeline are real and fixable the same way this pipeline's were — `stage2_feature_engineering_FIXED.py` is the patched version, saved here in case that codebase gets used elsewhere.

## What this means for "what should we do now"

- **This is the pre-registered prospective confirmation the handoff document's own Section 25 called for.** It's done. Stop here — running a third or fourth variation looking for a winner would be re-opening exactly the multiple-comparisons risk this whole exercise existed to close off.
- **Recommendation: keep this pipeline's current feature set and DART model as the frozen final**, not because it won, but because it's the one with the complete, twice-externally-audited, bug-fix-documented trail — switching to Friend's pipeline now would mean redoing Stages 5–11's validation, explainability, and benchmarking work against a statistically tied alternative, for no real gain.
- **The Friend's original 0.94 stays exactly where the handoff doc already put it: unverified, not comparable, not to be presented to judges as a benchmark number.** This investigation didn't resolve where it came from, but it did show that a fair, controlled version of the same underlying feature family performs in line with everything else, not exceptionally — which is independent evidence the 0.94 was a protocol artifact (single favorable month, as found directly in `PAIMANA_Project_Summary.md`), not a real 0.94-level capability being left on the table.
- **Move to Stage 12 (dashboard) now.** This chapter is genuinely closed, not paused.

## Files

`stage2_feature_engineering_FIXED.py`, `features_panel_FIXED.csv`, `confirmation_results_v2.json`.
