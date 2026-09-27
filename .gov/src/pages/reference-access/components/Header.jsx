import { useState } from 'react'
import Brand from './Brand.jsx'
import Navigation from './Navigation.jsx'
import SearchBar from './SearchBar.jsx'
import LangMenu from './LangMenu.jsx'
import NotificationsMenu from './NotificationsMenu.jsx'
import AccountMenu from './AccountMenu.jsx'

export default function Header() {
  const [query, setQuery] = useState('')

  return (
    <header className="hdr">
      <Brand />
      <div className="hdr__rule" style={{ margin: '0 26px 0 26px' }} />
      <Navigation />

      <div className="hdr__util" style={{ marginLeft: 'auto' }}>
        <SearchBar value={query} onChange={setQuery} />

        <div style={{ marginLeft: 18 }}><LangMenu /></div>
        <div style={{ marginLeft: 26 }}><NotificationsMenu /></div>
        <div style={{ marginLeft: 19 }}><AccountMenu /></div>
      </div>
    </header>
  )
}
