import React from "react";
import { Home, MapPin, Landmark, Calendar, Gauge } from "lucide-react";
import { ui } from "../../../data/projectDetailData";
import RiskScoreCard from "./RiskScoreCard";
import trainHeroUrl from "../../../assets/train-hero.jpg";

const META_ICONS = { MapPin, Landmark, Calendar, Gauge };

export default function ProjectHero({ project, onToast, onOpenWatchlist, onMethodology }) {
  function goHome(e) {
    e.preventDefault();
    if (onOpenWatchlist) onOpenWatchlist();
    else onToast(ui.breadcrumb.toast);
  }

  return (
    <section className="pd-hero">
      <div className="pd-hero-bg" aria-hidden="true">
        <img src={trainHeroUrl} alt="" draggable="false" />
      </div>
      <div className="pd-hero-scrim" aria-hidden="true" />

      <div className="pd-hero-content">
        <div className="pd-crumb">
          <Home size={12} /> / <a href="#" onClick={goHome}>{ui.breadcrumb.home}</a> /{" "}
          <a href="#" onClick={goHome}>{ui.breadcrumb.projects}</a> /{" "}
          <b>{project.name.split(" (")[0]}</b>
        </div>

        <div className="pd-tags">
          {project.tags.map((tag, i) => (
            <span key={tag} className={`pd-tag ${i === 1 ? "accent" : ""}`}>
              {tag}
            </span>
          ))}
        </div>

        <h1 className="pd-title">{project.name.replace(" (", "\n(")}</h1>
        <div className="pd-meta-row">
          {project.meta.map((m, i) => {
            const Icon = META_ICONS[m.icon];
            return (
              <div className="pd-meta-pill" key={i}>
                <span className="pd-meta-icn">
                  <Icon size={15} />
                </span>
                <div>
                  <div className="primary">{m.primary}</div>
                  <div className="secondary">{m.secondary}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pd-hero-quote">
        <p>{project.quote}</p>
      </div>

      <RiskScoreCard riskScore={project.riskScore} onToast={onToast} onMethodology={onMethodology} />
    </section>
  );
}
