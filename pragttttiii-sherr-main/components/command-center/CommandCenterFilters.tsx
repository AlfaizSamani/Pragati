'use client';

import React from 'react';
import { Search, X, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CommandCenterFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedMinistry: string;
  setSelectedMinistry: (m: string) => void;
  selectedSector: string;
  setSelectedSector: (s: string) => void;
  selectedState: string;
  setSelectedState: (st: string) => void;
  selectedRiskTier: string;
  setSelectedRiskTier: (r: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  sortBy: string;
  setSortBy: (sb: string) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  ministryOptions: string[];
  sectorOptions: string[];
  stateOptions: string[];
}

export function CommandCenterFilters({
  searchQuery,
  setSearchQuery,
  selectedMinistry,
  setSelectedMinistry,
  selectedSector,
  setSelectedSector,
  selectedState,
  setSelectedState,
  selectedRiskTier,
  setSelectedRiskTier,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  onResetFilters,
  totalCount,
  filteredCount,
  ministryOptions,
  sectorOptions,
  stateOptions
}: CommandCenterFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedMinistry !== '' ||
    selectedSector !== '' ||
    selectedState !== '' ||
    selectedRiskTier !== '' ||
    selectedStatus !== '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      {/* Top Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="relative sm:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project name, state, sector..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Ministry Filter */}
        <div>
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            <option value="">All Ministries</option>
            {ministryOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            <option value="">All Sectors</option>
            {sectorOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            <option value="">All States</option>
            {stateOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <select
            value={selectedRiskTier}
            onChange={(e) => setSelectedRiskTier(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer font-medium"
          >
            <option value="">All Risk Tiers</option>
            <option value="critical">Critical Risk (76-100)</option>
            <option value="high">High Risk (56-75)</option>
            <option value="medium">Medium Risk (31-55)</option>
            <option value="low">Low Risk (0-30)</option>
          </select>
        </div>
      </div>

      {/* Second Row: Status, Sorting & Reset Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="font-semibold text-slate-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1 px-2 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="stalled">Stalled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-slate-500 ml-0 sm:ml-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1 px-2 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none font-medium"
            >
              <option value="priority">Intervention Priority (P1 → P4)</option>
              <option value="risk_desc">Risk Score (Highest First)</option>
              <option value="risk_asc">Risk Score (Lowest First)</option>
              <option value="progress_asc">Progress (Lowest First)</option>
              <option value="progress_desc">Progress (Highest First)</option>
              <option value="cost_desc">Revised Cost (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Counter & Clear Button */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono">
            Showing <strong className="text-slate-900">{filteredCount}</strong> of {totalCount} projects
          </span>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="text-xs h-7 px-2.5 flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
