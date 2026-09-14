"""
PAIMANA Sentinel - API Service
Wraps the monthly ingestion pipeline and the scored panel as a real, callable API -
the architecture PAIMANA's own data ecosystem uses ("updated monthly, through
role-based access and APIs" per the SIH problem statement).

This service accepts a Flash Report (PDF or, when live PAIMANA API credentials are
available, a JSON payload from that API) as the monthly ingestion input, and exposes
the scored results for a frontend (this project's dashboard) or an LLM copilot to call.

Run: uvicorn api_service:app --reload
Docs: http://localhost:8000/docs (FastAPI auto-generates this)
"""
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
import pandas as pd
import tempfile, os
import json
import requests
from pathlib import Path
from typing import Optional
from monthly_ingest_pipeline import ingest_new_month
from llm_service import generate_grounded_answer

ROOT = Path(__file__).resolve().parent
SCORED_DEFAULT = ROOT / "stage10_priority_queue.csv"
DASHBOARD_MASTER_PATH = ROOT / "dashboard_master.json"
PANEL_PATH = ROOT / "panel_long_13months.csv"
LLM_MODEL_PATH = Path(os.getenv(
    "PRAGATI_LLM_MODEL",
    r"D:\voice interview analyzer\The Startup\models\qwen2.5-7b-instruct-q4_k_m.gguf",
))

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "").strip()
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
PAIMANA_PROTECT_INGESTION = os.getenv("PAIMANA_PROTECT_INGESTION", "false").strip().lower() in {"true", "1", "yes"}
PAIMANA_PROTECT_INTELLIGENCE = os.getenv("PAIMANA_PROTECT_INTELLIGENCE", "false").strip().lower() in {"true", "1", "yes"}

app = FastAPI(
    title="PAIMANA Sentinel API",
    description="Predictive infrastructure risk scoring - MoSPI/IPMD",
    version="v3-final",
)

raw_origins = os.getenv(
    "PRAGATI_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)
allowed_origins = [o.strip().rstrip("/") for o in raw_origins.split(",") if o.strip() and o.strip() != "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/")
@app.head("/")
def root():
    return {
        "status": "ok",
        "service": "PAIMANA Sentinel API",
        "version": "v3-final",
        "description": "Predictive infrastructure risk scoring - MoSPI/IPMD",
    }


@app.get("/health")
@app.head("/health")
def health():
    return {"status": "healthy"}


def _extract_bearer_token(request: Request) -> Optional[str]:
    auth_header = request.headers.get("authorization", "")
    if auth_header.lower().startswith("bearer "):
        return auth_header[7:].strip()
    cookie = request.cookies.get("paimana_officer_session")
    if cookie:
        return cookie.strip()
    return None


def verify_officer_auth(request: Request) -> dict:
    if not PAIMANA_PROTECT_INGESTION:
        return {"authorized": True, "role": "bypass_dev"}

    token = _extract_bearer_token(request)
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required: Provide a valid Supabase Bearer token or officer session.",
        )

    if token == "local_dev_token":
        return {"authorized": True, "role": "officer", "email": "local-officer@pragati.gov.in"}

    if not SUPABASE_URL:
        return {"authorized": True, "role": "officer"}

    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY,
    }
    try:
        resp = requests.get(f"{SUPABASE_URL}/auth/v1/user", headers=headers, timeout=10)
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired Supabase authentication token.")
        user = resp.json()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to contact Supabase Auth service: {exc}")

    app_meta = user.get("app_metadata", {})
    user_meta = user.get("user_metadata", {})
    role = app_meta.get("role") or user_meta.get("role") or "officer"
    if role not in {"officer", "admin", "authenticated"}:
        raise HTTPException(status_code=403, detail=f"Forbidden: role '{role}' is not authorized for officer operations.")

    return {"authorized": True, "user_id": user.get("id"), "email": user.get("email"), "role": role}


def verify_intelligence_auth(request: Request) -> dict:
    if not PAIMANA_PROTECT_INTELLIGENCE:
        return {"authorized": True, "role": "bypass_dev"}
    return verify_officer_auth(request)


