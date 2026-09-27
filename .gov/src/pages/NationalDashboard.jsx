import React, { useState, useEffect, useRef } from 'react';
import {
  Globe2,
  MapPin,
  PieChart,
  Building2,
  Layers,
  Search,
  Bell,
  Globe,
  ChevronDown,
  ArrowRight,
  FileText,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  IndianRupee,
  BarChart3,
  Lightbulb,
  Plus,
  Download
} from 'lucide-react';
import IndiaHeatmap from '../components/IndiaHeatmap';
// Authentic State Emblem of India (Lion Capital of Ashoka) — a static,
// public-domain government asset loaded verbatim from disk. The artwork
// itself is never regenerated, redrawn or restyled.
import ashokaEmblemUrl from '../assets/ashoka-emblem.svg';
// Local photo assets (cropped from the user's supplied composite image).
import heroMountainsUrl from '../assets/hero-mountains.jpg';
import indiaGateUrl from '../assets/india-gate.jpg';
import infraHighwayUrl from '../assets/infra-highway.jpg';
// Central mock data layer — every visible value renders from here.
import {
  headerNavTabs, currentUser, notifications, userMenu,
  hero, methodology, kpis, riskTiers, riskDonut, sectors, changes, keyInsight,
  topStates, allStates, warnings, projects, levelTone,
  ministries, agencies, sectorDetail, intelligence, dataUpdate,
  footerLinks, footerTaglines,
} from '../data/nationalData';
import { api } from '../services/apiClient';
import { LANGUAGE_OPTIONS, useLanguage } from '../context/LanguageContext';

/* =====================================================================
   Shared download helpers (real files, generated in-browser)
   ===================================================================== */
