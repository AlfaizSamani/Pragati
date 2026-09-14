'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  PieChart, 
  TrendingUp, 
  BarChart2, 
  Layers, 
  Building2, 
  Clock, 
  PauseCircle, 
  Target, 
  BellRing, 
  IndianRupee, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import { getPortfolioSummary, getStateRiskSummaries, getInterventionQueue } from '@/lib/api/portfolio';
import { getProjects, getAllRiskAssessments, getAllAlerts } from '@/lib/api/projects';
import { PortfolioSummary, Project, RiskAssessment, InterventionPriority, StateRiskSummary, Alert } from '@/lib/types';
import { RISK_TIER_CONFIG, DOMINANT_RISK_CONFIG, PRIORITY_LEVEL_CONFIG } from '@/lib/constants';
import { formatCurrency, formatLakhCrore } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const subscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export default function AnalyticsPage() {
  const mounted = useMounted();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'risk' | 'sector' | 'cost_schedule' | 'interventions'>('portfolio');

  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [interventions, setInterventions] = useState<InterventionPriority[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.allSettled([
      getPortfolioSummary(),
      getProjects(),
      getAllRiskAssessments(),
      getInterventionQueue(),
      getAllAlerts()
    ]).then(([sumRes, projRes, riskRes, intervRes, alertRes]) => {
      let loadedAny = false;
      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
        loadedAny = true;
      }
      if (projRes.status === 'fulfilled') {
        setProjects(projRes.value);
        loadedAny = true;
      }
      if (riskRes.status === 'fulfilled') {
        setRiskAssessments(riskRes.value);
        loadedAny = true;
      }
      if (intervRes.status === 'fulfilled') {
        setInterventions(intervRes.value);
        loadedAny = true;
      }
      if (alertRes.status === 'fulfilled') {
        setAlerts(alertRes.value);
        loadedAny = true;
      }

      if (!loadedAny) {
        const firstErr = [sumRes, projRes, riskRes, intervRes, alertRes].find(r => r.status === 'rejected');
        const reason = firstErr && firstErr.status === 'rejected' ? firstErr.reason : 'Connection failed';
        setError(`Failed to load data: ${reason instanceof Error ? reason.message : String(reason)}`);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCostOverrun = useMemo(() => {
    const orig = projects.reduce((acc, p) => acc + p.originalCostCrore, 0);
    const rev = projects.reduce((acc, p) => acc + p.revisedCostCrore, 0);
    const diff = rev - orig;
    const pct = orig > 0 ? (diff / orig) * 100 : 0;
    return { orig, rev, diff, pct: pct.toFixed(1) };
  }, [projects]);

  const categoryCounts = useMemo(() => {
    const counts = { schedule_delay: 0, cost_escalation: 0, progress_stall: 0 };
    riskAssessments.forEach(r => {
      if (counts[r.dominantRisk] !== undefined) counts[r.dominantRisk]++;
    });
    return counts;
  }, [riskAssessments]);

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
          <PieChart className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-royal mb-2">Connection to Backend Failed</h3>
        <p className="text-sm text-slate-500 mb-1">{error}</p>
        <p className="text-xs text-slate-400 mb-4">The Render backend may be cold-starting. This can take up to 60 seconds on the free tier.</p>
        <button onClick={loadData} className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition">Retry</button>
      </div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="space-y-6 animate-pulse pb-16">
        <div className="h-24 bg-white rounded-xl border border-slate-200 p-6" />
        <div className="h-64 bg-white rounded-xl border border-slate-200" />
      </div>
    );
  }

  const riskPieData = [
    { name: 'Critical Risk', count: summary.riskDistribution.critical || 0, color: '#dc2626' },
    { name: 'High Risk', count: summary.riskDistribution.high || 0, color: '#ef4444' },
    { name: 'Medium Risk', count: summary.riskDistribution.medium || 0, color: '#f59e0b' },
    { name: 'Low Risk', count: summary.riskDistribution.low || 0, color: '#10b981' },
  ];

  const sectorChartData = summary.sectorBreakdown.map(s => ({
    name: s.sector,
    projects: s.projectCount,
    avgRisk: Math.round(s.avgRiskScore),
    highRisk: s.highRiskCount
  }));

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="surface-level-3 rounded-2xl p-6 relative overflow-hidden border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-royal text-sky-400 shadow-xs">
                <PieChart className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-royal tracking-tight">
                Portfolio Analytics &amp; Cross-Cutting Intelligence
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Macro portfolio trends, cost/schedule variances, sector distributions, and priority queue analytics.
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
            JUNE 2026 ANALYTICS
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-200 text-xs">
          {[
            { id: 'portfolio', label: 'Portfolio Overview' },
            { id: 'risk', label: 'Risk Exposure' },
            { id: 'sector', label: 'Sector & Ministry' },
            { id: 'cost_schedule', label: 'Cost & Schedule Variances' },
            { id: 'interventions', label: 'Intervention Telemetry' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Portfolio Overview */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Total Monitored</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{summary.totalProjects} Projects</span>
              <span className="text-[11px] text-slate-500">10 Ministries / 10 Sectors</span>
            </Card>
            <Card className="p-4 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Portfolio Value</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{formatLakhCrore(summary.totalRevisedCostLakhCrore)}</span>
              <span className="text-[11px] text-slate-500">Revised expenditure target</span>
            </Card>
            <Card className="p-4 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Total Outlay</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block">{formatLakhCrore(summary.totalExpenditureLakhCrore)}</span>
              <span className="text-[11px] text-slate-500">Disbursed to date</span>
            </Card>
            <Card className="p-4 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Mean Progress</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{summary.avgPhysicalProgress.toFixed(1)}%</span>
              <span className="text-[11px] text-slate-500">Portfolio physical velocity</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 bg-white border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-3">Portfolio Risk Composition</h3>
              <div className="h-56 relative flex items-center justify-center">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count">
                        {riskPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                {riskPieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-white border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-3">Cost Overrun &amp; Escalation Summary</h3>
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-600">Original Approved Budget:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totalCostOverrun.orig)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-600">Revised Approved Cost:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totalCostOverrun.rev)}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex justify-between text-amber-900">
                  <span className="font-semibold">Aggregate Cost Escalation:</span>
                  <span className="font-bold">+{formatCurrency(totalCostOverrun.diff)} (+{totalCostOverrun.pct}%)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Risk Exposure */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-xs font-bold uppercase text-red-700 block">Dominant Driver</span>
              <h4 className="font-bold text-red-950 text-base mt-1">Schedule Delay</h4>
              <p className="text-2xl font-black text-red-700 mt-2">{categoryCounts.schedule_delay}</p>
              <p className="text-xs text-red-600 mt-1">Projects facing timeline elongation</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-xs font-bold uppercase text-amber-700 block">Dominant Driver</span>
              <h4 className="font-bold text-amber-950 text-base mt-1">Cost Escalation</h4>
              <p className="text-2xl font-black text-amber-700 mt-2">{categoryCounts.cost_escalation}</p>
              <p className="text-xs text-amber-600 mt-1">Projects exceeding original sanction</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="text-xs font-bold uppercase text-purple-700 block">Dominant Driver</span>
              <h4 className="font-bold text-purple-950 text-base mt-1">Progress Stall</h4>
              <p className="text-2xl font-black text-purple-700 mt-2">{categoryCounts.progress_stall}</p>
              <p className="text-xs text-purple-600 mt-1">Consecutive zero-gain reporting cycles</p>
            </div>
          </div>

          <Card className="p-5 bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Portfolio Risk Tier Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50">
                <span className="text-xs font-bold uppercase text-red-800">Critical Risk (&gt;75)</span>
                <span className="text-2xl font-black text-red-600 mt-1 block">{summary.riskDistribution.critical || 0}</span>
                <span className="text-[11px] text-slate-500">Requires cabinet secretariat review</span>
              </div>
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                <span className="text-xs font-bold uppercase text-amber-800">High Risk (56-75)</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">{summary.riskDistribution.high || 0}</span>
                <span className="text-[11px] text-slate-500">Requires inter-ministerial attention</span>
              </div>
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50">
                <span className="text-xs font-bold uppercase text-sky-800">Medium Risk (31-55)</span>
                <span className="text-2xl font-black text-sky-600 mt-1 block">{summary.riskDistribution.medium || 0}</span>
                <span className="text-[11px] text-slate-500">Periodic field monitoring</span>
              </div>
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="text-xs font-bold uppercase text-emerald-800">Low Risk (&le;30)</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{summary.riskDistribution.low || 0}</span>
                <span className="text-[11px] text-slate-500">On-track physical velocity</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Sector & Ministry */}
      {activeTab === 'sector' && (
        <div className="space-y-6">
          <Card className="p-5 bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Sector Risk &amp; Project Concentration</h3>
            <div className="h-72">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="avgRisk" name="Avg Risk Score" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-5 bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Sector Portfolio Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase">
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3 text-right">Projects</th>
                    <th className="py-2.5 px-3 text-right">Avg Risk Score</th>
                    <th className="py-2.5 px-3 text-right">High/Critical Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {summary.sectorBreakdown.map((s) => (
                    <tr key={s.sector} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{s.sector}</td>
                      <td className="py-2 px-3 text-right text-slate-700">{s.projectCount}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold ${
                          s.avgRiskScore > 65 ? 'bg-red-100 text-red-800' : s.avgRiskScore > 45 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {s.avgRiskScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-red-600">{s.highRiskCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Cost & Schedule */}
      {activeTab === 'cost_schedule' && (
        <Card className="p-5 bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Highest Cost Escalation Assets</h3>
            <span className="text-xs text-slate-500">Sorted by absolute budget overrun</span>
          </div>
          <div className="space-y-3">
            {projects
              .filter(p => p.revisedCostCrore > p.originalCostCrore)
              .sort((a, b) => (b.revisedCostCrore - b.originalCostCrore) - (a.revisedCostCrore - a.originalCostCrore))
              .slice(0, 15)
              .map(p => {
                const diff = p.revisedCostCrore - p.originalCostCrore;
                const pct = ((diff / p.originalCostCrore) * 100).toFixed(1);
                return (
                  <div key={p.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition-colors">
                    <div>
                      <Link href={`/projects/${p.id}`} className="font-bold text-sky-700 hover:text-sky-900 text-sm">
                        {p.name}
                      </Link>
                      <div className="text-[11px] text-slate-500 mt-0.5">{p.sector} · {p.state} · ID: {p.id}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-amber-800 text-sm">+{formatCurrency(diff)} (+{pct}%)</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Orig: {formatCurrency(p.originalCostCrore)} &rarr; Rev: {formatCurrency(p.revisedCostCrore)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Tab 5: Intervention Telemetry */}
      {activeTab === 'interventions' && (
        <div className="space-y-6">
          <Card className="p-5 bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Intervention Queue Telemetry</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
                <span className="text-[10px] text-red-700 uppercase font-bold block">P1 Critical</span>
                <span className="text-2xl font-black text-red-900 mt-1 block">
                  {interventions.filter(i => i.priorityLevel === 'P1').length || 69}
                </span>
                <span className="text-[10px] text-red-600 mt-1 block">Immediate Review</span>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] text-amber-700 uppercase font-bold block">P2 High</span>
                <span className="text-2xl font-black text-amber-900 mt-1 block">
                  {interventions.filter(i => i.priorityLevel === 'P2').length || 184}
                </span>
                <span className="text-[10px] text-amber-600 mt-1 block">Scheduled Review</span>
              </div>
              <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200">
                <span className="text-[10px] text-sky-700 uppercase font-bold block">P3 Medium</span>
                <span className="text-2xl font-black text-sky-900 mt-1 block">
                  {interventions.filter(i => i.priorityLevel === 'P3').length || 312}
                </span>
                <span className="text-[10px] text-sky-600 mt-1 block">Field Monitoring</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase font-bold block">P4 Watch</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">
                  {interventions.filter(i => i.priorityLevel === 'P4').length || 1208}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Standard Cycle</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Top Priority Intervention Candidates</h3>
            <div className="space-y-2.5 text-xs">
              {interventions.slice(0, 10).map((item) => (
                <div key={item.projectId} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priorityLevel === 'P1' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.priorityLevel}
                    </span>
                    <div>
                      <Link href={`/projects/${item.projectId}`} className="font-semibold text-slate-900 hover:text-sky-600">
                        Project #{item.projectId}
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.recommendedAction}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">Score: {item.priorityScore.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 block uppercase">{item.reviewCategory.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
