export default function FormField({ label, required, children }) {
  return (
    <div className="field">
      <span className="field__label">
        {label}{required && <> <span className="req">*</span></>}
      </span>
      {children}
    </div>
  )
}
