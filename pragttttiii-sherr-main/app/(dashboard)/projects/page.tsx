'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  Search, 
  RotateCcw, 
  FolderGit2, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  MapPin, 
  LayoutGrid, 
  List, 
  ArrowUpRight,
  Clock,
  PauseCircle
} from 'lucide-react';

import { getProjects, getAllRiskAssessments } from '@/lib/api/projects';
import { getInterventionQueue } from '@/lib/api/portfolio';
import { Project, RiskAssessment, InterventionPriority } from '@/lib/types';
import { RISK_TIER_CONFIG, DOMINANT_RISK_CONFIG, PRIORITY_LEVEL_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [interventions, setInterventions] = useState<InterventionPriority[]>([]);

  // View mode & filters
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRiskTier, setSelectedRiskTier] = useState('');
  const [selectedDominantRisk, setSelectedDominantRisk] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('risk_desc');

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.allSettled([
      getProjects(),
      getAllRiskAssessments(),
      getInterventionQueue()
    ]).then(([projResult, riskResult, intervResult]) => {
      const errors: string[] = [];
      if (projResult.status === 'fulfilled') setProjects(projResult.value);
      else errors.push(`Projects: ${projResult.reason?.message || 'Failed'}`);
      if (riskResult.status === 'fulfilled') setRiskAssessments(riskResult.value);
      else errors.push(`Risk: ${riskResult.reason?.message || 'Failed'}`);
      if (intervResult.status === 'fulfilled') setInterventions(intervResult.value);
      if (projResult.status === 'rejected') {
        setError(errors.join(' | '));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const riskMap = useMemo(() => new Map(riskAssessments.map(r => [r.projectId, r])), [riskAssessments]);
  const interventionMap = useMemo(() => new Map(interventions.map(i => [i.projectId, i])), [interventions]);

  const ministryOptions = useMemo(() => Array.from(new Set(projects.map(p => p.ministry))).sort(), [projects]);
  const sectorOptions = useMemo(() => Array.from(new Set(projects.map(p => p.sector))).sort(), [projects]);
  const agencyOptions = useMemo(() => Array.from(new Set(projects.map(p => p.agency))).sort(), [projects]);
  const stateOptions = useMemo(() => Array.from(new Set(projects.map(p => p.state))).sort(), [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchState = p.state.toLowerCase().includes(q);
          const matchMinistry = p.ministry.toLowerCase().includes(q);
          const matchSector = p.sector.toLowerCase().includes(q);
          const matchAgency = p.agency.toLowerCase().includes(q);
          const matchId = p.id.toLowerCase().includes(q);
          if (!matchName && !matchState && !matchMinistry && !matchSector && !matchAgency && !matchId) {
            return false;
          }
        }
        if (selectedMinistry && p.ministry !== selectedMinistry) return false;
        if (selectedSector && p.sector !== selectedSector) return false;
        if (selectedAgency && p.agency !== selectedAgency) return false;
        if (selectedState && p.state !== selectedState) return false;
        if (selectedStatus && p.status !== selectedStatus) return false;

        const risk = riskMap.get(p.id);
        if (selectedRiskTier && risk?.riskTier !== selectedRiskTier) return false;
        if (selectedDominantRisk && risk?.dominantRisk !== selectedDominantRisk) return false;

        const intervention = interventionMap.get(p.id);
        if (selectedPriority && intervention?.priorityLevel !== selectedPriority) return false;

        return true;
      })
      .sort((a, b) => {
        const rA = riskMap.get(a.id)?.riskScore ?? 0;
        const rB = riskMap.get(b.id)?.riskScore ?? 0;
        const iA = interventionMap.get(a.id)?.priorityScore ?? 0;
        const iB = interventionMap.get(b.id)?.priorityScore ?? 0;

        if (sortBy === 'risk_desc') return rB - rA;
        if (sortBy === 'risk_asc') return rA - rB;
        if (sortBy === 'priority') return iB - iA;
        if (sortBy === 'progress_asc') return a.physicalProgress - b.physicalProgress;
        if (sortBy === 'progress_desc') return b.physicalProgress - a.physicalProgress;
        if (sortBy === 'cost_desc') return b.revisedCostCrore - a.revisedCostCrore;
        return 0;
      });
  }, [
    projects,
    searchQuery,
    selectedMinistry,
    selectedSector,
    selectedAgency,
    selectedState,
    selectedStatus,
    selectedRiskTier,
    selectedDominantRisk,
    selectedPriority,
    sortBy,
    riskMap,
    interventionMap
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedMinistry !== '' ||
    selectedSector !== '' ||
    selectedAgency !== '' ||
    selectedState !== '' ||
    selectedRiskTier !== '' ||
    selectedDominantRisk !== '' ||
    selectedPriority !== '' ||
    selectedStatus !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMinistry('');
    setSelectedSector('');
    setSelectedAgency('');
    setSelectedState('');
    setSelectedRiskTier('');
    setSelectedDominantRisk('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSortBy('risk_desc');
  };

  const totalProjects = projects.length;
  const criticalCount = riskAssessments.filter(r => r.riskTier === 'critical').length;
  const highCount = riskAssessments.filter(r => r.riskTier === 'high').length;
  const avgProgress = totalProjects > 0
    ? (projects.reduce((acc, p) => acc + p.physicalProgress, 0) / totalProjects).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-16">
        <div className="h-24 bg-white rounded-xl border border-slate-200 p-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-slate-200" />)}
        </div>
        <div className="h-64 bg-white rounded-xl border border-slate-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-royal mb-2">Connection to Backend Failed</h3>
        <p className="text-sm text-slate-500 mb-1">{error}</p>
        <p className="text-xs text-slate-400 mb-4">The Render backend may be cold-starting. This can take up to 60 seconds on the free tier.</p>
        <Button variant="primary" size="sm" onClick={loadData} className="mt-2">
          <RotateCcw className="w-4 h-4 mr-1" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Executive Control Panel Header */}
      <div className="surface-level-3 rounded-2xl p-6 relative overflow-hidden border border-slate-200/90 shadow-sm">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-royal text-sky-400 shadow-xs">
                <FolderGit2 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-royal tracking-tight">
                Projects Portfolio Explorer
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Central sector infrastructure monitoring records, physical progress velocity, and predictive risk attribution console.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              LIVE STAGE 10 SNAPSHOT · JUNE 2026
            </span>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Total Monitored</span>
          <span className="text-2xl font-bold text-royal mt-1 block">{totalProjects}</span>
          <span className="text-[11px] text-slate-400">All central sector projects</span>
        </Card>
        <Card className="p-4 bg-red-50/30 border-red-200/90">
          <span className="text-[10px] text-red-700 font-bold block uppercase tracking-wider">Critical Risk</span>
          <span className="text-2xl font-bold text-red-700 mt-1 block">{criticalCount}</span>
          <span className="text-[11px] text-red-600">Immediate action needed</span>
        </Card>
        <Card className="p-4 bg-amber-50/30 border-amber-200/90">
          <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider">High Risk</span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">{highCount}</span>
          <span className="text-[11px] text-amber-700">Elevated delay/cost risk</span>
        </Card>
        <Card className="p-4 border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Avg Progress</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">{avgProgress}%</span>
          <span className="text-[11px] text-slate-400">Portfolio physical velocity</span>
        </Card>
      </div>

      {/* Filters & Controls */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search project name, state, ministry, sector, ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Ministry */}
          <select
            value={selectedMinistry}
            onChange={e => setSelectedMinistry(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Ministries</option>
            {ministryOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Sector */}
          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Sectors</option>
            {sectorOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All States</option>
            {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
          </select>

          {/* Risk Tier */}
          <select
            value={selectedRiskTier}
            onChange={e => setSelectedRiskTier(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-medium"
          >
            <option value="">All Risk Tiers</option>
            <option value="critical">Critical Risk</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>

          {/* Dominant Risk */}
          <select
            value={selectedDominantRisk}
            onChange={e => setSelectedDominantRisk(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Risk Drivers</option>
            <option value="schedule_delay">Schedule Delay</option>
            <option value="cost_escalation">Cost Escalation</option>
            <option value="progress_stall">Progress Stall</option>
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Priority Levels</option>
            <option value="P1">Priority 1 (Critical)</option>
            <option value="P2">Priority 2 (High)</option>
            <option value="P3">Priority 3 (Medium)</option>
            <option value="P4">Priority 4 (Low)</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ongoing">Ongoing</option>
            <option value="stalled">Stalled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-medium"
          >
            <option value="risk_desc">Risk Score (Highest First)</option>
            <option value="risk_asc">Risk Score (Lowest First)</option>
            <option value="priority">Intervention Priority (P1 → P4)</option>
            <option value="progress_asc">Progress (Lowest First)</option>
            <option value="progress_desc">Progress (Highest First)</option>
            <option value="cost_desc">Revised Cost (Highest First)</option>
          </select>
        </div>

        {/* Toolbar bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">
              Showing <strong className="text-slate-900">{filteredProjects.length}</strong> of {totalProjects} projects
            </span>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Layout:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white text-royal shadow-xs' : 'text-slate-500'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1 rounded ${viewMode === 'table' ? 'bg-white text-royal shadow-xs' : 'text-slate-500'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="p-12 text-center border-dashed border-slate-300">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No projects match these filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try expanding search keywords or clearing state/sector criteria.</p>
          <Button variant="secondary" size="sm" onClick={handleResetFilters} className="mt-4 text-xs font-semibold">
            Clear All Filters
          </Button>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(p => {
            const risk = riskMap.get(p.id);
            const intervention = interventionMap.get(p.id);
            const tierConfig = risk ? RISK_TIER_CONFIG[risk.riskTier] : RISK_TIER_CONFIG.medium;
            const dominantConfig = risk ? DOMINANT_RISK_CONFIG[risk.dominantRisk] : null;
            const priorityConfig = intervention ? PRIORITY_LEVEL_CONFIG[intervention.priorityLevel] : null;

            return (
              <Card
                key={p.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-all border-l-4"
                style={{ borderLeftColor: tierConfig.color }}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{p.id}</span>
                    <div className="flex items-center gap-1.5">
                      {priorityConfig && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: priorityConfig.bgColor,
                            color: priorityConfig.color,
                            borderColor: priorityConfig.color
                          }}
                        >
                          {intervention?.priorityLevel}
                        </span>
                      )}
                      {risk && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
                          style={{
                            backgroundColor: tierConfig.bgColor,
                            color: tierConfig.textColor,
                            borderColor: tierConfig.borderColor
                          }}
                        >
                          Risk {risk.riskScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/projects/${p.id}`}
                    className="text-base font-bold text-royal hover:text-primary-700 line-clamp-2 leading-snug transition-colors"
                  >
                    {p.name}
                  </Link>

                  {/* Agency, Ministry & State */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {p.ministry}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {p.state} ({p.sector})
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-700">{p.agency}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-500 font-medium">Physical Progress</span>
                      <span className="font-bold text-royal">{p.physicalProgress}%</span>
                    </div>
                    <ProgressBar
                      value={p.physicalProgress}
                      colorClass={p.physicalProgress < 30 ? 'bg-red-500' : p.physicalProgress < 60 ? 'bg-amber-500' : 'bg-emerald-500'}
                    />
                  </div>

                  {/* Financials */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Revised Cost</span>
                      <span className="font-bold text-slate-800">{formatCurrency(p.revisedCostCrore)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Expenditure</span>
                      <span className="font-bold text-slate-800">{formatCurrency(p.expenditureCrore)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    {risk?.dominantRisk === 'cost_escalation' ? (
                      <TrendingUp className="w-3 h-3 text-amber-600" />
                    ) : risk?.dominantRisk === 'progress_stall' ? (
                      <PauseCircle className="w-3 h-3 text-purple-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-red-600" />
                    )}
                    {dominantConfig?.label || 'Schedule Delay'}
                  </span>

                  <Link href={`/projects/${p.id}`}>
                    <Button size="sm" variant="secondary" className="text-xs h-7 font-semibold">
                      <span>View Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredProjects.length > 0 && (
        <Card className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3">ID</th>
                  <th className="p-3">Project Name</th>
                  <th className="p-3">Ministry / Sector</th>
                  <th className="p-3">State</th>
                  <th className="p-3 text-right">Cost (Revised)</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Risk Tier</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map(p => {
                  const risk = riskMap.get(p.id);
                  const intervention = interventionMap.get(p.id);
                  const tierConfig = risk ? RISK_TIER_CONFIG[risk.riskTier] : RISK_TIER_CONFIG.medium;
                  const priorityConfig = intervention ? PRIORITY_LEVEL_CONFIG[intervention.priorityLevel] : null;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-500">{p.id}</td>
                      <td className="p-3">
                        <Link href={`/projects/${p.id}`} className="font-bold text-royal hover:text-primary-700">
                          {p.name}
                        </Link>
                        <div className="text-[11px] text-slate-400">{p.agency}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{p.ministry}</div>
                        <div className="text-[11px] text-slate-500">{p.sector}</div>
                      </td>
                      <td className="p-3 text-slate-700">{p.state}</td>
                      <td className="p-3 text-right font-bold text-slate-800">
                        {formatCurrency(p.revisedCostCrore)}
                      </td>
                      <td className="p-3 w-32">
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="font-bold">{p.physicalProgress}%</span>
                        </div>
                        <ProgressBar value={p.physicalProgress} heightClass="h-1.5" />
                      </td>
                      <td className="p-3">
                        {risk && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
                            style={{
                              backgroundColor: tierConfig.bgColor,
                              color: tierConfig.textColor,
                              borderColor: tierConfig.borderColor
                            }}
                          >
                            {risk.riskScore} ({risk.riskTier})
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {priorityConfig && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold border"
                            style={{
                              backgroundColor: priorityConfig.bgColor,
                              color: priorityConfig.color,
                              borderColor: priorityConfig.color
                            }}
                          >
                            {intervention?.priorityLevel}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <Link href={`/projects/${p.id}`}>
                          <Button size="sm" variant="secondary" className="text-[11px] h-7 px-2.5">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
