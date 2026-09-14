'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertOctagon, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  PauseCircle, 
  Building2, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Target
} from 'lucide-react';
import { InterventionPriority, Project, RiskAssessment } from '@/lib/types';
import { PRIORITY_LEVEL_CONFIG, DOMINANT_RISK_CONFIG, RISK_TIER_CONFIG } from '@/lib/constants';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PriorityQueueProps {
  interventions: InterventionPriority[];
  projects: Project[];
  riskAssessments: RiskAssessment[];
  filteredProjectIds?: Set<string>;
  onClearFilters?: () => void;
}

export function PriorityQueue({
  interventions,
  projects,
  riskAssessments,
  filteredProjectIds,
  onClearFilters
}: PriorityQueueProps) {
  const [showAll, setShowAll] = useState(false);

  // Map project lookup
  const projectMap = new Map(projects.map(p => [p.id, p]));
  const riskMap = new Map(riskAssessments.map(r => [r.projectId, r]));

  // Filter interventions based on active filter set
  const queue = interventions.filter(item => {
    if (!filteredProjectIds) return true;
    return filteredProjectIds.has(item.projectId);
  });

  const displayedItems = showAll ? queue : queue.slice(0, 6);

  if (queue.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed border-slate-300">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Target className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No priority projects match these filters</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Try expanding your search parameters or resetting the ministry, sector, or risk tier filters.
        </p>
        {onClearFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="mt-4 text-xs font-semibold"
          >
            Clear All Filters
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <CardTitle className="text-lg font-bold text-royal tracking-tight">
                Priority Intervention Queue
              </CardTitle>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                {queue.length} Queued
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Ranked composite: Risk × Economic Impact × Anomaly Persistence × Grounding Evidence
            </p>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline font-mono">
            Sorted: Priority Composite (0–100)
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {displayedItems.map((item, index) => {
          const project = projectMap.get(item.projectId);
          const risk = riskMap.get(item.projectId);
          if (!project) return null;

          const isCriticalP1 = item.priorityLevel === 'P1';
          const priorityConfig = PRIORITY_LEVEL_CONFIG[item.priorityLevel];
          const dominantRisk = risk?.dominantRisk || 'schedule_delay';
          const dominantConfig = DOMINANT_RISK_CONFIG[dominantRisk];
          const riskTier = risk?.riskTier || 'medium';
          const tierConfig = RISK_TIER_CONFIG[riskTier];

          return (
            <div
              key={item.projectId}
              className={`rounded-xl border transition-all ${
                isCriticalP1
                  ? 'bg-gradient-to-r from-red-50/70 via-white to-white border-red-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              } p-4 sm:p-5`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Side: Priority Rank, Details & Status */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Rank Number */}
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      #{index + 1}
                    </span>

                    {/* Priority Level Badge */}
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5"
                      style={{
                        backgroundColor: priorityConfig.bgColor,
                        color: priorityConfig.color,
                        borderColor: priorityConfig.color
                      }}
                    >
                      {isCriticalP1 && <AlertOctagon className="w-3 h-3 text-red-600" />}
                      {priorityConfig.label}
                    </span>

                    {/* Risk Tier Badge */}
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wider"
                      style={{
                        backgroundColor: tierConfig.bgColor,
                        color: tierConfig.textColor,
                        borderColor: tierConfig.borderColor
                      }}
                    >
                      Score: {risk?.riskScore ?? '--'} ({tierConfig.label})
                    </span>

                    {/* Dominant Risk Tag */}
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      {dominantRisk === 'cost_escalation' ? (
                        <TrendingUp className="w-3 h-3 text-amber-600" />
                      ) : dominantRisk === 'progress_stall' ? (
                        <PauseCircle className="w-3 h-3 text-purple-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-red-600" />
                      )}
                      {dominantConfig?.label}
                    </span>
                  </div>

                  {/* Project Title */}
                  <div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-base sm:text-lg font-bold text-royal hover:text-primary-700 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span>{project.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary-600" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {project.ministry}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {project.state} ({project.sector})
                      </span>
                      <span className="text-slate-400 font-mono">
                        ID: {project.id}
                      </span>
                    </div>
                  </div>

                  {/* Operational Recommendation / Contributing Signal */}
                  <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                    isCriticalP1 ? 'bg-red-100/60 text-red-900 border border-red-200/80' : 'bg-slate-50 text-slate-700 border border-slate-200/60'
                  }`}>
                    <strong className="font-semibold">Recommended Intervention:</strong> {item.recommendedAction}
                  </div>
                </div>

                {/* Right Side: Composite Breakdown & Action */}
                <div className="lg:w-80 shrink-0 space-y-3 pt-3 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-5">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-500 font-medium">Physical Progress</span>
                      <span className="font-bold text-slate-800">{project.physicalProgress}%</span>
                    </div>
                    <ProgressBar
                      value={project.physicalProgress}
                      colorClass={
                        project.physicalProgress < 30 ? 'bg-red-500' :
                        project.physicalProgress < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }
                    />
                  </div>

                  {/* 4-Factor Breakdown Chips */}
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="bg-slate-50 p-1 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Risk</span>
                      <span className="text-xs font-bold text-slate-800">{item.riskComponent}</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Impact</span>
                      <span className="text-xs font-bold text-slate-800">{item.impactComponent}</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Persist</span>
                      <span className="text-xs font-bold text-slate-800">{item.persistenceComponent}</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Evid</span>
                      <span className="text-xs font-bold text-slate-800">{item.evidenceComponent}</span>
                    </div>
                  </div>

                  {/* Drill-down Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-slate-400" />
                      <span>Score {item.priorityScore}/100</span>
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <Button
                        size="sm"
                        variant={isCriticalP1 ? 'primary' : 'secondary'}
                        className="text-xs py-1.5 h-auto px-3 font-semibold"
                      >
                        <span>View Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Show More / Show Less Toggle */}
        {queue.length > 6 && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 bg-primary-50 px-4 py-2 rounded-lg border border-primary-200 hover:bg-primary-100 transition-colors"
            >
              {showAll ? (
                <>
                  <span>Show Top 6 Priority Items</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>View All {queue.length} Queued Interventions</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
