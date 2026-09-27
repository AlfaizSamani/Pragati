import { ArrowRight, Lightbulb } from "lucide-react";

export default function KeyInsights({ cycle, rows = [], dimension = "Sector", onViewDetails }) {
  const ranked = [...rows].sort((a, b) => b.risk - a.risk);
  const projectCount = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  const highRiskCount = rows.reduce((sum, row) => sum + Number(row.hc || 0), 0);
  const averageRisk = projectCount
    ? Math.round(rows.reduce((sum, row) => sum + Number(row.risk || 0) * Number(row.total || 0), 0) / projectCount)
    : 0;
  const insights = [
    ranked[0] ? `${ranked[0].name} has the highest average risk score at ${ranked[0].risk}%.` : `No ${dimension.toLowerCase()} data is available for this cycle.`,
    `${highRiskCount.toLocaleString("en-IN")} of ${projectCount.toLocaleString("en-IN")} projects are in the high or critical risk bands.`,
    `The weighted portfolio risk score for this ${dimension.toLowerCase()} view is ${averageRisk}%.`,
  ];

  return (
    <div className="card c-key">
      <div className="keyhead">
        <span className="bulb">
          <Lightbulb className="i20" />
        </span>
        <div>
          <h3 className="serif">Key Insights</h3>
          <div className="cs" style={{ marginTop: 2 }}>{cycle}</div>
        </div>
      </div>
      <div>
        {insights.map((text, i) => (
          <div className="ins" key={i}>
            <span className="num">{i + 1}</span>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <a
        className="vdi"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onViewDetails();
        }}
      >
        View Detailed Insights
        <ArrowRight className="i13" />
      </a>
    </div>
  );
}
