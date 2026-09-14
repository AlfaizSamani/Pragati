"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function IndiaMapGraphic() {
  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] flex items-center justify-center bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Background Grid Matrix */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>

      {/* SVG Canvas for Map and Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mapGradient" x1="0" y1="0" x2="800" y2="800">
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.2)" /> {/* sky-500/20 */}
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.1)" /> {/* emerald-500/10 */}
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Abstract India Map Path (simplified outline) */}
        <path 
          d="M300 200 L400 100 L500 150 L550 250 L700 300 L650 400 L550 500 L500 650 L400 750 L350 650 L250 500 L150 450 L100 300 L200 250 Z" 
          fill="url(#mapGradient)" 
          stroke="#38bdf8" 
          strokeWidth="2" 
          strokeOpacity="0.8" 
          className="drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]"
        />

        {/* Infrastructure Lines */}
        {/* Highway */}
        <path d="M400 100 L300 200 L250 500 L400 750" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="10 5" className="animate-[dash_20s_linear_infinite] opacity-60" />
        {/* Rail */}
        <path d="M400 100 L550 250 L650 400 L550 500 L400 750" stroke="#fb923c" strokeWidth="2" fill="none" strokeDasharray="15 15" className="animate-[dash_30s_linear_infinite] opacity-60" />
        {/* Power */}
        <path d="M250 500 L550 500 M300 200 L550 250" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_15s_linear_infinite] opacity-60" />

        {/* Nodes - Base */}
        <circle cx="300" cy="200" r="6" fill="#10b981" /> {/* Delhi - Green */}
        <circle cx="250" cy="500" r="6" fill="#ef4444" /> {/* Mumbai - Red */}
        <circle cx="550" cy="250" r="6" fill="#f59e0b" /> {/* Kolkata - Amber */}
        <circle cx="400" cy="750" r="6" fill="#10b981" /> {/* Kudankulam - Green */}

        {/* Nodes - Radar Ping */}
        <circle cx="300" cy="200" r="15" fill="none" stroke="#10b981" strokeWidth="2" className="animate-ping opacity-75" />
        <circle cx="250" cy="500" r="15" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping opacity-75" />
        <circle cx="550" cy="250" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-75" />
        <circle cx="400" cy="750" r="15" fill="none" stroke="#10b981" strokeWidth="2" className="animate-ping opacity-75" />
      </svg>

      {/* Floating Glassmorphic Cards Overlay */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[10%] backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/40 shadow-xl rounded-xl p-3 text-xs font-semibold flex items-center gap-3 w-48"
      >
        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 font-bold">NH</div>
        <div>
          <div className="text-slate-900 dark:text-white">Highway Corridor</div>
          <div className="text-[10px] text-green-600">On Track • Risk: Low</div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[50%] left-[5%] backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/40 shadow-xl rounded-xl p-3 text-xs font-semibold flex items-center gap-3 w-48"
      >
        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-600 font-bold">MR</div>
        <div>
          <div className="text-slate-900 dark:text-white">Metro Project</div>
          <div className="text-[10px] text-red-600">Delay Detected • Risk: High</div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[25%] right-[10%] backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/40 shadow-xl rounded-xl p-3 text-xs font-semibold flex items-center gap-3 w-48"
      >
        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 font-bold">RC</div>
        <div>
          <div className="text-slate-900 dark:text-white">Rail Corridor</div>
          <div className="text-[10px] text-amber-600">Early Warning • Risk: Med</div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[15%] right-[25%] backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/40 shadow-xl rounded-xl p-3 text-xs font-semibold flex items-center gap-3 w-48"
      >
        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 font-bold">PP</div>
        <div>
          <div className="text-slate-900 dark:text-white">Power Plant</div>
          <div className="text-[10px] text-green-600">On Track • Risk: Low</div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}} />
    </div>
  );
}
