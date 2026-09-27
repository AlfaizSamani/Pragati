import { useState, useCallback } from 'react'
import { Bell, FileCheck2, UserCheck, AlertTriangle } from 'lucide-react'
import useClickOutside from './useClickOutside.js'

const ITEMS = [
  { icon: FileCheck2,    text: 'Your access request was received.',            time: 'Just now' },
  { icon: UserCheck,     text: 'PRAGATI admin team started reviewing it.',      time: '2h ago' },
  { icon: AlertTriangle, text: '3 projects need an updated status this week.',  time: '1d ago' }
]

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useClickOutside(open, close)

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        type="button"
        className="bell"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.8} />
        <span className="bell__dot">{ITEMS.length}</span>
      </button>

      {open && (
        <div className="menu-panel menu-panel--wide">
          <div className="menu-panel__head">Notifications</div>
          <ul>
            {ITEMS.map(({ icon: Icon, text, time }, i) => (
              <li className="notif" key={i}>
                <span className="notif__ico"><Icon size={15} strokeWidth={1.8} /></span>
                <span>
                  <span className="notif__text">{text}</span>
                  <span className="notif__time">{time}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
