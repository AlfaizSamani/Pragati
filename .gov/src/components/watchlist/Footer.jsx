import React from "react";
import ashokaEmblemUrl from "../../assets/ashoka-emblem.svg";

export default function Footer() {
  return (
    <footer className="pg-footer">
      <div className="pg-footer-left">
        <span className="pg-footer-logo">PRAGATI</span>
        <span className="divider" />
        <span>National Infrastructure Intelligence</span>
      </div>
      <div className="pg-footer-mid">
        <span>Predictive Risk &amp; Governance</span>
        <span>Stronger Projects</span>
        <span>A More Resilient India</span>
      </div>
      <div className="pg-footer-right">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Accessibility</span>
        <span>Help</span>
        <div className="pg-footer-emblem">
          <img
            src={ashokaEmblemUrl}
            alt="State Emblem of India"
            draggable="false"
            className="national-emblem-white"
            style={{ height: 20, width: "auto" }}
          />
        </div>
        <span>Government of India | MoSPI</span>
      </div>
    </footer>
  );
}