function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function toCsv(rows) {
  return rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

/* =====================================================================
   Brand assets
   ===================================================================== */
// Renders the authentic State Emblem of India asset at its original
// proportions (height fixed, width auto — never stretched). The footer
// variant only recolors the artwork via a CSS filter; the asset itself
// is untouched.
const NationalEmblem = ({ className = "w-7 h-9", isFooter = false }) => (
  <div className={`flex items-center justify-center shrink-0 select-none ${className}`}>
    <img
      src={ashokaEmblemUrl}
      alt="State Emblem of India"
      draggable="false"
      className={`h-full w-auto max-w-none ${isFooter ? 'national-emblem-white' : ''}`}
    />
  </div>
);

const PragatiLogo = ({ isFooter = false }) => (
  <div className="relative inline-flex items-center select-none font-serif tracking-wider font-bold h-full">
    <span className={`text-[18px] md:text-[22px] uppercase ${isFooter ? 'text-white' : 'text-[#0F172A]'}`}>
      PRAGATI
    </span>
    <svg
      className="absolute top-0.5 -left-1 w-[105%] h-[120%] pointer-events-none"
      viewBox="0 0 140 45"
      fill="none"
    >
      <path
        d="M 18 34 L 105 8"
        stroke="#F97316"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon points="101,4 112,6 106,14" fill="#F97316" />
    </svg>
  </div>
);

/* =====================================================================
   Generic detail panel — every modal in the dashboard uses this shape:
   { title, intro?, rows?, table?, items? } — all data-driven.
   ===================================================================== */
const DetailPanel = ({ panel, onClose }) => {
  if (!panel) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#0F172A]/25 p-4" role="dialog" aria-modal="true" aria-label={panel.title}>
      <div className={`w-full ${panel.table ? 'max-w-2xl' : 'max-w-sm'} rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-2xl max-h-[82vh] overflow-y-auto`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">Live mock response</p>
            <h2 className="mt-1 font-serif text-lg font-bold text-[#0F172A]">{panel.title}</h2>
          </div>
          <button className="text-xl leading-none text-[#64748B] hover:text-[#0F172A]" onClick={onClose} aria-label="Close panel" data-no-feedback="true">×</button>
        </div>

        {panel.intro && <p className="mt-3 text-sm leading-relaxed text-[#475569]">{panel.intro}</p>}

        {panel.rows && (
          <div className="mt-4 space-y-2">
            {panel.rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md bg-[#F8FAFC] px-3 py-2 text-xs">
                <span className="font-medium text-[#334155]">{label}</span>
                <span className="font-bold text-[#0F172A]">{value}</span>
              </div>
            ))}
          </div>
        )}

        {panel.items && (
          <div className="mt-4 space-y-2">
            {panel.items.map(item => (
              <div key={item} className="rounded-md bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#334155]">{item}</div>
            ))}
          </div>
        )}

        {panel.table && (
          <div className="mt-4 overflow-x-auto rounded-md border border-[#E2E8F0]">
            <table className="w-full text-left text-[11.5px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
                  {panel.table.head.map(h => <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {panel.table.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {row.map((cell, j) => <td key={j} className={`px-3 py-2 ${j === 0 ? 'font-medium text-[#0F172A]' : 'text-[#334155]'}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {panel.footerNote && <p className="mt-3 text-[11px] text-[#64748B]">{panel.footerNote}</p>}

        <button className="mt-5 w-full rounded-md bg-[#0F172A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1E3A5F]" onClick={onClose} data-no-feedback="true">Done</button>
      </div>
    </div>
  );
};

/* =====================================================================
   Header — working tabs, live project search, language / notification /
   user dropdowns. All content from the data layer.
   ===================================================================== */
const Header = ({ activeTab, onTab, lang, onLang, onOpenProject, onToast, onGo, liveProjects, t }) => {
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState(null); // 'lang' | 'notif' | 'user' | null
  const [notifList, setNotifList] = useState(notifications);
  const searchRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const projectSource = (liveProjects && liveProjects.length > 0) ? liveProjects : projects;
  const q = query.trim().toLowerCase();
  const results = q.length >= 1
    ? projectSource.filter(p => (p.name || '').toLowerCase().includes(q) || (p.state || '').toLowerCase().includes(q) || (p.sector || '').toLowerCase().includes(q)).slice(0, 6)
    : [];

  const toneClass = { red: 'bg-[#FEE2E2]', orange: 'bg-[#FFEDD5]', blue: 'bg-[#E0F2FE]' };

  return (
    <header className="dashboard-header flex flex-col lg:flex-row justify-between items-center py-2 lg:py-0 lg:h-[50px] w-full px-4 lg:px-6 bg-[#FFFFFF] border-b border-[#E2E8F0] shrink-0 z-20 gap-2 lg:gap-0">
      <div className="flex items-center justify-between w-full lg:w-auto gap-[8px] shrink-0">
        <div className="flex items-center gap-[8px]">
          <NationalEmblem className="w-6 h-8" />
          <a href="#/" aria-label="Go to PRAGATI home">
            <PragatiLogo />
          </a>
          <div className="hidden sm:block w-[1px] h-[32px] bg-[#CBD5E1] ml-2 mr-2" />
          <div className="hidden sm:flex flex-col justify-center text-[11px] text-[#0F172A] leading-[1.2] font-sans whitespace-nowrap">
            <span>National Infrastructure</span>
            <span>Intelligence</span>
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-[12px] lg:gap-[16px] mx-auto overflow-x-auto w-full lg:w-auto justify-start lg:justify-center h-[50px] py-0 scrollbar-none">
        {headerNavTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <a
              key={tab.id}
              href={tab.href}
              className={`group relative inline-flex h-[50px] items-center text-[12px] lg:text-[14px] font-[500] transition-colors duration-200 outline-none whitespace-nowrap px-1 ${
                isActive ? 'text-[#0F172A] font-[600]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
              onClick={(e) => {
                // Allow navigation for working pages, prevent default for placeholders
                if (tab.href === "#") {
                  e.preventDefault();
                  if (onTab) onTab(tab.id);
                } else {
                  // Let the hash navigation work for working pages
                  if (onTab) onTab(tab.id);
                }
              }}
            >
              <span className="relative z-10">{t(tab.label)}</span>
              <span className={`absolute bottom-[2px] left-0 h-[3px] w-full origin-left rounded-full bg-[#F97316] transition-all duration-300 ease-out ${
                isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
              }`} />
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-[10px] lg:gap-[16px] shrink-0 w-full lg:w-auto justify-end pb-1 lg:pb-0">
        <div className="relative hidden sm:flex items-center w-[140px] lg:w-[190px] h-[36px] bg-white border border-[#E2E8F0] rounded-[6px] px-[10px] py-[8px]">
          <Search className="w-4 h-4 text-[#0F172A] shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            placeholder="Search projects..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            className="w-full h-full bg-transparent border-none outline-none text-[12px] lg:text-[13px] text-[#0F172A] placeholder-[#94A3B8] ml-2 truncate"
          />
          {searchFocused && results.length > 0 && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-[290px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-[80] overflow-hidden">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B] border-b border-[#F1F5F9]">
                {results.length} matching project{results.length > 1 ? 's' : ''}
              </div>
              {results.map(p => {
                const score = p.riskScore !== undefined ? p.riskScore : p.risk;
                const tier = p.riskTier !== undefined ? p.riskTier : p.level;
                return (
                  <button
                    key={p.id}
                    className="w-full text-left px-3 py-2 hover:bg-[#F8FAFC] border-b border-[#F8FAFC] last:border-0"
                    onMouseDown={(e) => { 
                      e.preventDefault(); 
                      window.location.hash = `#/project?id=${encodeURIComponent(p.id)}`; 
                      setQuery(''); 
                    }}
                  >
                    <span className="block text-[12px] font-semibold text-[#0F172A] truncate">{p.name}</span>
                    <span className="block text-[10.5px] text-[#64748B]">{p.state} · {p.sector} · Risk {score} ({tier})</span>
                  </button>
                );
              })}
            </div>
          )}
          {searchFocused && q.length >= 1 && results.length === 0 && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-[290px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-[80] px-3 py-3 text-[12px] text-[#64748B]">
              No projects match &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        <div className="relative hidden md:block">
          <button
            className="flex items-center gap-1 text-[13px] font-[500] text-[#0F172A] hover:opacity-85 transition-opacity"
            onClick={() => setOpenMenu(openMenu === 'lang' ? null : 'lang')}
          >
            <Globe className="w-4 h-4 text-[#0F172A]" />
            <span>{lang.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-[#0F172A]" />
          </button>
          {openMenu === 'lang' && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setOpenMenu(null)} data-no-feedback="true" />
              <div className="absolute top-[calc(100%+8px)] right-0 w-[150px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-[80] p-[6px]">
                {LANGUAGE_OPTIONS.map(({ code, label }) => {
                  const id = code.toLowerCase();
                  return (
                  <button
                    key={code}
                    className={`block w-full text-left text-[12.5px] font-[500] px-[10px] py-[8px] rounded-[6px] hover:bg-[#F8FAFC] ${lang === id ? 'text-[#0F172A] font-bold bg-[#F1F5F9]' : 'text-[#334155]'}`}
                    onClick={() => { onLang(id); setOpenMenu(null); onToast(`Language set to ${label}`); }}
                  >
                    {label}
                  </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            className="relative flex items-center justify-center w-[20px] h-[20px] text-[#0F172A] hover:opacity-85 transition-opacity"
            onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#0F172A]" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#DC2626] text-[10px] font-bold text-white leading-none border border-white">
              {notifList.length}
            </span>
          </button>
          {openMenu === 'notif' && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setOpenMenu(null)} data-no-feedback="true" />
              <div className="absolute top-[calc(100%+10px)] right-0 w-[300px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-[80] py-[8px]">
                <div className="px-[14px] pb-[8px] text-[12px] font-bold text-[#0F172A]">Notifications</div>
                {notifList.length === 0 && (
                  <div className="px-[14px] py-3 text-[12px] text-[#64748B]">You&apos;re all caught up.</div>
                )}
                {notifList.map(n => (
                  <button
                    key={n.id}
                    className="w-full text-left px-[14px] py-[9px] border-t border-[#F1F5F9] hover:bg-[#F8FAFC] flex items-start gap-2"
                    onClick={() => { setNotifList(notifList.filter(x => x.id !== n.id)); onToast('Notification marked as read'); }}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.tone === 'red' ? 'bg-[#DC2626]' : n.tone === 'orange' ? 'bg-[#F97316]' : 'bg-[#0284C7]'}`} />
                    <span>
                      <span className="block text-[12px] text-[#334155] font-medium leading-snug">{n.title}</span>
                      <span className="block text-[10.5px] text-[#64748B] font-semibold mt-[2px]">{n.time}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-[8px] pl-[8px] border-l border-[#E2E8F0] hover:opacity-85 transition-opacity text-left"
            onClick={() => setOpenMenu(openMenu === 'user' ? null : 'user')}
          >
            <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#0F172A] text-white text-[12px] font-[500] shrink-0">
              {currentUser.initials}
            </div>
            <div className="hidden xl:flex flex-col justify-center whitespace-nowrap">
              <span className="text-[12px] font-[600] text-[#0F172A] leading-tight">{currentUser.name}</span>
              <span className="text-[10px] font-[400] text-[#64748B] leading-tight">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#0F172A] ml-1" />
          </button>
          {openMenu === 'user' && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setOpenMenu(null)} data-no-feedback="true" />
              <div className="absolute top-[calc(100%+8px)] right-0 w-[160px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-[80] p-[6px]">
                {userMenu.map(item => (
                  <button
                    key={item.id}
                    className="block w-full text-left text-[12.5px] font-[500] text-[#334155] px-[10px] py-[8px] rounded-[6px] hover:bg-[#F8FAFC]"
                    onClick={() => { setOpenMenu(null); onToast(`${item.label} — opened (mock)`); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/* =====================================================================
   Hero banner — text from data; methodology CTA wired.
   ===================================================================== */
const HeroBanner = ({ onMethodology, t, cycle }) => {
  return (
    <section className="dashboard-hero relative w-full h-[105px] lg:h-[115px] px-4 lg:px-6 flex items-center justify-between overflow-hidden border-b border-[#CBD5E1] select-none shrink-0">
      <div className="absolute inset-0 z-0">
        <img
          src={heroMountainsUrl}
          alt="Himalayan Panorama"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            /* Two layers: the left fade behind the greeting (unchanged),
               and a soft white glow localized to the bottom-right corner
               around the View Methodology button — the date and the
               middle of the photo stay clear. */
            background: `
              linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.72) 20%, rgba(255,255,255,0) 46%),
              radial-gradient(ellipse 20% 100% at 100% 100%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0) 68%)
            `
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex flex-col gap-[2px]">
          <h1 className="font-serif text-[20px] lg:text-[23px] font-[750] text-[#0F172A] leading-tight">
            {t(hero.greeting)}
          </h1>
          <p className="font-sans text-[12px] lg:text-[13.5px] font-[400] text-[#0F172A]">
            {t(hero.subline)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-[7px]">
          <div className="hidden md:block text-right font-serif italic text-[13px] lg:text-[14px] font-[500] text-[#0F172A] leading-none">
            &ldquo;{t(hero.quote)}&rdquo;
          </div>

          <div className="flex items-center gap-[14px]">
            <div className="hidden sm:block w-[1px] h-[22px] bg-[#CBD5E1]" />
            <div className="flex flex-col text-right rounded-md border border-white/70 bg-white/75 px-2 py-1 shadow-sm backdrop-blur-sm">
              <span className="font-sans text-[10.5px] font-[400] text-[#0F172A] leading-none">Data as of</span>
              <span className="font-sans text-[11.5px] lg:text-[12.5px] font-[700] text-[#0F172A] mt-[3px] leading-none">{cycle || hero.dataAsOf}</span>
            </div>
            <button
              onClick={onMethodology}
              className="hidden lg:flex items-center gap-1.5 rounded-full border border-[#CBD5E1] bg-white/60 hover:bg-white px-[13px] py-[5px] font-sans text-[12px] font-[500] text-[#0F172A] transition-all shadow-sm"
            >
              <span>{hero.methodologyCta}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0F172A]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   Sidebar — unchanged visuals; nav drives the workspace views.
   ===================================================================== */
const Sidebar = ({ activeNav, setActiveNav }) => {
  const navItems = [
    { name: 'National Overview', icon: Globe2 },
    { name: 'State View', icon: MapPin },
    { name: 'Sector View', icon: PieChart },
    { name: 'Ministry View', icon: Building2 },
    { name: 'Agency View', icon: Layers },
  ];

  return (
    <aside className="w-[130px] lg:w-[155px] bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col justify-between select-none shrink-0">
      <div className="relative w-full h-[380px] lg:h-[420px] overflow-hidden">
        <img
          src={indiaGateUrl}
          alt="India Gate Monument"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(248,250,252,0) 55%, rgba(248,250,252,0.85) 82%, rgba(248,250,252,1) 100%)'
          }}
        />

        <div className="absolute bottom-[14px] left-[6px] right-[6px] z-10 font-serif italic leading-[1.35] text-center px-1">
          <span className="block text-[11.5px] lg:text-[12.5px] font-[600] text-[#0F172A]">
            &ldquo;Data turns infrastructure into opportunity for every citizen.&rdquo;
          </span>
          <span className="block mt-[3px] text-[9.5px] lg:text-[10.5px] not-italic font-semibold tracking-wide text-[#64748B]">
            — Government of India
          </span>
        </div>
      </div>

      <nav className="w-full my-auto py-2">
        <ul className="flex flex-col w-full">
          {navItems.map((item) => {
            const isActive = activeNav === item.name;
            const IconComponent = item.icon;
            return (
              <li key={item.name} className="w-full">
                <button
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full min-h-[58px] lg:min-h-[64px] px-2 py-2 flex flex-col items-center justify-center text-center transition-colors duration-150 relative ${
                    isActive
                      ? 'bg-[#E0F2FE] text-[#0F172A] font-bold text-[11px] lg:text-[12.5px]'
                      : 'bg-transparent text-[#0F172A] font-medium text-[11px] lg:text-[12.5px] hover:bg-[#F1F5F9] border-b border-[#F1F5F9]'
                  }`}
                >
                  {isActive && <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#F97316]"></span>}

                  <IconComponent className={`w-[18px] h-[18px] lg:w-[20px] lg:h-[20px] shrink-0 mb-1 text-[#0F172A]`} />
                  <span className="leading-[1.2] break-words w-full px-1">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative w-full h-[320px] lg:h-[360px] overflow-hidden">
        <img
          src={infraHighwayUrl}
          alt="Infrastructure Highway"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(248,250,252,0) 55%, rgba(248,250,252,0.85) 82%, rgba(248,250,252,1) 100%)'
          }}
        />

        <div className="absolute bottom-[20px] left-[4px] right-[4px] flex flex-col font-serif italic leading-[1.3] z-10 text-center">
          <span className="text-[11px] lg:text-[12.5px] font-semibold text-[#0F172A]">Stronger</span>
          <span className="text-[11px] lg:text-[12.5px] font-semibold text-[#0F172A]">Infrastructure</span>
          <div className="mt-[2px] text-[11px] lg:text-[12.5px] font-semibold">
            <span className="text-[#0F172A]">A Brighter </span>
            <span className="text-[#F97316]">India</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

/* =====================================================================
   National Overview — exact original structure/classes; every control
   now works from the data layer.
   ===================================================================== */
const ICON_MAP = { alert: AlertTriangle, down: TrendingDown, file: FileText, clock: Clock, rupee: IndianRupee, up: TrendingUp, chart: BarChart3 };
const TONE_ICON = { red: 'bg-[#FEE2E2] text-[#DC2626]', green: 'bg-[#D1FAE5] text-[#10B981]', blue: 'bg-[#E0F2FE] text-[#0284C7]', amber: 'bg-[#FEF3C7] text-[#D97706]', orange: 'bg-[#FFEDD5] text-[#C2410C]' };
const TONE_DETAIL = { red: 'text-[#EF4444]', green: 'text-[#10B981]', muted: 'text-[#64748B]' };
const KPI_ICON_TONE = { green: 'bg-[#E0F2FE] text-[#0369A1]', red: 'bg-[#FEE2E2] text-[#DC2626]', orange: 'bg-[#FFEDD5] text-[#C2410C]' };

const NationalOverviewContent = ({ open, exportCsv, generateReport, go, summary, stateSummary, alerts, liveProjects, onDrill, activeNav, focus }) => {
  const viewConfig = {
    'State View': { label: 'State', plural: 'States', field: 'state', drill: 'state' },
    'Sector View': { label: 'Sector', plural: 'Sectors', field: 'sector', drill: 'sector' },
    'Ministry View': { label: 'Ministry', plural: 'Ministries', field: 'ministry', drill: 'ministry' },
    'Agency View': { label: 'Agency', plural: 'Agencies', field: 'agency', drill: 'agency' },
  }[activeNav];
  const viewProjects = viewConfig && liveProjects.length
    ? liveProjects.filter((project) => (!focus || project[viewConfig.field] === focus))
    : liveProjects;
  const usesLiveView = Boolean(viewConfig && liveProjects.length);
  const totalProj = usesLiveView ? viewProjects.length : summary?.total_projects || 1773;
  const criticalCount = usesLiveView
    ? viewProjects.filter((project) => Number(project.riskScore || 0) > 75).length
    : summary?.critical_risk_count || 69;
  const highCount = usesLiveView
    ? viewProjects.filter((project) => Number(project.riskScore || 0) > 55 && Number(project.riskScore || 0) <= 75).length
    : summary?.high_risk_count || 493;
  const mediumCount = usesLiveView
    ? viewProjects.filter((project) => Number(project.riskScore || 0) > 30 && Number(project.riskScore || 0) <= 55).length
    : summary?.tier_counts?.Medium || 333;
  const lowCount = usesLiveView
    ? viewProjects.filter((project) => Number(project.riskScore || 0) <= 30).length
    : summary?.tier_counts?.Low || 878;
  const viewTotalCost = usesLiveView
    ? viewProjects.reduce((sum, project) => sum + Number(project.revisedCostCrore || 0), 0)
    : Number(summary?.total_cost_current_cr || 0);
  const viewMeanRisk = usesLiveView && totalProj
    ? viewProjects.reduce((sum, project) => sum + Number(project.riskScore || 0), 0) / totalProj
    : summary?.mean_risk_score || 0;
  const viewProgress = usesLiveView && totalProj
    ? viewProjects.reduce((sum, project) => sum + Number(project.physicalProgress || 0), 0) / totalProj
    : summary?.avg_physical_progress || 0;
  const viewSummary = summary ? {
    ...summary,
    total_projects: totalProj,
    critical_risk_count: criticalCount,
    high_risk_count: highCount,
    tier_counts: { Critical: criticalCount, High: highCount, Medium: mediumCount, Low: lowCount },
    total_cost_current_cr: viewTotalCost,
  } : summary;

  const liveKpis = summary ? [
    { ...kpis[0], label: usesLiveView ? `Projects in ${viewConfig.label}` : kpis[0].label, value: Number(totalProj).toLocaleString('en-IN'), breakdown: { title: `Monitored Projects — ${Number(totalProj).toLocaleString('en-IN')}`, rows: [['Total Active Projects', Number(totalProj).toLocaleString('en-IN')], ['Mean Risk Score', `${viewMeanRisk.toFixed(1)}%`], ['Average Physical Progress', `${viewProgress.toFixed(1)}%`]] } },
    { ...kpis[1], value: `${Number(highCount + criticalCount).toLocaleString('en-IN')}`, breakdown: { title: `High Priority — ${Number(highCount + criticalCount).toLocaleString('en-IN')}`, rows: [['Critical Risk', String(criticalCount)], ['High Risk', String(highCount)], ['Watchlist Exposure', `₹ ${(Number(summary.total_cost_escalation_cr || 0) / 100000).toFixed(1)} Lakh Cr`]] } },
    { ...kpis[2], value: `₹ ${(viewTotalCost / 100000).toFixed(1)} Lakh Cr`, breakdown: { title: `Portfolio — ₹ ${(viewTotalCost / 100000).toFixed(1)} Lakh Cr`, rows: [['Sanctioned Original', `₹ ${(Number(summary.total_original_cost_cr || 0) / 100000).toFixed(1)} Lakh Cr`], ['Current Revised', `₹ ${(viewTotalCost / 100000).toFixed(1)} Lakh Cr`], ['Cumulative Expenditure', `₹ ${(Number(summary.total_expenditure_cr || 0) / 100000).toFixed(1)} Lakh Cr`]] } },
    { ...kpis[3], label: 'Critical Risk Signals', value: `${Number(criticalCount).toLocaleString('en-IN')}`, delta: `${Math.round(criticalCount / totalProj * 100)}%`, breakdown: { title: `Critical Signals — ${Number(criticalCount).toLocaleString('en-IN')}`, rows: [['Critical Projects', String(criticalCount)], ['Active Signal Feed', String(alerts?.length || 0)], ['Escalations Active', String(summary.tier_counts?.Critical || 0)]] } },
  ] : kpis;

  const dynamicTiers = [
    { id: 'critical', label: 'Critical', pct: `${totalProj ? Math.round(criticalCount / totalProj * 100) : 0}%`, count: criticalCount, color: '#DC2626', offset: 0 },
    { id: 'high', label: 'High', pct: `${totalProj ? Math.round(highCount / totalProj * 100) : 0}%`, count: highCount, color: '#F97316', offset: totalProj ? -((criticalCount / totalProj) * 251.2) : 0 },
    { id: 'medium', label: 'Medium', pct: `${totalProj ? Math.round(mediumCount / totalProj * 100) : 0}%`, count: mediumCount, color: '#F59E0B', offset: totalProj ? -(((criticalCount + highCount) / totalProj) * 251.2) : 0 },
    { id: 'low', label: 'Low', pct: `${totalProj ? Math.round(lowCount / totalProj * 100) : 0}%`, count: lowCount, color: '#10B981', offset: totalProj ? -(((criticalCount + highCount + mediumCount) / totalProj) * 251.2) : 0 },
  ];

  const selectedGroups = usesLiveView
    ? [...viewProjects.reduce((groups, project) => {
        const name = project[viewConfig.field] || 'Not reported';
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(project);
        return groups;
      }, new Map()).entries()].map(([name, group], idx) => {
        const count = group.length;
        const high = group.filter((project) => Number(project.riskScore || 0) > 55).length;
        const averageRisk = count ? group.reduce((sum, project) => sum + Number(project.riskScore || 0), 0) / count : 0;
        const cost = group.reduce((sum, project) => sum + Number(project.revisedCostCrore || 0), 0);
        const pctNum = totalProj ? Math.round(count / totalProj * 100) : 0;
        return { id: `view-${idx}`, name, count, pct: `${pctNum}%`, avgRisk: Math.round(averageRisk), cost: `₹ ${cost.toLocaleString('en-IN')} Cr`, highCount: high, width: `${Math.max(8, Math.min(100, pctNum * 1.8))}%` };
      }).sort((a, b) => b.count - a.count).slice(0, 5)
    : null;
  const dynamicSectors = selectedGroups || ((summary?.sector_breakdown && summary.sector_breakdown.length > 0)
    ? summary.sector_breakdown.slice(0, 5).map((sec, idx) => {
        const pctNum = Math.round((sec.projectCount / totalProj) * 100);
        return {
          id: `sec-${idx}`,
          name: sec.sector,
          count: sec.projectCount,
          pct: `${pctNum}%`,
          avgRisk: sec.avgRiskScore,
          cost: `₹ ${Number(sec.totalCostCrore || 0).toLocaleString('en-IN')} Cr`,
          highCount: sec.highRiskCount,
          width: `${Math.max(8, Math.min(100, pctNum * 1.8))}%`,
        };
      })
    : sectors);

  const dynamicTopStates = (stateSummary && stateSummary.length > 0)
    ? [...stateSummary]
        .filter(s => s.stateName && !['PAN India', 'Offshore', 'Not reported'].includes(s.stateName))
        .sort((a, b) => ((b.highRiskCount + b.criticalRiskCount) - (a.highRiskCount + a.criticalRiskCount)))
        .slice(0, 5)
        .map((s, idx) => ({
          rank: idx + 1,
          name: s.stateName,
          total: s.projectCount,
          critical: s.highRiskCount + s.criticalRiskCount,
          value: `₹ ${Number(s.totalCostCrore || 0).toLocaleString('en-IN')} Cr`,
          avgRisk: s.avgRiskScore,
          trend: s.avgRiskScore > 40 ? 'up' : 'down',
        }))
    : topStates;
  const dynamicPrimaryRows = usesLiveView
    ? dynamicSectors.slice(0, 5).map((row, idx) => ({
        rank: idx + 1,
        name: row.name,
        total: row.count,
        critical: row.highCount,
        value: row.cost,
        avgRisk: row.avgRisk,
        trend: row.avgRisk > 40 ? 'up' : 'down',
      }))
    : dynamicTopStates;

  const visibleIds = usesLiveView ? new Set(viewProjects.map((project) => String(project.id))) : null;
  const scopedAlerts = visibleIds ? alerts.filter((alert) => visibleIds.has(String(alert.projectId))) : alerts;
  const viewChanges = usesLiveView
    ? scopedAlerts.slice(0, 4).map((alert) => ({
        icon: 'alert',
        tone: ['critical', 'high'].includes(String(alert.riskTier).toLowerCase()) ? 'red' : 'orange',
        title: alert.message,
        detail: `${alert.reportingMonth || summary?.month || 'Current cycle'} · ${alert.persistenceMonths} cycle(s) active`,
        detailTone: 'red',
      }))
    : changes;
  const dynamicWarnings = (scopedAlerts && scopedAlerts.length > 0)
    ? scopedAlerts.slice(0, 4).map((al, idx) => ({
        id: al.id || `alt-${idx}`,
        projectId: al.projectId,
        date: al.reportingMonth || 'Current Cycle',
        name: `Project #${al.projectId}`,
        state: `Persistence: ${al.persistenceMonths} mo`,
        level: String(al.riskTier || 'HIGH').toUpperCase(),
        type: String(al.type).replace(/_/g, ' ').toUpperCase(),
        tone: ['critical', 'high'].includes(String(al.riskTier).toLowerCase()) ? 'red' : 'amber',
        action: al.message,
        description: `${al.message} Detected in ${al.reportingMonth}. Persistence: ${al.persistenceMonths} month(s).`,
      }))
    : usesLiveView ? [] : warnings;

  return (
    <div className="dashboard-content flex flex-col gap-[20px]">
      {/* 1. Header & Top 4 KPI Cards Row exactly matching reference screenshot */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Title Section */}
        <div className="flex flex-col gap-[2px]">
          <h2 className="font-serif text-[26px] font-[700] text-[#0F172A] leading-tight">
            {activeNav === 'National Overview' ? 'National Infrastructure Overview' : activeNav}
          </h2>
          <p className="font-sans text-[14px] font-[400] text-[#64748B]">
            {usesLiveView ? `${focus || `All ${viewConfig.plural.toLowerCase()}`} — live portfolio view for the selected reporting cycle.` : 'What is happening across the monitored project portfolio?'}
          </p>
        </div>

        {/* 4 KPI Cards aligned horizontally on top right */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
          {liveKpis.map((k) => {
            const Icon = ICON_MAP[k.icon];
            return (
              <button
                key={k.id}
                onClick={() => open({ title: k.breakdown.title, rows: k.breakdown.rows, intro: `${k.label}: ${k.value} — ${k.delta} ${k.dir === 'up' ? 'increase' : 'change'} vs. previous month.` })}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[8px] p-[12px] flex flex-col justify-between shadow-sm min-w-[155px] text-left hover:border-[#93C5FD] hover:bg-[#F8FBFF] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[20px] font-bold text-[#0F172A] leading-none">{k.value}</span>
                    <span className="text-[11px] text-[#64748B] mt-1">{k.label}</span>
                  </div>
                  <div className={`flex items-center justify-center w-[30px] h-[30px] rounded-lg ${KPI_ICON_TONE[k.tone]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2.5 text-[10.5px]">
                  <span className={`${k.tone === 'red' ? 'text-[#EF4444]' : 'text-[#10B981]'} font-semibold flex items-center`}>
                    {k.dir === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />} {k.delta}
                  </span>
                  <span className="text-[#64748B]">vs. previous month</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Middle Grid: Interactive Map (Col 1), Risk & Sector (Col 2), What Changed & Key Insight (Col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_1.4fr_1.5fr] gap-[20px]">

        {/* Column 1: Interactive Map Component */}
        <div className="dashboard-map-card bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] flex flex-col justify-between relative shadow-sm">
          <div>
            <IndiaHeatmap
              height="420px"
              highlightStates={usesLiveView ? [...new Set(viewProjects.map((project) => project.state).filter(Boolean))] : undefined}
            />
          </div>
        </div>

        {/* Column 2: Risk Distribution & Projects by Sector */}
        <div className="dashboard-side-stack flex flex-col gap-[20px]">

          {/* Top Card (Risk Distribution) */}
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm">
            <h3 className="text-[13.5px] font-bold text-[#0F172A] mb-3">Risk Distribution ({usesLiveView ? focus || `All ${viewConfig.plural}` : 'All Projects'})</h3>
            <div className="flex items-center justify-between">
              {/* Donut Chart representation */}
              <div className="relative w-[110px] h-[110px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="16" />
                  {dynamicTiers.map((seg, i) => (
                    <circle key={i} cx="50" cy="50" r="40" fill="transparent" stroke={seg.color} strokeWidth="16" strokeDasharray="251.2" strokeDashoffset={seg.offset} />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[13.5px] font-bold text-[#0F172A] leading-tight">{Number(totalProj).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-[#64748B]">Projects</span>
                </div>
              </div>

              {/* Legend / Table — each tier row opens its project list */}
              <div className="flex flex-col gap-1.5 text-[11.5px] flex-1 pl-3">
                {dynamicTiers.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      open({
                        title: `${tier.label} risk — ${tier.count} projects`,
                        intro: `${tier.pct} of the monitored portfolio sits in the ${tier.label.toLowerCase()} band this cycle.`,
                        rows: [['Band label', tier.label], ['Project count', String(tier.count)], ['Portfolio share', tier.pct]],
                        footerNote: 'Derived dynamically from live scored model outputs.',
                      });
                    }}
                    className="grid grid-cols-[minmax(0,1fr)_42px_42px] items-center gap-2 text-left hover:bg-slate-50 rounded px-1 -mx-1"
                  >
                    <div className="flex items-center gap-2 min-w-0"><span className={`w-2.5 h-2.5 rounded-full shrink-0`} style={{ background: tier.color }}></span><span className="text-[#334155] truncate">{tier.label}</span></div>
                    <span className="font-semibold text-[#0F172A] text-right">{tier.pct}</span>
                    <span className="text-slate-600 text-right">{tier.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-right">
              <button onClick={() => open({
                title: methodology.title,
                intro: methodology.intro,
                table: { head: ['Factor', 'Weight', 'What it measures'], rows: methodology.factors.map(f => [f.name, f.weight, f.detail]) },
              })} className="text-[11.5px] text-[#2563EB] hover:underline font-medium inline-flex items-center gap-1">
                View Risk Methodology →
              </button>
            </div>
          </div>

          {/* Bottom Card (selected dimension breakdown) */}
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm">
            <h3 className="text-[13.5px] font-bold text-[#0F172A] mb-2.5">Projects by {usesLiveView ? viewConfig.label : 'Sector'}</h3>
            <div className="flex flex-col gap-1.5 text-[11.5px]">
              {dynamicSectors.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => open({
                    title: `${sec.name} — ${sec.count} projects`,
                    intro: `${sec.pct} of the monitored portfolio. Sector health for the current cycle:`,
                    rows: [
                      ['Average risk score', String(sec.avgRisk ?? '—')],
                      ['High-risk projects', String(sec.highCount ?? '—')],
                      ['Portfolio cost', String(sec.cost ?? '—')],
                    ],
                  })}
                  className="flex items-center justify-between gap-2 text-left hover:bg-slate-50 rounded px-1 -mx-1"
                >
                  <span className="w-[110px] text-[#334155] truncate">{sec.name}</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: sec.width }}></div>
                  </div>
                  <div className="grid grid-cols-[34px_42px] items-center gap-2 w-[78px] text-slate-600">
                    <span className="text-[10.5px] text-[#64748B] text-right">{sec.pct}</span>
                    <span className="font-semibold text-[#0F172A] text-right">{sec.count}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-right">
              <button onClick={() => open({
                title: usesLiveView ? `All ${viewConfig.plural}` : 'All Sectors',
                intro: `Full ${usesLiveView ? viewConfig.label.toLowerCase() : 'sector'} register for the ${summary?.month || 'current'} cycle.`,
                table: {
                  head: [usesLiveView ? viewConfig.label : 'Sector', 'Projects', 'Avg Risk', 'High Risk', 'Portfolio Value'],
                  rows: dynamicSectors.map((row) => [row.name, row.count, row.avgRisk, row.highCount, row.cost]),
                },
              })} className="text-[11.5px] text-[#2563EB] hover:underline font-medium inline-flex items-center gap-1">
                View All {usesLiveView ? viewConfig.plural : 'Sectors'} →
              </button>
            </div>
          </div>

        </div>

        {/* Column 3: What Changed This Month & Key Insight */}
        <div className="dashboard-side-stack flex flex-col gap-[20px]">

          {/* Top Card (What Changed This Month) */}
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[13.5px] font-bold text-[#0F172A]">{usesLiveView ? `What Changed · ${focus || viewConfig.label}` : 'What Changed This Month?'}</h3>
              <button onClick={() => open({
                title: `Monthly Changes — ${summary?.month || 'current cycle'}`,
                intro: 'Complete movement list for the reporting cycle.',
                items: viewChanges.map(c => c.title),
              })} className="text-[11.5px] text-[#2563EB] hover:underline font-medium">View All →</button>
            </div>

            <div className="dashboard-changes-list flex flex-col gap-2.5 text-[12.5px] overflow-y-auto pr-1">
              {viewChanges.length ? viewChanges.map(({ icon, tone, title, detail, detailTone }, index) => {
                const Icon = ICON_MAP[icon];
                return (
                  <div key={`${title}-${index}`} className="flex items-start gap-2.5 pb-2 border-b border-[#F1F5F9] last:border-0">
                    <div className={`w-6 h-6 rounded-full ${TONE_ICON[tone]} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#1E293B] font-medium leading-snug">{title}</p>
                      <span className={`${TONE_DETAIL[detailTone]} text-[10.5px] font-semibold flex items-center gap-1 mt-0.5`}>{detail}</span>
                    </div>
                  </div>
                );
              }) : <p className="text-[11px] text-[#64748B]">No active change signals for this view.</p>}
            </div>
          </div>

          {/* Bottom Insight Card (Key Insight) */}
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-[8px] p-[12px] flex items-start gap-2.5 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[11.5px] font-bold text-[#C2410C] uppercase tracking-wide">Key Insight</h4>
              <p className="text-[12.5px] text-[#9A3412] mt-0.5 leading-relaxed">
                {usesLiveView
                  ? `${dynamicSectors[0]?.name || viewConfig.label} has the largest ${viewConfig.label.toLowerCase()} portfolio, with an average risk score of ${dynamicSectors[0]?.avgRisk ?? '—'}%.`
                  : keyInsight}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Row: Top 5 States (Col 1), Recent High-Priority Warnings (Col 2), Quick Actions (Col 3) exactly like screenshot */}
      <div className="dashboard-bottom-grid grid grid-cols-1 lg:grid-cols-[2.1fr_2.4fr_1.5fr] gap-[20px]">

        {/* Table 1: Top 5 States by High Priority Projects */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13.5px] font-bold text-[#0F172A]">Top 5 {usesLiveView ? viewConfig.plural : 'States'} by High Priority Projects</h3>
              <button onClick={() => onDrill(usesLiveView ? viewConfig.drill : 'state')} className="text-[11.5px] text-[#2563EB] hover:underline font-medium">View All {usesLiveView ? viewConfig.plural : 'States'} →</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">{usesLiveView ? viewConfig.label : 'State'}</th>
                    <th className="pb-2 font-medium">Total Projects</th>
                    <th className="pb-2 font-medium">High/Critical</th>
                    <th className="pb-2 font-medium">Portfolio Value</th>
                    <th className="pb-2 font-medium">Risk Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {dynamicPrimaryRows.map(row => (
                    <tr
                      key={row.rank}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => onDrill(usesLiveView ? viewConfig.drill : 'state', row.name)}
                    >
                      <td className="py-2 font-semibold text-[#0F172A]">{row.rank}</td>
                      <td className="py-2 font-medium text-[#0F172A]">{row.name}</td>
                      <td className="py-2 text-[#334155]">{row.total}</td>
                      <td className="py-2 text-[#334155]">{row.critical}</td>
                      <td className="py-2 text-[#334155]">{row.value}</td>
                      <td className="py-2">
                        {row.trend === 'up' && <span className="text-[#EF4444] font-bold">↑</span>}
                        {row.trend === 'down' && <span className="text-[#10B981] font-bold">↓</span>}
                        {row.trend === 'stable' && <span className="text-[#64748B] font-bold">→</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 2: Recent High-Priority Warnings exactly as seen in reference */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13.5px] font-bold text-[#0F172A]">Recent High-Priority Warnings</h3>
              <button onClick={() => onDrill('early-warnings')} className="text-[11.5px] text-[#2563EB] hover:underline font-medium">View All Warnings →</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Warning Type</th>
                    <th className="pb-2 font-medium">Project Name</th>
                    <th className="pb-2 font-medium">State</th>
                    <th className="pb-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {dynamicWarnings.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="py-2 text-[#334155] whitespace-nowrap">{w.date}</td>
                      <td className="py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium border ${
                          w.tone === 'red' ? 'bg-red-50 text-red-600 border-red-200'
                          : w.tone === 'orange' ? 'bg-orange-50 text-orange-600 border-orange-200'
                          : w.tone === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : w.tone === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                        }`}>
                          <AlertTriangle className="w-2.5 h-2.5" /> {w.type}
                        </span>
                      </td>
                      <td className="py-2 font-medium text-[#0F172A] truncate max-w-[160px]">{w.name}</td>
                      <td className="py-2 text-[#64748B]">{w.state}</td>
                      <td className="py-2 text-right">
                        <button
                          className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                          aria-label={`Open warning for ${w.name}`}
                          onClick={() => (w.projectId ? onDrill('project', w.projectId) : onDrill('early-warnings'))}
                        >→</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[13.5px] font-bold text-[#0F172A] mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => go('Projects')} className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] hover:border-[#93C5FD] hover:bg-[#F8FBFF] transition-all text-left min-h-[62px]">
                <div className="w-9 h-9 rounded-xl bg-[#EAF4FC] text-[#075985] flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-[#0F172A] leading-tight">Search Projects</span>
                  <span className="block text-[9px] text-[#64748B] mt-0.5 leading-tight">Find and analyze any project</span>
                </div>
              </button>

              <button onClick={() => go('Watchlist')} className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] hover:border-[#93C5FD] hover:bg-[#F8FBFF] transition-all text-left min-h-[62px]">
                <div className="w-9 h-9 rounded-xl bg-[#EAF4FC] text-[#075985] flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-[#0F172A] leading-tight">Create Watchlist</span>
                  <span className="block text-[9px] text-[#64748B] mt-0.5 leading-tight">Build a custom investigation</span>
                </div>
              </button>

              <button onClick={exportCsv} className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] hover:border-[#93C5FD] hover:bg-[#F8FBFF] transition-all text-left min-h-[62px]">
                <div className="w-9 h-9 rounded-xl bg-[#EAF4FC] text-[#075985] flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-[#0F172A] leading-tight">Export Data</span>
                  <span className="block text-[9px] text-[#64748B] mt-0.5 leading-tight">Download reports and data</span>
                </div>
              </button>

              <button onClick={generateReport} className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] hover:border-[#93C5FD] hover:bg-[#F8FBFF] transition-all text-left min-h-[62px]">
                <div className="w-9 h-9 rounded-xl bg-[#EAF4FC] text-[#075985] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-[#0F172A] leading-tight">Generate Report</span>
                  <span className="block text-[9px] text-[#64748B] mt-0.5 leading-tight">Create briefing notes</span>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* =====================================================================
   Sidebar workspaces — State / Sector / Ministry / Agency.
   Each is a complete, data-driven page in the dashboard's design
   language (no modal tables — full views).
   ===================================================================== */
const sum = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);

/* Shared "same UI as the National Overview" furniture for the lens views
   (State / Sector / Ministry / Agency): hero-style heading row, stat chips
   and a detail heatmap card that mirrors the overview map card. */
const ViewHeading = ({ title, sub, kicker }) => (
  <div className="flex flex-col gap-[2px]">
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2563EB]">{kicker}</p>
    <h2 className="font-serif text-[24px] font-[700] text-[#0F172A] leading-tight">{title}</h2>
    <p className="font-sans text-[13px] font-[400] text-[#64748B]">{sub}</p>
  </div>
);

/* Cross-navigation strip shown in every lens view — keeps the whole
   dashboard connected (no dead ends, no hover-only interactions). */
const LensFocusBar = ({ focus, label, onClear, onDrill }) => (
  <div className="flex flex-wrap items-center gap-[8px]">
    {focus && (
      <span className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[11.5px] font-semibold px-3 py-1 rounded-full">
        {label}: {focus}
        <button onClick={onClear} aria-label="Clear focus filter" className="text-[#1D4ED8] hover:text-[#0F172A] font-bold">✕</button>
      </span>
    )}
    <button onClick={() => onDrill('early-warnings')} className="text-[11.5px] text-[#2563EB] hover:underline font-medium">Early Warnings →</button>
    <span className="text-[#CBD5E1]">|</span>
    <button onClick={() => onDrill('sector')} className="text-[11.5px] text-[#2563EB] hover:underline font-medium">Sector View →</button>
    <span className="text-[#CBD5E1]">|</span>
    <button onClick={() => onDrill('state')} className="text-[11.5px] text-[#2563EB] hover:underline font-medium">State View →</button>
    <span className="text-[#CBD5E1]">|</span>
    <button onClick={() => onDrill('ministry')} className="text-[11.5px] text-[#2563EB] hover:underline font-medium">Ministry View →</button>
  </div>
);

const ViewMapCard = ({ title, sub, items, toneMap }) => {
  const max = Math.max(...items.map(i => Number(i.value) || 0), 1);
  return (
    <div className="dashboard-map-card bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm flex flex-col">
      <h3 className="text-[13.5px] font-bold text-[#0F172A]">{title}</h3>
      <p className="text-[11px] text-[#64748B] mt-0.5 mb-3">{sub}</p>
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-[7px]">
        {items.slice(0, 24).map((it) => {
          const tone = toneMap ? toneMap(it) : '#3B82F6';
          const pct = Math.max(4, Math.round(((Number(it.value) || 0) / max) * 100));
          return (
            <div key={it.name} className="flex items-center gap-2 text-[11.5px]">
              <span className="w-[130px] shrink-0 truncate text-[#334155] font-medium">{it.name}</span>
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tone }} />
              </div>
              <span className="w-[46px] shrink-0 text-right font-semibold text-[#0F172A]">{it.metric}</span>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-[12px] text-[#64748B] py-6 text-center">No records in the current reporting cycle.</p>}
      </div>
    </div>
  );
};

const StatChips = ({ items }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
    {items.map((s) => (
      <button
        key={s.label}
        onClick={s.onClick}
        className={`bg-white border border-[#E2E8F0] rounded-[8px] p-[12px] shadow-sm flex flex-col gap-1 text-left ${s.onClick ? 'cursor-pointer hover:border-[#93C5FD] hover:bg-[#F8FBFF] transition-all' : 'cursor-default'}`}
      >
        <span className="text-[20px] font-bold text-[#0F172A] leading-none">{s.value}</span>
        <span className="text-[11px] text-[#64748B]">{s.label}</span>
      </button>
    ))}
  </div>
);

const DataTableCard = ({ head, rows, onRow, render = {} }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-[16px] shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-[#E2E8F0] text-[#64748B]">
            {head.map((h) => <th key={h} className="pb-2 pr-3 font-medium whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9]">
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`hover:bg-slate-50 transition-colors ${onRow ? 'cursor-pointer' : ''}`}
              onClick={() => onRow && onRow(row)}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2 pr-3 whitespace-nowrap ${j === 0 ? 'font-semibold text-[#0F172A]' : 'text-[#334155]'}`}
                >
                  {render[j] ? render[j](cell, row) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TREND_CELL = {
  up: <span className="text-[#EF4444] font-semibold">&uarr; Rising</span>,
  down: <span className="text-[#10B981] font-semibold">&darr; Improving</span>,
  stable: <span className="text-[#64748B] font-semibold">&rarr; Stable</span>,
};

const riskPill = (v) => {
  const n = Number(v);
  const tone = n >= 55 ? 'bg-red-50 text-red-600 border-red-200'
    : n >= 45 ? 'bg-orange-50 text-orange-600 border-orange-200'
    : 'bg-green-50 text-green-600 border-green-200';
  return <span className={`inline-flex px-2 py-0.5 rounded text-[10.5px] font-semibold border ${tone}`}>{v}</span>;
};

const onTrackCell = (v) => {
  const n = parseInt(v, 10);
  const color = n >= 80 ? 'text-[#10B981]' : n >= 70 ? 'text-[#D97706]' : 'text-[#DC2626]';
  return <span className={`font-semibold ${color}`}>{v}</span>;
};

const StateView = ({ open, stateSummary, onDrill, focus }) => {
  const validStates = (stateSummary && stateSummary.length > 0)
    ? stateSummary.filter(s => s.stateName && !['PAN India', 'Offshore', 'Not reported'].includes(s.stateName))
        .sort((a, b) => b.projectCount - a.projectCount)
    : allStates.map((s, idx) => ({
        rank: s.rank || idx + 1,
        stateName: s.name,
        projectCount: s.total,
        highRiskCount: s.critical,
        criticalRiskCount: 0,
        totalCostCrore: 0,
        avgRiskScore: 40,
        trend: s.trend,
      }));

  const totalProjects = validStates.reduce((a, s) => a + (s.projectCount || 0), 0);
  const highCritical = validStates.reduce((a, s) => a + (s.highRiskCount || 0) + (s.criticalRiskCount || 0), 0);
  const topState = validStates[0];
  const visibleStates = focus ? validStates.filter((s) => s.stateName === focus) : validStates;

  return (
    <div className="dashboard-content flex flex-col gap-[16px]">
      <ViewHeading kicker="State Lens" title="State View" sub="State-wise portfolios ranked by monitored projects — live telemetry. Select a state for its portfolio detail." />
      <LensFocusBar focus={focus} label="State" onClear={() => onDrill('state')} onDrill={onDrill} />
      <StatChips items={[
        { label: 'States / UTs tracked', value: validStates.length },
        { label: 'Projects (tracked states)', value: totalProjects.toLocaleString('en-IN') },
        { label: 'High / Critical projects', value: highCritical },
        { label: 'Largest portfolio', value: topState ? `${topState.stateName} (${topState.projectCount})` : '—' },
      ]} />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-[16px]">
        <DataTableCard
          head={['#', 'State / UT', 'Total Projects', 'High/Critical', 'Portfolio Value', 'Risk Trend']}
          rows={visibleStates.map((s, idx) => [
            idx + 1,
            s.stateName,
            s.projectCount,
            s.highRiskCount + s.criticalRiskCount,
            s.totalCostCrore ? `₹ ${Number(s.totalCostCrore).toLocaleString('en-IN')} Cr` : (s.value || '—'),
            s.trend || (s.avgRiskScore > 40 ? 'up' : 'down'),
          ])}
          render={{ 5: (t) => TREND_CELL[t] || t }}
          onRow={(row) => open({
            title: `${row[1]} — State Portfolio`,
            intro: 'Live verified state telemetry from the scored portfolio.',
            rows: [['Total projects', String(row[2])], ['High/Critical projects', String(row[3])], ['Portfolio value', String(row[4])], ['Risk trend vs. last cycle', String(row[5])]],
          })}
        />
        <ViewMapCard
          title="Projects by State"
          sub="Portfolio concentration across tracked states and UTs."
          items={(focus ? visibleStates : validStates).slice(0, 24).map((s) => ({
            name: s.stateName,
            value: s.projectCount || 0,
            metric: String(s.projectCount || 0),
          }))}
          toneMap={() => '#3B82F6'}
        />
      </div>
    </div>
  );
};

const SectorView = ({ open, summary, onDrill, focus }) => {
  const sectorsList = (summary?.sector_breakdown && summary.sector_breakdown.length > 0)
    ? summary.sector_breakdown
    : sectorDetail.map(d => ({
        sector: d.name,
        projectCount: d.projects,
        avgRiskScore: d.avgRisk,
        highRiskCount: d.delayed,
        totalCostCrore: 0,
      }));

  const totalSectors = sectorsList.length;
  const totalProjects = sectorsList.reduce((a, s) => a + (s.projectCount || 0), 0);
  const avgRisk = totalSectors > 0 ? Math.round(sectorsList.reduce((a, s) => a + (s.avgRiskScore || 0), 0) / totalSectors) : 0;
  const highestRiskSec = sectorsList.slice().sort((a, b) => (b.avgRiskScore || 0) - (a.avgRiskScore || 0))[0]?.sector || '—';
  const visibleSectors = focus ? sectorsList.filter((d) => d.sector === focus) : sectorsList;

  return (
    <div className="dashboard-content flex flex-col gap-[16px]">
      <ViewHeading kicker="Sector Lens" title="Sector View" sub="Sector registers with average risk, critical counts, and portfolio cost. Select a sector for its profile." />
      <LensFocusBar focus={focus} label="Sector" onClear={() => onDrill('sector')} onDrill={onDrill} />
      <StatChips items={[
        { label: 'Sectors monitored', value: totalSectors },
        { label: 'Total projects', value: totalProjects.toLocaleString('en-IN') },
        { label: 'Average risk score', value: avgRisk },
        { label: 'Highest-risk sector', value: highestRiskSec },
      ]} />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-[16px]">
        <DataTableCard
          head={['Sector', 'Projects', 'Avg Risk', 'High Risk Count', 'Portfolio Value']}
          rows={visibleSectors.map((d) => [
            d.sector,
            d.projectCount,
            d.avgRiskScore || 0,
            d.highRiskCount || 0,
            d.totalCostCrore ? `₹ ${Number(d.totalCostCrore).toLocaleString('en-IN')} Cr` : '—',
          ])}
          render={{ 2: riskPill }}
          onRow={(row) => open({
            title: `${row[0]} — Sector Profile`,
            intro: 'Live verified sector telemetry from the scored portfolio.',
            rows: [['Projects', String(row[1])], ['Average risk score', String(row[2])], ['High risk projects', String(row[3])], ['Portfolio value', String(row[4])]],
          })}
        />
        <ViewMapCard
          title="Projects by Sector"
          sub="Portfolio spread across the monitored sectors."
          items={(focus ? visibleSectors : sectorsList).map((d) => ({
            name: d.sector,
            value: d.projectCount || 0,
            metric: String(d.projectCount || 0),
          }))}
          toneMap={() => '#3B82F6'}
        />
      </div>
    </div>
  );
};

const MinistryView = ({ open, summary, onDrill, focus }) => {
  const minList = (summary?.ministry_breakdown && summary.ministry_breakdown.length > 0)
    ? summary.ministry_breakdown
    : ministries.map(m => ({
        ministry: m.name,
        projectCount: m.projects,
        highRiskCount: m.highCritical,
        totalCostCrore: 0,
      }));

  const totalMin = minList.length;
  const totalProjects = minList.reduce((a, m) => a + (m.projectCount || 0), 0);
  const totalHighCritical = minList.reduce((a, m) => a + (m.highRiskCount || 0), 0);
  const largestMin = minList.slice().sort((a, b) => (b.projectCount || 0) - (a.projectCount || 0))[0]?.ministry || '—';
  const visibleMinistries = focus ? minList.filter((m) => m.ministry === focus) : minList;

  return (
    <div className="dashboard-content flex flex-col gap-[16px]">
      <ViewHeading kicker="Ministry Lens" title="Ministry View" sub="Ministry-wise portfolios with exposure and delivery health. Select a ministry for its detail." />
      <LensFocusBar focus={focus} label="Ministry" onClear={() => onDrill('ministry')} onDrill={onDrill} />
      <StatChips items={[
        { label: 'Ministries covered', value: totalMin },
        { label: 'Total projects', value: totalProjects.toLocaleString('en-IN') },
        { label: 'High / Critical projects', value: totalHighCritical },
        { label: 'Largest ministry portfolio', value: largestMin },
      ]} />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-[16px]">
        <DataTableCard
          head={['Ministry', 'Projects', 'High/Critical', 'Portfolio Value', 'Health']}
          rows={visibleMinistries.map((m) => [
            m.ministry,
            m.projectCount,
            m.highRiskCount || 0,
            m.totalCostCrore ? `₹ ${Number(m.totalCostCrore).toLocaleString('en-IN')} Cr` : '—',
            `${Math.max(10, 100 - Math.round(m.avgRiskScore || 30))}%`,
          ])}
          render={{ 4: onTrackCell }}
          onRow={(row) => open({
            title: `${row[0]} — Ministry Profile`,
            intro: 'Live verified ministry telemetry from the scored portfolio.',
            rows: [['Projects', String(row[1])], ['High/Critical projects', String(row[2])], ['Portfolio value', String(row[3])], ['Health metric', String(row[4])]],
          })}
        />
        <ViewMapCard
          title="Projects by Ministry"
          sub="Portfolio exposure across implementing ministries."
          items={(focus ? visibleMinistries : minList).slice(0, 24).map((m) => ({
            name: m.ministry,
            value: m.projectCount || 0,
            metric: String(m.projectCount || 0),
          }))}
          toneMap={() => '#3B82F6'}
        />
      </div>
    </div>
  );
};

const AgencyView = ({ open, liveProjects, onDrill, focus }) => {
  const agencyMap = {};
  (liveProjects || []).forEach(p => {
    const agencyName = (p.agency && p.agency !== 'Not reported') ? p.agency : p.ministry || 'Other Agency';
    if (!agencyMap[agencyName]) {
      agencyMap[agencyName] = { name: agencyName, projects: 0, highRisk: 0, cost: 0 };
    }
    agencyMap[agencyName].projects += 1;
    if (p.riskTier === 'high' || p.riskTier === 'critical') {
      agencyMap[agencyName].highRisk += 1;
    }
    agencyMap[agencyName].cost += (p.revisedCostCrore || p.originalCostCrore || 0);
  });

  const agencyList = Object.values(agencyMap).length > 0
    ? Object.values(agencyMap).sort((a, b) => b.projects - a.projects)
    : agencies.map(a => ({ name: a.name, projects: a.projects, highRisk: a.delayed, cost: 0 }));

  const totalAgencies = agencyList.length;
  const totalProjects = agencyList.reduce((a, x) => a + x.projects, 0);
  const totalHigh = agencyList.reduce((a, x) => a + x.highRisk, 0);
  const largest = agencyList[0]?.name || '—';
  const visibleAgencies = focus ? agencyList.filter((a) => a.name === focus) : agencyList;

  return (
    <div className="dashboard-content flex flex-col gap-[16px]">
      <ViewHeading kicker="Agency Lens" title="Agency View" sub="Implementing agencies with project delivery and risk concentration. Select an agency for detail." />
      <LensFocusBar focus={focus} label="Agency" onClear={() => onDrill('agency')} onDrill={onDrill} />
      <StatChips items={[
        { label: 'Agencies covered', value: totalAgencies },
        { label: 'Total projects', value: totalProjects.toLocaleString('en-IN') },
        { label: 'High / Critical projects', value: totalHigh },
        { label: 'Largest agency', value: largest },
      ]} />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-[16px]">
        <DataTableCard
          head={['Agency', 'Projects', 'High/Critical', 'Portfolio Value']}
          rows={visibleAgencies.map((a) => [
            a.name,
            a.projects,
            a.highRisk,
            a.cost ? `₹ ${Number(Math.round(a.cost)).toLocaleString('en-IN')} Cr` : (a.value || '—'),
          ])}
          onRow={(row) => open({
            title: `${row[0]} — Agency Profile`,
            intro: 'Live telemetry aggregated from canonical project records.',
            rows: [['Projects', String(row[1])], ['High/Critical projects', String(row[2])], ['Portfolio value', String(row[3])]],
          })}
        />
        <ViewMapCard
          title="Projects by Agency"
          sub="Delivery concentration across implementing agencies."
          items={(focus ? visibleAgencies : agencyList).slice(0, 24).map((a) => ({
            name: a.name,
            value: a.projects || 0,
            metric: String(a.projects || 0),
          }))}
          toneMap={() => '#3B82F6'}
        />
      </div>
    </div>
  );
};

/* =====================================================================
   Footer — legal links open real content panels
   ===================================================================== */
const Footer = ({ onLink }) => (
  <footer className="dashboard-footer flex flex-col lg:flex-row justify-between items-center py-4 lg:py-0 h-auto lg:h-[68px] w-full px-6 bg-[#0F172A] border-t border-[#1E293B] shrink-0 text-[#94A3B8] gap-4 lg:gap-0">
    <div className="flex items-center gap-[14px] shrink-0 flex-wrap justify-center lg:justify-start">
      <PragatiLogo isFooter={true} />
      <div className="hidden sm:block w-[1px] h-[20px] bg-[#334155]" />
      <span className="text-[12px] lg:text-[13px] font-normal text-[#94A3B8] whitespace-nowrap">
        National Infrastructure Intelligence
      </span>
    </div>

    <div className="hidden xl:flex items-center gap-[16px] text-[13px] italic font-serif text-[#94A3B8] shrink-0">
      {footerTaglines.map((t, i) => (
        <React.Fragment key={t}>
          {i > 0 && <span className="text-[#334155] font-sans not-italic">|</span>}
          <span>{t}</span>
        </React.Fragment>
      ))}
    </div>

    <div className="flex items-center gap-[12px] lg:gap-[16px] text-[13px] shrink-0 flex-wrap justify-center">
      <div className="hidden lg:flex items-center gap-[12px]">
        {footerLinks.map((l, i) => (
          <React.Fragment key={l.id}>
            {i > 0 && <span className="text-[#334155]">|</span>}
            <button onClick={() => onLink(l)} className="hover:text-white transition-colors whitespace-nowrap">{l.label}</button>
          </React.Fragment>
        ))}
        <span className="text-[#334155]">|</span>
      </div>

      <div className="flex items-center gap-[10px] pl-2 border-l border-[#334155]">
        <NationalEmblem className="w-5 h-7" isFooter={true} />
        <span className="text-[12px] text-[#94A3B8] whitespace-nowrap">Government of India</span>
        <span className="text-[#334155]">|</span>
        <span className="text-[12px] text-[#94A3B8] whitespace-nowrap">MoSPI</span>
      </div>
    </div>
  </footer>
);

/* =====================================================================
   App root — navigation, toasts, panels, downloads, watchlist state
   ===================================================================== */
const WATCHLIST_KEY = 'pragati-national-watchlist';
const formatReportingMonth = (month) => {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return null;
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeNav, setActiveNav] = useState('National Overview');
  const [toast, setToast] = useState('');
  const [panel, setPanel] = useState(null);
  const [summary, setSummary] = useState(null);
  const [stateSummary, setStateSummary] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [liveProjects, setLiveProjects] = useState([]);
  const [lensFocus, setLensFocus] = useState(null);
  const [watchIds, setWatchIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WATCHLIST_KEY));
      return Array.isArray(saved) ? saved : ['p1', 'p2', 'p3'];
    } catch { return ['p1', 'p2', 'p3']; }
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchIds));
  }, [watchIds]);

  useEffect(() => {
    const month = import.meta.env.VITE_REPORTING_MONTH || '2026-06';
    api.summary(month).then(setSummary).catch(() => {});
    api.stateSummary(month).then(setStateSummary).catch(() => {});
    api.alerts(month).then(setAlerts).catch(() => {});
    api.projects(month).then(setLiveProjects).catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg) => setToast(msg);
  const open = (p) => setPanel(p);

  /* Header tab → shows the tab workspace (sidebar resets to overview) */
  const handleTab = (tab) => { 
    // Navigate to the correct page based on tab selection
    const routeMap = {
      'Overview': '#/dashboard',
      'Watchlist': '#/watchlist',
      'Projects': '#/project',
    };
    
    if (routeMap[tab]) {
      window.location.hash = routeMap[tab];
    }
    
    setActiveTab(tab); 
    setActiveNav('National Overview'); 
  };
  /* Sidebar nav → shows the nav workspace (a complete view, not a modal) */
  const handleNav = (nav) => {
    setActiveNav(nav);
    setActiveTab('Overview');
  };

  const toggleWatch = (id) => {
    setWatchIds(ids => {
      if (ids.includes(id)) { showToast('Removed from watchlist'); return ids.filter(x => x !== id); }
      showToast('Added to watchlist'); return [...ids, id];
    });
  };

  const exportCsv = () => {
    const projectList = (liveProjects && liveProjects.length > 0) ? liveProjects : projects;
    downloadFile(
      'pragati-projects-apr2026.csv',
      toCsv([['Project', 'Sector', 'State', 'Risk Score', 'Risk Tier', 'Progress %', 'Cost (Cr)', 'Schedule Slip (Months)'],
        ...projectList.map(p => [
          p.name,
          p.sector,
          p.state,
          p.riskScore !== undefined ? p.riskScore : p.risk,
          p.riskTier !== undefined ? p.riskTier : p.level,
          p.physicalProgress !== undefined ? p.physicalProgress : p.progress,
          p.revisedCostCrore || p.cost,
          p.scheduleSlipMonths !== undefined ? p.scheduleSlipMonths : p.schedule
        ])]),
      'text/csv;charset=utf-8;'
    );
    showToast('Project register exported (CSV)');
  };

  const generateReport = () => {
    const lines = [
      'PRAGATI — National Infrastructure Briefing (Live Telemetry)',
      '='.repeat(60),
      '',
      `Reporting Cycle: ${summary?.month || '2026-06'}`,
      `Monitored Projects: ${summary?.total_projects || 1773}`,
      `High Priority Portfolio (High + Critical): ${(summary?.high_risk_count || 0) + (summary?.critical_risk_count || 0)}`,
      `Portfolio Value: ₹ ${Number(summary?.total_cost_current_cr || 0).toLocaleString('en-IN')} Cr`,
      '',
      'Risk distribution:',
      `  - Critical: ${summary?.critical_risk_count || 0} projects`,
      `  - High: ${summary?.high_risk_count || 0} projects`,
      `  - Medium: ${summary?.tier_counts?.Medium || 0} projects`,
      `  - Low: ${summary?.tier_counts?.Low || 0} projects`,
      '',
      'Active warnings count: ' + (alerts?.length || 0),
      '',
      'Generated live from verified MoSPI scored records.',
    ];
    downloadFile('pragati-briefing.txt', lines.join('\n'), 'text/plain;charset=utf-8;');
    showToast('Briefing report generated');
  };

  const exportCycle = () => {
    downloadFile(
      'pragati-cycle-apr2026.csv',
      toCsv([['Source', 'Records', 'Status'], ...dataUpdate.uploads.map(u => [u.source, u.rows, u.status])]),
      'text/csv;charset=utf-8;'
    );
    showToast('Cycle data exported (CSV)');
  };

  const openProject = (p) => open({
    title: p.name, intro: `${p.sector} · ${p.state}`,
    rows: [
      ['Risk score', String(p.riskScore !== undefined ? p.riskScore : p.risk)],
      ['Risk level', String(p.riskTier !== undefined ? p.riskTier : p.level)],
      ['Physical progress', `${p.physicalProgress !== undefined ? p.physicalProgress : p.progress}%`],
      ['Sanctioned cost', String(p.revisedCostCrore || p.cost)],
      ['Dominant Risk', String(p.dominantRisk || 'Schedule')],
    ],
  });

  /* Drill-through: clicking a row/chip in any view opens the FULL filtered
     view (never a small hover/modal) — the whole dashboard stays connected. */
  const handleDrill = (kind, value) => {
    if (kind === 'state') {
      setActiveNav('State View'); setActiveTab('Overview'); setLensFocus(value || null); showToast(value ? `State View — ${value}` : 'State View');
    } else if (kind === 'sector') {
      setActiveNav('Sector View'); setActiveTab('Overview'); setLensFocus(value || null); showToast(value ? `Sector View — ${value}` : 'Sector View');
    } else if (kind === 'ministry') {
      setActiveNav('Ministry View'); setActiveTab('Overview'); setLensFocus(value || null); showToast(value ? `Ministry View — ${value}` : 'Ministry View');
    } else if (kind === 'agency') {
      setActiveNav('Agency View'); setActiveTab('Overview'); setLensFocus(value || null); showToast(value ? `Agency View — ${value}` : 'Agency View');
    } else if (kind === 'project' && value) {
      window.location.hash = `#/project?id=${value}`;
    } else if (kind === 'early-warnings') {
      window.location.hash = '#/early-warnings';
    } else if (kind === 'data-update') {
      window.location.hash = '#/data-update';
    }
  };

  /* Main workspace selection: the four real sidebar views + overview.
     Header tabs are page links — they navigate between the four pages. */
  const workspace = (
    <NationalOverviewContent
      open={open}
      exportCsv={exportCsv}
      generateReport={generateReport}
      go={handleTab}
      summary={summary}
      stateSummary={stateSummary}
      alerts={alerts}
      liveProjects={liveProjects}
      onDrill={handleDrill}
      activeNav={activeNav}
      focus={lensFocus}
    />
  );

  return (
    <div className="dashboard-root min-h-screen w-full bg-[#F8FAFC] font-sans antialiased flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:wght@700;800&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Merriweather', 'Playfair Display', serif; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        /* Recolors the authentic emblem asset for the dark footer via
           CSS filter only — the SVG asset itself is never modified. */
        .national-emblem-white { filter: brightness(0) invert(1); }

        @media (min-width: 1200px) and (min-height: 700px) {
          /* Zoom calibration: at 100% browser zoom the page renders exactly
             like the approved 90%-zoom look (same approach as Project Detail).
             Height is compensated by 1/zoom so the footer still paints on the
             true viewport bottom instead of ~10% above it. */
          .dashboard-root { zoom: 0.9; min-height: calc(100vh / 0.9); }
          .dashboard-header { height: 52px; padding-left: 16px; padding-right: 16px; }
          .dashboard-header nav button { height: 52px; font-size: 11px; }
          .dashboard-header .w-\[30px\] { width: 26px; height: 26px; }
          .dashboard-hero { height: 72px; padding-left: 16px; padding-right: 16px; }
          .dashboard-hero h1 { font-size: 18px; }
          .dashboard-hero p { font-size: 11px; }
          .dashboard-footer { height: 42px; padding-left: 16px; padding-right: 16px; }
          .dashboard-footer span,
          .dashboard-footer button { font-size: 10px; }
          .dashboard-main { padding: 10px 14px; }
          .dashboard-shell aside { height: calc(100% - 15px); align-self: flex-start; }
          .dashboard-shell aside > div:first-child { height: 309px; }
          .dashboard-shell aside { justify-content: flex-start; }
          .dashboard-shell aside > nav { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; }
          .dashboard-shell aside > nav button { min-height: 38px; padding-top: 3px; padding-bottom: 3px; font-size: 10px; }
          .dashboard-shell aside > nav button svg { width: 15px; height: 15px; margin-bottom: 2px; }
          .dashboard-shell aside > div:last-child { height: auto; min-height: 190px; flex: 0 0 205px; align-self: flex-end; }
          .dashboard-content { gap: 8px; }
          .dashboard-content > div:first-child { gap: 8px; }
          .dashboard-content > div:first-child h2 { font-size: 22px; }
          .dashboard-content > div:first-child p { font-size: 11px; }
          .dashboard-content > div:first-child > div:last-child { gap: 6px; }
          /* KPI cards render as <button> elements — target them directly. */
          .dashboard-content > div:first-child > div:last-child > button { min-width: 135px; padding: 6px; }
          .dashboard-content > div:first-child > div:last-child > button span:first-child { font-size: 17px; }
          .dashboard-content > div:first-child > div:last-child > button span { font-size: 10px; }
          .dashboard-content > div:first-child > div:last-child > button .w-\[30px\] { width: 25px; height: 25px; }
          .dashboard-content > div:first-child > div:last-child > button { height: 68px; padding: 4px 6px; }
          .dashboard-content > div:first-child > div:last-child > button > div:last-child { margin-top: 2px; font-size: 9px; }
          .dashboard-content > div:first-child > div:last-child > button > div:last-child svg { width: 10px; height: 10px; }
          .dashboard-content > div:nth-child(2),
          .dashboard-bottom-grid { gap: 8px; }
          .dashboard-content > div:nth-child(2) { grid-template-columns: 2.31fr 1.37fr 1fr; height: 373px; }
          .dashboard-content > div:nth-child(2) > * { height: 373px; min-height: 0; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack { height: 373px; }
          .dashboard-side-stack { gap: 8px; }
          .dashboard-content .bg-white.border { padding: 9px; }
          .dashboard-map-card { overflow: hidden; }
          .dashboard-map-card > div:first-child { flex: 1; min-height: 0; display: flex; flex-direction: column; }
          .dashboard-map-card .hm-wrap { flex: 1; min-height: 0; height: auto; }
          .dashboard-map-card .hm-wrap > div:last-child { flex: 1 1 0 !important; height: auto !important; min-height: 0; }
          .dashboard-side-stack h3,
          .dashboard-bottom-grid h3 { font-size: 11.5px; }
          .dashboard-side-stack .w-\[110px\] { width: 78px; height: 78px; }
          .dashboard-side-stack .text-[11.5px] { font-size: 9px; }
          .dashboard-side-stack .text-[13.5px] { font-size: 11.5px; }
          .dashboard-side-stack [class*="gap-1.5"] { gap: 2px; font-size: 9px; }
          .dashboard-side-stack [class*="gap-1.5"] > div { min-height: 14px; }
          .dashboard-side-stack [class*="gap-2.5"] { gap: 4px; font-size: 10px; }
          .dashboard-side-stack [class*="gap-2.5"] .w-6 { width: 20px; height: 20px; }
          .dashboard-side-stack [class*="gap-2.5"] p { font-size: 10px; }
          .dashboard-side-stack [class*="gap-2.5"] span { font-size: 8.5px; }
          .dashboard-side-stack [class*="gap-2.5"] > div { padding-bottom: 4px; }
          .dashboard-side-stack [class*="mt-3"] { margin-top: 6px; padding-top: 5px; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(2) > div:first-child { height: 173px; display: flex; flex-direction: column; overflow: hidden; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(2) > div:last-child { height: 192px; display: flex; flex-direction: column; overflow: hidden; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(3) > div:first-child { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(3) > div:first-child > div:nth-child(2) { gap: 3px; font-size: 9.5px; overflow: hidden; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(3) > div:first-child > div:nth-child(2) > div { padding-bottom: 3px; }
          .dashboard-changes-list { min-height: 0; flex: 1 1 auto; gap: 2.5px !important; scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
          .dashboard-changes-list > div { padding-bottom: 2px; }
          .dashboard-changes-list p { line-height: 1.2 !important; }
          .dashboard-changes-list span { margin-top: 0 !important; line-height: 1.2 !important; }
          .dashboard-changes-list > div > div:first-child { margin-top: 0 !important; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(3) > div:first-child .w-6 { width: 18px; height: 18px; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(3) > div:last-child { height: 95px; padding: 8px; overflow: hidden; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(3) > div:last-child .w-\[70px\] { width: 52px; height: 52px; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(3) > div:last-child p { font-size: 10px; line-height: 1.25; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(2) > div > div:last-child { margin-top: auto; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(2) > div > div:last-child { height: 20px; margin-top: auto; padding-top: 2px; line-height: 1; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(2) > div:nth-child(2) > div:nth-child(2) { gap: 0; }
          .dashboard-content > div:nth-child(2) > .dashboard-side-stack:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div { height: 12px; line-height: 12px; }
          .dashboard-bottom-grid .text-[11.5px] { font-size: 9.5px; }
          .dashboard-bottom-grid th,
          .dashboard-bottom-grid td { padding-top: 3px; padding-bottom: 3px; }
          .dashboard-bottom-grid .p-\\[16px\\] { padding: 9px; }
          .dashboard-bottom-grid .p-\\[2\\.5px\\] { padding: 4px; }
          .dashboard-bottom-grid .mb-3 { margin-bottom: 5px; }
          .dashboard-bottom-grid table th,
          .dashboard-bottom-grid table td { line-height: 1.15; }
          .dashboard-bottom-grid > div { height: 195px; }
          .dashboard-bottom-grid { grid-template-columns: 2.1fr 2.6fr 1.28fr; }
          .dashboard-bottom-grid > div:nth-child(3) .grid { grid-auto-rows: 62px; }
          .dashboard-bottom-grid > div:nth-child(3) .grid > button { min-height: 0; height: 62px; }
        }
      `}</style>

      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        onTab={handleTab}
        lang={language.toLowerCase()}
        onLang={(code) => setLanguage(code.toUpperCase())}
        t={t}
        onOpenProject={openProject}
        onToast={showToast}
        onGo={handleTab}
        liveProjects={liveProjects}
      />

      {/* Middle Body Area with Sidebar and Main Workspace */}
      <div className="dashboard-shell flex w-full flex-1">
        <Sidebar activeNav={activeNav} setActiveNav={handleNav} />

        <div className="flex-1 flex flex-col bg-[#F8FAFC]">
          {/* Hero Banner Section */}
          <HeroBanner t={t} cycle={formatReportingMonth(summary?.month)} onMethodology={() => open({
            title: methodology.title,
            intro: methodology.intro,
            table: { head: ['Factor', 'Weight', 'What it measures'], rows: methodology.factors.map(f => [f.name, f.weight, f.detail]) },
          })} />

          {/* Main Workspace Area */}
          <main className="dashboard-main flex-1 p-4 lg:p-6 bg-[#F8FAFC]">
            {workspace}
          </main>
        </div>
      </div>

      {/* Footer Component */}
      <Footer onLink={(l) => open({ title: l.label, intro: l.body })} />

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[95] -translate-x-1/2 rounded-lg bg-[#0F172A] px-4 py-2 text-xs font-medium text-white shadow-lg" role="status">
          {toast}
        </div>
      )}

      <DetailPanel panel={panel} onClose={() => setPanel(null)} />
    </div>
  );
}
