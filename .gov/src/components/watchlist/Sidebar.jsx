import React from "react";
import { SlidersHorizontal, Bookmark } from "lucide-react";
import { lensOptions, savedViews } from "../../data/watchlistData";
import { ICONS } from "./icons";
import sideHighwayUrl from "../../assets/side-highway.jpg";

export default function Sidebar({ activeLens, onLensChange, activeSavedView, onSavedViewChange }) {
  return (
    <aside className="pg-left-side">
      <div className="pg-side-card">
        <div className="pg-side-title">
          <SlidersHorizontal size={14} />
          Investigation Lens
        </div>
        {lensOptions.map((lens) => {
          const Icon = ICONS[lens.icon];
          const isActive = activeLens === lens.id;
          return (
            <button
              key={lens.id}
              className={`pg-lens-item ${isActive ? "active" : ""}`}
              onClick={() => onLensChange(lens.id)}
            >
              <Icon size={15} />
              {lens.label}
            </button>
          );
        })}
      </div>

      <div className="pg-side-card">
        <div className="pg-side-title">
          <Bookmark size={14} />
          Saved Views
        </div>
        {savedViews.map((view) => (
          <button
            key={view.id}
            className={`pg-saved-row ${activeSavedView === view.id ? "active" : ""}`}
            onClick={() => onSavedViewChange(view.id)}
          >
            <span>{view.label}</span>
            <span className="count">{view.count}</span>
          </button>
        ))}
      </div>

      <div className="pg-promo-card">
        <img className="pg-promo-photo" src={sideHighwayUrl} alt="" draggable="false" />
        <p>Monitoring today for a stronger tomorrow.</p>
      </div>
    </aside>
  );
}
