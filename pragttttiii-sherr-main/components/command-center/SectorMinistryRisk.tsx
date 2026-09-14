'use client';

import React, { useState } from 'react';
import { Layers, ShieldAlert } from 'lucide-react';
import { SectorSummary, MinistrySummary } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface SectorMinistryRiskProps {
  sectorBreakdown: SectorSummary[];
  ministryBreakdown: MinistrySummary[];
  onSelectSector?: (sector: string) => void;
  activeSector?: string;
}

export function SectorMinistryRisk({
  sectorBreakdown,
  ministryBreakdown,
  onSelectSector,
  activeSector
}: SectorMinistryRiskProps) {
  const [viewMode, setViewMode] = useState<'sector' | 'ministry'>('sector');

  // Sort sectors/ministries by highest average risk score desc
  const sortedSectors = [...sectorBreakdown].sort((a, b) => b.avgRiskScore - a.avgRiskScore);
  const sortedMinistries = [...ministryBreakdown].sort((a, b) => b.avgRiskScore - a.avgRiskScore);

  const items = viewMode === 'sector' ? sortedSectors : sortedMinistries;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-sky-100 text-sky-800">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-royal">
                Sector & Ministry Risk Exposure
              </CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Relative risk density and high-risk project concentrations
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('sector')}
              className={`text-xs px-3 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'sector'
                  ? 'bg-white text-royal shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Sector ({sectorBreakdown.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ministry')}
              className={`text-xs px-3 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'ministry'
                  ? 'bg-white text-royal shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Ministry ({ministryBreakdown.length})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-3">
          {items.map((item) => {
            const name = 'sector' in item ? item.sector : item.ministry;
            const isSelected = activeSector === name;
            const avgRisk = Math.round(item.avgRiskScore);
            const riskColor =
              avgRisk >= 75
                ? 'bg-red-500'
                : avgRisk >= 56
                ? 'bg-amber-500'
                : avgRisk >= 35
                ? 'bg-sky-500'
                : 'bg-emerald-500';

            return (
              <div
                key={name}
                onClick={() => onSelectSector && onSelectSector(isSelected ? '' : name)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-50/70 border-primary-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.projectCount} {item.projectCount === 1 ? 'project' : 'projects'}
                    </span>
                    {item.highRiskCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-red-600" />
                        {item.highRiskCount} Elevated
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500">
                      Budget: <strong className="text-slate-700">{formatCurrency(item.totalCostCrore)}</strong>
                    </span>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-slate-500 font-normal">Risk:</span>
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                        avgRisk >= 75 ? 'text-red-700 bg-red-50' :
                        avgRisk >= 56 ? 'text-amber-700 bg-amber-50' : 'text-slate-700 bg-slate-100'
                      }`}>
                        {avgRisk} / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Relative Risk Score Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${riskColor}`}
                    style={{ width: `${Math.min(100, Math.max(10, avgRisk))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Click any category to filter the entire console</span>
          <span>Ranked by Average Predictive Risk</span>
        </div>
      </CardContent>
    </Card>
  );
}
