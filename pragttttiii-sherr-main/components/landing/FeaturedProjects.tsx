'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FeaturedProjectItem {
  id: number;
  projectId: string;
  name: string;
  sector: string;
  status: string;
  risk: string;
  cost: string;
  imageUrl: string;
  fallbackUrl: string;
}

const FEATURED_PROJECTS: FeaturedProjectItem[] = [
  {
    id: 1,
    projectId: 'PROJ-002',
    name: 'Mumbai-Delhi Expressway Phase 2',
    sector: 'Highways',
    status: 'On Track',
    risk: 'Low',
    cost: '₹4,200 Cr',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    projectId: 'PROJ-011',
    name: 'Central Grid Expansion Project',
    sector: 'Power',
    status: 'At Risk',
    risk: 'High',
    cost: '₹8,500 Cr',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    projectId: 'PROJ-003',
    name: 'Eastern Dedicated Freight Corridor',
    sector: 'Railways',
    status: 'Warning',
    risk: 'Medium',
    cost: '₹12,000 Cr',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1515165562839-50b252723326?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    projectId: 'PROJ-005',
    name: 'Navi Mumbai International Airport',
    sector: 'Aviation',
    status: 'On Track',
    risk: 'Low',
    cost: '₹16,700 Cr',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80'
  }
];

export default function FeaturedProjects() {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="projects" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">
              Featured Projects
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Critical Projects. Clearer Insights.
            </h2>
          </div>
          <Link href="/projects" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            View All Projects
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PROJECTS.map((project) => {
            const isFailed = failedImages[project.id];
            const activeImageSrc = isFailed ? project.fallbackUrl : project.imageUrl;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.projectId}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 flex flex-col h-full">
                  {/* High Quality Infrastructure Image Container */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={activeImageSrc}
                      alt={project.name}
                      onError={() => handleImageError(project.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-3 left-3 text-white text-xs font-bold px-2.5 py-1 bg-slate-900/65 rounded-md backdrop-blur-md border border-white/10 z-10 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      {project.sector}
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1.5 bg-white/90 rounded-full shadow-md text-slate-900">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Project Value</span>
                        <span className="font-semibold text-slate-900">{project.cost}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-100">
                        <span className="text-slate-500">Risk Assessment</span>
                        <span className={twMerge(
                          "flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full text-xs",
                          project.risk === 'Low' ? "bg-green-100 text-green-700" :
                          project.risk === 'Medium' ? "bg-orange-100 text-orange-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {project.risk === 'Low' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {project.risk} Risk
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

