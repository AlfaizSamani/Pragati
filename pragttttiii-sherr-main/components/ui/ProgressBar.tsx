import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  colorClass?: string;
  heightClass?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  showLabel = false, 
  colorClass = "bg-sky-500", 
  heightClass = "h-2",
  className,
  ...props 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className={cn("w-full bg-slate-100/90 rounded-full overflow-hidden shadow-inner border border-slate-200/50 p-0.5", heightClass)}>
        <div 
          className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-xs", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-end">
          <span className="text-xs font-bold text-royal">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

