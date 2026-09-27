import React from "react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-margin-lg flex items-center justify-between gap-gutter">
        <div className="flex items-center gap-space-md shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-low text-primary">
            <span className="material-symbols-outlined text-[28px]">account_balance</span>
          </div>
          <a className="flex flex-col" href="#/" aria-label="Go to PRAGATI home">
            <span className="font-headline-md text-headline-md text-primary tracking-tight leading-none">PRAGATI</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-space-xs">National Infrastructure Intelligence</span>
          </a>
        </div>
        <nav className="hidden xl:flex items-center gap-space-xs p-space-xs bg-surface-container rounded-lg" data-active-classes="bg-primary-container text-on-primary font-bold rounded-lg shadow-sm">
          <a className="px-space-md py-space-xs font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="overview" href="#/dashboard">Overview</a>
          <a className="px-space-md py-space-xs font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="watchlist" href="#/watchlist">Watchlist</a>
          <a className="px-space-md py-space-xs font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="projects" href="#/project">Projects</a>
          <a className="px-space-md py-space-xs font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="early-warnings" href="#/early-warnings">Early Warnings</a>
          <a className="px-space-md py-space-xs font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="analytics" href="#/analytics">Analytics</a>
          <a aria-current="page" className="px-space-md py-space-xs transition-colors bg-primary-container text-on-primary font-bold rounded-lg shadow-sm" data-path="intelligence" href="#/intelligence">Intelligence</a>
          <a className="px-space-md py-space-xs font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="data-update" href="#/data-update">Data Update</a>
        </nav>
        <div className="flex items-center gap-space-md shrink-0">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input className="w-64 pl-8 pr-space-md py-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface rounded-lg outline-none placeholder:text-on-surface-variant" placeholder="Search projects, states, sectors..." type="text"/>
          </div>
          <button className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low rounded-lg font-label-md text-label-md text-on-surface" type="button">
            <span className="material-symbols-outlined text-[16px]">language</span>
            <span>EN</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          <button aria-label="Notifications" className="relative p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" type="button">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-secondary-container text-on-primary font-label-sm text-label-sm flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-title-sm text-title-sm text-on-primary">AS</div>
            <div className="hidden md:flex flex-col text-left">
              <span className="font-title-sm text-title-sm text-on-surface leading-tight">A. Sharma</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">MoSPI Officer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
