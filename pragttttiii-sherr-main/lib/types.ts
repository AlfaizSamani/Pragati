// ============================================================
// PRAGATI — Core Type Definitions
// Predictive Infrastructure Intelligence & Decision-Support
// ============================================================

// --- Enums & Literal Types ---

export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export type DominantRiskType = 'cost_escalation' | 'schedule_delay' | 'progress_stall';

export type InterventionCategory =
  | 'immediate_review'
  | 'scheduled_review'
  | 'monitoring'
  | 'watch';

export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';

export type ProjectStatus = 'ongoing' | 'completed' | 'stalled' | 'not_started';

export type EvidenceType = 'project_field' | 'model_output' | 'benchmark' | 'alert_history';

export type SignalDirection = 'increases_risk' | 'decreases_risk';

export type IntelligenceQueryCategory =
  | 'risk_explanation'
  | 'change_analysis'
  | 'priority_review'
  | 'evidence_review'
  | 'general';

// --- Core Entities ---

/** A monitored infrastructure project in the PAIMANA/PRAGATI system. */
export interface Project {
  id: string;
  name: string;
  ministry: string;
  sector: string;
  state: string;
  agency: string;
  originalCostCrore: number;
  revisedCostCrore: number;
  expenditureCrore: number;
  physicalProgress: number; // 0–100
  plannedCompletionDate: string; // ISO date string
  revisedCompletionDate?: string; // ISO date string, if revised
  status: ProjectStatus;
  reportingMonth: string; // "YYYY-MM"
}

/**
 * ML-derived risk assessment for a project.
 * Risk score is a decision-support signal (0–100), NOT a calibrated probability.
 * Confidence measures evidence sufficiency, separate from risk magnitude.
 */
export interface RiskAssessment {
  projectId: string;
  riskScore: number; // 0–100 decision-support signal
  riskTier: RiskTier;
  dominantRisk: DominantRiskType;
  confidence: number; // 0–1, evidence sufficiency
  costRiskProbability: number; // 0–1
  scheduleRiskProbability: number; // 0–1
  progressStallProbability: number; // 0–1
  reportingMonth: string;
}

/**
 * A SHAP-derived predictive signal.
 * NOTE: These are predictive attributions, NOT causal explanations.
 * Correct: "Progress-vs-time gap contributed strongly to predicted risk."
 * Incorrect: "Progress-vs-time gap caused the delay."
 */
export interface PredictiveSignal {
  featureName: string;
  displayLabel: string;
  currentValue: number | string;
  shapContribution: number; // signed float
  direction: SignalDirection;
  rank: number; // 1 = top contributor
}

/** Verifiable project-record fact grounding a prediction or claim. */
export interface Evidence {
  id: string;
  projectId: string;
  type: EvidenceType;
  claim: string;
  sourceField: string;
  sourceValue: string | number;
  reportingMonth: string;
}

/** An early-warning alert with persistence and lead-time information. */
export interface Alert {
  id: string;
  projectId: string;
  type: DominantRiskType;
  riskTier: RiskTier;
  message: string;
  firstRaisedMonth: string;
  persistenceMonths: number;
  leadTimeMonths?: number; // months of warning before event materialized
  isActive: boolean;
  reportingMonth: string;
}

/** Peer benchmark positioning within sector/cost-band cohort. */
export interface PeerBenchmark {
  projectId: string;
  sectorProgressPercentile: number; // 0–100
  costBandPercentile: number; // 0–100
  peerGroupSize: number;
  peerGroupLabel: string;
  sectorAvgProgress: number;
  projectProgress: number;
  sectorMedianRisk: number;
  projectRisk: number;
}

/**
 * Intervention priority for a project.
 * Priority = Risk × Impact × Persistence × Evidence, NOT just risk sorting.
 * This is an intervention-support system, not an autonomous decision-maker.
 */
export interface InterventionPriority {
  projectId: string;
  priorityScore: number; // composite 0–100
  riskComponent: number; // 0–100
  impactComponent: number; // 0–100
  persistenceComponent: number; // 0–100
  evidenceComponent: number; // 0–100
  priorityLevel: PriorityLevel;
  reviewCategory: InterventionCategory;
  recommendedAction: string;
}

// --- Aggregation / Portfolio Types ---

export interface PortfolioSummary {
  totalProjects: number;
  highRiskCount: number;
  criticalRiskCount: number;
  newWarnings: number;
  interventionQueueSize: number;
  avgPhysicalProgress: number;
  totalOriginalCostLakhCrore: number;
  totalRevisedCostLakhCrore: number;
  totalExpenditureLakhCrore: number;
  riskDistribution: Record<RiskTier, number>;
  sectorBreakdown: SectorSummary[];
  ministryBreakdown: MinistrySummary[];
  reportingMonth: string;
}

export interface SectorSummary {
  sector: string;
  projectCount: number;
  avgRiskScore: number;
  highRiskCount: number;
  totalCostCrore: number;
}

export interface MinistrySummary {
  ministry: string;
  projectCount: number;
  avgRiskScore: number;
  highRiskCount: number;
  totalCostCrore: number;
}

// --- Trend / Time-Series Types ---

/** A single month's snapshot of a project for trend visualization. */
export interface ProjectMonthSnapshot {
  month: string; // "YYYY-MM"
  physicalProgress: number;
  expenditureCrore: number;
  riskScore: number;
  costEscalationPct: number;
}

// --- India Map Types ---

/** State-level aggregated risk summary for the geographic visualization. */
export interface StateRiskSummary {
  stateCode: string;
  stateName: string;
  projectCount: number;
  highRiskCount: number;
  criticalRiskCount: number;
  avgRiskScore: number;
  totalCostCrore: number;
}

// --- PRAGATI Intelligence Types ---

/** A contextual question posed to the PRAGATI Intelligence system. */
export interface IntelligenceQuery {
  id: string;
  question: string;
  projectId?: string;
  category: IntelligenceQueryCategory;
}

/** A visually structured section within an intelligence response. */
export interface IntelligenceResponseSection {
  type: 'risk_summary' | 'signals' | 'evidence' | 'peer_context' | 'recommendation';
  title: string;
  content: string;
  data?: PredictiveSignal[] | Evidence[] | PeerBenchmark;
}

/**
 * A structured response from PRAGATI Intelligence.
 * Every material claim is backed by evidence. The LLM never invents
 * project facts, probabilities, causal explanations, or monetary impacts.
 */
export interface IntelligenceResponse {
  queryId: string;
  projectId?: string;
  summary: string;
  sections: IntelligenceResponseSection[];
  confidence: number;
  reportingMonth: string;
  reviewCategory?: InterventionCategory;
  disclaimer: string;
}

// --- Suggested Intelligence Questions ---

/** Pre-built contextual question for the Intelligence panel. */
export interface SuggestedQuestion {
  id: string;
  question: string;
  category: IntelligenceQueryCategory;
  projectSpecific: boolean; // true = needs projectId context
}

// --- Filter Types ---

export interface ProjectFilters {
  ministry?: string;
  sector?: string;
  state?: string;
  riskTier?: RiskTier;
  priorityLevel?: PriorityLevel;
  status?: ProjectStatus;
  dominantRisk?: DominantRiskType;
  minCostCrore?: number;
  maxCostCrore?: number;
  minProgress?: number;
  maxProgress?: number;
  searchQuery?: string;
}
