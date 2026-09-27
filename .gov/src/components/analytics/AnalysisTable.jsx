import { ArrowUp, ArrowDown } from "lucide-react";

export default function AnalysisTable({ rows, labelHeader = "Sector", title = "Performance" }) {
  return (
    <div className="card c-perf">
      <div className="ct serif" style={{ marginBottom: 10 }}>{title}</div>
      <div className="tblwrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>{labelHeader}</th>
              <th>Total Projects</th>
              <th>High/Critical</th>
              <th>Portfolio Value</th>
              <th>Avg. Risk Score</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7}><div className="noresult">No data matches the current filters.</div></td></tr>
            ) : rows.map((r, i) => {
              const up = r.dir === "up";
              return (
                <tr key={r.name}>
                  <td className="num-c">{i + 1}</td>
                  <td><span className="sec"><i style={{ background: r.color }} />{r.name}</span></td>
                  <td>{r.total}</td>
                  <td>{r.hcTxt}</td>
                  <td>₹ {r.value.toFixed(1)} Lakh Cr</td>
                  <td>{r.risk}%</td>
                  <td>
                    <span className={up ? "tr-up" : "tr-dn"}>
                      {up ? <ArrowUp className="i13" /> : <ArrowDown className="i13" />}
                      {r.trend}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}