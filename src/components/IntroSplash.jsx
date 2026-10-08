import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../utils/fx'

const KEY = 'vibedate:splash'

// A short logo intro on the first visit of a session. Skipped for reduced-motion users.
export default function IntroSplash() {
  const [phase, setPhase] = useState(() => {
    try {
      if (sessionStorage.getItem(KEY) || prefersReducedMotion()) return 'done'
    } catch {
      return 'done'
    }
    return 'show'
  })

  // Run once on mount. (Keying this on `phase` would clear the "done" timer as soon as the phase changes.)
  useEffect(() => {
    if (phase !== 'show') return undefined
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    const hide = setTimeout(() => setPhase('hide'), 1100)
    const done = setTimeout(() => setPhase('done'), 1700)
    return () => {
      clearTimeout(hide)
      clearTimeout(done)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`splash ${phase === 'hide' ? 'is-hiding' : ''}`} aria-hidden="true">
      <img className="splash__logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="96" height="96" />
      <span className="splash__name">VibeDate</span>
      <span className="splash__bar" />
    </div>
  )
}
