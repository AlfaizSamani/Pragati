import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full bg-primary-container text-on-primary py-2 flex-none shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
      <div className="w-full px-margin-lg flex flex-col md:flex-row items-center justify-between gap-gutter font-body-sm text-body-sm">
        <div className="flex items-center gap-space-sm">
          <span className="font-title-sm text-title-sm text-on-primary font-bold">PRAGATI</span>
          <span className="text-on-primary-container">|</span>
          <span className="font-body-sm text-body-sm text-on-primary-container">National Infrastructure Intelligence</span>
        </div>
        <div className="hidden lg:block font-body-sm text-body-sm text-on-primary-container text-center tracking-wide">
          Predictive Risk &amp; Governance | Stronger Projects | A More Resilient India
        </div>
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-space-sm text-on-primary-container font-label-md text-label-md">
            <a className="hover:text-on-primary transition-colors" href="#">Privacy</a>
            <span>|</span>
            <a className="hover:text-on-primary transition-colors" href="#">Terms</a>
            <span>|</span>
            <a className="hover:text-on-primary transition-colors" href="#">Accessibility</a>
            <span>|</span>
            <a className="hover:text-on-primary transition-colors" href="#">Help</a>
          </div>
          <div className="flex items-center gap-space-xs pl-space-sm py-space-xs px-space-sm bg-surface-container-highest/10 rounded-lg">
            <span className="material-symbols-outlined text-[18px] text-secondary-fixed">assured_workload</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary font-semibold">
              Govt. of India • MoSPI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
