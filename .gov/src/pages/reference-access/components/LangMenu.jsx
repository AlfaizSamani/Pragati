import { useState, useCallback } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import useClickOutside from './useClickOutside.js'

const LANGS = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: '\u0939\u093f\u0928\u094d\u0926\u0940' },
  { code: 'BN', label: '\u09ac\u09be\u0982\u09b2\u09be' },
  { code: 'TA', label: '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd' }
]

export default function LangMenu() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('EN')
  const close = useCallback(() => setOpen(false), [])
  const ref = useClickOutside(open, close)

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        type="button"
        className="lang"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={16} strokeWidth={1.8} />
        <span>{lang}</span>
        <ChevronDown size={14} strokeWidth={2} className={open ? 'chev-up' : ''} />
      </button>

      {open && (
        <ul className="menu-panel menu-panel--sm" role="listbox">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                className="menu-item"
                role="option"
                aria-selected={lang === l.code}
                onClick={() => { setLang(l.code); setOpen(false) }}
              >
                <span>{l.label}</span>
                {lang === l.code && <Check size={14} strokeWidth={2.4} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
