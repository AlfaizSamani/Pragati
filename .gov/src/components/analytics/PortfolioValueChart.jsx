import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { fmt } from "../../data/analyticsData";

export default function PortfolioValueChart({ rows = [], title = "Portfolio Value" }) {
  const [mode, setMode] = useState("value");
  const byValue = mode === "value";
  const max = Math.max(1, ...rows.map((row) => byValue ? row.value : row.total));
  const sum = rows.reduce((total, row) => total + (byValue ? row.value : row.total), 0);

  return (
    <div className="card c-pv">
      <div className="ct serif">{title}</div>
      <div className="pvhead">
        <div className="dselect">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="value">By Portfolio Value</option>
            <option value="count">By Project Count</option>
          </select>
          <ChevronDown className="i13 ch" />
        </div>
      </div>
      <div className="pvwrap">
        {rows.map((s) => {
          const v = byValue ? s.value : s.total;
          const w = Math.round((v / max) * 100);
          const pct = Math.round((v / sum) * 100);
          const label = byValue ? `₹ ${s.value.toFixed(1)} Lakh Cr` : `${fmt(s.total)} projects`;
          return (
            <div className="pvrow" key={s.name}>
              <span className="nm" title={s.name}>{s.name}</span>
              <span className="track">
                <span className="fill" style={{ width: `${w}%`, background: s.color }} />
              </span>
              <span className="val">{label}</span>
              <span className="pc">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