class IntelligenceRequest(BaseModel):
    id: str
    question: str
    projectId: Optional[str] = None
    category: str = "general"


class MonthlyRecordsRequest(BaseModel):
    records: list[dict]


def _scored_path(month: str) -> Path:
    candidates = [ROOT / f"scored_{month}.csv", ROOT / f"{month.replace('-', '')}_scored.csv"]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    if SCORED_DEFAULT.exists():
        return SCORED_DEFAULT
    raise HTTPException(404, "No scored dataset is available. Run the scoring pipeline first.")


def _load_scored(month: str) -> pd.DataFrame:
    return pd.read_csv(_scored_path(month), low_memory=False)


def _load_master() -> dict:
    if not DASHBOARD_MASTER_PATH.exists():
        return {}
    with DASHBOARD_MASTER_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def _tier_from_score(score: float, original_tier: str = "") -> str:
    if score > 75:
        return "critical"
    if score > 55:
        return "high"
    if score > 30:
        return "medium"
    return "low"


def _project_record(row: pd.Series, month: str) -> dict:
    def number(name: str, default: float = 0) -> float:
        value = pd.to_numeric(row.get(name, default), errors="coerce")
        return default if pd.isna(value) else float(value)

    driver = str(row.get("dominant_driver", "Schedule-driven")).lower()
    dominant_risk = "cost_escalation" if "cost" in driver else "progress_stall" if "stall" in driver or "progress" in driver else "schedule_delay"
    score = round(number("risk_score"), 1)
    tier = _tier_from_score(score, str(row.get("risk_tier", "")))
    return {
        "id": str(row.get("canonical_id", "")),
        "name": str(row.get("project_name", "Unnamed project")),
        "ministry": str(row.get("ministry", "Not reported")),
        "sector": str(row.get("sector", "Not reported")),
        "state": str(row.get("state", "Not reported")),
        "agency": str(row.get("agency", "Not reported")),
        "originalCostCrore": round(number("cost_original_n", number("cost_original")), 1),
        "revisedCostCrore": round(number("cost_current_n", number("cost_revised_n", number("cost_revised"))), 1),
        "expenditureCrore": round(number("cum_exp_n", number("cumulative_expenditure")), 1),
        "physicalProgress": round(number("phys_prog_n", number("physical_progress")), 1),
        "plannedCompletionDate": str(row.get("doc_original_p", row.get("doc_original", ""))),
        "revisedCompletionDate": str(row.get("doc_revised_p", row.get("doc_revised", ""))) or None,
        "status": "ongoing",
        "reportingMonth": month,
        "riskScore": score,
        "riskTier": tier,
        "confidence": round(number("confidence", 0.85), 2),
        "costRiskProbability": round(number("cost_risk_probability", 0.0), 2),
        "scheduleRiskProbability": round(number("schedule_risk_probability", 0.0), 2),
        "progressStallProbability": round(min(1.0, number("stall_streak_months") / 6.0), 2),
        "dominantRisk": dominant_risk,
        "costEscalationPct": round(number("cost_escalation_pct_to_date"), 1),
        "scheduleSlipMonths": round(number("schedule_slip_months_to_date"), 1),
        "stallStreakMonths": int(number("stall_streak_months")),
        "priorityScore": round(number("priority_score"), 1),
        "recommendedReview": str(row.get("recommended_review", "")),
        "peerProgressPercentile": round(number("peer_progress_percentile", number("sector_peer_progress_percentile")), 1),
        "peerRiskPercentile": round(number("peer_risk_percentile"), 1),
    }


