const LINKS = [
  { label: 'Overview', href: '#/dashboard' },
  { label: 'Watchlist', href: '#/watchlist' },
  { label: 'Projects', href: '#/project' },
  { label: 'Early Warnings', href: '#/early-warnings' },
  { label: 'Analytics', href: '#/analytics' },
  { label: 'Intelligence', href: '#/intelligence' },
  { label: 'Data Update', href: '#/data-update' },
]

export default function Navigation() {
  return (
    <nav className="nav">
      {LINKS.map(({ label, href }) => (
        <a key={label} href={href}>{label}</a>
      ))}
    </nav>
  )
}
