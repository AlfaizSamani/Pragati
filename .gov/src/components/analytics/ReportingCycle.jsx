import { Calendar } from "lucide-react";

export default function ReportingCycle({ cycle = "April 2026" }) {
  return (
    <div className="cycle">
      <Calendar className="i17" style={{ color: "#2E5F92" }} />
      <div>
        <div className="t">Reporting Cycle</div>
        <div className="v">{cycle}</div>
      </div>
    </div>
  );
}
