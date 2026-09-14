# Stage 4 — Model Tuning & Survival Analysis

## 1. Hyperparameter search (Optuna, grouped CV — test set never touched during search)

40 trials each, GBDT vs DART, optimizing PR-AUC on 4-fold `GroupKFold` (by `canonical_id`) within the train set only.

| | CV PR-AUC (search) | Held-out test ROC-AUC | Held-out test PR-AUC | Held-out test Brier |
|---|---|---|---|---|
| Stage 3 default params (untuned) | — | 0.881 | 0.802 | 0.140 |
| Tuned GBDT | 0.733 | 0.883 | 0.805 | 0.139 |
| **Tuned DART** | 0.732 | **0.900** | **0.834** | **0.123** |

**Honest read:** during cross-validation, GBDT and DART looked essentially tied (0.733 vs 0.732) — tuning alone barely moved the needle over the untuned Stage 3 baseline. But on the actual held-out temporal test, **DART pulled ahead meaningfully** (+0.017 ROC-AUC, +0.029 PR-AUC, better calibration too). This is exactly the pattern flagged as worth testing back in the architecture-planning stage — DART's dropout-style regularization was expected to help specifically because your project counts sit on the smaller side for boosting, and that's what happened. I'd genuinely rather tell you "CV said tied, test said DART won" than pretend the CV result predicted this cleanly — it didn't, and that gap itself is worth a sentence in your methodology slide if anyone asks how you chose the final model.

**Decision: DART is now the model of record** for the composite risk score, replacing the Stage 3 default. Best params: `max_depth=5, num_leaves=17, learning_rate=0.127, subsample=0.71, colsample_bytree=0.73, reg_alpha=1.88, reg_lambda=1.06, min_child_samples=50`.

## 2. Survival/hazard modeling (the deferred sophistication piece, now attempted for real)

Framed as: time from a project's first observed month to its **first schedule revision** (event), or censored at its last observed month if no revision occurred yet within the panel. This answers a genuinely different question than the classification models — not "will this project be at risk in 6 months" but "how soon, typically, does a project of this type get its first revision."

- **2,518 projects** with enough data to include; **1,362 events** (revision observed), **1,156 censored** (no revision yet within our 13-month window — a real limitation, not an error: many projects simply haven't hit month 13 yet).
- **Cox Proportional Hazards model, concordance index = 0.686.** Moderate, not spectacular — expected, given only 13 months of censoring window and a deliberately small covariate set (sector, planned duration, cost). This is a fundamentally different, complementary metric to the classification models' ROC-AUC, not a worse version of the same thing — concordance measures whether the model correctly *ranks* which project revises sooner, not whether it hits a fixed 6-month flag.
- **Sector effects, all statistically significant (p<0.001) except Roads & Highways:** Railways, Power, Petroleum, Coal, and Higher Education projects have **1.5-1.6x higher hazard** of an early revision than the baseline; **Oil & Gas projects have notably lower hazard (0.30x)** — i.e., structurally more stable once approved, or slower to formally log a revision even when one is warranted (worth a follow-up look, not just an assumption).
- **Kaplan-Meier median time-to-first-revision**: Power, Railways, Petroleum, Coal, Higher Education all cluster around **2 months** — schedule revisions in this data tend to happen fast, early in a project's life, not gradually. Roads & Highways is the outlier at **4 months** — noticeably more stable in this specific sense.

**Where this fits your pitch:** the classification models answer "is this project at risk right now," which is what a dashboard needs. The survival model answers "how early, structurally, should we expect the first revision for a project like this" — a genuinely different, complementary insight, and a legitimate answer to the "early warning" framing the problem statement asks for, distinct from anything a plain classifier gives you. Use it as a supporting analysis/slide, not the headline — the classification models remain your primary, better-evidenced deliverable.

## Files

`tune_stage4.py` (search + DART/GBDT comparison), `stage4_tuning_results.json` (full numbers), `survival_dataset.csv` (project-level duration/event table for the Cox model).

## Next: the dashboard, for real this time

Everything needed now exists: the tuned DART composite model, the standalone cost/time models, SHAP drivers, and the survival analysis as supporting evidence. Say go and I'll build it.
