import { ChevronDown } from "lucide-react";
import { COMPARE, PERIODS, SECTORS, STATES } from "../../data/analyticsData";

function Field({ id, label, cls, value, onChange, children }) {
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <div className={`sel ${cls}`}>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {children}
        </select>
        <ChevronDown className="i14 ch" />
      </div>
    </div>
  );
}

/** Time Period / Compare With / Sector / State + Apply. `draft` is the un-applied selection. */
export default function FilterBar({ draft, onChange, onApply }) {
  return (
    <div className="filters">
      <Field id="fPeriod" label="Time Period" cls="w1" value={draft.months} onChange={(v) => onChange({ months: parseInt(v, 10) })}>
        {PERIODS.map((p) => (
          <option key={p.months} value={p.months}>
            {p.label}
          </option>
        ))}
      </Field>
      <Field id="fCompare" label="Compare With" cls="w2" value={draft.compare} onChange={(v) => onChange({ compare: v })}>
        {COMPARE.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </Field>
      <Field id="fSector" label="Sector" cls="w3" value={draft.sector} onChange={(v) => onChange({ sector: v })}>
        {["All Sectors", ...SECTORS.map((s) => s.name)].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </Field>
      <Field id="fState" label="State" cls="w4" value={draft.stateName} onChange={(v) => onChange({ stateName: v })}>
        {STATES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </Field>
      <button className="apply" id="applyBtn" onClick={onApply}>
        Apply
      </button>
    </div>
  );
}
