import React from "react";
import { AlertCircle, IndianRupee, TrendingUp, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

const ICONS = { AlertCircle, IndianRupee, TrendingUp, Users, CheckCircle2 };

export default function RecentUpdates({ project, onToast, onViewAll }) {
  const c = ui.updates;
  return (
    <div className="pd-card">
      <div className="pd-card-title-row">
        <div className="pd-card-title">{c.title}</div>
        <button className="pd-link" onClick={() => (onViewAll ? onViewAll() : onToast(c.viewAllToast))}>
          {c.viewAll} <ArrowRight size={12} />
        </button>
      </div>
      <div className="pd-timeline">
        {project.updates.map((u, i) => {
          const Icon = ICONS[u.icon] || AlertCircle;
          return (
            <div className="pd-timeline-row" key={u.id}>
              <div className="pd-timeline-date">{u.date}</div>
              <div className="pd-timeline-rail">
                <span className={`dot ${u.tone}`}>
                  <Icon size={10} />
                </span>
                {i < project.updates.length - 1 && <span className="line" />}
              </div>
              <div className="pd-timeline-body">
                <div className="title">{u.title}</div>
                <div className="text">{u.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
