import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import MusicPlayer from './MusicPlayer.jsx'
import { useDate } from '../context/DateContext.jsx'

const LINKS = [
  { href: '#venues', label: 'Venues' },
  { href: '#gifts', label: 'Gifts' },
  { href: '#itinerary', label: 'Itinerary' },
  { href: '#outfit', label: 'Outfit' },
  { href: '#messages', label: 'Messages' },
  { href: '#icebreakers', label: 'Icebreakers' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { cityInfo } = useDate()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 12)
      let current = ''
      LINKS.forEach(({ href }) => {
        const el = document.getElementById(href.slice(1))
        if (el && el.getBoundingClientRect().top <= 150) current = href.slice(1)
      })
      setActive(current)
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

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <img className="brand__logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="40" height="40" />
          <span className="brand__name">VibeDate</span>
        </a>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href.slice(1) ? 'is-active' : ''}
              aria-current={active === l.href.slice(1) ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a className="city-pill" href="#city" title="Change city">
            <Icon name="pin" size={14} /> {cityInfo.name}
          </a>
          <a className="btn btn--primary btn--sm navbar__cta" href="#venues">Plan my date</a>
        </div>

        <MusicPlayer />

        <button
          type="button"
          className="navbar__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'x' : 'menu'} />
        </button>
      </div>
    </header>
  )
}
