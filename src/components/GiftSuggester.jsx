import { useMemo, useState } from 'react'
import { GIFTS, GIFT_CATEGORIES, VIBES } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { formatINR } from '../utils/format'
import { pickTopGift } from '../utils/plan'
import { giftLink } from '../utils/links'
import Section from './Section.jsx'
import Icon from './Icon.jsx'

export default function GiftSuggester() {
  const { vibe, venue, budget, remaining, giftIds, toggleGift } = useDate()
  const [category, setCategory] = useState('all')
  const [showStretch, setShowStretch] = useState(false)

  const top = useMemo(() => pickTopGift(GIFTS, vibe, remaining), [vibe, remaining])

  const { shown, hiddenCount } = useMemo(() => {
    const inCategory = GIFTS.filter((g) => category === 'all' || g.category === category)
    const visible = inCategory.filter((g) => giftIds.includes(g.id) || g.price <= remaining || showStretch)
    const rank = (g) => (top && g.id === top.id ? 0 : g.vibes.includes(vibe) ? 1 : 2)
    visible.sort((a, b) => rank(a) - rank(b) || a.price - b.price)
    return { shown: visible, hiddenCount: inCategory.length - visible.length }
  }, [category, giftIds, remaining, showStretch, top, vibe])

  const lo = Math.round((budget * 0.1) / 10) * 10
  const hi = Math.round((budget * 0.2) / 10) * 10

  return (
    <Section
      id="gifts"
      eyebrow="Step 3 · A thoughtful touch"
      title="Gift suggester"
      subtitle="Ideas matched to your vibe and what is left in your budget."
    >
      <div className="glass gift-banner">
        <span className="gift-banner__vibe" aria-hidden="true">{VIBES[vibe].emoji}</span>
        <div>
          <p className="gift-banner__title">
            <span className="badge badge--lime"><Icon name="sparkles" size={12} /> AI picks</span>
            &nbsp;{vibe} vibe{venue ? ` · ${venue.name}` : ''}
          </p>
          <p className="gift-banner__text">
            {remaining > 0 ? (
              <>Showing gifts up to <strong>{formatINR(remaining)}</strong> (your remaining budget). A typical gift spend is {formatINR(lo)}–{formatINR(hi)}.</>
            ) : (
              <>You have no budget left. Trim your menu or raise your budget to unlock gifts.</>
            )}
          </p>
        </div>
      </div>

      <div className="chips" role="group" aria-label="Gift category">
        <button
          type="button"
          className={`chip ${category === 'all' ? 'is-active' : ''}`}
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        {GIFT_CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`chip ${category === c.key ? 'is-active' : ''}`}
            aria-pressed={category === c.key}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty glass">
          <p><strong>No gifts fit your remaining budget in this category.</strong></p>
          <p>Try another category, adjust the menu, or show gifts above budget.</p>
        </div>
      ) : (
        <div className="gift-grid">
          {shown.map((g) => {
            const added = giftIds.includes(g.id)
            const isTop = top && top.id === g.id
            const link = giftLink(g)
            return (
              <article key={g.id} className={`gift-card glass ${added ? 'is-selected' : ''}`}>
                {isTop && <span className="badge badge--lime gift-card__flag"><Icon name="sparkles" size={12} /> Top pick</span>}
                <span className="gift-card__emoji" aria-hidden="true">{g.emoji}</span>
                <h3 className="gift-card__name">{g.name}</h3>
                <p className="gift-card__note">{g.note}</p>
                <a
                  className={`gift-card__link ${link.custom ? 'is-custom' : ''}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  aria-label={`${link.label}: ${g.name} (opens in a new tab)`}
                >
                  <Icon name="external" size={13} /> {link.label}
                </a>
                <div className="gift-card__foot">
                  <span className="gift-card__price">{formatINR(g.price)}</span>
                  <button
                    type="button"
                    className={`btn btn--sm ${added ? 'btn--success' : 'btn--soft'}`}
                    onClick={() => toggleGift(g.id)}
                    aria-pressed={added}
                  >
                    {added ? (<><Icon name="check" size={14} /> Added</>) : (<><Icon name="plus" size={14} /> Add</>)}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {(hiddenCount > 0 || showStretch) && (
        <button type="button" className="link-btn" onClick={() => setShowStretch((s) => !s)}>
          {showStretch ? 'Hide gifts above remaining budget' : `Show ${hiddenCount} more gift${hiddenCount === 1 ? '' : 's'} above remaining budget`}
        </button>
      )}
    </Section>
  )
}
