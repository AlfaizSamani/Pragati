'use client';

import React from 'react';
import { 
  FolderGit2, 
  AlertOctagon, 
  AlertTriangle, 
  BellRing, 
  Target, 
  TrendingUp
} from 'lucide-react';
import { PortfolioSummary } from '@/lib/types';
import { formatLakhCrore } from '@/lib/utils';

interface PortfolioKpiStripProps {
  summary: PortfolioSummary;
  totalAlertsCount: number;
}

export function PortfolioKpiStrip({ summary, totalAlertsCount }: PortfolioKpiStripProps) {
  const elevatedTotal = summary.highRiskCount + summary.criticalRiskCount;
  const elevatedPct = Math.round((elevatedTotal / summary.totalProjects) * 100);

  const kpis = [
    {
      label: 'Monitored Projects',
      value: summary.totalProjects,
      subtext: `${formatLakhCrore(summary.totalRevisedCostLakhCrore)} total portfolio`,
      icon: FolderGit2,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50/60',
      borderColor: 'border-slate-200',
      valueColor: 'text-slate-900',
    },
    {
      label: 'Critical Risk',
      value: summary.criticalRiskCount,
      subtext: 'Immediate review required (P1)',
      icon: AlertOctagon,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50/70',
      borderColor: 'border-red-200/80',
      valueColor: 'text-red-700',
      badge: 'URGENT',
      badgeColor: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      label: 'High Risk',
      value: summary.highRiskCount,
      subtext: `${elevatedPct}% of portfolio elevated`,
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/60',
      borderColor: 'border-amber-200/80',
      valueColor: 'text-amber-800',
    },
    {
      label: 'Active Early Warnings',
      value: totalAlertsCount || summary.newWarnings,
      subtext: `${summary.newWarnings} new this cycle`,
      icon: BellRing,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50/60',
      borderColor: 'border-orange-200/80',
      valueColor: 'text-orange-800',
    },
    {
      label: 'Intervention Queue',
      value: summary.interventionQueueSize,
      subtext: '3 P1 Critical · 4 P2 High',
      icon: Target,
      iconColor: 'text-primary-700',
      bgColor: 'bg-primary-50/60',
      borderColor: 'border-primary-200/80',
      valueColor: 'text-primary-900',
    },
    {
      label: 'Avg Physical Progress',
      value: `${summary.avgPhysicalProgress.toFixed(1)}%`,
      subtext: `${formatLakhCrore(summary.totalExpenditureLakhCrore)} spent to date`,
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/60',
      borderColor: 'border-emerald-200/80',
      valueColor: 'text-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${kpi.borderColor}`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
                {kpi.label}
              </span>
              <div className={`p-1.5 rounded-md ${kpi.bgColor} shrink-0`}>
                <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl lg:text-3xl font-bold tracking-tight ${kpi.valueColor}`}>
                  {kpi.value}
                </span>
                {kpi.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${kpi.badgeColor}`}>
                    {kpi.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {kpi.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
