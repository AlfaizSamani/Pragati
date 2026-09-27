import { useCallback, useEffect, useState } from "react";
import "../styles/analytics.css";
import GlobalHeader from "../components/common/GlobalHeader";
import GlobalFooter from "../components/common/GlobalFooter";
import Hero from "../components/analytics/Hero";
import AnalyticsTabs from "../components/analytics/AnalyticsTabs";
import FilterBar from "../components/analytics/FilterBar";
import KPISection from "../components/analytics/KPISection";
import RiskTrendChart from "../components/analytics/RiskTrendChart";
import RiskDistribution from "../components/analytics/RiskDistribution";
import KeyInsights from "../components/analytics/KeyInsights";
import SectorPerformance from "../components/analytics/SectorPerformance";
import TopProjects from "../components/analytics/TopProjects";
import PortfolioValueChart from "../components/analytics/PortfolioValueChart";
import Toast from "../components/analytics/Toast";
import AnalysisTable from "../components/analytics/AnalysisTable";
import AllocationChart from "../components/analytics/AllocationChart";
import useToast from "../hooks/useToast";
import { SECTORS, SERIES, monthLabel, TAB_CONFIG } from "../data/analyticsData";
import { api } from "../services/apiClient";

const COMPARE_LABELS = {
  "Previous Period": "previous period",
  "Previous Year": "previous year",
  "No Comparison": "no baseline",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatCycle(month) {
  const match = /^(\d{4})-(\d{2})$/.exec(month || "");
  return match ? `${MONTH_NAMES[Number(match[2]) - 1]} ${match[1]}` : month || "Reporting cycle unavailable";
}

function groupProjects(records, field) {
  const groups = new Map();
  records.forEach((project) => {
    const name = project[field] || "Not reported";
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(project);
  });

  return [...groups.entries()].map(([name, projects], index) => {
    const riskScores = projects.map((project) => Number(project.riskScore || 0));
    const risk = riskScores.length ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length : 0;
    const highRisk = projects.filter((project) => Number(project.riskScore || 0) > 55).length;
    const value = projects.reduce((sum, project) => sum + Number(project.revisedCostCrore || 0), 0) / 100000;
    return {
      name,
      color: SECTORS[index % SECTORS.length]?.color || "#8296AC",
      total: projects.length,
      hc: highRisk,
      hcTxt: `${highRisk}`,
      value,
      risk: Math.round(risk),
      dir: "up",
      trend: "—",
    };
  }).sort((a, b) => b.total - a.total);
}

function summarizeProjects(records) {
  const scores = records.map((project) => Number(project.riskScore || 0));
  const tiers = {
    Critical: scores.filter((score) => score > 75).length,
    High: scores.filter((score) => score > 55 && score <= 75).length,
    Medium: scores.filter((score) => score > 30 && score <= 55).length,
    Low: scores.filter((score) => score <= 30).length,
  };
  return {
    total_projects: records.length,
    critical_risk_count: tiers.Critical,
    high_risk_count: tiers.High,
    tier_counts: tiers,
    total_cost_current_cr: records.reduce((sum, project) => sum + Number(project.revisedCostCrore || 0), 0),
  };
}

export default function Analytics() {
  const { message, visible, toast } = useToast();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("Sector Analysis");

  /* `draft` = what the dropdowns show; `applied` = what the page is filtered by (after Apply) */
  const [draft, setDraft] = useState({ months: 24, compare: "Previous Period", sector: "All Sectors", stateName: "All States" });
  const [applied, setApplied] = useState({ months: 24, sector: "All Sectors", stateName: "All States" });

  const [chartMode, setChartMode] = useState("line");
  const [hidden, setHidden] = useState({});
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const requestedMonth = import.meta.env.VITE_REPORTING_MONTH || undefined;
    api.summary(requestedMonth)
      .then((result) => {
        if (cancelled) return;
        setSummary(result);
        return api.projects(result.month || requestedMonth);
      })
      .then((records) => { if (!cancelled && Array.isArray(records)) setProjects(records); })
      .catch((error) => { if (!cancelled) setLoadError(error.message); });
    return () => { cancelled = true; };
  }, []);

  const patchDraft = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const apply = () => {
    setApplied({
      months: draft.months,
      sector: draft.sector,
      stateName: draft.stateName,
      compareLabel: COMPARE_LABELS[draft.compare] || "baseline",
    });
    toast(`Filters applied — ${draft.sector} · ${draft.stateName}`);
  };

  const onTab = (t) => {
    setTab(t);
    toast(`${t} view applied`);
  };

  const toggleSeries = (name) => {
    if (hidden[name]) {
      const rest = { ...hidden };
      delete rest[name];
      setHidden(rest);
      return;
    }
    if (SERIES.filter((s) => !hidden[s.name]).length <= 1) {
      toast("At least one sector must stay visible");
      return;
    }
    setHidden({ ...hidden, [name]: true });
  };

  const downloadCsv = useCallback(() => {
    const pts = applied.months + 1;
    const start = SERIES[0].m.length - pts;
    const lines = [["Month", ...SERIES.map((s) => s.name)].join(",")];
    for (let i = 0; i < pts; i++) {
      const gi = start + i;
      lines.push([monthLabel(gi), ...SERIES.map((s) => Math.round(s.m[gi]))].join(","));
    }
    try {
      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pragati-sector-risk-trend.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast("Downloaded sector risk trend (CSV)");
    } catch (e) {
      toast("Download is blocked in this preview");
    }
  }, [applied.months, toast]);

  const scopedProjects = projects.filter((project) =>
    (applied.sector === "All Sectors" || project.sector === applied.sector) &&
    (applied.stateName === "All States" || project.state === applied.stateName)
  );
  const scopedSummary = projects.length ? summarizeProjects(scopedProjects) : summary;
  const dimension = {
    "Sector Analysis": { field: "sector", label: "Sector" },
    "Ministry Analysis": { field: "ministry", label: "Ministry" },
    "State Analysis": { field: "state", label: "State" },
  }[tab];
  const liveRows = dimension && scopedProjects.length ? groupProjects(scopedProjects, dimension.field) : [];
  const analysisRows = tab === "Portfolio Trends"
    ? TAB_CONFIG[tab].rows
    : projects.length ? liveRows : TAB_CONFIG[tab].rows;
  const cycleLabel = formatCycle(summary?.month);
  const analysisLabel = dimension?.label || "Period";

  return (
    <div className="page">
      <GlobalHeader
        activeId="analytics"
        searchValue={query}
        onSearchChange={setQuery}
      />

      <Hero cycle={cycleLabel} />

      <div className="shell">
        <div className="bar">
          <AnalyticsTabs active={tab} onSelect={onTab} />
          <FilterBar draft={draft} onChange={patchDraft} onApply={apply} />
        </div>

        {loadError && <div className="error-banner" role="alert">Live analytics data could not be loaded: {loadError}</div>}
        <KPISection applied={applied} summary={scopedSummary} />

        <div className="row r2">
          <RiskTrendChart
            months={applied.months}
            mode={chartMode}
            onMode={setChartMode}
            hidden={hidden}
            onToggleSeries={toggleSeries}
            onDownload={downloadCsv}
            rows={analysisRows}
            dimension={analysisLabel}
            cycle={cycleLabel}
            analysis={tab}
          />
            <RiskDistribution summary={scopedSummary} projects={scopedProjects} />
          <KeyInsights cycle={cycleLabel} rows={analysisRows} dimension={analysisLabel} onViewDetails={() => toast(`Opening detailed insights for ${cycleLabel}`)} />
        </div>

        <div className="row r3">
      {tab === "Sector Analysis" ? (
    <>
      <SectorPerformance rows={analysisRows} />
      <TopProjects applied={applied} projects={scopedProjects} onViewAll={() => toast("Opening the full project risk register")} />
      <PortfolioValueChart rows={analysisRows} title={TAB_CONFIG[tab].pvTitle} />
    </>
  ) : (
    <>
      <AnalysisTable rows={analysisRows} labelHeader={TAB_CONFIG[tab].labelHeader} title={TAB_CONFIG[tab].perfTitle} />
      <TopProjects applied={applied} projects={scopedProjects} dimension={analysisLabel} onViewAll={() => toast("Opening the full project risk register")} />
      <AllocationChart rows={analysisRows} title={TAB_CONFIG[tab].pvTitle} />
    </>
  )}
</div>
      </div>

      <GlobalFooter onLink={(l) => toast(`Opening ${typeof l === "string" ? l : l.label} information`)} />
      <Toast message={message} visible={visible} />
    </div>
  );
}
