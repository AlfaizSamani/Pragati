import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Lightweight toast notification, rendered fixed at the bottom-center.
 * Message text comes from the page's data layer.
 */
export default function Toast({ message }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {}, 0);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <div className="pg-toast" role="status">
      <CheckCircle2 size={15} />
      {message}
    </div>
  );
}
