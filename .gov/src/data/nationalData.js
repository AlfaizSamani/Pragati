/* =====================================================================
   PRAGATI National Dashboard — central mock data layer.
   Every visible value, list, label and action in the dashboard renders
   from this file. Swap any export with a real API call later without
   touching the components.
   ===================================================================== */

/* ---------- Header ---------- */
export const headerNavTabs = [
  { id: 'Overview', label: 'Overview', href: '#/dashboard' },
  { id: 'Watchlist', label: 'Watchlist', href: '#/watchlist' },
  { id: 'Projects', label: 'Projects', href: '#/project' },
  { id: 'Early Warnings', label: 'Early Warnings', href: '#/early-warnings' },
  { id: 'Analytics', label: 'Analytics', href: '#/analytics' },
  { id: 'Intelligence', label: 'Intelligence', href: '#/intelligence' },
  { id: 'Data Update', label: 'Data Update', href: '#/data-update' },
];

export const languages = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'ta', label: 'தமிழ்' },
];

export const currentUser = { initials: 'AS', name: 'A. Sharma', role: 'MoSPI Officer' };

export const notifications = [
  { id: 'n1', title: 'Risk escalation: Mumbai-Pune Expressway Extension', time: '12 Apr 2026, 09:20', tone: 'red' },
  { id: 'n2', title: 'New high-risk project: Chennai Metro Phase II', time: '11 Apr 2026, 17:45', tone: 'orange' },
  { id: 'n3', title: 'April 2026 reporting cycle closed — 1,773 projects synced', time: '10 Apr 2026, 08:00', tone: 'blue' },
];

