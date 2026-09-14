import type { Alert, PeerBenchmark, InterventionPriority } from '@/lib/types';

export const mockAlerts: Alert[] = [
  // PROJ-001 (high, schedule_delay)
  { id: 'ALT-001-1', projectId: 'PROJ-001', type: 'schedule_delay', riskTier: 'high', message: 'Project timeline slipping significantly relative to physical progress. 18-month delay predicted.', firstRaisedMonth: '2026-02', persistenceMonths: 5, isActive: true, reportingMonth: '2026-06' },
  { id: 'ALT-001-2', projectId: 'PROJ-001', type: 'cost_escalation', riskTier: 'medium', message: 'Expenditure velocity accelerating faster than physical progress.', firstRaisedMonth: '2026-04', persistenceMonths: 3, isActive: true, reportingMonth: '2026-06' },
  // PROJ-004 (critical, schedule_delay)
  { id: 'ALT-004-1', projectId: 'PROJ-004', type: 'schedule_delay', riskTier: 'critical', message: 'Critical 36-month schedule slip detected with low confidence in recovery.', firstRaisedMonth: '2025-06', persistenceMonths: 12, leadTimeMonths: 6, isActive: true, reportingMonth: '2026-06' },
  // PROJ-005 (high, schedule_delay)
  { id: 'ALT-005-1', projectId: 'PROJ-005', type: 'schedule_delay', riskTier: 'high', message: 'Clearances delay causing schedule compression risk.', firstRaisedMonth: '2026-05', persistenceMonths: 2, isActive: true, reportingMonth: '2026-06' },
  // PROJ-006 (high, cost_escalation)
  { id: 'ALT-006-1', projectId: 'PROJ-006', type: 'cost_escalation', riskTier: 'high', message: 'Significant cost overrun of 31.6% flagged.', firstRaisedMonth: '2026-01', persistenceMonths: 6, isActive: true, reportingMonth: '2026-06' },
  // PROJ-008 (critical, schedule_delay)
  { id: 'ALT-008-1', projectId: 'PROJ-008', type: 'schedule_delay', riskTier: 'critical', message: 'Progress stalled significantly in winter months; unable to recover timeline.', firstRaisedMonth: '2025-11', persistenceMonths: 8, isActive: true, reportingMonth: '2026-06' },
  { id: 'ALT-008-2', projectId: 'PROJ-008', type: 'cost_escalation', riskTier: 'high', message: '23.5% cost escalation detected.', firstRaisedMonth: '2026-03', persistenceMonths: 4, isActive: true, reportingMonth: '2026-06' },
  // PROJ-010 (high, cost_escalation)
  { id: 'ALT-010-1', projectId: 'PROJ-010', type: 'cost_escalation', riskTier: 'high', message: 'Cost escalation trend exceeding sector norms.', firstRaisedMonth: '2026-04', persistenceMonths: 3, isActive: true, reportingMonth: '2026-06' },
  // PROJ-011 (critical, progress_stall)
  { id: 'ALT-011-1', projectId: 'PROJ-011', type: 'progress_stall', riskTier: 'critical', message: 'Zero physical progress recorded for 8 consecutive months.', firstRaisedMonth: '2025-10', persistenceMonths: 9, leadTimeMonths: 2, isActive: true, reportingMonth: '2026-06' },
  { id: 'ALT-011-2', projectId: 'PROJ-011', type: 'schedule_delay', riskTier: 'critical', message: 'Planned completion date unachievable due to progress stall.', firstRaisedMonth: '2026-01', persistenceMonths: 6, isActive: true, reportingMonth: '2026-06' },
  // PROJ-016 (critical, schedule_delay)
  { id: 'ALT-016-1', projectId: 'PROJ-016', type: 'schedule_delay', riskTier: 'critical', message: 'Initial execution phase severely delayed; only 12% progress achieved.', firstRaisedMonth: '2026-02', persistenceMonths: 5, isActive: true, reportingMonth: '2026-06' },
  // PROJ-018 (high, schedule_delay)
  { id: 'ALT-018-1', projectId: 'PROJ-018', type: 'schedule_delay', riskTier: 'high', message: 'Pre-construction activities lagging behind schedule.', firstRaisedMonth: '2026-05', persistenceMonths: 2, isActive: true, reportingMonth: '2026-06' },
];

