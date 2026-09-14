import type { Project, RiskAssessment, ProjectMonthSnapshot } from '@/lib/types';

export const mockProjects: Project[] = [
  {
    id: 'PROJ-001', name: 'Mumbai-Ahmedabad High Speed Rail Corridor', ministry: 'Ministry of Railways', sector: 'Railways', state: 'Maharashtra', agency: 'NHSRCL',
    originalCostCrore: 108000, revisedCostCrore: 118000, expenditureCrore: 38200, physicalProgress: 42, plannedCompletionDate: '2028-12-31', revisedCompletionDate: '2030-06-30', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-002', name: 'Delhi-Mumbai Expressway', ministry: 'Ministry of Road Transport & Highways', sector: 'Highways', state: 'Rajasthan', agency: 'NHAI',
    originalCostCrore: 98000, revisedCostCrore: 98000, expenditureCrore: 72500, physicalProgress: 78, plannedCompletionDate: '2025-12-31', revisedCompletionDate: '2026-09-30', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-003', name: 'Eastern Dedicated Freight Corridor', ministry: 'Ministry of Railways', sector: 'Railways', state: 'Uttar Pradesh', agency: 'DFCCIL',
    originalCostCrore: 52000, revisedCostCrore: 58500, expenditureCrore: 47200, physicalProgress: 88, plannedCompletionDate: '2025-06-30', revisedCompletionDate: '2026-03-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-004', name: 'Kudankulam Nuclear Power Plant Units 5 & 6', ministry: 'Department of Atomic Energy', sector: 'Atomic Energy', state: 'Tamil Nadu', agency: 'NPCIL',
    originalCostCrore: 32000, revisedCostCrore: 39200, expenditureCrore: 8400, physicalProgress: 24, plannedCompletionDate: '2027-12-31', revisedCompletionDate: '2030-12-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-005', name: 'Navi Mumbai International Airport (NMIA)', ministry: 'Ministry of Civil Aviation', sector: 'Civil Aviation', state: 'Maharashtra', agency: 'NMIAL/CIDCO',
    originalCostCrore: 16700, revisedCostCrore: 19800, expenditureCrore: 9800, physicalProgress: 55, plannedCompletionDate: '2025-03-31', revisedCompletionDate: '2027-03-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-006', name: 'Char Dham All Weather Road', ministry: 'Ministry of Road Transport & Highways', sector: 'Highways', state: 'Uttarakhand', agency: 'NHIDCL',
    originalCostCrore: 12000, revisedCostCrore: 15800, expenditureCrore: 8200, physicalProgress: 61, plannedCompletionDate: '2026-03-31', revisedCompletionDate: '2027-12-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-007', name: 'Paradip Petrochemical Complex', ministry: 'Ministry of Petroleum & Natural Gas', sector: 'Petroleum & Gas', state: 'Odisha', agency: 'IOCL',
    originalCostCrore: 35000, revisedCostCrore: 37200, expenditureCrore: 12600, physicalProgress: 33, plannedCompletionDate: '2027-06-30', revisedCompletionDate: '2028-03-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-008', name: 'Zojila Tunnel', ministry: 'Ministry of Road Transport & Highways', sector: 'Highways', state: 'Jammu & Kashmir', agency: 'NHIDCL',
    originalCostCrore: 6800, revisedCostCrore: 8400, expenditureCrore: 2900, physicalProgress: 38, plannedCompletionDate: '2026-09-30', revisedCompletionDate: '2029-03-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-009', name: 'Jewar International Airport (Noida)', ministry: 'Ministry of Civil Aviation', sector: 'Civil Aviation', state: 'Uttar Pradesh', agency: 'YIAPL',
    originalCostCrore: 29560, revisedCostCrore: 29560, expenditureCrore: 11200, physicalProgress: 35, plannedCompletionDate: '2027-09-30', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-010', name: 'Talcher Fertilizer Plant Revival', ministry: 'Department of Fertilizers', sector: 'Fertilizers', state: 'Odisha', agency: 'TFL',
    originalCostCrore: 13000, revisedCostCrore: 16500, expenditureCrore: 7800, physicalProgress: 52, plannedCompletionDate: '2025-12-31', revisedCompletionDate: '2027-06-30', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-011', name: 'North Karanpura Super Thermal Power Station', ministry: 'Ministry of Power', sector: 'Power', state: 'Jharkhand', agency: 'NTPC',
    originalCostCrore: 18000, revisedCostCrore: 21600, expenditureCrore: 5800, physicalProgress: 29, plannedCompletionDate: '2027-03-31', revisedCompletionDate: '2029-09-30', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-012', name: 'Visakhapatnam-Chennai Industrial Corridor', ministry: 'Ministry of Commerce & Industry', sector: 'Industrial', state: 'Andhra Pradesh', agency: 'NICDIT',
    originalCostCrore: 8500, revisedCostCrore: 8500, expenditureCrore: 1400, physicalProgress: 15, plannedCompletionDate: '2029-03-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-013', name: 'Kolkata East-West Metro Extension', ministry: 'Ministry of Housing & Urban Affairs', sector: 'Urban Transit', state: 'West Bengal', agency: 'KMRC',
    originalCostCrore: 8575, revisedCostCrore: 10100, expenditureCrore: 6800, physicalProgress: 72, plannedCompletionDate: '2025-06-30', revisedCompletionDate: '2026-12-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-014', name: 'Chennai Peripheral Ring Road', ministry: 'Ministry of Road Transport & Highways', sector: 'Highways', state: 'Tamil Nadu', agency: 'NHAI',
    originalCostCrore: 10000, revisedCostCrore: 10000, expenditureCrore: 2400, physicalProgress: 22, plannedCompletionDate: '2028-12-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-015', name: 'Renusagar Thermal Power Modernization', ministry: 'Ministry of Power', sector: 'Power', state: 'Uttar Pradesh', agency: 'NTPC',
    originalCostCrore: 4200, revisedCostCrore: 5100, expenditureCrore: 3100, physicalProgress: 67, plannedCompletionDate: '2026-06-30', revisedCompletionDate: '2026-12-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-016', name: 'Dibang Multipurpose Project', ministry: 'Ministry of Power', sector: 'Power', state: 'Arunachal Pradesh', agency: 'NHPC',
    originalCostCrore: 28000, revisedCostCrore: 33600, expenditureCrore: 3800, physicalProgress: 12, plannedCompletionDate: '2031-12-31', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-017', name: 'Sindri Fertilizer Plant Revival', ministry: 'Department of Fertilizers', sector: 'Fertilizers', state: 'Jharkhand', agency: 'HURL',
    originalCostCrore: 7000, revisedCostCrore: 8900, expenditureCrore: 6900, physicalProgress: 81, plannedCompletionDate: '2025-09-30', revisedCompletionDate: '2026-06-30', status: 'ongoing', reportingMonth: '2026-06'
  },
  {
    id: 'PROJ-018', name: 'Sagarmala — Vadhavan Port Development', ministry: 'Ministry of Ports, Shipping & Waterways', sector: 'Ports & Shipping', state: 'Maharashtra', agency: 'JNPT/SPA',
    originalCostCrore: 65000, revisedCostCrore: 65000, expenditureCrore: 12800, physicalProgress: 18, plannedCompletionDate: '2029-12-31', status: 'ongoing', reportingMonth: '2026-06'
  }
];

