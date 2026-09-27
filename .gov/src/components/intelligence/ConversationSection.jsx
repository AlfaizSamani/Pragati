import React, { useState } from 'react';

export const ConversationSection = ({ projectRecords = [], question, answer, onSubmit }) => {
  const [draft, setDraft] = useState(question || '');
  const legacyProjects = [
    {
      id: 1,
      name: 'Mumbai-Ahmedabad High Speed Rail (MAHSR)',
      type: 'Railways',
      score: '87%',
      level: 'High',
      levelBg: 'bg-error-container text-on-error-container',
      scoreColor: 'text-error',
      reasons: 'Schedule delay, land acquisition issues, cost escalation'
    },
    {
      id: 2,
      name: 'Mumbai Trans Harbour Link (MTHL) Extension',
      type: 'Road Transport',
      score: '81%',
      level: 'High',
      levelBg: 'bg-error-container text-on-error-container',
      scoreColor: 'text-error',
      reasons: 'Cost overrun, contractor mobilization delays'
    },
    {
      id: 3,
      name: 'Pune Metro Phase II',
      type: 'Urban Transport',
      score: '76%',
      level: 'High',
      levelBg: 'bg-error-container text-on-error-container',
      scoreColor: 'text-error',
      reasons: 'Delayed clearances, utility shifting, rising costs'
    },
    {
      id: 4,
      name: 'Nagpur Metro Phase II',
      type: 'Urban Transport',
      score: '62%',
      level: 'Medium',
      levelBg: 'bg-secondary-fixed text-on-secondary-fixed',
      scoreColor: 'text-secondary',
      reasons: 'Land acquisition, slower than expected progress'
    },
    {
      id: 5,
      name: 'Samruddhi Mahamarg (Phase II)',
      type: 'Road Transport',
      score: '58%',
      level: 'Medium',
      levelBg: 'bg-secondary-fixed text-on-secondary-fixed',
      scoreColor: 'text-secondary',
      reasons: 'Environmental clearances, contractor issues'
    }
  ];
  const projects = projectRecords;

  return (
    <div className="w-full min-w-0 h-full flex flex-col min-h-0 gap-2 overflow-hidden">
      {/* User Prompt Card */}
      <div className="w-full bg-[#edf4fb] rounded-xl p-2.5 px-3.5 shadow-sm border border-[#d6e4f3] flex items-center justify-between gap-3 flex-none">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-title-sm text-title-sm text-on-primary shrink-0 shadow-sm">
            AS
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-title-sm text-title-sm text-primary font-bold">A. Sharma</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">• MoSPI Officer</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface truncate font-medium text-[13px]">
              {question}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant shrink-0">
          <span className="font-label-sm text-label-sm">Today, 10:24 AM</span>
          <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
        </div>
      </div>

      {/* AI Generated Response Container - SCROLLABLE INTERNAL CONTAINER */}
      <div className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain bg-surface-container-lowest rounded-xl p-3.5 shadow-sm flex flex-col gap-3 border border-[#e2e8f0]">
        {/* AI Message Header */}
        <div className="flex items-start gap-space-sm">
          <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface leading-relaxed text-[13px]">
            {answer?.summary || 'The ranked projects below are loaded from the published scored dataset. Ask a follow-up question for evidence-grounded analysis.'}
          </p>
        </div>

        {/* Data Table: High Risk Projects */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-surface-container-low shadow-sm">
          <div className="px-3 py-2 bg-surface-container flex items-center justify-between">
            <span className="font-title-sm text-title-sm text-primary font-bold text-[13px]">Top Transport Projects in Maharashtra by Risk Score</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">{projects.length} Projects Identified</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm font-body-sm">
              <thead className="bg-primary text-on-primary uppercase text-label-sm font-label-sm text-[10px]">
                <tr>
                  <th className="py-1.5 px-2 text-center w-8" scope="col">#</th>
                  <th className="py-1.5 px-2" scope="col">Project Name</th>
                  <th className="py-1.5 px-2" scope="col">Type</th>
                  <th className="py-1.5 px-2 text-center" scope="col">Risk Score</th>
                  <th className="py-1.5 px-2 text-center" scope="col">Risk Level</th>
                  <th className="py-1.5 px-2" scope="col">Key Reasons</th>
                  <th className="py-1.5 px-2 text-center" scope="col">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high bg-surface-container-lowest text-[12px]">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-1.5 px-2 text-center font-bold text-on-surface-variant">{proj.id}</td>
                    <td className="py-1.5 px-2 font-title-sm text-title-sm text-primary">{proj.name}</td>
                    <td className="py-1.5 px-2 text-on-surface-variant">{proj.type}</td>
                    <td className={`py-1.5 px-2 text-center font-bold ${proj.scoreColor}`}>{proj.score}</td>
                    <td className="py-1.5 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full ${proj.levelBg} font-label-sm text-label-sm font-bold uppercase tracking-wider text-[9.5px]`}>
                        {proj.level}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-on-surface leading-snug">{proj.reasons}</td>
                    <td className="py-1.5 px-2 text-center">
                      <button aria-label={`Inspect ${proj.name}`} className="text-primary hover:text-secondary transition-colors" type="button">
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights Card */}
        <div className="p-3 rounded-lg bg-[#FEF9EE] text-on-surface flex flex-col gap-1 shadow-sm border border-[#f5e6ca]">
          <div className="flex items-center gap-1.5 text-secondary font-bold">
            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            <span className="font-title-sm text-title-sm text-[13px]">Key Insights</span>
          </div>
          <ul className="space-y-0.5 text-body-sm font-body-sm pl-5 list-disc text-on-surface leading-relaxed text-[12px]">
            <li><strong className="font-semibold text-primary">3 out of 5</strong> high-risk transport projects in Maharashtra are facing significant schedule delays.</li>
            <li>Cost escalation is a common factor, present in <strong className="font-semibold text-primary">80%</strong> of these projects.</li>
            <li>Land acquisition and environmental clearances are the primary drivers of risk in rail and road projects.</li>
            <li>These findings are based on the latest model outputs (<code className="font-mono text-label-sm bg-surface-container px-1 py-0.5 rounded text-[10px]">v3-final</code>) and project updates from IPMD and ministry sources.</li>
          </ul>
        </div>

        {/* Sources & Provenance Card */}
        <div className="p-3 rounded-lg bg-surface-container-low text-on-surface flex flex-col gap-1 shadow-sm border border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <span className="material-symbols-outlined text-[18px]">policy</span>
            <span className="font-title-sm text-title-sm text-[13px]">Sources &amp; Provenance</span>
          </div>
          <ol className="space-y-0.5 text-body-sm font-body-sm pl-5 list-decimal text-on-surface-variant leading-relaxed text-[11.5px]">
            <li><span className="font-semibold text-on-surface">Integrated Project Monitoring Dashboard (IPMD)</span> – Project status data (April 2026)</li>
            <li><span className="font-semibold text-on-surface">MoSPI Infrastructure Database</span> – Financial and physical progress</li>
            <li><span className="font-semibold text-on-surface">Risk Prediction Model v3-final</span> – AI/ML risk scores and SHAP analysis</li>
            <li><span className="font-semibold text-on-surface">Ministry of Railways / MoRTH</span> – Official project updates and documents</li>
          </ol>
        </div>
      </div>

      {/* Follow-up Prompt Bar - PINNED AT BOTTOM */}
      <div className="w-full flex flex-col gap-1 flex-none">
        <form className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-sm px-2.5 py-1 border border-[#d6e4f3]" onSubmit={(e) => e.preventDefault()}>
          <button aria-label="Attach context documents" className="p-1 text-on-surface-variant hover:text-primary transition-colors" type="button">
            <span className="material-symbols-outlined text-[18px]">attach_file</span>
          </button>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} className="flex-1 px-2 py-1 bg-transparent text-body-sm font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none text-[12.5px]" placeholder="Ask a follow-up question..." type="text" />
          <button aria-label="Send query" onClick={() => onSubmit?.(draft)} className="w-7 h-7 rounded-lg bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-colors shadow-sm" type="submit">
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
        <div className="flex items-center justify-center gap-1 text-center">
          <span className="material-symbols-outlined text-[11px] text-on-surface-variant">info</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">
            PRAGATI AI provides analysis based on official data and model outputs. Please verify critical information from original sources.
          </p>
        </div>
      </div>
    </div>
  );
};
