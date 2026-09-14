'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  AlertTriangle, 
  BrainCircuit, 
  BarChart2, 
  Clock, 
  FileText, 
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';

import type { 
  Project, 
  RiskAssessment, 
  PredictiveSignal, 
  Evidence, 
  Alert, 
  PeerBenchmark, 
  InterventionPriority 
} from '@/lib/types';
import { 
  getProject, 
  getProjectRisk, 
  getProjectSignals, 
  getProjectEvidence, 
  getProjectAlerts, 
  getProjectBenchmark, 
  getProjectIntervention 
} from '@/lib/api/projects';
import { RISK_TIER_CONFIG, DOMINANT_RISK_CONFIG, PRIORITY_LEVEL_CONFIG, INTERVENTION_CATEGORY_CONFIG } from '@/lib/constants';
import { formatCurrency, formatPercentage, formatDate, formatMonth, formatCostEscalation } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [signals, setSignals] = useState<PredictiveSignal[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [benchmark, setBenchmark] = useState<PeerBenchmark | null>(null);
  const [intervention, setIntervention] = useState<InterventionPriority | null>(null);

  const loadProject = () => {
    setLoading(true);
    setError(null);
    getProject(id)
      .then(async (proj) => {
        if (!proj) {
          setError(`Project with ID "${id}" was not found in the portfolio.`);
          setLoading(false);
          return;
        }
        setProject(proj);

        // Fetch companion metrics in parallel without failing if one is missing
        const [rRes, sRes, eRes, aRes, bRes, iRes] = await Promise.allSettled([
          getProjectRisk(id),
          getProjectSignals(id),
          getProjectEvidence(id),
          getProjectAlerts(id),
          getProjectBenchmark(id),
          getProjectIntervention(id)
        ]);

        if (rRes.status === 'fulfilled' && rRes.value) setRisk(rRes.value);
        if (sRes.status === 'fulfilled' && sRes.value) setSignals(sRes.value);
        if (eRes.status === 'fulfilled' && eRes.value) setEvidence(eRes.value);
        if (aRes.status === 'fulfilled' && aRes.value) setAlerts(aRes.value);
        if (bRes.status === 'fulfilled' && bRes.value) setBenchmark(bRes.value);
        if (iRes.status === 'fulfilled' && iRes.value) setIntervention(iRes.value);

        setLoading(false);
      })
      .catch((err) => {
        console.error('[PRAGATI] Failed to load project detail:', err);
        setError(`Failed to load project details: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 pb-16 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-48 bg-white rounded-xl border border-slate-200 p-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white rounded-xl border border-slate-200" />
          <div className="h-64 bg-white rounded-xl border border-slate-200" />
          <div className="h-64 bg-white rounded-xl border border-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6 pb-16">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-royal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Workspace</span>
        </Link>
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Project Detail Unavailable</h3>
          <p className="text-sm text-slate-500 mb-4">{error || 'Project data could not be loaded.'}</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="primary" size="sm" onClick={loadProject}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Retry
            </Button>
            <Link href="/projects">
              <Button variant="outline" size="sm">
                Back to All Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tierConfig = risk ? RISK_TIER_CONFIG[risk.riskTier] : RISK_TIER_CONFIG.medium;
  const dominantConfig = risk ? DOMINANT_RISK_CONFIG[risk.dominantRisk] : null;
  const priorityConfig = intervention ? PRIORITY_LEVEL_CONFIG[intervention.priorityLevel] : null;
  const categoryConfig = intervention ? INTERVENTION_CATEGORY_CONFIG[intervention.reviewCategory] : null;

  const costEscalation = formatCostEscalation(project.originalCostCrore, project.revisedCostCrore);
  const expPercentage = project.revisedCostCrore > 0 ? (project.expenditureCrore / project.revisedCostCrore) * 100 : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-royal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Workspace</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border">
            ID: {project.id}
          </span>
          <Link href={`/intelligence?project=${project.id}`}>
            <Button variant="primary" size="sm" className="text-xs font-semibold flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Ask PRAGATI About This Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Identity Header Card */}
      <Card className="border-l-4 shadow-sm relative overflow-hidden" style={{ borderLeftColor: tierConfig.color }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100/90 text-slate-700 border border-slate-200 uppercase tracking-wider">
                  {project.sector}
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100/90 text-slate-700 border border-slate-200 uppercase tracking-wider">
                  {project.state}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded capitalize bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Status: {project.status}
                </span>
                {priorityConfig && (
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded border"
                    style={{
                      backgroundColor: priorityConfig.bgColor,
                      color: priorityConfig.color,
                      borderColor: priorityConfig.color
                    }}
                  >
                    {intervention?.priorityLevel} Priority
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  Cycle: {project.reportingMonth}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-royal tracking-tight leading-tight">
                {project.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {project.ministry}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-medium">
                  Executing Agency: {project.agency}
                </span>
              </p>
            </div>

            {/* Risk Badge Summary */}
            {risk && (
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
                <div
                  className="w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold border-2"
                  style={{
                    backgroundColor: tierConfig.bgColor,
                    borderColor: tierConfig.borderColor,
                    color: tierConfig.textColor
                  }}
                >
                  <span className="text-2xl leading-none">{risk.riskScore}</span>
                  <span className="text-[10px] uppercase font-semibold mt-0.5">Score</span>
                </div>

                <div>
                  <div className="text-sm font-bold" style={{ color: tierConfig.textColor }}>
                    {tierConfig.label}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                    Dominant: {dominantConfig?.label || risk.dominantRisk}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Evidence Confidence: {(risk.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financials & Progress Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Physical Progress</span>
              <span className="text-2xl font-bold text-royal mt-1 block">{project.physicalProgress}%</span>
              <ProgressBar value={project.physicalProgress} className="mt-1" />
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Revised Budget</span>
              <span className="text-2xl font-bold text-royal mt-1 block">
                {formatCurrency(project.revisedCostCrore)}
              </span>
              <span className={`text-[11px] font-semibold ${costEscalation.isEscalated ? 'text-amber-700' : 'text-slate-400'}`}>
                {costEscalation.isEscalated ? `+${costEscalation.percentage} cost overrun` : 'On budget'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Expenditure to Date</span>
              <span className="text-2xl font-bold text-royal mt-1 block">
                {formatCurrency(project.expenditureCrore)}
              </span>
              <span className="text-[11px] text-slate-400">
                {formatPercentage(expPercentage)} budget utilized
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Target Completion</span>
              <span className="text-2xl font-bold text-royal mt-1 block">
                {formatDate(project.revisedCompletionDate || project.plannedCompletionDate)}
              </span>
              {project.revisedCompletionDate && (
                <span className="text-[11px] text-amber-700 font-medium">
                  Revised from {formatDate(project.plannedCompletionDate)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Intervention Banner */}
      {intervention && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-amber-950">
                    Official Review Action · {categoryConfig?.label || intervention.reviewCategory}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Score: {intervention.priorityScore}/100
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  {intervention.recommendedAction}
                </p>
                <div className="flex flex-wrap gap-3 text-[11px] text-amber-800 mt-2 font-medium">
                  <span>Risk: {intervention.riskComponent}</span>
                  <span>Impact: {intervention.impactComponent}</span>
                  <span>Persistence: {intervention.persistenceComponent}</span>
                  <span>Evidence: {intervention.evidenceComponent}</span>
                </div>
              </div>
            </div>

            <Link href={`/intervention-priority`}>
              <Button size="sm" variant="secondary" className="text-xs h-8 font-semibold shrink-0">
                <span>View Priority Queue</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* 2-Column Analytical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Predictive Signals & Field Evidence */}
        <div className="lg:col-span-7 space-y-6">
          {/* Predictive Risk Signals */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-royal flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-primary-600" />
                  <span>Predictive Risk Signals (SHAP Attributions)</span>
                </CardTitle>
                <span className="text-[11px] text-slate-400">Decision-Support Drivers</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {signals.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No predictive signals recorded for this project.</p>
              ) : (
                <div className="space-y-3">
                  {signals.map((sig, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-mono">
                            #{sig.rank}
                          </span>
                          <span>{sig.displayLabel}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 ml-6">
                          Current Record Value: <strong className="text-slate-700">{sig.currentValue}</strong>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2 py-1 rounded ${
                        sig.direction === 'increases_risk'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {sig.direction === 'increases_risk' ? '+ Risk Contribution' : '- Mitigating Signal'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                * Note: Feature attributions represent statistical model contributions to risk ranking, not proven causal claims.
              </p>
            </CardContent>
          </Card>

          {/* Verifiable Grounding Evidence */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-royal flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Grounding Field Evidence</span>
                </CardTitle>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {evidence.length} Verified Facts
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {evidence.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No specific evidence records attached to this record.</p>
              ) : (
                evidence.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.type.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Month: {formatMonth(item.reportingMonth)}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{item.claim}</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 font-mono">
                      <span>Field: {item.sourceField}</span>
                      <span>•</span>
                      <span>Value: {item.sourceValue}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Alert History Timeline */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-royal flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Alert History Telemetry</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No alerts recorded for this project.</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map(a => (
                    <div key={a.id} className="p-3 rounded-lg bg-amber-50/40 border border-amber-200/80 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold uppercase text-amber-800 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 border border-amber-200">
                          {a.type.replace('_', ' ')} · {a.riskTier}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Raised: {formatMonth(a.firstRaisedMonth)} ({a.persistenceMonths} mos persistent)
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1">{a.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 Cols): Peer Benchmarking & Intelligence Entry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Peer Benchmark Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-royal flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-royal" />
                <span>Peer Benchmark Positioning</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 text-xs">
              {benchmark ? (
                <>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Peer Group Cohort</span>
                    <span className="font-bold text-slate-800 text-sm">{benchmark.peerGroupLabel}</span>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      Sample Size: {benchmark.peerGroupSize} peer projects
                    </span>
                  </div>

                  {/* Progress Percentile */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600 font-medium">Sector Progress Percentile</span>
                      <span className="font-bold text-royal">{benchmark.sectorProgressPercentile}th Percentile</span>
                    </div>
                    <ProgressBar value={benchmark.sectorProgressPercentile} colorClass="bg-sky-500" />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Project: {benchmark.projectProgress}%</span>
                      <span>Sector Avg: {benchmark.sectorAvgProgress}%</span>
                    </div>
                  </div>

                  {/* Risk Comparison */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Project Risk</span>
                      <span className="text-base font-bold text-red-700">{benchmark.projectRisk} / 100</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Sector Median</span>
                      <span className="text-base font-bold text-slate-700">{benchmark.sectorMedianRisk} / 100</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 py-4">Insufficient peer sample for reliable comparison.</p>
              )}
            </CardContent>
          </Card>

          {/* Ask PRAGATI Entry Box */}
          <Card className="bg-gradient-to-br from-royal via-royal to-slate-900 text-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Ask PRAGATI Intelligence</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Ask natural-language questions regarding {project.name}&apos;s risk trajectory, evidence grounding, peer benchmarks, or official review recommendations.
            </p>

            <div className="space-y-2">
              <Link href={`/intelligence?project=${project.id}&q=${encodeURIComponent('Why is this project flagged as high risk?')}`}>
                <button
                  type="button"
                  className="w-full text-left p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-white transition-colors flex items-center justify-between"
                >
                  <span>Why is this project flagged?</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                </button>
              </Link>
              <Link href={`/intelligence?project=${project.id}&q=${encodeURIComponent('What evidence supports this warning?')}`}>
                <button
                  type="button"
                  className="w-full text-left p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-white transition-colors flex items-center justify-between"
                >
                  <span>What evidence supports this warning?</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                </button>
              </Link>
            </div>

            <Link href={`/intelligence?project=${project.id}`} className="block mt-4">
              <Button size="sm" className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs">
                Open Full Intelligence Console
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
