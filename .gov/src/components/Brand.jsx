import React from "react";
import ashokaEmblemUrl from "../assets/ashoka-emblem.svg";

/**
 * PRAGATI shared brand block — the authentic State Emblem of India
 * (static public-domain asset) + the serif PRAGATI wordmark with the
 * orange ascending dash. Used identically across all four pages.
 */
export default function Brand({ emblemClass = "w-6 h-8", nameClass = "text-[18px] md:text-[22px]", dark = false }) {
  return (
    <div className="flex items-center gap-[8px] select-none shrink-0">
      <div className={`flex items-center justify-center shrink-0 ${emblemClass}`}>
        <img
          src={ashokaEmblemUrl}
          alt="State Emblem of India"
          draggable="false"
          className="h-full w-auto max-w-none"
        />
      </div>
      <div className="relative inline-flex items-center font-serif tracking-wider font-bold">
        <span className={`${nameClass} uppercase ${dark ? "text-white" : "text-[#0F172A]"}`}>PRAGATI</span>
        <svg className="absolute top-0.5 -left-1 w-[105%] h-[120%] pointer-events-none" viewBox="0 0 140 45" fill="none">
          <path d="M 18 34 L 105 8" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
          <polygon points="101,4 112,6 106,14" fill="#F97316" />
        </svg>
      </div>
    </div>
  );
}
