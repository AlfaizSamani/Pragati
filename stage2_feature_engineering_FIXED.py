"""
Stage 2 -- Feature Engineering
Input : panel_long_13months.csv   (project x month long panel, already entity-resolved
         via canonical_id / id_resolved in Stage 0-1)
Output: features_panel.csv        (one row per canonical_id x report_month, with
         the 24 model-ready features)

Run with:  python stage2_feature_engineering.py
"""

import re
import numpy as np
import pandas as pd
from validators import validate_and_cap

IN_PATH  = "panel_long_13months.csv"
OUT_PATH = "features_panel_FIXED.csv"

MONTH_ABBR = {m.lower(): i for i, m in enumerate(
    ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"], start=1)}


# ---------------------------------------------------------------------------
# STEP 1 -- cleaning helpers
# ---------------------------------------------------------------------------
def clean_numeric(series: pd.Series) -> pd.Series:
    """'1,234.50' -> 1234.5 ; 'N.A.' / '-' / '' -> NaN."""
    s = series.astype(str).str.strip()
    s = s.str.replace(",", "", regex=False)
    bad = s.str.fullmatch(r"(?i)(n\.?a\.?|-|nan|none|)")
    s = s.where(~bad, np.nan)
    return pd.to_numeric(s, errors="coerce")


def parse_month_year(series: pd.Series) -> pd.Series:
    """
    Handles the three date shapes seen in the reports:
      '9/2018'   (M/YYYY)
      '10-2013'  (M-YYYY)
      'Aug-2025' (Mon-YYYY)
    Anything else ('N.A.', '-', '{...}', blank) -> NaT.
    Returns a Timestamp fixed to the 1st of the month.
    """
    def parse_one(v):
        if pd.isna(v):
            return pd.NaT
        v = str(v).strip().strip("{}()").strip()
        if v == "" or v.lower() in ("n.a.", "na", "-", "nan"):
            return pd.NaT
        m = re.match(r"^(\d{1,2})[/-](\d{4})$", v)
        if m:
            month, year = int(m.group(1)), int(m.group(2))
            if 1 <= month <= 12:
                return pd.Timestamp(year=year, month=month, day=1)
            return pd.NaT
        m = re.match(r"^([A-Za-z]{3})-(\d{4})$", v)
        if m and m.group(1).lower() in MONTH_ABBR:
            return pd.Timestamp(year=int(m.group(2)), month=MONTH_ABBR[m.group(1).lower()], day=1)
        return pd.NaT
    return series.map(parse_one)


# ---------------------------------------------------------------------------
# STEP 2 -- load + basic cleaning
# ---------------------------------------------------------------------------
def load_clean(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)

    df["report_month_dt"] = pd.to_datetime(df["report_month"] + "-01")

    for col in ["cost_original", "cost_revised", "cost_anticipated",
                "cumulative_expenditure", "physical_progress"]:
        if col in df.columns:
            df[col] = clean_numeric(df[col])

    for col in ["approval_date", "start_date",
                "doc_original", "doc_revised", "doc_anticipated"]:
        if col in df.columns:
            df[col] = parse_month_year(df[col])

    # Validate before feature engineering. Invalid inputs must be corrected and
    # surfaced through warning columns, never silently passed downstream.
    df = validate_and_cap(df)

    # one row per project per month -- drop exact duplicates defensively
    df = df.sort_values(["canonical_id", "report_month_dt"]).drop_duplicates(
        subset=["canonical_id", "report_month"], keep="last")
    return df


# ---------------------------------------------------------------------------
# STEP 3 -- per-project-month feature block
# ---------------------------------------------------------------------------
def add_features(df: pd.DataFrame) -> pd.DataFrame:
    g = df.groupby("canonical_id", group_keys=False)

    # PROJECT IDENTITY (1-4) -- already columns: sector, ministry, agency, state
    # PROJECT STATE (5-8) -- already columns: cost_original, cost_revised,
    #                        cumulative_expenditure, physical_progress

    # -- TIME (9-11) --------------------------------------------------------
    ref_date = df["approval_date"].fillna(df["start_date"])
    df["elapsed_months"] = ((df["report_month_dt"] - ref_date).dt.days / 30.44)
    planned_end = df["doc_revised"].fillna(df["doc_original"])
    df["planned_duration"] = ((planned_end - ref_date).dt.days / 30.44)
    # avoid division-by-zero / infinite ratios when planned_duration is 0 or negative
    df["planned_duration"] = df["planned_duration"].where(df["planned_duration"] > 0, np.nan)
    df["time_elapsed_ratio"] = df["elapsed_months"] / df["planned_duration"]

    # -- PROGRESS (12-15) ----------------------------------------------------
    # FIX (Claude patch): gap-normalize velocity/acceleration by actual calendar months
    # elapsed, not row position - the MoRTH Jul-Nov 2025 gap makes raw diff() silently
    # treat a 6-month jump as if it were 1 month. Same bug class already found & fixed
    # in the Claude/Enhanced pipeline's build_features.py this session.
    prev_month_dt = g["report_month_dt"].shift(1)
    gap_months_calc = ((df["report_month_dt"] - prev_month_dt).dt.days / 30.44).round()
    safe_gap = gap_months_calc.where(gap_months_calc > 0, other=1)
    raw_diff_1 = g["physical_progress"].diff(1)
    df["progress_velocity_1m"] = raw_diff_1 / safe_gap
    df["progress_velocity_3m"] = g["physical_progress"].diff(3) / 3  # left as-is; 3-obs window, documented limitation
    df["progress_acceleration"] = df.groupby("canonical_id")["progress_velocity_1m"].diff(1)
    df["progress_time_gap"] = df["physical_progress"] - (df["time_elapsed_ratio"] * 100)
    # Consecutive non-improvement is stronger evidence than a single bad month.
    stalled_month = df["progress_velocity_1m"].notna() & df["progress_velocity_1m"].le(0)
    df["stall_streak_months"] = (
        stalled_month.groupby(df["canonical_id"])
        .transform(lambda s: s.astype(int).groupby((~s).cumsum()).cumsum())
    )

    # -- COST (16-18) ---------------------------------------------------------
    # safe divisions: avoid division-by-zero when cost fields are zero/missing
    df["cost_utilization"] = np.where(df["cost_revised"].fillna(0) > 0,
                                       df["cumulative_expenditure"] / df["cost_revised"],
                                       np.nan)
    df["cost_growth"] = np.where(df["cost_original"].fillna(0) > 0,
                                  (df["cost_revised"] - df["cost_original"]) / df["cost_original"],
                                  np.nan)
    # clip extreme growths introduced by parsing noise so downstream consumers
    # don't get silently corrupted values (keeps consistency with Stage 4/5 clipping)
    df["cost_growth"] = df["cost_growth"].replace([np.inf, -np.inf], np.nan).clip(-1, 10)
    df["cost_progress_gap"] = (df["cost_utilization"] * 100) - df["physical_progress"]

    # -- REVISIONS (19-20) ------------------------------------------------------
    doc_changed = g["doc_revised"].apply(lambda s: s.ne(s.shift()).cumsum() - 1)
    df["completion_revision_count"] = doc_changed
    df["schedule_slippage_months"] = (
        (df["doc_revised"] - df["doc_original"]).dt.days / 30.44
    )

    # -- HISTORICAL (21-22) -- expanding, using only PAST months to avoid leakage
    # FIX (Claude patch): aggregate to (key, month) level FIRST, then shift by calendar
    # month, then expand. The original sorted only by report_month_dt (not by agency+
    # month) before groupby(key).shift() - when an agency/sector has multiple projects
    # in the same month, shift(1) could pull a same-month sibling project's outcome
    # instead of a genuinely prior month's, i.e. same-time cross-project leakage.
    # Same bug class already found & fixed in the Claude/Enhanced pipeline this session.
    df["is_cost_overrun"] = (df["cost_growth"] > 0.10).astype(float)
    df = df.sort_values(["report_month_dt"])
    for key, out in [("agency", "agency_historical_overrun_rate"),
                      ("sector", "sector_historical_overrun_rate")]:
        key_month = (df.groupby([key, "report_month"])["is_cost_overrun"]
                     .mean().reset_index().rename(columns={"is_cost_overrun": "_km_rate"}))
        key_month = key_month.sort_values([key, "report_month"])
        key_month[out] = (key_month.groupby(key)["_km_rate"]
                           .apply(lambda s: s.shift(1).expanding().mean())
                           .reset_index(level=0, drop=True))
        df = df.merge(key_month[[key, "report_month", out]], on=[key, "report_month"], how="left")

    # -- QUALITY (23-24) ---------------------------------------------------
        df["obs_index"] = df.groupby("canonical_id").cumcount() + 1
        # reporting freshness: months since last report (NaN for first report)
        months_diff = (
                df.groupby("canonical_id")["report_month_dt"]
                    .apply(lambda s: s.diff().dt.days / 30.44)
                    .reset_index(level=0, drop=True)
        )
        df["months_since_prior_report"] = months_diff
        # version filled with 0 for modeling / quick checks
        df["months_since_last_report"] = df["months_since_prior_report"].fillna(0)
        # flag when reporting lag is suspicious (>1.5 months)
        df["reporting_lag_flag"] = (df["months_since_last_report"] > 1.5).astype(int)
        # keep legacy reporting_status for compatibility (monthly == 1)
        df["reporting_status"] = (df["months_since_prior_report"] == 1).astype(float)
    key_fields = ["cost_original", "cost_revised", "cumulative_expenditure",
                  "physical_progress", "approval_date", "doc_original", "doc_revised"]
    df["data_completeness"] = df[key_fields].notna().mean(axis=1)
    warning_columns = [c for c in df.columns if c.endswith("_warning")]
    df["dq_flag_any"] = (
        df[warning_columns].fillna(False).any(axis=1).astype(int)
        if warning_columns else 0
    )
    df["fiscal_year_end_flag"] = df["report_month_dt"].dt.month.isin([1, 2, 3]).astype(int)
    df["monsoon_season_flag"] = df["report_month_dt"].dt.month.isin([6, 7, 8, 9]).astype(int)
    df["history_months"] = df.groupby("canonical_id").cumcount() + 1
    df["cold_start_flag"] = (df["history_months"] < 3).astype(int)

    # optional: use management's own anticipated cost as a validation signal
    if "cost_anticipated" in df.columns:
        df["cost_anticipated_gap"] = np.where(
            df["cost_anticipated"].fillna(0) > 0,
            (df["cost_revised"] - df["cost_anticipated"]) / df["cost_anticipated"],
            np.nan,
        )
        # management's month-over-month change in anticipated cost
        df["management_anxiety_index"] = (
            df.groupby("canonical_id")["cost_anticipated"].pct_change(periods=1).fillna(0)
        )

    # Sector rolling-month relative cost growth removes economy-wide shifts
    # while preserving the project's performance against its sector peers.
    if "cost_growth" in df.columns and "report_month" in df.columns:
        sector_month = (
            df.groupby(["sector", "report_month"], dropna=False)["cost_growth"]
            .median()
            .rename("sector_month_median")
            .reset_index()
            .sort_values(["sector", "report_month"])
        )
        sector_month["sector_rolling_3m_median"] = (
            sector_month.groupby("sector", dropna=False)["sector_month_median"]
            .transform(lambda s: s.rolling(3, min_periods=1).median())
        )
        df = df.merge(
            sector_month[["sector", "report_month", "sector_rolling_3m_median"]],
            on=["sector", "report_month"],
            how="left",
            validate="many_to_one",
        )
        df["cost_growth_relative_to_month_median"] = (
            df["cost_growth"] - df["sector_rolling_3m_median"]
        )
        df = df.drop(columns=["sector_rolling_3m_median"])

    # winsorize cost_progress_gap by 1st/99th percentiles to cap typos/outliers
    if "cost_progress_gap" in df.columns:
        lo, hi = df["cost_progress_gap"].quantile(0.01), df["cost_progress_gap"].quantile(0.99)
        df["cost_progress_gap"] = df["cost_progress_gap"].clip(lo, hi)

    # final safety: replace any remaining infinite values with NaN
    df = df.replace([np.inf, -np.inf], np.nan)

    return df.sort_values(["canonical_id", "report_month_dt"]).reset_index(drop=True)


# ---------------------------------------------------------------------------
# STEP 4 -- optional: small subset for fast internal-round training
# ---------------------------------------------------------------------------
def make_dev_subset(df: pd.DataFrame, n_sectors=5, seed=42) -> pd.DataFrame:
    """As suggested: don't train on the full panel yet -- take a handful of
    sectors (or swap for df['canonical_id'].sample(...) for a random project subset)."""
    top_sectors = df["sector"].value_counts().head(n_sectors).index
    return df[df["sector"].isin(top_sectors)].copy()


if __name__ == "__main__":
    raw = load_clean(IN_PATH)
    feats = add_features(raw)
    feats.to_csv(OUT_PATH, index=False)
    print("full panel  :", feats.shape)

    dev = make_dev_subset(feats)
    dev.to_csv("features_panel_dev_subset.csv", index=False)
    print("dev subset  :", dev.shape, "sectors:", dev["sector"].unique().tolist())
