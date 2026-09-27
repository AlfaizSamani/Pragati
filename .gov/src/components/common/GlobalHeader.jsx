import React, { useState, useRef } from 'react';
import { Search, Bell, Globe, ChevronDown } from 'lucide-react';
import ashokaEmblemUrl from '../../assets/ashoka-emblem.svg';
import { LANGUAGE_OPTIONS, useLanguage } from '../../context/LanguageContext';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '#/dashboard' },
  { id: 'watchlist', label: 'Watchlist', href: '#/watchlist' },
  { id: 'projects', label: 'Projects', href: '#/project' },
  { id: 'early-warnings', label: 'Early Warnings', href: '#/early-warnings' },
  { id: 'analytics', label: 'Analytics', href: '#/analytics' },
  { id: 'intelligence', label: 'Intelligence', href: '#/intelligence' },
  { id: 'data-update', label: 'Data Update', href: '#/data-update' },
];

export const NationalEmblem = ({ className = "w-6 h-8", isFooter = false }) => (
  <div className={`flex items-center justify-center shrink-0 select-none ${className}`}>
    <img
      src={ashokaEmblemUrl}
      alt="State Emblem of India"
      draggable="false"
      className={`h-full w-auto max-w-none ${isFooter ? 'national-emblem-white' : ''}`}
    />
  </div>
);

