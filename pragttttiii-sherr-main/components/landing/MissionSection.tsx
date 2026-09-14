import React from 'react';
import { Target } from 'lucide-react';

export default function MissionSection() {
  return (
    <section id="about" className="relative py-32 overflow-hidden bg-slate-900 scroll-mt-24">
      {/* Background Image / Gradient Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-4">
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Monitor Today <br/> for a Better Tomorrow
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Empowering officials with predictive intelligence to build infrastructure that is on time, within cost, and built for a stronger India.
            </p>
          </div>
          
          <div className="flex justify-start lg:justify-end">
            {/* Badge Card Overlay */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-5 max-w-sm">
              <div className="p-4 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full text-white shadow-lg">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-snug">Better Projects</div>
                <div className="text-white font-bold text-lg leading-snug">Stronger States</div>
                <div className="text-cyan-300 font-bold text-lg leading-snug">A Developed India</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
