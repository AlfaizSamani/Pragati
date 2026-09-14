'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  BellRing, 
  Clock, 
  TrendingUp, 
  PauseCircle, 
  Timer, 
  Calendar, 
  ArrowUpRight, 
  Filter, 
  RotateCcw,
  Search,
  ShieldAlert,
  Building2,
  MapPin
} from 'lucide-react';

import { getAllAlerts, getProjects } from '@/lib/api/projects';
import { Alert, Project, RiskTier, DominantRiskType } from '@/lib/types';
import { RISK_TIER_CONFIG, DOMINANT_RISK_CONFIG } from '@/lib/constants';
import { formatMonth } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function EarlyWarningsPage() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'all'>('active');

  useEffect(() => {
    let active = true;
    Promise.all([
      getAllAlerts(),
      getProjects()
    ]).then(([alertsData, projectsData]) => {
      if (!active) return;
      setAlerts(alertsData);
      setProjects(projectsData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);

  const stateOptions = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.state))).sort();
  }, [projects]);

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(a => {
        if (statusFilter === 'active' && !a.isActive) return false;
        if (selectedSeverity && a.riskTier !== selectedSeverity) return false;
        if (selectedType && a.type !== selectedType) return false;

        const project = projectMap.get(a.projectId);
        if (selectedState && project?.state !== selectedState) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMsg = a.message.toLowerCase().includes(q);
          const matchProj = project?.name.toLowerCase().includes(q) || false;
          const matchId = a.projectId.toLowerCase().includes(q);
          if (!matchMsg && !matchProj && !matchId) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.riskTier === 'critical' && b.riskTier !== 'critical') return -1;
        if (b.riskTier === 'critical' && a.riskTier !== 'critical') return 1;
        return b.persistenceMonths - a.persistenceMonths;
      });
  }, [alerts, statusFilter, selectedSeverity, selectedType, selectedState, searchQuery, projectMap]);

  const activeCount = alerts.filter(a => a.isActive).length;
  const criticalCount = alerts.filter(a => a.isActive && a.riskTier === 'critical').length;
  const highCount = alerts.filter(a => a.isActive && a.riskTier === 'high').length;
  const newThisCycle = alerts.filter(a => a.persistenceMonths <= 3).length;
  const longestPersistence = alerts.reduce((max, a) => Math.max(max, a.persistenceMonths), 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSeverity('');
    setSelectedType('');
    setSelectedState('');
    setStatusFilter('active');
  };

  if (loading) {
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

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="surface-level-3 rounded-2xl p-6 relative overflow-hidden border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-royal text-amber-400 shadow-xs">
                <BellRing className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-royal tracking-tight">
                Early Warning Telemetry &amp; Anomaly Persistence
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Surveillance warning signals, anomaly duration, and lead-time tracking before material milestone slippages occur.
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
            JUNE 2026 CYCLE
          </span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Active Warnings</span>
          <span className="text-2xl font-bold text-royal mt-1 block">{activeCount}</span>
          <span className="text-[11px] text-slate-400">Total active signals</span>
        </Card>
        <Card className="p-4 bg-red-50/30 border-red-200/90">
          <span className="text-[10px] text-red-700 font-bold block uppercase tracking-wider">Critical Warnings</span>
          <span className="text-2xl font-bold text-red-700 mt-1 block">{criticalCount}</span>
          <span className="text-[11px] text-red-600">Urgent lead-time flags</span>
        </Card>
        <Card className="p-4 bg-amber-50/30 border-amber-200/90">
          <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider">High Warnings</span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">{highCount}</span>
          <span className="text-[11px] text-amber-700">Elevated risk alerts</span>
        </Card>
        <Card className="p-4 bg-orange-50/30 border-orange-200/90">
          <span className="text-[10px] text-orange-700 font-bold block uppercase tracking-wider">New This Cycle</span>
          <span className="text-2xl font-bold text-orange-800 mt-1 block">{newThisCycle}</span>
          <span className="text-[11px] text-orange-700">&le; 3 months persistence</span>
        </Card>
        <Card className="p-4 border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Longest Persistent</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{longestPersistence} Mos</span>
          <span className="text-[11px] text-slate-400">Continuous surveillance</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search warning text, project name, ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Severity */}
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical Severity</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
          </select>

          {/* Warning Type */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Warning Modes</option>
            <option value="schedule_delay">Schedule Delay</option>
            <option value="cost_escalation">Cost Escalation</option>
            <option value="progress_stall">Progress Stall</option>
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All States</option>
            {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-mono">
            Showing <strong className="text-slate-900">{filteredAlerts.length}</strong> of {alerts.length} warning signals
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Status:</span>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  statusFilter === 'active' ? 'bg-royal text-white border-royal' : 'bg-slate-50 text-slate-700'
                }`}
              >
                Active Only
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  statusFilter === 'all' ? 'bg-royal text-white border-royal' : 'bg-slate-50 text-slate-700'
                }`}
              >
                All Telemetry
              </button>
            </div>

            {(searchQuery || selectedSeverity || selectedType || selectedState) && (
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs h-7 px-2 text-red-600 border-red-200">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Warning Timeline / Cards */}
      {filteredAlerts.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-300">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <BellRing className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No early warnings match your current filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting severity or state criteria.</p>
          <Button variant="secondary" size="sm" onClick={handleResetFilters} className="mt-4 text-xs font-semibold">
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const project = projectMap.get(alert.projectId);
            const tierConfig = RISK_TIER_CONFIG[alert.riskTier];
            const dominantConfig = DOMINANT_RISK_CONFIG[alert.type];
            const isCritical = alert.riskTier === 'critical';

            return (
              <Card
                key={alert.id}
                className={`p-5 transition-all border-l-4 ${
                  isCritical ? 'bg-red-50/40 border-l-red-600 border-red-200' : 'bg-white border-l-amber-500 border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider"
                        style={{
                          backgroundColor: tierConfig.bgColor,
                          color: tierConfig.textColor,
                          borderColor: tierConfig.borderColor
                        }}
                      >
                        {alert.riskTier} Severity
                      </span>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        {alert.type === 'cost_escalation' ? (
                          <TrendingUp className="w-3 h-3 text-amber-600" />
                        ) : alert.type === 'progress_stall' ? (
                          <PauseCircle className="w-3 h-3 text-purple-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-red-600" />
                        )}
                        {dominantConfig?.label}
                      </span>

                      <span className="text-xs font-mono text-slate-400">
                        Signal ID: {alert.id}
                      </span>
                    </div>

                    {/* Project Title & Location */}
                    {project ? (
                      <div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-base sm:text-lg font-bold text-royal hover:text-primary-700 transition-colors inline-flex items-center gap-1"
                        >
                          <span>{project.name}</span>
                          <ArrowUpRight className="w-4 h-4 text-primary-600" />
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3">
                          <span>Ministry: {project.ministry}</span>
                          <span>•</span>
                          <span>State: {project.state} ({project.sector})</span>
                        </div>
                      </div>
                    ) : (
                      <h3 className="text-base font-bold text-royal">{alert.projectId}</h3>
                    )}

                    {/* Telemetry Message */}
                    <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-slate-200/80 leading-relaxed font-medium">
                      {alert.message}
                    </p>
                  </div>

                  {/* Right side persistence & action */}
                  <div className="lg:w-72 shrink-0 space-y-3 pt-3 lg:pt-0 lg:border-l lg:border-slate-200 lg:pl-5">
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">Persistence</span>
                        <span className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                          <Timer className="w-3.5 h-3.5 text-slate-500" />
                          {alert.persistenceMonths} Mos
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">First Raised</span>
                        <span className="font-bold text-slate-800 mt-0.5 block font-mono">
                          {formatMonth(alert.firstRaisedMonth)}
                        </span>
                      </div>
                    </div>

                    {alert.leadTimeMonths && (
                      <div className="p-2 rounded-lg bg-amber-100/60 border border-amber-200 text-center text-xs text-amber-900 font-semibold">
                        {alert.leadTimeMonths} months early warning lead time
                      </div>
                    )}

                    <Link href={`/projects/${alert.projectId}`} className="block">
                      <Button size="sm" variant="secondary" className="w-full text-xs font-semibold h-8">
                        <span>Investigate Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
