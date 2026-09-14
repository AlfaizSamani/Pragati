import type { PortfolioSummary, StateRiskSummary, InterventionPriority, RiskAssessment } from '@/lib/types';

const RENDER_PROD_URL = 'https://pragati-wuh7.onrender.com';

function getApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:' && envUrl?.startsWith('http://localhost')) {
      return RENDER_PROD_URL;
    }
  }
  if (!envUrl) return RENDER_PROD_URL;
  return envUrl.replace(/\/+$/, '');
}

async function fetchWithTimeout(path: string, timeoutMs = 60000): Promise<Response> {
  const primary = getApiBase();
  const url = `${primary}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  console.log(`[PRAGATI] Fetching ${url} (timeout: ${timeoutMs / 1000}s)`);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok && primary !== RENDER_PROD_URL) {
      console.warn(`[PRAGATI] ${url} returned ${res.status}, trying Render fallback...`);
      return await fetch(`${RENDER_PROD_URL}${path}`, { cache: 'no-store' });
    }
    return res;
  } catch (err: unknown) {
    clearTimeout(timer);
    // Check for AbortError (works in both browser and Node)
    const isAbort = err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError';
    if (isAbort) {
      const timeoutErr = new Error(`API timeout: ${url} did not respond within ${timeoutMs / 1000}s`);
      console.error(`[PRAGATI] ❌`, timeoutErr.message);
      if (primary !== RENDER_PROD_URL) {
        console.warn(`[PRAGATI] Trying Render fallback for ${path}...`);
        return await fetch(`${RENDER_PROD_URL}${path}`, { cache: 'no-store' });
      }
      throw timeoutErr;
    }
    console.error(`[PRAGATI] ❌ Fetch failed: ${url}`, err);
    if (primary !== RENDER_PROD_URL) {
      console.warn(`[PRAGATI] Trying Render fallback for ${path}...`);
      try {
        return await fetch(`${RENDER_PROD_URL}${path}`, { cache: 'no-store' });
      } catch (fallbackErr) {
        console.error(`[PRAGATI] ❌ Render fallback also failed for ${path}`, fallbackErr);
        throw fallbackErr;
      }
    }
    throw err;
  }
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const res = await fetchWithTimeout('/portfolio/summary');
  if (!res.ok) throw new Error(`Portfolio summary returned ${res.status}`);
  const raw = await res.json();
  console.log(`[PRAGATI] ✅ Portfolio summary loaded: ${raw.total_projects} projects`);
  const riskDistribution = {
    low: raw.tier_counts?.Low || 0,
    medium: raw.tier_counts?.Medium || 0,
    high: raw.tier_counts?.High || 0,
    critical: raw.tier_counts?.Critical || 0,
  };
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
  const res = await fetchWithTimeout('/state-summary');
  if (!res.ok) throw new Error(`State summary returned ${res.status}`);
  const data = await res.json();
  console.log(`[PRAGATI] ✅ State summaries loaded: ${Array.isArray(data) ? data.length : 0} states`);
  if (Array.isArray(data) && data.length > 0) return data;
  throw new Error('State summary returned empty array');
}

export async function getInterventionQueue(): Promise<InterventionPriority[]> {
  const res = await fetchWithTimeout('/interventions');
  if (!res.ok) throw new Error(`Interventions returned ${res.status}`);
  const records = (await res.json()) as Array<Record<string, unknown>>;
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('Interventions returned empty array');
  }
  console.log(`[PRAGATI] ✅ Intervention queue loaded: ${records.length} records`);
  return records.map(record => ({
    projectId: String(record.projectId),
    priorityScore: Number(record.priorityScore || 0),
    riskComponent: Number(record.riskScore || 0),
    impactComponent: Number(record.peerRiskPercentile || 0),
    persistenceComponent: Math.min(100, Number(record.stallStreakMonths || 0) * 10),
    evidenceComponent: Number(record.confidence || 0.5) * 100,
    priorityLevel: Number(record.priorityScore || 0) >= 80 ? 'P1' : Number(record.priorityScore || 0) >= 60 ? 'P2' : Number(record.priorityScore || 0) >= 40 ? 'P3' : 'P4',
    reviewCategory: Number(record.priorityScore || 0) >= 80 ? 'immediate_review' : Number(record.priorityScore || 0) >= 60 ? 'scheduled_review' : Number(record.priorityScore || 0) >= 40 ? 'monitoring' : 'watch',
    recommendedAction: String(record.recommendedReview || 'Review current project evidence.'),
  }));
}

export async function getHighRiskAssessments(): Promise<RiskAssessment[]> {
  const response = await fetchWithTimeout('/risk-assessments');
  if (!response.ok) throw new Error(`Risk assessments returned ${response.status}`);
  const assessments = (await response.json()) as RiskAssessment[];
  console.log(`[PRAGATI] ✅ High risk assessments loaded: ${assessments.length} total`);
  if (Array.isArray(assessments) && assessments.length > 0) {
    return assessments.filter(r => r.riskTier === 'high' || r.riskTier === 'critical').sort((a, b) => b.riskScore - a.riskScore);
  }
  throw new Error('Risk assessments returned empty array');
}
