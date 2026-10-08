import { useState } from 'react'
import Icon from './Icon.jsx'

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

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <img className="brand__logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="40" height="40" />
          <span className="brand__name">VibeDate</span>
        </a>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </nav>

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
