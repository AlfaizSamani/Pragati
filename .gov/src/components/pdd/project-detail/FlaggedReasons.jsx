import React from "react";
import { CalendarClock, IndianRupee, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

const ICONS = { CalendarClock, IndianRupee, TrendingUp, AlertTriangle };

export default function FlaggedReasons({ project, onToast, onViewEvidence }) {
  const c = ui.flagged;
  return (
    <div className="pd-card">
      <div className="pd-card-title-row">
        <div>
          <div className="pd-card-title">{c.title}</div>
          <p className="pd-card-subtitle">{c.subtitle}</p>
        </div>
        <button className="pd-link" onClick={() => onToast(c.viewDetailedToast)}>
          {c.viewDetailed} <ArrowRight size={12} />
        </button>
      </div>

      <div className="pd-flag-grid">
        {project.flagged.map((reason) => {
          const Icon = ICONS[reason.icon];
          return (
            <div className="pd-flag-card" key={reason.id}>
              <div className="pd-flag-head">
                <div className={`pd-flag-icn ${reason.iconTone || reason.tone}`}>
                  <Icon size={15} />
                </div>
                <div className="pd-flag-headtext">
                  <span className="title">{reason.title}</span>
                  <span className={`pd-flag-impact ${reason.tone}`}>{reason.impact}</span>
                </div>
              </div>
              <p>{reason.text}</p>
              <button
                className="pd-link"
                onClick={() =>
                  onViewEvidence
                    ? onViewEvidence(reason)
                    : onToast(c.evidenceToast.replace("{title}", reason.title))
                }
              >
                {c.viewEvidence} <ArrowRight size={11} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
