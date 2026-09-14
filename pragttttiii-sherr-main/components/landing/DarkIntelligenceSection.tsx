'use client';

import React from 'react';
import { ArrowRight, BrainCircuit, ShieldAlert, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DarkIntelligenceSection() {
  return (
    <section id="ai-intelligence-section" className="bg-slate-950 py-20 text-white overflow-hidden relative scroll-mt-24">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-xs font-semibold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Decision Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              AI-Powered Surveillance &amp; Early Warning Diagnostics
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              PRAGATI fuses machine-learned early delay signals with official MoSPI Flash Report records to diagnose schedule slips, cost escalations, and progress stalls months before they manifest as critical defaults.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Multi-Modal Attribution:</strong> SHAP-grounded risk drivers decompose exactly which factors drive timeline slips.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Peer Benchmarking:</strong> Contextual progress percentiles comparing peers within the same ministry and cost band.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero-Hallucination Grounding:</strong> Every copilot answer references verified dataset fields with strict provenance.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link 
                href="/intelligence" 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-2.5 text-xs shadow-lg shadow-sky-600/25 transition-all"
              >
                <BrainCircuit className="h-4 w-4" />
                Launch Intelligence Copilot
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link 
                href="/early-warnings" 
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/80 text-slate-300 hover:text-white font-semibold px-4 py-2.5 text-xs transition-all"
              >
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                Inspect 2,452 Early Warnings
              </Link>
            </div>
          </div>
          
          {/* Interactive Copilot Preview Card */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/90 relative">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[11px] text-slate-300 font-semibold">PRAGATI COPILOT · VERIFIED EVIDENCE ENGINE</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
                CONFIDENCE 94.8%
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">Analyst Query</span>
                <p className="text-slate-200 font-medium">
                  &quot;What is driving the risk profile of the Mumbai-Ahmedabad High Speed Rail project?&quot;
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">Diagnostic Synthesis</span>
                  <span className="text-[10px] font-mono text-emerald-400">Grounded in 2026-06 Flash Report</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  MAHSR (ID: 705728) is assessed at <span className="text-emerald-400 font-semibold">Low Risk (94.9/100 Velocity Score)</span> with 60.9% physical progress achieved. Primary variance is expenditure acceleration against original ₹1,08,000 Cr outlay with active civil contracts in Maharashtra and Gujarat.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-slate-500 block">Progress</span>
                    <span className="text-slate-200 font-bold">60.9%</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-slate-500 block">Current Outlay</span>
                    <span className="text-slate-200 font-bold">₹1,08,000 Cr</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-slate-500 block">Driver</span>
                    <span className="text-cyan-400 font-bold">Schedule-On-Track</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Provenance: MoSPI Panel Dataset (13-month time series)</span>
                <Link href="/intelligence?project=705728" className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
                  Ask Further &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
