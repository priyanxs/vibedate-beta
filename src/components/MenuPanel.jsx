import { useState } from 'react'
import { MENU_CATEGORIES } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { formatINR } from '../utils/format'
import { MAX_QTY } from '../utils/plan'
import { mapsDirectionsUrl, mapsViewUrl } from '../utils/links'
import Section from './Section.jsx'
import Icon from './Icon.jsx'
import VenueBanner from './VenueBanner.jsx'

export default function MenuPanel({ venue }) {
  const { cart, changeQty, remaining, autoPlanMenu, clearCart, cartLines } = useDate()
  const [tab, setTab] = useState('appetizers')
  const [onlyVeg, setOnlyVeg] = useState(false)
  const [fitsOnly, setFitsOnly] = useState(false)

  const countIn = (cat) => cartLines.filter((l) => l.category === cat).reduce((acc, l) => acc + l.qty, 0)

  const list = (venue.menu[tab] || []).filter(
    (i) => (!onlyVeg || i.veg) && (!fitsOnly || i.price <= remaining || cart[i.id] > 0),
  )
  const hasAlcohol = MENU_CATEGORIES.some(({ key }) => (venue.menu[key] || []).some((i) => i.alc))

  return (
    <Section
      id="menu"
      eyebrow={`Step 2 · ${venue.name}`}
      title="Build your menu"
      subtitle={`${venue.cuisine} · Add dishes for the two of you — your total updates instantly.`}
      action={
        <div className="menu-actions">
          <button type="button" className="btn btn--lime btn--sm" onClick={autoPlanMenu}>
            <Icon name="sparkles" size={16} /> AI: suggest a menu
          </button>
          {cartLines.length > 0 && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearCart}>
              <Icon name="trash" size={16} /> Clear
            </button>
          )}
        </div>
      }
    >
      <div className="glass venue-head">
        <VenueBanner venue={venue} className="venue-head__banner" />
        <div className="venue-head__body">
          <div>
            <h3 className="venue-head__name">{venue.name}</h3>
            <p className="venue-head__meta">{venue.vibe} · {venue.cuisine}</p>
            <p className="venue-head__meta">Dress code: {venue.dressCode}</p>
          </div>
          <div className="venue-head__actions">
            <a className="btn btn--primary btn--sm" href={mapsViewUrl(venue)} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={16} /> Open in Google Maps
            </a>
            <a className="btn btn--ghost btn--sm" href={mapsDirectionsUrl(venue)} target="_blank" rel="noopener noreferrer">
              <Icon name="navigation" size={16} /> Directions
            </a>
          </div>
        </div>
      </div>

      <div className="glass menu-panel">
        <div className="tabs" role="tablist" aria-label="Menu categories">
          {MENU_CATEGORIES.map(({ key, label }) => {
            const n = countIn(key)
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={`tab ${tab === key ? 'is-active' : ''}`}
                onClick={() => setTab(key)}
              >
                {label}
                {n > 0 && <span className="tab__count">{n}</span>}
              </button>
            )
          })}
        </div>

        <div className="toggles">
          <label className="check">
            <input type="checkbox" checked={onlyVeg} onChange={(e) => setOnlyVeg(e.target.checked)} />
            <span>Veg only</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={fitsOnly} onChange={(e) => setFitsOnly(e.target.checked)} />
            <span>Only dishes that fit remaining budget</span>
          </label>
        </div>

        {list.length === 0 ? (
          <p className="empty-note">No dishes match these filters.</p>
        ) : (
          <ul className="menu-list">
            {list.map((item) => {
              const qty = cart[item.id] || 0
              const tooPricey = qty === 0 && item.price > remaining
              return (
                <li key={item.id} className={`menu-item ${qty > 0 ? 'is-selected' : ''}`}>
                  <span
                    className={`diet ${item.veg ? 'diet--veg' : 'diet--nonveg'}`}
                    role="img"
                    aria-label={item.veg ? 'Vegetarian' : 'Non-vegetarian'}
                  />
                  <div className="menu-item__body">
                    <p className="menu-item__name">
                      {item.name}
                      {item.alc && <span className="tag tag--muted">21+</span>}
                    </p>
                    {item.desc && <p className="menu-item__desc">{item.desc}</p>}
                  </div>
                  <div className="menu-item__side">
                    <span className="menu-item__price">{formatINR(item.price)}</span>
                    {tooPricey && <span className="tag tag--warn">Over budget</span>}
                  </div>
                  {qty > 0 ? (
                    <div className="stepper" role="group" aria-label={`Quantity of ${item.name}`}>
                      <button type="button" onClick={() => changeQty(item.id, -1)} aria-label={`Remove one ${item.name}`}>
                        <Icon name="minus" size={14} />
                      </button>
                      <span aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, 1)}
                        disabled={qty >= MAX_QTY}
                        aria-label={`Add one more ${item.name}`}
                      >
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="btn btn--soft btn--sm" onClick={() => changeQty(item.id, 1)}>
                      <Icon name="plus" size={14} /> Add
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <p className="fine-print">
          Prices are illustrative and assumed to include taxes. Please confirm with the venue.
          {hasAlcohol && ' Items marked 21+ are for adults only — please drink responsibly.'}
        </p>
      </div>
    </Section>
  )
}
