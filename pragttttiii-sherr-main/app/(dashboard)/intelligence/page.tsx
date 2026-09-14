'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BrainCircuit, 
  Send, 
  Trash2, 
  RefreshCw, 
  ArrowUpRight, 
  AlertTriangle, 
  FileText, 
  BarChart2, 
  Target, 
  Info,
  Sparkles,
  ChevronRight
} from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { queryIntelligence, getSuggestedQuestions } from '@/lib/api/intelligence';
import { getProjects } from '@/lib/api/projects';
import { 
  IntelligenceQuery, 
  IntelligenceResponse, 
  Project, 
  PredictiveSignal, 
  Evidence 
} from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  response?: IntelligenceResponse;
  timestamp: string;
}

function IntelligenceChatContent() {
  const searchParams = useSearchParams();

  const urlProjectId = searchParams.get('project') || '';
  const urlInitialQuery = searchParams.get('q') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(urlProjectId);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const suggested = getSuggestedQuestions(selectedProjectId || undefined);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialQueryHandled = useRef(false);
  const msgCounter = useRef(0);

  // Sync urlProjectId if changed using prev state pattern or direct state update during render/useEffect callback
  const [prevUrlProjectId, setPrevUrlProjectId] = useState(urlProjectId);
  if (urlProjectId !== prevUrlProjectId) {
    setPrevUrlProjectId(urlProjectId);
    setSelectedProjectId(urlProjectId);
  }

  // Load projects
  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initial query handler via async effect without synchronous setState
  useEffect(() => {
    if (urlInitialQuery && !initialQueryHandled.current) {
      initialQueryHandled.current = true;
      setLoading(true);
      const userMsg: Message = {
        id: `msg-user-init`,
        sender: 'user',
        text: urlInitialQuery,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([userMsg]);

      queryIntelligence({
        id: `q-${Date.now()}`,
        question: urlInitialQuery,
        projectId: urlProjectId || undefined,
        category: 'risk_explanation'
      })
        .then(res => {
          const assistantMsg: Message = {
            id: `msg-ast-init`,
            sender: 'assistant',
            response: res,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, assistantMsg]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [urlInitialQuery, urlProjectId]);

  // Selected project object
  const currentProject = projects.find(p => p.id === selectedProjectId);

  // Process user query sending
  const handleSendQuery = async (queryText: string, forcedProjectId?: string) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const targetProjectId = forcedProjectId !== undefined ? forcedProjectId : selectedProjectId;
    msgCounter.current += 1;
    const msgIdSeq = msgCounter.current;
    const userMsgId = `msg-user-${msgIdSeq}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    // Infer category and project context from text if not selected
    let inferredProjectId = targetProjectId;
    let inferredCategory: IntelligenceQuery['category'] = 'risk_explanation';

    const lower = text.toLowerCase();
    if (!inferredProjectId) {
      if (lower.includes('zojila') || lower.includes('proj-008')) inferredProjectId = 'PROJ-008';
      else if (lower.includes('bullet') || lower.includes('high speed') || lower.includes('mahsh') || lower.includes('proj-001')) inferredProjectId = 'PROJ-001';
      else if (lower.includes('kudankulam') || lower.includes('nuclear') || lower.includes('proj-004')) inferredProjectId = 'PROJ-004';
      else if (lower.includes('expressway') || lower.includes('delhi-mumbai') || lower.includes('proj-002')) inferredProjectId = 'PROJ-002';
      else if (lower.includes('eastern dfc') || lower.includes('freight') || lower.includes('proj-003')) inferredProjectId = 'PROJ-003';
    }

    if (lower.includes('change') || lower.includes('since last month') || lower.includes('trajectory')) {
      inferredCategory = 'change_analysis';
    } else if (lower.includes('evidence') || lower.includes('support') || lower.includes('proof')) {
      inferredCategory = 'evidence_review';
    } else if (lower.includes('priority') || lower.includes('first') || lower.includes('action') || lower.includes('should official')) {
      inferredCategory = 'priority_review';
    }

    const intelQuery: IntelligenceQuery = {
      id: `q-${msgIdSeq}`,
      question: text,
      projectId: inferredProjectId || undefined,
      category: inferredCategory
    };

    try {
      const response = await queryIntelligence(intelQuery);
      const assistantMsg: Message = {
        id: `msg-ast-${msgIdSeq}`,
        sender: 'assistant',
        response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Workspace Header */}
      <div className="surface-level-3 rounded-2xl p-6 relative overflow-hidden border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-royal text-sky-400 shadow-xs">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-royal tracking-tight">
                PRAGATI Intelligence Console
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Evidence-grounded conversational analyst. Ask questions, analyze SHAP predictive signals, verify field evidence, and review official intervention recommendations.
            </p>
          </div>

          {/* Context Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Active Context:</span>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="text-xs font-bold text-royal bg-white border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer min-w-56"
            >
              <option value="">Portfolio General Context</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.id} · {p.name.length > 28 ? p.name.substring(0, 28) + '...' : p.name}
                </option>
              ))}
            </select>
            {selectedProjectId && (
              <button
                type="button"
                onClick={() => setSelectedProjectId('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 font-semibold"
                title="Clear Context"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Selected Context Banner */}
        {currentProject && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-sky-50/60 p-2.5 rounded-lg border border-sky-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-royal">Context Spotlight:</span>
              <span className="font-semibold text-slate-800">{currentProject.name}</span>
              <span className="text-slate-400">({currentProject.sector} · {currentProject.state})</span>
            </div>
            <Link href={`/projects/${currentProject.id}`} className="text-primary-700 font-bold hover:underline inline-flex items-center gap-0.5">
              <span>Project Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Main Chat Workspace Grid (8 Cols Left / 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Chat Workspace (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Chat Header Controls */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Conversational Analyst Stream</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                EVIDENCE-GROUNDED
              </span>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                className="text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-royal text-white flex items-center justify-center shadow-md">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-royal">PRAGATI Intelligence Analyst</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-md">
                    Ask questions regarding portfolio risk ranking, predictive SHAP signals, verifiable field evidence, peer benchmarks, or official intervention actions.
                  </p>
                </div>

                {/* Suggested Questions Grid */}
                <div className="w-full max-w-lg space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Suggested Analysis Questions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {suggested.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSendQuery(q.question)}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-primary hover:bg-sky-50/50 text-xs text-slate-700 font-medium transition-all shadow-xs flex items-center justify-between group"
                      >
                        <span className="line-clamp-2">{q.question}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {/* User Message */}
                  {msg.sender === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-royal text-white p-3.5 rounded-2xl rounded-tr-none max-w-lg text-xs leading-relaxed shadow-sm">
                        <div className="font-semibold text-[10px] text-slate-300 mb-0.5">YOU</div>
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    /* Assistant Response Card */
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 sm:p-5 max-w-2xl text-xs space-y-4 shadow-sm w-full">
                        {/* Response Top Bar */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-royal text-white">
                              <BrainCircuit className="w-3.5 h-3.5" />
                            </span>
                            <span className="font-bold text-royal text-xs">PRAGATI Intelligence Response</span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>Cycle: {msg.response?.reportingMonth}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              Evidence Sufficiency: {((msg.response?.confidence || 0) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* High Level Executive Summary */}
                        <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200/80 text-sky-950 font-medium leading-relaxed">
                          {msg.response?.summary}
                        </div>

                        {/* Structured Sections */}
                        <div className="space-y-3">
                          {msg.response?.sections.map((sec, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                {sec.type === 'risk_summary' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                                {sec.type === 'signals' && <Sparkles className="w-3.5 h-3.5 text-sky-600" />}
                                {sec.type === 'evidence' && <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                                {sec.type === 'peer_context' && <BarChart2 className="w-3.5 h-3.5 text-royal" />}
                                {sec.type === 'recommendation' && <Target className="w-3.5 h-3.5 text-red-600" />}
                                <span>{sec.title}</span>
                              </h4>

                              <p className="text-slate-700 text-xs leading-relaxed">{sec.content}</p>

                              {/* Signals Data Array */}
                              {sec.type === 'signals' && Array.isArray(sec.data) && (
                                <div className="space-y-1.5 pt-1">
                                  {(sec.data as PredictiveSignal[]).map((sig, sIdx) => (
                                    <div key={sIdx} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]">
                                      <span className="font-semibold text-slate-800">{sig.displayLabel} ({sig.currentValue})</span>
                                      <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                                        sig.direction === 'increases_risk' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                      }`}>
                                        {sig.direction === 'increases_risk' ? '+ Risk' : '- Mitigating'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Evidence Data Array */}
                              {sec.type === 'evidence' && Array.isArray(sec.data) && (
                                <div className="space-y-1.5 pt-1">
                                  {(sec.data as Evidence[]).map((ev, eIdx) => (
                                    <div key={eIdx} className="p-2 rounded bg-white border border-slate-200 text-[11px] space-y-0.5">
                                      <div className="font-semibold text-slate-800">{ev.claim}</div>
                                      <div className="text-slate-500 font-mono text-[10px]">{ev.sourceField}: {ev.sourceValue}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        {msg.response?.projectId && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                            <Link href={`/projects/${msg.response.projectId}`}>
                              <Button size="sm" variant="secondary" className="text-[11px] h-7 font-semibold">
                                View Project Details
                              </Button>
                            </Link>
                            <Link href="/risk-monitor">
                              <Button size="sm" variant="outline" className="text-[11px] h-7 font-semibold">
                                View Risk Monitor
                              </Button>
                            </Link>
                            {currentProject && (
                              <Link href={`/projects/${currentProject.id}`}>
                                <Button size="sm" variant="outline" className="text-[11px] h-7 font-semibold">
                                  View Project Benchmarks
                                </Button>
                              </Link>
                            )}
                            <Link href="/intervention-priority">
                              <Button size="sm" variant="outline" className="text-[11px] h-7 font-semibold">
                                View Intervention Queue
                              </Button>
                            </Link>
                          </div>
                        )}

                        {/* Disclaimer */}
                        <p className="text-[10px] text-slate-400 leading-relaxed italic border-t border-slate-100 pt-2">
                          * {msg.response?.disclaimer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Analyst Typing Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs flex items-center gap-2 text-slate-600 shadow-sm">
                  <RefreshCw className="w-4 h-4 text-primary-600 animate-spin" />
                  <span className="font-semibold">PRAGATI is evaluating predictive signals and verifying grounding evidence...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder={
                  currentProject
                    ? `Ask about ${currentProject.name}...`
                    : 'Ask about risk status, evidence grounding, or peer benchmarks...'
                }
                className="flex-1 py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />

              <Button
                type="submit"
                variant="primary"
                disabled={!inputQuery.trim() || loading}
                className="text-xs h-9 px-4 font-semibold shrink-0"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Context & Suggested Questions Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Context Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-royal flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600" />
                <span>Analyst Context Spotlight</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              {currentProject ? (
                <>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Asset</span>
                    <span className="font-bold text-royal text-sm block mt-0.5">{currentProject.name}</span>
                    <span className="text-slate-500 block text-[11px] mt-1">
                      {currentProject.ministry} ({currentProject.sector})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Physical Progress</span>
                      <span className="text-base font-bold text-royal">{currentProject.physicalProgress}%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Revised Budget</span>
                      <span className="text-base font-bold text-slate-800">{formatCurrency(currentProject.revisedCostCrore)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a specific project from the dropdown above to focus PRAGATI&apos;s analysis on individual field evidence and SHAP signals.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Clickable Prompts List */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-royal">Contextual Prompts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-xs">
              {suggested.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSendQuery(q.question)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 font-medium transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{q.question}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 shrink-0 ml-1" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function IntelligencePage() {
  return (
    <Suspense fallback={
      <div className="h-64 bg-white rounded-xl border border-slate-200 p-8 flex items-center justify-center animate-pulse">
        <span className="text-xs text-slate-400 font-semibold">Initializing PRAGATI Intelligence Analyst...</span>
      </div>
    }>
      <IntelligenceChatContent />
    </Suspense>
  );
}
