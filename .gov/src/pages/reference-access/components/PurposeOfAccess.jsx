const MAX = 500

export default function PurposeOfAccess({ value, onChange }) {
  return (
    <section className="sec">
      <h3>3. Purpose of Access</h3>
      <p className="sec__hint">
        Tell us how you plan to use PRAGATI. This helps us route your request to the right approver.
      </p>
      <div className="purpose">
        <textarea
          maxLength={MAX}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX))}
          placeholder="Please describe the purpose of acces, your role in project monitoring, and the specific information you need."
          aria-label="Purpose of access"
        />
        <div className="counter">{value.length} / {MAX}</div>
      </div>
    </section>
  )
}
