import { useEffect } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Little burst of hearts flying out of an element (used when you add something to the plan). */
export const burstHearts = (el) => {
  if (!el || prefersReducedMotion()) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const count = 8
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('span')
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const dist = 46 + Math.random() * 34
    heart.className = 'fx-heart'
    heart.textContent = '♥'
    heart.setAttribute('aria-hidden', 'true')
    heart.style.left = `${cx}px`
    heart.style.top = `${cy}px`
    heart.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    heart.style.setProperty('--dy', `${Math.sin(angle) * dist - 26}px`)
    heart.style.setProperty('--rot', `${(Math.random() - 0.5) * 90}deg`)
    heart.style.setProperty('--size', `${12 + Math.random() * 10}px`)
    heart.style.color = i % 3 === 0 ? '#a3e635' : i % 3 === 1 ? '#ff5c7c' : '#ff8fb1'
    document.body.appendChild(heart)
    setTimeout(() => heart.remove(), 1000)
  }
}

/**
 * Global pointer effects:
 *  - `.glass` cards get a soft spotlight that follows the cursor (--mx / --my)
 *  - `.tilt` cards tilt gently towards the cursor (--rx / --ry)
 * Only active for real mouse pointers and when motion is allowed.
 */
export const usePointerFx = () => {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    let frame = 0
    const onMove = (e) => {
      if (frame) return
      const { target, clientX, clientY } = e
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!(target instanceof Element)) return
        const glass = target.closest('.glass')
        if (glass) {
          const r = glass.getBoundingClientRect()
          glass.style.setProperty('--mx', `${clientX - r.left}px`)
          glass.style.setProperty('--my', `${clientY - r.top}px`)
        }
        const tilt = target.closest('.tilt')
        if (tilt) {
          const r = tilt.getBoundingClientRect()
          const px = (clientX - r.left) / r.width - 0.5
          const py = (clientY - r.top) / r.height - 0.5
          tilt.style.setProperty('--ry', `${(px * 7).toFixed(2)}deg`)
          tilt.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`)
        }
      })
    }
    const onOut = (e) => {
      const tilt = e.target instanceof Element ? e.target.closest('.tilt') : null
      if (tilt && !tilt.contains(e.relatedTarget)) {
        tilt.style.setProperty('--rx', '0deg')
        tilt.style.setProperty('--ry', '0deg')
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])
}
