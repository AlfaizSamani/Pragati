'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { DollarSign, Clock, BarChart4, Network } from 'lucide-react';

const capabilities = [
  {
    name: 'Cost Escalation Risk',
    description: 'Detects patterns indicating a high probability of budget overruns before financial exhaustion occurs.',
    icon: DollarSign,
    colorClass: 'text-danger',
    bgClass: 'bg-danger-light',
  },
  {
    name: 'Schedule Delay Risk',
    description: 'Identifies projects showing early signs of missing critical completion milestones based on historical trajectories.',
    icon: Clock,
    colorClass: 'text-warning',
    bgClass: 'bg-warning-light',
  },
  {
    name: 'Progress Stalls',
    description: 'Flags projects where physical progress has decoupled from financial expenditure or time elapsed.',
    icon: BarChart4,
    colorClass: 'text-primary',
    bgClass: 'bg-primary-100',
  },
  {
    name: 'Peer Benchmarking',
    description: 'Contextualizes project performance against similar projects in the same sector and state to validate risk signals.',
    icon: Network,
    colorClass: 'text-royal',
    bgClass: 'bg-royal-light/20',
  },
];

export function IntelligenceCapabilities() {
  return (
    <section id="intelligence" className="py-16 bg-background-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary">Explainable Intelligence</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-royal sm:text-4xl">
            More Than Just a Score
          </p>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            PRAGATI doesn&apos;t just output a risk percentage. It explains the specific type of risk, highlights the driving signals, and grounds its assessments in objective evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full p-6 hover:shadow-md transition-normal border-border-default bg-white">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${cap.bgClass}`}>
                  <cap.icon className={`h-6 w-6 ${cap.colorClass}`} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{cap.name}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{cap.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
