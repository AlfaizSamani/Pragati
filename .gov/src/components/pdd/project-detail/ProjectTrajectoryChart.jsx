import React, { useState } from "react";
import {
  trajectoryTabs,
  trajectoryAxis,
  ui,
} from "../../../data/projectDetailData";

// Compact geometry so the whole card fits a 768px-tall laptop screen.
const CHART_W = 1000;
const CHART_H = 198;
const PAD_L = 34;
const PAD_R = 34;
const PAD_TOP = 44;
const PAD_BOTTOM = 30;

const plotW = CHART_W - PAD_L - PAD_R;
const plotH = CHART_H - PAD_TOP - PAD_BOTTOM;

function scaleX(x) {
  return PAD_L + x * plotW;
}
function scaleY(y, yMax) {
  return PAD_TOP + plotH - (y / yMax) * plotH;
}
function interpolateY(series, x) {
  for (let i = 0; i < series.length - 1; i++) {
    const a = series[i];
    const b = series[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x || 1);
      return a.y + (b.y - a.y) * t;
    }
  }
  return series[series.length - 1].y;
}

export default function ProjectTrajectoryChart({ project }) {
  const metricNames = Object.keys(project.trajectory);
  const [metric, setMetric] = useState(metricNames[0]);
  const active = metricNames.includes(metric) ? metric : metricNames[0];
  const series = project.trajectory[active];
  const yMax = series.yMax || 100;

  const plannedPoints = series.planned.map((p) => `${scaleX(p.x)},${scaleY(p.y, yMax)}`).join(" ");
  const actualPoints = series.actual.map((p) => `${scaleX(p.x)},${scaleY(p.y, yMax)}`).join(" ");

  const lastActual = series.actual[series.actual.length - 1];
  const plannedAtLastActualX = interpolateY(series.planned, lastActual.x);
  const lastX = scaleX(lastActual.x);

  return (
    <div className="pd-card">
      {/* Reference keeps the title, metric tabs and legend on a single row. */}
      <div className="pd-traj-head">
        <div className="pd-card-title">{ui.trajectory.title}</div>

        <div className="pd-traj-tabs">
          {metricNames.map((m) => (
            <button key={m} className={active === m ? "active" : ""} onClick={() => setMetric(m)}>
              {m}
            </button>
          ))}
        </div>

        <div className="pd-traj-legend">
          <span>
            <span className="swatch dashed" /> {ui.trajectory.legend.planned}
          </span>
          <span>
            <span className="swatch solid" /> {ui.trajectory.legend.actual}
          </span>
          <span>
            <span className="swatch dot" /> {ui.trajectory.legend.milestone}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="pd-traj-chart">
        {/* y gridlines + labels */}
        {[0, 20, 40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={PAD_L} y1={scaleY(v, yMax)} x2={CHART_W - PAD_R} y2={scaleY(v, yMax)} stroke="#eef1f5" strokeWidth="1" />
            <text x={PAD_L - 8} y={scaleY(v, yMax) + 3} textAnchor="end" fontSize="9" fill="#7c8798">
              {v}%
            </text>
          </g>
        ))}

        {/* vertical dotted guide at the latest reported month */}
        <line
          x1={lastX}
          y1={PAD_TOP - 6}
          x2={lastX}
          y2={CHART_H - PAD_BOTTOM}
          stroke="#b9c2cd"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* milestone guide lines + markers + labels */}
        {series.milestones.map((m) => {
          const mx = scaleX(m.x);
          const my = scaleY(interpolateY(series.planned, m.x), yMax);
          const anchor = m.x > 0.9 ? "end" : m.x < 0.1 ? "start" : "middle";
          return (
            <g key={m.labelLines[0]}>
              <line
                x1={mx}
                y1={PAD_TOP - 6}
                x2={mx}
                y2={CHART_H - PAD_BOTTOM}
                stroke="#e0672f"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.5"
              />
              <circle cx={mx} cy={my} r="4" fill="#fff" stroke="#e0672f" strokeWidth="2" />
              {/* two-line label, like the reference callouts */}
              <text x={mx} y={12} textAnchor={anchor} fontSize="9" fontWeight="700" fill={m.accent ? "#d95f2b" : "#152238"}>
                {m.labelLines[0]}
              </text>
              <text x={mx} y={21.5} textAnchor={anchor} fontSize="9" fontWeight="700" fill={m.accent ? "#d95f2b" : "#152238"}>
                {m.labelLines[1]}
              </text>
              <text x={mx} y={31} textAnchor={anchor} fontSize="8.5" fill="#e0672f" fontWeight="700">
                {m.date}
              </text>
            </g>
          );
        })}

        {/* planned line (dashed) */}
        <polyline points={plannedPoints} fill="none" stroke="#a7b3c2" strokeWidth="2" strokeDasharray="5 4" />
        {/* actual line (solid) */}
        <polyline points={actualPoints} fill="none" stroke="#2f6fb0" strokeWidth="2.5" />
        {series.actual.map((p, i) => (
          <circle key={i} cx={scaleX(p.x)} cy={scaleY(p.y, yMax)} r="3" fill="#2f6fb0" />
        ))}

        {/* end value labels at the latest reported month */}
        <text x={lastX + 8} y={scaleY(plannedAtLastActualX, yMax) + 3} fontSize="10" fontWeight="800" fill="#4b5768">
          {Math.round(plannedAtLastActualX)}%
        </text>
        <text x={lastX + 8} y={scaleY(lastActual.y, yMax) + 12} fontSize="10" fontWeight="800" fill="#2f6fb0">
          {lastActual.y}%
        </text>

        {/* x axis labels */}
        {trajectoryAxis.map((label, i) => {
          const x = scaleX(i / (trajectoryAxis.length - 1));
          return (
            <text key={`${label}-${i}`} x={x} y={CHART_H - 8} textAnchor="middle" fontSize="8.5" fill="#7c8798">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
