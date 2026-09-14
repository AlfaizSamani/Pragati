'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  PauseCircle, 
  Info,
  TrendingDown
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

import { getPortfolioSummary } from '@/lib/api/portfolio';
import { getProjects, getAllRiskAssessments, getAllProjectTrajectories } from '@/lib/api/projects';
import { PortfolioSummary, Project, RiskAssessment, ProjectMonthSnapshot, RiskTier } from '@/lib/types';
import { RISK_TIER_CONFIG, DOMINANT_RISK_CONFIG } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const subscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export default function RiskMonitorPage() {
  const mounted = useMounted();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [trajectories, setTrajectories] = useState<Record<string, ProjectMonthSnapshot[]>>({});

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getPortfolioSummary(),
      getProjects(),
      getAllRiskAssessments(),
      getAllProjectTrajectories()
    ]).then(([sumData, projData, riskData, trajData]) => {
      setSummary(sumData);
      setProjects(projData);
      setRiskAssessments(riskData);
      setTrajectories(trajData);
      setLoading(false);
    }).catch(err => {
      console.error('[PRAGATI] Risk Monitor load failed:', err);
      setError(`Failed to load data: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);

  // Compute increasing risk projects from trajectories (first vs last month)
  const increasingProjects = useMemo(() => {
    const list: Array<{
      projectId: string;
      name: string;
      prevRisk: number;
      currRisk: number;
      change: number;
      dominantRisk: string;
      progress: number;
      tier: RiskTier;
    }> = [];

    Object.entries(trajectories).forEach(([pid, snapshots]) => {
      if (snapshots.length >= 2) {
        const first = snapshots[0];
        const last = snapshots[snapshots.length - 1];
        const change = last.riskScore - first.riskScore;
        const project = projectMap.get(pid);
        const risk = riskAssessments.find(r => r.projectId === pid);

        if (project && risk) {
          list.push({
            projectId: pid,
            name: project.name,
            prevRisk: first.riskScore,
            currRisk: last.riskScore,
            change,
            dominantRisk: risk.dominantRisk,
            progress: project.physicalProgress,
            tier: risk.riskTier
          });
        }
      }
    });

    return list.sort((a, b) => b.change - a.change);
  }, [trajectories, projectMap, riskAssessments]);

  // Compute category exposure counts
  const categoryExposure = useMemo(() => {
    const counts = { schedule_delay: 0, cost_escalation: 0, progress_stall: 0 };
    riskAssessments.forEach(r => {
      if (counts[r.dominantRisk] !== undefined) {
        counts[r.dominantRisk]++;
      }
    });
    return counts;
  }, [riskAssessments]);

  // Average confidence
  const avgConfidence = useMemo(() => {
    if (riskAssessments.length === 0) return 0;
    const sum = riskAssessments.reduce((acc, r) => acc + r.confidence, 0);
    return Math.round((sum / riskAssessments.length) * 100);
  }, [riskAssessments]);

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-royal mb-2">Connection to Backend Failed</h3>
        <p className="text-sm text-slate-500 mb-1">{error}</p>
        <p className="text-xs text-slate-400 mb-4">The Render backend may be cold-starting. This can take up to 60 seconds on the free tier.</p>
        <Button variant="primary" size="sm" onClick={loadData} className="mt-2">Retry</Button>
      </div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="space-y-6 animate-pulse pb-16">
        <div className="h-24 bg-white rounded-xl border border-slate-200 p-6" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-slate-200" />)}
        </div>
        <div className="h-64 bg-white rounded-xl border border-slate-200" />
      </div>
    );
  }

  const riskDistData = [
    { name: 'Critical Risk', count: summary.riskDistribution.critical || 0, color: '#dc2626' },
    { name: 'High Risk', count: summary.riskDistribution.high || 0, color: '#ef4444' },
    { name: 'Medium Risk', count: summary.riskDistribution.medium || 0, color: '#f59e0b' },
    { name: 'Low Risk', count: summary.riskDistribution.low || 0, color: '#10b981' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="surface-level-3 rounded-2xl p-6 relative overflow-hidden border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-royal text-sky-400 shadow-xs">
                <Activity className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-royal tracking-tight">
                Portfolio Risk Monitor
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Deep analytical surveillance of risk evolution, category exposure, increasing risk velocity, and evidence confidence.
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
            JUNE 2026 CYCLE
          </span>
        </div>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Portfolio Risk</span>
          <span className="text-2xl font-bold text-royal mt-1 block">58.5 / 100</span>
          <span className="text-[11px] text-slate-400">Mean portfolio score</span>
        </Card>
        <Card className="p-4 bg-red-50/30 border-red-200/90">
          <span className="text-[10px] text-red-700 font-bold block uppercase tracking-wider">Critical Projects</span>
          <span className="text-2xl font-bold text-red-700 mt-1 block">{summary.criticalRiskCount}</span>
          <span className="text-[11px] text-red-600">Score &ge; 76</span>
        </Card>
        <Card className="p-4 bg-amber-50/30 border-amber-200/90">
          <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider">High-Risk Projects</span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">{summary.highRiskCount}</span>
          <span className="text-[11px] text-amber-700">Score 56–75</span>
        </Card>
        <Card className="p-4 bg-orange-50/30 border-orange-200/90">
          <span className="text-[10px] text-orange-700 font-bold block uppercase tracking-wider">Increasing Risk</span>
          <span className="text-2xl font-bold text-orange-800 mt-1 block">2 Projects</span>
          <span className="text-[11px] text-orange-700">Zojila &amp; MAHSR</span>
        </Card>
        <Card className="p-4 border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Avg Confidence</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">{avgConfidence}%</span>
          <span className="text-[11px] text-slate-400">Evidence sufficiency</span>
        </Card>
      </div>

      {/* Semantic Guidance Alert */}
      <Card className="border-sky-200/80 bg-sky-50/50">
        <CardContent className="p-4 flex items-start gap-3 text-xs text-sky-950">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Decision-Support Risk Semantics:</strong> Risk score (0–100) is a decision-support ranking signal, not a guaranteed probability of failure. Confidence measures evidence sufficiency separately from risk magnitude. Predictive signals reflect model attribution metrics, not causal claims.
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution (5 Cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-royal">Risk Tier Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col justify-between">
              <div className="h-52 relative flex items-center justify-center">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {riskDistData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-36 h-36 rounded-full border-8 border-slate-200 animate-pulse" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-2xl font-black text-royal">{summary.totalProjects}</span>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold">Projects</span>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-3 border-t border-slate-100">
                {riskDistData.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.count} projects</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Category Exposure (7 Cols) */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-royal">Dominant Risk Drivers Exposure</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Schedule Delay</h4>
                    <p className="text-slate-500 text-[11px]">Timeline slippage &amp; progress-vs-time gap</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-700">{categoryExposure.schedule_delay}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Projects Flagged</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Cost Escalation</h4>
                    <p className="text-slate-500 text-[11px]">Budget inflation &amp; cost utilization overrun</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-amber-800">{categoryExposure.cost_escalation}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Projects Flagged</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                    <PauseCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Progress Stall</h4>
                    <p className="text-slate-500 text-[11px]">Zero or near-zero physical progress velocity</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-purple-800">{categoryExposure.progress_stall}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Projects Flagged</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Increasing Risk Projects Section */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-royal flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Increasing Risk Velocity Projects</span>
            </CardTitle>
            <span className="text-xs text-slate-400">13-Month Trajectory Comparison</span>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-3">
            {increasingProjects.map((item) => {
              const isIncrease = item.change > 0;
              const isDecrease = item.change < 0;
              const tierConfig = RISK_TIER_CONFIG[item.tier];

              return (
                <div
                  key={item.projectId}
                  className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{item.projectId}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
                        style={{
                          backgroundColor: tierConfig.bgColor,
                          color: tierConfig.textColor,
                          borderColor: tierConfig.borderColor
                        }}
                      >
                        {item.tier}
                      </span>
                    </div>

                    <Link
                      href={`/projects/${item.projectId}`}
                      className="text-sm font-bold text-royal hover:text-primary-700"
                    >
                      {item.name}
                    </Link>

                    <div className="text-xs text-slate-500">
                      Dominant Risk: <span className="font-semibold text-slate-700">{DOMINANT_RISK_CONFIG[item.dominantRisk as keyof typeof DOMINANT_RISK_CONFIG]?.label || item.dominantRisk}</span> · Progress: {item.progress}%
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-xs">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">13-Mo Movement</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {item.prevRisk} &rarr; {item.currRisk}
                      </span>
                    </div>

                    <div className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 ${
                      isIncrease ? 'bg-red-50 text-red-700 border-red-200' : isDecrease ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{item.change > 0 ? `+${item.change}` : item.change} pts</span>
                    </div>

                    <Link href={`/projects/${item.projectId}`}>
                      <Button size="sm" variant="secondary" className="text-xs h-8">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
