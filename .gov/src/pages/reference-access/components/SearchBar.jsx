import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <Search size={14} strokeWidth={2} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects, states, sectors..."
        aria-label="Search projects, states, sectors"
      />
    </div>
  )
}
