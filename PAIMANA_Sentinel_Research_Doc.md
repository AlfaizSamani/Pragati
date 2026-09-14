# PAIMANA Sentinel — Research & Architecture Document
**SIH 2026, Problem Statement 26103 (MoSPI / IPMD)**
Compiled from: official PIB/MoSPI/DPIIT sources, direct inspection of the uploaded June 2025 (OCMS) and November 2025 (PAIMANA) Flash Reports, and current ML/survival-analysis literature.

---

## 0. How to use this document

Every claim below is tagged so you know how much weight to put on it:
- **[VERIFIED]** — confirmed against a live PIB/MoSPI/DPIIT source or by directly parsing your uploaded PDFs.
- **[LITERATURE]** — established ML/stats practice, cited from research or standard docs, not specific to PAIMANA.
- **[DESIGN CHOICE]** — a recommendation, not a fact. You can disagree.
- **[OPEN QUESTION]** — genuinely unresolved; needs a decision from your team before you build.

---

## 1. Data Reality Check — what you actually have

### 1.1 What the two reports are

| | June 2025 (`FR_JUNE_2025.pdf`) | November 2025 (`FlashReport_November_2025.pdf`) |
|---|---|---|
| Source system | **OCMS** (`cspm.gov.in`) — the pre-PAIMANA legacy portal **[VERIFIED, p.2 of PDF]** | **PAIMANA** (`ipm.mospi.gov.in`) — the new portal, live since 25 Sept 2025 **[VERIFIED]** |
| Total ongoing projects | 1,595 **[VERIFIED, Table 1 total]** | 823 **[VERIFIED, cover page]** |
| Project ID format | Alphanumeric: `N24002239`, `N04000073` **[VERIFIED]** | Numeric only: `612786`, `701107` **[VERIFIED]** |
| Cost/date field structure | Triple: Original / Revised / **Anticipated** **[VERIFIED]** | Double: Original / Revised only **[VERIFIED]** |
| Ministry coverage | All ministries including MoRTH (923 of 1,595 projects — 58% of the portfolio) **[VERIFIED]** | **MoRTH explicitly excluded**, "may reflect from next month onwards" **[VERIFIED, p.1]** |
| Main granular table | Table 7, pp. 37–225, one row per project | Table 6 ("All Ongoing Projects"), similar structure but different columns |

### 1.2 The two things that change your build plan

**(a) No shared primary key across months.** The June→November project-code scheme change means a naive panel build (`GROUP BY project_code`) will fail silently. You need an **entity-resolution step**: fuzzy-match on `(project_name, agency, state, approval_date, cost_original)` similarity before you can call two rows "the same project." This is real, standard, solvable engineering — not a blocker — but it must be step 1 of your pipeline, not an afterthought.

**(b) The panel has structural, not random, missingness.** MoRTH's absence from November isn't noise — it's a known, documented reporting gap for your single largest sector. **[DESIGN CHOICE]** Track a `ministry_reporting_status` flag per report-month. When you eventually pull more months, some ministries may have gaps, corrections, or backfills. Never assume "project missing this month" means "project stalled" — it might just mean "ministry didn't report this month." Conflating the two would poison your risk labels.

### 1.3 What you should actually request/verify before committing further design time

**[OPEN QUESTION]** — you told me 13 months of reports exist (June 2025 → July 2026). Given what we just found between only *two* adjacent-ish months, you should expect:
- Ministry inclusion/exclusion may change more than once across 13 months (not just the MoRTH gap).
- The ID scheme may have changed exactly once (OCMS→PAIMANA cutover, ~Sept 2025) or could still be in flux — check a report from Sept/Oct 2025 specifically, since that's the transition month and probably the messiest one.
- Column layout appears to differ release-to-release (as seen even between these two) — build your parser to key off header text, not fixed positions, from day one.

---

## 2. Proposed Architecture (scoped for real build time, not a wishlist)

**[DESIGN CHOICE]** The multi-layer, 8-outcome architecture from your earlier ChatGPT conversation is directionally right but too large for a hackathon. Cut scope like this:

```
STAGE 0 — Entity Resolution
   June codes ─┐
   Nov codes  ─┼──► fuzzy match (name+agency+state+cost) ──► canonical_project_id
   (future months) ┘

STAGE 1 — Point-in-Time Panel Build
   Per report-month PDF ──► pdfplumber table extraction ──► one row per
   (canonical_project_id, report_month) with as-of values only

STAGE 2 — Feature Engineering
   Tier 1 (CUF-native, as-of-report-month):
     original_cost, revised_cost_so_far, elapsed_months_since_approval,
     physical_progress, progress_velocity (Δ vs prior month),
     cost_utilization_ratio (expenditure / revised_cost)
   Tier 2 (derived):
     sector_peer_percentile, agency_historical_overrun_rate,
     ministry_reporting_gap_flag

STAGE 3 — ONE target, ONE horizon (pick one to start)
   e.g. "will physical-progress-vs-time-elapsed gap exceed 20pp
   within 6 months?" — binary, well-defined, checkable against
   your actual panel once you have ≥4-5 months of real data

STAGE 4 — Model + calibration + explainability
   Gradient boosting baseline + naive statistical baseline
   (report the delta — this alone satisfies PS dimension (b))
   SHAP for driver attribution, calibration curve for trust

STAGE 5 — Minimal dashboard
   One risk-ranked project list + one project detail view
   + one "statistical vs ML" comparison view
```

