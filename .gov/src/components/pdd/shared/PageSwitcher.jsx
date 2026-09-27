import React, { useEffect, useRef, useState } from "react";

/**
 * Floating page switcher shared by all four PRAGATI pages.
 * Lists the other pages so every page is reachable from everywhere.
 * Ports are the canonical dev-server assignments:
 *   5173 = Priority Watchlist, 5174 = Project Detail,
 *   5175 = Landing (Home),    5176 = National Dashboard.
 */
export const PRAGATI_PORTS = {
  watchlist: 5173,
  detail: 5174,
  landing: 5175,
  dashboard: 5176,
};

const PAGES = [
  { id: "landing", label: "Home" },
  { id: "watchlist", label: "Priority Watchlist" },
  { id: "detail", label: "Project Detail" },
  { id: "dashboard", label: "National Dashboard" },
];

export default function PageSwitcher({ active }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    PAGES.find((p) => String(PRAGATI_PORTS[p.id]) === window.location.port)?.id || active;

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const otherPages = PAGES.filter((p) => p.id !== current);

  return (
    <div
      ref={ref}
      style={{ position: "fixed", bottom: 54, right: 18, zIndex: 99999, fontFamily: "system-ui, sans-serif" }}
    >
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            background: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(10,25,47,0.22)",
            border: "1px solid #e2e8f0",
            padding: 6,
            minWidth: 200,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#64748b",
              padding: "6px 10px 4px",
              textTransform: "uppercase",
            }}
          >
            PRAGATI Pages
          </div>
          {otherPages.map((p) => (
            <a
              key={p.id}
              href={`http://localhost:${PRAGATI_PORTS[p.id]}/`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 600,
                color: "#0f172a",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f97316", flexShrink: 0 }} />
              {p.label}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch PRAGATI page"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 14px",
          borderRadius: 999,
          border: "1px solid #0b192c",
          background: "#0b192c",
          color: "#ffffff",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
          boxShadow: "0 6px 18px rgba(10,25,47,0.3)",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
        Pages ▾
      </button>
    </div>
  );
}
