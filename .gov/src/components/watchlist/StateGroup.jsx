import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import ProjectRow from "./ProjectRow";
import ProjectGridCard from "./ProjectGridCard";
import { sortProjects } from "./utils";

const COLUMNS = [
  "Project",
  "Ministry / Agency",
  "Risk Score",
  "\u0394 (1M)",
  "Physical Progress",
  "Cost Exposure",
  "Schedule Risk",
  "Last Updated",
  "Actions",
];

export default function StateGroup({ group, expanded, onToggle, sortOrder, viewMode, onOpenDetail, onViewAll }) {
  const sorted = sortProjects(group.projects, sortOrder);

  if (!expanded) {
    return (
      <button className="pg-state-collapsed" onClick={onToggle}>
        <ChevronRight size={14} className="chev" />
        <span className="state-name">{group.name}</span>
        <span className="state-count">{group.projectCount} projects</span>
        <div className="avg-wrap">
          <span className={`dot ${group.riskColor}`} />
          Avg. Risk Score <span className="avg-score">{group.avgRisk}%</span>
        </div>
      </button>
    );
  }

  return (
    <div className="pg-state-group">
      <button className="pg-state-header" onClick={onToggle}>
        <ChevronDown size={14} className="chev" />
        <span className="state-name">{group.name}</span>
        <span className="state-count">{group.projectCount} projects</span>
        <div className="avg-wrap">
          <span className={`dot ${group.riskColor}`} />
          Avg. Risk Score <span className="avg-score">{group.avgRisk}%</span>
        </div>
      </button>

      {viewMode === "list" ? (
        <div className="pg-table-scroll">
          <table className="pg-proj-table">
            <thead>
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <ProjectRow key={p.id} project={p} onOpenDetail={onOpenDetail} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pg-grid-wrap">
          {sorted.map((p) => (
            <ProjectGridCard key={p.id} project={p} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      )}

      <button className="pg-view-all-row" onClick={() => onViewAll(group)}>
        View all {group.projectCount} projects in {group.name} <span>{"\u2192"}</span>
      </button>
    </div>
  );
}