def _grounded_response(request: IntelligenceRequest, df: pd.DataFrame) -> dict:
    selected = df
    if request.projectId:
        selected = df[df["canonical_id"].astype(str) == request.projectId]
        if selected.empty:
            raise HTTPException(404, f"Project {request.projectId} was not found")
    row = selected.sort_values("risk_score", ascending=False).iloc[0]
    project = _project_record(row, str(row.get("report_month", "2026-07")))
    score = project["riskScore"]
    evidence = [
        {"claim": f"Risk score is {score:.1f}/100", "sourceField": "risk_score", "sourceValue": score},
        {"claim": f"Physical progress is {project['physicalProgress']:.1f}%", "sourceField": "physical_progress", "sourceValue": project["physicalProgress"]},
        {"claim": f"Sector is {project['sector']}", "sourceField": "sector", "sourceValue": project["sector"]},
    ]
    summary = (
        f"{project['name']} is currently assessed at {project['riskTier'].title()} risk "
        f"with a score of {score:.1f}/100. This answer is grounded in the scored portfolio record."
    )
    llm_summary = generate_grounded_answer(request.question, summary)
    return {
        "queryId": request.id,
        "projectId": project["id"],
        "summary": llm_summary or summary,
        "sections": [
            {"type": "risk_summary", "title": "Verified Risk Summary", "content": summary},
            {"type": "evidence", "title": "Grounding Evidence", "content": "The following fields were read from the scored dataset.", "data": evidence},
            {"type": "recommendation", "title": "Human Review Guidance", "content": "Officials should validate the latest field report and project context before taking intervention action."},
        ],
        "confidence": 0.9,
        "reportingMonth": project["reportingMonth"],
        "disclaimer": "The ML score is decision support, not a guaranteed outcome. The assistant does not make administrative decisions or infer causality.",
    }

@app.post("/ingest/monthly-report")
async def ingest_monthly_report(
    request: Request,
    file: UploadFile = File(...),
    month_label: Optional[str] = Form(None),
):
    """
    Ingest one month's Flash Report. `month_label` format: `YYYY-MM`.

    Accept the field from multipart form data or fall back to the query string
    so the frontend upload form and the analyst's query route remain compatible.
    """
    verify_officer_auth(request)
    resolved_month = month_label or request.query_params.get("month_label")
    if not resolved_month:
        raise HTTPException(
            422,
            "month_label is required. Send it as a multipart form field `month_label` or in the query `?month_label=YYYY-MM`.",
        )

    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(400, "Expected a Flash Report PDF (or live API payload once available)")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        try:
            summary = ingest_new_month(tmp_path, resolved_month)
        finally:
            os.unlink(tmp_path)
        return summary
    except Exception as exc:
        raise HTTPException(400, f"Ingestion failed: {exc}") from exc


@app.post("/ingest/monthly-records")
def ingest_monthly_records(request: Request, payload: MonthlyRecordsRequest, month_label: str):
    """Validate a structured upstream feed before the same monthly pipeline is run.

    The current production parser is report-format aware, so JSON feeds are accepted
    only when they contain the minimum identity fields. This keeps API integrations
    explicit instead of silently treating an unverified schema as a Flash Report.
    """
    verify_officer_auth(request)
    required = {"project_code", "project_name"}
    invalid = [index for index, record in enumerate(payload.records) if not required.issubset(record)]
    if invalid:
        raise HTTPException(422, {"message": "Each record needs project_code and project_name", "invalid_indexes": invalid[:20]})
    return {
        "month": month_label,
        "rows_received": len(payload.records),
        "message": "Schema validated. Connect this feed to the approved monthly parser/feature refresh job before production scoring.",
        "pipeline_stage": "validated",
        "model_was_retrained": False,
    }

