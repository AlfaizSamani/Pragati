import type { PortfolioSummary, StateRiskSummary, InterventionPriority, RiskAssessment } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const raw = await fetch(`${API_BASE}/portfolio/summary`, { cache: 'no-store' }).then(r => r.json());
  const riskDistribution = { low: raw.tier_counts?.Low || 0, medium: raw.tier_counts?.Medium || 0, high: raw.tier_counts?.High || 0, critical: raw.tier_counts?.Critical || 0 };
  return {
    totalProjects: raw.total_projects,
    highRiskCount: raw.high_risk_count,
    criticalRiskCount: raw.critical_risk_count,
    avgPhysicalProgress: raw.avg_physical_progress,
    totalOriginalCostLakhCrore: Number(raw.total_original_cost_cr || 0) / 100000,
    totalRevisedCostLakhCrore: Number(raw.total_cost_current_cr || 0) / 100000,
    totalExpenditureLakhCrore: Number(raw.total_expenditure_cr || 0) / 100000,
    interventionQueueSize: Number(raw.total_projects || 0),
    newWarnings: Number(raw.high_risk_count || 0),
    riskDistribution,
    sectorBreakdown: raw.sector_breakdown || [],
    ministryBreakdown: raw.ministry_breakdown || [],
    reportingMonth: raw.month,
  };
}

export async function getStateRiskSummaries(): Promise<StateRiskSummary[]> {
  return fetch(`${API_BASE}/state-summary`, { cache: 'no-store' }).then(r => r.json());
}

export async function getInterventionQueue(): Promise<InterventionPriority[]> {
  const records = await fetch(`${API_BASE}/interventions`, { cache: 'no-store' }).then(r => r.json()) as Array<Record<string, unknown>>;
  return records.map(record => ({
    projectId: String(record.projectId), priorityScore: Number(record.priorityScore || 0), riskComponent: Number(record.riskScore || 0), impactComponent: Number(record.peerRiskPercentile || 0), persistenceComponent: Math.min(100, Number(record.stallStreakMonths || 0) * 10), evidenceComponent: Number(record.confidence || 0.5) * 100,
    priorityLevel: Number(record.priorityScore || 0) >= 80 ? 'P1' : Number(record.priorityScore || 0) >= 60 ? 'P2' : Number(record.priorityScore || 0) >= 40 ? 'P3' : 'P4',
    reviewCategory: Number(record.priorityScore || 0) >= 80 ? 'immediate_review' : Number(record.priorityScore || 0) >= 60 ? 'scheduled_review' : Number(record.priorityScore || 0) >= 40 ? 'monitoring' : 'watch',
    recommendedAction: String(record.recommendedReview || 'Review current project evidence.'),
  }));
}

export async function getHighRiskAssessments(): Promise<RiskAssessment[]> {
  const response = await fetch(`${API_BASE}/risk-assessments`, { cache: 'no-store' });
  const assessments = await response.json() as RiskAssessment[];
  return assessments.filter(r => r.riskTier === 'high' || r.riskTier === 'critical').sort((a, b) => b.riskScore - a.riskScore);
}