export const mockRiskAssessments: RiskAssessment[] = [
  { projectId: 'PROJ-001', riskScore: 72, riskTier: 'high', dominantRisk: 'schedule_delay', confidence: 0.82, costRiskProbability: 0.38, scheduleRiskProbability: 0.71, progressStallProbability: 0.24, reportingMonth: '2026-06' },
  { projectId: 'PROJ-002', riskScore: 28, riskTier: 'low', dominantRisk: 'schedule_delay', confidence: 0.91, costRiskProbability: 0.08, scheduleRiskProbability: 0.22, progressStallProbability: 0.05, reportingMonth: '2026-06' },
  { projectId: 'PROJ-003', riskScore: 45, riskTier: 'medium', dominantRisk: 'cost_escalation', confidence: 0.87, costRiskProbability: 0.42, scheduleRiskProbability: 0.28, progressStallProbability: 0.12, reportingMonth: '2026-06' },
  { projectId: 'PROJ-004', riskScore: 89, riskTier: 'critical', dominantRisk: 'schedule_delay', confidence: 0.76, costRiskProbability: 0.62, scheduleRiskProbability: 0.88, progressStallProbability: 0.45, reportingMonth: '2026-06' },
  { projectId: 'PROJ-005', riskScore: 68, riskTier: 'high', dominantRisk: 'schedule_delay', confidence: 0.84, costRiskProbability: 0.35, scheduleRiskProbability: 0.65, progressStallProbability: 0.18, reportingMonth: '2026-06' },
  { projectId: 'PROJ-006', riskScore: 71, riskTier: 'high', dominantRisk: 'cost_escalation', confidence: 0.79, costRiskProbability: 0.68, scheduleRiskProbability: 0.52, progressStallProbability: 0.22, reportingMonth: '2026-06' },
  { projectId: 'PROJ-007', riskScore: 52, riskTier: 'medium', dominantRisk: 'progress_stall', confidence: 0.81, costRiskProbability: 0.22, scheduleRiskProbability: 0.38, progressStallProbability: 0.48, reportingMonth: '2026-06' },
  { projectId: 'PROJ-008', riskScore: 91, riskTier: 'critical', dominantRisk: 'schedule_delay', confidence: 0.72, costRiskProbability: 0.55, scheduleRiskProbability: 0.89, progressStallProbability: 0.42, reportingMonth: '2026-06' },
  { projectId: 'PROJ-009', riskScore: 48, riskTier: 'medium', dominantRisk: 'schedule_delay', confidence: 0.86, costRiskProbability: 0.15, scheduleRiskProbability: 0.42, progressStallProbability: 0.21, reportingMonth: '2026-06' },
  { projectId: 'PROJ-010', riskScore: 74, riskTier: 'high', dominantRisk: 'cost_escalation', confidence: 0.77, costRiskProbability: 0.72, scheduleRiskProbability: 0.48, progressStallProbability: 0.28, reportingMonth: '2026-06' },
  { projectId: 'PROJ-011', riskScore: 85, riskTier: 'critical', dominantRisk: 'progress_stall', confidence: 0.73, costRiskProbability: 0.52, scheduleRiskProbability: 0.68, progressStallProbability: 0.82, reportingMonth: '2026-06' },
  { projectId: 'PROJ-012', riskScore: 55, riskTier: 'medium', dominantRisk: 'schedule_delay', confidence: 0.68, costRiskProbability: 0.18, scheduleRiskProbability: 0.48, progressStallProbability: 0.35, reportingMonth: '2026-06' },
  { projectId: 'PROJ-013', riskScore: 47, riskTier: 'medium', dominantRisk: 'cost_escalation', confidence: 0.85, costRiskProbability: 0.44, scheduleRiskProbability: 0.32, progressStallProbability: 0.14, reportingMonth: '2026-06' },
  { projectId: 'PROJ-014', riskScore: 32, riskTier: 'medium', dominantRisk: 'schedule_delay', confidence: 0.88, costRiskProbability: 0.10, scheduleRiskProbability: 0.28, progressStallProbability: 0.15, reportingMonth: '2026-06' },
  { projectId: 'PROJ-015', riskScore: 25, riskTier: 'low', dominantRisk: 'cost_escalation', confidence: 0.92, costRiskProbability: 0.22, scheduleRiskProbability: 0.12, progressStallProbability: 0.08, reportingMonth: '2026-06' },
  { projectId: 'PROJ-016', riskScore: 78, riskTier: 'critical', dominantRisk: 'schedule_delay', confidence: 0.65, costRiskProbability: 0.48, scheduleRiskProbability: 0.72, progressStallProbability: 0.55, reportingMonth: '2026-06' },
  { projectId: 'PROJ-017', riskScore: 22, riskTier: 'low', dominantRisk: 'cost_escalation', confidence: 0.93, costRiskProbability: 0.18, scheduleRiskProbability: 0.10, progressStallProbability: 0.05, reportingMonth: '2026-06' },
  { projectId: 'PROJ-018', riskScore: 58, riskTier: 'high', dominantRisk: 'schedule_delay', confidence: 0.71, costRiskProbability: 0.22, scheduleRiskProbability: 0.52, progressStallProbability: 0.38, reportingMonth: '2026-06' },
];

