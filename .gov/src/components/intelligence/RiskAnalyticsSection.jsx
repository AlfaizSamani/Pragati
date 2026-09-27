import React from 'react';

export const RiskAnalyticsSection = () => {
  const selectedProjects = [
    { title: 'Mumbai-Ahmedabad HSR', fullTitle: 'Mumbai-Ahmedabad HSR', score: '87%', barColor: 'bg-error', scoreColor: 'text-error', width: '87%' },
    { title: 'MTHL Extension', fullTitle: 'MTHL Extension', score: '81%', barColor: 'bg-error', scoreColor: 'text-error', width: '81%' },
    { title: 'Pune Metro Phase II', fullTitle: 'Pune Metro Phase II', score: '76%', barColor: 'bg-error', scoreColor: 'text-error', width: '76%' },
    { title: 'Nagpur Metro Phase II', fullTitle: 'Nagpur Metro Phase II', score: '62%', barColor: 'bg-secondary', scoreColor: 'text-secondary', width: '62%' },
    { title: 'Samruddhi Mahamarg (II)', fullTitle: 'Samruddhi Mahamarg (Phase II)', score: '58%', barColor: 'bg-secondary-container', scoreColor: 'text-secondary', width: '58%' }
  ];

  const riskDrivers = [
    { label: 'Schedule Delay', score: '68%', barColor: 'bg-error', scoreColor: 'text-error', width: '68%' },
    { label: 'Cost Escalation', score: '52%', barColor: 'bg-error', scoreColor: 'text-error', width: '52%' },
    { label: 'Land Acquisition', score: '36%', barColor: 'bg-secondary', scoreColor: 'text-secondary', width: '36%' },
    { label: 'Environmental Clearances', score: '28%', barColor: 'bg-secondary', scoreColor: 'text-secondary', width: '28%' },
    { label: 'Contractor Performance', score: '24%', barColor: 'bg-secondary-container', scoreColor: 'text-secondary-container', width: '24%' },
    { label: 'Utility Shifting', score: '18%', barColor: 'bg-surface-variant', scoreColor: 'text-on-surface-variant', width: '18%' }
  ];

  const relatedInsights = [
    { icon: 'diamond', text: 'Show all high-risk projects in India' },
    { icon: 'compare_arrows', text: 'Compare MH vs Gujarat transport' },
    { icon: 'show_chart', text: 'Forecast risk trend for MAHSR' },
    { icon: 'rule', text: 'Recent updates on land acquisition' }
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Card 1: Risk Analysis for Selected Projects */}
      <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-sm flex flex-col gap-2 border border-[#e2e8f0]">
        <div className="flex items-center justify-between pb-1 border-b border-surface-container-high">
          <h3 className="font-title-sm text-title-sm text-primary font-bold text-[12.5px]">Risk Analysis for Selected Projects</h3>
          <a className="font-label-sm text-label-sm text-primary hover:text-secondary flex items-center gap-0.5 text-[11px]" href="#/analytics">
            <span>View Full</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </a>
        </div>
        <div className="flex flex-col gap-1.5">
          {selectedProjects.map((p, idx) => (
            <div key={idx} className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center text-body-sm font-body-sm text-[11.5px]">
                <span className="text-on-surface font-medium truncate max-w-[170px]" title={p.fullTitle}>
                  {p.title}
                </span>
                <span className={`font-title-sm text-title-sm font-bold text-[11.5px] ${p.scoreColor}`}>{p.score}</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full ${p.barColor} rounded-full transition-all duration-500`} style={{ width: p.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Key Risk Drivers (Aggregated) */}
      <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-sm flex flex-col gap-2 border border-[#e2e8f0]">
        <div className="flex items-center justify-between pb-1 border-b border-surface-container-high">
          <h3 className="font-title-sm text-title-sm text-primary font-bold text-[12.5px]">Key Risk Drivers (Aggregated)</h3>
          <a className="font-label-sm text-label-sm text-primary hover:text-secondary flex items-center gap-0.5 text-[11px]" href="#/analytics">
            <span>View Details</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </a>
        </div>
        <div className="flex flex-col gap-1.5">
          {riskDrivers.slice(0, 5).map((d, idx) => (
            <div key={idx} className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center text-body-sm font-body-sm text-[11px]">
                <span className="text-on-surface-variant font-medium">{d.label}</span>
                <span className={`font-label-md text-label-md font-bold text-[11px] ${d.scoreColor}`}>{d.score}</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full ${d.barColor} rounded-full`} style={{ width: d.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Related Insights */}
      <div className="bg-surface-container-lowest rounded-xl p-2 shadow-sm flex flex-col gap-1 border border-[#e2e8f0]">
        <div className="flex items-center gap-1 pb-1 border-b border-surface-container-high text-primary">
          <span className="material-symbols-outlined text-[15px]">travel_explore</span>
          <h3 className="font-title-sm text-title-sm font-bold text-[12px]">Related Insights</h3>
        </div>
        <div className="flex flex-col divide-y divide-surface-container-high">
          {relatedInsights.slice(0, 3).map((ri, idx) => (
            <a key={idx} className="py-1 flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:text-secondary group transition-colors text-[11px]" href="#">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-surface-tint group-hover:text-secondary">{ri.icon}</span>
                <span className="leading-tight">{ri.text}</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
