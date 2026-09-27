import { ArrowDown, ArrowUp } from "lucide-react";

export default function SectorPerformance({ rows }) {
  return (
    <div className="card c-perf">
      <div className="ct serif" style={{ marginBottom: 10 }}>Sector Performance</div>
      <div className="tblwrap">
        <table>
          <colgroup>
            <col style={{ width: 22 }} />
            <col style={{ width: 128 }} />
            <col style={{ width: 72 }} />
            <col style={{ width: 74 }} />
            <col style={{ width: 88 }} />
            <col style={{ width: 82 }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Sector</th>
              <th>Total Projects</th>
              <th>High/Critical</th>
              <th>Portfolio Value</th>
              <th>Avg. Risk Score</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="noresult">No sectors match the current filters.</div>
                </td>
              </tr>
            ) : (
              rows.map((s, i) => {
                const up = s.dir === "up";
                const Arrow = up ? ArrowUp : ArrowDown;
                return (
                  <tr key={s.name}>
                    <td className="num-c">{i + 1}</td>
                    <td>
                      <span className="sec">
                        <i style={{ background: s.color }} />
                        {s.name}
                      </span>
                    </td>
                    <td>{s.total}</td>
                    <td>{s.hcTxt}</td>
                    <td>₹ {s.value.toFixed(1)} Lakh Cr</td>
                    <td>{s.risk}%</td>
                    <td>
                      <span className={up ? "tr-up" : "tr-dn"}>
                        <Arrow className="i13" />
                        {s.trend}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
