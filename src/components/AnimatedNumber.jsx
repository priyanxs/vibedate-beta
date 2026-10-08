import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/fx'

// Smoothly counts from the previous value to the new one.
export default function AnimatedNumber({ value, format, duration = 450 }) {
  const [shown, setShown] = useState(value)
  const current = useRef(value)

  useEffect(() => {
    if (prefersReducedMotion()) {
      current.current = value
      setShown(value)
      return undefined
    }
    const from = current.current
    const start = performance.now()
    let frame = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      current.current = from + (value - from) * eased
      setShown(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <>{format(shown)}</>
}
