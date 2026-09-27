import React from "react";
import { Maximize2, ArrowRight } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

// Marker positions per station count, as fractions of the map box.
// Five stations trace the reference's north-to-south route.
const LAYOUTS = {
  5: [
    { x: 30, y: 10 },
    { x: 36, y: 30 },
    { x: 42, y: 52 },
    { x: 44, y: 68 },
    { x: 52, y: 86 },
  ],
  4: [
    { x: 32, y: 12 },
    { x: 40, y: 38 },
    { x: 44, y: 62 },
    { x: 52, y: 86 },
  ],
  3: [
    { x: 34, y: 14 },
    { x: 44, y: 50 },
    { x: 52, y: 86 },
  ],
};

export default function ProjectCorridorMap({ project, onToast, onExpand, standalone }) {
  const c = ui.corridor;
  const positions = LAYOUTS[project.stations.length] || LAYOUTS[5];
  const points = project.stations.map((name, i) => ({
    name,
    ...positions[i % positions.length],
  }));

  // Route bends gently from one station to the next like a rail alignment.
  const pathD = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const midX = (prev.x + p.x) / 2;
      return `Q ${midX} ${prev.y} ${p.x} ${p.y}`;
    })
    .join(" ");

  const mapBox = (
    <div className="pd-map-box">
      <button
        className="pd-map-expand"
        onClick={() => (onExpand ? onExpand() : onToast(c.expandToast))}
      >
        <Maximize2 size={13} />
      </button>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pd-map-terrain">
        {/* sea west of the coast */}
        <rect width="100" height="100" fill="#8fb6c9" />
        {/* landmass */}
        <path
          d="M22 0 L100 0 L100 100 L34 100 Q28 84 34 70 Q40 56 34 44 Q28 30 24 18 Z"
          fill="#e8e4d8"
        />
        {/* higher ground / hills tint */}
        <path d="M45 0 L100 0 L100 62 Q78 52 66 34 Q56 20 45 0 Z" fill="#dcd8c6" opacity="0.8" />
        {/* greener patches */}
        <path d="M34 52 Q48 46 60 54 Q72 62 82 58 L82 100 L34 100 Q28 84 34 70 Z" fill="#d3dcc2" opacity="0.75" />
        <path d="M60 8 Q74 14 86 10 L100 14 L100 30 Q84 26 72 22 Q64 16 60 8 Z" fill="#cfd9bd" opacity="0.6" />
      </svg>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pd-map-route">
        <path d={pathD} fill="none" stroke="#d64545" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {points.map((p, i) => (
        <div className="pd-map-marker" style={{ left: `${p.x}%`, top: `${p.y}%` }} key={i}>
          <span className="label">{p.name}</span>
          <span className="dot" />
        </div>
      ))}
    </div>
  );

  const legend = (
    <div className="pd-map-legend">
      <span>
        <span className="swatch dot" /> {c.legendStation}
      </span>
      <span>
        <span className="swatch line" /> {c.legendAlignment}
      </span>
    </div>
  );

  // Standalone mode (Geography tab): map + legend only, no card chrome.
  if (standalone) {
    return (
      <div>
        {mapBox}
        {legend}
      </div>
    );
  }

  return (
    <div className="pd-card">
      <div className="pd-card-title-row">
        <div className="pd-card-title">{c.title}</div>
        <button className="pd-link" onClick={() => onToast(c.viewOnMapToast)}>
          {c.viewOnMap} <ArrowRight size={12} />
        </button>
      </div>
      {mapBox}
      {legend}
    </div>
  );
}
