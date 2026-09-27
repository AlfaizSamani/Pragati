import { X, ArrowRight } from 'lucide-react'

export default function SignInModal({ onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Sign in to PRAGATI">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          <X size={18} strokeWidth={2} />
        </button>

        <h3>Sign In to PRAGATI</h3>
        <p>Enter your registered official email to continue.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); onClose() }}
          className="modal__form"
        >
          <label>
            Official Email ID
            <input type="email" placeholder="name@nic.in" required autoFocus />
          </label>
          <label>
            Password
            <input type="password" placeholder="Enter your password" required />
          </label>
          <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: 4 }}>
            Continue <ArrowRight size={15} strokeWidth={2.2} />
          </button>
        </form>
      </div>
    </div>
  )
}
