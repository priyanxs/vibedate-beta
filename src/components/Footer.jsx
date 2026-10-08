import { CITIES } from '../data'
import { useDate } from '../context/DateContext.jsx'

const EXPLORE = [
  { href: '#venues', label: 'Venues & menus' },
  { href: '#gifts', label: 'Gift suggester' },
  { href: '#itinerary', label: 'Itinerary builder' },
  { href: '#outfit', label: 'Outfit coordinator' },
  { href: '#messages', label: 'Message writer' },
  { href: '#icebreakers', label: 'Conversation deck' },
]

export default function Footer() {
  const { city, setCity } = useDate()

  const goToCity = (id) => {
    setCity(id)
    setTimeout(() => {
      const el = document.getElementById('venues')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <p className="brand brand--footer">
            <img className="brand__logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="40" height="40" />
            <span className="brand__name">VibeDate</span>
          </p>
          <p className="footer__note">
            Plan the date. Keep the vibe. A budget-aware date planner for Bhopal and India’s metro cities.
          </p>
        </div>

        <nav className="footer__col" aria-label="Explore">
          <h2 className="footer__h">Explore</h2>
          <ul>
            {EXPLORE.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__h">Cities</h2>
          <ul className="footer__cities">
            {CITIES.map((c) => (
              <li key={c.id}>
                <button type="button" className={city === c.id ? 'is-active' : ''} onClick={() => goToCity(c.id)}>
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer__legal">
        <p>
          Venue details, menus and prices are illustrative sample data — please confirm with the venue before you go.
          Photos are from Wikimedia Commons contributors under their licences (credited in the app).
          Music: Erik Satie’s Gymnopédie No. 1 and No. 3, classical-guitar recordings by Michael Laucke (public domain, via Wikimedia Commons).
          Be kind, be honest and respect boundaries. Plans are saved only on this device.
        </p>
      </div>
    </footer>
  )
}
