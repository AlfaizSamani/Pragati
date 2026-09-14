import type { PortfolioSummary, StateRiskSummary, IntelligenceResponse, SectorSummary, MinistrySummary } from '@/lib/types';
import { mockSignals, mockEvidence } from './signals-evidence';

const sectorBreakdown: SectorSummary[] = [
  { sector: 'Railways', projectCount: 2, avgRiskScore: 58.5, highRiskCount: 1, totalCostCrore: 176500 },
  { sector: 'Highways', projectCount: 4, avgRiskScore: 40.75, highRiskCount: 1, totalCostCrore: 132200 },
  { sector: 'Atomic Energy', projectCount: 1, avgRiskScore: 89, highRiskCount: 1, totalCostCrore: 39200 },
  { sector: 'Civil Aviation', projectCount: 2, avgRiskScore: 58, highRiskCount: 1, totalCostCrore: 49360 },
  { sector: 'Petroleum & Gas', projectCount: 1, avgRiskScore: 52, highRiskCount: 0, totalCostCrore: 37200 },
  { sector: 'Fertilizers', projectCount: 2, avgRiskScore: 48, highRiskCount: 1, totalCostCrore: 25400 },
  { sector: 'Power', projectCount: 3, avgRiskScore: 62.67, highRiskCount: 2, totalCostCrore: 60300 },
  { sector: 'Industrial', projectCount: 1, avgRiskScore: 55, highRiskCount: 0, totalCostCrore: 8500 },
  { sector: 'Urban Transit', projectCount: 1, avgRiskScore: 47, highRiskCount: 0, totalCostCrore: 10100 },
  { sector: 'Ports & Shipping', projectCount: 1, avgRiskScore: 58, highRiskCount: 1, totalCostCrore: 65000 },
];

const ministryBreakdown: MinistrySummary[] = [
  { ministry: 'Ministry of Railways', projectCount: 2, avgRiskScore: 58.5, highRiskCount: 1, totalCostCrore: 176500 },
  { ministry: 'Ministry of Road Transport & Highways', projectCount: 4, avgRiskScore: 40.75, highRiskCount: 1, totalCostCrore: 132200 },
  { ministry: 'Department of Atomic Energy', projectCount: 1, avgRiskScore: 89, highRiskCount: 1, totalCostCrore: 39200 },
  { ministry: 'Ministry of Civil Aviation', projectCount: 2, avgRiskScore: 58, highRiskCount: 1, totalCostCrore: 49360 },
  { ministry: 'Ministry of Petroleum & Natural Gas', projectCount: 1, avgRiskScore: 52, highRiskCount: 0, totalCostCrore: 37200 },
  { ministry: 'Department of Fertilizers', projectCount: 2, avgRiskScore: 48, highRiskCount: 1, totalCostCrore: 25400 },
  { ministry: 'Ministry of Power', projectCount: 3, avgRiskScore: 62.67, highRiskCount: 2, totalCostCrore: 60300 },
  { ministry: 'Ministry of Commerce & Industry', projectCount: 1, avgRiskScore: 55, highRiskCount: 0, totalCostCrore: 8500 },
  { ministry: 'Ministry of Housing & Urban Affairs', projectCount: 1, avgRiskScore: 47, highRiskCount: 0, totalCostCrore: 10100 },
  { ministry: 'Ministry of Ports, Shipping & Waterways', projectCount: 1, avgRiskScore: 58, highRiskCount: 1, totalCostCrore: 65000 },
];

export const mockPortfolioSummary: PortfolioSummary = {
  totalProjects: 18,
  highRiskCount: 5,
  criticalRiskCount: 4,
  newWarnings: 4,
  interventionQueueSize: 7,
  avgPhysicalProgress: 45.67,
  totalOriginalCostLakhCrore: 5.52,
  totalRevisedCostLakhCrore: 6.04,
  totalExpenditureLakhCrore: 2.62,
  riskDistribution: { low: 3, medium: 6, high: 5, critical: 4 },
  sectorBreakdown,
  ministryBreakdown,
  reportingMonth: '2026-06'
};

