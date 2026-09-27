import React from "react";
import { Info, ArrowUp, ArrowRight } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

export default function RiskScoreCard({ riskScore, onToast, onMethodology }) {
  return (
    <div className="pd-risk-card">
      <div className="pd-risk-card-title">
        {ui.riskCard.title}
        <Info size={12} />
      </div>

      <div className="pd-risk-card-main">
        <span className="pd-risk-card-value">
          {riskScore.value}
          <em>%</em>
        </span>
        <span className="pd-risk-card-pill">{riskScore.level}</span>
      </div>

      <div className="pd-risk-card-delta">
        <span className="badge">
          <ArrowUp size={11} /> {riskScore.delta > 0 ? "+" : ""}{riskScore.delta}%
        </span>
        <span className="note">{riskScore.comparedTo}</span>
      </div>

      <div className="pd-risk-card-foot">
        {ui.riskCard.scoredLabel} {riskScore.scoredOn} &middot; {ui.riskCard.modelLabel} {riskScore.model}
      </div>

      <button
        className="pd-risk-card-link"
        onClick={() => (onMethodology ? onMethodology() : onToast(ui.riskCard.howToast))}
      >
        {ui.riskCard.howLabel} <ArrowRight size={12} />
      </button>
    </div>
  );
}
