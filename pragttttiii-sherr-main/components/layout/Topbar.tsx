import { Search, Bell, User, Command } from 'lucide-react';
import { MobileNav } from './MobileNav';

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile hamburger menu */}
      <div className="flex lg:hidden">
        <MobileNav />
      </div>

      <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
        {/* Search Field */}
        <form className="flex flex-1 max-w-md" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search projects...
          </label>
          <div className="relative flex flex-1 items-center bg-slate-50/80 border border-slate-200/80 rounded-xl px-3 py-1.5 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition-all">
            <Search
              className="pointer-events-none h-4 w-4 text-slate-400 mr-2 shrink-0"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-full w-full border-0 bg-transparent py-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 text-xs outline-none"
              placeholder="Search projects, states, ministries, or project IDs..."
              type="search"
              name="search"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shrink-0 ml-1">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </form>
        
        {/* Right Tools & Profile */}
        <div className="flex items-center gap-x-3 sm:gap-x-5">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-[11px] font-mono text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>JUNE 2026 CYCLE</span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-all"
            title="Operational Alerts"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-4 h-4" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-5 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profile */}
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              className="flex items-center gap-2.5 p-1 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-all group"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-royal to-sky-800 flex items-center justify-center border border-sky-600/30 text-white shadow-xs group-hover:scale-105 transition-transform">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden lg:flex lg:flex-col lg:items-start text-left">
                <span className="text-xs font-bold leading-none text-slate-900" aria-hidden="true">
                  Official User
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                  PMO / Ministry Official
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