export const PragatiLogo = ({ isFooter = false }) => (
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

export default function GlobalHeader({ activeId = 'overview', searchValue, onSearchChange }) {
  const { language, setLanguage, t } = useLanguage();
  const [localQuery, setLocalQuery] = useState('');
  const isControlled = searchValue !== undefined;
  const query = isControlled ? searchValue : localQuery;
  const setQuery = (value) => {
    if (!isControlled) setLocalQuery(value);
    if (onSearchChange) onSearchChange(value);
  };
  const [openMenu, setOpenMenu] = useState(null);
  const [notifCount, setNotifCount] = useState(3);
  const searchRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const sampleResults = [
    { id: '1', name: 'Mumbai-Ahmedabad High Speed Rail (MAHSR)', state: 'Maharashtra', sector: 'Railways', risk: 87, level: 'High' },
    { id: '2', name: 'Mumbai Trans Harbour Link (MTHL) Extension', state: 'Maharashtra', sector: 'Road Transport', risk: 81, level: 'High' },
    { id: '3', name: 'Pune Metro Phase II', state: 'Maharashtra', sector: 'Urban Transport', risk: 76, level: 'High' },
    { id: '4', name: 'Nagpur Metro Phase II', state: 'Maharashtra', sector: 'Urban Transport', risk: 62, level: 'Medium' },
    { id: '5', name: 'Eastern Freight Corridor', state: 'Bihar', sector: 'Railways', risk: 76, level: 'High' },
  ];

  const q = query.trim().toLowerCase();
  const results = q.length >= 1
    ? sampleResults.filter(p => p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.sector.toLowerCase().includes(q))
    : [];

  return (
    <header className="dashboard-header flex flex-col lg:flex-row justify-between items-center py-2 lg:py-0 lg:h-[50px] w-full px-4 lg:px-6 bg-[#FFFFFF] border-b border-[#E2E8F0] shrink-0 z-30 gap-2 lg:gap-0 box-border">
      {/* Brand: Ashoka Emblem + PRAGATI Logo + Divider + Subtitle */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-[8px] shrink-0">
        <div className="flex items-center gap-[8px]">
          <NationalEmblem className="w-6 h-8" />
          <a href="#/" aria-label="Go to PRAGATI home" className="flex items-center">
            <PragatiLogo />
          </a>
          <div className="hidden sm:block w-[1px] h-[30px] bg-[#CBD5E1] ml-2 mr-2" />
          <div className="hidden sm:flex flex-col justify-center text-[10.5px] text-[#0F172A] leading-[1.2] font-sans whitespace-nowrap">
            <span>National Infrastructure</span>
            <span>Intelligence</span>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav className="flex items-center gap-[12px] lg:gap-[16px] mx-auto overflow-x-auto w-full lg:w-auto justify-start lg:justify-center py-1 lg:py-0 scrollbar-none">
        {NAV_ITEMS.map((tab) => {
          const isActive = activeId.toLowerCase().replace(/[\s_]+/g, '-') === tab.id;
          return (
            <a
              key={tab.id}
              href={tab.href}
              className={`group relative inline-flex items-center h-[38px] lg:h-[50px] text-[12px] lg:text-[13.5px] font-[500] transition-colors duration-200 outline-none whitespace-nowrap px-1 ${
                isActive ? 'text-[#0F172A] font-[700]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span className="relative z-10">{t(tab.label)}</span>
              <span
                className={`absolute bottom-[2px] left-0 h-[3px] w-full origin-left rounded-full bg-[#F97316] transition-all duration-300 ease-out ${
                  isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                }`}
              />
            </a>
          );
        })}
      </nav>

      {/* Right Controls: Search, Lang, Notifs, Profile */}
      <div className="flex items-center gap-[10px] lg:gap-[16px] shrink-0 w-full lg:w-auto justify-end pb-1 lg:pb-0">
        <div className="relative hidden sm:flex items-center w-[140px] lg:w-[190px] h-[34px] bg-white border border-[#E2E8F0] rounded-[6px] px-[10px] py-[6px]">
          <Search className="w-3.5 h-3.5 text-[#0F172A] shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            placeholder="Search projects..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full h-full bg-transparent border-none outline-none text-[12px] text-[#0F172A] placeholder-[#94A3B8] ml-2 truncate"
          />
          {searchFocused && results.length > 0 && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-[290px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-[80] overflow-hidden">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B] border-b border-[#F1F5F9]">
                {results.length} matching project{results.length > 1 ? 's' : ''}
              </div>
              {results.map((p) => (
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
                  <span className="block text-[10.5px] text-[#64748B]">{p.state} · {p.sector} · Risk {p.risk}%</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language */}
        <div className="relative hidden md:block">
          <button
            className="flex items-center gap-1 text-[12.5px] font-[500] text-[#0F172A] hover:opacity-85 transition-opacity"
            onClick={() => setOpenMenu(openMenu === 'lang' ? null : 'lang')}
          >
            <Globe className="w-3.5 h-3.5 text-[#0F172A]" />
            <span>{language}</span>
            <ChevronDown className="w-3 h-3 text-[#0F172A]" />
          </button>
          {openMenu === 'lang' && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setOpenMenu(null)} />
              <div className="absolute top-[calc(100%+8px)] right-0 w-[130px] bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl z-[80] p-[4px]">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    className={`block w-full text-left text-[12px] font-[500] px-[8px] py-[6px] rounded-[4px] transition-colors ${
                      language === option.code ? 'bg-[#F8FAFC] text-[#0F172A] font-[700]' : 'hover:bg-[#F8FAFC] text-[#334155]'
                    }`}
                    onClick={() => { setLanguage(option.code); setOpenMenu(null); }}
                  >
                    {option.label} <span className="text-[10px] text-[#64748B]">({option.code})</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative flex items-center justify-center w-[20px] h-[20px] text-[#0F172A] hover:opacity-85 transition-opacity"
            onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#0F172A]" />
            {notifCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-[15px] h-[15px] rounded-full bg-[#DC2626] text-[9.5px] font-bold text-white leading-none border border-white">
                {notifCount}
              </span>
            )}
          </button>
          {openMenu === 'notif' && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setOpenMenu(null)} />
              <div className="absolute top-[calc(100%+10px)] right-0 w-[280px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl z-[80] py-[8px]">
                <div className="px-[12px] pb-[6px] text-[11.5px] font-bold text-[#0F172A] flex justify-between items-center">
                  <span>Notifications</span>
                  <button className="text-[10px] text-blue-600 font-semibold" onClick={() => setNotifCount(0)}>Clear all</button>
                </div>
                <div className="px-[12px] py-2 border-t border-[#F1F5F9] text-[11px] text-[#334155]">
                  <p className="font-semibold text-[#DC2626]">MAHSR review due</p>
                  <p className="text-[10px] text-[#64748B]">Risk score crossed 85%.</p>
                </div>
                <div className="px-[12px] py-2 border-t border-[#F1F5F9] text-[11px] text-[#334155]">
                  <p className="font-semibold text-[#F97316]">April 2026 published</p>
                  <p className="text-[10px] text-[#64748B]">Scored dataset updated.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <div className="flex items-center gap-[8px] pl-[8px] border-l border-[#E2E8F0] text-left">
            <div className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-[#0F172A] text-white text-[11.5px] font-[600] shrink-0">
              AS
            </div>
            <div className="hidden xl:flex flex-col justify-center whitespace-nowrap">
              <span className="text-[11.5px] font-[600] text-[#0F172A] leading-tight">A. Sharma</span>
              <span className="text-[9.5px] font-[400] text-[#64748B] leading-tight">MoSPI Officer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
