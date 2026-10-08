import { useMemo } from 'react'
import { BUDGET, CITIES, CITY_GROUPS, GIFTS, VIBES, VIBE_LIST, budgetTier } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { formatINR } from '../utils/format'
import { minDateCost } from '../utils/plan'
import Icon from './Icon.jsx'
import AnimatedNumber from './AnimatedNumber.jsx'
import HeroScene from './HeroScene.jsx'
import { useToast } from './Toast.jsx'

const whole = (n) => String(Math.round(n))

const Words = ({ words, from = 0 }) =>
  words.map((w, i) => (
    <span key={w} className="word" style={{ '--w': from + i }}>{w}</span>
  ))

export default function Hero() {
  const { budget, setBudget, vibeFilter, setVibeFilter, city, setCity, cityInfo, cityVenues } = useDate()
  const toast = useToast()

  const pct = ((budget - BUDGET.min) / (BUDGET.max - BUDGET.min)) * 100
  const fitCount = useMemo(() => cityVenues.filter((v) => minDateCost(v) <= budget).length, [cityVenues, budget])

  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow rise" style={{ '--i': 0 }}>{cityInfo.name} · date planner</p>
          <h1 className="hero__title" aria-label="Plan the date. Keep the vibe.">
            <span className="hero__line" aria-hidden="true"><Words words={['Plan', 'the', 'date.']} /></span>
            <span className="hero__line hero__accent" aria-hidden="true"><Words words={['Keep', 'the', 'vibe.']} from={3} /></span>
          </h1>
          <p className="hero__lead rise" style={{ '--i': 2 }}>
            Choose a city, set a budget, and VibeDate lines up cafés, restaurants, menus and gifts — then builds the
            itinerary, the outfit and the messages.
          </p>
          <div className="hero__cta rise" style={{ '--i': 3 }}>
            <a href="#cities" className="btn btn--primary">Pick your city <Icon name="chevronDown" size={16} /></a>
            <a href="#how" className="btn btn--ghost">How it works</a>
          </div>
          <ul className="hero__stats rise" style={{ '--i': 4 }}>
            <li><strong><AnimatedNumber value={cityVenues.length} format={whole} duration={700} /></strong> {cityInfo.name} venues</li>
            <li><strong>{CITIES.length}</strong> cities</li>
            <li><strong>{GIFTS.length}</strong> gift ideas</li>
          </ul>
        </div>

        <div className="hero__stage">
          <HeroScene />
        </div>
      </div>

      <div className="container">
        <div className="planbar glass rise" style={{ '--i': 5 }}>
          <div className="planbar__budget">
            <div className="planbar__top">
              <label htmlFor="budget" className="planbar__label">Total date budget (for two)</label>
              <span className="badge badge--lime">{budgetTier(budget)}</span>
            </div>
            <p className="planbar__value">
              <span aria-hidden="true"><AnimatedNumber value={budget} format={formatINR} duration={350} /></span>
              <span className="sr-only">{formatINR(budget)}</span>
            </p>
            <input
              id="budget"
              className="range"
              type="range"
              min={BUDGET.min}
              max={BUDGET.max}
              step={BUDGET.step}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              style={{ '--pct': `${pct}%` }}
              aria-valuetext={formatINR(budget)}
            />
            <div className="range-scale" aria-hidden="true">
              <span>{formatINR(BUDGET.min)}</span>
              <span>{formatINR(5000)}</span>
              <span>{formatINR(BUDGET.max)}</span>
            </div>
          </div>

          <div className="planbar__side">
            <label className="city-picker" htmlFor="city">
              <span className="budget-card__hint">City</span>
              <select
                id="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value)
                  const picked = CITIES.find((c) => c.id === e.target.value)
                  if (picked) toast(`Showing ${picked.name} venues`)
                }}
              >
                {CITY_GROUPS.map((g) => (
                  <optgroup key={g} label={g}>
                    {CITIES.filter((c) => c.group === g).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <div className="budget-card__vibes">
              <p className="budget-card__hint">Pick a vibe</p>
              <div className="chips" role="group" aria-label="Vibe">
                <button type="button" className={`chip chip--sm ${vibeFilter === 'All' ? 'is-active' : ''}`} aria-pressed={vibeFilter === 'All'} onClick={() => setVibeFilter('All')}>
                  Any
                </button>
                {VIBE_LIST.map((v) => (
                  <button key={v} type="button" className={`chip chip--sm ${vibeFilter === v ? 'is-active' : ''}`} aria-pressed={vibeFilter === v} onClick={() => setVibeFilter(v)}>
                    <span aria-hidden="true">{VIBES[v].emoji}</span> {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="planbar__foot">
            <p className="budget-card__fit">
              <Icon name="sparkles" size={16} />
              <span><strong>{fitCount}</strong> of {cityVenues.length} {cityInfo.name} venues fit</span>
            </p>
            <a href="#venues" className="btn btn--primary">Explore venues <Icon name="chevronRight" size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
