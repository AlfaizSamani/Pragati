'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPortfolioSummary } from '@/lib/api/portfolio';
import { type PortfolioSummary } from '@/lib/types';
import { MetricCard } from '@/components/ui/MetricCard';
import { formatLakhCrore } from '@/lib/utils';
import { FolderGit2, AlertTriangle, Target, IndianRupee } from 'lucide-react';

export function PortfolioSnapshot() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  
  useEffect(() => {
    getPortfolioSummary().then(setSummary);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-16 bg-background-subtle border-y border-border-subtle relative z-20 -mt-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-royal mb-2">Scale of Operations</h2>
          <p className="text-neutral-600">Currently analyzing central sector infrastructure projects.</p>
        </div>
        
        {/* Placeholder while loading to prevent layout shift */}
        {!summary ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants}>
              <MetricCard 
                title="Projects Monitored" 
                value={summary.totalProjects.toLocaleString()} 
                icon={<FolderGit2 className="h-5 w-5 text-primary-600" />}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard 
                title="Total Portfolio" 
                value={formatLakhCrore(summary.totalRevisedCostLakhCrore)} 
                icon={<IndianRupee className="h-5 w-5 text-success" />}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard 
                title="High / Critical Risk" 
                value={(summary.highRiskCount + summary.criticalRiskCount).toLocaleString()} 
                icon={<AlertTriangle className="h-5 w-5 text-danger" />}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard 
                title="Intervention Queue" 
                value={summary.interventionQueueSize.toLocaleString()} 
                icon={<Target className="h-5 w-5 text-royal" />}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
