import { useEffect, useRef, useState } from 'react'

// Sections fade and slide in the first time they scroll into view.
export default function Section({ id, eyebrow, title, subtitle, children, action }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      // threshold 0 = reveal on first contact (a % threshold never triggers early on very tall sections)
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className={`section reveal ${visible ? 'is-visible' : ''}`} id={id} aria-labelledby={`${id}-title`}>
      <header className="section__head">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="section__title">{title}</h2>
          {subtitle && <p className="section__sub">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
