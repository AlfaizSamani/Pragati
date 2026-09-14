"""
PAIMANA Sentinel — Stage 3b: standalone Cost Overrun and Time Overrun models
(PS outcomes a & b, kept separate from the Stage 3 composite target_at_risk model)
"""
import numpy as np
import pandas as pd
import lightgbm as lgb
import json
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss
from sklearn.linear_model import LogisticRegression

RNG = 42

ENHANCED_NUM = [
    'cost_original_n', 'cost_current_n', 'cum_exp_n', 'phys_prog_n',
    'elapsed_months', 'planned_duration_months', 'time_elapsed_ratio',
    'cost_utilization_ratio', 'cost_escalation_pct_to_date', 'progress_vs_time_gap',
    'schedule_slip_months_to_date', 'is_overdue_original', 'is_overdue_current',
    'has_been_cost_revised', 'has_been_schedule_revised',
    'progress_velocity_1m', 'progress_velocity_3m', 'progress_accel_1m',
    'expenditure_velocity_1m', 'cost_revision_count_to_date', 'schedule_revision_count_to_date',
    'months_since_last_cost_revision', 'months_since_last_schedule_revision', 'obs_index',
    'sector_peer_progress_percentile', 'sector_peer_divergence_percentile',
    'agency_hist_overdue_rate', 'ministry_newly_reporting_flag',
    'is_fiscal_year_end', 'stall_streak_months',
]
ENHANCED_CAT = ['sector', 'ministry', 'agency_capped', 'state_capped']

def load_base():
    df = pd.read_csv("feature_table.csv", low_memory=False)
    df['month_num'] = df['month_p'].apply(lambda s: int(str(s).split('-')[1]))
    df['is_fiscal_year_end'] = df['month_num'].isin([1, 2, 3]).astype(int)

    # new feature 2: stall streak - CALENDAR-correct: accumulate actual gap_months while velocity stays low,
    # not +1 per row (a row-count streak would understate a stall that spans a reporting gap)
    def stall_streak_calendar(velocities, gaps):
        out, streak = [], 0
        for v, gap in zip(velocities, gaps):
            g = gap if pd.notna(gap) else 1
            if pd.notna(v) and v < 1:
                streak += g
            elif pd.notna(v):
                streak = 0
            else:
                streak = np.nan if streak == 0 else streak
            out.append(streak)
        return out
    df = df.sort_values(['canonical_id', 'month_p'])
    df['stall_streak_months'] = df.groupby('canonical_id', group_keys=False).apply(
        lambda d: pd.Series(stall_streak_calendar(d['progress_velocity_1m'].tolist(), d['gap_months'].tolist()), index=d.index))
    # FIX (bounded re-check, same class as train_stage3.py's already-fixed leak): cap using
    # TRAIN-ONLY frequency (<=2026-01), not the full dataset including test months.
    train_only = df[df['report_month'] <= '2026-01']
    for col, topn in [('agency', 20), ('state', 25)]:
        top = train_only[col].value_counts().nlargest(topn).index
        df[col + '_capped'] = df[col].where(df[col].isin(top), other='OTHER')
    return df

def prep_xy(df, target_col):
    X = df[ENHANCED_NUM + ENHANCED_CAT].copy()
    for c in ENHANCED_CAT:
        X[c] = X[c].astype('category')
    y = df[target_col].astype(int)
    return X, y

def temporal_split(df, horizon, test_months):
    months = sorted(df['report_month'].unique())
    train_months = [m for m in months if m not in test_months]
    return df[df['report_month'].isin(train_months)], df[df['report_month'].isin(test_months)]

def naive_baseline(train, test, target_col):
    sector_rate = train.groupby('sector')[target_col].mean()
    overall_rate = train[target_col].mean()
    return test['sector'].map(sector_rate).fillna(overall_rate).values

