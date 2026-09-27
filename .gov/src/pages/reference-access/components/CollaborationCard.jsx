import { Landmark } from 'lucide-react'
import NB from './NB.jsx'

export default function CollaborationCard() {
  return (
    <section className="s-card s-collab">
      <Landmark className="s-collab__ico" size={38} strokeWidth={1.4} />
      <div>
        <p>
          Collaborating for<NB />
          infrastructure progress,<NB />
          across ministries, states and<NB />
          partners.
        </p>
        <i />
      </div>
    </section>
  )
}
