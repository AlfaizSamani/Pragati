import type { Project, RiskAssessment, ProjectMonthSnapshot, PredictiveSignal, Evidence, Alert, PeerBenchmark, InterventionPriority, ProjectFilters } from '@/lib/types';

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

async function fetchWithSignal<T>(url: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`API ${url} returned ${response.status}`);
    return (await response.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timer);
    // Check for AbortError (works in both browser and Node)
    if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
      throw new Error(`API timeout: ${url} did not respond within ${timeoutMs / 1000}s`);
    }
    throw err;
  }
}

async function apiGet<T>(path: string, timeoutMs = 60000): Promise<T> {
  const primary = getApiBase();
  const url = `${primary}${path}`;
  console.log(`[PRAGATI] Fetching ${url} (timeout: ${timeoutMs / 1000}s)`);
  try {
    const result = await fetchWithSignal<T>(url, timeoutMs);
    console.log(`[PRAGATI] ✅ ${path} loaded successfully`);
    return result;
  } catch (err) {
    console.error(`[PRAGATI] ❌ ${url} failed:`, err);
    // If primary wasn't Render, try Render as fallback
    if (primary !== RENDER_PROD_URL) {
      console.warn(`[PRAGATI] Trying Render fallback for ${path}...`);
      try {
        const result = await fetchWithSignal<T>(`${RENDER_PROD_URL}${path}`, timeoutMs);
        console.log(`[PRAGATI] ✅ Render fallback for ${path} succeeded`);
        return result;
      } catch (fallbackErr) {
        console.error(`[PRAGATI] ❌ Render fallback also failed for ${path}:`, fallbackErr);
        throw fallbackErr;
      }
    }
    throw err;
  }
}

// ── Projects ──────────────────────────────────────────────

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  const projects = await apiGet<Project[]>('/projects');
  console.log(`[PRAGATI] Got ${projects.length} projects`);
  return applyFilters(projects, filters);
}

function applyFilters(projects: Project[], filters?: ProjectFilters): Project[] {
  if (!filters) return projects;
  return projects.filter(project =>
    (!filters.ministry || project.ministry === filters.ministry) &&
    (!filters.sector || project.sector === filters.sector) &&
    (!filters.state || project.state === filters.state) &&
    (!filters.status || project.status === filters.status) &&
    (!filters.searchQuery || `${project.name} ${project.ministry} ${project.sector}`.toLowerCase().includes(filters.searchQuery.toLowerCase())) &&
    (!filters.minCostCrore || project.revisedCostCrore >= filters.minCostCrore) &&
    (!filters.maxCostCrore || project.revisedCostCrore <= filters.maxCostCrore) &&
    (!filters.minProgress || project.physicalProgress >= filters.minProgress) &&
    (!filters.maxProgress || project.physicalProgress <= filters.maxProgress)
  );
}

export async function getProject(id: string): Promise<Project | undefined> {
  return await apiGet<Project>(`/projects/${encodeURIComponent(id)}`);
}

// ── Risk Assessments ──────────────────────────────────────

export async function getProjectRisk(projectId: string): Promise<RiskAssessment | undefined> {
  const assessments = await apiGet<RiskAssessment[]>('/risk-assessments');
  return assessments.find(a => a.projectId === projectId);
}

export async function getAllRiskAssessments(): Promise<RiskAssessment[]> {
  const assessments = await apiGet<RiskAssessment[]>('/risk-assessments');
  console.log(`[PRAGATI] Got ${assessments.length} risk assessments`);
  return assessments;
}

// ── History / Signals / Evidence ──────────────────────────

export async function getProjectHistory(projectId: string): Promise<ProjectMonthSnapshot[]> {
  return await apiGet<ProjectMonthSnapshot[]>(`/projects/${encodeURIComponent(projectId)}/history`);
}

export async function getProjectSignals(projectId: string): Promise<PredictiveSignal[]> {
  return await apiGet<PredictiveSignal[]>(`/projects/${encodeURIComponent(projectId)}/signals`);
}

export async function getProjectEvidence(projectId: string): Promise<Evidence[]> {
  return await apiGet<Evidence[]>(`/projects/${encodeURIComponent(projectId)}/evidence`);
}

// ── Alerts ────────────────────────────────────────────────

export async function getProjectAlerts(projectId: string): Promise<Alert[]> {
  return await apiGet<Alert[]>(`/projects/${encodeURIComponent(projectId)}/alerts`);
}

export async function getAllAlerts(): Promise<Alert[]> {
  const alerts = await apiGet<Alert[]>('/alerts');
  console.log(`[PRAGATI] Got ${alerts.length} alerts`);
  return alerts;
}

// ── Benchmarks & Interventions ────────────────────────────

export async function getProjectBenchmark(projectId: string): Promise<PeerBenchmark | undefined> {
  return await apiGet<PeerBenchmark>(`/projects/${encodeURIComponent(projectId)}/benchmark`);
}

export async function getProjectIntervention(projectId: string): Promise<InterventionPriority | undefined> {
  return await apiGet<InterventionPriority>(`/projects/${encodeURIComponent(projectId)}/intervention`);
}

// ── Trajectories ──────────────────────────────────────────

export async function getAllProjectTrajectories(): Promise<Record<string, ProjectMonthSnapshot[]>> {
  return await apiGet<Record<string, ProjectMonthSnapshot[]>>('/trajectories');
}
