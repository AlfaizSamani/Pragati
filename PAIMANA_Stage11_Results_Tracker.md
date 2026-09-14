# Stage 11 Follow-Up — Results Tracker

Locked baseline for reference (Tier1 vs Tier1+2, row-level / project-level):
- **Tier1 (CUF-only)**: ROC 0.903 / PR 0.876 row · ROC 0.922 / PR 0.922 project
- **Tier1+2 (+trajectory)**: ROC 0.899 / PR 0.874 row · ROC 0.920 / PR 0.924 project
- **Tier1+2+3 (full Enhanced)**: ROC 0.905 / PR 0.889 row · ROC 0.923 / PR 0.930 project

## PRE-REGISTERED — locked before any Stage A result is read, not edited afterward

- **Primary metric deciding everything**: **project-level PR-AUC**. Everything else (row-level, ROC-AUC) is supporting context only.
- **Promotion bar for any Stage A candidate to earn a Stage B holdout run**: bootstrap 95% CI (training folds) on project-level PR-AUC excludes zero improvement over Tier1-only, **and** beats current Tier1+2's 0.924 on those same folds.
- **Promotion bar for a Stage B candidate to actually change the locked pipeline**: the above, **plus** it still beats both Tier1-only and current-Tier1+2 on project-level PR-AUC on the **single, one-shot** Feb–Mar 2026 holdout run.
- **Holdout budget**: at most 1–3 candidates ever touch Feb–Mar 2026, each exactly once. If a candidate fails at that stage, that's the answer — no retry with a tweaked version.

---

## STAGE A — exploratory only. Nothing below this line is a conclusion by itself; it's a filter for what's worth a Stage B run.

Fill in below as each experiment finishes. Leave blank if not run yet. Paste this whole thing back when ready — don't need to reformat anything.

### Exp 1 — Is the delta real? (run this one first, it gates the rest)
- Fold-level deltas (4 folds): ____
- Mean / std of fold deltas: ____
- Bootstrap 95% CI on test-set delta: ____
- Does zero fall inside the CI? Y / N: ____

### Exp 2 — Per-tier hyperparameter retuning
- Tuned Tier1+2 params found: ____
- New Tier1+2 result (row ROC/PR, project ROC/PR): ____
- Moved vs original 0.899/0.874? ____

### Exp 3 — Missingness encoding check
- NaN confirmed end-to-end, or found an imputation bug? ____
- If bug found + fixed, new Tier1+2 result: ____

### Exp 4 — Alternative feature formulations
| Variant | Row ROC/PR | Project ROC/PR | n_pos | Meets promotion bar (1)+(2)? |
|---|---|---|---|---|
| 4a Trend slope | | | | |
| 4b Categorical direction | | | | |
| 4c Interaction (velocity × overdue) | | | | |

### Exp 5 — Permutation importance (Tier2 features only)
| Feature | Mean importance | Std | CI includes zero? |
|---|---|---|---|
| progress_velocity_1m | | | |
| progress_velocity_3m | | | |
| progress_accel_1m | | | |
| expenditure_velocity_1m | | | |
| cost_revision_count_to_date | | | |
| schedule_revision_count_to_date | | | |
| months_since_last_cost_revision | | | |
| months_since_last_schedule_revision | | | |
| stall_streak_months | | | |

### Exp 6 — Linear baseline on Tier2-only
- LogisticRegression ROC/PR: ____
- Null baseline ROC/PR: ____
- Real gap over null? ____

### Exp 7 — Monotonic constraints (only if 1-6 stayed ambiguous)
- Constrained vs unconstrained (row ROC/PR, project ROC/PR): ____

---

### Your one-line read, per experiment (optional but useful)
Exp 1: ____
Exp 2: ____
Exp 3: ____
Exp 4: ____
Exp 5: ____
Exp 6: ____
Exp 7: ____

---

## STAGE B — confirmatory. Fill in ONLY after Stage A candidates are selected against the promotion bar above. Each row here should represent a holdout run that has not happened before.

| Candidate | Project PR-AUC on Feb–Mar holdout | Beats Tier1-only (0.922)? | Beats Tier1+2 (0.924)? | Verdict |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

**Final Stage 11 conclusion** (only written after Stage B, not before): ____
