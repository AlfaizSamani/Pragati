import React, { useEffect } from "react";
import { X, Timer, Clock, MapPin, Landmark } from "lucide-react";

export default function ProjectDetailModal({ project, onClose, onToast }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!project) return null;

  const riskClass = project.riskLevel === "HIGH" ? "high" : project.riskLevel === "MEDIUM" ? "medium" : "low";
  const schedClass = project.scheduleRisk === "High Delay" ? "high" : project.scheduleRisk === "Moderate" ? "mod" : "ok";

  return (
    <div className="pg-modal-backdrop" onClick={onClose}>
      <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pg-modal-close" onClick={onClose}>
          <X size={16} />
        </button>

        <div className="pg-modal-head">
          <span className={`pg-badge ${riskClass}`}>{project.riskLevel} RISK</span>
          <h2>{project.name}</h2>
          <div className="pg-modal-loc">
            <MapPin size={13} /> {project.location}
          </div>
        </div>

        <div className="pg-modal-grid">
          <div>
            <span className="k">Ministry</span>
            <span className="v">{project.ministry}</span>
          </div>
          <div>
            <span className="k">Implementing Agency</span>
            <span className="v">{project.agency}</span>
          </div>
          <div>
            <span className="k">Risk Score</span>
            <span className="v">{project.riskScore}% (\u2191 +{project.delta}% this month)</span>
          </div>
          <div>
            <span className="k">Physical Progress</span>
            <span className="v">{project.progress}% complete</span>
          </div>
          <div>
            <span className="k">Cost Exposure</span>
            <span className="v">
              {project.costExposure} (+{project.costDelta}%)
            </span>
          </div>
          <div>
            <span className="k">Schedule Risk</span>
            <span className="v">
              <span className={`sched-pill ${schedClass}`}>
                {schedClass === "high" ? <Timer size={11} /> : <Clock size={11} />}
                {project.scheduleRisk}
              </span>
            </span>
          </div>
        </div>

        <div className="pg-modal-progress">
          <div className="progress-track" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${project.progress}%` }} />
          </div>
          <span className="progress-pct">{project.progress}%</span>
        </div>

        <div className="pg-modal-actions">
          <button
            className="pg-apply-btn"
            onClick={() => {
              window.location.hash = `#/project?id=${encodeURIComponent(project.id)}`;
            }}
          >
            View Full Analysis →
          </button>
          <button
            className="pg-export-btn"
            onClick={() => onToast(`Escalated "${project.name}" for ministry review.`)}
          >
            <Landmark size={14} />
            Flag for Review
          </button>
          <button className="pg-export-btn" onClick={() => onToast(`Added "${project.name}" to your watchlist.`)}>
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
