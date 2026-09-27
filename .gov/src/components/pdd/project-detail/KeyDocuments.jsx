import React from "react";
import { FileText, Download, ArrowRight } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

export default function KeyDocuments({ project, onToast, onViewAll }) {
  const c = ui.documents;
  return (
    <div className="pd-card">
      <div className="pd-card-title-row">
        <div className="pd-card-title">{c.title}</div>
        <button className="pd-link" onClick={() => (onViewAll ? onViewAll() : onToast(c.viewAllToast))}>
          {c.viewAll} <ArrowRight size={12} />
        </button>
      </div>
      <div className="pd-doc-list">
        {project.documents.map((doc) => (
          <div className="pd-doc-row" key={doc.id}>
            <div className="pd-doc-icn">
              <FileText size={15} />
            </div>
            <div>
              <div className="name">{doc.name}</div>
              <div className="meta">{doc.meta}</div>
            </div>
            <button
              className="pd-doc-dl"
              onClick={() => onToast(c.downloadToast.replace("{name}", doc.name))}
            >
              <Download size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
