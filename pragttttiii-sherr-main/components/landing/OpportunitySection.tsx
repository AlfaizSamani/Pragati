'use client';

import React, { useEffect, useRef } from 'react';
import { Search, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { gsap } from 'gsap';

export default function OpportunitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardsRef = useRef<HTMLDivElement>(null);
  const rightFeaturesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = leftCardsRef.current?.children;
    const features = rightFeaturesRef.current?.children;

    if (!section || !cards || !features) return;

    // Timeline for scroll animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'center center',
        toggleActions: 'play none none reverse',
      }
    });

    // Animate cards on the left
    tl.fromTo(cards[0], 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )
    .fromTo(cards[1], 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    // Animate features on the right
    tl.fromTo(features,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

  }, []);

  return (
    <section id="why-pragati" ref={sectionRef} className="py-24 bg-white border-t border-slate-100 relative overflow-hidden scroll-mt-24">
      {/* Decorative subtle background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="text-xs font-bold text-sky-600 tracking-[0.2em] uppercase mb-4">
            Evolution of Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            From Monitoring to Prediction
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            PAIMANA records what is happening. PRAGATI estimates what is likely to happen next — so India can act early, not late.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Side-by-side Visual Layout */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 min-h-[450px] flex items-center justify-center p-8 group">
             {/* Background glow effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-slate-100/40 backdrop-blur-3xl z-0" />
             
             <div ref={leftCardsRef} className="relative z-10 w-full flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* PAIMANA Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 w-full max-w-[280px] transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6">PAIMANA</div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-500 shrink-0">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Today</div>
                      <div className="text-xl font-bold text-slate-900 leading-tight">We See<br/>Progress</div>
                    </div>
                  </div>
                </div>

                {/* PRAGATI Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-sky-900/10 border-2 border-sky-100 w-full max-w-[300px] transform sm:translate-y-8 transition-transform duration-500 group-hover:translate-y-4 relative">
                  <div className="absolute -top-4 -right-4 h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-bold text-sky-500 tracking-widest uppercase mb-6">PRAGATI</div>
                  <div className="flex items-start gap-4 mb-4">
                     <div className="p-3 bg-sky-100 rounded-xl text-sky-600 shrink-0">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-1">Tomorrow</div>
                      <div className="text-xl font-bold text-slate-900 leading-tight">We Prevent<br/>Delays</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Right: Feature Selection Sidebar */}
          <div ref={rightFeaturesRef} className="lg:col-span-5 space-y-4">
            {[
              { icon: Search, title: "Detect Emerging Risks", desc: "Identify patterns indicating a high probability of overruns.", active: true },
              { icon: TrendingUp, title: "Explain Evidence", desc: "Surface the verified facts driving the risk score.", active: false },
              { icon: AlertTriangle, title: "Prioritize Intervention", desc: "Rank projects by risk, impact, and persistence.", active: false },
              { icon: Zap, title: "Enable Human Decisions", desc: "Empower officials with AI-assisted insights.", active: false },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className={twMerge(
                  "p-6 rounded-2xl border flex gap-5 items-start transition-all duration-300",
                  feature.active 
                    ? "bg-white border-sky-200 shadow-xl shadow-sky-100/50 ring-1 ring-sky-100 transform scale-[1.02]" 
                    : "bg-transparent border-slate-100 hover:bg-slate-50 hover:border-slate-200 opacity-70 hover:opacity-100"
                )}
              >
                <div className={twMerge(
                  "p-3 rounded-xl shrink-0 transition-colors duration-300",
                  feature.active ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "bg-slate-100 text-slate-500"
                )}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={twMerge(
                    "font-bold text-lg mb-1 transition-colors duration-300",
                    feature.active ? "text-slate-900" : "text-slate-700"
                  )}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
