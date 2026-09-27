import { useState, useCallback, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import useClickOutside from './useClickOutside.js'

/**
 * Fully-styled replacement for <select>. Native option lists are painted by
 * the OS (that's the default blue/white highlight) and can't be recolored
 * with CSS, so the highlighted/selected row here is real markup we control.
 */
export default function CustomSelect({ label, placeholder, options, value, onChange, compact }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useClickOutside(open, close)
  const btnRef = useRef(null)

  const pick = (v) => { onChange(v); setOpen(false); btnRef.current?.focus() }

  return (
    <div className={'csel' + (compact ? ' csel--compact' : '')} ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className={'csel__trigger' + (value ? '' : ' is-empty')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={14} strokeWidth={2} className={open ? 'chev-up' : ''} />
      </button>

      {open && (
        <ul className="csel__panel" role="listbox" tabIndex={-1}>
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                className={'csel__opt' + (o === value ? ' is-sel' : '')}
                role="option"
                aria-selected={o === value}
                onClick={() => pick(o)}
              >
                <span>{o}</span>
                {o === value && <Check size={14} strokeWidth={2.4} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
