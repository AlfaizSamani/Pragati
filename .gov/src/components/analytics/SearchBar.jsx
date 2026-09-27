import { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { SECTORS, STATES, TOP_PROJECTS } from "../../data/analyticsData";
import useDismiss from "../../hooks/useDismiss";

export default function SearchBar({ onPick }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useDismiss(wrapRef, open, () => setOpen(false));

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return null;
    return {
      projects: TOP_PROJECTS.filter((p) => p.n.toLowerCase().includes(term)).slice(0, 6),
      sectors: SECTORS.filter((s) => s.name.toLowerCase().includes(term)).slice(0, 4),
      states: STATES.filter((s) => s !== "All States" && s.toLowerCase().includes(term)).slice(0, 5),
    };
  }, [term]);

  const nothing =
    results && !results.projects.length && !results.sectors.length && !results.states.length;

  const pick = (item) => {
    onPick(item);
    setQ("");
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setQ("");
      setOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter") {
      const first = panelRef.current?.querySelector("button");
      if (first) first.click();
    }
  };

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div className={`search${q ? " has" : ""}`}>
        <Search className="i14" />
        <input
          ref={inputRef}
          value={q}
          autoComplete="off"
          placeholder="Search projects, states, sectors..."
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => q.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button
          className="sclear"
          title="Clear"
          onClick={() => {
            setQ("");
            setOpen(false);
            inputRef.current?.focus();
          }}
        >
          &times;
        </button>
      </div>

      <div ref={panelRef} className={`dropdown srch${open && results ? " open" : ""}`}>
        {results && results.projects.length > 0 && (
          <>
            <div className="grp">Projects</div>
            {results.projects.map((p) => (
              <button key={p.n} onClick={() => pick({ kind: "project", sector: p.s, state: p.st })}>
                {p.n}
                <span className="meta">
                  {p.st} · {p.sc}%
                </span>
              </button>
            ))}
          </>
        )}
        {results && results.sectors.length > 0 && (
          <>
            <div className="grp">Sectors</div>
            {results.sectors.map((s) => (
              <button key={s.name} onClick={() => pick({ kind: "sector", sector: s.name })}>
                {s.name}
                <span className="meta">{s.total} projects</span>
              </button>
            ))}
          </>
        )}
        {results && results.states.length > 0 && (
          <>
            <div className="grp">States</div>
            {results.states.map((s) => (
              <button key={s} onClick={() => pick({ kind: "state", state: s })}>
                {s}
                <span className="meta">State / UT</span>
              </button>
            ))}
          </>
        )}
        {nothing && <div className="empty">No projects, sectors or states match “{q.trim()}”.</div>}
      </div>
    </div>
  );
}