export const mockStateRiskSummaries: StateRiskSummary[] = [
  { stateCode: 'MH', stateName: 'Maharashtra', projectCount: 3, highRiskCount: 2, criticalRiskCount: 0, avgRiskScore: 66, totalCostCrore: 202800 },
  { stateCode: 'RJ', stateName: 'Rajasthan', projectCount: 1, highRiskCount: 0, criticalRiskCount: 0, avgRiskScore: 28, totalCostCrore: 98000 },
  { stateCode: 'UP', stateName: 'Uttar Pradesh', projectCount: 3, highRiskCount: 0, criticalRiskCount: 0, avgRiskScore: 39.3, totalCostCrore: 93160 },
  { stateCode: 'TN', stateName: 'Tamil Nadu', projectCount: 2, highRiskCount: 0, criticalRiskCount: 1, avgRiskScore: 60.5, totalCostCrore: 49200 },
  { stateCode: 'UK', stateName: 'Uttarakhand', projectCount: 1, highRiskCount: 1, criticalRiskCount: 0, avgRiskScore: 71, totalCostCrore: 15800 },
  { stateCode: 'OR', stateName: 'Odisha', projectCount: 2, highRiskCount: 1, criticalRiskCount: 0, avgRiskScore: 63, totalCostCrore: 53700 },
  { stateCode: 'JK', stateName: 'Jammu & Kashmir', projectCount: 1, highRiskCount: 0, criticalRiskCount: 1, avgRiskScore: 91, totalCostCrore: 8400 },
  { stateCode: 'JH', stateName: 'Jharkhand', projectCount: 2, highRiskCount: 0, criticalRiskCount: 1, avgRiskScore: 53.5, totalCostCrore: 30500 },
  { stateCode: 'AP', stateName: 'Andhra Pradesh', projectCount: 1, highRiskCount: 0, criticalRiskCount: 0, avgRiskScore: 55, totalCostCrore: 8500 },
  { stateCode: 'WB', stateName: 'West Bengal', projectCount: 1, highRiskCount: 0, criticalRiskCount: 0, avgRiskScore: 47, totalCostCrore: 10100 },
  { stateCode: 'AR', stateName: 'Arunachal Pradesh', projectCount: 1, highRiskCount: 0, criticalRiskCount: 1, avgRiskScore: 78, totalCostCrore: 33600 },
];

