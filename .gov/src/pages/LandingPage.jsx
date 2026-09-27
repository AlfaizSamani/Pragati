import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  User,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Play,
  TrendingUp,
  Target,
  ShieldCheck,
  Users,
  Calendar,
  FileText,
  BarChart3,
  FileSearch,
  Compass,
  AlertTriangle,
  Layers,
  Landmark,
  Linkedin,
  Youtube,
  Github
} from 'lucide-react';
// Authentic State Emblem of India — static public-domain asset, shared
// across all four PRAGATI pages for brand consistency.
import ashokaEmblemUrl from '../assets/ashoka-emblem.svg';
import { api } from '../services/apiClient';

const landingHeroAsset = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`;

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Bandra-Worli Sea Link',
    location: 'Mumbai, Maharashtra',
    image: landingHeroAsset('hero-bandra-worli.png'),
  },
  {
    id: 2,
    title: 'Sardar Sarovar Dam',
    location: 'Narmada River, Gujarat',
    image: landingHeroAsset('hero-dam-panorama.png'),
  },
  {
    id: 3,
    title: 'New Delhi Infrastructure',
    location: 'New Delhi, India',
    image: landingHeroAsset('hero-delhi-sunset.png'),
  },
  {
    id: 4,
    title: 'Vande Bharat Transit',
    location: 'Inter-City Semi-High Speed Rail',
    image: landingHeroAsset('hero-vande-bharat.png'),
  }
];

const NationalEmblem = () => (
  <div className="flex flex-col items-center justify-center shrink-0 mr-1.5">
    <img
      src={ashokaEmblemUrl}
      alt="State Emblem of India"
      draggable="false"
      className="h-9 w-auto"
    />
  </div>
);

const PaimanaLogo = () => (
  <div className="flex items-center space-x-3">
    <div className="w-9 h-9 text-[#0A192F] shrink-0">
      <svg viewBox="0 0 60 60" fill="currentColor">
        <path d="M30 5 L15 25 L25 25 L25 50 L35 50 L35 25 L45 25 Z" />
        <circle cx="30" cy="12" r="4" fill="#D97706" />
      </svg>
    </div>
    <div>
      <div className="font-serif-headline font-bold text-lg text-[#0A192F] leading-tight tracking-wider">
        PAIMANA
      </div>
      <div className="text-[10px] text-slate-500 font-sans-body leading-tight">
        Integrated Project Monitoring<br />for a New India
      </div>
    </div>
  </div>
);

const IndiaOutlineSVG = () => (
  <svg className="w-20 h-24 text-slate-500/40" viewBox="0 0 100 120" fill="currentColor">
    <path d="M45,5 Q55,8 60,15 T55,30 T65,40 T75,50 T70,65 T80,75 T70,85 T60,100 T50,115 T45,100 T35,80 T25,65 T30,45 T35,30 T45,5 Z" opacity="0.3" />
    <path d="M48,12 L52,18 L58,22 L52,32 L60,42 L68,52 L62,65 L70,78 L60,88 L52,102 L46,110 L42,98 L32,80 L28,66 L34,48 L38,32 Z" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.summary(import.meta.env.VITE_REPORTING_MONTH || "2026-06")
      .then(setSummary)
      .catch((err) => console.error("Error fetching summary on landing page:", err));
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A] font-sans antialiased selection:bg-[#0F172A] selection:text-white">
      {/* Custom Font Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        .font-serif-headline {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sans-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      {}
      <header className="absolute top-0 left-0 w-full bg-transparent px-6 lg:px-14 py-3.5 flex items-center justify-between z-50">
        <div className="flex items-center space-x-3">
          <NationalEmblem />
          <a href="#/" aria-label="Go to PRAGATI home" className="flex flex-col relative">
            <span className="font-serif-headline font-bold text-2xl tracking-tight text-[#0F172A] leading-none tracking-wider relative pr-4">
              PRAGATI
              <span className="absolute right-0 top-0 w-0 h-0 border-l-[9px] border-l-[#F97316] border-b-[6px] border-b-transparent" />
            </span>
            <span className="text-[10px] font-sans-body font-medium text-slate-500 leading-tight mt-1 max-w-[210px]">
              Predictive Risk & Governance Intelligence for Infrastructure
            </span>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-9 text-[13.5px] font-sans-body font-semibold text-slate-700 whitespace-nowrap">
          <a href="#/" className="relative py-1 text-slate-900 font-bold">
            Home
            <span className="absolute left-0 bottom-0 w-full h-[2.5px] bg-[#D97706] rounded-full" />
          </a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
          <a href="#/analytics" className="hover:text-slate-900 transition-colors">Insights</a>
          <a href="#/dashboard" className="hover:text-slate-900 transition-colors">About</a>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="relative hidden lg:flex items-center">
            <div className="flex items-center space-x-2 bg-white border border-stone-200 px-3 py-1.5 rounded-md text-xs text-slate-700 w-36 shadow-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-sans-body text-slate-400">Search</span>
            </div>
            <span className="absolute right-2.5 text-[10px] text-slate-600 font-mono bg-white/45 px-1 py-0.2 rounded">
              /
            </span>
          </div>

          <button className="flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-stone-50 px-3 py-1.5 rounded-md border border-stone-200 text-slate-800 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>EN</span>
            <ChevronRight className="w-3 h-3 rotate-90 text-slate-500" />
          </button>

          <button
            onClick={() => window.location.hash = '#/signin'}
            aria-label="Sign in"
            className="p-1.5 rounded-md bg-white hover:bg-stone-50 text-slate-800 border border-stone-200 shadow-sm"
          >
            <User className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.location.hash = '#/signin'}
            className="flex items-center space-x-2 bg-[#0B192C] hover:bg-[#152744] text-white px-4 py-2 rounded-md text-xs font-semibold tracking-wide shadow-sm transition-all ml-1"
          >
            <span>Enter PRAGATI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {}
      <section className="relative w-full overflow-hidden min-h-[680px] md:min-h-[520px] lg:min-h-[680px] border-b border-stone-200/60">
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-[58%_center] filter brightness-[0.98] contrast-[1.05]"
              />
            </div>
          ))}

          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(90deg, rgba(253,251,247,0.96) 0%, rgba(253,251,247,0.88) 24%, rgba(253,251,247,0.42) 38%, rgba(253,251,247,0) 52%)',
            }}
          />
        </div>

        <div className="w-full px-6 lg:px-8 pt-28 pb-16 lg:pt-32 lg:pb-28 relative z-20 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 flex flex-col justify-center pt-2">
            <div className="inline-flex items-center bg-stone-200/80 border border-stone-300/80 px-3.5 py-1 rounded-full w-fit mb-6">
              <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase font-mono">
                A PROPOSED INTELLIGENCE LAYER FOR PAIMANA
              </span>
            </div>

            <h1 className="font-serif-headline text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.12] text-[#0A192F] tracking-tight">
              India’s infrastructure,<br />
              understood before<br />
              it becomes a crisis.
            </h1>

            <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-sans-body">
              PRAGATI brings predictive intelligence to infrastructure monitoring — turning monthly data into early warnings, deeper insights, and stronger decisions for a developed India.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => window.location.hash = '#/signin'}
                className="flex items-center space-x-2.5 bg-[#0B192C] hover:bg-[#152744] text-white px-6 py-3 rounded-md text-xs font-bold tracking-wide shadow-md transition-all"
              >
                <span>Enter PRAGATI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button className="flex items-center space-x-2 bg-white/90 hover:bg-white border border-stone-300 text-slate-800 px-5 py-3 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm transition-all">
                <div className="w-5 h-5 rounded-full bg-[#0B192C] flex items-center justify-center text-white shrink-0">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
                <span>Watch the Video</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5 h-full min-h-[220px] lg:min-h-[380px] pt-4 z-20">
            <div className="text-right ml-auto max-w-xs">
              <p className="font-serif-headline italic text-xl sm:text-2xl font-normal text-slate-900 leading-snug drop-shadow-sm">
                “Better data.<br />Smarter decisions.<br />Greater impact.”
              </p>
              <span className="block text-xs font-sans-body text-slate-700 font-semibold mt-1">
                — For a Developed India
              </span>
            </div>

            <div className="absolute right-[1%] bottom-[-4px] text-right flex flex-col items-end">
              <div className="flex items-center justify-end space-x-3 mt-3">
                <span className="text-xs font-mono font-bold text-white drop-shadow-md">
                  0{currentSlide + 1} / 0{HERO_SLIDES.length}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePrevSlide}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif-headline text-lg sm:text-xl font-bold text-white drop-shadow-md mt-2">
                {HERO_SLIDES[currentSlide].title}
              </h3>
              <p className="text-xs font-sans-body text-slate-200 drop-shadow-sm mt-0.5">
                {HERO_SLIDES[currentSlide].location}
              </p>

              <div className="flex items-center space-x-1.5 mt-3">
                {HERO_SLIDES.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-7 bg-[#D97706]' : 'w-3 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Four pillars sit directly on the hero image in the reference composition. */}
        <div className="absolute bottom-4 left-0 right-0 z-30 w-full px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-3 max-w-2xl">
            <div className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-lg bg-stone-200/80 flex items-center justify-center text-slate-800 shrink-0 border border-stone-300/60">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight font-sans-body">
                Predict<br />Risks Early
              </span>
            </div>

            <div className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-lg bg-stone-200/80 flex items-center justify-center text-slate-800 shrink-0 border border-stone-300/60">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight font-sans-body">
                Enable<br />Focused Action
              </span>
            </div>

            <div className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-lg bg-stone-200/80 flex items-center justify-center text-slate-800 shrink-0 border border-stone-300/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight font-sans-body">
                Strengthen<br />Accountability
              </span>
            </div>

            <div className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-lg bg-stone-200/80 flex items-center justify-center text-slate-800 shrink-0 border border-stone-300/60">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight font-sans-body">
                Build a More<br />Resilient India
              </span>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="bg-white border-b border-stone-200 py-6 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full lg:w-auto flex-1">
            <div className="border-r border-stone-200/80 pr-4">
              <div className="text-3xl font-extrabold text-slate-900 font-serif-headline">
                {summary ? Number(summary.total_projects || 0).toLocaleString('en-IN') : '1,773'}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 font-sans-body">
                Monitored Projects
              </div>
            </div>

            <div className="border-r border-stone-200/80 pr-4">
              <div className="text-3xl font-extrabold text-[#A8322D] font-serif-headline flex items-baseline space-x-1">
                <span>₹ {summary ? (Number(summary.total_cost_current_cr || 0) / 100000).toFixed(1) : '38.7'}</span>
                <span className="text-base font-bold text-[#A8322D]">Lakh Cr</span>
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 font-sans-body">
                Total Portfolio Value
              </div>
            </div>

            <div className="border-r border-stone-200/80 pr-4">
              <div className="text-3xl font-extrabold text-slate-900 font-serif-headline">
                {summary ? Number((summary.high_risk_count || 0) + (summary.critical_risk_count || 0)).toLocaleString('en-IN') : '562'}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 font-sans-body">
                High Priority Projects
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-[#9E2A2B] font-serif-headline">
                {summary ? Number(summary.critical_risk_count || 0).toLocaleString('en-IN') : '69'}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 font-sans-body leading-tight">
                Critical Risk Signals<br />
                <span className="text-[10px] text-slate-400 font-normal">in latest update</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white border border-stone-200 px-4 py-2.5 rounded-lg w-full sm:w-auto justify-between sm:justify-start shrink-0">
            <div className="flex items-center space-x-2 text-xs text-slate-600 font-sans-body">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Latest Update: <strong className="text-slate-900 font-bold">{summary?.month || 'June 2026'}</strong></span>
            </div>
            <a href="#/dashboard" className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline flex items-center space-x-1 ml-4">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {}
      <section id="how-it-works" className="bg-white border-b border-stone-200/60 py-16 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-6 h-[2.5px] bg-[#D97706] rounded-full inline-block" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 font-mono">
                  FROM DATA TO A STRONGER INDIA
                </span>
              </div>

              <h2 className="font-serif-headline text-4xl sm:text-5xl font-bold text-[#0A192F] tracking-tight leading-tight">
                How <span className="relative inline-block font-extrabold text-[#0A192F]">PRAGATI</span> Works
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-sans-body font-normal mt-2">
                A continuous cycle from monitoring to action.
              </p>
            </div>

            <div>
              <a
                href="#explore-process"
                className="inline-flex items-center space-x-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group"
              >
                <span className="border-b-2 border-[#2563EB] group-hover:border-[#1D4ED8] pb-0.5">
                  Explore the Process
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center shrink-0 text-[#0A192F] border border-stone-200/60 shadow-xs">
                <FileText className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="font-sans-body pr-2">
                <div className="font-extrabold text-[#0A192F] text-sm tracking-tight">
                  1. Monitor
                </div>
                <div className="text-xs text-slate-500 font-normal leading-snug mt-1 max-w-[130px]">
                  Ingest monthly reports and validate data
                </div>
              </div>
              <div className="hidden lg:block text-slate-300 ml-auto pr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center shrink-0 text-[#0A192F] border border-stone-200/60 shadow-xs">
                <BarChart3 className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="font-sans-body pr-2">
                <div className="font-extrabold text-[#0A192F] text-sm tracking-tight">
                  2. Predict
                </div>
                <div className="text-xs text-slate-500 font-normal leading-snug mt-1 max-w-[130px]">
                  Assess risk using AI/ML models
                </div>
              </div>
              <div className="hidden lg:block text-slate-300 ml-auto pr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center shrink-0 text-[#0A192F] border border-stone-200/60 shadow-xs">
                <FileSearch className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="font-sans-body pr-2">
                <div className="font-extrabold text-[#0A192F] text-sm tracking-tight">
                  3. Explain
                </div>
                <div className="text-xs text-slate-500 font-normal leading-snug mt-1 max-w-[130px]">
                  Reveal key drivers with evidence
                </div>
              </div>
              <div className="hidden lg:block text-slate-300 ml-auto pr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center shrink-0 text-[#0A192F] border border-stone-200/60 shadow-xs">
                <Users className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="font-sans-body">
                <div className="font-extrabold text-[#0A192F] text-sm tracking-tight">
                  4. Act
                </div>
                <div className="text-xs text-slate-500 font-normal leading-snug mt-1 max-w-[130px]">
                  Enable informed decisions and follow-up
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="capabilities" className="bg-[#FAF8F5] border-b border-stone-200/60 py-16 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="w-6 h-[2.5px] bg-[#D97706] rounded-full mb-2" />
              <h2 className="font-serif-headline text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
                Key Capabilities
              </h2>
              <p className="text-slate-600 text-sm font-sans-body font-normal mt-1">
                Intelligence for every level of decision-making.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                aria-label="Previous capability"
                className="w-9 h-9 rounded-full border border-stone-300 flex items-center justify-center text-slate-700 bg-white hover:bg-stone-100 transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                aria-label="Next capability"
                className="w-9 h-9 rounded-full border border-stone-300 flex items-center justify-center text-slate-700 bg-white hover:bg-stone-100 transition-colors shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-44 w-full bg-[#EBF2FA] relative overflow-hidden flex items-center justify-center border-b border-stone-100">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EBF2FA] via-[#DCE8F8] to-[#F3F7FC] opacity-90" />
                <svg className="w-3/4 h-3/4 text-[#3B82F6]/25 relative z-10" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M40,60 Q60,30 100,40 T160,80 T140,140 T80,160 T30,110 Z" fill="#2563EB" fillOpacity="0.08" />
                  <path d="M70,80 Q90,60 120,70 T150,110 T110,140 Z" fill="#2563EB" fillOpacity="0.12" />
                  <circle cx="100" cy="90" r="3" fill="#1D4ED8" />
                  <circle cx="75" cy="110" r="2.5" fill="#1D4ED8" />
                  <circle cx="125" cy="105" r="2.5" fill="#1D4ED8" />
                  <circle cx="90" cy="130" r="2" fill="#1D4ED8" />
                  <line x1="100" y1="90" x2="75" y2="110" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="2,2" />
                  <line x1="100" y1="90" x2="125" y2="105" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="2,2" />
                  <line x1="75" y1="110" x2="90" y2="130" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="2,2" />
                </svg>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#0A192F] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-headline font-bold text-[#0A192F] text-base leading-snug">
                      National Perspective
                    </h3>
                    <p className="text-xs text-slate-600 font-sans-body font-normal leading-relaxed mt-1.5">
                      Unified view of infrastructure projects across India with state, sector and ministry intelligence.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-2">
                  <a href="#/dashboard" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0A192F] border-b border-[#0A192F] pb-0.5 hover:text-[#D97706] hover:border-[#D97706] transition-colors">
                    <span>Explore Overview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-44 w-full bg-stone-100 relative overflow-hidden border-b border-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop" 
                  alt="Railway infrastructure" 
                  className="w-full h-full object-cover object-center filter brightness-[0.98]"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#0A192F] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-headline font-bold text-[#0A192F] text-base leading-snug">
                      Early Warning System
                    </h3>
                    <p className="text-xs text-slate-600 font-sans-body font-normal leading-relaxed mt-1.5">
                      Detect emerging risks before they become critical through predictive analytics.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-2">
                  <a href="#/early-warnings" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0A192F] border-b border-[#0A192F] pb-0.5 hover:text-[#D97706] hover:border-[#D97706] transition-colors">
                    <span>Explore Early Warnings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-44 w-full bg-stone-100 relative overflow-hidden border-b border-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1577086664693-894d8405334a?q=80&w=800&auto=format&fit=crop" 
                  alt="Vande Bharat Semi High Speed Rail" 
                  className="w-full h-full object-cover object-center filter brightness-[0.98]"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#0A192F] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-headline font-bold text-[#0A192F] text-base leading-snug">
                      Project Intelligence
                    </h3>
                    <p className="text-xs text-slate-600 font-sans-body font-normal leading-relaxed mt-1.5">
                      Deep-dive into project risk factors with evidence-based insights and explanations.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-2">
                  <a href="#/watchlist" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0A192F] border-b border-[#0A192F] pb-0.5 hover:text-[#D97706] hover:border-[#D97706] transition-colors">
                    <span>Explore Watchlist & Projects</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-44 w-full bg-stone-100 relative overflow-hidden border-b border-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop" 
                  alt="Dam and Hydroelectric Infrastructure" 
                  className="w-full h-full object-cover object-center filter brightness-[0.98]"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#0A192F] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-headline font-bold text-[#0A192F] text-base leading-snug">
                      Data-Driven Governance
                    </h3>
                    <p className="text-xs text-slate-600 font-sans-body font-normal leading-relaxed mt-1.5">
                      Enable transparent, accountable and informed decision-making at all levels.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-2">
                  <a href="#/analytics" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0A192F] border-b border-[#0A192F] pb-0.5 hover:text-[#D97706] hover:border-[#D97706] transition-colors">
                    <span>Explore Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="relative w-full overflow-hidden border-b border-stone-200/80 bg-[#EFE9DF] py-14 px-6 lg:px-14">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <img 
            src="/assets/pragati-india-gate-mission.jpg" 
            alt="India Gate Sunset" 
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#EFE9DF]/90 via-transparent via-50% to-[#EFE9DF]/90" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[190px]">
          <div className="lg:col-span-5 flex flex-col justify-center border-l-2 border-slate-400/50 pl-6 py-2">
            <blockquote className="font-serif-headline text-lg sm:text-xl lg:text-[22px] italic text-[#0A192F] leading-[1.35] font-medium max-w-md">
              “Infrastructure is the foundation of opportunity. With better data and smarter intelligence, we can build a stronger, more equitable India.”
            </blockquote>
            <p className="font-sans-body font-semibold text-xs text-slate-700 mt-3.5 tracking-wide">
              — Viksit Bharat 2047
            </p>
          </div>

          <div className="hidden lg:block lg:col-span-2 h-full" />

          <div className="lg:col-span-5 grid grid-cols-3 gap-4 sm:gap-6 items-center pt-4 lg:pt-0">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 mb-3 flex items-center justify-center text-[#0A192F]">
                <Users className="w-8 h-8 stroke-[1.8]" />
              </div>
              <div className="font-sans-body">
                <div className="font-extrabold text-[#0A192F] text-base leading-tight">
                  People
                </div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-1">
                  Stronger Communities
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 mb-3 flex items-center justify-center text-[#0A192F]">
                <BarChart3 className="w-8 h-8 stroke-[1.8]" />
              </div>
              <div className="font-sans-body">
                <div className="font-extrabold text-[#0A192F] text-base leading-tight">
                  Progress
                </div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-1">
                  Inclusive Growth
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 mb-3 flex items-center justify-center text-[#0A192F]">
                <ShieldCheck className="w-8 h-8 stroke-[1.8]" />
              </div>
              <div className="font-sans-body">
                <div className="font-extrabold text-[#0A192F] text-base leading-tight">
                  Possibilities
                </div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-1">
                  A Developed India
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="bg-[#FAF8F5] border-b border-stone-200/80 py-12 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="w-8 h-[2.5px] bg-[#D97706] rounded-full mb-2" />
            <h2 className="font-serif-headline text-3xl font-bold text-[#0A192F] tracking-tight">
              Our Foundation
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-sans-body mt-1">
              Built on trusted data and national priorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-stone-200/90">
            {/* Foundation Item 1: PAIMANA */}
            <div className="flex items-center space-x-3 pr-4">
              <PaimanaLogo />
            </div>

            {/* Foundation Item 2: MoSPI */}
            <div className="pt-6 md:pt-0 md:pl-8 flex items-center space-x-3.5 pr-4">
              <NationalEmblem />
              <div className="font-sans-body">
                <div className="text-xs font-bold text-[#0A192F]">
                  Government of India
                </div>
                <div className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Ministry of Statistics & Programme Implementation<br />(MoSPI)
                </div>
              </div>
            </div>

            {/* Foundation Item 3: Viksit Bharat */}
            <div className="pt-6 md:pt-0 md:pl-8 flex items-center space-x-3.5 pr-4">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-sans-body text-slate-500 font-medium mb-1">Aligned with</span>
                <div className="w-10 h-10 rounded-md bg-stone-200/70 flex items-center justify-center text-[#0A192F]">
                  <Landmark className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>
              <div className="font-sans-body">
                <div className="text-xs font-extrabold text-[#0A192F] leading-tight">
                  Aligned with<br />Viksit Bharat
                </div>
              </div>
            </div>

            {/* Foundation Item 4: Quote */}
            <div className="pt-6 md:pt-0 md:pl-8">
              <blockquote className="font-serif-headline italic text-xs sm:text-sm text-slate-700 leading-relaxed">
                “Data-driven governance for a stronger, more prosperous India.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {}
      <footer className="bg-[#0A192F] text-white pt-14 pb-8 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: Brand Info */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <div className="font-serif-headline font-bold text-3xl tracking-tight text-white flex items-baseline tracking-wider">
                  <span className="relative pr-4">PRAGATI<span className="absolute right-0 top-1 w-0 h-0 border-l-[10px] border-l-[#F97316] border-b-[7px] border-b-transparent" /></span>
                </div>
                <p className="text-xs text-slate-400 font-sans-body leading-relaxed mt-2.5 max-w-xs">
                  Predictive Risk & Governance Intelligence for Infrastructure
                </p>
              </div>

              <div className="w-8 h-[2px] bg-[#D97706] rounded-full mt-6" />
            </div>

            {/* Col 2: Quick Links */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-sans-body">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-sans-body">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
                <li><a href="#/analytics" className="hover:text-white transition-colors">Insights</a></li>
                <li><a href="#/dashboard" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-sans-body">
                Resources
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-sans-body">
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#methodology" className="hover:text-white transition-colors">Methodology</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Col 4: Connect & Socials */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-sans-body">
                  Connect
                </h4>
                <div className="flex items-center space-x-3 mb-6">
                  <a href="#linkedin" className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#youtube" className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href="#github" className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono">
                  <span>#PRAGATI</span>
                  <span>#ViksitBharat</span>
                  <span>#DataForDevelopment</span>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <IndiaOutlineSVG />
                <p className="font-serif-headline italic text-xs text-slate-300 leading-relaxed border-l border-[#D97706]/60 pl-3">
                  A more resilient, prosperous and inclusive India through intelligent infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-sans-body gap-4">
            <div>
              © 2026 PRAGATI. A proposed intelligence layer for PAIMANA.
            </div>

            <div className="flex items-center space-x-4 text-[11px]">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
              <span className="text-slate-700">|</span>
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <span className="text-slate-700">|</span>
              <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
              <span className="text-slate-700">|</span>
              <button className="flex items-center space-x-1 hover:text-white transition-colors">
                <span>English</span>
                <ChevronRight className="w-3 h-3 rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}