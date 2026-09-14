'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getStateRiskSummaries } from '@/lib/api/portfolio';
import { type StateRiskSummary } from '@/lib/types';

export function IndiaRiskMap() {
  const [states, setStates] = useState<StateRiskSummary[]>([]);

  useEffect(() => {
    getStateRiskSummaries().then(data => {
      // Sort by high risk count to highlight problem areas
      const sorted = [...data].sort((a, b) => 
        (b.highRiskCount + b.criticalRiskCount) - (a.highRiskCount + a.criticalRiskCount)
      ).slice(0, 12); // Show top 12 states for the visualization grid
      setStates(sorted);
    });
  }, []);

  return (
    <section className="py-24 bg-white border-y border-border-default">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-base font-semibold leading-7 text-primary">Geographic Intelligence</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-royal sm:text-4xl mb-6">
              See where infrastructure risk is emerging across the portfolio.
            </p>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              PRAGATI aggregates project-level risk into state and sector-level intelligence, allowing officials to identify geographic clusters of delays and cost escalations.
            </p>
            
            <div className="flex gap-4 items-center text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">Risk Density:</span>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-neutral-100"></span> Low</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-warning-light"></span> Med</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-danger-light"></span> High</div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            {/* Stylized Abstract State Grid (since actual SVG map is too heavy) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {states.map((state, index) => {
                const totalRisk = state.highRiskCount + state.criticalRiskCount;
                let bgClass = "bg-neutral-50 border-neutral-200";
                let textClass = "text-neutral-700";
                
                if (totalRisk > 5) {
                  bgClass = "bg-danger-light border-danger-200";
                  textClass = "text-danger-700";
                } else if (totalRisk > 2) {
                  bgClass = "bg-warning-light border-warning-200";
                  textClass = "text-warning-700";
                } else if (totalRisk > 0) {
                  bgClass = "bg-primary-50 border-primary-200";
                  textClass = "text-primary-700";
                }

                return (
                  <motion.div
                    key={state.stateName}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-3 rounded-lg border ${bgClass} flex flex-col items-center justify-center text-center aspect-square shadow-sm`}
                  >
                    <span className={`text-xs font-semibold ${textClass} mb-1 line-clamp-1`}>{state.stateName}</span>
                    <span className="text-xl font-bold text-neutral-900">{totalRisk}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Risks</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
