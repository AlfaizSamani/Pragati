import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import GlobalHeader from "../components/common/GlobalHeader";
import GlobalFooter from "../components/common/GlobalFooter";
import Toast from "../components/pdd/project-detail/Toast";
import ProjectHero from "../components/pdd/project-detail/ProjectHero";
import TabBar from "../components/pdd/project-detail/TabBar";
import ProjectAtGlance from "../components/pdd/project-detail/ProjectAtGlance";
import ProjectCorridorMap from "../components/pdd/project-detail/ProjectCorridorMap";
import FlaggedReasons from "../components/pdd/project-detail/FlaggedReasons";
import ProjectTrajectoryChart from "../components/pdd/project-detail/ProjectTrajectoryChart";
import FinancialScheduleInfo from "../components/pdd/project-detail/FinancialScheduleInfo";
import RiskScoreBreakdown from "../components/pdd/project-detail/RiskScoreBreakdown";
import RecentUpdates from "../components/pdd/project-detail/RecentUpdates";
import KeyDocuments from "../components/pdd/project-detail/KeyDocuments";
import Modal from "../components/pdd/project-detail/Modal";
import {
  RiskSummary, FinancialBlock, ScheduleBlock, GeographyBlock, RelatedBlock, DiscussionBlock,
} from "../components/pdd/project-detail/TabPanels";
import {
  PROJECTS, projectIds, chrome, ui, tabs, tabPanels,
} from "../data/projectDetailData";
import { buildPdf, downloadBlob } from "../utils/reportPdf";
import { buildProjectCsv } from "../utils/projectCsv";
import { api } from "../services/apiClient";
import "../styles/ProjectDetail.css";

const WATCHLIST_KEY = "pragati-watchlist";

function loadWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