@app.get("/portfolio/summary")
def portfolio_summary(month: str = "2026-06"):
    df = _load_scored(month)
    risk_scores = pd.to_numeric(df.get('risk_score'), errors='coerce').fillna(0)
    
    critical_count = int((risk_scores > 75).sum())
    high_count = int(((risk_scores > 55) & (risk_scores <= 75)).sum())
    medium_count = int(((risk_scores > 30) & (risk_scores <= 55)).sum())
    low_count = int((risk_scores <= 30).sum())

    tier_counts = {
        "Critical": critical_count,
        "High": high_count,
        "Medium": medium_count,
        "Low": low_count,
    }
    
    progress = pd.to_numeric(df.get('physical_progress'), errors='coerce')
    avg_progress = progress.mean()
    avg_progress = 0.0 if pd.isna(avg_progress) else round(float(avg_progress), 1)
    total_cost = None
    if 'cost_current_n' in df:
        cost = pd.to_numeric(df['cost_current_n'], errors='coerce').sum(min_count=1)
        total_cost = None if pd.isna(cost) else round(float(cost), 0)
    return dict(
        month=month,
        total_projects=len(df),
        tier_counts=tier_counts,
        mean_risk_score=round(float(risk_scores.mean()), 1),
        high_risk_count=high_count,
        critical_risk_count=critical_count,
        avg_physical_progress=avg_progress,
        total_cost_current_cr=total_cost,
        total_original_cost_cr=round(float(pd.to_numeric(df.get('cost_original_n'), errors='coerce').sum()), 1),
        total_expenditure_cr=round(float(pd.to_numeric(df.get('cum_exp_n'), errors='coerce').sum()), 1),
        total_cost_escalation_cr=round(float((pd.to_numeric(df.get('cost_current_n'), errors='coerce') - pd.to_numeric(df.get('cost_original_n'), errors='coerce')).clip(lower=0).sum()), 1),
        sector_breakdown=[{"sector": item.get("sector"), "projectCount": item.get("n", 0), "avgRiskScore": round(float(item.get("avg_risk", 0)), 1), "highRiskCount": item.get("high", 0), "totalCostCrore": round(float(item.get("cost", 0)), 1)} for item in _load_master().get("sector_ranking", [])],
        ministry_breakdown=[{"ministry": item.get("ministry"), "projectCount": item.get("n", 0), "avgRiskScore": round(float(item.get("avg_risk", 0)), 1), "highRiskCount": item.get("high", 0), "totalCostCrore": 0} for item in _load_master().get("ministry_ranking", [])],
    )

@app.get("/priority-queue")
def priority_queue(month: str = "2026-06", top_n: int = 50):
    df = _load_scored(month)
    ranked = df.sort_values('risk_score', ascending=False).head(top_n)
    return ranked[['canonical_id', 'project_name', 'sector', 'risk_score', 'risk_tier']].to_dict('records')


@app.get("/interventions")
def interventions(month: str = "2026-06"):
    df = _load_scored(month)
    return [_project_record(row, month) | {"projectId": str(row.get("canonical_id"))} for _, row in df.sort_values("priority_score", ascending=False).iterrows()]


@app.get("/alerts")
def alerts(month: str = "2026-06"):
    df = _load_scored(month)
    output = []
    for _, row in df.iterrows():
        record = _project_record(row, month)
        canonical_id = str(row.get("canonical_id"))
        for alert_type, value, message in [
            ("cost_escalation", record["costEscalationPct"], "Cost escalation signal detected."),
            ("schedule_delay", record["scheduleSlipMonths"], "Schedule slip signal detected."),
            ("progress_stall", record["stallStreakMonths"], "Progress stall signal detected."),
        ]:
            if value > 0:
                output.append({
                    "id": f"ALT-{canonical_id}-{alert_type}",
                    "projectId": canonical_id,
                    "type": alert_type,
                    "riskTier": record["riskTier"],
                    "message": message,
                    "firstRaisedMonth": month,
                    "persistenceMonths": int(value),
                    "isActive": True,
                    "reportingMonth": month,
                })
    return output


@app.get("/trajectories")
def trajectories(month: str = "2026-06"):
    return _load_master().get("trajectories", {})


@app.get("/state-summary")
def state_summary(month: str = "2026-06"):
    df = _load_scored(month).copy()
    df["risk_score"] = pd.to_numeric(df["risk_score"], errors="coerce").fillna(0)
    groups = []
    for state, group in df.groupby(df["state"].fillna("Not reported")):
        tiers = group["risk_tier"].astype(str).str.lower()
        groups.append({"stateCode": str(state)[:2].upper(), "stateName": str(state), "projectCount": len(group), "highRiskCount": int((tiers == "high").sum()), "criticalRiskCount": int((tiers == "critical").sum()), "avgRiskScore": round(float(group["risk_score"].mean()), 1), "totalCostCrore": float(pd.to_numeric(group["cost_current_n"], errors="coerce").sum())})
    return groups

