import React, { useState, useRef, useEffect } from "react";
import { Bookmark, Download, ChevronDown, Share2, Check } from "lucide-react";
import { ui } from "../../../data/projectDetailData";

export default function TabBar({
  activeTab,
  onTabChange,
  onToast,
  onWatchlist,
  onToggleWatchlist,
  onDownload,
  onShare,
}) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const ref = useRef(null);
  const actions = ui.tabActions;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setDownloadOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function pick(option) {
    setDownloadOpen(false);
    if (onDownload) {
      onDownload(option);
    } else {
      onToast(actions.downloadToast.replace("{option}", option));
    }
  }

  return (
    <div className="pd-tabbar">
      <nav className="pd-tabs">
        {ui.tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => onTabChange(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      <div className="pd-tab-actions">
        <button
          className={`pd-outline-btn ${onWatchlist ? "on" : ""}`}
          onClick={() => (onToggleWatchlist ? onToggleWatchlist() : onToast(actions.addedToast))}
        >
          {onWatchlist ? <Check size={14} /> : <Bookmark size={14} />}
          {onWatchlist ? actions.onWatchlist : actions.addToWatchlist}
        </button>

        <div className="pd-dropdown-wrap" ref={ref}>
          <button className="pd-outline-btn" onClick={() => setDownloadOpen((v) => !v)}>
            <Download size={14} />
            {actions.downloadReport}
            <ChevronDown size={12} />
          </button>
          {downloadOpen && (
            <div className="pg-dropdown pd-download-dropdown">
              {actions.downloadOptions.map((opt) => (
                <button key={opt} onClick={() => pick(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="pd-dark-btn"
          onClick={() => (onShare ? onShare() : onToast(actions.shareToast))}
        >
          <Share2 size={14} />
          {actions.share}
        </button>
      </div>
    </div>
  );
}
