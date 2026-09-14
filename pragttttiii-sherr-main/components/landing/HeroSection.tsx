'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PragatiLogo from '@/components/ui/PragatiLogo';

const LiveRiskMapWrapper = dynamic(
  () => import('@/components/map/LiveRiskMapWrapper'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center bg-slate-950 rounded-2xl border border-slate-800">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent"></div>
      </div>
    )
  }
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text and Actions */}
          <div className="lg:col-span-6 z-10 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-bold text-sky-600 mb-6 tracking-[0.2em] uppercase"
            >
              India&apos;s Infrastructure Intelligence
            </motion.div>
            
            {/* Official PRAGATI Logo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <PragatiLogo variant="full" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight"
            >
              Predictive<br/>Infrastructure<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500">
                Intelligence
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl leading-relaxed font-medium"
            >
              From data to foresight — identifying risks, enabling timely interventions, and accelerating India&apos;s progress across 1,773 major projects.
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link 
                href="/projects" 
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-700 hover:shadow-sky-500/40 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                Explore Projects Workspace
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/map"
                className="inline-flex items-center justify-center rounded-full bg-white border-2 border-slate-200 px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <PlayCircle className="mr-2 h-4 w-4 text-sky-600" />
                Fullscreen Radar
              </Link>
            </motion.div>
            
            {/* 4 Metric Columns */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1,773</div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Projects Monitored</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">28</div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">States &amp; UTs</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">10</div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Central Sectors</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">₹38.7<span className="text-sky-500">L Cr</span></div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Portfolio Value</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Live Geospatial Infrastructure Risk Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative w-full rounded-2xl overflow-hidden border border-slate-300/80 shadow-2xl bg-slate-950"
          >
            {/* Radar Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800 text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[11px] font-bold tracking-wider text-slate-200">
                  NATIONAL INFRASTRUCTURE RADAR · 1,773 SITES
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Stable</span>
              </div>
            </div>

            {/* Live Leaflet Map Container */}
            <LiveRiskMapWrapper height="h-[500px]" compact={true} />

            {/* Radar Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="truncate">Pan &amp; zoom to inspect project clusters across all states</span>
              <Link href="/map" className="text-sky-400 hover:text-sky-300 font-semibold shrink-0 ml-2">
                Expand Fullscreen &rarr;
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
