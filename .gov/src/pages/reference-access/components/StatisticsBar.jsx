import { Landmark, Building2, MapPin } from 'lucide-react'

const STATS = [
  { icon: Landmark,  value: '1,700+',         label: 'Projects Monitored'   },
  { icon: Building2, value: '36',             label: 'Ministries & Agencies' },
  { icon: MapPin,    value: 'All States & UTs', label: 'Covered'            }
]

export default function StatisticsBar() {
  return (
    <div className="stats">
      {STATS.map(({ icon: Icon, value, label }) => (
        <div className="stat" key={label}>
          <Icon size={24} strokeWidth={1.5} />
          <div>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
