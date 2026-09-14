'use client';

import dynamic from 'next/dynamic';

const LiveRiskMap = dynamic(
  () => import('./LiveRiskMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[800px] w-full items-center justify-center bg-slate-950 rounded-xl border border-slate-800">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent"></div>
      </div>
    )
  }
);

interface LiveRiskMapWrapperProps {
  height?: string;
  className?: string;
  compact?: boolean;
}

export default function LiveRiskMapWrapper({ height, className, compact }: LiveRiskMapWrapperProps) {
  return <LiveRiskMap height={height} className={className} compact={compact} />;
}
