import { useMemo, useState } from 'react'
import { KIND_LABELS, VIBES, VIBE_LIST, kindOf } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { formatINR } from '../utils/format'
import { minDateCost } from '../utils/plan'
import { mapsViewUrl } from '../utils/links'
import Section from './Section.jsx'
import Icon from './Icon.jsx'
import MenuPanel from './MenuPanel.jsx'
import VenueBanner from './VenueBanner.jsx'
import CityBanner from './CityBanner.jsx'
import { burstHearts } from '../utils/fx'
import { useToast } from './Toast.jsx'

// 1–4 rupee signs, from "very affordable" to "special occasion"
const priceTier = (min) => (min < 600 ? 1 : min < 1500 ? 2 : min < 3000 ? 3 : 4)

export default function VenueExplorer() {
  const { budget, vibeFilter, setVibeFilter, venueId, selectVenue, venue, cityInfo, cityVenues } = useDate()
  const [showStretch, setShowStretch] = useState(false)
  const [kind, setKind] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('best')
  const toast = useToast()

  const kinds = useMemo(() => Object.keys(KIND_LABELS).filter((k) => cityVenues.some((v) => kindOf(v) === k)), [cityVenues])

  // If the chosen type does not exist in the new city, fall back to "all".
  const activeKind = kind === 'all' || kinds.includes(kind) ? kind : 'all'

  const { visible, hiddenCount } = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matches = (v) => !needle || `${v.name} ${v.cuisine} ${v.tagline}`.toLowerCase().includes(needle)
    const all = cityVenues.filter((v) => (vibeFilter === 'All' || v.vibe === vibeFilter) && (activeKind === 'all' || kindOf(v) === activeKind) && matches(v)).map((v) => ({
      venue: v,
      min: minDateCost(v),
    }))
    const byPrice = sort === 'low' ? (a, b) => a.min - b.min : (a, b) => b.min - a.min
    const fits = all.filter((x) => x.min <= budget).sort(byPrice)
    const stretch = all.filter((x) => x.min > budget).sort((a, b) => a.min - b.min)
    const keepSelected = stretch.filter((x) => x.venue.id === venueId)
    return {
      visible: showStretch ? [...fits, ...stretch] : [...fits, ...keepSelected],
      hiddenCount: stretch.length - (showStretch ? 0 : keepSelected.length),
    }
  }, [cityVenues, budget, vibeFilter, activeKind, venueId, showStretch, query, sort])

  const choose = (v) => {
    selectVenue(v.id)
    toast(`${v.name} chosen — build your menu below`)
    setTimeout(() => {
      const el = document.getElementById('menu')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <>
      <Section
        id="venues"
        eyebrow="Step 1 · Choose the setting"
        title={`${cityInfo.name} venues for your vibe`}
        subtitle={`Showing places where dinner for two can fit within ${formatINR(budget)}.`}
      >
        <CityBanner />

        <div className="chips" role="group" aria-label="Filter by vibe">
          {['All', ...VIBE_LIST].map((v) => (
            <button
              key={v}
              type="button"
              className={`chip ${vibeFilter === v ? 'is-active' : ''}`}
              aria-pressed={vibeFilter === v}
              onClick={() => setVibeFilter(v)}
            >
              {v !== 'All' && <span aria-hidden="true">{VIBES[v].emoji}</span>} {v}
            </button>
          ))}
        </div>

        <div className="chips chips--kind" role="group" aria-label="Filter by type">
          {['all', ...kinds].map((k) => (
            <button
              key={k}
              type="button"
              className={`chip chip--sm ${activeKind === k ? 'is-active' : ''}`}
              aria-pressed={activeKind === k}
              onClick={() => setKind(k)}
            >
              {k === 'all' ? 'All types' : KIND_LABELS[k]}
            </button>
          ))}
        </div>

        <div className="toolbar">
          <label className="search">
            <Icon name="search" size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${cityInfo.name} venues or cuisines`}
              aria-label="Search venues"
            />
          </label>
          <label className="sort">
            <span className="sr-only">Sort venues</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort venues">
              <option value="best">Best fit for budget</option>
              <option value="low">Price: low to high</option>
            </select>
          </label>
          <span className="toolbar__count" aria-live="polite">{visible.length} {visible.length === 1 ? 'venue' : 'venues'}</span>
        </div>

        {visible.length === 0 ? (
          <div className="empty glass">
            <p><strong>No venues fit this vibe and budget yet.</strong></p>
            <p>Try another vibe, raise your budget, or peek at the stretch picks below.</p>
          </div>
        ) : (
          <div className="venue-grid">
            {visible.map(({ venue: v, min }, index) => {
              const selected = v.id === venueId
              const fits = min <= budget
              return (
                <article key={v.id} className={`venue-card glass tilt rise ${selected ? 'is-selected' : ''}`} style={{ '--i': index }}>
                  <VenueBanner venue={v} className="venue-card__banner">
                    <span className="badge badge--glass venue-banner__badge">{v.vibe}</span>
                  </VenueBanner>
                  <div className="venue-card__body">
                    <h3 className="venue-card__name">{v.name}</h3>
                    <p className="venue-card__cuisine">{v.cuisine}</p>
                    <p className="venue-card__tag">{v.tagline}</p>
                    <ul className="tag-list">
                      {v.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                    <div className="venue-card__foot">
                      <div>
                        <span className={`badge ${fits ? 'badge--lime' : 'badge--warn'}`}>
                          {fits ? 'Fits your budget' : 'Above budget'}
                        </span>
                        <p className="venue-card__price">
                          From {formatINR(min)} for two{' '}
                          <span className="rupee-tier" role="img" aria-label={`Price level ${priceTier(min)} of 4`}>
                            <b>{'₹'.repeat(priceTier(min))}</b>{'₹'.repeat(4 - priceTier(min))}
                          </span>
                        </p>
                        <a
                          className="map-link"
                          href={mapsViewUrl(v)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${v.name} on Google Maps (opens in a new tab)`}
                        >
                          <Icon name="pin" size={14} /> View on Google Maps
                        </a>
                      </div>
                      <button
                        type="button"
                        className={`btn ${selected ? 'btn--success' : 'btn--primary'} btn--sm`}
                        onClick={(e) => {
                          if (!selected) burstHearts(e.currentTarget)
                          choose(v)
                        }}
                        aria-pressed={selected}
                      >
                        {selected ? (<><Icon name="check" size={16} /> Selected</>) : 'Choose'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {(hiddenCount > 0 || showStretch) && (
          <button type="button" className="link-btn" onClick={() => setShowStretch((s) => !s)}>
            {showStretch ? 'Hide venues above budget' : `Show ${hiddenCount} stretch ${hiddenCount === 1 ? 'pick' : 'picks'} above budget`}
          </button>
        )}
      </Section>

      {venue && <MenuPanel venue={venue} />}
    </>
  )
}
