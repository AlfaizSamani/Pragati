import { TOP_PROJECTS, scoreColor } from "../../data/analyticsData";

export default function TopProjects({ applied, projects = [], dimension = "Sector", onViewAll }) {
  const rows = projects.length
    ? [...projects]
        .sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0))
        .slice(0, 10)
        .map((project) => ({
          n: project.name,
          s: project.sector || "Not reported",
          st: project.state || "Not reported",
          sc: Math.round(Number(project.riskScore || 0)),
        }))
    : TOP_PROJECTS.filter(
        (p) =>
          (applied.sector === "All Sectors" || p.s === applied.sector) &&
          (applied.stateName === "All States" || p.st === applied.stateName)
      ).slice(0, 10);

  return (
    <div className="card c-top">
      <div className="chead" style={{ marginBottom: 10, alignItems: "center" }}>
        <div className="ct serif">Top Projects by Risk Score · {dimension}</div>
        <a
          className="viewall"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onViewAll();
          }}
        >
          View All →
        </a>
      </div>
      <div className="tblwrap">
        <table>
          {/* percentage widths keep every column (and the Risk Score pill) inside the card */}
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "38%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Project Name</th>
              <th>Sector</th>
              <th>State</th>
              <th style={{ textAlign: "right" }}>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="noresult">
                    No projects match {applied.sector} · {applied.stateName}.
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((p, i) => (
                <tr key={p.n}>
                  <td className="num-c">{i + 1}</td>
                  <td style={{ fontWeight: 600, color: "#12324F", fontSize: 10 }} title={p.n}>
                    {p.n}
                  </td>
                  <td style={{ fontSize: 10 }}>{p.s === "Urban Infrastructure" ? "Urban Infra" : p.s}</td>
                  <td style={{ fontSize: 10 }}>{p.st}</td>
                  <td style={{ textAlign: "right" }}>
                    <span className="pill" style={{ background: scoreColor(p.sc) }}>
                      {p.sc}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
