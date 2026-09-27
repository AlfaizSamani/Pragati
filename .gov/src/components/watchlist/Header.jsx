import React, { useState, useRef, useEffect } from "react";
import { Search, Globe, ChevronDown, Bell } from "lucide-react";
import { notifications } from "../../data/watchlistData";
import ashokaEmblemUrl from "../../assets/ashoka-emblem.svg";

const NAV_ITEMS = [
  { label: "Overview", href: "#/dashboard" },
  { label: "Watchlist", href: "#/watchlist" },
  { label: "Projects", href: "#/project" },
  { label: "Early Warnings", href: "#" },
  { label: "Analytics", href: "#/analytics" },
  { label: "Intelligence", href: "#/intelligence" },
  { label: "Data Update", href: "#" },
];

export default function Header({ activeNav, onNavChange, searchQuery, onSearchChange, onToast }) {
  const [lang, setLang] = useState("EN");
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [unread, setUnread] = useState(notifications.length);

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close any open dropdown when clicking outside of it.
  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="pg-header">
      <div className="pg-brand">
        <img
          src={ashokaEmblemUrl}
          alt="State Emblem of India"
          draggable="false"
          style={{ height: 34, width: "auto", flexShrink: 0 }}
        />
        <a className="pg-brand-text" href="#/" aria-label="Go to PRAGATI home">
          <span className="pg-brand-name">PRAGATI</span>
        </a>
        <div className="pg-brand-sep" />
        <div className="pg-brand-text">
          <span className="pg-brand-sub">National Infrastructure</span>
          <span className="pg-brand-sub">Intelligence</span>
        </div>
      </div>

      <nav className="pg-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={activeNav === item.label ? "active" : ""}
            onClick={(e) => {
              // Allow navigation for working pages, prevent default for placeholders
              if (item.href === "#") {
                e.preventDefault();
                if (onNavChange) onNavChange(item.label);
              } else {
                // Let the hash navigation work for working pages
                if (onNavChange) onNavChange(item.label);
              }
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="pg-top-right">
        <div className="pg-search-box">
          <Search size={15} />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects, states, ministries…"
          />
        </div>

        <div className="pg-dropdown-wrap" ref={langRef}>
          <button className="pg-lang-btn" onClick={() => setLangOpen((v) => !v)}>
            <Globe size={14} />
            {lang}
            <ChevronDown size={10} />
          </button>
          {langOpen && (
            <div className="pg-dropdown pg-lang-dropdown">
              {["EN", "HI"].map((l) => (
                <button
                  key={l}
                  className={l === lang ? "active" : ""}
                  onClick={() => {
                    setLang(l);
                    setLangOpen(false);
                    onToast(l === "HI" ? "भाषा हिंदी में बदली गई" : "Language switched to English");
                  }}
                >
                  {l === "EN" ? "English" : "\u0939\u093f\u0902\u0926\u0940 (Hindi)"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pg-dropdown-wrap" ref={notifRef}>
          <button
            className="pg-icon-btn"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUnread(0);
            }}
          >
            <Bell size={16} />
            {unread > 0 && <span className="pg-notif-dot">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="pg-dropdown pg-notif-dropdown">
              <div className="pg-dropdown-title">Notifications</div>
              {notifications.map((n) => (
                <div className="pg-notif-item" key={n.id}>
                  <p>{n.text}</p>
                  <span>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pg-dropdown-wrap" ref={userRef}>
          <button className="pg-user-chip" onClick={() => setUserOpen((v) => !v)}>
            <div className="pg-avatar">AS</div>
            <div className="pg-user-meta">
              <div className="name">A. Sharma</div>
              <div className="role">MoSPI Officer</div>
            </div>
            <ChevronDown size={12} />
          </button>
          {userOpen && (
            <div className="pg-dropdown pg-user-dropdown">
              <button onClick={() => onToast("Opening your profile…")}>My Profile</button>
              <button onClick={() => onToast("Opening account settings…")}>Settings</button>
              <button onClick={() => onToast("Signed out.")}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
