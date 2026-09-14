import Navbar from '@/components/layout/Navbar';
import LiveRiskMapWrapper from '@/components/map/LiveRiskMapWrapper';

export const metadata = {
  title: 'Live Risk Map | PRAGATI',
  description: 'Interactive map of infrastructure project risks across India.',
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6 lg:px-10 max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">National Infrastructure Risk Map</h1>
          <p className="text-slate-600 mt-2">Geospatial overview of central projects, clustered by risk severity.</p>
        </div>
        
        <LiveRiskMapWrapper />
      </main>
    </div>
  );
}
