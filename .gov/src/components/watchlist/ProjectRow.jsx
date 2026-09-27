import React from "react";
import { ArrowUp, ArrowRight, Clock, Timer } from "lucide-react";

export default function ProjectRow({ project, onOpenDetail }) {
  const riskClass = project.riskLevel === "CRITICAL" || project.riskLevel === "HIGH" ? "high" : project.riskLevel === "MEDIUM" ? "medium" : "low";
  const schedClass = project.scheduleRisk.includes("delay") ? "high" : project.scheduleRisk === "Moderate" ? "mod" : "ok";

  return (
    <tr onClick={() => onOpenDetail(project)}>
      <td>
        <div className="proj-name">{project.name}</div>
        <div className="proj-loc">{project.location}</div>
      </td>
      <td>
        <div className="agency-main">{project.ministry}</div>
        <div className="agency-sub">{project.agency}</div>
      </td>
      <td>
        <div className="risk-cell">
          <span className={`pg-badge ${riskClass}`}>{project.riskLevel}</span>
          <span className="risk-num">{project.riskScore}%</span>
        </div>
      </td>
      <td>
        <div className="delta">
          {project.delta == null ? "—" : <><ArrowUp size={12} /> +{project.delta}%</>}
        </div>
      </td>
      <td>
        <div className="progress-cell">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${project.progress}%` }} />
          </div>
          <span className="progress-pct">{project.progress}%</span>
        </div>
      </td>
      <td>
        <div className="cost-main">{project.costExposure}</div>
        <div className="cost-sub">(+{project.costDelta}%)</div>
      </td>
      <td>
        <span className={`sched-pill ${schedClass}`}>
          {schedClass === "high" ? <Timer size={11} /> : <Clock size={11} />}
          {project.scheduleRisk}
        </span>
      </td>
      <td>
        <span className="updated-cell">{project.lastUpdated}</span>
      </td>
      <td>
        <button
          className="row-arrow"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(project);
          }}
          aria-label={`View ${project.name}`}
        >
          <ArrowRight size={14} />
        </button>
      </td>
    </tr>
  );
}
