import type { Project, RiskAssessment, ProjectMonthSnapshot, PredictiveSignal, Evidence, Alert, PeerBenchmark, InterventionPriority, ProjectFilters } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const projects = await apiGet<Project[]>('/projects');
    return applyFilters(projects, filters);
  } catch {
    throw new Error('Live project API is unavailable. Start api_service.py.');
  }
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
  try {
    return await apiGet<Project>(`/projects/${encodeURIComponent(id)}`);
  } catch {
    return undefined;
  }
}

export async function getProjectRisk(projectId: string): Promise<RiskAssessment | undefined> {
  try {
    const assessments = await apiGet<RiskAssessment[]>('/risk-assessments');
    return assessments.find(assessment => assessment.projectId === projectId);
  } catch {
    return undefined;
  }
}

export async function getAllRiskAssessments(): Promise<RiskAssessment[]> {
  try {
    return await apiGet<RiskAssessment[]>('/risk-assessments');
  } catch {
    return [];
  }
}

export async function getProjectHistory(projectId: string): Promise<ProjectMonthSnapshot[]> {
  try { return await apiGet<ProjectMonthSnapshot[]>(`/projects/${encodeURIComponent(projectId)}/history`); } catch { return []; }
}

export async function getProjectSignals(projectId: string): Promise<PredictiveSignal[]> {
  try { return await apiGet<PredictiveSignal[]>(`/projects/${encodeURIComponent(projectId)}/signals`); } catch { return []; }
}

export async function getProjectEvidence(projectId: string): Promise<Evidence[]> {
  try { return await apiGet<Evidence[]>(`/projects/${encodeURIComponent(projectId)}/evidence`); } catch { return []; }
}

export async function getProjectAlerts(projectId: string): Promise<Alert[]> {
  try { return await apiGet<Alert[]>(`/projects/${encodeURIComponent(projectId)}/alerts`); } catch { return []; }
}

export async function getProjectBenchmark(projectId: string): Promise<PeerBenchmark | undefined> {
  try { return await apiGet<PeerBenchmark>(`/projects/${encodeURIComponent(projectId)}/benchmark`); } catch { return undefined; }
}

export async function getProjectIntervention(projectId: string): Promise<InterventionPriority | undefined> {
  try { return await apiGet<InterventionPriority>(`/projects/${encodeURIComponent(projectId)}/intervention`); } catch { return undefined; }
}

export async function getAllAlerts(): Promise<Alert[]> {
  try { return await apiGet<Alert[]>('/alerts'); } catch { return []; }
}

export async function getAllProjectTrajectories(): Promise<Record<string, ProjectMonthSnapshot[]>> {
  try { return await apiGet<Record<string, ProjectMonthSnapshot[]>>('/trajectories'); } catch { return {}; }
}

