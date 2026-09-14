'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Target, AlertCircle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function InterventionPriority() {
  return (
    <section id="impact" className="py-16 bg-background-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary">Targeted Action</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-royal sm:text-4xl">
            Intelligent Intervention Prioritization
          </p>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            PRAGATI helps officials focus attention where intervention may matter most. It does not replace human judgement; it surfaces the projects demanding immediate review.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl font-bold text-royal bg-white px-6 py-4 rounded-full shadow-sm border border-border-default"
          >
            <span className="text-danger">Risk</span>
            <X className="w-4 h-4 text-neutral-400" />
            <span className="text-warning">Impact</span>
            <X className="w-4 h-4 text-neutral-400" />
            <span className="text-primary">Persistence</span>
            <X className="w-4 h-4 text-neutral-400" />
            <span className="text-royal">Evidence</span>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-0 overflow-hidden border-border-default shadow-md">
              <div className="bg-royal p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Top Priority Intervention Queue</span>
                </div>
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-md">Live Queue</span>
              </div>
              <div className="p-0">
                <table className="min-w-full divide-y divide-border-default">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-subtle">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">Mumbai-Ahmedabad HSR</td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        <div className="flex items-center gap-1 text-danger">
                          <AlertCircle className="w-4 h-4" /> Cost + Schedule Critical
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-800">Review</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">Delhi-Meerut RRTS</td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        <div className="flex items-center gap-1 text-warning">
                          <ShieldAlert className="w-4 h-4" /> Persistent Progress Stall
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-800">Review</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-neutral-50 p-4 border-t border-border-default text-xs text-neutral-500 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <p>Decision-support system. Final intervention decisions remain with authorized officials after reviewing the provided evidence.</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
