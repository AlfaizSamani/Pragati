'use client';

import React, { useSyncExternalStore } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RiskTier } from '@/lib/types';
import { RISK_TIER_CONFIG } from '@/lib/constants';

interface RiskOverviewChartProps {
  distribution: Record<RiskTier, number>;
  totalProjects: number;
  onSelectTier?: (tier: RiskTier | null) => void;
  selectedTier?: RiskTier | null;
}

const subscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

const TIER_ORDER: RiskTier[] = ['critical', 'high', 'medium', 'low'];

export function RiskOverviewChart({
  distribution,
  totalProjects,
  onSelectTier,
  selectedTier
}: RiskOverviewChartProps) {
  const mounted = useMounted();

  const chartData = TIER_ORDER.map((tier) => {
    const count = distribution[tier] || 0;
    const pct = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
    return {
      tier,
      name: RISK_TIER_CONFIG[tier].label,
      count,
      pct,
      color: RISK_TIER_CONFIG[tier].color,
    };
  });

  const elevatedCount = (distribution.critical || 0) + (distribution.high || 0);
  const elevatedPct = totalProjects > 0 ? Math.round((elevatedCount / totalProjects) * 100) : 0;

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-royal">
              Portfolio Risk Distribution
            </CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              Breakdown across decision-support risk tiers
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            {elevatedPct}% Elevated Risk
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto">
          {/* Donut Chart Visual */}
          <div className="sm:col-span-5 relative flex items-center justify-center h-48 sm:h-52">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="count"
                    onClick={(entry: { tier?: RiskTier; payload?: { tier?: RiskTier } }) => {
                      const tier = (entry?.tier || entry?.payload?.tier) as RiskTier | undefined;
                      if (onSelectTier && tier) {
                        onSelectTier(selectedTier === tier ? null : tier);
                      }
                    }}
                    cursor="pointer"
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.tier}`}
                        fill={entry.color}
                        stroke={selectedTier === entry.tier ? '#0f172a' : '#ffffff'}
                        strokeWidth={selectedTier === entry.tier ? 3 : 1.5}
                        opacity={selectedTier && selectedTier !== entry.tier ? 0.45 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-700">
                            <div className="font-semibold">{data.name}</div>
                            <div className="text-slate-300 mt-0.5">
                              {data.count} projects ({data.pct}%)
                            </div>
                            <div className="text-[10px] text-sky-300 mt-1">Click to filter table</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-36 h-36 rounded-full border-8 border-slate-200 animate-pulse flex items-center justify-center">
                <span className="text-xs text-slate-400">Loading...</span>
              </div>
            )}

            {/* Centered Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-black text-royal tracking-tight">{totalProjects}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Projects
              </span>
            </div>
          </div>

          {/* Detailed Tier Breakdown List */}
          <div className="sm:col-span-7 space-y-2">
            {chartData.map((item) => {
              const isSelected = selectedTier === item.tier;
              return (
                <button
                  type="button"
                  key={item.tier}
                  onClick={() => onSelectTier && onSelectTier(isSelected ? null : item.tier)}
                  className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-100 border-slate-400 shadow-sm'
                      : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden hidden sm:block">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900 w-6 text-right">
                      {item.count}
                    </span>
                    <span className="text-[11px] text-slate-400 w-9 text-right font-mono">
                      {item.pct}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Narrative Context */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>50% in High/Critical Tiers</span>
          <span className="text-slate-400 font-medium">Click slice to filter priority queue</span>
        </div>
      </CardContent>
    </Card>
  );
}
