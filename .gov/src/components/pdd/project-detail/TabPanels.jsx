import React, { useState } from "react";
import {
  ShieldCheck, Activity, Landmark, CalendarClock, MapPin, ArrowRight,
  ArrowUpRight, ArrowDownRight, Send,
} from "lucide-react";
import { ui } from "../../../data/projectDetailData";

// ------------------------------------------------------------
// Focused, data-driven panels rendered on the non-Overview tabs.
// Every number and string comes from the project record.
// ------------------------------------------------------------

/** Risk Analysis: executive summary block. */
export function RiskSummary({ project }) {
  const { riskScore, breakdown, flagged } = project;
  const top = [...breakdown].sort((a, b) => b.value - a.value).slice(0, 3);
  const up = riskScore.delta > 0;
  return (
    <div className="pd-card">
      <div className="pd-card-title-row">
        <div className="pd-card-title">Risk Summary</div>
        <span className={`pd-flag-impact ${up ? "red" : "green"}`}>
          {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {up ? "+" : ""}{riskScore.delta}% {riskScore.comparedTo}
        </span>
      </div>
      <div className="pd-risk-summary">
        <div className="pd-risk-summary-score">
          <span className="big">{riskScore.value}<em>%</em></span>
          <span className="level">{riskScore.level}</span>
          <span className="meta">Scored {riskScore.scoredOn} &middot; Model {riskScore.model}</span>
        </div>
        <div className="pd-risk-summary-facts">
          <div className="fact">
            <ShieldCheck size={15} />
            <div>
              <b>{flagged.length} active flags</b>
              <span>{flagged.filter((f) => f.tone === "red").length} high-impact factors driving the score</span>
            </div>
          </div>
          <div className="fact">
            <Activity size={15} />
            <div>
              <b>Top drivers</b>
              <span>{top.map((t) => `${t.label} (${t.value}%)`).join(" \u00b7 ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Financials tab: full-width financial information block. */
export function FinancialBlock({ project }) {
  const f = project.financial;
  const labels = ui.financial.labels;
  return (
    <div className="pd-card">
      <div className="pd-card-title">
        <Landmark size={15} /> {ui.financial.title}
      </div>
      <div className="pd-info-grid three">
        <div className="pd-info-cell">
          <span className="pd-info-label">{labels.original}</span>
          <span className="pd-info-value">{f.originalCost}</span>
        </div>
        <div className="pd-info-cell">
          <span className="pd-info-label">{labels.revised}</span>
          <span className="pd-info-value">{f.revisedCost}</span>
          <span className="pd-info-note green">(+{f.revisedDelta}%)</span>
        </div>
        <div className="pd-info-cell">
          <span className="pd-info-label">{labels.expenditure}</span>
          <span className="pd-info-value">{f.expenditure}</span>
          <span className="pd-info-note green">{f.expenditureNote}</span>
        </div>
      </div>
    </div>
  );
}

/** Schedule tab: full-width schedule block. */
export function ScheduleBlock({ project }) {
  const s = project.schedule;
  const labels = ui.schedule.labels;
  const behind = /behind/i.test(s.currentPosition);
  const ahead = /ahead/i.test(s.currentPosition);
  return (
    <div className="pd-card">
      <div className="pd-card-title">
        <CalendarClock size={15} /> {ui.schedule.title}
      </div>
      <div className="pd-info-grid three">
        <div className="pd-info-cell">
          <span className="pd-info-label">{labels.original}</span>
          <span className="pd-info-value">{s.originalCompletion}</span>
        </div>
        <div className="pd-info-cell">
          <span className="pd-info-label">{labels.revised}</span>
          <span className="pd-info-value">{s.revisedCompletion}</span>
        </div>
        <div className="pd-info-cell">
          <span className="pd-info-label">{labels.current}</span>
          <span className={`pd-info-value ${behind ? "red" : ahead ? "green" : ""}`}>{s.currentPosition}</span>
        </div>
      </div>
    </div>
  );
}

/** Geography tab: corridor map full-width plus station list. */
export function GeographyBlock({ project, mapSlot }) {
  return (
    <div className="pd-card">
      <div className="pd-card-title-row">
        <div className="pd-card-title">
          <MapPin size={15} /> {ui.corridor.mapTitle.replace("{name}", project.name)}
        </div>
        <span className="pd-geo-count">{project.stations.length} stations</span>
      </div>
      {mapSlot}
    </div>
  );
}

/** Related Projects tab: data table of related records. */
export function RelatedBlock({ project, onOpen }) {
  const c = ui.related;
  return (
    <div className="pd-card">
      <div className="pd-card-title">{c.title}</div>
      <table className="pd-related-table">
        <thead>
          <tr>
            <th>{c.columns.project}</th>
            <th>{c.columns.sector}</th>
            <th>{c.columns.risk}</th>
            <th>{c.columns.progress}</th>
            <th aria-label="open" />
          </tr>
        </thead>
        <tbody>
          {project.related.map((r) => (
            <tr key={r.name}>
              <td className="name">{r.name}</td>
              <td>{r.sector}</td>
              <td>
                <span className={`pd-related-risk ${r.risk >= 70 ? "red" : r.risk >= 40 ? "amber" : "green"}`}>{r.risk}%</span>
              </td>
              <td>
                <span className="pd-related-progress">
                  <span style={{ width: `${r.progress}%` }} />
                </span>
                {r.progress}%
              </td>
              <td>
                <button className="pd-link" onClick={() => onOpen(r.name)}>
                  Open <ArrowRight size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Discussion tab: thread with a working post box (session state). */
export function DiscussionBlock({ project }) {
  const c = ui.discussion;
  const [posts, setPosts] = useState(project.discussion);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");

  function post() {
    if (!draft.trim()) {
      setNote(c.emptyToast);
      return;
    }
    setPosts([
      ...posts,
      { author: "A. Sharma", role: "MoSPI Officer", time: "just now", text: draft.trim() },
    ]);
    setDraft("");
    setNote(c.postedToast);
  }

  return (
    <div className="pd-card">
      <div className="pd-card-title">{c.title}</div>
      <div className="pd-discussion">
        {posts.map((p, i) => (
          <div className="pd-discussion-item" key={i}>
            <div className="pd-avatar-sm">{p.author.split(" ").map((w) => w[0]).join("")}</div>
            <div>
              <div className="head">
                <b>{p.author}</b> <span className="role">{p.role}</span> <span className="time">{p.time}</span>
              </div>
              <p>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pd-discussion-compose">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={c.newPlaceholder}
          onKeyDown={(e) => e.key === "Enter" && post()}
        />
        <button className="pd-dark-btn" onClick={post}>
          <Send size={12} /> {c.post}
        </button>
      </div>
      {note && <div className="pd-discussion-note">{note}</div>}
    </div>
  );
}
