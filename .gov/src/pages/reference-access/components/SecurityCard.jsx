import { Lock } from 'lucide-react'
import watermark from '../assets/watermark.png'
import NB from './NB.jsx'

export default function SecurityCard() {
  return (
    <section className="s-card s-secure">
      <div className="s-secure__wm" style={{ backgroundImage: `url(${watermark})` }} />
      <div className="s-lock"><Lock size={17} strokeWidth={2} /></div>
      <div>
        <h4>A Secure &amp; Trusted Platform</h4>
        <p>
          Access to PRAGATI is restricted to<NB />
          authorized government officials and<NB />
          approved partners. All requests are<NB />
          verified to ensure data security and<NB />
          responsible use.
        </p>
      </div>
    </section>
  )
}
