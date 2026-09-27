import { Download } from "lucide-react";
import { PERIODS, SERIES, monthLabel } from "../../data/analyticsData";

/* Chart geometry (SVG units). */
const CW = 640, CH = 220, CL = 44, CR = 628, CT = 10, CB = 195;

function AnalysisRiskChart({ rows, dimension, mode, onMode, cycle }) {
  const shown = rows.slice(0, 8);
  const left = 44, right = 628, top = 10, bottom = 195;
  const x = (index) => shown.length < 2 ? (left + right) / 2 : left + index * (right - left) / (shown.length - 1);
  const y = (value) => bottom - (Math.max(0, Math.min(100, value)) / 100) * (bottom - top);
  const slot = (right - left) / Math.max(1, shown.length);

  return (
    <div className="card c-trend">
      <div className="chead">
        <div>
          <div className="ct serif">Risk Score by {dimension}</div>
          <div className="cs">Current average risk score across {dimension.toLowerCase()} groups · {cycle}</div>
        </div>
        <div className="chead-r">
          <div className="seg">
            <button className={mode === "line" ? "on" : ""} onClick={() => onMode("line")}>Line Chart</button>
            <button className={mode === "bar" ? "on" : ""} onClick={() => onMode("bar")}>Bar Chart</button>
          </div>
        </div>
      </div>
      <div className="legend">
        {shown.map((row) => <span className="lg" key={row.name}><i style={{ background: row.color }} />{row.name}</span>)}
      </div>
      <div className="plot">
        <span className="ylab">Average Risk Score</span>
        <div id="trendChart">
          <svg viewBox="0 0 640 244" xmlns="http://www.w3.org/2000/svg">
            {[0, 20, 40, 60, 80, 100].map((value) => (
              <g key={value}>
                <line x1={left} y1={y(value)} x2={right} y2={y(value)} stroke="#EDF1F6" />
                <text x={left - 8} y={y(value) + 3} textAnchor="end" fontSize="9.5" fill="#7C8EA4">{value}%</text>
              </g>
            ))}
            {mode === "line" && shown.length > 1 && <path d={shown.map((row, index) => `${index ? "L" : "M"}${x(index).toFixed(1)} ${y(row.risk).toFixed(1)}`).join(" ")} fill="none" stroke="#2E7CC4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            {shown.map((row, index) => mode === "bar" ? (
              <rect key={row.name} x={(x(index) - Math.min(26, slot * .35)).toFixed(1)} y={y(row.risk).toFixed(1)} width={Math.min(52, slot * .7)} height={(bottom - y(row.risk)).toFixed(1)} rx="2" fill={row.color}>
                <title>{`${row.name}: ${row.risk}%`}</title>
              </rect>
            ) : (
              <circle key={row.name} cx={x(index)} cy={y(row.risk)} r="4" fill={row.color} stroke="#fff" strokeWidth="1.2">
                <title>{`${row.name}: ${row.risk}%`}</title>
              </circle>
            ))}
            {shown.map((row, index) => <text key={row.name} x={x(index)} y={bottom + 18} textAnchor="middle" fontSize="9" fill="#64748B">{row.name.length > 11 ? `${row.name.slice(0, 10)}…` : row.name}</text>)}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function RiskTrendChart({ months, mode, onMode, hidden, onToggleSeries, onDownload, rows = [], dimension = "Sector", cycle, analysis = "Sector Analysis" }) {
  if (analysis !== "Sector Analysis") {
    return <AnalysisRiskChart rows={rows} dimension={dimension} mode={mode} onMode={onMode} cycle={cycle} />;
  }
  const pts = months + 1;
  const start = SERIES[0].m.length - pts;
  const idx = Array.from({ length: pts }, (_, i) => start + i);
  const vis = SERIES.filter((s) => !hidden[s.name]);

  const x = (i) => (pts === 1 ? CL : CL + (i * (CR - CL)) / (pts - 1));
  const y = (v) => CB - (v / 100) * (CB - CT);

  const step = pts > 1 ? (CR - CL) / (pts - 1) : CR - CL;
  const every = Math.max(1, Math.ceil(50 / step)); /* keep x-axis labels from colliding */

  const last = idx[idx.length - 1];
  const label = PERIODS.find((p) => p.months === months).label.toLowerCase();

  const slot = (CR - CL) / pts;
  const gw = Math.min(slot * 0.78, 46);
  const bw = Math.max(1.6, gw / Math.max(1, vis.length) - 1.2);

  return (
    <div className="card c-trend">
      <div className="chead">
        <div>
          <div className="ct serif">Sector-wise Risk Trend</div>
          <div className="cs">Risk score movement across infrastructure sectors ({label})</div>
        </div>
        <div className="chead-r">
          <div className="seg">
            <button className={mode === "line" ? "on" : ""} onClick={() => onMode("line")}>
              Line Chart
            </button>
            <button className={mode === "bar" ? "on" : ""} onClick={() => onMode("bar")}>
              Bar Chart
            </button>
          </div>
          <button className="dl" title="Download chart data" onClick={onDownload}>
            <Download className="i15" />
          </button>
        </div>
      </div>

      <div className="legend">
        {SERIES.map((s) => (
          <button
            key={s.name}
            className={`lg${hidden[s.name] ? " off" : ""}`}
            title="Show / hide series"
            onClick={() => onToggleSeries(s.name)}
          >
            <i style={{ background: s.color }} />
            {s.name}
          </button>
        ))}
      </div>

      <div className="plot">
        <span className="ylab">Average Risk Score</span>
        <div id="trendChart">
          <svg viewBox={`0 0 ${CW} ${CH + 24}`} xmlns="http://www.w3.org/2000/svg">
            {[0, 20, 40, 60, 80, 100].map((g) => (
              <g key={g}>
                <line x1={CL} y1={y(g)} x2={CR} y2={y(g)} stroke="#EDF1F6" />
                <text x={CL - 8} y={y(g) + 3} textAnchor="end" fontSize="9.5" fill="#7C8EA4" fontWeight="600">
                  {g}%
                </text>
              </g>
            ))}
            <line x1={CL} y1={CT} x2={CL} y2={CB} stroke="#DCE3EB" />
            <line x1={CL} y1={CB} x2={CR} y2={CB} stroke="#DCE3EB" />

            {idx.map((gi, i) =>
              i % every !== 0 && i !== pts - 1 ? null : (
                <text key={gi} x={x(i).toFixed(1)} y={CB + 18} textAnchor="middle" fontSize="9.5" fill="#7C8EA4" fontWeight="500">
                  {monthLabel(gi)}
                </text>
              )
            )}

            {mode === "line" ? (
              <>
                <line x1={x(pts - 1).toFixed(1)} y1={CT} x2={x(pts - 1).toFixed(1)} y2={CB} stroke="#C3CEDA" strokeDasharray="3 3" />
                {vis.map((ser) => (
                  <g key={ser.name}>
                    <path
                      d={idx.map((gi, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(ser.m[gi]).toFixed(1)}`).join(" ")}
                      fill="none"
                      stroke={ser.color}
                      strokeWidth="3.2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {idx.map((gi, i) => (
                      <circle key={gi} cx={x(i).toFixed(1)} cy={y(ser.m[gi]).toFixed(1)} r="3.8" fill={ser.color} stroke="#ffffff" strokeWidth="1.2">
                        <title>{`${ser.name} — ${monthLabel(gi)}: ${Math.round(ser.m[gi])}%`}</title>
                      </circle>
                    ))}
                  </g>
                ))}
              </>
            ) : (
              idx.map((gi, i) => {
                const cx = CL + slot * (i + 0.5);
                return vis.map((ser, si) => {
                  const v = ser.m[gi];
                  const bx = cx - gw / 2 + si * (bw + 1.2);
                  return (
                    <rect
                      key={`${gi}-${ser.name}`}
                      x={bx.toFixed(1)}
                      y={y(v).toFixed(1)}
                      width={bw.toFixed(1)}
                      height={(CB - y(v)).toFixed(1)}
                      rx="1.4"
                      fill={ser.color}
                    >
                      <title>{`${ser.name} — ${monthLabel(gi)}: ${Math.round(v)}%`}</title>
                    </rect>
                  );
                });
              })
            )}
          </svg>
        </div>

        {/* latest-period report, sits to the right of the dashed line */}
        <div className="tip" id="trendTip">
          <h5>{monthLabel(last)}</h5>
          {vis.map((ser) => (
            <div className="r" key={ser.name}>
              <i style={{ background: ser.color }} />
              {ser.name}
              <b>{Math.round(ser.m[last])}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
