import React, { useState, useRef, useEffect } from "react";
import { Search, Globe, ChevronDown, Bell } from "lucide-react";
import ashokaEmblemUrl from "../../../assets/ashoka-emblem.svg";
import PragatiLogo from "./PragatiLogo";

const NAV_ITEMS = [
  { label: "Overview", href: "#/dashboard" },
  { label: "Watchlist", href: "#/watchlist" },
  { label: "Projects", href: "#/project" },
  { label: "Early Warnings", href: "#/early-warnings" },
  { label: "Analytics", href: "#/analytics" },
  { label: "Intelligence", href: "#/intelligence" },
  { label: "Data Update", href: "#/data-update" },
];

/**
 * Shared header. Every string can be overridden through the `content`
 * prop so pages can drive it from their own data source; the defaults
 * keep other pages (e.g. Watchlist) rendering exactly as before.
 * `searchSlot` renders custom content (e.g. live results) under the
 * search box while it is focused.
 */
export default function Header({ activeNav, onNavChange, searchQuery, onSearchChange, onToast, content, searchSlot }) {
  const c = {
    brand: { name: "PRAGATI", subLine1: "National Infrastructure", subLine2: "Intelligence" },
    navItems: NAV_ITEMS,
    searchPlaceholder: "Search projects, states, sectors…",
    user: { initials: "AS", name: "A. Sharma", role: "MoSPI Officer" },
    languages: [
      { code: "EN", label: "English" },
      { code: "HI", label: "\u0939\u093f\u0928\u094d\u0926\u0940 (Hindi)" },
    ],
    notificationsTitle: "Notifications",
    userMenu: ["My Profile", "Settings", "Sign Out"],
    toasts: {
      langEn: "Language switched to English",
      langHi: "\u092d\u093e\u0937\u093e \u0939\u093f\u0902\u0926\u0940 \u092e\u0947\u0902 \u092c\u0926\u0932\u0940 \u0917\u0908",
      profile: "Opening your profile…",
      settings: "Opening account settings…",
      signOut: "Signed out.",
    },
    ...content,
  };

  const [lang, setLang] = useState("EN");
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifList = c.notifications || [];
  const [unread, setUnread] = useState(notifList.length);

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  // Close any open dropdown when clicking outside of it.
  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const userMenuToasts = [c.toasts.profile, c.toasts.settings, c.toasts.signOut];

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
          <PragatiLogo fontSize={17} />
        </a>
        <div className="pg-brand-sep" />
        <div className="pg-brand-text">
          <span className="pg-brand-sub">{c.brand.subLine1}</span>
          <span className="pg-brand-sub">{c.brand.subLine2}</span>
        </div>
      </div>

      <nav className="pg-nav">
  {c.navItems.map((item) => {
    const label = typeof item === "string" ? item : item.label;
    const href =
      typeof item === "string"
        ? label === "Overview"
          ? "#/dashboard"
          : label === "Watchlist"
            ? "#/watchlist"
            : label === "Projects"
              ? "#/project"
              : "#"
        : item.href;

    return (
      <a
        key={label}
        href={href}
        className={activeNav === label ? "active" : ""}
        onClick={(e) => {
          if (href === "#") {
            e.preventDefault();
            if (onNavChange) onNavChange(label);
          } else {
            if (onNavChange) onNavChange(label);
          }
        }}
      >
        {label}
      </a>
    );
  })}
</nav>

      <div className="pg-top-right">
        <div className="pg-search-box" ref={searchRef}>
          <Search size={15} />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder={c.searchPlaceholder}
          />
          {searchFocused && searchSlot && (
            <div className="pg-dropdown pd-search-dropdown" onMouseDown={(e) => e.preventDefault()}>
              {searchSlot}
            </div>
          )}
        </div>

        <div className="pg-dropdown-wrap" ref={langRef}>
          <button className="pg-lang-btn" onClick={() => setLangOpen((v) => !v)}>
            <Globe size={14} />
            {lang}
            <ChevronDown size={10} />
          </button>
          {langOpen && (
            <div className="pg-dropdown pg-lang-dropdown">
              {c.languages.map((l) => (
                <button
                  key={l.code}
                  className={l.code === lang ? "active" : ""}
                  onClick={() => {
                    setLang(l.code);
                    setLangOpen(false);
                    onToast(l.code === "HI" ? c.toasts.langHi : c.toasts.langEn);
                  }}
                >
                  {l.label}
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
              <div className="pg-dropdown-title">{c.notificationsTitle}</div>
              {notifList.map((n) => (
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
            <div className="pg-avatar">{c.user.initials}</div>
            <div className="pg-user-meta">
              <div className="name">{c.user.name}</div>
              <div className="role">{c.user.role}</div>
            </div>
            <ChevronDown size={12} />
          </button>
          {userOpen && (
            <div className="pg-dropdown pg-user-dropdown">
              {c.userMenu.map((item, i) => (
                <button key={item} onClick={() => onToast(userMenuToasts[i])}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
