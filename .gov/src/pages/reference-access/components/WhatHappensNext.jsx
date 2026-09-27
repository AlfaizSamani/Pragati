import { Clock } from 'lucide-react'
import NB from './NB.jsx'

const STEPS = [
  <>Submit your access request</>,
  <>Your request will be reviewed by the<NB /> PRAGATI admin team</>,
  <>You will be notified via email within<NB /> 3&ndash;5 working days</>,
  <>Once approved, you can sign in and<NB /> start using PRAGATI</>
]

export default function WhatHappensNext() {
  return (
    <section className="s-card s-next">
      <div className="s-head">
        <Clock size={24} strokeWidth={1.7} />
        <h4>What happens next?</h4>
      </div>
      <ol className="s-steps">
        {STEPS.map((s, i) => (
          <li className="s-step" key={i}>
            <i>{i + 1}</i>
            <p>{s}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
