import { useState } from "react";
import { ChevronDown } from "lucide-react";
const COLORS = { Critical: "#D93A2B", High: "#EE7A2A", Medium: "#F2B01E", Low: "#2E9E58" };

function riskBand(project) {
  const score = Number(project.riskScore ?? project.risk_score);
  if (Number.isFinite(score)) return score > 75 ? "Critical" : score > 55 ? "High" : score > 30 ? "Medium" : "Low";
  const tier = String(project.riskTier ?? project.risk_tier ?? "").toLowerCase();
  return tier === "critical" ? "Critical" : tier === "high" ? "High" : tier === "medium" ? "Medium" : "Low";
}

export default function RiskDistribution({ summary, projects = [] }) {
  const [mode, setMode] = useState("count");
  const fallbackCounts = summary?.tier_counts || {};
  const dist = Object.keys(COLORS).map((name) => {
    const records = projects.filter((project) => riskBand(project) === name);
    const fallbackCount = Number(fallbackCounts[name] || 0);
    const valueCr = records.reduce((sum, project) => sum + Number(project.revisedCostCrore ?? project.cost_current_n ?? 0), 0);
    return { n: name, c: COLORS[name], count: projects.length ? records.length : fallbackCount, valueCr };
  });
  const total = dist.reduce((sum, row) => sum + row.count, 0);
  const totalValueCr = dist.reduce((sum, row) => sum + row.valueCr, 0);
  const rows = dist.map(({ n, c, count, valueCr }) => ({
    n, c, count, valueCr,
    p: total ? (count / total) * 100 : 0,
    v: mode === "count" ? count.toLocaleString("en-IN") : valueCr ? `₹ ${(valueCr / 100000).toFixed(1)} Lakh Cr` : "Value unavailable",
  }));
  const d = { center: mode === "count" ? total.toLocaleString("en-IN") : totalValueCr ? `₹ ${(totalValueCr / 100000).toFixed(1)}` : "—", caption: mode === "count" ? "Projects" : "Lakh Cr", sub: mode === "count" ? "Across all monitored projects" : "Current portfolio value", rows };
  const R = 58, SW = 26, C = 2 * Math.PI * R;
  let off = 0;
  const arcs = d.rows.map((r) => {
    const len = (C * r.p) / 100;
    const el = (
      <circle
        key={r.n}
        cx="80"
        cy="80"
        r={R}
        fill="none"
        stroke={r.c}
        strokeWidth={SW}
        strokeDasharray={`${len.toFixed(2)} ${(C - len).toFixed(2)}`}
        strokeDashoffset={(-off).toFixed(2)}
      >
        <title>{`${r.n}: ${r.p}% (${r.v})`}</title>
      </circle>
    );
    off += len;
    return el;
  });

  return (
    <div className="card c-dist">
      <div className="chead">
        <div>
          <div className="ct serif">Current Risk Distribution</div>
          <div className="cs">{d.sub}</div>
        </div>
        <div className="dselect">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="count">By Project Count</option>
            <option value="value">By Portfolio Value</option>
          </select>
          <ChevronDown className="i13 ch" />
        </div>
      </div>

      <div className="dwrap">
        <div className="dholder">
          <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-90 80 80)">{arcs}</g>
            <text x="80" y="78" textAnchor="middle" fontSize={mode === "value" ? 19 : 21} fontWeight="700" fill="#082B4C" fontFamily="Source Serif 4,Georgia,serif">
              {d.center}
            </text>
            <text x="80" y="93" textAnchor="middle" fontSize="10.5" fill="#6D8098">
              {d.caption}
            </text>
          </svg>
        </div>
        <div className="dlegend">
          {d.rows.map((r) => (
            <div className="it" key={r.n}>
              <i style={{ background: r.c }} />
              <span className="nm">{r.n}</span>
              <span className="pc">{Math.round(r.p)}%</span>
              <span className="ct2">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
