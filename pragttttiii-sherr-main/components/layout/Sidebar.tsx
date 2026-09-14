'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FolderGit2, 
  Activity, 
  AlertTriangle, 
  Target, 
  PieChart, 
  BrainCircuit,
  TrendingUp,
  Shield,
  UploadCloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAVIGATION = [
  { name: 'Projects', href: '/projects', icon: FolderGit2 },
  { name: 'Risk Monitor', href: '/risk-monitor', icon: Activity },
  { name: 'Early Warnings', href: '/early-warnings', icon: AlertTriangle },
  { name: 'Intervention Priority', href: '/intervention-priority', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'PRAGATI Intelligence', href: '/intelligence', icon: BrainCircuit },
  { name: 'Data Ingestion', href: '/ingestion', icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-white/95 backdrop-blur-md border-r border-slate-200/90 z-40 shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200/80 bg-slate-50/50">
        <Link href="/" className="flex items-center gap-2.5 outline-none group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal via-royal-light to-sky-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4 text-sky-400 stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-royal text-lg tracking-tight leading-none">PRAGATI</span>
            <span className="text-[9px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">Control Room</span>
          </div>
        </Link>

        <span className="flex h-2 w-2 relative" title="Operational Telemetry Sync Active">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-5">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
            Console Modules
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAVIGATION.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all outline-none',
                  isActive 
                    ? 'bg-sky-50/90 text-sky-900 border border-sky-200/80 shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border hover:border-slate-200/60'
                )}
              >
                {/* Illuminated Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full shadow-xs" />
                )}

                <item.icon
                  className={cn(
                    'shrink-0 w-4 h-4 transition-transform group-hover:scale-110',
                    isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Institutional Emblem Badge */}
        <div className="mt-auto pt-4 px-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span>National Control Room</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Predictive Infrastructure Intelligence Engine v2.4
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

