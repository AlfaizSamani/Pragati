import { AlertTriangle, BarChart3, FileText, IndianRupee } from "lucide-react";
import KPICard from "./KPICard";
import { fmt } from "../../data/analyticsData";

export default function KPISection({ applied, summary }) {
  const totalP = summary?.total_projects ?? 0;
  const totalV = (summary?.total_cost_current_cr ?? 0) / 100000;
  const totalH = (summary?.high_risk_count ?? 0) + (summary?.critical_risk_count ?? 0);
  const scoped = applied.sector !== "All Sectors";
  const compareLabel = applied.compareLabel || "previous period";

  const cards = [
    { icon: FileText, bg: "#EAF2FB", color: "#2E7CC4", value: fmt(totalP), label: scoped ? "Projects in scope" : "Total Projects", dir: "up", pct: "—" },
    { icon: IndianRupee, bg: "#FDF2E6", color: "#E0842A", value: totalV.toFixed(1), unit: "Lakh Cr", currency: true, label: "Total Portfolio Value", dir: "up", pct: "8%" },
    { icon: AlertTriangle, bg: "#FDECEA", color: "#D9453A", value: fmt(totalH), label: "High Priority Projects", dir: "down", pct: "—" },
    { icon: BarChart3, bg: "#EEF1F6", color: "#5E7793", value: "—", label: "Newly Deteriorated", dir: "down", pct: "—" },
  ];

  return (
    <div className="row kpirow">
      {cards.map((c) => (
        <KPICard key={c.label} {...c} compareLabel={compareLabel} />
      ))}
    </div>
  );
}
