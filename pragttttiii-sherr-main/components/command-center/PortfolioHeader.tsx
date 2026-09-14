'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowRight, ShieldCheck, Database, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PortfolioHeaderProps {
  reportingMonth: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  filteredCount: number;
  totalCount: number;
}

export function PortfolioHeader({
  reportingMonth,
  isRefreshing,
  onRefresh,
  filteredCount,
  totalCount
}: PortfolioHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title & Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl md:text-3xl font-bold text-royal tracking-tight">
              Command Center
            </h1>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-sm font-semibold text-slate-700">
              Infrastructure Portfolio Intelligence
            </span>
            <Badge variant="subtle" className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-mono">
              <Calendar className="w-3 h-3 mr-1 text-slate-500 inline" />
              CYCLE: {reportingMonth}
            </Badge>
          </div>

          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            Continuous operational telemetry, multi-factor risk attribution, and decision-support intervention prioritization across central sector infrastructure assets.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
              <Database className="w-3 h-3 text-amber-600" />
              LIVE STAGE 10 SNAPSHOT · June 2026
            </span>
            <span className="inline-flex items-center gap-1 text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Evidence-grounded attributions (SHAP)
            </span>
            {filteredCount !== totalCount && (
              <span className="text-primary-700 font-medium">
                Filtering: {filteredCount} of {totalCount} projects
              </span>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Refresh Console'}
          </Button>

          <Link href="/projects">
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
