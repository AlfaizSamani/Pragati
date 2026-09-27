import { useEffect, useRef } from 'react'

/** Calls onClose when a click/tap or Escape happens outside the returned ref. */
export default function useClickOutside(active, onClose) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return
    const handlePointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [active, onClose])

  return ref
}
