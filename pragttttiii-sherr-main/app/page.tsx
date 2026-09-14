import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import OpportunitySection from '@/components/landing/OpportunitySection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import MissionSection from '@/components/landing/MissionSection';
import ImpactAreasSection from '@/components/landing/ImpactAreasSection';
import DarkIntelligenceSection from '@/components/landing/DarkIntelligenceSection';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import HashScrollHandler from '@/components/landing/HashScrollHandler';
import { Footer } from '@/components/landing/Footer'; // Assuming this exists or will remain for now

export const metadata = {
  title: 'PRAGATI | Predictive Infrastructure Intelligence',
  description: 'See Infrastructure Risks Before They Become Delays',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HashScrollHandler />
      <Navbar />
      <main>
        <HeroSection />
        <OpportunitySection />
        <WorkflowSection />
        <MissionSection />
        <ImpactAreasSection />
        <DarkIntelligenceSection />
        <FeaturedProjects />
      </main>
      {/* <Footer /> */} 
    </div>
  );
}