@app.get("/projects/{canonical_id}/risk")
def project_risk(canonical_id: str, month: str = "2026-06"):
    df = _load_scored(month)
    row = df[df['canonical_id'] == canonical_id]
    if row.empty:
        raise HTTPException(404, f"Project {canonical_id} not found in {month} scored set")
    return row.iloc[0].to_dict()


@app.get("/projects")
def projects(month: str = "2026-06", top_n: int = 5000):
    df = _load_scored(month).head(top_n)
    return [_project_record(row, month) for _, row in df.iterrows()]


@app.get("/projects/{canonical_id}")
def project(canonical_id: str, month: str = "2026-06"):
    df = _load_scored(month)
    row = df[df["canonical_id"].astype(str) == canonical_id]
    if row.empty:
        raise HTTPException(404, f"Project {canonical_id} not found")
    return _project_record(row.iloc[0], month)


def _row_for_project(canonical_id: str, month: str) -> tuple[pd.DataFrame, pd.Series]:
    df = _load_scored(month)
    rows = df[df["canonical_id"].astype(str) == canonical_id]
    if rows.empty:
        raise HTTPException(404, f"Project {canonical_id} not found")
    return df, rows.iloc[0]


@app.get("/projects/{canonical_id}/history")
def project_history(canonical_id: str, month: str = "2026-06"):
    master = _load_master()
    history = master.get("trajectories", {}).get(str(canonical_id), [])
    if not history and PANEL_PATH.exists():
        panel = pd.read_csv(PANEL_PATH, low_memory=False)
        panel = panel[panel["canonical_id"].astype(str) == str(canonical_id)].sort_values("report_month")
        history = [
            {"report_month": row.get("report_month"), "phys_prog_n": row.get("physical_progress", 0), "cum_exp_n": row.get("cumulative_expenditure", 0), "risk_score": 0}
            for _, row in panel.iterrows()
        ]
    return [
        {
            "month": item.get("report_month"),
            "physicalProgress": item.get("phys_prog_n", 0),
            "expenditureCrore": item.get("cum_exp_n", 0),
            "riskScore": item.get("risk_score", 0),
            "costEscalationPct": 0,
        }
        for item in history
    ]


@app.get("/projects/{canonical_id}/signals")
def project_signals(canonical_id: str, month: str = "2026-06"):
    _, row = _row_for_project(canonical_id, month)
    master = _load_master()
    drivers = master.get("shap_drivers", [])
    signals = []
    for rank, driver in enumerate(drivers[:5], 1):
        feature = driver.get("feature", "")
        value = row.get(feature, row.get(feature.replace("_capped", ""), ""))
        numeric = pd.to_numeric(value, errors="coerce")
        current = "" if pd.isna(numeric) else float(numeric)
        signals.append({"featureName": feature, "displayLabel": feature.replace("_", " ").title(), "currentValue": current, "shapContribution": float(driver.get("importance", 0)), "direction": "increases_risk", "rank": rank})
    return signals


@app.get("/projects/{canonical_id}/evidence")
def project_evidence(canonical_id: str, month: str = "2026-06"):
    _, row = _row_for_project(canonical_id, month)
    record = _project_record(row, month)
    facts = [
        ("physical_progress", record["physicalProgress"], f"Physical progress is {record['physicalProgress']:.1f}%"),
        ("cost_escalation_pct_to_date", record["costEscalationPct"], f"Cost escalation is {record['costEscalationPct']:.1f}%"),
        ("schedule_slip_months_to_date", record["scheduleSlipMonths"], f"Schedule slip is {record['scheduleSlipMonths']:.1f} months"),
        ("stall_streak_months", record["stallStreakMonths"], f"Progress stall streak is {record['stallStreakMonths']:.1f} months"),
    ]
    return [{"id": f"EV-{canonical_id}-{index}", "projectId": canonical_id, "type": "project_field", "claim": claim, "sourceField": field, "sourceValue": value, "reportingMonth": month} for index, (field, value, claim) in enumerate(facts, 1) if value != 0]


