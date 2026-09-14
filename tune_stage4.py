"""
PAIMANA Sentinel — Stage 4: Model tuning
Grouped (by canonical_id) K-fold CV on the TRAIN set only (test set never touched during search).
Optuna optimizes PR-AUC. Explicit GBDT vs DART comparison, not just whichever Optuna happens to pick.
"""
import numpy as np
import pandas as pd
import lightgbm as lgb
import optuna
import json
from sklearn.model_selection import GroupKFold
from sklearn.metrics import average_precision_score, roc_auc_score, brier_score_loss
from sklearn.linear_model import LogisticRegression

optuna.logging.set_verbosity(optuna.logging.WARNING)
RNG = 42

exec(open('train_stage3.py').read().split("if __name__")[0])  # reuse load_and_filter, ENHANCED_*, prep_xy, temporal_split

def cv_score(params, boosting_type, train, num_cols, cat_cols, n_splits=4):
    X, y = prep_xy(train, num_cols, cat_cols)
    groups = train['canonical_id'].values
    gkf = GroupKFold(n_splits=n_splits)
    scores = []
    for fold, (tr_idx, va_idx) in enumerate(gkf.split(X, y, groups)):
        Xtr, ytr = X.iloc[tr_idx], y.iloc[tr_idx]
        Xva, yva = X.iloc[va_idx], y.iloc[va_idx]
        if ytr.sum() < 5 or yva.sum() < 3:
            continue
        model = lgb.LGBMClassifier(boosting_type=boosting_type, class_weight='balanced',
                                    random_state=RNG, verbose=-1, n_estimators=300, **params)
        model.fit(Xtr, ytr)
        pred = model.predict_proba(Xva)[:, 1]
        scores.append(average_precision_score(yva, pred))
    return float(np.mean(scores)) if scores else 0.0

def objective(trial, train, num_cols, cat_cols):
    boosting_type = trial.suggest_categorical('boosting_type', ['gbdt', 'dart'])
    params = dict(
        max_depth=trial.suggest_int('max_depth', 3, 7),
        num_leaves=trial.suggest_int('num_leaves', 7, 63),
        learning_rate=trial.suggest_float('learning_rate', 0.01, 0.15, log=True),
        subsample=trial.suggest_float('subsample', 0.6, 1.0),
        colsample_bytree=trial.suggest_float('colsample_bytree', 0.6, 1.0),
        reg_alpha=trial.suggest_float('reg_alpha', 0.0, 2.0),
        reg_lambda=trial.suggest_float('reg_lambda', 0.0, 2.0),
        min_child_samples=trial.suggest_int('min_child_samples', 10, 50),
    )
    return cv_score(params, boosting_type, train, num_cols, cat_cols)

def run_search(train, num_cols, cat_cols, n_trials=50, fixed_boosting=None):
    study = optuna.create_study(direction='maximize', sampler=optuna.samplers.TPESampler(seed=RNG))
    def obj(trial):
        if fixed_boosting:
            trial.set_user_attr('forced', fixed_boosting)
            params = dict(
                max_depth=trial.suggest_int('max_depth', 3, 7),
                num_leaves=trial.suggest_int('num_leaves', 7, 63),
                learning_rate=trial.suggest_float('learning_rate', 0.01, 0.15, log=True),
                subsample=trial.suggest_float('subsample', 0.6, 1.0),
                colsample_bytree=trial.suggest_float('colsample_bytree', 0.6, 1.0),
                reg_alpha=trial.suggest_float('reg_alpha', 0.0, 2.0),
                reg_lambda=trial.suggest_float('reg_lambda', 0.0, 2.0),
                min_child_samples=trial.suggest_int('min_child_samples', 10, 50),
            )
            return cv_score(params, fixed_boosting, train, num_cols, cat_cols)
        return objective(trial, train, num_cols, cat_cols)
    study.optimize(obj, n_trials=n_trials, show_progress_bar=False)
    return study

def final_train_eval(best_params, boosting_type, train, test, num_cols, cat_cols, label):
    Xtr, ytr = prep_xy(train, num_cols, cat_cols)
    Xte, yte = prep_xy(test, num_cols, cat_cols)
    rng = np.random.RandomState(RNG)
    groups = train['canonical_id'].unique()
    rng.shuffle(groups)
    n_holdout = max(1, int(0.15 * len(groups)))
    holdout_groups = set(groups[:n_holdout])
    is_holdout = train['canonical_id'].isin(holdout_groups)
    Xfit, yfit = Xtr[~is_holdout.values], ytr[~is_holdout.values]
    Xes, yes = Xtr[is_holdout.values], ytr[is_holdout.values]

    model = lgb.LGBMClassifier(boosting_type=boosting_type, n_estimators=500,
                                class_weight='balanced', random_state=RNG, verbose=-1, **best_params)
    if boosting_type == 'dart':
        model.fit(Xfit, yfit)  # DART doesn't support early stopping the same way
    else:
        model.fit(Xfit, yfit, eval_set=[(Xes, yes)], callbacks=[lgb.early_stopping(30, verbose=False)])

    raw_test = model.predict_proba(Xte)[:, 1]
    raw_es = model.predict_proba(Xes)[:, 1]
    platt = LogisticRegression()
    platt.fit(raw_es.reshape(-1, 1), yes)
    cal_test = platt.predict_proba(raw_test.reshape(-1, 1))[:, 1]

    row = dict(roc_auc=round(roc_auc_score(yte, cal_test), 3),
               pr_auc=round(average_precision_score(yte, cal_test), 3),
               brier=round(brier_score_loss(yte, cal_test), 3))
    test_out = test.copy(); test_out['pred'] = cal_test
    proj = test_out.groupby('canonical_id').agg(y_true=(test.columns[test.columns.get_loc('target_at_risk_6m')], 'max') if 'target_at_risk_6m' in test.columns else None,
                                                 pred=('pred', 'max'))
    print(f"[{label}] row: {row}")
    return model, row, cal_test

if __name__ == "__main__":
    full_df, model_df = load_and_filter()
    train, test = temporal_split(model_df)

    print("=== Searching GBDT-only ===")
    study_gbdt = run_search(train, ENHANCED_NUM, ENHANCED_CAT, n_trials=40, fixed_boosting='gbdt')
    print("Best GBDT CV PR-AUC:", study_gbdt.best_value, study_gbdt.best_params)

    print("\n=== Searching DART-only ===")
    study_dart = run_search(train, ENHANCED_NUM, ENHANCED_CAT, n_trials=40, fixed_boosting='dart')
    print("Best DART CV PR-AUC:", study_dart.best_value, study_dart.best_params)

    print("\n=== Final holdout evaluation ===")
    model_gbdt, row_gbdt, pred_gbdt = final_train_eval(study_gbdt.best_params, 'gbdt', train, test, ENHANCED_NUM, ENHANCED_CAT, "Tuned GBDT")
    model_dart, row_dart, pred_dart = final_train_eval(study_dart.best_params, 'dart', train, test, ENHANCED_NUM, ENHANCED_CAT, "Tuned DART")

    results = dict(
        gbdt_cv_prauc=study_gbdt.best_value, gbdt_params=study_gbdt.best_params, gbdt_test=row_gbdt,
        dart_cv_prauc=study_dart.best_value, dart_params=study_dart.best_params, dart_test=row_dart,
        stage3_default_test=dict(roc_auc=0.881, pr_auc=0.802, brier=0.140),
    )
    with open("stage4_tuning_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    print(json.dumps(results, indent=2, default=str))
