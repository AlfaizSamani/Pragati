import type { PredictiveSignal, Evidence } from '@/lib/types';

export const mockSignals: Record<string, PredictiveSignal[]> = {
  'PROJ-001': [
    { featureName: 'time_elapsed_ratio', displayLabel: 'Time Elapsed vs. Planned Duration', currentValue: '78%', shapContribution: 0.32, direction: 'increases_risk', rank: 1 },
    { featureName: 'progress_time_gap', displayLabel: 'Progress-vs-Time Gap', currentValue: '36 percentage points', shapContribution: 0.28, direction: 'increases_risk', rank: 2 },
    { featureName: 'schedule_slip_months', displayLabel: 'Schedule Slip to Date', currentValue: '18 months', shapContribution: 0.22, direction: 'increases_risk', rank: 3 },
    { featureName: 'expenditure_velocity', displayLabel: 'Expenditure Velocity (3-month)', currentValue: '₹1,240 Cr/month', shapContribution: -0.08, direction: 'decreases_risk', rank: 4 },
    { featureName: 'cost_utilization_ratio', displayLabel: 'Cost Utilization Ratio', currentValue: '32.4%', shapContribution: 0.15, direction: 'increases_risk', rank: 5 },
  ],
  'PROJ-004': [
    { featureName: 'schedule_slip_months', displayLabel: 'Schedule Slip to Date', currentValue: '36 months', shapContribution: 0.45, direction: 'increases_risk', rank: 1 },
    { featureName: 'physical_progress_stall', displayLabel: 'Physical Progress Stall', currentValue: '6 months with <1% progress', shapContribution: 0.38, direction: 'increases_risk', rank: 2 },
    { featureName: 'cost_utilization_ratio', displayLabel: 'Cost Utilization Ratio', currentValue: '21.4%', shapContribution: 0.20, direction: 'increases_risk', rank: 3 },
    { featureName: 'agency_portfolio_risk', displayLabel: 'Agency Portfolio Risk', currentValue: 'High historical delay', shapContribution: 0.15, direction: 'increases_risk', rank: 4 },
    { featureName: 'expenditure_velocity', displayLabel: 'Expenditure Velocity (3-month)', currentValue: '₹120 Cr/month', shapContribution: 0.12, direction: 'increases_risk', rank: 5 },
  ],
  'PROJ-006': [
    { featureName: 'cost_escalation_pct', displayLabel: 'Cost Escalation Percentage', currentValue: '31.6%', shapContribution: 0.41, direction: 'increases_risk', rank: 1 },
    { featureName: 'expenditure_to_progress_ratio', displayLabel: 'Expenditure to Progress Ratio', currentValue: '1.2x expected', shapContribution: 0.33, direction: 'increases_risk', rank: 2 },
    { featureName: 'geographic_complexity', displayLabel: 'Terrain/Geographic Risk', currentValue: 'Himalayan Zone', shapContribution: 0.25, direction: 'increases_risk', rank: 3 },
    { featureName: 'time_elapsed_ratio', displayLabel: 'Time Elapsed vs. Planned Duration', currentValue: '85%', shapContribution: 0.18, direction: 'increases_risk', rank: 4 },
  ],
  'PROJ-008': [
    { featureName: 'schedule_slip_months', displayLabel: 'Schedule Slip to Date', currentValue: '30 months', shapContribution: 0.42, direction: 'increases_risk', rank: 1 },
    { featureName: 'progress_time_gap', displayLabel: 'Progress-vs-Time Gap', currentValue: '42 percentage points', shapContribution: 0.35, direction: 'increases_risk', rank: 2 },
    { featureName: 'cost_escalation_pct', displayLabel: 'Cost Escalation Percentage', currentValue: '23.5%', shapContribution: 0.28, direction: 'increases_risk', rank: 3 },
    { featureName: 'environmental_clearance_status', displayLabel: 'Environmental Clearances', currentValue: 'Partial/Pending', shapContribution: 0.22, direction: 'increases_risk', rank: 4 },
  ],
  'PROJ-010': [
    { featureName: 'cost_escalation_pct', displayLabel: 'Cost Escalation Percentage', currentValue: '26.9%', shapContribution: 0.39, direction: 'increases_risk', rank: 1 },
    { featureName: 'expenditure_to_progress_ratio', displayLabel: 'Expenditure to Progress Ratio', currentValue: '1.15x expected', shapContribution: 0.27, direction: 'increases_risk', rank: 2 },
    { featureName: 'time_elapsed_ratio', displayLabel: 'Time Elapsed vs. Planned Duration', currentValue: '90%', shapContribution: 0.21, direction: 'increases_risk', rank: 3 },
    { featureName: 'recent_progress_velocity', displayLabel: 'Recent Progress Velocity', currentValue: '1.5% per month', shapContribution: -0.12, direction: 'decreases_risk', rank: 4 },
  ],
  'PROJ-011': [
    { featureName: 'physical_progress_stall', displayLabel: 'Physical Progress Stall', currentValue: '8 months with 0% progress', shapContribution: 0.48, direction: 'increases_risk', rank: 1 },
    { featureName: 'schedule_slip_months', displayLabel: 'Schedule Slip to Date', currentValue: '30 months', shapContribution: 0.36, direction: 'increases_risk', rank: 2 },
    { featureName: 'cost_escalation_pct', displayLabel: 'Cost Escalation Percentage', currentValue: '20.0%', shapContribution: 0.24, direction: 'increases_risk', rank: 3 },
    { featureName: 'expenditure_velocity', displayLabel: 'Expenditure Velocity (3-month)', currentValue: '₹0 Cr/month', shapContribution: 0.19, direction: 'increases_risk', rank: 4 },
  ]
};

