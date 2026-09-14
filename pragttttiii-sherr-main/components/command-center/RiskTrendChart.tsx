'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProjectMonthSnapshot } from '@/lib/types';
import { formatMonth } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface RiskTrendChartProps {
  trajectories: Record<string, ProjectMonthSnapshot[]>;
}

const subscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function RiskTrendChart({ trajectories }: RiskTrendChartProps) {
  const mounted = useMounted();
  const [selectedSeries, setSelectedSeries] = useState<string>('portfolio_avg');

  const seriesOptions = [
    { id: 'portfolio_avg', label: 'Portfolio Sample Average', badge: 'Aggregate' },
    { id: 'PROJ-008', label: 'PROJ-008 · Zojila Tunnel', badge: 'Critical' },
    { id: 'PROJ-001', label: 'PROJ-001 · Mumbai-Ahmedabad HSR', badge: 'High' },
    { id: 'PROJ-003', label: 'PROJ-003 · Eastern DFC', badge: 'Recovering' },
    { id: 'PROJ-002', label: 'PROJ-002 · Delhi-Mumbai Exp', badge: 'Low' },
  ];

  // Prepare chart dataset
  const chartData = useMemo(() => {
    const months = [
      '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11',
      '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'
    ];

    if (selectedSeries === 'portfolio_avg') {
      const p1 = trajectories['PROJ-001'] || [];
      const p8 = trajectories['PROJ-008'] || [];
      const p3 = trajectories['PROJ-003'] || [];
      const p2 = trajectories['PROJ-002'] || [];

      return months.map((m, idx) => {
        const r1 = p1[idx]?.riskScore ?? 58;
        const r8 = p8[idx]?.riskScore ?? 85;
        const r3 = p3[idx]?.riskScore ?? 54;
        const r2 = p2[idx]?.riskScore ?? 31;
        const avgRisk = Math.round(((r1 + r8 + r3 + r2) / 4) * 10) / 10;

        const pr1 = p1[idx]?.physicalProgress ?? 30;
        const pr8 = p8[idx]?.physicalProgress ?? 30;
        const pr3 = p3[idx]?.physicalProgress ?? 80;
        const pr2 = p2[idx]?.physicalProgress ?? 65;
        const avgProg = Math.round(((pr1 + pr8 + pr3 + pr2) / 4) * 10) / 10;

        const cost1 = p1[idx]?.costEscalationPct ?? 0;
        const cost8 = p8[idx]?.costEscalationPct ?? 0;
        const cost3 = p3[idx]?.costEscalationPct ?? 0;
        const cost2 = p2[idx]?.costEscalationPct ?? 0;
        const avgCost = Math.round(((cost1 + cost8 + cost3 + cost2) / 4) * 10) / 10;

        return {
          month: m,
          monthLabel: formatMonth(m),
          riskScore: avgRisk,
          physicalProgress: avgProg,
          costEscalationPct: avgCost
        };
      });
    } else {
      const traj = trajectories[selectedSeries] || [];
      return traj.map(t => ({
        month: t.month,
        monthLabel: formatMonth(t.month),
        riskScore: t.riskScore,
        physicalProgress: t.physicalProgress,
        costEscalationPct: t.costEscalationPct
      }));
    }
  }, [trajectories, selectedSeries]);

  // Compute trend delta (start vs end)
  const firstPoint = chartData[0];
  const lastPoint = chartData[chartData.length - 1];
  const riskDelta = lastPoint && firstPoint ? Math.round((lastPoint.riskScore - firstPoint.riskScore) * 10) / 10 : 0;
  const progressDelta = lastPoint && firstPoint ? Math.round((lastPoint.physicalProgress - firstPoint.physicalProgress) * 10) / 10 : 0;

  const trendStatus = riskDelta > 2 
    ? { label: 'Increasing Risk', color: 'text-red-700 bg-red-50 border-red-200', icon: TrendingUp }
    : riskDelta < -2
    ? { label: 'Decreasing Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: TrendingDown }
    : { label: 'Stable Trajectory', color: 'text-slate-700 bg-slate-100 border-slate-200', icon: Minus };

  const TrendIcon = trendStatus.icon;

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-600" />
              <CardTitle className="text-base font-bold text-royal">
                13-Month Risk & Progress Trajectory
              </CardTitle>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Historical movement from June 2025 to June 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${trendStatus.color}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              {trendStatus.label} ({riskDelta > 0 ? `+${riskDelta}` : riskDelta} pts)
            </span>
          </div>
        </div>

        {/* Series Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
          {seriesOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedSeries(opt.id)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-all ${
                selectedSeries === opt.id
                  ? 'bg-royal text-white border-royal shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2 flex-1 flex flex-col justify-between">
        <div className="h-56 sm:h-64 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskScoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="monthLabel" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl border border-slate-700 min-w-44">
                          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
                            <span>{data.monthLabel}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{data.month}</span>
                          </div>
                          <div className="flex items-center justify-between text-red-400 font-semibold mb-1">
                            <span>Risk Score:</span>
                            <span className="text-sm font-bold">{data.riskScore} / 100</span>
                          </div>
                          <div className="flex items-center justify-between text-sky-300 font-semibold mb-1">
                            <span>Physical Progress:</span>
                            <span>{data.physicalProgress}%</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-300 font-medium">
                            <span>Cost Escalation:</span>
                            <span>+{data.costEscalationPct}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Score (0–100)"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskScoreGradient)"
                  dot={{ r: 3, fill: '#dc2626', strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="physicalProgress"
                  name="Physical Progress (%)"
                  stroke="#0284c7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-slate-50 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-xs text-slate-400">Loading trend trajectory...</span>
            </div>
          )}
        </div>

        {/* Footnote Context */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>
            Progress velocity: <strong className="text-slate-800">+{progressDelta}%</strong> over 13 months
          </span>
          <span className="text-slate-400">
            * Attributions ground risk evolution, not guaranteed future milestone slips
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
