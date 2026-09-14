import React from 'react';
import { cn } from '@/lib/utils';
import { RiskTier } from '@/lib/types';
import { RISK_TIER_CONFIG } from '@/lib/constants';

export interface RiskIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  tier: RiskTier;
  showLabel?: boolean;
}

export function RiskIndicator({ score, tier, showLabel = true, className, ...props }: RiskIndicatorProps) {
  const config = RISK_TIER_CONFIG[tier] || RISK_TIER_CONFIG['medium'];
  
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border-4"
           style={{ 
             borderColor: config.borderColor,
             backgroundColor: config.bgColor,
             color: config.textColor
           }}>
        {score}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold" style={{ color: config.textColor }}>
            {config.label}
          </span>
          <span className="text-xs text-slate-500">Risk Score (1-100)</span>
        </div>
      )}
    </div>
  );
}
