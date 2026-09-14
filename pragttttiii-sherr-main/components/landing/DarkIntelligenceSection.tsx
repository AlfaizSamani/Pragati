import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function DarkIntelligenceSection() {
  return (
    <section id="live-map-section" className="bg-slate-950 py-24 text-white overflow-hidden relative scroll-mt-24">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <div className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-3">
              Explore the Intelligence
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              See India&apos;s Infrastructure Like Never Before
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md">
              An interactive view of projects, risks, and opportunities across every state and sector.
            </p>
            <Link 
              href="/map" 
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold px-7 py-3.5 text-sm shadow-lg shadow-sky-500/25 transition-all group"
            >
              <MapPin className="h-4 w-4" />
              Open Live Map
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="lg:col-span-5 relative h-[400px]">
             {/* Glowing Map Graphic */}
             <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 400 400" className="w-full h-full max-w-sm opacity-80" xmlns="http://www.w3.org/2000/svg">
                  {/* Glowing Lines */}
                  <path d="M 200 50 C 250 150, 300 200, 350 250 M 200 50 C 150 100, 100 250, 150 350 M 350 250 C 250 300, 200 350, 150 350 M 200 50 L 200 200 L 350 250 M 200 200 L 150 350 M 100 150 L 200 200" 
                    stroke="rgba(56, 189, 248, 0.2)" strokeWidth="2" fill="none" />
                  
                  {/* Connecting Nodes */}
                  <circle cx="200" cy="50" r="4" fill="#38bdf8" className="shadow-[0_0_15px_#38bdf8] animate-pulse" />
                  <circle cx="350" cy="250" r="5" fill="#fb923c" className="shadow-[0_0_15px_#fb923c] animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <circle cx="150" cy="350" r="4" fill="#38bdf8" className="shadow-[0_0_15px_#38bdf8] animate-pulse" style={{ animationDelay: '1s' }} />
                  <circle cx="200" cy="200" r="6" fill="#fb923c" className="shadow-[0_0_15px_#fb923c] animate-pulse" style={{ animationDelay: '1.5s' }} />
                  <circle cx="100" cy="150" r="3" fill="#38bdf8" className="shadow-[0_0_15px_#38bdf8] animate-pulse" style={{ animationDelay: '2s' }} />
                  <circle cx="280" cy="120" r="4" fill="#38bdf8" className="shadow-[0_0_15px_#38bdf8] animate-pulse" style={{ animationDelay: '2.5s' }} />
                  <circle cx="250" cy="300" r="4" fill="#38bdf8" className="shadow-[0_0_15px_#38bdf8] animate-pulse" style={{ animationDelay: '0.8s' }} />
                </svg>
             </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-8 justify-center border-t lg:border-t-0 lg:border-l border-slate-800 pt-8 lg:pt-0 lg:pl-8">
            <div>
              <div className="text-4xl font-light text-white mb-1">28</div>
              <div className="text-sm text-slate-500">States & UTs</div>
            </div>
            <div>
              <div className="text-4xl font-light text-white mb-1">12</div>
              <div className="text-sm text-slate-500">Infrastructure Sectors</div>
            </div>
            <div>
              <div className="text-4xl font-light text-cyan-400 mb-1">Live</div>
              <div className="text-sm text-slate-500">Risk Intelligence</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
