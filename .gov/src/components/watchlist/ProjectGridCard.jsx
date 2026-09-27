import React from "react";
import { ArrowUp, ArrowRight, Timer, Clock } from "lucide-react";

export default function ProjectGridCard({ project, onOpenDetail }) {
  const riskClass = project.riskLevel === "CRITICAL" || project.riskLevel === "HIGH" ? "high" : project.riskLevel === "MEDIUM" ? "medium" : "low";
  const schedClass = project.scheduleRisk.includes("delay") ? "high" : project.scheduleRisk === "Moderate" ? "mod" : "ok";

  return (
    <div className="pg-grid-card" onClick={() => onOpenDetail(project)}>
      <div className="pg-grid-card-top">
        <span className={`pg-badge ${riskClass}`}>{project.riskLevel}</span>
        <span className="risk-num">{project.riskScore}%</span>
      </div>
      <div className="proj-name">{project.name}</div>
      <div className="proj-loc">{project.location}</div>
      <div className="agency-sub" style={{ margin: "8px 0" }}>
        {project.ministry} &middot; {project.agency}
      </div>
      <div className="progress-cell" style={{ marginBottom: 10 }}>
        <div className="progress-track" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${project.progress}%` }} />
        </div>
        <span className="progress-pct">{project.progress}%</span>
      </div>
      <div className="pg-grid-card-foot">
        <div>
          <div className="cost-main">{project.costExposure}</div>
          <span className={`sched-pill ${schedClass}`}>
            {schedClass === "high" ? <Timer size={11} /> : <Clock size={11} />}
            {project.scheduleRisk}
          </span>
        </div>
        <button className="row-arrow" onClick={(e) => { e.stopPropagation(); onOpenDetail(project); }}>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
