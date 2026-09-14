"""
PAIMANA Sentinel - Stage 2 Feature Engineering
Builds a leak-safe, point-in-time feature table from panel_canonical_long.csv.

Design principle (non-negotiable): a feature computed for row (project, month=t)
may only use information from months <= t for that project, or from the SAME
month t across other projects (cross-sectional peer comparison). Targets are
computed separately using months > t and are clearly namespaced target_*.
"""
import re
import numpy as np
import pandas as pd

MONTHS = {m.lower(): i for i, m in enumerate(
    ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'], start=1)}

def parse_period(s):
    """Parse the many date formats seen across report months into a pandas Period('M')."""
    if s is None or (isinstance(s, float) and np.isnan(s)):
        return pd.NaT
    s = str(s).strip()
    if s == '' or s.upper() in ('N.A.', 'NA', '-'):
        return pd.NaT
    # Mon-YYYY  e.g. Jun-2023
    m = re.match(r'^([A-Za-z]{3})-(\d{4})$', s)
    if m:
        mon = MONTHS.get(m.group(1).lower())
        if mon:
            return pd.Period(year=int(m.group(2)), month=mon, freq='M')
        return pd.NaT
    # M-YYYY or MM-YYYY
    m = re.match(r'^(\d{1,2})-(\d{4})$', s)
    if m:
        return pd.Period(year=int(m.group(2)), month=int(m.group(1)), freq='M')
    # M/YYYY or MM/YYYY
    m = re.match(r'^(\d{1,2})/(\d{4})$', s)
    if m:
        return pd.Period(year=int(m.group(2)), month=int(m.group(1)), freq='M')
    return pd.NaT

def parse_num(s):
    if s is None or (isinstance(s, float) and np.isnan(s)):
        return np.nan
    s = str(s).strip().replace(',', '')
    if s == '' or s.upper() in ('N.A.', 'NA', '-'):
        return np.nan
    try:
        return float(s)
    except ValueError:
        return np.nan

def load_base(path="panel_canonical_long.csv"):
    df = pd.read_csv(path, dtype=str)
    df['month_p'] = df['report_month'].apply(lambda s: pd.Period(s, freq='M'))
    df['approval_p'] = df['approval_date'].apply(parse_period)
    df['doc_original_p'] = df['doc_original'].apply(parse_period)
    df['doc_revised_p'] = df['doc_revised'].apply(parse_period)
    # if not yet revised, current best-known completion target = original
    df['doc_current_p'] = df['doc_revised_p'].fillna(df['doc_original_p'])
    df['cost_original_n'] = df['cost_original'].apply(parse_num)
    df['cost_revised_n'] = df['cost_revised'].apply(parse_num)
    df['cost_current_n'] = df['cost_revised_n'].fillna(df['cost_original_n'])
    df['cum_exp_n'] = df['cumulative_expenditure'].apply(parse_num)
    df['phys_prog_n'] = df['physical_progress'].apply(parse_num)
    # drop rows with no canonical_id or no month (shouldn't happen, but be safe)
    df = df.dropna(subset=['canonical_id', 'month_p'])
    df = df.sort_values(['canonical_id', 'month_p']).reset_index(drop=True)
    return df

def build_tier1(df):
    """As-of-t features: pure snapshot, no history needed."""
    out = df.copy()
    out['elapsed_months'] = (out['month_p'] - out['approval_p']).apply(lambda x: x.n if pd.notna(x) else np.nan)
    out['planned_duration_months'] = (out['doc_original_p'] - out['approval_p']).apply(lambda x: x.n if pd.notna(x) else np.nan)

    # --- Data-quality guard 1: non-positive planned duration (approval == or > original target date) ---
    # This is a real upstream data-entry issue in the source reports (spot-checked: some projects show
    # doc_original == approval_date, i.e. zero planned duration; a few show doc_original BEFORE approval_date).
    # A ratio over a zero/negative denominator is meaningless, not a large risk signal - null it out and flag it
    # rather than letting it silently become +/-inf.
    out['dq_flag_bad_duration'] = (out['planned_duration_months'] <= 0).astype('Int64')
    safe_duration = out['planned_duration_months'].where(out['planned_duration_months'] > 0)
    out['time_elapsed_ratio'] = (out['elapsed_months'] / safe_duration).clip(lower=0, upper=5)

    out['months_to_current_deadline'] = (out['doc_current_p'] - out['month_p']).apply(lambda x: x.n if pd.notna(x) else np.nan)
    out['is_overdue_original'] = ((out['month_p'] > out['doc_original_p']) & (out['phys_prog_n'] < 100)).astype('Int64')
    out['is_overdue_current'] = ((out['month_p'] > out['doc_current_p']) & (out['phys_prog_n'] < 100)).astype('Int64')
    out['schedule_slip_months_to_date'] = (out['doc_current_p'] - out['doc_original_p']).apply(lambda x: x.n if pd.notna(x) else 0)

    # --- Data-quality guard 2: extreme schedule slip (|slip| > 10 years) ---
    # Spot-checked several of these: some are real (Subansiri Lower HE, a well-documented multi-decade-delayed
    # hydro project), others are clear source typos (e.g. doc_original listed as 12/2056 for a coal-mining
    # project, producing a -356 month "slip"). Cannot tell the two apart automatically -> flag, don't delete,
    # and let the modeling stage decide whether to cap/exclude flagged rows.
    out['dq_flag_extreme_slip'] = (out['schedule_slip_months_to_date'].abs() > 120).astype('Int64')

    out['cost_escalation_pct_to_date'] = 100 * (out['cost_current_n'] - out['cost_original_n']) / out['cost_original_n'].replace(0, np.nan)
    out['cost_utilization_ratio'] = out['cum_exp_n'] / out['cost_current_n'].replace(0, np.nan)
    out['progress_vs_time_gap'] = out['phys_prog_n'] - (out['time_elapsed_ratio'] * 100)
    out['cost_progress_divergence'] = (out['cost_utilization_ratio'] * 100) - out['phys_prog_n']

    # --- Data-quality guard 3: implausible cost-utilization (>500% spent relative to current approved cost) ---
    # Almost certainly a unit/entry error in the source (e.g. lakhs entered as crores) rather than a real
    # 5x overspend while under 100% physically complete - flag rather than silently feeding a model a 33,000%
    # divergence value that will dominate any tree split or distance-based feature.
    out['dq_flag_implausible_utilization'] = (out['cost_utilization_ratio'] > 5).astype('Int64')

    out['has_been_cost_revised'] = out['cost_revised_n'].notna().astype('Int64')
    out['has_been_schedule_revised'] = out['doc_revised_p'].notna().astype('Int64')
    out['dq_flag_any'] = (
        (out['dq_flag_bad_duration'] == 1) |
        (out['dq_flag_extreme_slip'] == 1) |
        (out['dq_flag_implausible_utilization'] == 1)
    ).astype('Int64')
    return out

def build_tier2(df):
    """Trajectory features: require prior months of the SAME project. Uses only shift(+k), never shift(-k).
    Correctly accounts for reporting gaps (e.g. the MoRTH Jul-Nov 2025 gap) - a diff computed across a
    6-month gap is normalized to a per-calendar-month rate, not silently mislabeled as a 1-month change."""
    out = df.copy()

    def gb(frame=None):
        return (frame if frame is not None else out).groupby('canonical_id', group_keys=False)

    out['_prev_month_p'] = gb()['month_p'].shift(1)
    out['gap_months'] = (out['month_p'] - out['_prev_month_p']).apply(lambda x: x.n if pd.notna(x) else np.nan)
    out['dq_flag_nonstandard_gap'] = ((out['gap_months'].notna()) & (out['gap_months'] != 1)).astype('Int64')
    safe_gap = out['gap_months'].where(out['gap_months'] > 0, other=1)
    out = out.drop(columns=['_prev_month_p'])

    raw_prog_diff_1 = gb()['phys_prog_n'].diff(1)
    out['progress_velocity_1m'] = raw_prog_diff_1 / safe_gap  # per-calendar-month rate, gap-normalized
    out['progress_accel_1m'] = gb()['progress_velocity_1m'].diff(1)  # is velocity itself slowing?
    raw_exp_diff_1 = gb()['cum_exp_n'].diff(1)
    out['expenditure_velocity_1m'] = raw_exp_diff_1 / safe_gap

    # progress_velocity_3m: calendar-correct (find the row at exactly month-3 for this project via merge,
    # not diff(3) which is "3 rows back" and can span far more than 3 calendar months across a gap)
    lookback = out[['canonical_id', 'month_p', 'phys_prog_n']].copy()
    lookback['month_p'] = lookback['month_p'] + 3
    lookback = lookback.rename(columns={'phys_prog_n': '_prog_3m_ago'})
    out = out.merge(lookback, on=['canonical_id', 'month_p'], how='left')
    out['progress_velocity_3m'] = out['phys_prog_n'] - out['_prog_3m_ago']
    out = out.drop(columns=['_prog_3m_ago'])

    # cumulative revision counts to date (count of months where current value CHANGED from prior month)
    out['cost_changed_this_month'] = (gb()['cost_current_n'].diff(1).fillna(0) != 0).astype(int)
    out['_doc_ordinal'] = out['doc_current_p'].apply(lambda p: p.ordinal if pd.notna(p) else np.nan)
    out['doc_changed_this_month'] = (gb()['_doc_ordinal'].diff(1).fillna(0) != 0).astype(int)
    out = out.drop(columns=['_doc_ordinal'])
    out['cost_revision_count_to_date'] = gb()['cost_changed_this_month'].cumsum()
    out['schedule_revision_count_to_date'] = gb()['doc_changed_this_month'].cumsum()

    # months since last revision - calendar-correct: accumulate actual gap_months elapsed, not +1 per row
    def months_since_flag_calendar(flags, gaps):
        result = []
        counter = np.nan
        for f, gap in zip(flags, gaps):
            if f == 1:
                counter = 0
            elif counter is not None and not np.isnan(counter):
                counter += (gap if pd.notna(gap) else 1)
            result.append(counter)
        return result
    tmp = out[['canonical_id', 'cost_changed_this_month', 'gap_months']].copy()
    out['months_since_last_cost_revision'] = tmp.groupby('canonical_id', group_keys=False).apply(
        lambda d: pd.Series(months_since_flag_calendar(d['cost_changed_this_month'], d['gap_months']), index=d.index))
    tmp2 = out[['canonical_id', 'doc_changed_this_month', 'gap_months']].copy()
    out['months_since_last_schedule_revision'] = tmp2.groupby('canonical_id', group_keys=False).apply(
        lambda d: pd.Series(months_since_flag_calendar(d['doc_changed_this_month'], d['gap_months']), index=d.index))

    # months present so far for this project (observation depth, i.e. how many real data points we have -
    # this is intentionally a count of OBSERVATIONS, not calendar duration, since it measures data reliability)
    out['obs_index'] = gb().cumcount() + 1
    return out

def build_tier3(df):
    """Cross-sectional peer features: same report_month only, no future leakage possible by construction."""
    out = df.copy()
    grp = out.groupby(['month_p', 'sector'])['phys_prog_n']
    out['sector_peer_progress_percentile'] = grp.rank(pct=True) * 100

    grp2 = out.groupby(['month_p', 'sector'])['cost_progress_divergence']
    out['sector_peer_divergence_percentile'] = grp2.rank(pct=True) * 100

    # agency historical overdue rate: aggregate to agency-MONTH level first (an agency can have many
    # projects in one month), THEN shift by calendar month and expand - eliminates the same-month,
    # cross-project leakage that a per-row groupby().shift(1) would silently introduce.
    agency_month = (out.groupby(['agency', 'month_p'])['is_overdue_current']
                     .mean().reset_index().rename(columns={'is_overdue_current': 'agency_month_overdue_rate'}))
    agency_month = agency_month.sort_values(['agency', 'month_p'])
    agency_month['agency_hist_overdue_rate'] = (
        agency_month.groupby('agency')['agency_month_overdue_rate']
        .apply(lambda s: s.shift(1).expanding().mean())
        .reset_index(level=0, drop=True)
    )
    out = out.merge(agency_month[['agency', 'month_p', 'agency_hist_overdue_rate']], on=['agency', 'month_p'], how='left')

    # ministry reporting-gap flag: was this ministry present in the PRIOR report month at all?
    ministries_by_month = out.groupby('month_p')['ministry'].apply(lambda s: set(s.dropna()))
    months_sorted = sorted(ministries_by_month.index)
    prev_month_map = {months_sorted[i]: months_sorted[i-1] for i in range(1, len(months_sorted))}
    def ministry_gap(row):
        prev_m = prev_month_map.get(row['month_p'])
        if prev_m is None or pd.isna(row['ministry']):
            return 0
        return int(row['ministry'] not in ministries_by_month[prev_m])
    out['ministry_newly_reporting_flag'] = out.apply(ministry_gap, axis=1)

    out = out.sort_values(['canonical_id', 'month_p']).reset_index(drop=True)
    return out

def build_targets(df, horizon=6):
    """Future-looking targets, using a CALENDAR-AWARE lookup (merge on canonical_id + month+horizon),
    not shift(-horizon) which advances by row position and silently mislabels row-gaps as the true horizon
    (e.g. a project missing 3 consecutive monthly reports would have its 'horizon' rows actually span
    2x-3x the intended calendar window). A project with no row at exactly month+horizon correctly gets NaN
    (target not computable), rather than being backfilled from whatever row happened to come next."""
    out = df.copy()

    future_cols = ['canonical_id', 'month_p', 'doc_current_p', 'phys_prog_n', 'cost_current_n']
    future = out[future_cols].copy()
    future['month_p'] = future['month_p'] - horizon  # shift back so it aligns to the row `horizon` months earlier
    future = future.rename(columns={'doc_current_p': '_future_doc', 'phys_prog_n': '_future_prog', 'cost_current_n': '_future_cost'})
    out = out.merge(future, on=['canonical_id', 'month_p'], how='left')

    future_slip = (out['_future_doc'] - out['doc_current_p']).apply(lambda x: x.n if pd.notna(x) else np.nan)
    out[f'target_further_slip_months_{horizon}m'] = future_slip
    out[f'target_schedule_deteriorates_{horizon}m'] = (future_slip > 0).astype('Int64')

    out[f'target_progress_gain_{horizon}m'] = out['_future_prog'] - out['phys_prog_n']
    out[f'target_progress_stalls_{horizon}m'] = ((out['_future_prog'] - out['phys_prog_n']) < 5).astype('Int64')

    out[f'target_cost_escalation_pct_{horizon}m'] = 100 * (out['_future_cost'] - out['cost_current_n']) / out['cost_current_n'].replace(0, np.nan)
    out[f'target_cost_escalates_{horizon}m'] = (out[f'target_cost_escalation_pct_{horizon}m'] > 2).astype('Int64')

    # valid iff a row actually exists at exactly month+horizon (calendar-correct, not just "horizon rows away")
    out[f'target_valid_{horizon}m'] = out['_future_doc'].notna().astype(int)
    out = out.drop(columns=['_future_doc', '_future_prog', '_future_cost'])
    g = out.groupby('canonical_id', group_keys=False)
    for col in [f'target_further_slip_months_{horizon}m', f'target_schedule_deteriorates_{horizon}m',
                f'target_progress_gain_{horizon}m', f'target_progress_stalls_{horizon}m',
                f'target_cost_escalation_pct_{horizon}m', f'target_cost_escalates_{horizon}m']:
        out.loc[out[f'target_valid_{horizon}m'] == 0, col] = np.nan
    return out

if __name__ == "__main__":
    df = load_base("panel_canonical_long.csv")
    df = build_tier1(df)
    df = build_tier2(df)
    df = build_tier3(df)
    df = build_targets(df, horizon=6)
    df = build_targets(df, horizon=3)
    df.to_csv("feature_table.csv", index=False)
    print("rows:", len(df), "cols:", len(df.columns))
    print(df.columns.tolist())
