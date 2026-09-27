import { useRef, useState } from "react";
import { Bell, ChevronDown, Globe } from "lucide-react";
import emblem from "../../assets/emblem.png";
import Logo from "./Logo";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import useDismiss from "../../hooks/useDismiss";

const LANGS = [
  { code: "EN", label: "English (EN)" },
  { code: "HI", label: "हिन्दी (HI)" },
  { code: "MR", label: "मराठी (MR)" },
];

function LanguageMenu({ lang, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(ref, open, () => setOpen(false));
  return (
    <div className="lang menu-anchor" ref={ref}>
      <button className="plain" onClick={() => setOpen((o) => !o)}>
        <Globe className="i15" />
        <span>{lang}</span>
        <ChevronDown className="i13" />
      </button>
      <div className={`dropdown menu${open ? " open" : ""}`} style={{ width: 132 }}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => {
              onChange(l.code);
              setOpen(false);
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NotificationsMenu({ notifs, onRead, onReadAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(ref, open, () => setOpen(false));
  const unread = notifs.filter((n) => !n.read).length;
  return (
    <div className="menu-anchor" ref={ref}>
      <button className="plain bell" onClick={() => setOpen((o) => !o)}>
        <Bell className="i17" />
        <span className={`badge${unread ? "" : " hide"}`}>{unread}</span>
      </button>
      <div className={`dropdown notif${open ? " open" : ""}`}>
        <div className="nhead">
          <b>Notifications</b>
          <button className="lnk" onClick={onReadAll}>
            Mark all read
          </button>
        </div>
        <div>
          {notifs.map((n, i) => (
            <div key={i} className={`nitem${n.read ? " read" : ""}`} onClick={() => onRead(i)}>
              <span className="dot" style={{ background: n.c }} />
              <div>
                <p>{n.t}</p>
                <time>{n.w}</time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const USER_ACTIONS = [
  { id: "profile", label: "My profile", msg: "Opening your MoSPI profile" },
  { id: "prefs", label: "Preferences", msg: "Opening preferences" },
  { id: "reports", label: "My saved reports", msg: "Opening your saved reports" },
  { id: "help", label: "Help & support", msg: "Opening help & support" },
  { id: "signout", label: "Sign out", msg: "Signed out of PRAGATI", danger: true },
];

function UserMenu({ onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(ref, open, () => setOpen(false));
  return (
    <div className="menu-anchor" ref={ref}>
      <button className="plain user" onClick={() => setOpen((o) => !o)}>
        <span className="avatar">AS</span>
        <span className="who">
          <b>A. Sharma</b>
          <span>MoSPI Officer</span>
        </span>
        <ChevronDown className="i14" style={{ color: "#7D8FA5" }} />
      </button>
      <div className={`dropdown menu${open ? " open" : ""}`} style={{ width: 198 }}>
        <div className="uhead">
          <b>A. Sharma</b>
          <span>a.sharma@mospi.gov.in</span>
        </div>
        {USER_ACTIONS.map((a) => (
          <button
            key={a.id}
            className={a.danger ? "danger" : undefined}
            onClick={() => {
              setOpen(false);
              onAction(a.msg);
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Header({
  nav,
  onNav,
  lang,
  onLang,
  notifs,
  onRead,
  onReadAll,
  onSearchPick,
  onUserAction,
}) {
  return (
    <header className="hdr">
      <img className="emblem" alt="State Emblem of India" src={emblem} style={{ objectFit: "contain" }} />
      <a className="brand" href="#/" aria-label="Go to PRAGATI home">
        <Logo />
      </a>
      <div className="brand-div" />
      <div className="brand-sub">
        National Infrastructure
        <br />
        Intelligence
      </div>
      <Navigation active={nav} onSelect={onNav} />

      <div className="hdr-right">
        <SearchBar onPick={onSearchPick} />
        <LanguageMenu lang={lang} onChange={onLang} />
        <NotificationsMenu notifs={notifs} onRead={onRead} onReadAll={onReadAll} />
        <UserMenu onAction={onUserAction} />
      </div>
    </header>
  );
}
