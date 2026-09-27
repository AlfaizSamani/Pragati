import React, { useEffect, useRef, useState } from 'react';

export const ConversationSection = ({ projectRecords = [], messages = [], isThinking = false, onSubmit }) => {
  const [draft, setDraft] = useState('');
  const projects = projectRecords;
  const responseScrollerRef = useRef(null);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const stickToLatestRef = useRef(true);

  const scrollToLatest = () => {
    const scroller = responseScrollerRef.current;
    if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
    stickToLatestRef.current = true;
    setShowJumpToLatest(false);
  };

  useEffect(() => {
    const scroller = responseScrollerRef.current;
    if (scroller && stickToLatestRef.current) scroller.scrollTop = scroller.scrollHeight;
  }, [messages, isThinking]);

  return (
    <div className="w-full min-w-0 h-full flex flex-col min-h-0 gap-2 overflow-hidden">
      <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm border border-[#e2e8f0]">
        <div
        ref={responseScrollerRef}
        className="absolute inset-0 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-4 flex flex-col gap-4"
        role="log"
        aria-label="Conversation messages"
        aria-live="polite"
        onScroll={(event) => {
          const node = event.currentTarget;
          const atLatest = node.scrollHeight - node.scrollTop - node.clientHeight < 64;
          stickToLatestRef.current = atLatest;
          setShowJumpToLatest(!atLatest && node.scrollHeight > node.clientHeight);
        }}
        >
          {projects.length > 0 && (
            <section className="self-stretch rounded-xl border border-slate-200 bg-slate-50 p-3" aria-label="Current highest-risk projects">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-xs font-bold text-slate-800">Highest current risk projects</h2>
                <span className="text-[10px] text-slate-500">Live scored data</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex min-w-0 items-center gap-2 rounded-lg bg-white px-2.5 py-2 text-xs">
                    <span className="min-w-0 flex-1 truncate font-medium text-slate-800" title={project.name}>{project.name}</span>
                    <span className="shrink-0 text-slate-500">{project.score}</span>
                    <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-700">{project.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {messages.length === 0 ? (
            <div className="flex justify-start">
              <article className="max-w-[88%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-sky-800">PRAGATI AI</p>
                <p className="text-sm leading-relaxed text-slate-700">Ask a question about project risk, progress, cost escalation, or the evidence behind a score. Replies use the current scored portfolio.</p>
              </article>
            </div>
          ) : messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <article className={`w-fit max-w-[92%] rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user' ? 'rounded-br-md border border-sky-700 bg-sky-800 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'} ${message.failed ? 'border-rose-200 bg-rose-50' : ''}`}>
                <p className={`mb-1 text-[10px] font-bold uppercase tracking-wide ${message.role === 'user' ? 'text-sky-800' : 'text-slate-500'}`}>
                  {message.role === 'user' ? 'You' : 'PRAGATI AI'}
                </p>
                {message.pending ? (
                  <div className="flex items-center gap-2 text-sm text-slate-600" role="status" aria-live="polite">
                    <span>Thinking through the project evidence</span>
                    <span className="flex gap-1" aria-hidden="true"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-700" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-700 [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-700 [animation-delay:240ms]" /></span>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                )}
                {message.action && (
                  <a href={message.action.href} className="mt-3 inline-flex rounded-md bg-sky-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-900">
                    {message.action.label}
                  </a>
                )}
                {!!message.sections?.length && (
                  <div className="mt-3 space-y-3">
                    {message.sections.map((section, sectionIndex) => (
                      <section key={`${section.title || section.type}-${sectionIndex}`} className={`border-t pt-3 ${message.role === 'user' ? 'border-sky-700' : 'border-slate-100'}`}>
                        {section.title && <h3 className="mb-2 text-xs font-bold text-slate-700">{section.title}</h3>}
                        {section.type === 'table' && Array.isArray(section.rows) && (
                          <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200">
                            <table className="min-w-full border-collapse text-left text-xs">
                              <thead className="bg-slate-100 text-[10px] uppercase text-slate-600">
                                <tr>{section.columns?.map((column) => <th key={column} scope="col" className="whitespace-nowrap px-2.5 py-2 font-bold">{column}</th>)}</tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {section.rows.map((row, rowIndex) => (
                                  <tr key={rowIndex} className="align-top">
                                    {row.map((cell, cellIndex) => <td key={cellIndex} className="max-w-64 px-2.5 py-2 text-slate-700">{cell}</td>)}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {section.type === 'evidence' && (
                          <ul className="space-y-1.5">
                            {(section.data || []).map((item, index) => (
                              <li key={`${item.sourceField || item.claim}-${index}`} className="flex gap-2 text-xs leading-relaxed text-slate-600">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                                <span>{item.claim}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {(section.type === 'recommendation' || section.type === 'scope') && section.content && (
                          <p className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${section.type === 'scope' ? 'bg-amber-50 text-amber-900' : 'bg-sky-50 text-sky-900'}`}>
                            {section.content}
                          </p>
                        )}
                      </section>
                    ))}
                  </div>
                )}
              </article>
            </div>
          ))}
        </div>
       {showJumpToLatest && (
         <button
           type="button"
           onClick={scrollToLatest}
           aria-label="Jump to latest response"
           title="Jump to latest response"
           className="absolute bottom-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-[#d6e4f3] bg-white text-primary shadow-md transition hover:-translate-y-0.5 hover:bg-[#f4f8fc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
         >
           <span className="material-symbols-outlined text-[20px]">south</span>
         </button>
       )}
      </div>

      {/* Follow-up Prompt Bar - PINNED AT BOTTOM */}
      <div className="w-full flex flex-col gap-1 flex-none">
        <form className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-sm px-2.5 py-1 border border-[#d6e4f3]" onSubmit={(event) => { event.preventDefault(); if (!isThinking && draft.trim()) { onSubmit?.(draft.trim()); setDraft(''); } }}>
          <button aria-label="Attach context documents" className="p-1 text-on-surface-variant hover:text-primary transition-colors" type="button">
            <span className="material-symbols-outlined text-[18px]">attach_file</span>
          </button>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} className="flex-1 px-2 py-1 bg-transparent text-body-sm font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none text-[12.5px]" placeholder="Ask a follow-up question..." type="text" />
          <button aria-label="Send query" disabled={isThinking || !draft.trim()} className="w-7 h-7 rounded-lg bg-primary hover:bg-primary-container text-on-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm" type="submit">
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
