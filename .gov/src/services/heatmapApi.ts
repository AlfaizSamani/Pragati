/**
 * Heatmap data abstraction layer.
 *
 * The component never imports mock data directly — it calls fetchHeatmap().
 * Set VITE_API_URL or VITE_HEATMAP_API to the deployed FastAPI service.
 *
 * Expected real endpoint:
 *   GET {API_BASE}/heatmap?category=infrastructure-risk
 *   → { "category": "infrastructure-risk", "data": [ { "state": "Maharashtra", "value": 82 }, ... ] }
 */

export interface StateHeatmapData {
  state: string;
  value: number;
}

export interface HeatmapResponse {
  category: string;
  data: StateHeatmapData[];
}

export interface StateDetail {
  state: string;
  category: string;
  categoryLabel: string;
  value: number;
  unit: string;
  activeProjects: number;
  delayedProjects: number;
  completionRate: number;
  portfolioValueCr: number;
}

export interface HeatmapCategory {
  id: string;
  label: string;
  unit: string;
  /** Color-scale stops: [minValue, cssColor]. Drives getHeatmapColor + legend. */
  stops: Array<[number, string]>;
  decimals: number;
}

/** Category registry — colors reuse the dashboard's design-system palette. */
export const HEATMAP_CATEGORIES: HeatmapCategory[] = [
  { id: 'infrastructure-risk', label: 'Infrastructure Risk', unit: '', decimals: 0, stops: [[0, '#10B981'], [25, '#F59E0B'], [50, '#F97316'], [75, '#DC2626'], [100, '#991B1B']] },
  { id: 'project-delays', label: 'Project Delays', unit: ' months', decimals: 1, stops: [[0, '#10B981'], [6, '#F59E0B'], [12, '#F97316'], [24, '#DC2626'], [36, '#991B1B']] },
  { id: 'budget-utilization', label: 'Budget Utilization', unit: '%', decimals: 1, stops: [[40, '#DC2626'], [55, '#F97316'], [70, '#F59E0B'], [85, '#10B981'], [100, '#047857']] },
  { id: 'safety-issues', label: 'Safety Issues', unit: '', decimals: 0, stops: [[0, '#10B981'], [5, '#F59E0B'], [12, '#F97316'], [20, '#DC2626'], [30, '#991B1B']] },
  { id: 'active-projects', label: 'Active Projects', unit: '', decimals: 0, stops: [[0, '#EFF6FF'], [25, '#93C5FD'], [60, '#3B82F6'], [120, '#1D4ED8'], [200, '#991B1B']] },
  { id: 'completion-rate', label: 'Completion Rate', unit: '%', decimals: 1, stops: [[0, '#DC2626'], [25, '#F97316'], [50, '#F59E0B'], [75, '#10B981'], [100, '#047857']] },
];

export const getCategory = (id: string): HeatmapCategory =>
  HEATMAP_CATEGORIES.find((c) => c.id === id) ?? HEATMAP_CATEGORIES[0];

/** Continuous color interpolation between the category's stops. */
export function getHeatmapColor(value: number, category: HeatmapCategory): string {
  const stops = category.stops;
  if (value <= stops[0][0]) return stops[0][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [lo, loColor] = stops[i];
    const [hi, hiColor] = stops[i + 1];
    if (value <= hi) {
      const t = (value - lo) / (hi - lo);
      return mixHex(loColor, hiColor, t);
    }
  }
  return stops[stops.length - 1][1];
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t);
  return `#${((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1)}`;
}

/* ------------------------------------------------------------------ */
/* State name normalization — GeoJSON datasets label states in many    */
/* variants ("ORISSA", "Maharashtra State", "Jammu & Kashmir"...).     */
/* The map component matches through this canonical layer, never by    */
/* assuming raw property strings.                                      */
/* ------------------------------------------------------------------ */

const NAME_ALIASES: Record<string, string> = {
  orissa: 'Odisha',
  uttaranchal: 'Uttarakhand',
  'pondicherry': 'Puducherry',
  'jammu & kashmir': 'Jammu and Kashmir',
  'jammu & kashmir state': 'Jammu and Kashmir',
  'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'andaman & nicobar': 'Andaman and Nicobar Islands',
  'andaman & nicobar island': 'Andaman and Nicobar Islands',
  'nct of delhi': 'Delhi',
  'national capital territory of delhi': 'Delhi',
  telengana: 'Telangana',
};

export function normalizeStateName(raw: string): string {
  let s = (raw ?? '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
  s = s.replace(/\s+state$/, '').replace(/^state of\s+/, '');
  if (NAME_ALIASES[s]) return NAME_ALIASES[s];
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

const API_BASE = ((import.meta as any)?.env?.VITE_API_URL ?? (import.meta as any)?.env?.VITE_HEATMAP_API ?? '').replace(/\/$/, '');
const API_TIMEOUT_MS = 4000;

/**
 * Fetch state-wise values for a category from the published backend dataset.
 */
export async function fetchHeatmap(categoryId: string): Promise<HeatmapResponse> {
  const category = getCategory(categoryId);
  if (!API_BASE) {
    // Proxy-relative: Vite dev server forwards /heatmap to backend
  }
  const res = await fetchWithTimeout(`${API_BASE}/heatmap?category=${encodeURIComponent(category.id)}`, API_TIMEOUT_MS);
  if (!res.ok) throw new Error(`Heatmap request failed (${res.status}).`);
  const json = await res.json();
  if (!Array.isArray(json?.data) || json.data.length === 0) throw new Error('Backend returned no heatmap data.');
  return { category: category.id, data: json.data };
}

/** Per-state drill-down for the click panel. */
export async function getStateDetails(stateName: string, categoryId: string): Promise<StateDetail> {
  const category = getCategory(categoryId);
  const state = normalizeStateName(stateName);
  if (!API_BASE) {
    // Proxy-relative
  }
  const [heatmapResponse, detailResponse] = await Promise.all([
    fetchHeatmap(category.id),
    fetchWithTimeout(`${API_BASE}/states/${encodeURIComponent(state)}?category=${encodeURIComponent(category.id)}`, API_TIMEOUT_MS),
  ]);
  if (!detailResponse.ok) throw new Error(`State request failed (${detailResponse.status}).`);
  const json = await detailResponse.json();
  const value = heatmapResponse.data.find((d) => normalizeStateName(d.state) === state)?.value ?? 0;
  return { ...json, state, category: category.id, categoryLabel: category.label, value, unit: category.unit };
}
