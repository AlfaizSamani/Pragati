'use client';

import React from 'react';
import { ArrowRight, MapPin, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import LiveRiskMapWrapper from '@/components/map/LiveRiskMapWrapper';

export default function DarkIntelligenceSection() {
  return (
    <section id="live-map-section" className="bg-slate-950 py-20 text-white overflow-hidden relative scroll-mt-24">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-bold text-cyan-400 tracking-widest uppercase">
              Interactive National Geospatial Radar
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Live National Infrastructure Risk Map
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Real-time geospatial intelligence clustering 1,773 active central sector projects by risk severity across all states and union territories. Click any node to inspect telemetry.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                href="/projects" 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-2.5 text-xs shadow-lg shadow-sky-600/25 transition-all"
              >
                Explore Projects Workspace
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link 
                href="/map" 
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/80 text-slate-300 hover:text-white font-semibold px-4 py-2.5 text-xs transition-all"
              >
                <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                Fullscreen Map
              </Link>
            </div>
          </div>
          
          {/* Minimized Interactive Map embedded inside this container */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/90 relative">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[11px] text-slate-300 font-semibold">GEOSPATIAL RISK RADAR · 1,773 ASSETS</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Low/Med</span>
              </div>
            </div>
            <LiveRiskMapWrapper height="h-[450px]" compact={true} />
          </div>

        </div>
      </div>
    </section>
  );
}
