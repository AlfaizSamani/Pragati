import { User, BarChart3, Landmark, Users } from 'lucide-react'
import RoleCard from './RoleCard.jsx'
import NB from './NB.jsx'

const ROLES = [
  { id: 'gov',     icon: User,      title: 'Government Official',
    description: <>(Central / State Government<NB /> officials)</> },
  { id: 'analyst', icon: BarChart3, title: 'Ministry Analyst',
    description: <>(Analysts and research teams<NB /> in line ministries)</> },
  { id: 'nodal',   icon: Landmark,  title: 'State Nodal Officer',
    description: <>(State-level project<NB /> monitoring officials)</> },
  { id: 'partner', icon: Users,     title: 'Authorized Partner',
    description: <>(Researchers, development<NB /> partners, or authorized<NB /> agencies)</> }
]

export default function AccessRole({ value, onChange }) {
  return (
    <section className="sec">
      <h3>2. Access Role</h3>
      <p className="sec__hint">Select the role that best matches your responsibilities.</p>
      <div className="roles" role="radiogroup" aria-label="Access role">
        {ROLES.map((r) => (
          <RoleCard
            key={r.id}
            {...r}
            selected={value === r.id}
            onSelect={() => onChange(r.id)}
          />
        ))}
      </div>
    </section>
  )
}
