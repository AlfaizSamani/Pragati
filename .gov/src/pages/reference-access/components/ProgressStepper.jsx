const STEPS = ['Basic Information', 'Role & Organization', 'Justification', 'Review & Submit']

export default function ProgressStepper({ current = 1 }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => (
        <div key={label} className={'step' + (i + 1 === current ? ' is-active' : '')}>
          <div className="step__dot">{i + 1}</div>
          <div className="step__label">{label}</div>
        </div>
      ))}
    </div>
  )
}
