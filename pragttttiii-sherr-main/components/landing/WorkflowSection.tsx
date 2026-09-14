'use client';

import React, { useState } from 'react';
import {
  Database,
  Search,
  TrendingUp,
  FileCheck2,
  Sliders,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  BarChart2,
} from 'lucide-react';

interface WorkflowStep {
  id: number;
  stageNumber: string;
  name: string;
  shortDesc: string;
  tag: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  inputLabel: string;
  inputDesc: string;
  engineLabel: string;
  engineDesc: string;
  outputLabel: string;
  outputDesc: string;
  realWorldExample: string;
  keyMetric: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    stageNumber: '01',
    name: 'Monitor',
    shortDesc: 'Ingest monthly project data & Flash Reports',
    tag: 'Data Ingestion',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Database,
    inputLabel: 'Raw Project Inflow',
    inputDesc: 'MoSPI Flash Reports, OCMS monthly records, sanctioned capital outlays, and initial completion schedules.',
    engineLabel: 'Standardization Pipeline',
    engineDesc: 'Automated data validation, entity resolution across ministries, and historical milestone normalization.',
    outputLabel: 'Unified Infra Ledger',
    outputDesc: 'Clean, continuous time-series of financial burn rate, milestone velocity, and contractor track records.',
    realWorldExample: 'Tracks monthly data feeds across 1,800+ active central infrastructure projects valued over ₹150 Cr.',
    keyMetric: '1,800+ Active Projects',
  },
  {
    id: 2,
    stageNumber: '02',
    name: 'Detect',
    shortDesc: 'Identify cost & schedule variances',
    tag: 'Variance Discovery',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: Search,
    inputLabel: 'Progress Discrepancies',
    inputDesc: 'Disproportionate expenditure vs. actual site completion, overdue work packages, and stale reporting gaps.',
    engineLabel: 'Variance Heuristics',
    engineDesc: 'Deterministic anomaly detectors flagging physical-vs-financial decoupling and milestone stall velocity.',
    outputLabel: 'Early Deviation Signals',
    outputDesc: 'Automated discrepancy flags highlighting projects where capital outlay diverges from ground truth.',
    realWorldExample: 'Instantly surfaces when 60% of sanctioned budget is exhausted while physical progress is stalled below 30%.',
    keyMetric: 'Physical-Financial Parity',
  },
  {
    id: 3,
    stageNumber: '03',
    name: 'Predict',
    shortDesc: 'Forecast risk escalation probability',
    tag: 'Predictive ML',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: TrendingUp,
    inputLabel: 'Multivariate Features',
    inputDesc: 'Lagged physical velocity, expenditure trajectory, seasonality, geographical terrain indices, and executing agency index.',
    engineLabel: 'Gradient-Boosted Ensembles',
    engineDesc: 'Calibrated machine learning models (HGB / DART) trained on historic execution records across sectors.',
    outputLabel: 'Probabilistic Risk Scores',
    outputDesc: 'Calibrated risk score (0–100), dominant risk type (Schedule / Cost / Land / Contractor), and model confidence band.',
    realWorldExample: 'Estimates 78% probability of severe schedule slippage 6 to 9 months before official project revisions.',
    keyMetric: 'Multi-Horizon Forecast',
  },
  {
    id: 4,
    stageNumber: '04',
    name: 'Explain',
    shortDesc: 'Surface SHAP-driven evidence & peer benchmarks',
    tag: 'Explainable AI',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: FileCheck2,
    inputLabel: 'Feature Attribution Data',
    inputDesc: 'Local TreeSHAP feature contributions paired with sectoral peer delay distributions across similar projects.',
    engineLabel: 'Evidence Grounding Engine',
    engineDesc: 'Deterministic attribution linking key contributing signals (e.g. progress-vs-time gap) without asserting false causality.',
    outputLabel: 'Transparent Audit Dossier',
    outputDesc: 'Intuitive water-fall breakdown of contributing factors, sectoral peer quartiles, and verified historical analogies.',
    realWorldExample: '"Progress-vs-time gap contributed +34% to predicted risk; project is in slowest 15% of highway peers."',
    keyMetric: 'SHAP Evidence Grounding',
  },
  {
    id: 5,
    stageNumber: '05',
    name: 'Prioritize',
    shortDesc: 'Rank interventions by Risk × Impact score',
    tag: 'Decision Matrix',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Sliders,
    inputLabel: 'Multi-Factor Triage Inputs',
    inputDesc: 'Predictive risk score, total capital outlay at risk (₹ Cr), persistence of warning signals, and national strategic weight.',
    engineLabel: 'Impact Prioritization Matrix',
    engineDesc: 'Mathematical formulation: Priority = Risk Score × Outlay Impact × Persistence × Evidence Sufficiency.',
    outputLabel: 'Actionable Review Queue',
    outputDesc: 'Tiered escalation queue (Tier 1: Immediate Ministerial Review, Tier 2: Active Monitoring, Tier 3: Routine).',
    realWorldExample: 'Separates small delayed local assets from ₹5,000 Cr critical corridors needing urgent Cabinet attention.',
    keyMetric: 'Risk × Impact Formula',
  },
  {
    id: 6,
    stageNumber: '06',
    name: 'Intervene',
    shortDesc: 'Deploy targeted governance actions',
    tag: 'Human-in-the-Loop',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: ShieldCheck,
    inputLabel: 'Decision-Support Packages',
    inputDesc: 'Executive briefing memos, inter-agency coordination dossiers, and recommended structural review categories.',
    engineLabel: 'Governance Workflow Hub',
    engineDesc: 'Human-in-the-loop escalation routing flags to senior ministry secretaries and PRAGATI review meetings.',
    outputLabel: 'Resolution & Accountability',
    outputDesc: 'Inter-ministerial resolution directives, fast-tracked clearances, contractor reallocation, and tracked outcomes.',
    realWorldExample: 'PRAGATI recommends with transparent evidence; government officials validate context and execute decisive policy action.',
    keyMetric: 'Officials Decide & Act',
  },
];