export default function ProjectDetailPage() {
  const onOpenWatchlist = () => { window.location.hash = "#/watchlist"; };
  const _unused = onOpenWatchlist;
  // ---------------- Data-driven state ----------------
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [liveRecord, setLiveRecord] = useState(null);
  const [liveHistory, setLiveHistory] = useState([]);
  const [liveEvidence, setLiveEvidence] = useState([]);
  const [liveSignals, setLiveSignals] = useState([]);
  const [liveError, setLiveError] = useState("");
  const projectTemplate = useMemo(() => PROJECTS.find((p) => p.id === projectId) || PROJECTS[0], [projectId]);
  const project = useMemo(() => {
    if (!liveRecord) return projectTemplate;
    const formatCrore = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")} Cr`;
    return {
      ...projectTemplate,
      id: liveRecord.id,
      name: liveRecord.name,
      sector: liveRecord.sector,
      meta: projectTemplate.meta.map((item) => item.primary === "Reporting Month" ? { ...item, secondary: liveRecord.reportingMonth } : item.primary === "Ministry of Railways" ? { ...item, primary: liveRecord.ministry, secondary: liveRecord.agency } : item),
      riskScore: { ...projectTemplate.riskScore, value: liveRecord.riskScore, level: `${String(liveRecord.riskTier).toUpperCase()} RISK`, scoredOn: liveRecord.reportingMonth },
      glance: projectTemplate.glance.map((item) => item.label === "Project Type" ? { ...item, value: liveRecord.sector } : item.label === "Target Completion" ? { ...item, value: liveRecord.revisedCompletionDate || liveRecord.plannedCompletionDate } : item.label === "Implementation Mode" ? { ...item, value: liveRecord.agency } : item),
      flagged: liveEvidence.length ? liveEvidence.map((item, index) => ({ id: item.id, iconTone: index % 2 ? "amber" : "red", icon: index % 2 ? "AlertTriangle" : "IndianRupee", title: item.sourceField.replaceAll("_", " "), impact: "VERIFIED SIGNAL", tone: index % 2 ? "amber" : "red", text: item.claim, evidence: [{ label: "Scored dataset", detail: `Value: ${item.sourceValue} · ${item.reportingMonth}` }] })) : projectTemplate.flagged,
      breakdown: liveSignals.length ? liveSignals.map((item) => ({ label: item.displayLabel, value: Math.round(Number(item.shapContribution || 0) * 100), tone: item.rank <= 2 ? "red" : "amber" })) : projectTemplate.breakdown,
      updates: liveHistory.length ? liveHistory.slice(-5).reverse().map((item, index) => ({ id: `${liveRecord.id}-${item.month}`, date: item.month, tone: index === 0 ? "red" : "blue", icon: index === 0 ? "AlertCircle" : "TrendingUp", title: "Published model update", text: `Risk score ${item.riskScore}% · Physical progress ${item.physicalProgress}%` })) : projectTemplate.updates,
      financial: { ...projectTemplate.financial, originalCost: formatCrore(liveRecord.originalCostCrore), revisedCost: formatCrore(liveRecord.revisedCostCrore), expenditure: formatCrore(liveRecord.expenditureCrore), revisedDelta: liveRecord.costEscalationPct },
      schedule: { ...projectTemplate.schedule, originalCompletion: liveRecord.plannedCompletionDate, revisedCompletion: liveRecord.revisedCompletionDate || liveRecord.plannedCompletionDate, currentPosition: liveRecord.scheduleSlipMonths > 0 ? `${liveRecord.scheduleSlipMonths} months behind schedule` : "On schedule" },
    };
  }, [liveEvidence, liveHistory, liveRecord, liveSignals, projectTemplate]);

  useEffect(() => {
    const month = import.meta.env.VITE_REPORTING_MONTH || "2026-06";
    // Read ?id= from hash: e.g. #/project?id=PROJ-123
    const hashParts = window.location.hash.split("?");
    const params = new URLSearchParams(hashParts[1] || "");
    const urlId = params.get("id");

    if (urlId) {
      // Load the specific project requested via URL
      api.project(urlId, month)
        .then((record) => {
          if (!record) throw new Error("Project not found.");
          setProjectId(record.id);
          setLiveRecord(record);
        })
        .catch(() => {
          // Fallback: load first project from the full list
          api.projects(month, 1)
            .then(([record]) => {
              if (!record) throw new Error("Backend returned no projects.");
              setProjectId(record.id);
              setLiveRecord(record);
            })
            .catch((error) => setLiveError(error.message));
        });
    } else {
      // No ID specified — load first project
      api.projects(month, 1)
        .then(([record]) => {
          if (!record) throw new Error("Backend returned no projects.");
          setProjectId(record.id);
          setLiveRecord(record);
        })
        .catch((error) => setLiveError(error.message));
    }
  }, []);

  useEffect(() => {
    if (!liveRecord) return;
    const month = import.meta.env.VITE_REPORTING_MONTH || "2026-06";
    Promise.all([
      api.projectHistory(liveRecord.id, month),
      api.projectEvidence(liveRecord.id, month),
      api.projectSignals(liveRecord.id, month),
    ]).then(([history, evidence, signals]) => {
      setLiveHistory(history);
      setLiveEvidence(evidence);
      setLiveSignals(signals);
    }).catch((error) => setLiveError(error.message));
  }, [liveRecord]);

  const [activeNav, setActiveNav] = useState(chrome.activeNav);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [modal, setModal] = useState(null); // { title, body } | { element }
  const toastTimer = useRef(null);

  // ---------------- Navigation (header links work) ----------------
  function handleNav(item) {
    // Navigate to the correct page based on nav selection
    const routeMap = {
  'Overview': '#/dashboard',
  'Watchlist': '#/watchlist',
  'Projects': '#/project',
  'Analytics': '#/analytics',
  'Intelligence': '#/intelligence',
  'Data Update': '#/data-update',
  "Early Warnings": "#/early-warnings",
};
    
    if (routeMap[item]) {
      window.location.hash = routeMap[item];
    }
    
    if (item === "Watchlist") {
      if (onOpenWatchlist) {
        onOpenWatchlist();
      } else {
        showToast(chrome.toasts.navSwitch.replace("{nav}", item));
      }
      return;
    }
    setActiveNav(item);
    showToast(chrome.toasts.navSwitch.replace("{nav}", item));
  }

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 2600);
  }, []);

  // ---------------- Watchlist (persisted) ----------------
  const [watchlist, setWatchlist] = useState(loadWatchlist);
  const onWatchlist = watchlist.includes(projectId);
  function toggleWatchlist() {
    setWatchlist((list) => {
      const next = list.includes(projectId)
        ? list.filter((id) => id !== projectId)
        : [...list, projectId];
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — keep session state only */
      }
      return next;
    });
    showToast(onWatchlist ? ui.tabActions.removedToast : ui.tabActions.addedToast);
  }

  // ---------------- Search over mock projects ----------------
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projectIds;
    return projectIds.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  function openProject(name) {
    const rec = PROJECTS.find((p) => p.name === name);
    if (!rec) return;
    setProjectId(rec.id);
    setActiveTab(tabs[0]);
    setSearchQuery("");
    showToast(ui.search.selectToast.replace("{name}", rec.name));
  }

  // ---------------- Downloads (real files from mock data) ----------------
  function downloadReport(option) {
    if (option === ui.tabActions.downloadOptions[2]) {
      downloadBlob(buildProjectCsv(project), `${project.id}-data-export.csv`);
    } else {
      const pdfLines = [
        { text: "PRAGATI \u2014 National Infrastructure Intelligence", size: 9, bold: true, gapAfter: 14 },
        { text: project.name, size: 17, bold: true, gapAfter: 4 },
        { text: project.tagline, size: 10, gapAfter: 16 },
        { text: "RISK SNAPSHOT", size: 11, bold: true, gapAfter: 6 },
        { text: `Risk score: ${project.riskScore.value}% (${project.riskScore.level}), ${project.riskScore.delta > 0 ? "+" : ""}${project.riskScore.delta}% ${project.riskScore.comparedTo}.`, size: 10 },
        { text: `Scored ${project.riskScore.scoredOn} with model ${project.riskScore.model}.`, size: 10, gapAfter: 14 },
        { text: "PROJECT AT A GLANCE", size: 11, bold: true, gapAfter: 6 },
        ...project.glance.map((g) => ({ text: `${g.label}: ${g.value}`, size: 10 })),
        { text: "", size: 10, gapAfter: 10 },
        { text: "FLAGGED FACTORS", size: 11, bold: true, gapAfter: 6 },
        ...project.flagged.flatMap((f) => [
          { text: `${f.title} (${f.impact})`, size: 10, bold: true },
          { text: f.text, size: 10, gapAfter: 6 },
        ]),
        { text: "", size: 10, gapAfter: 10 },
        { text: "FINANCIAL INFORMATION", size: 11, bold: true, gapAfter: 6 },
        { text: `${ui.financial.labels.original}: ${project.financial.originalCost}`, size: 10 },
        { text: `${ui.financial.labels.revised}: ${project.financial.revisedCost} (+${project.financial.revisedDelta}%)`, size: 10 },
        { text: `${ui.financial.labels.expenditure}: ${project.financial.expenditure} ${project.financial.expenditureNote}`, size: 10, gapAfter: 14 },
        { text: "SCHEDULE INFORMATION", size: 11, bold: true, gapAfter: 6 },
        { text: `${ui.schedule.labels.original}: ${project.schedule.originalCompletion}`, size: 10 },
        { text: `${ui.schedule.labels.revised}: ${project.schedule.revisedCompletion}`, size: 10 },
        { text: `${ui.schedule.labels.current}: ${project.schedule.currentPosition}`, size: 10, gapAfter: 14 },
        { text: "RISK SCORE BREAKDOWN", size: 11, bold: true, gapAfter: 6 },
        ...project.breakdown.map((b) => ({ text: `${b.label}: ${b.value}%`, size: 10 })),
        { text: "", size: 10, gapAfter: 10 },
        { text: "RECENT UPDATES", size: 11, bold: true, gapAfter: 6 },
        ...project.updates.map((u) => ({ text: `${u.date} \u2014 ${u.title}: ${u.text}`, size: 10 })),
        { text: "", size: 10, gapAfter: 10 },
        { text: "KEY DOCUMENTS", size: 11, bold: true, gapAfter: 6 },
        ...project.documents.map((d) => ({ text: `${d.name} (${d.meta})`, size: 10 })),
      ];
      const opt = option === ui.tabActions.downloadOptions[1] ? "full-dpr" : "summary";
      downloadBlob(buildPdf(pdfLines), `${project.id}-${opt}.pdf`);
    }
    showToast(ui.tabActions.downloadDone.replace("{option}", option));
  }

  // ---------------- Share (real clipboard write) ----------------
  async function share() {
    const link = `${window.location.origin}${window.location.pathname}#/project/${project.id}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast(ui.tabActions.shareToast);
    } catch {
      showToast(ui.tabActions.shareError);
    }
  }

  // ---------------- Tab switching ----------------
  function switchTab(tab) {
    setActiveTab(tab);
    showToast(ui.tabActions.tabToast.replace("{tab}", tab));
  }

  // ---------------- Modals ----------------
  function openFlagEvidence(factor) {
    setModal({
      title: `Evidence \u2014 ${factor.title}`,
      body: (
        <div>
          <p className="pd-modal-sub">{factor.text}</p>
          {factor.evidence.map((ev) => (
            <div className="pd-evidence-item" key={ev.label}>
              <div className="lbl">{ev.label}</div>
              <div className="dtl">{ev.detail}</div>
            </div>
          ))}
        </div>
      ),
    });
  }

  function openRiskMethodology() {
    const m = ui.riskCard.methodology;
    setModal({
      title: ui.riskCard.howTitle,
      body: (
        <div>
          <p className="pd-modal-sub">{m.intro.replace("{model}", project.riskScore.model).replace("{month}", project.riskScore.scoredOn)}</p>
          {m.factors.map((f) => (
            <div className="pd-evidence-item" key={f}>{f}</div>
          ))}
          <p className="pd-modal-sub" style={{ marginTop: 10 }}>{m.out}</p>
        </div>
      ),
    });
  }

  function openAllUpdates() {
    setModal({
      title: ui.updates.allTitle,
      body: (
        <div className="pd-updates-modal">
          {project.updates.map((u) => (
            <div className="row" key={u.id}>
              <div className="date">{u.date}</div>
              <div>
                <div className="t">{u.title}</div>
                <div className="x">{u.text}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    });
  }

  function openAllDocuments() {
    setModal({
      title: ui.documents.allTitle,
      body: (
        <div>
          {project.documents.map((d) => (
            <div className="pd-evidence-item" key={d.id}>
              <div className="lbl">{d.name}</div>
              <div className="dtl">{d.meta}</div>
            </div>
          ))}
        </div>
      ),
    });
  }

  function openCorridorMap() {
    setModal({
      title: ui.corridor.mapTitle.replace("{name}", project.name),
      wide: true,
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <ProjectCorridorMap
            project={project}
            onToast={showToast}
            onExpand={openCorridorMap}
            standalone
          />
        </div>
      ),
    });
  }

  // ---------------- Tab panel rendering ----------------
  const overviewPanel = (
    <div className="pd-content-scroll">
      <div className="pd-columns">
        <div className="pd-col-left">
          <ProjectAtGlance project={project} />
          <ProjectCorridorMap project={project} onToast={showToast} onExpand={openCorridorMap} />
        </div>

        <div className="pd-col-mid">
          <FlaggedReasons project={project} onToast={showToast} onViewEvidence={openFlagEvidence} />
          <ProjectTrajectoryChart project={project} />
          <FinancialScheduleInfo project={project} />
        </div>

        <div className="pd-col-right">
          <RiskScoreBreakdown project={project} />
          <RecentUpdates project={project} onToast={showToast} onViewAll={openAllUpdates} />
          <KeyDocuments project={project} onToast={showToast} onViewAll={openAllDocuments} />
        </div>
      </div>
    </div>
  );

  function renderBlock(name) {
    switch (name) {
      case "riskSummary":
        return <RiskSummary key={name} project={project} />;
      case "flagged":
        return (
          <FlaggedReasons
            key={name}
            project={project}
            onToast={showToast}
            onViewEvidence={openFlagEvidence}
          />
        );
      case "breakdown":
        return <RiskScoreBreakdown key={name} project={project} />;
      case "financial":
        return <FinancialBlock key={name} project={project} />;
      case "trajectory":
        return <ProjectTrajectoryChart key={name} project={project} />;
      case "schedule":
        return <ScheduleBlock key={name} project={project} />;
      case "map":
        return (
          <GeographyBlock
            key={name}
            project={project}
            mapSlot={
              <ProjectCorridorMap project={project} onToast={showToast} onExpand={openCorridorMap} standalone />
            }
          />
        );
      case "documents":
        return <KeyDocuments project={project} onToast={showToast} onViewAll={openAllDocuments} />;
      case "updates":
        return <RecentUpdates project={project} onToast={showToast} onViewAll={openAllUpdates} />;
      case "related":
        return <RelatedBlock key={name} project={project} onOpen={(name2) => openProject(name2)} />;
      case "discussion":
        return <DiscussionBlock key={name} project={project} />;
      default:
        return null;
    }
  }

  const activeIsOverview = activeTab === tabs[0];

  return (
    <div className="pg-app pd-page">
      <GlobalHeader activeId="projects" />

      <ProjectHero
        project={project}
        onToast={showToast}
        onOpenWatchlist={onOpenWatchlist}
        onMethodology={openRiskMethodology}
      />

      <TabBar
        activeTab={activeTab}
        onTabChange={switchTab}
        onToast={showToast}
        onWatchlist={onWatchlist}
        onToggleWatchlist={toggleWatchlist}
        onDownload={downloadReport}
        onShare={share}
      />

      {activeIsOverview ? (
        overviewPanel
      ) : (
        <div className="pd-tab-panel">
          {(tabPanels[activeTab] || []).map((name) => renderBlock(name))}
          <div className="pd-panel-note">{ui.panels.sectionNote}</div>
        </div>
      )}

      <GlobalFooter onLink={(l) => showToast(`Opening ${typeof l === "string" ? l : l.label} information.`)} />
      <Toast message={toastMessage} />
      {modal && <Modal title={modal.title} onClose={() => setModal(null)}>{modal.body}</Modal>}
    </div>
  );
}