export const mockEvidence: Record<string, Evidence[]> = {
  'PROJ-001': [
    { id: 'EV-001-1', projectId: 'PROJ-001', type: 'project_field', claim: 'Physical progress (42%) significantly lags time elapsed (78% of revised duration)', sourceField: 'physical_progress', sourceValue: 42, reportingMonth: '2026-06' },
    { id: 'EV-001-2', projectId: 'PROJ-001', type: 'project_field', claim: 'Revised cost increased by ₹10,000 Cr (+9.3%) from original estimate', sourceField: 'revised_cost', sourceValue: 118000, reportingMonth: '2026-06' },
    { id: 'EV-001-3', projectId: 'PROJ-001', type: 'benchmark', claim: 'Project progress is in the bottom 15th percentile of Railway mega-projects', sourceField: 'sector_progress_percentile', sourceValue: 15, reportingMonth: '2026-06' },
    { id: 'EV-001-4', projectId: 'PROJ-001', type: 'project_field', claim: 'Target completion date pushed back by 18 months', sourceField: 'revised_completion_date', sourceValue: '2030-06-30', reportingMonth: '2026-06' }
  ],
  'PROJ-004': [
    { id: 'EV-004-1', projectId: 'PROJ-004', type: 'project_field', claim: 'Only 24% physical progress achieved over 5+ years of execution', sourceField: 'physical_progress', sourceValue: 24, reportingMonth: '2026-06' },
    { id: 'EV-004-2', projectId: 'PROJ-004', type: 'project_field', claim: 'Target completion date delayed by 36 months to Dec 2030', sourceField: 'revised_completion_date', sourceValue: '2030-12-31', reportingMonth: '2026-06' },
    { id: 'EV-004-3', projectId: 'PROJ-004', type: 'project_field', claim: 'Revised cost escalated by ₹7,200 Cr (+22.5%)', sourceField: 'revised_cost', sourceValue: 39200, reportingMonth: '2026-06' },
    { id: 'EV-004-4', projectId: 'PROJ-004', type: 'alert_history', claim: 'Schedule delay alert has persisted for 12 consecutive months', sourceField: 'persistence_months', sourceValue: 12, reportingMonth: '2026-06' }
  ],
  'PROJ-006': [
    { id: 'EV-006-1', projectId: 'PROJ-006', type: 'project_field', claim: 'Cost escalated by ₹3,800 Cr (+31.6% over original estimate)', sourceField: 'revised_cost', sourceValue: 15800, reportingMonth: '2026-06' },
    { id: 'EV-006-2', projectId: 'PROJ-006', type: 'project_field', claim: 'Schedule slipped by 21 months', sourceField: 'revised_completion_date', sourceValue: '2027-12-31', reportingMonth: '2026-06' },
    { id: 'EV-006-3', projectId: 'PROJ-006', type: 'benchmark', claim: 'Cost escalation is higher than 85% of highway projects in similar terrain', sourceField: 'cost_escalation_pct', sourceValue: 31.6, reportingMonth: '2026-06' }
  ],
  'PROJ-008': [
    { id: 'EV-008-1', projectId: 'PROJ-008', type: 'project_field', claim: 'Schedule slipped by 30 months from initial target of Sep 2026', sourceField: 'revised_completion_date', sourceValue: '2029-03-31', reportingMonth: '2026-06' },
    { id: 'EV-008-2', projectId: 'PROJ-008', type: 'project_field', claim: 'Cost increased by ₹1,600 Cr (+23.5%)', sourceField: 'revised_cost', sourceValue: 8400, reportingMonth: '2026-06' },
    { id: 'EV-008-3', projectId: 'PROJ-008', type: 'project_field', claim: 'Physical progress is only 38% despite 45% cost utilization', sourceField: 'physical_progress', sourceValue: 38, reportingMonth: '2026-06' },
    { id: 'EV-008-4', projectId: 'PROJ-008', type: 'alert_history', claim: 'Critical risk alert active for 8 months', sourceField: 'persistence_months', sourceValue: 8, reportingMonth: '2026-06' }
  ],
  'PROJ-010': [
    { id: 'EV-010-1', projectId: 'PROJ-010', type: 'project_field', claim: 'Cost increased by ₹3,500 Cr (+26.9%)', sourceField: 'revised_cost', sourceValue: 16500, reportingMonth: '2026-06' },
    { id: 'EV-010-2', projectId: 'PROJ-010', type: 'project_field', claim: 'Schedule delayed by 18 months', sourceField: 'revised_completion_date', sourceValue: '2027-06-30', reportingMonth: '2026-06' },
    { id: 'EV-010-3', projectId: 'PROJ-010', type: 'benchmark', claim: 'Cost escalation exceeds sector median by 14%', sourceField: 'cost_escalation_pct', sourceValue: 26.9, reportingMonth: '2026-06' }
  ],
  'PROJ-011': [
    { id: 'EV-011-1', projectId: 'PROJ-011', type: 'project_field', claim: 'Zero physical progress recorded over the last 8 months', sourceField: 'physical_progress', sourceValue: 29, reportingMonth: '2026-06' },
    { id: 'EV-011-2', projectId: 'PROJ-011', type: 'project_field', claim: 'Zero expenditure recorded over the last 3 months', sourceField: 'expenditure', sourceValue: 5800, reportingMonth: '2026-06' },
    { id: 'EV-011-3', projectId: 'PROJ-011', type: 'project_field', claim: 'Schedule delayed by 30 months', sourceField: 'revised_completion_date', sourceValue: '2029-09-30', reportingMonth: '2026-06' },
    { id: 'EV-011-4', projectId: 'PROJ-011', type: 'alert_history', claim: 'Progress stall alert has been active for 5 consecutive months', sourceField: 'persistence_months', sourceValue: 5, reportingMonth: '2026-06' }
  ]
};