export const mockBenchmarks: Record<string, PeerBenchmark> = {
  'PROJ-001': { projectId: 'PROJ-001', sectorProgressPercentile: 15, costBandPercentile: 12, peerGroupSize: 14, peerGroupLabel: 'Mega Railway Projects (>₹10,000 Cr)', sectorAvgProgress: 68, projectProgress: 42, sectorMedianRisk: 45, projectRisk: 72 },
  'PROJ-002': { projectId: 'PROJ-002', sectorProgressPercentile: 85, costBandPercentile: 90, peerGroupSize: 22, peerGroupLabel: 'Mega Highway Projects (>₹10,000 Cr)', sectorAvgProgress: 65, projectProgress: 78, sectorMedianRisk: 42, projectRisk: 28 },
  'PROJ-003': { projectId: 'PROJ-003', sectorProgressPercentile: 92, costBandPercentile: 88, peerGroupSize: 14, peerGroupLabel: 'Mega Railway Projects (>₹10,000 Cr)', sectorAvgProgress: 68, projectProgress: 88, sectorMedianRisk: 45, projectRisk: 45 },
  'PROJ-004': { projectId: 'PROJ-004', sectorProgressPercentile: 5, costBandPercentile: 8, peerGroupSize: 6, peerGroupLabel: 'Nuclear Power Projects', sectorAvgProgress: 45, projectProgress: 24, sectorMedianRisk: 60, projectRisk: 89 },
  'PROJ-005': { projectId: 'PROJ-005', sectorProgressPercentile: 45, costBandPercentile: 40, peerGroupSize: 8, peerGroupLabel: 'Aviation Infra Projects (>₹5,000 Cr)', sectorAvgProgress: 58, projectProgress: 55, sectorMedianRisk: 50, projectRisk: 68 },
  'PROJ-006': { projectId: 'PROJ-006', sectorProgressPercentile: 35, costBandPercentile: 30, peerGroupSize: 22, peerGroupLabel: 'Mega Highway Projects (>₹10,000 Cr)', sectorAvgProgress: 65, projectProgress: 61, sectorMedianRisk: 42, projectRisk: 71 },
  'PROJ-007': { projectId: 'PROJ-007', sectorProgressPercentile: 25, costBandPercentile: 22, peerGroupSize: 12, peerGroupLabel: 'Petrochemical Projects', sectorAvgProgress: 52, projectProgress: 33, sectorMedianRisk: 48, projectRisk: 52 },
  'PROJ-008': { projectId: 'PROJ-008', sectorProgressPercentile: 12, costBandPercentile: 15, peerGroupSize: 34, peerGroupLabel: 'Highway Projects (₹5,000-₹10,000 Cr)', sectorAvgProgress: 55, projectProgress: 38, sectorMedianRisk: 38, projectRisk: 91 },
  'PROJ-009': { projectId: 'PROJ-009', sectorProgressPercentile: 20, costBandPercentile: 25, peerGroupSize: 8, peerGroupLabel: 'Aviation Infra Projects (>₹5,000 Cr)', sectorAvgProgress: 58, projectProgress: 35, sectorMedianRisk: 50, projectRisk: 48 },
  'PROJ-010': { projectId: 'PROJ-010', sectorProgressPercentile: 40, costBandPercentile: 35, peerGroupSize: 10, peerGroupLabel: 'Fertilizer Revival Projects', sectorAvgProgress: 60, projectProgress: 52, sectorMedianRisk: 45, projectRisk: 74 },
  'PROJ-011': { projectId: 'PROJ-011', sectorProgressPercentile: 8, costBandPercentile: 10, peerGroupSize: 18, peerGroupLabel: 'Thermal Power Projects (>₹10,000 Cr)', sectorAvgProgress: 55, projectProgress: 29, sectorMedianRisk: 55, projectRisk: 85 },
  'PROJ-012': { projectId: 'PROJ-012', sectorProgressPercentile: 30, costBandPercentile: 35, peerGroupSize: 15, peerGroupLabel: 'Industrial Corridors', sectorAvgProgress: 35, projectProgress: 15, sectorMedianRisk: 40, projectRisk: 55 },
  'PROJ-013': { projectId: 'PROJ-013', sectorProgressPercentile: 65, costBandPercentile: 60, peerGroupSize: 16, peerGroupLabel: 'Urban Transit Projects', sectorAvgProgress: 68, projectProgress: 72, sectorMedianRisk: 42, projectRisk: 47 },
  'PROJ-014': { projectId: 'PROJ-014', sectorProgressPercentile: 25, costBandPercentile: 28, peerGroupSize: 22, peerGroupLabel: 'Mega Highway Projects (>₹10,000 Cr)', sectorAvgProgress: 65, projectProgress: 22, sectorMedianRisk: 42, projectRisk: 32 },
  'PROJ-015': { projectId: 'PROJ-015', sectorProgressPercentile: 75, costBandPercentile: 70, peerGroupSize: 25, peerGroupLabel: 'Power Projects (<₹10,000 Cr)', sectorAvgProgress: 58, projectProgress: 67, sectorMedianRisk: 35, projectRisk: 25 },
  'PROJ-016': { projectId: 'PROJ-016', sectorProgressPercentile: 5, costBandPercentile: 8, peerGroupSize: 12, peerGroupLabel: 'Hydroelectric Projects', sectorAvgProgress: 42, projectProgress: 12, sectorMedianRisk: 65, projectRisk: 78 },
  'PROJ-017': { projectId: 'PROJ-017', sectorProgressPercentile: 88, costBandPercentile: 85, peerGroupSize: 10, peerGroupLabel: 'Fertilizer Revival Projects', sectorAvgProgress: 60, projectProgress: 81, sectorMedianRisk: 45, projectRisk: 22 },
  'PROJ-018': { projectId: 'PROJ-018', sectorProgressPercentile: 15, costBandPercentile: 18, peerGroupSize: 8, peerGroupLabel: 'Port Infrastructure', sectorAvgProgress: 45, projectProgress: 18, sectorMedianRisk: 55, projectRisk: 58 },
};

