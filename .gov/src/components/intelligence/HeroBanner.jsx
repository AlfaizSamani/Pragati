import React from 'react';
import heroIntelligenceUrl from '../../assets/hero-intelligence.png';
import DashboardHero from '../common/DashboardHero';

/**
 * Intelligence hero — matches the reference blend: photo on the right,
 * warm-white scrim dissolving left-to-right, PRAGATI AI kicker, serif
 * headline, italic quote beside the photo, and a source card top-right.
 */
export const HeroBanner = () => {
  return <DashboardHero
    title="Intelligence Console"
    subtitle="Ask. Analyze. Act."
    detail="Get evidence-grounded insights from India's infrastructure data to understand what's happening and what to do next."
    image={heroIntelligenceUrl}
    breadcrumb="Intelligence"
    quoteLines={['Better questions.', 'Stronger decisions.', 'A more resilient India.']}
  />;
};
