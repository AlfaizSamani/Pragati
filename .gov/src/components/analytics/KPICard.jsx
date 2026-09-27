import { ArrowUp } from "lucide-react";

export default function KPICard({ icon: Icon, bg, color, value, unit, currency, label, dir, pct, compareLabel }) {
  return (
    <div className="kpi">
      <div className="ico" style={{ background: bg, color }}>
        <Icon className="i19" />
      </div>
      <div>
        <div className="n serif">
          {currency && <span className="cur">₹ </span>}
          {value}
          {unit && <span className="unit">{unit}</span>}
        </div>
        <div className="l">{label}</div>
      </div>
      <div className="vd" />
      <div className="d">
        <div className={`p ${dir === "up" ? "up" : "dn"}`}>
          <ArrowUp className="i13" />
          {pct}
        </div>
        <div className="c">vs. {compareLabel}</div>
      </div>
    </div>
  );
}
