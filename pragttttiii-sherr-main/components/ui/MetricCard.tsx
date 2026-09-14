import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './Card';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number | string;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  valueClassName?: string;
}

export function MetricCard({ title, value, icon, trend, className, valueClassName, ...props }: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-200", className)} {...props}>
      {/* Subtle top light highlight bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          {icon && <div className="p-2 rounded-lg bg-slate-100/80 text-slate-500 group-hover:text-primary-600 group-hover:bg-sky-50 transition-colors">{icon}</div>}
        </div>
        <div className="mt-3">
          <h4 className={cn("text-2xl sm:text-3xl font-bold text-royal tracking-tight", valueClassName)}>{value}</h4>
          {trend && (
            <div className="flex items-center mt-1.5 text-xs">
              <span
                className={cn(
                  "font-bold mr-1.5 px-1.5 py-0.5 rounded border text-[11px]",
                  trend.direction === 'up' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                  trend.direction === 'down' ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-100 text-slate-700 border-slate-200"
                )}
              >
                {trend.direction === 'up' ? '↑ ' : trend.direction === 'down' ? '↓ ' : ''}
                {trend.value}
              </span>
              <span className="text-slate-500 font-medium">{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