export default function WorkflowSection() {
  const [activeStepId, setActiveStepId] = useState<number>(3); // Default to 'Predict' for immediate impact

  const activeStep = WORKFLOW_STEPS.find((s) => s.id === activeStepId) || WORKFLOW_STEPS[2];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-slate-50/70 border-t border-slate-200/80 scroll-mt-24 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/70 text-sky-800 text-xs font-bold tracking-widest uppercase mb-4 border border-sky-200/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            From Data to Decision
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How PRAGATI Transforms <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-900 bg-clip-text text-transparent">
              Infrastructure Governance
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            A continuous intelligence pipeline that ingests raw project reporting, forecasts risks before they escalate,
            and delivers evidence-grounded priorities to decision-makers.
          </p>

          {/* Product Mantra Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs">
            <span className="text-sky-600 font-bold">Predict</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-cyan-600 font-bold">Explain</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-amber-600 font-bold">Prioritize</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-emerald-600 font-bold">Intervene</span>
          </div>
        </div>

        {/* Desktop Connected Step Bar */}
        <div className="hidden lg:block mb-10">
          <div className="relative">
            {/* Horizontal Track Background */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200/90 rounded-full z-0" />
            
            {/* Dynamic Active Line fill */}
            <div
              className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 rounded-full z-0 transition-all duration-500"
              style={{
                width: `${((activeStepId - 1) / (WORKFLOW_STEPS.length - 1)) * 88}%`,
              }}
            />

            {/* 6 Step Nodes */}
            <div className="grid grid-cols-6 gap-3 relative z-10">
              {WORKFLOW_STEPS.map((step) => {
                const isActive = step.id === activeStepId;
                const isPassed = step.id < activeStepId;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`group flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer ${
                      isActive
                        ? 'bg-white shadow-lg shadow-sky-100/60 border border-sky-300 -translate-y-1'
                        : 'bg-white/80 hover:bg-white border border-slate-200/70 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Node Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-2.5 ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30 ring-4 ring-sky-100 scale-105'
                          : isPassed
                          ? 'bg-sky-50 text-sky-600 border border-sky-200'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>

                    {/* Step Title & ID */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[11px] font-mono font-bold tracking-wider ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                        {step.stageNumber}
                      </span>
                      <h4 className={`text-sm font-bold tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {step.name}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-tight">
                      {step.shortDesc}
                    </p>

                    {/* Active Indicator dot */}
                    {isActive && (
                      <span className="mt-2.5 inline-block w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Selector (Scrollable Tab Strip) */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = step.id === activeStepId;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <StepIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{step.stageNumber}. {step.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Stage Intelligence Inspector (Main Detail Card) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-10 transition-all duration-300 relative overflow-hidden">
          {/* Subtle Stage Accent Watermark */}
          <div className="absolute -right-8 -bottom-10 text-9xl font-black text-slate-100/80 select-none pointer-events-none font-mono">
            {activeStep.stageNumber}
          </div>

          {/* Inspector Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/20">
                <activeStep.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600">
                    Stage {activeStep.stageNumber} of 06
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${activeStep.badgeColor}`}>
                    {activeStep.tag}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {activeStep.name}: {activeStep.shortDesc}
                </h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold self-start sm:self-auto">
              <span className="text-slate-400">Core Benchmark:</span>
              <span className="text-slate-900 font-bold">{activeStep.keyMetric}</span>
            </div>
          </div>

          {/* 3-Column Pipeline Architecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 relative z-10">
            {/* Column 1: Inflow */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 hover:border-sky-200 transition-colors">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                {activeStep.inputLabel}
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Input Signals</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeStep.inputDesc}
              </p>
            </div>

            {/* Column 2: Engine */}
            <div className="bg-sky-50/40 rounded-2xl p-5 border border-sky-100 hover:border-sky-300 transition-colors">
              <div className="flex items-center gap-2.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">
                <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                {activeStep.engineLabel}
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">PRAGATI Intelligence</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeStep.engineDesc}
              </p>
            </div>

            {/* Column 3: Output */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 hover:border-sky-200 transition-colors">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                {activeStep.outputLabel}
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Decision Deliverable</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeStep.outputDesc}
              </p>
            </div>
          </div>

          {/* Real-World Context Callout */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl mt-0.5 sm:mt-0 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">
                  Demonstrated Operational Value
                </div>
                <p className="text-sm sm:text-base text-slate-200 font-medium">
                  {activeStep.realWorldExample}
                </p>
              </div>
            </div>

            {/* Interactive Step Advancement Controls */}
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                disabled={activeStepId === 1}
                onClick={() => setActiveStepId((prev) => Math.max(1, prev - 1))}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                disabled={activeStepId === WORKFLOW_STEPS.length}
                onClick={() => setActiveStepId((prev) => Math.min(WORKFLOW_STEPS.length, prev + 1))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 text-xs font-bold text-white hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Human-in-the-Loop Institutional Note */}
        <div className="mt-10 max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 bg-white/80 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Human-in-the-Loop Architecture:</strong> ML models predict and calculate evidence. 
              PRAGATI never makes autonomous decisions; officials validate context and decide.
            </span>
          </div>
          <span className="font-mono text-slate-400">Gov-Ready Intelligence Engine</span>
        </div>
      </div>
    </section>
  );
}
