import { useState } from "react";

const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function AllocationChart({ rows, title = "Portfolio Value" }) {
  const [mode, setMode] = useState("value");
  const byValue = mode === "value";

  const max = Math.max(...rows.map((r) => (byValue ? r.value : r.total)));
  const sum = rows.reduce((s, r) => s + (byValue ? r.value : r.total), 0);

  return (
    <div className="card c-pv">
      <div className="ct serif">{title}</div>
      <div className="pvhead">
        <div className="dselect">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="value">By Portfolio Value</option>
            <option value="count">By Project Count</option>
          </select>
          <svg className="i13 ch" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>
      <div className="pvwrap">
        {rows.map((r) => {
          const v = byValue ? r.value : r.total;
          const w = max ? Math.round((v / max) * 100) : 0;
          const pct = sum ? Math.round((v / sum) * 100) : 0;
          const label = byValue ? `₹ ${r.value.toFixed(1)} Lakh Cr` : `${fmt(r.total)} projects`;
          return (
            <div className="pvrow" key={r.name}>
              <span className="nm" title={r.name}>{r.name}</span>
              <span className="track"><span className="fill" style={{ width: `${w}%`, background: r.color }} /></span>
              <span className="val">{label}</span>
              <span className="pc">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}