import React from "react";
import { Home, Calendar } from "lucide-react";
import heroBridgeUrl from "../../assets/hero-bridge.jpg";

export default function HeroBanner() {
  return (
    <section className="pg-hero">
      <div className="pg-hero-photo-zone" aria-hidden="true">
        <img className="pg-hero-photo" src={heroBridgeUrl} alt="" draggable="false" />
        <div className="pg-hero-photo-fade" />
      </div>
      <div className="pg-hero-smoke" aria-hidden="true" />

      <div className="pg-cycle-badge">
        <Calendar size={15} />
        <div className="text-left">
          <div className="big">April 2026</div>
          <div className="small">Reporting Cycle</div>
        </div>
      </div>

      <div className="pg-hero-quote">
        <p>&ldquo;From data to action,<br />for a more resilient India.&rdquo;</p>
        <span>&mdash; PRAGATI</span>
      </div>

      <div className="pg-hero-inner">
        <div className="pg-crumb">
          <Home size={12} /> / <b>Watchlist</b>
        </div>
        <h1>Priority Watchlist</h1>
        <p className="sub">Which projects need attention now?</p>
      </div>
    </section>
  );
}
