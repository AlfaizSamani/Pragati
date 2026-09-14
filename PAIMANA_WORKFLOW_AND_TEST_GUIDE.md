# PAIMANA Sentinel / PRAGATI Workflow and Test Guide

## Runtime layout

- Python backend: repository root, `api_service.py`.
- Next.js frontend: `pragttttiii-sherr-main/`.
- Frontend API base: `NEXT_PUBLIC_API_URL`, default `http://localhost:8000`.
- Frozen model: `model_and_calibrator_FINAL.joblib`.
- Default live scored set: `stage10_priority_queue.csv` (1,773 June 2026 projects).
- Supporting live evidence: `panel_long_13months.csv`, `dashboard_master.json`, and `stage6_shap_final.csv`.
- Optional local LLM: `PRAGATI_LLM_MODEL`, defaulting to the Qwen 2.5 7B GGUF path supplied for this workspace.

## End-to-end workflow

1. Start FastAPI from the repository root: `uvicorn api_service:app --reload --port 8000`.
2. Start Next.js from `pragttttiii-sherr-main`: `npm install`, then `npm run dev`.
3. Open `/ingestion` in the frontend.
4. Choose either:
   - **Structured API feed**: submit JSON records containing at least `project_code` and `project_name`. The current endpoint validates the schema and returns a pipeline status. It does not yet score arbitrary JSON because the approved feature builder is report-schema-specific.
   - **Flash Report PDF**: choose a PDF and month. The service calls `parse_format_b`, extends the working panel, refreshes features, and scores with the frozen model when the monthly pipeline dependencies and paths are available.
5. The dashboard reads `/projects`, `/risk-assessments`, `/interventions`, `/alerts`, `/state-summary`, and detail endpoints from the scored data. `/intelligence/query` returns deterministic evidence-grounded sections and optionally uses the local GGUF model only to rewrite those verified facts. The LLM never becomes the prediction engine.
6. Use the Intelligence page to ask a project-specific question, then inspect the linked project and intervention views.

## API smoke checks

```powershell
Invoke-RestMethod http://localhost:8000/health
Invoke-RestMethod http://localhost:8000/llm/status
Invoke-RestMethod 'http://localhost:8000/projects?month=2026-07&top_n=3'
Invoke-RestMethod 'http://localhost:8000/portfolio/summary?month=2026-07'
Invoke-RestMethod 'http://localhost:8000/priority-queue?month=2026-07&top_n=5'
```

Intelligence request:

```powershell
$body = @{ id = 'smoke-1'; question = 'Why is this project flagged?'; projectId = '400010'; category = 'risk_explanation' } | ConvertTo-Json
Invoke-RestMethod http://localhost:8000/intelligence/query -Method Post -ContentType 'application/json' -Body $body
```

Structured-ingestion validation:

```powershell
$body = @{ records = @(@{ project_code = 'TEST-1'; project_name = 'Schema smoke test' }) } | ConvertTo-Json
Invoke-RestMethod 'http://localhost:8000/ingest/monthly-records?month_label=2026-08' -Method Post -ContentType 'application/json' -Body $body
```

PDF test:

```powershell
$form = @{ month_label = '2026-08'; file = Get-Item '.\sample-flash-report.pdf' }
Invoke-RestMethod http://localhost:8000/ingest/monthly-report -Method Post -Form $form
```

## Frontend checks

- `/projects`: projects load from FastAPI when it is available; stop FastAPI and verify the existing mock fallback still renders.
- `/intelligence`: submit a general and project-specific question; confirm the response includes a verified risk summary, evidence section, disclaimer, and links.
- `/ingestion`: switch between both modes; confirm PDF file selection, JSON validation errors, busy state, and success/error messages.
- Responsive check: test desktop and mobile widths; no workflow control should require horizontal scrolling.
- Run `npm run lint` and `npm run build` from `pragttttiii-sherr-main` after installing dependencies.

## Known gaps to resolve before production

- The JSON feed endpoint currently validates and acknowledges records but deliberately does not pretend to run the report-specific feature builder. A schema adapter should convert the approved upstream API contract into the canonical panel before scoring.
- `monthly_ingest_pipeline.py` references `panel_long_current.csv` and `build_features_from_panel.py`; the manifest-approved files are `panel_long_13months.csv` and `build_features.py`. These paths need a final production wiring pass before live PDF refresh is used.
- Cold-start fallback scoring is described in the pipeline but is not implemented in the current function; cold-start rows are reported as unscored.
- The LLM requires `llama-cpp-python` and enough RAM/CPU for the selected GGUF. Without them, `/intelligence/query` remains fully usable with deterministic responses.
- The composite model's dominant driver is schedule/cost deterioration; progress stall is an independent early-warning signal derived from `stall_streak_months`. It is exposed through risk assessment probability and generated alerts, not mislabeled as the composite model's causal driver.
- The dashboard master contains precomputed risk trajectories for a subset of projects. Other projects receive physical-progress and expenditure history from the full panel; historical risk points are only shown where a verified scored trajectory exists.
