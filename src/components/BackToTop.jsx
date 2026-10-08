import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Appears after you scroll down; the ring shows how far through the page you are.
export default function BackToTop() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setPct(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const show = pct > 0.06

  return (
    <button
      type="button"
      className={`to-top ${show ? 'is-visible' : ''}`}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg className="to-top__ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={RADIUS} className="to-top__track" />
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          className="to-top__bar"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
        />
      </svg>
      <Icon name="arrowUp" size={18} />
    </button>
  )
}
