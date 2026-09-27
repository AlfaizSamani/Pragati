import React from 'react';

export const TryTheseQuestions = ({ onSelect }) => {
  const questions = [
    { icon: 'warning', text: 'Which projects need immediate attention?', iconColor: 'text-error' },
    { icon: 'bar_chart', text: 'Why is this project flagged?', iconColor: 'text-surface-tint' },
    { icon: 'trending_up', text: 'Show risk trends in the Transport sector.', iconColor: 'text-surface-tint' },
    { icon: 'balance', text: 'Compare project performance across states.', iconColor: 'text-primary' },
    { icon: 'currency_rupee', text: 'What are the key reasons for cost overruns?', iconColor: 'text-secondary' },
    { icon: 'article', text: 'Summarize latest updates for Maharashtra.', iconColor: 'text-on-surface-variant' },
    { icon: 'schedule', text: 'List projects with schedule delay > 12 months.', iconColor: 'text-surface-tint' },
    { icon: 'monitoring', text: 'What has changed this month?', iconColor: 'text-tertiary-fixed-dim' }
  ];

  return (
    <div className="w-full flex flex-col gap-space-sm">
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container-high">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
            <h2 className="font-title-md text-title-md text-primary">Try These Questions</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
            8 Prompts
          </span>
        </div>
        <div className="flex flex-col gap-space-xs">
          {questions.map((q, idx) => (
            <button
              key={idx}
              className="w-full text-left p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-space-sm group"
              type="button"
              onClick={() => onSelect?.(q.text)}
            >
              <span className={`material-symbols-outlined ${q.iconColor} text-[20px] shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                {q.icon}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary leading-snug">
                {q.text}
              </span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => onSelect?.("Show my recent intelligence queries.")} className="mt-space-md p-space-sm rounded-lg bg-primary/5 text-primary flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors w-full text-left">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span className="font-label-sm text-label-sm font-semibold">View Query History</span>
          </div>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