Everything else (hazard/survival models, LLM copilot, benchmarking cohorts, multi-horizon forecasts) is **Phase 2 / roadmap slide**, not Phase 1 build target. Judges reward one real, honestly-evaluated pipeline over eight half-built ones.

---

## 3. Feature Engineering & Leakage Prevention

### 3.1 The point-in-time rule **[LITERATURE + VERIFIED against your data]**

Because June's cost field carries `Original (Revised) {Anticipated}` and November's carries only `Original (Revised)`, you must decide, explicitly, per report-month: **which of these values were "final" as of that month's publish date, and which might still change?** Treat every value as timestamped by its report month. Never let a later month's `Revised` cost leak into an earlier month's feature set — this is the textbook target-leakage bug in cost/time-overrun prediction research, and it's explicitly called out in recent systematic reviews of AI/ML for construction cost-overrun forecasting.

### 3.2 Splitting strategy — this is where most student projects silently cheat

**[LITERATURE, verified via multiple independent ML-methodology sources]** Panel data (same project, multiple months) has two leakage risks, and you need to guard against both simultaneously:

1. **Entity leakage** — if the same `canonical_project_id` appears in both train and test (just at different months), the model can partly memorize that project rather than learn generalizable risk patterns. Fix: `GroupKFold` / `GroupShuffleSplit` keyed on `canonical_project_id` (scikit-learn).
2. **Temporal leakage** — if you validate on earlier months using a model that "knows" later trends. Fix: chronological / rolling-origin splits (`TimeSeriesSplit` or a custom rolling backtest), never a random shuffle across months.

**[DESIGN CHOICE]** For your scope, the safest combination is a **rolling-origin, group-aware split**: train on projects' data up to month M, validate on the same and new projects' data in month M+1 through M+3, never let a training fold see any row from after its validation fold's month. A recent methodological paper on ML misuse with panel data (arXiv 2411.09218) lays out exactly this failure taxonomy — cite it if you want a slide that shows you know the pitfall by name, not just informally.

### 3.3 Class imbalance

Overrun/delay events are the minority class. **[LITERATURE]** Don't oversample blindly (SMOTE on tabular government data with mixed categorical/numeric fields is fragile and can manufacture unrealistic project profiles). Prefer: class-weighted loss (`scale_pos_weight` in XGBoost/LightGBM, `class_weight='balanced'` in scikit-learn), and evaluate with **PR-AUC and recall at fixed precision**, not accuracy — accuracy is meaningless when ~85-90% of projects are "on track" in any given month.

---

## 4. Model Selection — grounded in what actually works on small/medium tabular data

### 4.1 Why gradient boosting is still the right default **[LITERATURE — strongly, consistently supported]**

Across Kaggle-scale benchmarks and multiple 2025-2026 papers, **gradient-boosted decision trees (XGBoost / LightGBM / CatBoost) remain the dominant, most robust choice for tabular data**, including small-to-medium sized datasets — the exact regime you're in (hundreds to low thousands of projects, a few dozen to ~100 features). Deep learning on tabular data (TabNet, NODE, FT-Transformer, Hopular) has closed some of the gap in research settings, but consistently underperforms or ties GBDTs below roughly 10K rows, and is much harder to defend, tune, and explain to a non-ML judging panel in a short demo. **[DESIGN CHOICE] Don't build a neural network for the core cost/time model.** It buys you nothing at your data scale and costs you explainability, tuning time, and risk of overfitting.

**Specific overfitting controls, in priority order [LITERATURE]:**
1. **Early stopping** on a held-out (group-aware) validation fold — stop boosting rounds when validation loss stops improving. This is the single most effective, cheapest control.
2. **Depth/leaf constraints** — `max_depth` 3-6, `num_leaves` capped; shallow trees generalize far better than deep ones on small data.
3. **L1/L2 regularization** (`reg_alpha`, `reg_lambda`) and **subsampling** (`subsample`, `colsample_bytree` < 1.0) — inject randomness so the ensemble doesn't overfit noisy government-reporting quirks.
4. **DART mode** (Dropout meets Additive Regression Trees, available in both XGBoost and LightGBM) — randomly drops trees during training, specifically designed to combat overfitting in boosting when data is limited; worth a direct A/B against standard boosting on your dataset since your project count is on the smaller side for GBDTs.
5. Always compare against **a genuinely naive baseline** (e.g., "sector-average historical overrun rate" or plain logistic regression) — this is literally what PS dimension (b) asks you to report, and it also functions as your underfitting sanity check: if your GBDT can't beat the naive baseline, something in your feature engineering or leakage guarding is broken, not exotic.

