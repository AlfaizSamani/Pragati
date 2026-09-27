import { BarChart3, Landmark, MapPin, TrendingUp } from "lucide-react";
import { TABS } from "../../data/analyticsData";

const ICONS = {
  "Sector Analysis": BarChart3,
  "Ministry Analysis": Landmark,
  "State Analysis": MapPin,
  "Portfolio Trends": TrendingUp,
};

export default function AnalyticsTabs({ active, onSelect }) {
  return (
    <div className="tabs">
      {TABS.map((t) => {
        const Icon = ICONS[t];
        return (
          <button key={t} className={`tab${t === active ? " active" : ""}`} onClick={() => onSelect(t)}>
            <Icon className="i16" />
            {t}
          </button>
        );
      })}
    </div>
  );
}
