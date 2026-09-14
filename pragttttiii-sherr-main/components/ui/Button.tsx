import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
        {
          'bg-gradient-to-r from-royal via-royal-light to-sky-700 text-white shadow-xs hover:shadow-md hover:brightness-110 border border-sky-600/30': variant === 'primary',
          'bg-slate-100/90 text-slate-800 border border-slate-200/90 hover:bg-slate-200/90 hover:border-slate-300 shadow-2xs': variant === 'secondary',
          'border border-slate-300/90 bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs': variant === 'outline',
          'bg-transparent text-slate-700 hover:bg-slate-100/80': variant === 'ghost',
          'bg-red-700 text-white hover:bg-red-800 border border-red-800 shadow-xs': variant === 'danger',
          'px-3 py-1.5 text-xs rounded-md': size === 'sm',
          'px-4 py-2 text-xs': size === 'md',
          'px-5 py-2.5 text-sm': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}

