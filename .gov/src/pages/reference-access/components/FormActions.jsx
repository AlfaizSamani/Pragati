import { ArrowRight } from 'lucide-react'

export default function FormActions({ onDraft, busy = false }) {
  return (
    <div className="actions">
      <button type="button" className="btn btn--ghost" onClick={onDraft}>Save as Draft</button>
      <button type="submit" className="btn btn--primary" disabled={busy}>
        {busy ? 'Submitting...' : 'Submit Request'}
        <ArrowRight size={15} strokeWidth={2.2} />
      </button>
    </div>
  )
}
