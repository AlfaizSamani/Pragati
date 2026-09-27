import React from "react";
import { ui } from "../../../data/projectDetailData";

export default function RiskScoreBreakdown({ project, onToast }) {
  const rows = project.breakdown;
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <div className="pd-card">
      <div className="pd-card-title-row">
        <div className="pd-card-title">{ui.breakdown.title}</div>
      </div>
      <div className="pd-breakdown-list">
        {rows.map((row) => (
          <div
            className="pd-breakdown-row"
            key={row.label}
            onClick={() => onToast && onToast(ui.breakdown.detailToast.replace("{label}", row.label))}
            style={{ cursor: onToast ? "pointer" : "default" }}
            title={ui.breakdown.detailToast.replace("{label}", row.label)}
          >
            <span className="label">{row.label}</span>
            <div className="track">
              <div className={`fill ${row.tone}`} style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
            <span className="value">{row.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
