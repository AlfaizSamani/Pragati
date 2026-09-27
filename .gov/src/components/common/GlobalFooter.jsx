import React from "react";
import { NationalEmblem, PragatiLogo } from "./GlobalHeader";

const DEFAULT_TAGLINES = ["Predictive Risk & Governance", "Stronger Projects", "A More Resilient India"];
const DEFAULT_LINKS = [
  { id: "privacy", label: "Privacy" },
  { id: "terms", label: "Terms" },
  { id: "accessibility", label: "Accessibility" },
  { id: "help", label: "Help" },
];

/**
 * Single shared footer used by every page so branding, taglines,
 * legal links and the Government of India block always match.
 * `links` items may be `{ id, label }` objects or plain strings;
 * `onLink` receives the clicked link item.
 */
export default function GlobalFooter({ onLink, links = DEFAULT_LINKS, taglines = DEFAULT_TAGLINES }) {
  return (
    <footer className="dashboard-footer mt-auto flex flex-col lg:flex-row justify-between items-center py-4 lg:py-0 h-auto lg:h-[68px] w-full px-6 bg-[#0F172A] border-t border-[#1E293B] shrink-0 text-[#94A3B8] gap-4 lg:gap-0">
      <div className="flex items-center gap-[14px] shrink-0 flex-wrap justify-center lg:justify-start">
        <PragatiLogo isFooter={true} />
        <div className="hidden sm:block w-[1px] h-[20px] bg-[#334155]" />
        <span className="text-[12px] lg:text-[13px] font-normal text-[#94A3B8] whitespace-nowrap">
          National Infrastructure Intelligence
        </span>
      </div>

      <div className="hidden xl:flex items-center gap-[16px] text-[13px] italic font-serif text-[#94A3B8] shrink-0">
        {taglines.map((t, i) => (
          <React.Fragment key={t}>
            {i > 0 && <span className="text-[#334155] font-sans not-italic">|</span>}
            <span>{t}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-[12px] lg:gap-[16px] text-[13px] shrink-0 flex-wrap justify-center">
        <div className="hidden lg:flex items-center gap-[12px]">
          {links.map((l, i) => {
            const label = typeof l === "string" ? l : l.label;
            return (
              <React.Fragment key={typeof l === "string" ? l : l.id ?? label}>
                {i > 0 && <span className="text-[#334155]">|</span>}
                <button
                  onClick={() => onLink?.(l)}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {label}
                </button>
              </React.Fragment>
            );
          })}
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
}
