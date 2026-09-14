'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, SlidersHorizontal } from 'lucide-react';
import { StateRiskSummary, Project } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface GeographicRiskMapProps {
  stateSummaries: StateRiskSummary[];
  projects: Project[];
  onSelectState?: (stateName: string) => void;
  activeStateFilter?: string;
}

// Geometric coordinates for India state nodes (540x500 viewport)
const STATE_COORDINATES: Record<string, { x: number; y: number; region: string }> = {
  JK: { x: 175, y: 75, region: 'Northern' },
  UK: { x: 235, y: 130, region: 'Northern' },
  UP: { x: 270, y: 195, region: 'Northern' },
  RJ: { x: 140, y: 195, region: 'Western' },
  MH: { x: 180, y: 310, region: 'Western' },
  JH: { x: 325, y: 245, region: 'Eastern' },
  WB: { x: 365, y: 260, region: 'Eastern' },
  OR: { x: 315, y: 315, region: 'Eastern' },
  AP: { x: 240, y: 385, region: 'Southern' },
  TN: { x: 215, y: 450, region: 'Southern' },
  AR: { x: 440, y: 165, region: 'North-Eastern' },
};

// Major infrastructure corridor connections between state hubs
const CORRIDOR_CONNECTIONS = [
  { from: 'JK', to: 'UK' },
  { from: 'UK', to: 'UP' },
  { from: 'UP', to: 'RJ' },
  { from: 'RJ', to: 'MH' },
  { from: 'UP', to: 'JH' },
  { from: 'JH', to: 'WB' },
  { from: 'JH', to: 'OR' },
  { from: 'MH', to: 'AP' },
  { from: 'OR', to: 'AP' },
  { from: 'AP', to: 'TN' },
  { from: 'WB', to: 'AR' },
];

