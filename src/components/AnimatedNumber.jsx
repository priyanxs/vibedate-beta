import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/fx'

// Smoothly counts from the previous value to the new one.
export default function AnimatedNumber({ value, format, duration = 450 }) {
  const safeVal = Number.isFinite(value) ? value : 0
  const [shown, setShown] = useState(safeVal)
  const current = useRef(safeVal)
  const fmt = typeof format === 'function' ? format : (n) => String(Math.round(n || 0))

  useEffect(() => {
    if (prefersReducedMotion()) {
      current.current = safeVal
      setShown(safeVal)
      return undefined
    }
    const from = current.current
    const start = performance.now()
    let frame = 0
    const tick = (now) => {
      // rAF timestamps can be a hair earlier than `start`, so clamp to [0, 1] (a negative t would overshoot wildly)
      const t = Math.max(0, Math.min(1, (now - start) / duration))
      const eased = 1 - (1 - t) ** 3
      current.current = from + (safeVal - from) * eased
      setShown(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    // Safety net: browsers pause animation frames for hidden or throttled windows. Whatever happens, the number must end on the true value.
    const settle = setTimeout(() => {
      cancelAnimationFrame(frame)
      current.current = safeVal
      setShown(safeVal)
    }, duration + 80)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
  }, [safeVal, duration])

  return <>{fmt(shown)}</>
}