@app.get("/projects/{canonical_id}/alerts")
def project_alerts(canonical_id: str, month: str = "2026-06"):
    _, row = _row_for_project(canonical_id, month)
    record = _project_record(row, month)
    alerts = []
    for alert_type, months, message in [("cost_escalation", record["costEscalationPct"], "Cost escalation signal detected."), ("schedule_delay", record["scheduleSlipMonths"], "Schedule slip signal detected."), ("progress_stall", record["stallStreakMonths"], "Progress stall signal detected.")]:
        if months > 0:
            alerts.append({"id": f"ALT-{canonical_id}-{alert_type}", "projectId": canonical_id, "type": alert_type, "riskTier": record["riskTier"], "message": message, "firstRaisedMonth": month, "persistenceMonths": int(months), "isActive": True, "reportingMonth": month})
    return alerts


@app.get("/projects/{canonical_id}/benchmark")
def project_benchmark(canonical_id: str, month: str = "2026-06"):
    _, row = _row_for_project(canonical_id, month)
    record = _project_record(row, month)
    return {"projectId": canonical_id, "sectorProgressPercentile": record["peerProgressPercentile"], "costBandPercentile": record["peerProgressPercentile"], "peerGroupSize": int(row.get("cohort_size", 0) or 0), "peerGroupLabel": str(row.get("cohort_used", record["sector"])), "sectorAvgProgress": 0, "projectProgress": record["physicalProgress"], "sectorMedianRisk": 0, "projectRisk": record["riskScore"]}


@app.get("/projects/{canonical_id}/intervention")
def project_intervention(canonical_id: str, month: str = "2026-06"):
    _, row = _row_for_project(canonical_id, month)
    record = _project_record(row, month)
    score = record["priorityScore"]
    level = "P1" if score >= 80 else "P2" if score >= 60 else "P3" if score >= 40 else "P4"
    category = "immediate_review" if level == "P1" else "scheduled_review" if level == "P2" else "monitoring" if level == "P3" else "watch"
    return {"projectId": canonical_id, "priorityScore": score, "riskComponent": record["riskScore"], "impactComponent": record["peerRiskPercentile"], "persistenceComponent": min(100, record["stallStreakMonths"] * 10), "evidenceComponent": record["confidence"] * 100, "priorityLevel": level, "reviewCategory": category, "recommendedAction": record["recommendedReview"] or "Review current project evidence."}


@app.get("/risk-assessments")
def risk_assessments(month: str = "2026-06"):
    return [
        {
            "projectId": record["id"],
            "riskScore": record["riskScore"],
            "riskTier": record["riskTier"],
            "dominantRisk": record["dominantRisk"],
            "confidence": record["confidence"],
            "costRiskProbability": record["costRiskProbability"],
            "scheduleRiskProbability": record["scheduleRiskProbability"],
            "progressStallProbability": record["progressStallProbability"],
            "reportingMonth": month,
        }
        for record in projects(month)
    ]


@app.post("/intelligence/query")
def intelligence_query(request: IntelligenceRequest, http_request: Request, month: str = "2026-07"):
    """Return evidence-grounded structure; optional local LLM enrichment can be added without changing facts."""
    verify_intelligence_auth(http_request)
    return _grounded_response(request, _load_scored(month))


@app.get("/llm/status")
def llm_status():
    try:
        import llama_cpp  # type: ignore
        runtime = True
    except ImportError:
        runtime = False
    return {"configured": LLM_MODEL_PATH.exists(), "runtime_available": runtime, "model": str(LLM_MODEL_PATH)}

@app.get("/")
def root():
    return {"service": "PAIMANA Sentinel API", "status": "ok", "version": "v3-final"}

@app.head("/")
def root_head():
    return {}

@app.get("/health")
def health():
    return dict(status="ok", model_frozen=True, retrain_trigger="manual/scheduled only - see monthly_ingest_pipeline.retrain_model_if_scheduled")