export const mockInterventions: InterventionPriority[] = [
  { projectId: 'PROJ-004', priorityScore: 94, riskComponent: 89, impactComponent: 95, persistenceComponent: 98, evidenceComponent: 92, priorityLevel: 'P1', reviewCategory: 'immediate_review', recommendedAction: 'Immediate implementation review and site inspection recommended' },
  { projectId: 'PROJ-008', priorityScore: 92, riskComponent: 91, impactComponent: 85, persistenceComponent: 95, evidenceComponent: 96, priorityLevel: 'P1', reviewCategory: 'immediate_review', recommendedAction: 'Immediate implementation review and site inspection recommended' },
  { projectId: 'PROJ-011', priorityScore: 88, riskComponent: 85, impactComponent: 88, persistenceComponent: 92, evidenceComponent: 85, priorityLevel: 'P1', reviewCategory: 'immediate_review', recommendedAction: 'Immediate implementation review and site inspection recommended' },
  { projectId: 'PROJ-001', priorityScore: 82, riskComponent: 72, impactComponent: 98, persistenceComponent: 80, evidenceComponent: 86, priorityLevel: 'P2', reviewCategory: 'scheduled_review', recommendedAction: 'Schedule formal review in next review cycle; cost audit recommended' },
  { projectId: 'PROJ-006', priorityScore: 76, riskComponent: 71, impactComponent: 78, persistenceComponent: 82, evidenceComponent: 75, priorityLevel: 'P2', reviewCategory: 'scheduled_review', recommendedAction: 'Schedule formal review in next review cycle; cost audit recommended' },
  { projectId: 'PROJ-010', priorityScore: 78, riskComponent: 74, impactComponent: 82, persistenceComponent: 75, evidenceComponent: 80, priorityLevel: 'P2', reviewCategory: 'scheduled_review', recommendedAction: 'Schedule formal review in next review cycle; cost audit recommended' },
  { projectId: 'PROJ-016', priorityScore: 75, riskComponent: 78, impactComponent: 85, persistenceComponent: 70, evidenceComponent: 65, priorityLevel: 'P2', reviewCategory: 'scheduled_review', recommendedAction: 'Schedule formal review in next review cycle; cost audit recommended' },
  { projectId: 'PROJ-005', priorityScore: 68, riskComponent: 68, impactComponent: 75, persistenceComponent: 60, evidenceComponent: 70, priorityLevel: 'P3', reviewCategory: 'monitoring', recommendedAction: 'Continue enhanced monitoring; track progress velocity' },
  { projectId: 'PROJ-007', priorityScore: 55, riskComponent: 52, impactComponent: 72, persistenceComponent: 45, evidenceComponent: 60, priorityLevel: 'P3', reviewCategory: 'monitoring', recommendedAction: 'Continue enhanced monitoring; track progress velocity' },
  { projectId: 'PROJ-012', priorityScore: 58, riskComponent: 55, impactComponent: 68, persistenceComponent: 50, evidenceComponent: 55, priorityLevel: 'P3', reviewCategory: 'monitoring', recommendedAction: 'Continue enhanced monitoring; track progress velocity' },
  { projectId: 'PROJ-018', priorityScore: 62, riskComponent: 58, impactComponent: 85, persistenceComponent: 48, evidenceComponent: 62, priorityLevel: 'P3', reviewCategory: 'monitoring', recommendedAction: 'Continue enhanced monitoring; track progress velocity' },
  { projectId: 'PROJ-003', priorityScore: 42, riskComponent: 45, impactComponent: 85, persistenceComponent: 30, evidenceComponent: 50, priorityLevel: 'P4', reviewCategory: 'watch', recommendedAction: 'Routine monitoring; no immediate action required' },
  { projectId: 'PROJ-009', priorityScore: 45, riskComponent: 48, impactComponent: 75, persistenceComponent: 35, evidenceComponent: 55, priorityLevel: 'P4', reviewCategory: 'watch', recommendedAction: 'Routine monitoring; no immediate action required' },
  { projectId: 'PROJ-013', priorityScore: 40, riskComponent: 47, impactComponent: 55, persistenceComponent: 25, evidenceComponent: 45, priorityLevel: 'P4', reviewCategory: 'watch', recommendedAction: 'Routine monitoring; no immediate action required' },
  { projectId: 'PROJ-014', priorityScore: 32, riskComponent: 32, impactComponent: 65, persistenceComponent: 20, evidenceComponent: 40, priorityLevel: 'P4', reviewCategory: 'watch', recommendedAction: 'Routine monitoring; no immediate action required' },
  { projectId: 'PROJ-002', priorityScore: 25, riskComponent: 28, impactComponent: 92, persistenceComponent: 15, evidenceComponent: 35, priorityLevel: 'P4', reviewCategory: 'watch', recommendedAction: 'Routine monitoring; no immediate action required' },
  { projectId: 'PROJ-015', priorityScore: 20, riskComponent: 25, impactComponent: 45, persistenceComponent: 10, evidenceComponent: 30, priorityLevel: 'P4', reviewCategory: 'watch', recommendedAction: 'Routine monitoring; no immediate action required' },
  { projectId: 'PROJ-017', priorityScore: 18, riskComponent: 22, impactComponent: 50, persistenceComponent: 8, evidenceComponent: 25, priorityLevel: 'P4', reviewCategory: 'watch', recommendedAction: 'Routine monitoring; no immediate action required' },
];
