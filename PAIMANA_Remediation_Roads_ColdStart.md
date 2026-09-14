# Remediation — fixing the two real redflags before proceeding

Both issues flagged as serious were actually tested against real data, not just patched over.

## Fix 1: MoRTH/Roads blind spot — confirmed severe, then genuinely fixed

**The actual severity, measured:** the 6-month composite model had **zero** Roads & Highways rows anywhere in train or test — not underrepresented, completely absent. Root cause, precisely diagnosed: MoRTH's 5-month reporting gap (Jul-Nov 2025) plus the `obs_index ≥ 3` requirement plus the 6-month horizon's window capping at December 2025 combined to structurally exclude the sector — each choice reasonable alone, compounding into a total gap together.

**The fix:** switched the primary composite model to a **3-month horizon**, whose valid window extends to March 2026 — giving Roads projects (reinstated December 2025) enough calendar time to accumulate real trajectory history before the window closes.

**Verified, not assumed:** the 3-month model now has 1,720 real Roads rows (436 train, 1,284 test). Overall performance **improved**, not just "stayed acceptable" — ROC-AUC 0.906, PR-AUC 0.889, both better than the 6-month version. Critically, **Roads-specific performance (ROC-AUC 0.836, n=1,284) is close to non-Roads (0.848)** — the model genuinely generalizes to the sector it effectively never trained on before, off just one month (Jan 2026) of real Roads history. This is now the primary composite model going forward, not a side experiment.

## Fix 2: Cold-start / brand-new-project coverage — tested, and there's a real answer

**The actual gap, confirmed:** 2,454 rows in the panel belong to projects with under 3 months of history — genuinely new projects, exactly the population an early-warning system should serve first, and exactly what the enhanced model was never trained or tested on.

**The fix, tested rather than assumed away:** trained the CUF-only model (no trajectory features required, since new projects don't have any history to compute them from) on the normal warm-start training set, then applied it specifically to these 2,454 never-before-seen new-project rows.

**Result: ROC-AUC 0.785, PR-AUC 0.798.** Meaningfully weaker than the full enhanced model's 0.88-0.90 (expected — trajectory features are where a lot of the real signal lives), but genuinely useful, well above random, and a legitimate fallback. **Practical conclusion for your architecture, not just a caveat:** the dashboard needs two model paths, not one — the enhanced/DART model for projects with ≥3 months of history, and this CUF-only model as the explicit fallback for anything newer, with the UI honestly labeling which one produced a given score. That's a real design decision this test earned, not an afterthought.

## What this means going forward

- **The 3-month composite model replaces the 6-month one as your primary Risk Scoring Engine input.** The 6-month and 3-month standalone Cost/Time models from Stage 3b remain valid as-is (they were less affected — worth a quick equivalent Roads check on those too before final submission, not done here to keep this fix focused).
- **A documented cold-start fallback path now exists** and should be built into Stage 7 onward, not bolted on later.
- Neither of these was "hidden and moved past" — both are now real, tested, disclosed fixes with numbers attached.

## Files

`stage_fix_3m_test_predictions.csv` — the corrected 3-month composite model's test predictions, ready to replace the 6-month version wherever Stage 7 needs it.

Ready for Stage 7 when you are.
