import React from "react";
import ashokaEmblemUrl from "../../../assets/ashoka-emblem.svg";
import PragatiLogo from "./PragatiLogo";

const TAGLINES = ["Predictive Risk & Governance", "Stronger Projects", "A More Resilient India"];
const LEGAL = ["Privacy", "Terms", "Accessibility", "Help"];

/**
 * Shared footer. All text can be overridden via the `content` prop so
 * pages can drive it from their data source; defaults keep the
 * Watchlist page rendering exactly as before.
 */
export default function Footer({ content }) {
  const c = {
    brand: "PRAGATI",
    subtitle: "National Infrastructure Intelligence",
    taglines: TAGLINES,
    legal: LEGAL,
    govLine1: "Government of India",
    govLine2: "MoSPI",
    ...content,
  };

  return (
    <footer className="pg-footer">
      <div className="pg-footer-left">
        <PragatiLogo isFooter={true} fontSize={14} />
        <span className="divider" />
        <span>{c.subtitle}</span>
      </div>

      <div className="pg-footer-mid">
        {c.taglines.map((t, i) => (
          <React.Fragment key={t}>
            {i > 0 && <span className="mid-divider" />}
            <span className="mid-item">{t}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="pg-footer-right">
        {c.legal.map((t, i) => (
          <React.Fragment key={t}>
            {i > 0 && <span className="right-divider" />}
            <span className="right-item">{t}</span>
          </React.Fragment>
        ))}
        <div className="pg-footer-gov">
          <div className="pg-footer-emblem">
            <img
              src={ashokaEmblemUrl}
              alt="State Emblem of India"
              draggable="false"
              className="national-emblem-white"
              style={{ height: 22, width: "auto" }}
            />
          </div>
          <div className="gov-text">
            <span className="gov-line1">{c.govLine1}</span>
            <span className="gov-line2">{c.govLine2}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