export const userMenu = [
  { id: 'profile', label: 'My Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'signout', label: 'Sign Out' },
];

/* ---------- Hero ---------- */
export const hero = {
  greeting: 'Good morning, Aarav',
  subline: "Here's what's happening across India's infrastructure portfolio.",
  quote: 'Informed infrastructure. A more resilient India.',
  dataAsOf: 'April 2026',
  methodologyCta: 'View Methodology',
};

export const methodology = {
  title: 'Risk Scoring Methodology',
  intro: 'Every project is scored 0–100 each reporting cycle from five weighted signals, reviewed by MoSPI analysts before publication.',
  factors: [
    { name: 'Schedule adherence', weight: '30%', detail: 'Milestone slippage vs. sanctioned timeline' },
    { name: 'Cost discipline', weight: '25%', detail: 'Revised-cost escalation against original sanction' },
    { name: 'Physical progress', weight: '20%', detail: 'Verified completion against stage targets' },
    { name: 'Fund utilisation', weight: '15%', detail: 'Expenditure against released instalments' },
    { name: 'Field reports', weight: '10%', detail: 'State-level desk and site-visit assessments' },
  ],
};

/* ---------- KPI cards ---------- */
export const kpis = [
  { id: 'projects', label: 'Monitored Projects', value: '1,773', delta: '6%', dir: 'up', tone: 'green', icon: 'file',
    breakdown: { title: 'Monitored Projects — 1,773', rows: [
      ['Central sector projects', '612'], ['State/UT projects', '894'], ['PPP projects', '267']] } },
  { id: 'priority', label: 'High Priority Projects', value: '562', delta: '12%', dir: 'up', tone: 'red', icon: 'alert',
    breakdown: { title: 'High Priority — 562', rows: [
      ['Critical risk', '142'], ['High risk', '301'], ['Escalated this cycle', '119']] } },
  { id: 'value', label: 'Total Portfolio Value', value: '₹ 38.7 Lakh Cr', delta: '8%', dir: 'up', tone: 'orange', icon: 'rupee',
    breakdown: { title: 'Portfolio — ₹ 38.7 Lakh Cr', rows: [
      ['Sanctioned', '₹ 33.1 Lakh Cr'], ['Revised (current)', '₹ 38.7 Lakh Cr'], ['Escalation share', '17%']] } },
  { id: 'deteriorated', label: 'Newly Deteriorated', value: '126', delta: '24%', dir: 'up', tone: 'red', icon: 'chart',
    breakdown: { title: 'Newly Deteriorated — 126', rows: [
      ['Schedule pressure', '58'], ['Cost escalation', '41'], ['Field report downgrades', '27']] } },
];

/* ---------- Risk distribution ---------- */
export const riskTiers = [
  { id: 'critical', label: 'Critical', pct: '8%', count: 142, color: '#DC2626' },
  { id: 'high', label: 'High', pct: '17%', count: 301, color: '#F97316' },
  { id: 'medium', label: 'Medium', pct: '46%', count: 816, color: '#F59E0B' },
  { id: 'low', label: 'Low', pct: '29%', count: 514, color: '#10B981' },
];
export const riskDonut = [
  { color: '#10B981', offset: 178 },
  { color: '#F59E0B', offset: 135 },
  { color: '#F97316', offset: 80 },
  { color: '#DC2626', offset: 230 },
];

/* ---------- Sectors ---------- */
export const sectors = [
  { id: 'road', name: 'Road Transport', count: 426, pct: '24%', width: 'w-[95%]' },
  { id: 'rail', name: 'Railways', count: 319, pct: '18%', width: 'w-[75%]' },
  { id: 'urban', name: 'Urban Infrastructure', count: 284, pct: '16%', width: 'w-[65%]' },
  { id: 'energy', name: 'Energy', count: 248, pct: '14%', width: 'w-[55%]' },
  { id: 'water', name: 'Water Resources', count: 160, pct: '9%', width: 'w-[38%]' },
  { id: 'ports', name: 'Ports', count: 124, pct: '7%', width: 'w-[30%]' },
  { id: 'airports', name: 'Airports', count: 89, pct: '5%', width: 'w-[22%]' },
  { id: 'others', name: 'Others', count: 123, pct: '7%', width: 'w-[30%]' },
];

/* ---------- What changed ---------- */
export const changes = [
  { id: 'c1', icon: 'alert', tone: 'red', title: '126 projects show increased risk', detail: '↑ 24% from previous month', detailTone: 'red' },
  { id: 'c2', icon: 'down', tone: 'green', title: '43 projects show risk improvement', detail: '↓ 18% from previous month', detailTone: 'green' },
  { id: 'c3', icon: 'file', tone: 'blue', title: '278 projects updated with new data', detail: 'April 2026 reporting cycle', detailTone: 'muted' },
  { id: 'c4', icon: 'clock', tone: 'amber', title: '18 projects face significant delays', detail: '> 6 months beyond schedule', detailTone: 'muted' },
  { id: 'c5', icon: 'rupee', tone: 'orange', title: '32 projects show cost escalation', detail: '> 20% increase in revised cost', detailTone: 'muted' },
  { id: 'c6', icon: 'alert', tone: 'red', title: '9 projects entered critical risk', detail: 'New critical status this month', detailTone: 'red' },
  { id: 'c7', icon: 'up', tone: 'blue', title: '64 projects improved schedule outlook', detail: 'Updated milestone forecasts', detailTone: 'muted' },
];

export const keyInsight = 'Transport and Urban Infrastructure sectors account for 58% of all high-risk projects this month.';

/* ---------- Top states ---------- */
export const topStates = [
  { rank: 1, name: 'Maharashtra', total: 126, critical: 18, value: '₹ 4.8 Lakh Cr', trend: 'up' },
  { rank: 2, name: 'Uttar Pradesh', total: 118, critical: 16, value: '₹ 4.2 Lakh Cr', trend: 'up' },
  { rank: 3, name: 'Tamil Nadu', total: 102, critical: 14, value: '₹ 3.9 Lakh Cr', trend: 'stable' },
  { rank: 4, name: 'Gujarat', total: 96, critical: 12, value: '₹ 3.6 Lakh Cr', trend: 'down' },
  { rank: 5, name: 'Karnataka', total: 88, critical: 11, value: '₹ 3.1 Lakh Cr', trend: 'up' },
];

export const allStates = [
  ...topStates,
  { rank: 6, name: 'Rajasthan', total: 81, critical: 10, value: '₹ 2.8 Lakh Cr', trend: 'up' },
  { rank: 7, name: 'Madhya Pradesh', total: 77, critical: 9, value: '₹ 2.6 Lakh Cr', trend: 'stable' },
  { rank: 8, name: 'Telangana', total: 74, critical: 9, value: '₹ 2.5 Lakh Cr', trend: 'down' },
  { rank: 9, name: 'Bihar', total: 68, critical: 8, value: '₹ 2.1 Lakh Cr', trend: 'up' },
  { rank: 10, name: 'West Bengal', total: 63, critical: 7, value: '₹ 1.9 Lakh Cr', trend: 'stable' },
  { rank: 11, name: 'Kerala', total: 55, critical: 6, value: '₹ 1.6 Lakh Cr', trend: 'down' },
  { rank: 12, name: 'Punjab', total: 48, critical: 5, value: '₹ 1.3 Lakh Cr', trend: 'up' },
];

/* ---------- Warnings ---------- */
export const warnings = [
  { id: 'w1', date: '12 Apr 2026', type: 'Risk Increase', tone: 'red', name: 'Mumbai-Pune Expressway Extension', state: 'Maharashtra',
    description: 'Composite risk score moved from 68 to 79 after the Q1 field review. Earthwork packages C4 and C5 are 5 months behind.',
    action: 'Escalate to state review committee; request recovery plan by 30 Apr 2026.' },
  { id: 'w2', date: '11 Apr 2026', type: 'New High Risk', tone: 'orange', name: 'Chennai Metro Phase II', state: 'Tamil Nadu',
    description: 'Corridor-3 utility relocation is stalled by pending defence clearance; revised commissioning risk is now high.',
    action: 'Inter-ministerial coordination meeting proposed for 22 Apr 2026.' },
  { id: 'w3', date: '10 Apr 2026', type: 'Persistent Risk', tone: 'amber', name: 'Eastern Dedicated Freight Corridor', state: 'Bihar',
    description: 'Land acquisition in the Sonpur–Malda segment remains below 60% for the third consecutive cycle.',
    action: 'Track weekly; district collector review scheduled 18 Apr 2026.' },
  { id: 'w4', date: '09 Apr 2026', type: 'Schedule Pressure', tone: 'blue', name: 'Bengaluru Suburban Rail', state: 'Karnataka',
    description: 'Rolling-stock procurement re-tender adds an estimated 7 months to the commissioning baseline.',
    action: 'Request revised milestone chart from K-RIDE before the next cycle.' },
  { id: 'w5', date: '08 Apr 2026', type: 'Cost Escalation', tone: 'rose', name: 'Hyderabad Outer Ring Road', state: 'Telangana',
    description: 'Revised cost estimate exceeds sanction by 23% following land compensation awards.',
    action: 'SAC (Standing Advisory Committee) note under preparation.' },
];

/* ---------- Project register (search / projects view / watchlist) ---------- */
export const projects = [
  { id: 'p1', name: 'Mumbai-Pune Expressway Extension', state: 'Maharashtra', sector: 'Road Transport', risk: 79, level: 'Critical', progress: 46, cost: '₹ 42,800 Cr', schedule: '-5 months' },
  { id: 'p2', name: 'Chennai Metro Phase II', state: 'Tamil Nadu', sector: 'Urban Infrastructure', risk: 74, level: 'High', progress: 38, cost: '₹ 63,246 Cr', schedule: '-4 months' },
  { id: 'p3', name: 'Eastern Dedicated Freight Corridor', state: 'Bihar', sector: 'Railways', risk: 71, level: 'High', progress: 61, cost: '₹ 81,459 Cr', schedule: '-7 months' },
  { id: 'p4', name: 'Bengaluru Suburban Rail', state: 'Karnataka', sector: 'Railways', risk: 68, level: 'High', progress: 29, cost: '₹ 39,147 Cr', schedule: '-7 months' },
  { id: 'p5', name: 'Hyderabad Outer Ring Road', state: 'Telangana', sector: 'Road Transport', risk: 66, level: 'Medium', progress: 74, cost: '₹ 18,940 Cr', schedule: '-2 months' },
  { id: 'p6', name: 'Narmada Canal Link Phase III', state: 'Gujarat', sector: 'Water Resources', risk: 58, level: 'Medium', progress: 52, cost: '₹ 12,310 Cr', schedule: '-1 months' },
  { id: 'p7', name: 'Delhi-Mumbai Expressway (RK Section)', state: 'Rajasthan', sector: 'Road Transport', risk: 55, level: 'Medium', progress: 67, cost: '₹ 97,300 Cr', schedule: '-3 months' },
  { id: 'p8', name: 'Navi Mumbai International Airport', state: 'Maharashtra', sector: 'Airports', risk: 51, level: 'Medium', progress: 58, cost: '₹ 16,700 Cr', schedule: '+1 months' },
  { id: 'p9', name: 'Kochi Water Metro Expansion', state: 'Kerala', sector: 'Ports', risk: 44, level: 'Low', progress: 71, cost: '₹ 8,190 Cr', schedule: '+2 months' },
  { id: 'p10', name: 'Bhakra Canal Modernisation', state: 'Punjab', sector: 'Water Resources', risk: 38, level: 'Low', progress: 82, cost: '₹ 5,860 Cr', schedule: '+3 months' },
];

export const levelTone = { Critical: 'red', High: 'orange', Medium: 'amber', Low: 'green' };

/* ---------- Ministries / Agencies / Sector detail ---------- */
export const ministries = [
  { name: 'Ministry of Road Transport & Highways', projects: 426, highCritical: 64, value: '₹ 11.2 Lakh Cr', onTrack: '78%' },
  { name: 'Ministry of Railways', projects: 319, highCritical: 51, value: '₹ 9.6 Lakh Cr', onTrack: '72%' },
  { name: 'Ministry of Housing & Urban Affairs', projects: 284, highCritical: 47, value: '₹ 7.1 Lakh Cr', onTrack: '69%' },
  { name: 'Ministry of Power & New Energy', projects: 248, highCritical: 29, value: '₹ 5.4 Lakh Cr', onTrack: '84%' },
  { name: 'Ministry of Jal Shakti', projects: 160, highCritical: 18, value: '₹ 3.2 Lakh Cr', onTrack: '81%' },
  { name: 'Ministry of Ports, Shipping & Waterways', projects: 124, highCritical: 14, value: '₹ 1.4 Lakh Cr', onTrack: '86%' },
  { name: 'Ministry of Civil Aviation', projects: 89, highCritical: 11, value: '₹ 0.8 Lakh Cr', onTrack: '83%' },
];

export const agencies = [
  { name: 'NHAI', projects: 302, delayed: 31, value: '₹ 8.9 Lakh Cr' },
  { name: 'Indian Railways (DFCIL)', projects: 208, delayed: 24, value: '₹ 6.7 Lakh Cr' },
  { name: 'NMRC / Metro Corporations', projects: 154, delayed: 19, value: '₹ 4.1 Lakh Cr' },
  { name: 'NTPC / Power PSUs', projects: 131, delayed: 9, value: '₹ 3.3 Lakh Cr' },
  { name: 'State Road Corporations', projects: 118, delayed: 15, value: '₹ 2.2 Lakh Cr' },
  { name: 'Port Trusts & JNPA', projects: 87, delayed: 6, value: '₹ 1.1 Lakh Cr' },
  { name: 'AAI', projects: 74, delayed: 5, value: '₹ 0.6 Lakh Cr' },
];

export const sectorDetail = [
  { id: 'road', name: 'Road Transport', projects: 426, avgRisk: 52, delayed: 58, spent: '68%' },
  { id: 'rail', name: 'Railways', projects: 319, avgRisk: 55, delayed: 47, spent: '64%' },
  { id: 'urban', name: 'Urban Infrastructure', projects: 284, avgRisk: 57, delayed: 44, spent: '59%' },
  { id: 'energy', name: 'Energy', projects: 248, avgRisk: 41, delayed: 21, spent: '74%' },
  { id: 'water', name: 'Water Resources', projects: 160, avgRisk: 45, delayed: 23, spent: '71%' },
  { id: 'ports', name: 'Ports', projects: 124, avgRisk: 38, delayed: 14, spent: '77%' },
  { id: 'airports', name: 'Airports', projects: 89, avgRisk: 40, delayed: 11, spent: '75%' },
  { id: 'others', name: 'Others', projects: 123, avgRisk: 44, delayed: 18, spent: '69%' },
];

/* ---------- Intelligence / Data update ---------- */
export const intelligence = {
  headline: 'Transport and Urban Infrastructure account for 58% of all high-risk projects this month.',
  briefs: [
    { id: 'i1', tag: 'Corridor Risk', text: 'Six of the eight corridors crossing 60 risk are concentrated in the Mumbai–Bengaluru and Delhi–Kolkata axes; two share common land-acquisition bottlenecks.' },
    { id: 'i2', tag: 'Cost Signal', text: 'Steel and bitumen indices drifted 4–7% above the March baseline; 32 projects show revised-cost pressure consistent with this movement.' },
    { id: 'i3', tag: 'Schedule Signal', text: 'Monsoon-window sensitivity flags 18 projects with <20% buffer left on commissioning baselines across coastal states.' },
    { id: 'i4', tag: 'Governance', text: 'Nine projects entered Critical this cycle; all nine have field-verified evidence packages attached for analyst review.' },
  ],
};

export const dataUpdate = {
  cycle: 'April 2026',
  opened: '01 Apr 2026', closed: '10 Apr 2026', next: 'May 2026 (opens 01 May)',
  uploads: [
    { id: 'u1', source: 'State desks (28 states)', rows: '1,412', status: 'Received', tone: 'green' },
    { id: 'u2', source: 'Central PSUs', rows: '246', status: 'Received', tone: 'green' },
    { id: 'u3', source: 'Field audit annexures', rows: '88', status: 'Validating', tone: 'amber' },
    { id: 'u4', source: 'Ministry reconciliations', rows: '27', status: 'Pending', tone: 'red' },
  ],
  validation: [
    ['Records passed schema validation', '1,658 / 1,773'],
    ['Records in analyst review queue', '115'],
    ['Records rejected (re-upload requested)', '0'],
  ],
};

/* ---------- Footer ---------- */
export const footerLinks = [
  { id: 'privacy', label: 'Privacy', body: 'PRAGATI processes only aggregated, non-personal infrastructure reporting data. No personally identifiable information is collected or stored by this dashboard.' },
  { id: 'terms', label: 'Terms', body: 'Dashboard content is for official use by Government of India authorised personnel. Figures shown are from the April 2026 mock reporting cycle for demonstration purposes.' },
  { id: 'accessibility', label: 'Accessibility', body: 'This dashboard targets WCAG 2.1 AA: keyboard navigation on all controls, visible focus states, and colour scales paired with text labels for all risk tiers.' },
  { id: 'help', label: 'Help', body: 'For access issues or data corrections, contact the MoSPI dashboard cell at pragati-support@mospi.gov.in (mock contact for demonstration).' },
];

export const footerTaglines = ['Predictive Risk & Governance', 'Stronger Projects', 'A More Resilient India'];
