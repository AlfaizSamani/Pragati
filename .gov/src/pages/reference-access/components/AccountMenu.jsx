import { useState, useCallback } from 'react'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'
import useClickOutside from './useClickOutside.js'
import { signOutUser } from '../../../services/authClient.js'

export default function AccountMenu() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useClickOutside(open, close)

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        type="button"
        className="who-btn"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="avatar">AS</div>
        <div className="who">
          <div className="who__name">A. Sharma</div>
          <div className="who__role">MoSPI Officer</div>
        </div>
        <ChevronDown size={16} strokeWidth={2} className={open ? 'chev-up' : ''} />
      </button>

      {open && (
        <div className="menu-panel menu-panel--sm menu-panel--right">
          <button type="button" className="menu-item" onClick={() => setOpen(false)}>
            <User size={15} strokeWidth={1.8} /><span>My Profile</span>
          </button>
          <button type="button" className="menu-item" onClick={() => setOpen(false)}>
            <Settings size={15} strokeWidth={1.8} /><span>Settings</span>
          </button>
          <button type="button" className="menu-item menu-item--danger" onClick={() => signOutUser().finally(() => setOpen(false))}>
            <LogOut size={15} strokeWidth={1.8} /><span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  )
}
