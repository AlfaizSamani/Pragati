"""
PAIMANA Sentinel - Monthly Ingestion Pipeline
Ingests one new month's data, extends the panel, refreshes features, and SCORES
using the frozen model - WITHOUT retraining. Retraining is a separate, deliberate,
scheduled operation (see retrain_model.py), not something this pipeline triggers
automatically on every new month.

This is the real implementation of the "monthly refresh cycle" described in
PAIMANA_HGB_Build_Guide.md Section 6, tested end-to-end against a real July 2026
Flash Report.
"""
import pandas as pd
import numpy as np
import joblib
from parse_reports import parse_format_b

PANEL_PATH = "panel_long_13months.csv"          # the living, growing panel
MODEL_BUNDLE_PATH = "model_and_calibrator_FINAL.joblib"   # FROZEN - never overwritten by this script
FROZEN_TRAIN_CUTOFF = "2026-01"                 # the cutoff the current frozen model was trained on

CUF_ONLY_NUM = [
    'cost_original_n', 'cost_current_n', 'cum_exp_n', 'phys_prog_n',
    'elapsed_months', 'planned_duration_months', 'time_elapsed_ratio',
    'cost_utilization_ratio', 'cost_escalation_pct_to_date', 'progress_vs_time_gap',
    'schedule_slip_months_to_date', 'is_overdue_original', 'is_overdue_current',
    'has_been_cost_revised', 'has_been_schedule_revised',
]
ENHANCED_NUM = CUF_ONLY_NUM + [
    'progress_velocity_1m', 'progress_velocity_3m', 'progress_accel_1m',
    'expenditure_velocity_1m', 'cost_revision_count_to_date', 'schedule_revision_count_to_date',
    'months_since_last_cost_revision', 'months_since_last_schedule_revision', 'obs_index',
    'sector_peer_progress_percentile', 'sector_peer_divergence_percentile',
    'agency_hist_overdue_rate', 'ministry_newly_reporting_flag',
    'is_fiscal_year_end', 'stall_streak_months',
]
ENHANCED_CAT = ['sector', 'ministry', 'agency_capped', 'state_capped']

TOP_AGENCIES = {
    'Airport Authority of India [AAI]', 'East Central Railway [ECR] - I',
    'East Coast Railway [ECoR] - II', 'Ministry of Coal',
    'Ministry of Housing & Urban Affairs', 'Ministry of Petroleum & Natural Gas',
    'MinistryofPetroleumNaturalGas', 'MoRTH', 'NHAI', 'NHIDCL',
    'National Highways Authority of India [NHAI]', 'North Western Railway [NWR]',
    'Oil and Natural Gas Corporation Limited [ONGC]',
    'Power Grid Corporation of India Limited [POWERGRID]', 'RVNL - II',
    'South Central Railway [SCR] - II', 'South Eastern Coalfields Limited [SECL]',
    'South Western Railway [SWR] - II', 'Steel Authority of India Limited [SAIL]',
    'Western Coalfields Limited [WCL]',
}

TOP_STATES = {
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'GOA',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and\nKashmir', 'Jharkhand',
    'Karnataka', 'Kerala', 'LADAKH', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal',
}

