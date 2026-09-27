import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import GlobalHeader from "../components/common/GlobalHeader";
import GlobalFooter from "../components/common/GlobalFooter";
import HeroBanner from "../components/watchlist/HeroBanner";
import Sidebar from "../components/watchlist/Sidebar";
import FilterBar from "../components/watchlist/FilterBar";
import StateGroup from "../components/watchlist/StateGroup";
import SummaryPanel from "../components/watchlist/SummaryPanel";
import Toast from "../components/watchlist/Toast";
import ProjectDetailModal from "../components/watchlist/ProjectDetailModal";
import { lensOptions } from "../data/watchlistData";
import { api } from "../services/apiClient";
import PageSwitcher from "../components/PageSwitcher";
import "../styles/watchlist.css";

const DEFAULT_FILTERS = {
  State: "All States",
  Sector: "All Sectors",
  Ministry: "All Ministries",
  "Implementing Agency": "All Agencies",
  "Risk Level": "All Risk Levels",
};

function downloadCsv(filename, rows) {
  const content = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [activeLens, setActiveLens] = useState("rising-risk");
  const [activeSavedView, setActiveSavedView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortOrder, setSortOrder] = useState("Risk Score (High to Low)");
  const [viewMode, setViewMode] = useState("list");
  const [expanded, setExpanded] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [rawRecords, setRawRecords] = useState([]);
  const [loadError, setLoadError] = useState("");

  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 2600);
  }, []);

  useEffect(() => {
    api.projects(import.meta.env.VITE_REPORTING_MONTH || "2026-06")
      .then((records) => {
        setRawRecords(records || []);
      })
      .catch((error) => setLoadError(error.message));
  }, []);

  const availableFilterOptions = useMemo(() => {
    const states = ["All States", ...Array.from(new Set(rawRecords.map(r => r.state).filter(Boolean))).sort()];
    const sectors = ["All Sectors", ...Array.from(new Set(rawRecords.map(r => r.sector).filter(Boolean))).sort()];
    const ministries = ["All Ministries", ...Array.from(new Set(rawRecords.map(r => r.ministry).filter(Boolean))).sort()];
    const agencies = ["All Agencies", ...Array.from(new Set(rawRecords.map(r => r.agency).filter(Boolean))).sort()];
    const riskLevels = ["All Risk Levels", "Critical", "High", "Medium", "Low"];
    return {
      State: states,
      Sector: sectors,
      Ministry: ministries,
      "Implementing Agency": agencies,
      "Risk Level": riskLevels,
    };
  }, [rawRecords]);

  const filteredProjects = useMemo(() => {
    return rawRecords.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = (p.name || '').toLowerCase().includes(q) ||
                      (p.state || '').toLowerCase().includes(q) ||
                      (p.sector || '').toLowerCase().includes(q) ||
                      (p.ministry || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.State && filters.State !== "All States" && p.state !== filters.State) return false;
      if (filters.Sector && filters.Sector !== "All Sectors" && p.sector !== filters.Sector) return false;
      if (filters.Ministry && filters.Ministry !== "All Ministries" && p.ministry !== filters.Ministry) return false;
      if (filters["Implementing Agency"] && filters["Implementing Agency"] !== "All Agencies" && p.agency !== filters["Implementing Agency"]) return false;
      if (filters["Risk Level"] && filters["Risk Level"] !== "All Risk Levels") {
        const lvl = String(p.riskTier || "").toLowerCase();
        if (lvl !== filters["Risk Level"].toLowerCase()) return false;
      }
      if (activeLens === "rising-risk" && !((p.costEscalationPct || 0) > 0 || (p.scheduleSlipMonths || 0) > 0 || (p.riskScore || 0) > 50)) return false;
      if (activeLens === "newly-flagged" && !((p.riskScore || 0) >= 60)) return false;
      if (activeLens === "persistent-risk" && !((p.stallStreakMonths || 0) > 0 || (p.scheduleSlipMonths || 0) > 6)) return false;
      if (activeLens === "high-exposure" && !((p.revisedCostCrore || p.originalCostCrore || 0) >= 2000)) return false;
      if (activeLens === "schedule-pressure" && !((p.scheduleSlipMonths || 0) > 3)) return false;
      if (activeLens === "cost-pressure" && !((p.costEscalationPct || 0) > 5)) return false;
      return true;
    });
  }, [rawRecords, searchQuery, filters, activeLens]);

  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    if (sortOrder === "Risk Score (High to Low)") {
      list.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
    } else if (sortOrder === "Risk Score (Low to High)") {
      list.sort((a, b) => (a.riskScore || 0) - (b.riskScore || 0));
    } else if (sortOrder === "Cost Exposure (High to Low)") {
      list.sort((a, b) => (b.revisedCostCrore || 0) - (a.revisedCostCrore || 0));
    }
    return list;
  }, [filteredProjects, sortOrder]);

  const stateGroups = useMemo(() => {
    const grouped = new Map();
    sortedProjects.forEach((record) => {
      const state = record.state || "Not reported";
      const current = grouped.get(state) || [];
      current.push({
        id: record.id,
        name: record.name,
        location: state,
        ministry: record.ministry,
        agency: record.agency,
        riskLevel: String(record.riskTier || "low").toUpperCase(),
        riskScore: record.riskScore || 0,
        delta: record.stallStreakMonths || 0,
        progress: record.physicalProgress || 0,
        costExposure: `₹ ${Number(record.revisedCostCrore || record.originalCostCrore || 0).toLocaleString("en-IN")} Cr`,
        costDelta: record.costEscalationPct || 0,
        scheduleRisk: (record.scheduleSlipMonths || 0) > 0 ? `${record.scheduleSlipMonths} month delay` : "On schedule",
        lastUpdated: record.reportingMonth || "2026-06",
      });
      grouped.set(state, current);
    });

    const groups = Array.from(grouped, ([name, projects]) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      projectCount: projects.length,
      avgRisk: Math.round(projects.reduce((sum, item) => sum + item.riskScore, 0) / projects.length),
      riskColor: projects.some(p => p.riskLevel === "CRITICAL") ? "red" : projects.some(p => p.riskLevel === "HIGH") ? "orange" : "amber",
      projects,
    })).sort((a, b) => b.avgRisk - a.avgRisk);

    return groups;
  }, [sortedProjects]);

  useEffect(() => {
    if (stateGroups.length > 0 && Object.keys(expanded).length === 0) {
      const initial = {};
      stateGroups.slice(0, 3).forEach(g => { initial[g.id] = true; });
      setExpanded(initial);
    }
  }, [stateGroups, expanded]);

  const totalProjects = sortedProjects.length;
  const activeLensLabel = activeLens ? lensOptions.find((l) => l.id === activeLens)?.label : null;

  const totalExposureCr = useMemo(() => {
    return sortedProjects.reduce((sum, p) => sum + (p.revisedCostCrore || p.originalCostCrore || 0), 0);
  }, [sortedProjects]);

  const highCriticalCount = useMemo(() => {
    return sortedProjects.filter(p => ['high', 'critical'].includes(String(p.riskTier || '').toLowerCase())).length;
  }, [sortedProjects]);

  const risingRiskCount = useMemo(() => {
    return sortedProjects.filter(p => (p.costEscalationPct || 0) > 0 || (p.scheduleSlipMonths || 0) > 0).length;
  }, [sortedProjects]);

  const dynamicStats = useMemo(() => [
    { id: "st1", icon: "TrendingUp", tone: "blue", value: String(totalProjects), label: "Projects matched" },
    { id: "st2", icon: "IndianRupee", tone: "orange", value: `₹ ${Number(Math.round(totalExposureCr)).toLocaleString('en-IN')} Cr`, label: "Portfolio exposure" },
    { id: "st3", icon: "AlertCircle", tone: "red", value: String(highCriticalCount), label: "High / Critical risk" },
    { id: "st4", icon: "TrendingUp", tone: "green", value: String(risingRiskCount), label: "Active delay / cost signals" },
  ], [totalProjects, totalExposureCr, highCriticalCount, risingRiskCount]);

  const dynamicInsights = useMemo(() => {
    if (sortedProjects.length === 0) return ["No projects currently match the active filters."];
    const topStateName = stateGroups[0]?.name || "N/A";
    const topStateCount = stateGroups[0]?.projectCount || 0;
    const avgProg = Math.round(sortedProjects.reduce((s, p) => s + (p.physicalProgress || 0), 0) / sortedProjects.length);
    return [
      `${topStateName} has the highest concentration with ${topStateCount} projects in this view.`,
      `${highCriticalCount} projects are flagged in High or Critical tiers requiring proactive review.`,
      `Average physical completion across the selected set is ${avgProg}%.`,
    ];
  }, [sortedProjects, stateGroups, highCriticalCount]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleClearAll() {
    setFilters(DEFAULT_FILTERS);
    setActiveLens(null);
    setSearchQuery("");
    showToast("Filters cleared.");
  }

  function handleApply() {
    showToast(`Applied filters — showing ${totalProjects} matching projects.`);
  }

  function toggleExpanded(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleExportCsv() {
    if (sortedProjects.length === 0) {
      showToast("No projects to export.");
      return;
    }
    const rows = [
      ["Project ID", "Project Name", "State", "Sector", "Ministry", "Agency", "Risk Score", "Risk Tier", "Progress %", "Cost Current (Cr)", "Schedule Slip (Months)"],
      ...sortedProjects.map(p => [
        p.id,
        p.name,
        p.state,
        p.sector,
        p.ministry,
        p.agency,
        p.riskScore,
        p.riskTier,
        p.physicalProgress,
        p.revisedCostCrore || p.originalCostCrore,
        p.scheduleSlipMonths
      ])
    ];
    downloadCsv(`pragati-watchlist-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    showToast(`Exported ${sortedProjects.length} projects to CSV.`);
  }

  return (
    <div className="pg-app watchlist-page">
      <GlobalHeader
        activeId="watchlist"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <HeroBanner />

      <div className="pg-layout">
        <Sidebar
          activeLens={activeLens}
          onLensChange={(id) => {
            setActiveLens(id);
            showToast(`Lens set to ${lensOptions.find((l) => l.id === id)?.label}.`);
          }}
          activeSavedView={activeSavedView}
          onSavedViewChange={(id) => {
            setActiveSavedView(id);
            showToast("Saved view loaded.");
          }}
        />

        <main className="pg-main">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            onApply={handleApply}
            matchCount={totalProjects}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={handleExportCsv}
            activeLensLabel={activeLensLabel}
            onRemoveLensChip={() => setActiveLens(null)}
            availableFilterOptions={availableFilterOptions}
          />

          {loadError && <div className="error-banner" role="alert">Live watchlist data could not be loaded: {loadError}</div>}
          {!loadError && rawRecords.length === 0 && <div className="empty-tab">Loading live project records...</div>}

          <div className="pg-groups-scroll">
            {stateGroups.map((group) => (
              <StateGroup
                key={group.id}
                group={group}
                expanded={Boolean(expanded[group.id])}
                onToggle={() => toggleExpanded(group.id)}
                sortOrder={sortOrder}
                viewMode={viewMode}
                onOpenDetail={setSelectedProject}
                onViewAll={(g) => showToast(`Opening full list for ${g.name}…`)}
              />
            ))}
          </div>
        </main>

        <SummaryPanel
          stats={dynamicStats}
          insights={dynamicInsights}
          onQuickAction={(label) => showToast(`${label} — done.`)}
          onViewAnalysis={() => {
            window.location.hash = '#/analytics';
          }}
        />
      </div>

      <GlobalFooter onLink={(l) => showToast(`Opening ${typeof l === "string" ? l : l.label} information.`)} />

      <Toast message={toastMessage} />
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} onToast={showToast} />
      <PageSwitcher active="watchlist" />
    </div>
  );
}
