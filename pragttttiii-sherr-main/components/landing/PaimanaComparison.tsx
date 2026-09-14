'use client';

import { motion } from 'framer-motion';

export function PaimanaComparison() {
  return (
    <section id="why-pragati" className="py-16 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary">Evolution of Intelligence</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-royal sm:text-4xl">
            From Monitoring to Prediction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* PAIMANA Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border-default bg-neutral-50 p-10 flex flex-col items-center text-center shadow-sm"
          >
            <div className="mb-6 rounded-full bg-neutral-200 px-6 py-2">
              <span className="font-bold text-neutral-600 tracking-wider">PAIMANA</span>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Records what is happening.</h3>
            <p className="text-neutral-500 leading-relaxed mb-8">
              A robust monitoring layer that tracks physical and financial progress, capturing the current state of infrastructure projects.
            </p>
            <div className="mt-auto">
              <span className="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-600">
                Monitoring
              </span>
            </div>
          </motion.div>

          {/* PRAGATI Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-primary-200 bg-primary-50/50 p-10 flex flex-col items-center text-center shadow-md relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200 rounded-full blur-3xl opacity-50"></div>
            
            <div className="mb-6 rounded-full bg-primary px-6 py-2 relative z-10">
              <span className="font-bold text-white tracking-wider">PRAGATI</span>
            </div>
            <h3 className="text-2xl font-semibold text-royal mb-4 relative z-10">Estimates what happens next.</h3>
            <p className="text-primary-700/80 leading-relaxed mb-8 relative z-10">
              A predictive decision-support layer that analyzes data patterns to forecast cost escalations, schedule delays, and progress risks.
            </p>
            <div className="mt-auto flex flex-wrap justify-center gap-2 relative z-10">
              <span className="inline-flex items-center rounded-md bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">Predict</span>
              <span className="inline-flex items-center rounded-md bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">Explain</span>
              <span className="inline-flex items-center rounded-md bg-accent-light px-3 py-1 text-sm font-medium text-accent-dark">Prioritize</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
