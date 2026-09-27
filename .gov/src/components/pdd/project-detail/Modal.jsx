import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Reusable modal dialog: overlay + centered panel, closes on
 * overlay click or Escape. Title/body all come from the caller
 * (everything data-driven at the page level).
 */
export default function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="pd-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`pd-modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true">
        <div className="pd-modal-head">
          <div className="pd-modal-title">{title}</div>
          <button className="pd-modal-close" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>
        <div className="pd-modal-body">{children}</div>
      </div>
    </div>
  );
}