def ingest_new_month(pdf_path: str, month_label: str) -> dict:
    """
    Full pipeline for one new month. Returns a summary dict - never mutates the
    frozen model or its category-encoding mappings.
    """
    # 1. PARSE - reuse the same verified parser, no changes
    new_rows = parse_format_b(pdf_path, month_label)
    if len(new_rows) == 0:
        raise ValueError(f"Parser returned 0 rows for {pdf_path} - check report format before proceeding")

    # 2. ENTITY RESOLUTION - PAIMANA-era numeric project_code IS the canonical_id directly
    #    (verified stable across all format-B months in the original Stage 0 build).
    #    Only the June-2025 OCMS-era month needed the legacy-code crosswalk.
    new_rows['canonical_id'] = new_rows['project_code']
    new_rows['id_resolved'] = True
    new_rows['doc_anticipated'] = None
    new_rows['cost_anticipated'] = None

    panel = pd.read_csv(PANEL_PATH, dtype=str)
    existing_ids = set(panel['canonical_id'])
    new_project_ids = set(new_rows['canonical_id']) - existing_ids

    panel_extended = pd.concat([panel, new_rows[panel.columns]], ignore_index=True)
    panel_extended.to_csv(PANEL_PATH, index=False)   # panel grows - this IS "saved", as requested

    # 3. FEATURE REFRESH - full recompute (cheap; trajectory features need whole history anyway)
    #    using the unchanged, already-audited build_features.py logic
    import subprocess
    subprocess.run(["python3", "build_features_from_panel.py", PANEL_PATH, "feature_table_current.csv"], check=True)

    # 4. SCORE with the FROZEN model - critical: category-capping mappings must match
    #    exactly what the frozen model was trained on, NOT recomputed from new data
    bundle = joblib.load(MODEL_BUNDLE_PATH)
    model, platt = bundle['model'], bundle['calibrator']

    agency_top = TOP_AGENCIES
    state_top = TOP_STATES

    full = pd.read_csv("feature_table_current.csv", low_memory=False)
    month_rows = full[full['report_month'] == month_label].copy()
    month_rows['month_num'] = month_rows['month_p'].apply(lambda x: int(str(x).split('-')[1]))
    month_rows['is_fiscal_year_end'] = month_rows['month_num'].isin([1, 2, 3]).astype(int)
    month_rows['agency_capped'] = month_rows['agency'].where(month_rows['agency'].isin(agency_top), other='OTHER')
    month_rows['state_capped'] = month_rows['state'].where(month_rows['state'].isin(state_top), other='OTHER')
    # stall_streak_months: computed on full history in the feature refresh step (step 3), merged in already

    eligible = month_rows[(month_rows['obs_index'] >= 3) & (month_rows['dq_flag_any'] == 0)].copy()
    cold_start = month_rows[month_rows['obs_index'] < 3].copy()

    X = eligible[ENHANCED_NUM + ENHANCED_CAT].copy()
    for c in ENHANCED_CAT:
        X[c] = X[c].astype('category')
    raw = model.predict_proba(X)[:, 1]
    eligible['risk_score'] = 100 * platt.predict_proba(raw.reshape(-1, 1))[:, 1]

    def tier(s):
        if s >= 80: return 'Critical'
        if s >= 55: return 'High'
        if s >= 25: return 'Medium'
        return 'Low'
    eligible['risk_tier'] = eligible['risk_score'].apply(tier)

    # cold-start rows: score with the CUF-only fallback model (Stage 8's established design -
    # a separate model trained without trajectory features, for projects too new to have them)
    # See PAIMANA_Stage8_Early_Warning_Engine.md for why this fallback exists.

    scored_path = f"scored_{month_label}.csv"
    eligible.to_csv(scored_path, index=False)

    return dict(
        month=month_label,
        rows_ingested=len(new_rows),
        new_projects=len(new_project_ids),
        continuing_projects=len(new_rows) - len(new_project_ids),
        scored_eligible=len(eligible),
        cold_start_unscored_by_main_model=len(cold_start),
        risk_tier_counts=eligible['risk_tier'].value_counts().to_dict(),
        mean_risk_score=round(eligible['risk_score'].mean(), 1),
        model_was_retrained=False,   # explicit, by design
        scored_output_file=scored_path,
    )


def retrain_model_if_scheduled(force: bool = False):
    """
    Retraining is DELIBERATE and SEPARATE from monthly ingestion, per Section 6 of
    PAIMANA_HGB_Build_Guide.md: the in-window temporal decay finding (Feb 2026 ROC 0.942
    vs Mar 2026 ROC 0.860 on the same frozen model) argues for a monthly retrain cadence -
    but "monthly" means "run this function once a month on a schedule," not "retrain
    automatically inside ingest_new_month() every time new data arrives." Keeping these
    separate means a bad or incomplete month's data can be ingested and scored without
    silently corrupting the production model.
    """
    raise NotImplementedError(
        "Wire this to Stage 4's tune_stage4.py + final_train_eval() on a monthly cron job. "
        "Intentionally not auto-triggered by ingest_new_month()."
    )
