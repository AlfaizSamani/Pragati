'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Target, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  PauseCircle, 
  RotateCcw,
  Search
} from 'lucide-react';

import { getInterventionQueue } from '@/lib/api/portfolio';
import { getProjects, getAllRiskAssessments } from '@/lib/api/projects';
import { InterventionPriority, Project, RiskAssessment } from '@/lib/types';
import { PRIORITY_LEVEL_CONFIG, INTERVENTION_CATEGORY_CONFIG } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function InterventionPriorityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interventions, setInterventions] = useState<InterventionPriority[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorityLevel, setSelectedPriorityLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getInterventionQueue(),
      getProjects(),
      getAllRiskAssessments()
    ]).then(([intervData, projData, riskData]) => {
      setInterventions(intervData);
      setProjects(projData);
      setRiskAssessments(riskData);
      setLoading(false);
    }).catch(err => {
      console.error('[PRAGATI] Intervention Priority load failed:', err);
      setError(`Failed to load data: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);
  const riskMap = useMemo(() => new Map(riskAssessments.map(r => [r.projectId, r])), [riskAssessments]);

  const filteredQueue = useMemo(() => {
    return interventions
      .filter(item => {
        if (selectedPriorityLevel && item.priorityLevel !== selectedPriorityLevel) return false;
        if (selectedCategory && item.reviewCategory !== selectedCategory) return false;

        const project = projectMap.get(item.projectId);
        if (selectedSector && project?.sector !== selectedSector) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchProj = project?.name.toLowerCase().includes(q) || false;
          const matchAction = item.recommendedAction.toLowerCase().includes(q);
          const matchId = item.projectId.toLowerCase().includes(q);
          if (!matchProj && !matchAction && !matchId) return false;
        }

        return true;
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [interventions, selectedPriorityLevel, selectedCategory, selectedSector, searchQuery, projectMap]);

  const p1Count = interventions.filter(i => i.priorityLevel === 'P1').length;
  const p2Count = interventions.filter(i => i.priorityLevel === 'P2').length;
  const immediateReviewCount = interventions.filter(i => i.reviewCategory === 'immediate_review').length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPriorityLevel('');
    setSelectedCategory('');
    setSelectedSector('');
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
          <Target className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-royal mb-2">Connection to Backend Failed</h3>
        <p className="text-sm text-slate-500 mb-1">{error}</p>
        <p className="text-xs text-slate-400 mb-4">The Render backend may be cold-starting. This can take up to 60 seconds on the free tier.</p>
        <Button variant="primary" size="sm" onClick={loadData}>
          <RotateCcw className="w-4 h-4 mr-1" /> Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-16">
        <div className="h-24 bg-white rounded-xl border border-slate-200 p-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-slate-200" />)}
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
              <span className="p-1.5 rounded-lg bg-royal text-sky-400 shadow-xs">
                <Target className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-royal tracking-tight">
                Intervention Priority Operational Queue
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Multifactor intervention support ranking derived from Risk &times; Economic Impact &times; Anomaly Persistence &times; Grounding Evidence.
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
            DECISION-SUPPORT QUEUE
          </span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Intervention Queue</span>
          <span className="text-2xl font-bold text-royal mt-1 block">{interventions.length} Projects</span>
          <span className="text-[11px] text-slate-400">Total queued assets</span>
        </Card>
        <Card className="p-4 bg-red-50/30 border-red-200/90">
          <span className="text-[10px] text-red-700 font-bold block uppercase tracking-wider">Priority 1 (Critical)</span>
          <span className="text-2xl font-bold text-red-700 mt-1 block">{p1Count} Projects</span>
          <span className="text-[11px] text-red-600">Urgent review required</span>
        </Card>
        <Card className="p-4 bg-amber-50/30 border-amber-200/90">
          <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider">Priority 2 (High)</span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">{p2Count} Projects</span>
          <span className="text-[11px] text-amber-700">Scheduled cycle review</span>
        </Card>
        <Card className="p-4 bg-red-50/30 border-red-200/90">
          <span className="text-[10px] text-red-700 font-bold block uppercase tracking-wider">Immediate Review</span>
          <span className="text-2xl font-bold text-red-800 mt-1 block">{immediateReviewCount} Assets</span>
          <span className="text-[11px] text-red-600">Site inspection queued</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search project name, recommendation text, ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Priority Level */}
          <select
            value={selectedPriorityLevel}
            onChange={e => setSelectedPriorityLevel(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-medium"
          >
            <option value="">All Priority Levels</option>
            <option value="P1">P1 · Critical Priority</option>
            <option value="P2">P2 · High Priority</option>
            <option value="P3">P3 · Medium Priority</option>
            <option value="P4">P4 · Low Priority</option>
          </select>

          {/* Review Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Review Categories</option>
            <option value="immediate_review">Immediate Review Required</option>
            <option value="scheduled_review">Scheduled Review</option>
            <option value="monitoring">Enhanced Monitoring</option>
            <option value="watch">Watch List</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-mono">
            Showing <strong className="text-slate-900">{filteredQueue.length}</strong> of {interventions.length} intervention records
          </span>

          {(searchQuery || selectedPriorityLevel || selectedCategory || selectedSector) && (
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs h-7 px-2 text-red-600 border-red-200">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Main Queue Cards */}
      {filteredQueue.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-300">
          <Target className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No intervention items match your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your category or priority level selections.</p>
          <Button variant="secondary" size="sm" onClick={handleResetFilters} className="mt-4 text-xs font-semibold">
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item, index) => {
            const project = projectMap.get(item.projectId);
            const risk = riskMap.get(item.projectId);
            if (!project) return null;

            const isP1 = item.priorityLevel === 'P1';
            const priorityConfig = PRIORITY_LEVEL_CONFIG[item.priorityLevel];
            const categoryConfig = INTERVENTION_CATEGORY_CONFIG[item.reviewCategory];
            const dominantRisk = risk?.dominantRisk || 'schedule_delay';

            return (
              <Card
                key={item.projectId}
                className={`p-5 transition-all ${
                  isP1 ? 'bg-gradient-to-r from-red-50/70 via-white to-white border-red-300 shadow-sm' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">RANK #{index + 1}</span>

                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded border"
                        style={{
                          backgroundColor: priorityConfig.bgColor,
                          color: priorityConfig.color,
                          borderColor: priorityConfig.color
                        }}
                      >
                        {priorityConfig.label}
                      </span>

                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {categoryConfig.label}
                      </span>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                        {dominantRisk === 'cost_escalation' ? (
                          <TrendingUp className="w-3 h-3 text-amber-600" />
                        ) : dominantRisk === 'progress_stall' ? (
                          <PauseCircle className="w-3 h-3 text-purple-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-red-600" />
                        )}
                        {dominantRisk.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Project Title */}
                    <div>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-base sm:text-lg font-bold text-royal hover:text-primary-700 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{project.name}</span>
                        <ArrowUpRight className="w-4 h-4 text-primary-600" />
                      </Link>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3">
                        <span>Ministry: {project.ministry}</span>
                        <span>•</span>
                        <span>State: {project.state} ({project.sector})</span>
                        <span>•</span>
                        <span className="font-mono">ID: {project.id}</span>
                      </div>
                    </div>

                    {/* Recommended Action */}
                    <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                      isP1 ? 'bg-red-100/70 text-red-950 border border-red-200' : 'bg-slate-50 text-slate-700 border border-slate-200/60'
                    }`}>
                      <strong className="font-semibold">Recommended Official Action:</strong> {item.recommendedAction}
                    </div>
                  </div>

                  {/* 4-Component Score Breakdown */}
                  <div className="lg:w-80 shrink-0 space-y-3 pt-3 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">Composite Priority</span>
                      <span className="text-xl font-black text-royal">{item.priorityScore} / 100</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Risk</span>
                        <span className="text-xs font-bold text-slate-800">{item.riskComponent}</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Impact</span>
                        <span className="text-xs font-bold text-slate-800">{item.impactComponent}</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Persist</span>
                        <span className="text-xs font-bold text-slate-800">{item.persistenceComponent}</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Evidence</span>
                        <span className="text-xs font-bold text-slate-800">{item.evidenceComponent}</span>
                      </div>
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <Button size="sm" variant={isP1 ? 'primary' : 'secondary'} className="w-full text-xs h-8 font-semibold">
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