export const mockProjectTrajectories: Record<string, ProjectMonthSnapshot[]> = {
  'PROJ-001': [
    { month: '2025-06', physicalProgress: 25, expenditureCrore: 28000, riskScore: 55, costEscalationPct: 2.5 },
    { month: '2025-07', physicalProgress: 26, expenditureCrore: 28800, riskScore: 57, costEscalationPct: 3.2 },
    { month: '2025-08', physicalProgress: 28, expenditureCrore: 29500, riskScore: 58, costEscalationPct: 3.8 },
    { month: '2025-09', physicalProgress: 29, expenditureCrore: 30500, riskScore: 61, costEscalationPct: 4.5 },
    { month: '2025-10', physicalProgress: 31, expenditureCrore: 31200, riskScore: 63, costEscalationPct: 5.1 },
    { month: '2025-11', physicalProgress: 32, expenditureCrore: 32000, riskScore: 64, costEscalationPct: 6.0 },
    { month: '2025-12', physicalProgress: 33, expenditureCrore: 33000, riskScore: 66, costEscalationPct: 6.8 },
    { month: '2026-01', physicalProgress: 35, expenditureCrore: 34100, riskScore: 68, costEscalationPct: 7.5 },
    { month: '2026-02', physicalProgress: 36, expenditureCrore: 34900, riskScore: 69, costEscalationPct: 7.9 },
    { month: '2026-03', physicalProgress: 37, expenditureCrore: 35500, riskScore: 70, costEscalationPct: 8.5 },
    { month: '2026-04', physicalProgress: 39, expenditureCrore: 36400, riskScore: 71, costEscalationPct: 8.9 },
    { month: '2026-05', physicalProgress: 40, expenditureCrore: 37200, riskScore: 71, costEscalationPct: 9.1 },
    { month: '2026-06', physicalProgress: 42, expenditureCrore: 38200, riskScore: 72, costEscalationPct: 9.3 },
  ],
  'PROJ-008': [
    { month: '2025-06', physicalProgress: 28, expenditureCrore: 2100, riskScore: 82, costEscalationPct: 15.2 },
    { month: '2025-07', physicalProgress: 29, expenditureCrore: 2150, riskScore: 83, costEscalationPct: 16.0 },
    { month: '2025-08', physicalProgress: 29, expenditureCrore: 2200, riskScore: 84, costEscalationPct: 16.8 },
    { month: '2025-09', physicalProgress: 30, expenditureCrore: 2300, riskScore: 85, costEscalationPct: 17.5 },
    { month: '2025-10', physicalProgress: 31, expenditureCrore: 2350, riskScore: 86, costEscalationPct: 18.2 },
    { month: '2025-11', physicalProgress: 32, expenditureCrore: 2450, riskScore: 88, costEscalationPct: 19.5 },
    { month: '2025-12', physicalProgress: 32, expenditureCrore: 2500, riskScore: 89, costEscalationPct: 20.3 },
    { month: '2026-01', physicalProgress: 33, expenditureCrore: 2550, riskScore: 89, costEscalationPct: 21.0 },
    { month: '2026-02', physicalProgress: 34, expenditureCrore: 2600, riskScore: 90, costEscalationPct: 21.8 },
    { month: '2026-03', physicalProgress: 35, expenditureCrore: 2700, riskScore: 90, costEscalationPct: 22.5 },
    { month: '2026-04', physicalProgress: 36, expenditureCrore: 2750, riskScore: 91, costEscalationPct: 23.0 },
    { month: '2026-05', physicalProgress: 37, expenditureCrore: 2820, riskScore: 91, costEscalationPct: 23.3 },
    { month: '2026-06', physicalProgress: 38, expenditureCrore: 2900, riskScore: 91, costEscalationPct: 23.5 },
  ],
  'PROJ-003': [
    { month: '2025-06', physicalProgress: 72, expenditureCrore: 40500, riskScore: 62, costEscalationPct: 10.5 },
    { month: '2025-07', physicalProgress: 74, expenditureCrore: 41000, riskScore: 60, costEscalationPct: 10.8 },
    { month: '2025-08', physicalProgress: 75, expenditureCrore: 41500, riskScore: 58, costEscalationPct: 11.0 },
    { month: '2025-09', physicalProgress: 77, expenditureCrore: 42000, riskScore: 56, costEscalationPct: 11.2 },
    { month: '2025-10', physicalProgress: 78, expenditureCrore: 42600, riskScore: 55, costEscalationPct: 11.5 },
    { month: '2025-11', physicalProgress: 80, expenditureCrore: 43200, riskScore: 53, costEscalationPct: 11.7 },
    { month: '2025-12', physicalProgress: 81, expenditureCrore: 43800, riskScore: 52, costEscalationPct: 11.9 },
    { month: '2026-01', physicalProgress: 82, expenditureCrore: 44200, riskScore: 50, costEscalationPct: 12.0 },
    { month: '2026-02', physicalProgress: 84, expenditureCrore: 44800, riskScore: 49, costEscalationPct: 12.1 },
    { month: '2026-03', physicalProgress: 85, expenditureCrore: 45400, riskScore: 48, costEscalationPct: 12.2 },
    { month: '2026-04', physicalProgress: 86, expenditureCrore: 46000, riskScore: 47, costEscalationPct: 12.3 },
    { month: '2026-05', physicalProgress: 87, expenditureCrore: 46600, riskScore: 46, costEscalationPct: 12.4 },
    { month: '2026-06', physicalProgress: 88, expenditureCrore: 47200, riskScore: 45, costEscalationPct: 12.5 },
  ],
  'PROJ-002': [
    { month: '2025-06', physicalProgress: 55, expenditureCrore: 52000, riskScore: 35, costEscalationPct: 0.0 },
    { month: '2025-07', physicalProgress: 57, expenditureCrore: 53500, riskScore: 34, costEscalationPct: 0.0 },
    { month: '2025-08', physicalProgress: 59, expenditureCrore: 55200, riskScore: 34, costEscalationPct: 0.0 },
    { month: '2025-09', physicalProgress: 61, expenditureCrore: 57000, riskScore: 33, costEscalationPct: 0.0 },
    { month: '2025-10', physicalProgress: 63, expenditureCrore: 58800, riskScore: 32, costEscalationPct: 0.0 },
    { month: '2025-11', physicalProgress: 65, expenditureCrore: 60500, riskScore: 32, costEscalationPct: 0.0 },
    { month: '2025-12', physicalProgress: 67, expenditureCrore: 62200, riskScore: 31, costEscalationPct: 0.0 },
    { month: '2026-01', physicalProgress: 69, expenditureCrore: 64000, riskScore: 30, costEscalationPct: 0.0 },
    { month: '2026-02', physicalProgress: 71, expenditureCrore: 65500, riskScore: 30, costEscalationPct: 0.0 },
    { month: '2026-03', physicalProgress: 73, expenditureCrore: 67200, riskScore: 29, costEscalationPct: 0.0 },
    { month: '2026-04', physicalProgress: 75, expenditureCrore: 69000, riskScore: 29, costEscalationPct: 0.0 },
    { month: '2026-05', physicalProgress: 77, expenditureCrore: 70800, riskScore: 28, costEscalationPct: 0.0 },
    { month: '2026-06', physicalProgress: 78, expenditureCrore: 72500, riskScore: 28, costEscalationPct: 0.0 },
  ],
};