### 4.2 Time-to-event modeling (for the "when," not just "if")

If you do attempt the time-overrun-horizon model, **[LITERATURE]** the right tool family is survival/hazard analysis, not repeated binary classification:
- **`lifelines`** (pure Python, easiest to learn, Cox Proportional Hazards + Kaplan-Meier, good for a first pass and for producing intuitive survival curves for your dashboard).
- **`scikit-survival`** — scikit-learn-API-compatible, includes Random Survival Forests and Gradient Boosted survival models, concordance-index and time-dependent AUC/Brier score for evaluation — better if you want your survival model to sit inside a normal sklearn pipeline alongside your GBDT classifiers.
- **`PyDTS`** — a newer, specifically **discrete-time** survival package with **competing-risks** support. This is a strong fit if you frame "cost overrun" and "schedule overrun" as *competing* event types for the same project (a project can "fail" via either route) — genuinely more correct than treating them as two independent binary problems, and it would be a distinctive, defensible modeling choice most competing teams won't attempt.

**[DESIGN CHOICE]** Given hackathon time constraints, a pragmatic fallback if survival modeling proves too slow to implement correctly: three independent GBDT binary classifiers at fixed horizons (3/6/12 months), each evaluated with PR-AUC and calibration. Less elegant, much faster to ship, still answers the "how early" question adequately for a demo.

### 4.3 Calibration — don't skip this, it's cheap and it's exactly what "don't hallucinate confidence" means for a tabular model

**[LITERATURE, well-established]** A raw GBDT's predicted probability is often not a true probability — an 80% score doesn't necessarily mean 80% of such projects actually overrun. Fix with post-hoc calibration:
- **Platt scaling** (sigmoid fit via logistic regression on held-out scores) — best when you have a smaller calibration set, low overfitting risk, works well when the miscalibration is roughly sigmoid-shaped.
- **Isotonic regression** — more flexible (fits any monotonic correction), but needs more calibration data to avoid overfitting; with your project counts (low thousands at most), lean toward **Platt scaling as the safer default**, and only try isotonic if you have enough held-out rows (some practitioners suggest 1,000+ calibration examples for isotonic to be reliable) — you likely won't hit that with a MoRTH-sized ministry alone, but may across the full portfolio.
- Use `sklearn.calibration.CalibratedClassifierCV` with `cv` set to your group-aware splitter, method=`'sigmoid'` (Platt) as your default, and report a **reliability diagram** — this is a great, cheap, visually convincing addition to your "Model Laboratory" slide, and it directly demonstrates you're not just reporting a hallucinated confidence number.

### 4.4 Explainability

SHAP (`TreeSHAP`, fast and exact for GBDTs) remains the right tool. **[DESIGN CHOICE, restated from earlier]** Label outputs "top predictive signals," never "causes" — SHAP values quantify a trained model's feature attribution, not a causal claim, and a MoSPI-affiliated judging panel is more likely than most to catch a causal overclaim.

---

## 5. Embeddings & LLM Copilot Stack (Phase 2 — build only after Stage 0-5 above work)

**[LITERATURE, current as of 2026]** If/when you get to the LLM copilot layer:

| Component | Recommendation | Why |
|---|---|---|
| Embedding model (light, CPU-friendly) | `all-MiniLM-L6-v2` (sentence-transformers) | Tiny, fast, the standard "good enough" default for RAG prototypes; runs on a laptop CPU |
| Embedding model (if GPU available, better quality) | **BGE-M3** (568M params) | Does dense + sparse (BM25-style) + multi-vector retrieval in one model, Apache 2.0, strong open-source default for local RAG in 2026 |
| Vector store | **FAISS** (local, no server) or **Chroma** (also local, simpler API) | Both are open-source, no external dependency, appropriate for a project-count-in-the-thousands corpus |
| Local LLM runtime | **Ollama** running an open-weight instruction model (e.g., a Llama or Mistral class model) | No API cost/dependency, satisfies the PS's "open-source tools" preference, keeps you demo-safe without internet |
| Retrieval pattern | **Tool-calling / structured retrieval, not naive RAG-over-PDF-text** | The copilot should query your **structured risk database** (project rows + model outputs), not re-embed PDF paragraphs — this avoids the LLM inventing numbers and keeps every answer traceable to a real row |

