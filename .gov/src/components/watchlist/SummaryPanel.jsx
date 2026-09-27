import React from "react";
import { BarChart3, Lightbulb, ArrowRight } from "lucide-react";
import { summaryStats, keyInsights, quickActions } from "../../data/watchlistData";
import { ICONS } from "./icons";

export default function SummaryPanel({ stats, insights, onQuickAction, onViewAnalysis }) {
  const dynamicStats = (stats && stats.length > 0) ? stats : summaryStats;
  const dynamicInsights = (insights && insights.length > 0) ? insights : keyInsights;

  return (
    <aside className="pg-right-side">
      <div className="pg-summary-card">
        <div className="pg-summary-title">
          <span className="icn">
            <BarChart3 size={15} />
          </span>
          Investigation Summary
        </div>
        {dynamicStats.map((stat) => {
          const Icon = ICONS[stat.icon];
          return (
            <div className="pg-stat-row" key={stat.id}>
              <div className={`pg-stat-icn ${stat.tone}`}>
                <Icon size={16} />
              </div>
              <div>
                <div className="stat-num">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pg-insight-card">
        <div className="pg-insight-title">
          <Lightbulb size={15} />
          Key Insights
        </div>
        <ul>
          {dynamicInsights.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
        <button className="pg-insight-link" onClick={onViewAnalysis}>
          View Detailed Analysis <ArrowRight size={13} />
        </button>
      </div>

      <div className="pg-summary-card pg-quick-actions-card">
        <div className="pg-qa-title">Quick Actions</div>
        <div className="pg-qa-grid">
          {quickActions.map((qa) => {
            const Icon = ICONS[qa.icon];
            return (
              <button key={qa.id} className="pg-qa-btn" onClick={() => onQuickAction(qa.label)}>
                <span className="icn">
                  <Icon size={14} />
                </span>
                {qa.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
