'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PragatiLogo from '@/components/ui/PragatiLogo';

// Dynamically import the 3D scene to avoid SSR issues with Three.js
const InfrastructureScene = dynamic(
  () => import('./InfrastructureScene'),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text and Actions */}
          <div className="max-w-2xl z-10 relative">
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
              className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight"
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
              className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed font-medium"
            >
              From data to foresight — identifying risks, enabling timely interventions, and accelerating India&apos;s progress.
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link 
                href="/projects" 
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-700 hover:shadow-sky-500/40 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                Explore PRAGATI
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <PlayCircle className="mr-2 h-5 w-5 text-sky-600" />
                See How It Works
              </Link>
            </motion.div>
            
            {/* 4 Metric Columns */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-slate-100"
            >
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">1,200<span className="text-sky-500">+</span></div>
                <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Projects Monitored</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">28</div>
                <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">States & UTs</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">12</div>
                <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Sectors</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">₹24<span className="text-sky-500">L Cr</span></div>
                <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Portfolio Value</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: 3D Infrastructure Scene */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-[500px] lg:h-[700px] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[55vw]"
          >
             <InfrastructureScene />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
