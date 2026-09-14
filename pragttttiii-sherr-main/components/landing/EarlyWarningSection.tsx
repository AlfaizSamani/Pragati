'use client';

import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowRight, BellRing, Target } from 'lucide-react';

export function EarlyWarningSection() {
  return (
    <section className="py-16 bg-white border-b border-border-default overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-base font-semibold leading-7 text-primary">Predictive Timing</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-royal sm:text-4xl mb-6">
              Surface Risk Before It&apos;s Unavoidable
            </p>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Standard monitoring detects delays after they occur. PRAGATI aims to identify emerging signals—like subtle physical progress stagnation combined with financial drawdowns—to surface early warnings.
            </p>
            
            <ul className="space-y-4">
              <li className="flex gap-x-3">
                <Target className="h-6 w-6 text-primary flex-none" aria-hidden="true" />
                <span className="text-neutral-700">Identify multi-variable risk patterns early.</span>
              </li>
              <li className="flex gap-x-3">
                <Target className="h-6 w-6 text-primary flex-none" aria-hidden="true" />
                <span className="text-neutral-700">Provide officials with a window of opportunity to intervene.</span>
              </li>
              <li className="flex gap-x-3">
                <Target className="h-6 w-6 text-primary flex-none" aria-hidden="true" />
                <span className="text-neutral-700">Focus attention on high-impact projects.</span>
              </li>
            </ul>
          </div>
          
          <div className="relative">
            {/* Timeline Visualization */}
            <div className="relative py-10 px-4 sm:px-8">
              {/* Vertical connecting line */}
              <div className="absolute left-1/2 top-4 bottom-4 w-0.5 -ml-px bg-neutral-200"></div>
              
              <div className="space-y-12">
                {/* Node 1: Normal */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative flex items-center justify-between"
                >
                  <div className="w-5/12 text-right pr-8">
                    <h4 className="text-sm font-semibold text-neutral-900">Normal Monitoring</h4>
                    <p className="text-xs text-neutral-500 mt-1">Project appears on track</p>
                  </div>
                  <div className="absolute left-1/2 -ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 border border-neutral-300">
                    <Activity className="h-4 w-4 text-neutral-500" />
                  </div>
                  <div className="w-5/12 pl-8"></div>
                </motion.div>

                {/* Node 2: Emerging Signal */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative flex items-center justify-between"
                >
                  <div className="w-5/12 pr-8"></div>
                  <div className="absolute left-1/2 -ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-warning-light border border-warning">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                  <div className="w-5/12 pl-8">
                    <h4 className="text-sm font-semibold text-neutral-900">Emerging Signal</h4>
                    <p className="text-xs text-neutral-500 mt-1">Progress stall detected</p>
                  </div>
                </motion.div>

                {/* Node 3: Early Warning */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative flex items-center justify-between"
                >
                  <div className="w-5/12 text-right pr-8">
                    <h4 className="text-sm font-semibold text-danger">Early Warning</h4>
                    <p className="text-xs text-neutral-500 mt-1">High risk of schedule delay</p>
                  </div>
                  <div className="absolute left-1/2 -ml-5 flex h-10 w-10 items-center justify-center rounded-full bg-danger-light border-2 border-danger z-10 shadow-sm">
                    <BellRing className="h-5 w-5 text-danger" />
                  </div>
                  <div className="w-5/12 pl-8"></div>
                </motion.div>
                
                {/* Node 4: Intervention */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative flex items-center justify-between"
                >
                  <div className="w-5/12 pr-8"></div>
                  <div className="absolute left-1/2 -ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 border border-primary">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-5/12 pl-8">
                    <h4 className="text-sm font-semibold text-primary-700">Intervention Window</h4>
                    <p className="text-xs text-neutral-500 mt-1">Official takes proactive action</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