export const mockIntelligenceResponses: Record<string, IntelligenceResponse> = {
  'risk_explanation:PROJ-001': {
    queryId: 'q-1',
    projectId: 'PROJ-001',
    summary: 'The Mumbai-Ahmedabad High Speed Rail Corridor is flagged due to a significant time-elapsed vs. physical progress gap and an 18-month predicted schedule slip.',
    sections: [
      { type: 'risk_summary', title: 'Risk Overview', content: 'Current risk score is 72 (High), driven primarily by schedule delay (0.71 probability). Cost risk remains moderate but is escalating as the timeline extends.' },
      { type: 'signals', title: 'Predictive Signals', content: 'The model identified the progress-time gap and current schedule slip as the strongest contributors to the high risk score.', data: mockSignals['PROJ-001'] },
      { type: 'evidence', title: 'Grounding Evidence', content: 'Physical progress (42%) is significantly behind the 78% of revised planned duration elapsed.', data: mockEvidence['PROJ-001'] },
      { type: 'recommendation', title: 'Recommendation', content: 'Schedule a formal review in the next cycle. Focus on accelerating civil works and identifying land acquisition bottlenecks.' }
    ],
    confidence: 0.82,
    reportingMonth: '2026-06',
    reviewCategory: 'scheduled_review',
    disclaimer: 'This assessment is based on predictive signals and verified project data as of June 2026. Risk scores are decision-support signals, not guaranteed outcomes. Officials should review evidence and validate context before making intervention decisions.'
  },
  'risk_explanation:PROJ-008': {
    queryId: 'q-2',
    projectId: 'PROJ-008',
    summary: 'Zojila Tunnel is currently at Critical Risk (91) due to severe progress stall, particularly during winter months, and significant cost escalation of 23.5%.',
    sections: [
      { type: 'risk_summary', title: 'Risk Overview', content: 'With a risk score of 91, this project has the highest schedule risk (0.89) in the monitored portfolio. Prolonged winter shutdowns and unresolved environmental clearances have compounded the delays.' },
      { type: 'signals', title: 'Predictive Signals', content: 'Schedule slip to date and the progress-time gap are the dominant predictive features contributing to this assessment.', data: mockSignals['PROJ-008'] },
      { type: 'evidence', title: 'Grounding Evidence', content: 'The project is delayed by 30 months from initial target, and critical risk alerts have persisted for 8 months.', data: mockEvidence['PROJ-008'] },
      { type: 'recommendation', title: 'Action Required', content: 'Immediate implementation review and site inspection recommended.' }
    ],
    confidence: 0.72,
    reportingMonth: '2026-06',
    reviewCategory: 'immediate_review',
    disclaimer: 'This assessment is based on predictive signals and verified project data as of June 2026. Risk scores are decision-support signals, not guaranteed outcomes. Officials should review evidence and validate context before making intervention decisions.'
  },
  'risk_explanation:PROJ-004': {
    queryId: 'q-3',
    projectId: 'PROJ-004',
    summary: 'Kudankulam Nuclear Power Plant Units 5 & 6 are facing Critical Risk (89) driven by a 36-month schedule slip and significant cost escalation over a 5-year execution period.',
    sections: [
      { type: 'risk_summary', title: 'Risk Overview', content: 'The project shows signs of systemic schedule delay and progress stall, achieving only 24% physical progress since inception. The revised timeline pushes completion to Dec 2030.' },
      { type: 'signals', title: 'Predictive Signals', content: 'The schedule slip and 6-month progress stall are the strongest indicators of continued risk.', data: mockSignals['PROJ-004'] },
      { type: 'evidence', title: 'Supporting Evidence', content: 'Cost has escalated by ₹7,200 Cr (+22.5%) and the schedule delay alert has persisted for 12 months.', data: mockEvidence['PROJ-004'] },
      { type: 'recommendation', title: 'Recommendation', content: 'Immediate implementation review and site inspection recommended to assess vendor and supply chain bottlenecks.' }
    ],
    confidence: 0.76,
    reportingMonth: '2026-06',
    reviewCategory: 'immediate_review',
    disclaimer: 'This assessment is based on predictive signals and verified project data as of June 2026. Risk scores are decision-support signals, not guaranteed outcomes. Officials should review evidence and validate context before making intervention decisions.'
  },
  'change_analysis:PROJ-001': {
    queryId: 'q-4',
    projectId: 'PROJ-001',
    summary: 'Since last month, MAHSR\'s risk score increased marginally from 71 to 72. Physical progress increased by 2%, but expenditure outpaced expected cost utilization.',
    sections: [
      { type: 'risk_summary', title: 'Monthly Trajectory', content: 'While progress is being made (2% this month), it is insufficient to close the progress-time gap, leading the model to maintain a high risk of schedule delay.' },
      { type: 'evidence', title: 'Recent Evidence', content: 'Expenditure rose by ₹1,000 Cr this month, keeping the expenditure velocity high relative to physical output.', data: mockEvidence['PROJ-001'] },
      { type: 'recommendation', title: 'Recommendation', content: 'Track expenditure velocity versus physical progress in the upcoming quarter.' }
    ],
    confidence: 0.85,
    reportingMonth: '2026-06',
    reviewCategory: 'monitoring',
    disclaimer: 'This assessment is based on predictive signals and verified project data as of June 2026. Risk scores are decision-support signals, not guaranteed outcomes. Officials should review evidence and validate context before making intervention decisions.'
  },
  'priority_review:general': {
    queryId: 'q-5',
    summary: 'There are 3 priority projects requiring immediate review (P1), driven by critical risk scores and high persistence of delays: Zojila Tunnel, Kudankulam Nuclear Plant, and North Karanpura Power Station.',
    sections: [
      { type: 'risk_summary', title: 'Portfolio Intervention Priority', content: 'Our priority model evaluates Risk × Impact × Persistence × Evidence. The P1 projects exhibit not only high predicted risk but also systemic stalls and substantial evidence backing the risk claims.' },
      { type: 'recommendation', title: 'Action Plan', content: 'Initiate immediate site inspections for P1 projects. For the 4 P2 projects (including MAHSR and Char Dham), schedule formal reviews in the upcoming cycle.' }
    ],
    confidence: 0.88,
    reportingMonth: '2026-06',
    disclaimer: 'This assessment is based on predictive signals and verified project data as of June 2026. Risk scores are decision-support signals, not guaranteed outcomes. Officials should review evidence and validate context before making intervention decisions.'
  },
  'evidence_review:PROJ-008': {
    queryId: 'q-6',
    projectId: 'PROJ-008',
    summary: 'The critical risk warning for Zojila Tunnel is grounded in 4 verified data points, notably a 30-month schedule slip and a persistent alert history.',
    sections: [
      { type: 'evidence', title: 'Verified Field Evidence', content: 'The following verifiable facts ground the model\'s risk prediction:', data: mockEvidence['PROJ-008'] },
      { type: 'risk_summary', title: 'Contextual Assessment', content: 'These facts highlight structural challenges in execution rather than temporary blips, supporting the high confidence score (0.72) assigned by the model.' }
    ],
    confidence: 0.90,
    reportingMonth: '2026-06',
    reviewCategory: 'immediate_review',
    disclaimer: 'This assessment is based on predictive signals and verified project data as of June 2026. Risk scores are decision-support signals, not guaranteed outcomes. Officials should review evidence and validate context before making intervention decisions.'
  }
};
