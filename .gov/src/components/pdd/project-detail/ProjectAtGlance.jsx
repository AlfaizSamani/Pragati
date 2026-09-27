import React from "react";
import { TrainFront, Ruler, Users, Settings2, CalendarCheck2 } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

const ICONS = { TrainFront, Ruler, Users, Settings2, CalendarCheck2 };

export default function ProjectAtGlance({ project }) {
  return (
    <div className="pd-card">
      <div className="pd-card-title">{ui.glance.title}</div>
      <div className="pd-glance-list">
        {project.glance.map((item, i) => {
          const Icon = ICONS[item.icon] || TrainFront;
          return (
            <div className="pd-glance-row" key={i}>
              <div className="pd-glance-icn">
                <Icon size={15} />
              </div>
              <div>
                <div className="label">{item.label}</div>
                <div className="value">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
