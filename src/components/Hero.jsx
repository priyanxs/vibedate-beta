import { useMemo } from 'react'
import { BUDGET, VENUES, VIBES, VIBE_LIST, budgetTier } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { formatINR } from '../utils/format'
import { minDateCost } from '../utils/plan'
import Icon from './Icon.jsx'
import AnimatedNumber from './AnimatedNumber.jsx'
import FloatingHearts from './FloatingHearts.jsx'

export default function Hero() {
  const { budget, setBudget, vibeFilter, setVibeFilter } = useDate()

  const pct = ((budget - BUDGET.min) / (BUDGET.max - BUDGET.min)) * 100
  const fitCount = useMemo(() => VENUES.filter((v) => minDateCost(v) <= budget).length, [budget])

  return (
    <section className="hero" id="top">
      <FloatingHearts />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow rise" style={{ '--i': 0 }}>Bhopal date planner</p>
          <h1 className="hero__title rise" style={{ '--i': 1 }}>
            Plan the date.<br />
            <span className="hero__accent">Keep the vibe.</span>
          </h1>
          <p className="hero__lead rise" style={{ '--i': 2 }}>
            Set a budget and VibeDate lines up the right Bhopal venues, menus and gifts — plus an itinerary,
            outfit ideas, ready-to-send messages and an AI wingman.
          </p>
          <ul className="hero__stats rise" style={{ '--i': 3 }}>
            <li><strong>{VENUES.length}</strong> Bhopal venues</li>
            <li><strong>4</strong> vibes</li>
            <li><strong>Live</strong> budget tracker</li>
          </ul>
        </div>

        <div className="glass budget-card rise" style={{ '--i': 2 }}>
          <div className="budget-card__top">
            <label htmlFor="budget" className="budget-card__label">Total date budget (for two)</label>
            <span className="badge badge--lime">{budgetTier(budget)}</span>
          </div>

          <output className="budget-card__value" htmlFor="budget" aria-live="polite">
            <AnimatedNumber value={budget} format={formatINR} duration={350} />
          </output>

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
              <span><strong>{fitCount}</strong> of {VENUES.length} venues fit this budget</span>
            </p>
            <a href="#venues" className="btn btn--primary">Explore venues <Icon name="chevronRight" size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
