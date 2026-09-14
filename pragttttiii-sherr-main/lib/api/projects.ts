import type { Project, RiskAssessment, ProjectMonthSnapshot, PredictiveSignal, Evidence, Alert, PeerBenchmark, InterventionPriority, ProjectFilters } from '@/lib/types';
import { mockProjects, mockRiskAssessments } from '@/data/mock/projects';
import { mockAlerts, mockInterventions, mockBenchmarks } from '@/data/mock/alerts-interventions';
import { mockSignals, mockEvidence } from '@/data/mock/signals-evidence';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://pragati-wuh7.onrender.com').replace(/\/+$/, '');

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const projects = await apiGet<Project[]>('/projects');
    if (projects && projects.length > 0) {
      return applyFilters(projects, filters);
    }
    return applyFilters(mockProjects, filters);
  } catch {
    return applyFilters(mockProjects, filters);
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
    const p = await apiGet<Project>(`/projects/${encodeURIComponent(id)}`);
    return p || mockProjects.find(m => m.id === id);
  } catch {
    return mockProjects.find(m => m.id === id);
  }
}

export async function getProjectRisk(projectId: string): Promise<RiskAssessment | undefined> {
  try {
    const assessments = await apiGet<RiskAssessment[]>('/risk-assessments');
    return assessments.find(assessment => assessment.projectId === projectId) || mockRiskAssessments.find(r => r.projectId === projectId);
  } catch {
    return mockRiskAssessments.find(r => r.projectId === projectId);
  }
}

export async function getAllRiskAssessments(): Promise<RiskAssessment[]> {
  try {
    const assessments = await apiGet<RiskAssessment[]>('/risk-assessments');
    if (assessments && assessments.length > 0) return assessments;
    return mockRiskAssessments;
  } catch {
    return mockRiskAssessments;
  }
}

export async function getProjectHistory(projectId: string): Promise<ProjectMonthSnapshot[]> {
  try {
    return await apiGet<ProjectMonthSnapshot[]>(`/projects/${encodeURIComponent(projectId)}/history`);
  } catch {
    return [];
  }
}

export async function getProjectSignals(projectId: string): Promise<PredictiveSignal[]> {
  try {
    const signals = await apiGet<PredictiveSignal[]>(`/projects/${encodeURIComponent(projectId)}/signals`);
    if (signals && signals.length > 0) return signals;
    return mockSignals[projectId] || [];
  } catch {
    return mockSignals[projectId] || [];
  }
}

export async function getProjectEvidence(projectId: string): Promise<Evidence[]> {
  try {
    const evidence = await apiGet<Evidence[]>(`/projects/${encodeURIComponent(projectId)}/evidence`);
    if (evidence && evidence.length > 0) return evidence;
    return mockEvidence[projectId] || [];
  } catch {
    return mockEvidence[projectId] || [];
  }
}

export async function getProjectAlerts(projectId: string): Promise<Alert[]> {
  try {
    const alerts = await apiGet<Alert[]>(`/projects/${encodeURIComponent(projectId)}/alerts`);
    if (alerts && alerts.length > 0) return alerts;
    return mockAlerts.filter(a => a.projectId === projectId);
  } catch {
    return mockAlerts.filter(a => a.projectId === projectId);
  }
}

export async function getProjectBenchmark(projectId: string): Promise<PeerBenchmark | undefined> {
  try {
    return (await apiGet<PeerBenchmark>(`/projects/${encodeURIComponent(projectId)}/benchmark`)) || mockBenchmarks[projectId];
  } catch {
    return mockBenchmarks[projectId];
  }
}

export async function getProjectIntervention(projectId: string): Promise<InterventionPriority | undefined> {
  try {
    return (await apiGet<InterventionPriority>(`/projects/${encodeURIComponent(projectId)}/intervention`)) || mockInterventions.find(i => i.projectId === projectId);
  } catch {
    return mockInterventions.find(i => i.projectId === projectId);
  }
}

export async function getAllAlerts(): Promise<Alert[]> {
  try {
    const alerts = await apiGet<Alert[]>('/alerts');
    if (alerts && alerts.length > 0) return alerts;
    return mockAlerts;
  } catch {
    return mockAlerts;
  }
}

export async function getAllProjectTrajectories(): Promise<Record<string, ProjectMonthSnapshot[]>> {
  try {
    return await apiGet<Record<string, ProjectMonthSnapshot[]>>('/trajectories');
  } catch {
    return {};
  }
}
