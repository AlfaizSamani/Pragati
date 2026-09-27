import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Filter, Download, List, Grid3X3 } from "lucide-react";
import { filterOptions, sortOptions } from "../../data/watchlistData";

const DEFAULTS = {
  State: "Maharashtra",
  Sector: "Transport",
  Ministry: "All Ministries",
  "Implementing Agency": "All Agencies",
  "Risk Level": "All Risk Levels",
};

function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isDefaultAll = value.startsWith("All");

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="pg-field" ref={ref}>
      <label>{label}</label>
      <button className="pg-select-mock" onClick={() => setOpen((v) => !v)}>
        {isDefaultAll ? (
          <span>{value}</span>
        ) : (
          <span className="chip-in">
            {value}
            <X
              size={11}
              onClick={(e) => {
                e.stopPropagation();
                onChange(DEFAULTS[label]);
              }}
            />
          </span>
        )}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="pg-dropdown pg-select-dropdown">
          {options.map((opt) => (
            <button
              key={opt}
              className={opt === value ? "active" : ""}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterBar({
  filters,
  onFilterChange,
  onClearAll,
  onApply,
  matchCount,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  onExport,
  activeLensLabel,
  onRemoveLensChip,
  availableFilterOptions,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const chips = [
    ...(activeLensLabel ? [{ key: "lens", label: activeLensLabel, onRemove: onRemoveLensChip }] : []),
    ...Object.entries(filters)
      .filter(([key, val]) => val !== DEFAULTS[key])
      .map(([key, val]) => ({
        key,
        label: val,
        onRemove: () => onFilterChange(key, DEFAULTS[key]),
      })),
  ];

  const opts = availableFilterOptions || filterOptions;

  return (
    <div className="pg-filters-bar">
      <div className="pg-filters-row">
        <div className="pg-filters-grid">
          {Object.keys(opts).map((key) => (
            <FilterSelect
              key={key}
              label={key}
              value={filters[key]}
              options={opts[key]}
              onChange={(val) => onFilterChange(key, val)}
            />
          ))}
        </div>
        <div className="pg-filters-actions">
          <button className="pg-clear-link" onClick={onClearAll}>
            Clear All
          </button>
          <button className="pg-apply-btn" onClick={onApply}>
            <Filter size={14} />
            Apply Filters
          </button>
        </div>
      </div>

      <div className="pg-active-filters-row">
        {chips.map((chip) => (
          <span className="pg-filter-chip" key={chip.key}>
            {chip.label}
            <X size={12} onClick={chip.onRemove} />
          </span>
        ))}
        <span className="pg-match-count">
          <b>{matchCount}</b> projects match your investigation
        </span>
        <span className="pg-spacer" />

        <div className="pg-sort-mock" ref={sortRef}>
          Sort by
          <button className="pg-select-mock" onClick={() => setSortOpen((v) => !v)}>
            <span>{sortOrder}</span>
            <ChevronDown size={11} />
          </button>
          {sortOpen && (
            <div className="pg-dropdown pg-select-dropdown pg-sort-dropdown">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  className={opt === sortOrder ? "active" : ""}
                  onClick={() => {
                    onSortChange(opt);
                    setSortOpen(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pg-view-toggle">
          <button className={viewMode === "list" ? "active" : ""} onClick={() => onViewModeChange("list")}>
            <List size={14} />
          </button>
          <button className={viewMode === "grid" ? "active" : ""} onClick={() => onViewModeChange("grid")}>
            <Grid3X3 size={14} />
          </button>
        </div>

        <button className="pg-export-btn" onClick={onExport}>
          <Download size={14} />
          Export
        </button>
      </div>
    </div>
  );
}
