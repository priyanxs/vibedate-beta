import { useCallback, useEffect, useRef, useState } from 'react'
import { CITIES, kindOf, VENUES } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { cityPhoto } from '../utils/links'
import Section from './Section.jsx'
import Icon from './Icon.jsx'

const mod = (a, n) => ((a % n) + n) % n

// Shortest signed step between two ring positions (so the ring never spins the long way round).
const shortest = (from, to, n) => {
  let d = mod(to, n) - mod(from, n)
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

const sizeFor = (width) => {
  const cardW = width < 560 ? 148 : width < 900 ? 176 : 204
  const cardH = Math.round(cardW * 1.32)
  return { cardW, cardH }
}

/* A 3D ring of city photos (pure CSS 3D). Click a card, use the arrows, swipe or press ← → to spin. */
export default function CityRing() {
  const { city, setCity, cityInfo, cityVenues } = useDate()
  const n = CITIES.length
  const idx = CITIES.findIndex((c) => c.id === city)
  const [pos, setPos] = useState(idx)
  const [dims, setDims] = useState(() => sizeFor(typeof window === 'undefined' ? 1200 : window.innerWidth))
  const drag = useRef(null)
  const justSwiped = useRef(false)

  // Follow city changes made elsewhere (hero select, footer links) by taking the shortest turn.
  useEffect(() => {
    setPos((p) => {
      const d = shortest(p, idx, n)
      return d === 0 ? p : p + d
    })
  }, [idx, n])

  useEffect(() => {
    const onResize = () => setDims(sizeFor(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const go = useCallback(
    (delta) => {
      const next = pos + delta
      setPos(next)
      setCity(CITIES[mod(next, n)].id)
    },
    [pos, n, setCity],
  )

  const pick = (i) => {
    if (justSwiped.current) return // a swipe also fires a click on the card under the pointer; ignore it
    const d = shortest(pos, i, n)
    if (d !== 0) go(d)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, moved: false }
  }
  const onPointerUp = (e) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 48) {
      justSwiped.current = true
      setTimeout(() => { justSwiped.current = false }, 120)
      go(dx < 0 ? 1 : -1)
    }
  }

  const step = 360 / n
  // radius so neighbouring cards just touch, plus a small gap
  const radius = Math.round((dims.cardW / 2 / Math.tan(Math.PI / n)) * 1.14)
  const counts = cityVenues.reduce((acc, v) => {
    const k = kindOf(v)
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
  const total = VENUES.length

  return (
    <Section
      id="cities"
      eyebrow={`Step 1 · ${CITIES.length} cities, ${total} venues`}
      title="Where are you dating tonight?"
      subtitle="Spin the ring, or pick a card. Everything below follows your city."
    >
      <div
        className="ring"
        role="group"
        aria-label="Choose a city"
        tabIndex={0}
        onKeyDown={onKeyDown}
        style={{ '--card-w': `${dims.cardW}px`, '--card-h': `${dims.cardH}px`, '--ring-r': `${radius}px` }}
      >
        <div className="ring__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { drag.current = null }}>
          <div className="ring__spin" style={{ transform: `translateZ(${-radius}px) rotateY(${-pos * step}deg)` }}>
            {CITIES.map((c, i) => {
              const off = shortest(pos, i, n)
              const active = off === 0
              const photo = cityPhoto(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`ring__card ${active ? 'is-active' : ''}`}
                  style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, '--off': Math.abs(off) }}
                  aria-pressed={active}
                  aria-label={`${c.name}${active ? ' (selected)' : ''}`}
                  tabIndex={-1}
                  onClick={() => pick(i)}
                >
                  {photo && <img src={photo} alt="" loading="lazy" draggable="false" />}
                  <span className="ring__shade" />
                  <span className="ring__label">
                    <small>{c.group}</small>
                    <strong>{c.name}</strong>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button type="button" className="ring__arrow ring__arrow--prev" onClick={() => go(-1)} aria-label="Previous city">
          <Icon name="chevronLeft" size={22} />
        </button>
        <button type="button" className="ring__arrow ring__arrow--next" onClick={() => go(1)} aria-label="Next city">
          <Icon name="chevronRight" size={22} />
        </button>
      </div>

      <div className="ring__info" aria-live="polite">
        <h3 className="ring__name">{cityInfo.name}</h3>
        <p className="ring__blurb">{cityInfo.blurb}</p>
        <p className="ring__counts">
          <strong>{cityVenues.length}</strong> venues · <strong>{counts.cafe || 0}</strong> cafés · <strong>{counts.restaurant || 0}</strong> restaurants
          {counts.street ? <> · <strong>{counts.street}</strong> street food</> : null}
        </p>
        <a className="btn btn--primary" href="#venues">See {cityInfo.name} venues <Icon name="chevronDown" size={16} /></a>
      </div>
    </Section>
  )
}
