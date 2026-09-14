/**
 * PragatiLogo — Uses the official PRAGATI brand logo image.
 *
 * Variants:
 *   - 'full'    → Large logo for hero sections and prominent placements
 *   - 'compact' → Smaller logo for navbar and sidebar
 */

import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type PragatiLogoVariant = 'compact' | 'full';

export interface PragatiLogoProps {
  variant?: PragatiLogoVariant;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PragatiLogo
// ─────────────────────────────────────────────────────────────────────────────

export default function PragatiLogo({ variant = 'full', className = '' }: PragatiLogoProps) {
  const compact = variant === 'compact';

  return (
    <Image
      src="/images/pragati-logo.jpg"
      alt="PRAGATI — प्रगति"
      width={compact ? 140 : 340}
      height={compact ? 56 : 136}
      className={`object-contain ${className}`}
      priority
    />
  );
}