**[DESIGN CHOICE]** Do not let the LLM ever compute or state a risk score itself — it should only retrieve and phrase numbers your Stage 4 model already produced. This is the cheapest, most reliable way to prevent "hallucination" in the copilot specifically (as distinct from model overfitting, which is a separate problem addressed in Section 4).

---

## 6. Libraries & Tooling — compressed stack

| Purpose | Library | Notes |
|---|---|---|
| PDF table extraction | `pdfplumber` (primary), `pdftotext -layout` (CLI fallback/sanity-check) | Confirmed working on both your uploaded reports; both have real text layers, no OCR needed |
| Entity resolution / fuzzy matching | `rapidfuzz` (fast, actively maintained fuzzywuzzy successor) | For matching June's `N24...` codes to November's numeric codes via name+agency+state |
| Data wrangling | `pandas` (or `polars` if row counts grow past tens of thousands and speed matters) | pandas is enough at your current scale |
| Storage | `DuckDB` (embedded, zero-setup, fast analytical SQL over your panel) or plain `SQLite` | Avoid standing up Postgres for a hackathon unless your team already has it running |
| Modeling | `LightGBM` (fastest to iterate on CPU) or `XGBoost` (marginally more tuning knobs, GPU-friendly if available) | Pick one, don't build both unless you specifically want the statistical-vs-ML comparison to include a GBDT-vs-GBDT ablation too (unnecessary) |
| Survival modeling | `lifelines` (simple) → `scikit-survival` (sklearn-native) → `PyDTS` (competing risks, most sophisticated) | Escalate only as time allows |
| Calibration | `sklearn.calibration` | Built-in, no extra dependency |
| Explainability | `shap` | Standard, `TreeExplainer` for GBDTs is fast |
| Hyperparameter search | `Optuna` | Efficient Bayesian search, far cheaper than grid search, widely used in exactly this GBDT-tuning context |
| API layer | `FastAPI` | Matches your existing backend skillset |
| Dashboard | `Streamlit` (fastest to build) or `Plotly Dash` if you want more layout control | Streamlit is the pragmatic hackathon choice |

---

## 7. Obstacles, Gaps & Solutions (ranked by how much they threaten the whole project)

| # | Obstacle | Severity | Solution |
|---|---|---|---|
| 1 | No shared project ID across OCMS→PAIMANA transition **[VERIFIED]** | 🔴 Critical | Build entity resolution (Section 1.2a) as Stage 0, before any modeling. Budget real time for this — it's not a one-liner. |
| 2 | MoRTH (58% of portfolio) missing from November report **[VERIFIED]** | 🔴 Critical | Track `ministry_reporting_status` per month; exclude affected ministry-months from training rather than treating absence as a signal; disclose this limitation openly in your presentation — it will read as rigor, not weakness |
| 3 | Only 2 months of data in hand right now, need historical panel to have any temporal signal at all | 🟠 High | Confirm and pull the other ~11 months before committing further to trajectory-based modeling; if some months are unobtainable, fall back honestly to cross-sectional risk scoring rather than fabricating a trajectory story you can't support |
| 4 | Cost/date field structure differs (triple- vs double-value) across report versions | 🟡 Medium | Header-driven parsing, not fixed-position parsing; explicit schema-version detection per PDF |
| 5 | Target leakage (using Revised/Anticipated cost to predict future revision) | 🟡 Medium, well-understood | Point-in-time snapshot discipline (Section 3.1) |
| 6 | Class imbalance (overruns are the minority class) | 🟡 Medium | Class-weighted loss + PR-AUC/recall reporting, not accuracy |
| 7 | Small sample size for calibration, survival modeling | 🟡 Medium | Prefer Platt scaling over isotonic; prefer simpler survival tooling (lifelines) unless team has bandwidth for PyDTS |
| 8 | Scope creep — 8 outcomes, LLM copilot, benchmarking, dashboard all in one hackathon | 🟠 High (execution risk, not data risk) | Follow the staged build order in Section 2; treat anything past Stage 5 as roadmap slides |

---

## 8. Immediate Next Steps

1. **Confirm what other monthly reports you can actually obtain** — you mentioned June 2025 → July 2026; get as many of the actual PDFs as you can, especially the September/October 2025 transition months, since that's where the ID-scheme and schema changes will be messiest.
2. **Build the Stage 0 entity-resolution script first** and test it specifically on June ↔ November — if you can't reliably match a sample of, say, 50 known-identical projects across these two files, no amount of downstream modeling will save the project.
3. **Once you have 4-5+ months of resolved panel data**, pick one target and one horizon (Section 2, Stage 3) and get one honest, leakage-checked, calibrated model working end-to-end before touching anything else.
4. Keep this document's severity table (Section 7) as your running risk log — update it as you learn more from the additional months.

If you upload more of the monthly PDFs, I can extend the entity-resolution and panel-build scripts against real data right away rather than reasoning about it abstractly.
