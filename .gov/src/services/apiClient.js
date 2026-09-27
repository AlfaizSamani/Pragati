import { API_BASE } from './apiBase';
import { getAccessToken } from './authClient';

export function getApiBase() {
  return API_BASE;
}

export async function apiGet(path, params = {}, options = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));
  const url = `${API_BASE}${path}${query.size ? `?${query}` : ''}`;
  const response = await fetch(url, { signal: options.signal });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `PRAGATI API request failed (${response.status}).`);
  }
  return response.json();
}

export const api = {
  health: () => apiGet('/health'),
  summary: (month) => apiGet('/portfolio/summary', { month }),
  projects: (month, topN = 5000) => apiGet('/projects', { month, top_n: topN }),
  project: (id, month) => apiGet(`/projects/${encodeURIComponent(id)}`, { month }),
  projectHistory: (id, month) => apiGet(`/projects/${encodeURIComponent(id)}/history`, { month }),
  projectEvidence: (id, month) => apiGet(`/projects/${encodeURIComponent(id)}/evidence`, { month }),
  projectSignals: (id, month) => apiGet(`/projects/${encodeURIComponent(id)}/signals`, { month }),
  projectIntervention: (id, month) => apiGet(`/projects/${encodeURIComponent(id)}/intervention`, { month }),
  uploadMonthlyReport: async (file, month) => {

    const body = new FormData();
    body.append('file', file);
    body.append('month_label', month);
    const response = await fetch(`${API_BASE}/ingest/monthly-report`, { method: 'POST', body });
    if (!response.ok) throw new Error(await response.text() || `Upload failed (${response.status}).`);
    return response.json();
  },
  alerts: (month) => apiGet('/alerts', { month }),
  stateSummary: (month) => apiGet('/state-summary', { month }),
  priorityQueue: (month, topN = 50) => apiGet('/priority-queue', { month, top_n: topN }),
  intelligence: async (payload, month) => {
    const accessToken = await getAccessToken();
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const response = await fetch(`${API_BASE}/intelligence/query?month=${encodeURIComponent(month || '')}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await response.text();
      let detail = body;
      try { detail = JSON.parse(body).detail || body; } catch { /* preserve non-JSON error text */ }
      const error = new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      error.status = response.status;
      throw error;
    }
    return response.json();
  },
};
