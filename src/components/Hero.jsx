import { useMemo } from 'react'
import { BUDGET, CITIES, VIBES, VIBE_LIST, budgetTier } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { formatINR } from '../utils/format'
import { minDateCost } from '../utils/plan'
import Icon from './Icon.jsx'
import AnimatedNumber from './AnimatedNumber.jsx'
import FloatingHearts from './FloatingHearts.jsx'

export default function Hero() {
  const { budget, setBudget, vibeFilter, setVibeFilter, city, setCity, cityInfo, cityVenues } = useDate()

  const pct = ((budget - BUDGET.min) / (BUDGET.max - BUDGET.min)) * 100
  const fitCount = useMemo(() => cityVenues.filter((v) => minDateCost(v) <= budget).length, [cityVenues, budget])

  return (
    <section className="hero" id="top">
      <FloatingHearts />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow rise" style={{ '--i': 0 }}>{cityInfo.name} date planner</p>
          <h1 className="hero__title rise" style={{ '--i': 1 }}>
            Plan the date.<br />
            <span className="hero__accent">Keep the vibe.</span>
          </h1>
          <p className="hero__lead rise" style={{ '--i': 2 }}>
            Pick your city, set a budget and VibeDate lines up the right venues, menus and gifts — plus an itinerary,
            outfit ideas, ready-to-send messages and an AI wingman.
          </p>
          <ul className="hero__stats rise" style={{ '--i': 3 }}>
            <li><strong>{cityVenues.length}</strong> {cityInfo.name} venues</li>
            <li><strong>4</strong> vibes</li>
            <li><strong>Live</strong> budget tracker</li>
          </ul>
        </div>

        <div className="glass budget-card rise" style={{ '--i': 2 }}>
          <div className="budget-card__top">
            <label htmlFor="budget" className="budget-card__label">Total date budget (for two)</label>
            <span className="badge badge--lime">{budgetTier(budget)}</span>
          </div>

          <p className="budget-card__value">
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

          <label className="city-picker" htmlFor="city">
            <span className="budget-card__hint">City</span>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </label>

          <div className="budget-card__vibes">
            <p className="budget-card__hint">Pick a vibe</p>
            <div className="chips" role="group" aria-label="Vibe">
              <button
                type="button"
                className={`chip ${vibeFilter === 'All' ? 'is-active' : ''}`}
                aria-pressed={vibeFilter === 'All'}
                onClick={() => setVibeFilter('All')}
              >
                Any
              </button>
              {VIBE_LIST.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`chip ${vibeFilter === v ? 'is-active' : ''}`}
                  aria-pressed={vibeFilter === v}
                  onClick={() => setVibeFilter(v)}
                >
                  <span aria-hidden="true">{VIBES[v].emoji}</span> {v}
                </button>
              ))}
            </div>
          </div>

          <div className="budget-card__foot">
            <p className="budget-card__fit">
              <Icon name="sparkles" size={16} />
              <span><strong>{fitCount}</strong> of {cityVenues.length} {cityInfo.name} venues fit this budget</span>
            </p>
            <a href="#venues" className="btn btn--primary">Explore venues <Icon name="chevronRight" size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
