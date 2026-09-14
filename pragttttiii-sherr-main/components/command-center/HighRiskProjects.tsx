'use client';

import React from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  Building2, 
  Clock, 
  TrendingUp, 
  PauseCircle 
} from 'lucide-react';
import { Project, RiskAssessment } from '@/lib/types';
import { RISK_TIER_CONFIG, DOMINANT_RISK_CONFIG } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface HighRiskProjectsProps {
  projects: Project[];
  riskAssessments: RiskAssessment[];
  filteredProjectIds?: Set<string>;
}

export function HighRiskProjects({
  projects,
  riskAssessments,
  filteredProjectIds
}: HighRiskProjectsProps) {
  const projectMap = new Map(projects.map(p => [p.id, p]));

  // Find all high/critical assessments, filtered and sorted by risk score desc
  const highRiskItems = riskAssessments
    .filter(r => r.riskTier === 'high' || r.riskTier === 'critical')
    .filter(r => !filteredProjectIds || filteredProjectIds.has(r.projectId))
    .sort((a, b) => b.riskScore - a.riskScore);

  if (highRiskItems.length === 0) {
    return null;
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-red-100 text-red-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-royal">
                High & Critical Risk Focus
              </CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Top risk-scored projects requiring heightened surveillance
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
            {highRiskItems.length} Flagged
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {highRiskItems.map((risk, index) => {
            const project = projectMap.get(risk.projectId);
            if (!project) return null;

            const tierConfig = RISK_TIER_CONFIG[risk.riskTier];
            const dominantConfig = DOMINANT_RISK_CONFIG[risk.dominantRisk];
            const isCritical = risk.riskTier === 'critical';

            return (
              <div
                key={risk.projectId}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                  isCritical 
                    ? 'bg-red-50/30 border-red-200 hover:border-red-300' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar: Rank & Risk Score */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      RANK #{index + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <div
                        className="px-2 py-0.5 rounded text-xs font-bold border"
                        style={{
                          backgroundColor: tierConfig.bgColor,
                          color: tierConfig.textColor,
                          borderColor: tierConfig.borderColor
                        }}
                      >
                        Risk {risk.riskScore} · {risk.riskTier.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Project Name */}
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm font-bold text-royal hover:text-primary-700 line-clamp-2 leading-snug transition-colors"
                  >
                    {project.name}
                  </Link>

                  {/* Location & Sector */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {project.state}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {project.sector}
                    </span>
                  </div>

                  {/* Dominant Risk Driver */}
                  <div className="flex items-center gap-1.5 mt-3 text-xs">
                    <span className="text-slate-400 font-medium">Dominant:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      {risk.dominantRisk === 'cost_escalation' ? (
                        <TrendingUp className="w-3 h-3 text-amber-600" />
                      ) : risk.dominantRisk === 'progress_stall' ? (
                        <PauseCircle className="w-3 h-3 text-purple-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-red-600" />
                      )}
                      {dominantConfig?.label || risk.dominantRisk}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Physical Progress</span>
                      <span className="font-bold text-slate-700">{project.physicalProgress}%</span>
                    </div>
                    <ProgressBar
                      value={project.physicalProgress}
                      heightClass="h-1.5"
                      colorClass={isCritical ? 'bg-red-500' : 'bg-amber-500'}
                    />
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {project.id}
                  </span>
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900 group"
                  >
                    <span>View project</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
