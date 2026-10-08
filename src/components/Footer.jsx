import { CITIES, VENUE_BY_ID } from '../data'
import { CITY_PHOTO_CREDITS } from '../cityPhotos'
import { PHOTO_CREDITS } from '../photoCredits'
import { GIFT_PHOTO_CREDITS } from '../giftPhotos'
import { DISH_PHOTO_CREDITS } from '../dishPhotos'
import { GIFT_BY_ID } from '../data'
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
        <details className="credits">
          <summary>Photo credits</summary>
          <ul>
            {Object.entries(CITY_PHOTO_CREDITS).map(([id, c]) => (
              <li key={`c-${id}`}>
                {(CITIES.find((x) => x.id === id) || {}).name}: {c.landmark} — {c.author},{' '}
                <a href={c.source} target="_blank" rel="noopener noreferrer">{c.license}</a>
              </li>
            ))}
            {Object.entries(DISH_PHOTO_CREDITS).map(([key, c]) => (
              <li key={`d-${key}`}>
                Dish · {key} — {c.author},{' '}
                <a href={c.source} target="_blank" rel="noopener noreferrer">{c.license}</a>
              </li>
            ))}
            {Object.entries(GIFT_PHOTO_CREDITS).map(([id, c]) => (
              <li key={`g-${id}`}>
                Gift · {(GIFT_BY_ID[id] || {}).name || id} — {c.author},{' '}
                <a href={c.source} target="_blank" rel="noopener noreferrer">{c.license}</a>
              </li>
            ))}
            {Object.entries(PHOTO_CREDITS).map(([id, c]) => (
              <li key={`v-${id}`}>
                {(VENUE_BY_ID[id] || {}).name || id}: {c.note} — {c.author},{' '}
                <a href={c.source} target="_blank" rel="noopener noreferrer">{c.license}</a>
              </li>
            ))}
          </ul>
        </details>
        <p>
          Venue details, menus and prices are illustrative sample data — please confirm with the venue before you go.
          Photos are from Wikimedia Commons contributors under their licences (credited in the app).
          Be kind, be honest and respect boundaries. Plans are saved only on this device.
        </p>
        <p className="footer__links">
          © {new Date().getFullYear()} VibeDate · <a href={`${import.meta.env.BASE_URL}privacy.html`}>Privacy policy</a> ·{' '}
          <a href="https://github.com/priyanxs/vibedate-beta/issues" target="_blank" rel="noopener noreferrer">Report a problem</a>
        </p>
      </div>
    </footer>
  )
}
