import React from 'react';
import type { Metadata } from 'next';
import { LandingProvider } from '@/context/LandingContext';
import { PublicHeader } from '@/components/landing/page01/PublicHeader';
import { HeroSection } from '@/components/landing/page01/HeroSection';
import { PortfolioSnapshot } from '@/components/landing/page01/PortfolioSnapshot';
import { HowPragatiWorks } from '@/components/landing/page01/HowPragatiWorks';
import { KeyCapabilities } from '@/components/landing/page01/KeyCapabilities';
import { NationalMissionSection } from '@/components/landing/page01/NationalMissionSection';
import { InstitutionalFoundation } from '@/components/landing/page01/InstitutionalFoundation';
import { PublicFooter } from '@/components/landing/page01/PublicFooter';
import { SearchOverlay } from '@/components/landing/page01/SearchOverlay';
import { VideoOverviewModal } from '@/components/landing/page01/VideoOverviewModal';

export const metadata: Metadata = {
  title: 'PRAGATI — National Infrastructure Intelligence',
  description:
    'India’s infrastructure, understood before it becomes a crisis. PRAGATI brings predictive intelligence to infrastructure monitoring — turning monthly project data into early warnings, deeper insights, and stronger decisions.',
  openGraph: {
    title: 'PRAGATI — National Infrastructure Intelligence',
    description:
      'Predictive Risk & Governance Intelligence for Infrastructure · A proposed intelligence layer for PAIMANA',
    images: ['/images/hero-sealink.png'],
  },
};

export default function LandingPage() {
  return (
    <LandingProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
        {/* 01 Global / Public Header */}
        <PublicHeader />

        <main id="main-content" className="flex-1 flex flex-col">
          {/* 02 Hero & 03 Hero Value Pillars */}
          <HeroSection />

          {/* 04 Portfolio Snapshot / Trust Metrics */}
          <PortfolioSnapshot />

          {/* 05 How PRAGATI Works */}
          <HowPragatiWorks />

          {/* 06 Key Capabilities */}
          <KeyCapabilities />

          {/* 07 National Mission / Viksit Bharat Section */}
          <NationalMissionSection />

          {/* 08 Institutional Foundation / Ecosystem */}
          <InstitutionalFoundation />
        </main>

        {/* 09 Institutional Footer */}
        <PublicFooter />

        {/* Interactive Overlays */}
        <SearchOverlay />
        <VideoOverviewModal />
      </div>
    </LandingProvider>
  );
}
