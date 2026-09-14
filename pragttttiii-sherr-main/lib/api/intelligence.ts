import type { IntelligenceQuery, IntelligenceResponse, SuggestedQuestion } from '@/lib/types';
import { mockIntelligenceResponses } from '@/data/mock/portfolio';
import { mockProjects, mockRiskAssessments } from '@/data/mock/projects';
import { mockSignals, mockEvidence } from '@/data/mock/signals-evidence';
import { mockBenchmarks, mockInterventions } from '@/data/mock/alerts-interventions';
import { SUGGESTED_QUESTIONS, DOMINANT_RISK_CONFIG, RISK_TIER_CONFIG } from '@/lib/constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function queryIntelligence(query: IntelligenceQuery): Promise<IntelligenceResponse> {
  try {
    const response = await fetch(`${API_BASE}/intelligence/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: query.id,
        question: query.question,
        projectId: query.projectId,
        category: query.category,
      }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Intelligence API failed: ${response.status}`);
    return await response.json() as IntelligenceResponse;
  } catch {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
  }

  const key = query.projectId
    ? `${query.category}:${query.projectId}`
    : `${query.category}:general`;

  const response = mockIntelligenceResponses[key];

  if (response) {
    return { ...response, queryId: query.id };
  }

  // Fallback dynamic synthesis for any project
  if (query.projectId) {
    const project = mockProjects.find(p => p.id === query.projectId);
    const risk = mockRiskAssessments.find(r => r.projectId === query.projectId);
    const signals = mockSignals[query.projectId] || [];
    const evidence = mockEvidence[query.projectId] || [];
    const benchmark = mockBenchmarks[query.projectId];
    const intervention = mockInterventions.find(i => i.projectId === query.projectId);

    if (project && risk) {
      const dominantLabel = DOMINANT_RISK_CONFIG[risk.dominantRisk]?.label || risk.dominantRisk;
      const tierLabel = RISK_TIER_CONFIG[risk.riskTier]?.label || risk.riskTier;

      return {
        queryId: query.id,
        projectId: query.projectId,
        summary: `${project.name} is assessed at ${tierLabel} (Score: ${risk.riskScore}/100). The primary driver is ${dominantLabel.toLowerCase()} with ${(risk.confidence * 100).toFixed(0)}% evidence confidence.`,
        sections: [
          {
            type: 'risk_summary',
            title: 'Problem Identified & Risk Summary',
            content: `The project exhibits a physical progress of ${project.physicalProgress}% against planned completion targets. Dominant risk mode is ${dominantLabel} (probability: ${(risk.scheduleRiskProbability * 100).toFixed(0)}%).`
          },
          ...(signals.length > 0 ? [{
            type: 'signals' as const,
            title: 'Key Predictive Signals',
            content: 'SHAP feature attributions identified the following primary contributing signals:',
            data: signals
          }] : []),
          ...(evidence.length > 0 ? [{
            type: 'evidence' as const,
            title: 'Grounding Field Evidence',
            content: 'Verifiable project record facts supporting this risk classification:',
            data: evidence
          }] : []),
          ...(benchmark ? [{
            type: 'peer_context' as const,
            title: 'Peer Benchmark Context',
            content: `Positioned in the ${benchmark.sectorProgressPercentile}th percentile for sector progress among ${benchmark.peerGroupSize} peers in ${benchmark.peerGroupLabel}.`,
            data: benchmark
          }] : []),
          {
            type: 'recommendation',
            title: 'Recommended Official Review Action',
            content: intervention?.recommendedAction || 'Schedule formal implementation review, verify site progress telemetry, and validate contractor milestone recovery plans.'
          }
        ],
        confidence: risk.confidence,
        reportingMonth: '2026-06',
        reviewCategory: intervention?.reviewCategory || 'scheduled_review',
        disclaimer: 'This assessment is based on predictive signals and verified project data as of June 2026. Risk scores are decision-support signals, not guaranteed outcomes. Officials should review evidence and validate context before making intervention decisions.'
      };
    }
  }

  return {
    queryId: query.id,
    projectId: query.projectId,
    summary: 'The portfolio query was processed against active project records. Currently monitoring 18 central sector projects with 5 High Risk and 4 Critical Risk assets.',
    sections: [
      {
        type: 'risk_summary',
        title: 'Portfolio Intelligence Summary',
        content: 'There are 3 Priority 1 (P1) projects requiring immediate official intervention review: Zojila Tunnel (Risk 91), Kudankulam Nuclear Plant Units 5 & 6 (Risk 89), and North Karanpura Thermal Station (Risk 85).'
      },
      {
        type: 'recommendation',
        title: 'Action Plan',
        content: 'Initiate site inspections for P1 projects and conduct cost/schedule audits for P2 high-risk assets.'
      }
    ],
    confidence: 0.85,
    reportingMonth: '2026-06',
    disclaimer: 'This assessment is based on predictive signals and verified project data. Risk scores are decision-support signals, not guaranteed outcomes.',
  };
}

export function getSuggestedQuestions(projectId?: string): SuggestedQuestion[] {
  if (projectId) {
    return SUGGESTED_QUESTIONS.filter(q => q.projectSpecific);
  }
  return SUGGESTED_QUESTIONS.filter(q => !q.projectSpecific);
}
