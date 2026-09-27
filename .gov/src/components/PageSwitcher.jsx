import React, { useEffect, useState } from "react";

/**
 * Simple hash router for the combined PRAGATI app:
 *   #/          → Landing (Home)
 *   #/dashboard → National Dashboard (Overview)
 *   #/watchlist → Priority Watchlist
 *   #/project   → Project Detail (Mumbai-Ahmedabad High Speed Rail)
 */
export const ROUTES = {
  landing: "#/",
  signin: "#/signin",
  "request-access": "#/request-access",
  dashboard: "#/dashboard",
  watchlist: "#/watchlist",
  project: "#/project",
  analytics: "#/analytics",
  intelligence: "#/intelligence",
  "data-update": "#/data-update",
  "early-warnings": "#/early-warnings",
};

export function useHashRoute() {
  const get = () => {
    const h = window.location.hash || "#/";
    if (h.startsWith("#/request-access")) return "request-access";
    if (h.startsWith("#/signin")) return "signin";
    if (h.startsWith("#/dashboard")) return "dashboard";
    if (h.startsWith("#/watchlist")) return "watchlist";
    if (h.startsWith("#/project")) return "project";
    if (h.startsWith("#/analytics")) return "analytics";
    if (h.startsWith("#/intelligence")) return "intelligence";
    if (h.startsWith("#/data-update")) return "data-update";
    if (h.startsWith("#/early-warnings")) return "early-warnings";
    return "landing";
  };
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const onHash = () => {
      setRoute(get());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

const PAGES = [
  { id: "landing", label: "Home" },
  { id: "signin", label: "Sign In / Access" },
  { id: "dashboard", label: "National Dashboard" },
  { id: "watchlist", label: "Priority Watchlist" },
  { id: "project", label: "Project Detail" },
  { id: "analytics", label: "Analytics" },
  { id: "intelligence", label: "Intelligence" },
  { id: "data-update", label: "Data Update" },
  { id: "early-warnings", label: "Early Warnings" },
];

/** Floating pill (bottom-right) — quick jump between the four pages. */
export default function PageSwitcher({ active }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const others = PAGES.filter((p) => p.id !== active);

  return (
    <div
      ref={ref}
      style={{ position: "fixed", bottom: 18, right: 18, zIndex: 99999, fontFamily: "system-ui, sans-serif" }}
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
          {others.map((p) => (
            <a
              key={p.id}
              href={ROUTES[p.id]}
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