export function GeographicRiskMap({
  stateSummaries,
  projects,
  onSelectState,
  activeStateFilter
}: GeographicRiskMapProps) {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('MH');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Selected state summary data
  const currentState = stateSummaries.find(s => s.stateCode === selectedStateCode) || stateSummaries[0];
  const stateProjects = projects.filter(p => p.state === currentState?.stateName);

  // Region breakdown calculation
  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'Northern', label: 'Northern (JK, UK, UP, RJ)' },
    { id: 'Western', label: 'Western (MH)' },
    { id: 'Eastern', label: 'Eastern (JH, OR, WB)' },
    { id: 'Southern', label: 'Southern (AP, TN)' },
    { id: 'North-Eastern', label: 'North-Eastern (AR)' },
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-royal text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-royal">
                Geographic Risk Concentration & Corridors
              </CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Topological subcontinental node telemetry and state capital clusters
              </p>
            </div>
          </div>

          {/* Region Filter Chips */}
          <div className="flex flex-wrap gap-1">
            {regions.map(reg => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`text-[11px] px-2 py-1 rounded-md font-medium border transition-colors ${
                  selectedRegion === reg.id
                    ? 'bg-royal text-white border-royal'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {reg.id === 'all' ? 'All' : reg.id}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Schematic SVG Map View (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/95 rounded-xl p-4 relative overflow-hidden border border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[420px]">
            {/* Background grid markings */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Map Header Overlay */}
            <div className="absolute top-3 left-4 z-10 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>INTERACTIVE INDIA RISK RADAR</span>
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-4 z-10 flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-400/30" />
                Critical State
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                High Risk
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Moderate
              </span>
            </div>

            {/* SVG Visual */}
            <svg
              viewBox="0 0 540 500"
              className="w-full h-auto max-h-[440px] max-w-[500px]"
            >
              {/* India Coastline / Border Abstract Outline */}
              <path
                d="M 175 40 
                   L 225 60 L 260 110 L 245 140 L 310 180 L 400 170 L 460 150 L 480 180 L 420 220 L 380 230 L 370 280 L 330 330 L 270 380 L 230 470 L 210 470 L 190 390 L 150 310 L 110 240 L 115 180 L 155 120 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-70"
              />

              {/* Inter-state infrastructure corridor vectors */}
              {CORRIDOR_CONNECTIONS.map((c, i) => {
                const p1 = STATE_COORDINATES[c.from];
                const p2 = STATE_COORDINATES[c.to];
                if (!p1 || !p2) return null;
                return (
                  <line
                    key={`line-${i}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#1e293b"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                  />
                );
              })}

              {/* State Nodes */}
              {stateSummaries.map((state) => {
                const coord = STATE_COORDINATES[state.stateCode];
                if (!coord) return null;

                const isSelected = currentState?.stateCode === state.stateCode;
                const isRegionMatch = selectedRegion === 'all' || coord.region === selectedRegion;
                const isCritical = state.criticalRiskCount > 0 || state.avgRiskScore >= 75;
                const isHigh = state.highRiskCount > 0 || (state.avgRiskScore >= 56 && state.avgRiskScore < 75);

                const nodeColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#38bdf8';
                const radius = Math.max(16, Math.min(24, 14 + state.projectCount * 3));

                return (
                  <g
                    key={state.stateCode}
                    onClick={() => setSelectedStateCode(state.stateCode)}
                    className="cursor-pointer transition-transform duration-200"
                    style={{ opacity: isRegionMatch ? 1 : 0.25 }}
                  >
                    {/* Glowing pulse ring for critical states */}
                    {isCritical && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={radius + 8}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        className="animate-ping opacity-30"
                      />
                    )}

                    {/* Active Selected Ring */}
                    {isSelected && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={radius + 5}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={radius}
                      fill={nodeColor}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />

                    {/* State Abbreviation */}
                    <text
                      x={coord.x}
                      y={coord.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      className="pointer-events-none select-none font-mono"
                    >
                      {state.stateCode}
                    </text>

                    {/* Project count indicator badge */}
                    <circle
                      cx={coord.x + radius - 4}
                      cy={coord.y - radius + 4}
                      r="7"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                    <text
                      x={coord.x + radius - 4}
                      y={coord.y - radius + 7}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {state.projectCount}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* State Intelligence Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between h-full min-h-[420px]">
            {currentState ? (
              <div className="space-y-4">
                {/* State Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-royal text-white font-mono">
                        {currentState.stateCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {STATE_COORDINATES[currentState.stateCode]?.region || 'State'} Region
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-royal">
                      {currentState.stateName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-royal">
                      {currentState.avgRiskScore}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Avg Risk Score
                    </span>
                  </div>
                </div>

                {/* State Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Investment</span>
                    <span className="text-sm font-bold text-slate-800">
                      {formatCurrency(currentState.totalCostCrore)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Monitored Projects</span>
                    <span className="text-sm font-bold text-slate-800">
                      {currentState.projectCount} Projects
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-50/60 border border-red-200">
                    <span className="text-red-700 block text-[10px] uppercase font-semibold">Critical Risk</span>
                    <span className="text-sm font-bold text-red-800">
                      {currentState.criticalRiskCount} Projects
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
                    <span className="text-amber-700 block text-[10px] uppercase font-semibold">High Risk</span>
                    <span className="text-sm font-bold text-amber-800">
                      {currentState.highRiskCount} Projects
                    </span>
                  </div>
                </div>

                {/* Projects in State */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Projects in {currentState.stateName}</span>
                    <span className="font-mono text-slate-400">{stateProjects.length} found</span>
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {stateProjects.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No specific projects linked in state record.</p>
                    ) : (
                      stateProjects.map(proj => (
                        <div
                          key={proj.id}
                          className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 hover:border-slate-300 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/projects/${proj.id}`}
                              className="text-xs font-bold text-royal hover:text-primary-700 truncate block"
                            >
                              {proj.name}
                            </Link>
                            <span className="text-[10px] text-slate-500">
                              {proj.sector} · Progress: {proj.physicalProgress}%
                            </span>
                          </div>

                          <Link href={`/projects/${proj.id}`}>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-[10px] h-6 px-2 font-medium"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* State Filter Action */}
                {onSelectState && (
                  <Button
                    variant={activeStateFilter === currentState.stateName ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => onSelectState(activeStateFilter === currentState.stateName ? '' : currentState.stateName)}
                    className="w-full text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {activeStateFilter === currentState.stateName
                      ? `Clear Filter (${currentState.stateName})`
                      : `Filter Console to ${currentState.stateName}`}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-12">Select a state on the radar.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
