import React from "react";
import { IndianRupee, CalendarDays } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

function Col({ label, children, note, noteTone, danger }) {
  return (
    <div className="pd-info-col">
      <span className="k">{label}</span>
      <span className={`v ${danger ? "danger" : ""}`}>{children}</span>
      {note && <span className={`note ${noteTone || ""}`}>{note}</span>}
    </div>
  );
}

export default function FinancialScheduleInfo({ project }) {
  const f = project.financial;
  const s = project.schedule;
  const behind = /behind/i.test(s.currentPosition);
  const ahead = /ahead/i.test(s.currentPosition);

  return (
    <div className="pd-two-col">
      <div className="pd-card pd-info-card">
        <div className="pd-card-title-row small">
          <div className="pd-info-icn orange">
            <IndianRupee size={14} />
          </div>
          <div className="pd-card-title">{ui.financial.title}</div>
        </div>
        <div className="pd-info-grid">
          <Col label={ui.financial.labels.original}>{f.originalCost}</Col>
          <Col label={ui.financial.labels.revised} note={`(+${f.revisedDelta}%)`} noteTone={f.revisedDelta >= 0 ? "good" : "good"}>
            {f.revisedCost}
          </Col>
          <Col label={ui.financial.labels.expenditure} note={f.expenditureNote} noteTone="good">
            {f.expenditure}
          </Col>
        </div>
      </div>

      <div className="pd-card pd-info-card">
        <div className="pd-card-title-row small">
          <div className="pd-info-icn blue">
            <CalendarDays size={14} />
          </div>
          <div className="pd-card-title">{ui.schedule.title}</div>
        </div>
        <div className="pd-info-grid">
          <Col label={ui.schedule.labels.original}>{s.originalCompletion}</Col>
          <Col label={ui.schedule.labels.revised}>{s.revisedCompletion}</Col>
          <Col label={ui.schedule.labels.current} danger={behind}>
            <span className={ahead ? "good-text" : ""}>{s.currentPosition}</span>
          </Col>
        </div>
      </div>
    </div>
  );
}
