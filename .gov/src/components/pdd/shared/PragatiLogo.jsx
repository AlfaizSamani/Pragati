import React from "react";

/**
 * PRAGATI wordmark — serif uppercase logotype with the orange ascending
 * dash, exactly as rendered on the National Dashboard page. Shared
 * across all four PRAGATI pages for brand consistency.
 */
export default function PragatiLogo({ isFooter = false, fontSize }) {
  return (
    <div className="relative inline-flex items-center select-none font-serif tracking-wider font-bold h-full">
      <span
        className={`uppercase ${isFooter ? "text-white" : "text-[#0F172A]"}`}
        style={fontSize ? { fontSize } : undefined}
      >
        PRAGATI
      </span>
      <svg
        className="absolute top-0.5 -left-1 w-[105%] h-[120%] pointer-events-none"
        viewBox="0 0 140 45"
        fill="none"
      >
        <path d="M 18 34 L 105 8" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
        <polygon points="101,4 112,6 106,14" fill="#F97316" />
      </svg>
    </div>
  );
}
