import { CircleHelp, Mail, Phone, ArrowRight } from 'lucide-react'
import NB from './NB.jsx'

export default function HelpCard() {
  return (
    <section className="s-card s-help">
      <div className="s-head">
        <CircleHelp size={24} strokeWidth={1.7} />
        <h4>Need Help?</h4>
      </div>
      <p>For any queries related to access, please<NB /> contact the PRAGATI support team.</p>

      <div className="s-rows">
        <a className="s-row" href="mailto:support-pragati@nic.in">
          <span className="s-row__ico"><Mail size={13} strokeWidth={2} /></span>
          support-pragati@nic.in
        </a>
        <a className="s-row" href="tel:+911124360000">
          <span className="s-row__ico"><Phone size={13} strokeWidth={2} /></span>
          +91 11 2436 XXXX
        </a>
        <a className="s-row s-row--link" href="#" onClick={(e) => e.preventDefault()}>
          View Access Guidelines
          <ArrowRight size={13} strokeWidth={2.2} />
        </a>
      </div>
    </section>
  )
}