def train_and_eval(df, horizon, target_col, test_months, label):
    valid = df[(df[f'target_valid_{horizon}m'] == 1) & (df['obs_index'] >= 3) & (df['dq_flag_any'] == 0)].copy()
    valid[target_col] = valid[target_col].astype(int)
    train, test = temporal_split(valid, horizon, test_months)
    if train[target_col].sum() < 10 or test[target_col].sum() < 3:
        print(f"[{label}] SKIPPED - too few positive examples (train pos={train[target_col].sum()}, test pos={test[target_col].sum()})")
        return None

    naive_pred = naive_baseline(train, test, target_col)

    Xtr, ytr = prep_xy(train, target_col)
    Xte, yte = prep_xy(test, target_col)
    rng = np.random.RandomState(RNG)
    groups = train['canonical_id'].unique()
    rng.shuffle(groups)
    n_holdout = max(1, int(0.15 * len(groups)))
    holdout_groups = set(groups[:n_holdout])
    is_holdout = train['canonical_id'].isin(holdout_groups)
    Xfit, yfit = Xtr[~is_holdout.values], ytr[~is_holdout.values]
    Xes, yes = Xtr[is_holdout.values], ytr[is_holdout.values]
    if yfit.sum() < 5 or yes.sum() < 2:
        print(f"[{label}] SKIPPED - too few positives after grouped holdout split")
        return None

    model = lgb.LGBMClassifier(
        n_estimators=500, max_depth=4, num_leaves=15, learning_rate=0.03,
        subsample=0.8, colsample_bytree=0.8, reg_alpha=0.5, reg_lambda=0.5,
        min_child_samples=15, class_weight='balanced', random_state=RNG, verbose=-1,
    )
    model.fit(Xfit, yfit, eval_set=[(Xes, yes)], callbacks=[lgb.early_stopping(30, verbose=False)])

    raw_test = model.predict_proba(Xte)[:, 1]
    raw_es = model.predict_proba(Xes)[:, 1]
    platt = LogisticRegression()
    platt.fit(raw_es.reshape(-1, 1), yes)
    cal_test = platt.predict_proba(raw_test.reshape(-1, 1))[:, 1]

    def metrics(y_true, y_pred):
        return dict(
            roc_auc=round(roc_auc_score(y_true, y_pred), 3),
            pr_auc=round(average_precision_score(y_true, y_pred), 3),
            brier=round(brier_score_loss(y_true, y_pred), 3),
            base_rate=round(float(y_true.mean()), 3),
            n=int(len(y_true)), n_pos=int(y_true.sum()),
        )

    row_naive = metrics(yte.values, naive_pred)
    row_model = metrics(yte.values, cal_test)

    test_out = test.copy()
    test_out['pred'] = cal_test
    test_out['pred_naive'] = naive_pred
    proj = test_out.groupby('canonical_id').agg(y_true=(target_col, 'max'), pred=('pred', 'max'), pred_naive=('pred_naive', 'max'))
    proj_model = metrics(proj['y_true'].values, proj['pred'].values)
    proj_naive = metrics(proj['y_true'].values, proj['pred_naive'].values)

    print(f"[{label}] row  naive={row_naive}  model={row_model}")
    print(f"[{label}] proj naive={proj_naive}  model={proj_model}")
    return dict(label=label, row_naive=row_naive, row_model=row_model, proj_naive=proj_naive, proj_model=proj_model,
                model_obj=model, test_predictions=test_out[['canonical_id','report_month','pred','pred_naive']].copy())

if __name__ == "__main__":
    df = load_base()
    results = {}
    results['cost_6m'] = train_and_eval(df, 6, 'target_cost_escalates_6m', ['2025-11', '2025-12'], "Cost Overrun, 6m horizon")
    results['schedule_6m'] = train_and_eval(df, 6, 'target_schedule_deteriorates_6m', ['2025-11', '2025-12'], "Time Overrun, 6m horizon")
    results['cost_3m'] = train_and_eval(df, 3, 'target_cost_escalates_3m', ['2026-02', '2026-03'], "Cost Overrun, 3m horizon")
    results['schedule_3m'] = train_and_eval(df, 3, 'target_schedule_deteriorates_3m', ['2026-02', '2026-03'], "Time Overrun, 3m horizon")

    with open("stage3b_results.json", "w") as f:
        json.dump({k: {kk: vv for kk, vv in v.items() if kk not in ('model_obj', 'test_predictions')}
                   for k, v in results.items() if v is not None}, f, indent=2)
    print("\nSaved stage3b_results.json")
