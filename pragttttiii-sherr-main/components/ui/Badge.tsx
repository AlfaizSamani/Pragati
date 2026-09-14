import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'subtle' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        {
          'bg-sky-100 text-sky-800 border-sky-200': variant === 'default',
          'bg-emerald-100 text-emerald-800 border-emerald-200': variant === 'success',
          'bg-amber-100 text-amber-800 border-amber-200': variant === 'warning',
          'bg-red-100 text-red-800 border-red-200': variant === 'danger',
          'bg-slate-100 text-slate-800 border-slate-200': variant === 'subtle',
          'bg-transparent text-slate-700 border-slate-300': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}
