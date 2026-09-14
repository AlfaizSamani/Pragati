'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProjects, getAllRiskAssessments } from '@/lib/api/projects';
import { type Project, type RiskAssessment } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RiskIndicator } from '@/components/ui/RiskIndicator';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { MapPin, TrendingUp, CalendarDays } from 'lucide-react';

type ProjectWithRisk = Project & {
  riskScore: number;
  riskTier: RiskAssessment['riskTier'];
  dominantRisk: RiskAssessment['dominantRisk'];
};

export function ProjectShowcase() {
  const [projects, setProjects] = useState<ProjectWithRisk[]>([]);

  useEffect(() => {
    Promise.all([getProjects(), getAllRiskAssessments()]).then(([projectsData, riskData]) => {
      const selected = projectsData.slice(0, 4);
      const combined = selected.map(p => {
        const risk = riskData.find(r => r.projectId === p.id);
        return {
          ...p,
          riskScore: risk?.riskScore ?? 0,
          riskTier: risk?.riskTier ?? 'low',
          dominantRisk: risk?.dominantRisk ?? 'progress_stall',
        };
      });
      setProjects(combined);
    });
  }, []);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-base font-semibold leading-7 text-primary">Intelligence in Action</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-royal sm:text-4xl">
              Project Risk Scenarios
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-neutral-500 italic">Live scored portfolio snapshot</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/projects/${project.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                <Card className="h-full flex flex-col hover:shadow-card-hover transition-normal group border-border-default hover:border-primary-200">
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="subtle">{project.sector}</Badge>
                      <RiskIndicator tier={project.riskTier} score={project.riskScore} showLabel={false} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-royal mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    
                    <div className="flex items-center text-sm text-neutral-500 mb-6">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{project.state}</span>
                    </div>

                    <div className="mt-auto space-y-4">
                      {/* Physical Progress */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-neutral-500">Physical Progress</span>
                          <span className="font-medium text-neutral-900">{formatPercentage(project.physicalProgress)}</span>
                        </div>
                        <ProgressBar value={project.physicalProgress} colorClass="bg-primary-500" />
                      </div>

                      {/* Key Metric */}
                      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                        <div className="flex flex-col">
                          <span className="text-xs text-neutral-500">Current Cost</span>
                          <span className="text-sm font-semibold text-neutral-900">{formatCurrency(project.revisedCostCrore)}</span>
                        </div>
                        {project.dominantRisk === 'schedule_delay' ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-neutral-500">Dominant Risk</span>
                            <span className="flex items-center text-sm font-medium text-warning">
                              <CalendarDays className="w-3.5 h-3.5 mr-1" /> Schedule
                            </span>
                          </div>
                        ) : project.dominantRisk === 'cost_escalation' ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-neutral-500">Dominant Risk</span>
                            <span className="flex items-center text-sm font-medium text-danger">
                              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Cost
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
