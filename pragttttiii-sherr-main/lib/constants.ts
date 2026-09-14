import { RiskTier, DominantRiskType, InterventionCategory, PriorityLevel, SuggestedQuestion } from '@/lib/types';

export const RISK_TIER_CONFIG: Record<RiskTier, { label: string, color: string, bgColor: string, borderColor: string, textColor: string }> = {
  low: { label: 'Low Risk', color: '#10b981', bgColor: '#ecfdf5', borderColor: '#a7f3d0', textColor: '#065f46' },
  medium: { label: 'Medium Risk', color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fde68a', textColor: '#92400e' },
  high: { label: 'High Risk', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca', textColor: '#991b1b' },
  critical: { label: 'Critical Risk', color: '#dc2626', bgColor: '#fef2f2', borderColor: '#f87171', textColor: '#7f1d1d' }
};

export const DOMINANT_RISK_CONFIG: Record<DominantRiskType, { label: string, color: string, bgColor: string, icon: string }> = {
  cost_escalation: { label: 'Cost Escalation', color: '#f59e0b', bgColor: '#fffbeb', icon: 'TrendingUp' },
  schedule_delay: { label: 'Schedule Delay', color: '#ef4444', bgColor: '#fef2f2', icon: 'Clock' },
  progress_stall: { label: 'Progress Stall', color: '#8b5cf6', bgColor: '#f5f3ff', icon: 'PauseCircle' }
};

export const INTERVENTION_CATEGORY_CONFIG: Record<InterventionCategory, { label: string, color: string, bgColor: string, description: string }> = {
  immediate_review: { label: 'Immediate Review Required', color: '#dc2626', bgColor: '#fef2f2', description: 'Requires urgent official attention and evidence review' },
  scheduled_review: { label: 'Scheduled Review', color: '#f59e0b', bgColor: '#fffbeb', description: 'Should be reviewed in the next review cycle' },
  monitoring: { label: 'Enhanced Monitoring', color: '#3b82f6', bgColor: '#eff6ff', description: 'Continue monitoring with increased frequency' },
  watch: { label: 'Watch List', color: '#6b7280', bgColor: '#f9fafb', description: 'Monitor for emerging patterns' }
};

export const PRIORITY_LEVEL_CONFIG: Record<PriorityLevel, { label: string, color: string, bgColor: string }> = {
  P1: { label: 'Priority 1 — Critical', color: '#dc2626', bgColor: '#fef2f2' },
  P2: { label: 'Priority 2 — High', color: '#f59e0b', bgColor: '#fffbeb' },
  P3: { label: 'Priority 3 — Medium', color: '#3b82f6', bgColor: '#eff6ff' },
  P4: { label: 'Priority 4 — Low', color: '#6b7280', bgColor: '#f9fafb' }
};

export const CONFIDENCE_LABELS: Array<{ min: number, max: number, label: string, color: string }> = [
  { min: 0, max: 0.4, label: 'Limited Evidence', color: '#ef4444' },
  { min: 0.4, max: 0.65, label: 'Moderate Evidence', color: '#f59e0b' },
  { min: 0.65, max: 0.85, label: 'Good Evidence', color: '#3b82f6' },
  { min: 0.85, max: 1.01, label: 'Strong Evidence', color: '#10b981' }
];

export const SECTORS: string[] = [
  'Railways', 'Highways', 'Power', 'Petroleum & Gas', 'Coal', 'Ports & Shipping', 
  'Civil Aviation', 'Urban Transit', 'Atomic Energy', 'Fertilizers', 'Steel', 
  'Telecommunications', 'Renewable Energy', 'Water Resources', 'Industrial'
];

export const MINISTRIES: string[] = [
  'Ministry of Railways', 'Ministry of Road Transport & Highways', 'Ministry of Power', 
  'Ministry of Petroleum & Natural Gas', 'Ministry of Coal', 'Ministry of Ports, Shipping & Waterways', 
  'Ministry of Civil Aviation', 'Ministry of Housing & Urban Affairs', 'Department of Atomic Energy', 
  'Department of Fertilizers', 'Ministry of Steel', 'Ministry of Commerce & Industry'
];

export const INDIAN_STATES: Array<{ code: string, name: string }> = [
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OD', name: 'Odisha' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'LA', name: 'Ladakh' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'PY', name: 'Puducherry' }
];

export const PRAGATI_COLORS = {
  primary: '#0ea5e9',
  primaryDark: '#0284c7',
  primaryLight: '#e0f2fe',
  secondary: '#06b6d4',
  secondaryDark: '#0891b2',
  secondaryLight: '#cffafe',
  royal: '#1e3a5f',
  royalLight: '#2d5a8e',
  accent: '#f59e0b',
  accentDark: '#d97706',
  accentLight: '#fef3c7',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  dangerDark: '#dc2626',
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',
  white: '#ffffff'
};

export const SUGGESTED_QUESTIONS: Array<SuggestedQuestion> = [
  { id: 'q1', question: 'Why is this project flagged as high risk?', category: 'risk_explanation', projectSpecific: true },
  { id: 'q2', question: 'What changed since last month?', category: 'change_analysis', projectSpecific: true },
  { id: 'q3', question: 'What evidence supports this warning?', category: 'evidence_review', projectSpecific: true },
  { id: 'q4', question: 'Which projects need attention first?', category: 'priority_review', projectSpecific: false },
  { id: 'q5', question: 'How does this project compare to sector peers?', category: 'general', projectSpecific: true },
  { id: 'q6', question: 'What is the intervention recommendation?', category: 'priority_review', projectSpecific: true }
];
