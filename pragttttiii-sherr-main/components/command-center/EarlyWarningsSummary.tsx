'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BellRing, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  PauseCircle, 
  Calendar, 
  Timer
} from 'lucide-react';
import { Alert, Project } from '@/lib/types';
import { RISK_TIER_CONFIG, DOMINANT_RISK_CONFIG } from '@/lib/constants';
import { formatMonth } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface EarlyWarningsSummaryProps {
  alerts: Alert[];
  projects: Project[];
  filteredProjectIds?: Set<string>;
}

export function EarlyWarningsSummary({
  alerts,
  projects,
  filteredProjectIds
}: EarlyWarningsSummaryProps) {
  const projectMap = new Map(projects.map(p => [p.id, p]));

  // Active alerts filtered and sorted (critical first, then high persistence)
  const activeAlerts = alerts
    .filter(a => a.isActive)
    .filter(a => !filteredProjectIds || filteredProjectIds.has(a.projectId))
    .sort((a, b) => {
      if (a.riskTier === 'critical' && b.riskTier !== 'critical') return -1;
      if (b.riskTier === 'critical' && a.riskTier !== 'critical') return 1;
      return b.persistenceMonths - a.persistenceMonths;
    });

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-orange-100 text-orange-700">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-royal">
                Active Early Warnings Telemetry
              </CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Surveillance signals with persistent lead-time tracking
              </p>
            </div>
          </div>

          <Link href="/early-warnings">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs font-semibold flex items-center gap-1.5 h-8"
            >
              <span>View All Early Warnings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {activeAlerts.length === 0 ? (
          <p className="text-sm text-neutral-500 py-6 text-center">
            No active early warnings matching the selected filter criteria.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeAlerts.slice(0, 6).map((alert) => {
              const project = projectMap.get(alert.projectId);
              const tierConfig = RISK_TIER_CONFIG[alert.riskTier];
              const dominantConfig = DOMINANT_RISK_CONFIG[alert.type];
              const isCritical = alert.riskTier === 'critical';

              return (
                <div
                  key={alert.id}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                    isCritical
                      ? 'bg-red-50/40 border-red-200/80 hover:border-red-300'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Top Row: Severity & Persistence */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                          style={{
                            backgroundColor: tierConfig.bgColor,
                            color: tierConfig.textColor,
                            borderColor: tierConfig.borderColor
                          }}
                        >
                          {alert.riskTier}
                        </span>

                        <span className="text-[11px] font-medium text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200 flex items-center gap-1">
                          {alert.type === 'cost_escalation' ? (
                            <TrendingUp className="w-3 h-3 text-amber-600" />
                          ) : alert.type === 'progress_stall' ? (
                            <PauseCircle className="w-3 h-3 text-purple-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-red-600" />
                          )}
                          {dominantConfig?.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Timer className="w-3 h-3 text-slate-400" />
                        <span>{alert.persistenceMonths} mos active</span>
                      </div>
                    </div>

                    {/* Project Name Link */}
                    {project ? (
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-bold text-royal hover:text-primary-700 line-clamp-1 block transition-colors"
                      >
                        {project.name}
                      </Link>
                    ) : (
                      <span className="text-sm font-bold text-royal">{alert.projectId}</span>
                    )}

                    {/* Evidence / Signal Message */}
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>

                  {/* Footnote: First Raised & Lead Time */}
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Raised {formatMonth(alert.firstRaisedMonth)}
                    </span>
                    {alert.leadTimeMonths ? (
                      <span className="text-amber-700 font-medium">
                        {alert.leadTimeMonths} mo lead-time
                      </span>
                    ) : (
                      <span>Active telemetry</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
