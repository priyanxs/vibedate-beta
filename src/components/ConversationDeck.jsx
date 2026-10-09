import { useMemo, useState } from 'react'
import { CARD_CATEGORIES, CONVERSATION_CARDS } from '../data'
import Section from './Section.jsx'
import Icon from './Icon.jsx'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ConversationDeck() {
  const [category, setCategory] = useState('All')
  const [order, setOrder] = useState(() => shuffle(CONVERSATION_CARDS.map((c) => c.id)))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const deck = useMemo(() => {
    const byId = Object.fromEntries(CONVERSATION_CARDS.map((c) => [c.id, c]))
    return order.map((id) => byId[id]).filter((c) => category === 'All' || c.category === category)
  }, [order, category])

  const card = deck[index] || deck[0] || { category: 'Fun', q: 'What is your idea of a perfect date?' }

  const go = (delta) => {
    if (deck.length <= 1) return
    setFlipped(false)
    setIndex((i) => (i + delta + deck.length) % deck.length)
  }
  const reshuffle = () => {
    setOrder(shuffle(CONVERSATION_CARDS.map((c) => c.id)))
    setIndex(0)
    setFlipped(false)
  }
  const pickCategory = (c) => {
    setCategory(c)
    setIndex(0)
    setFlipped(false)
  }

  return (
    <Section
      id="icebreakers"
      eyebrow="Step 7 · Never run out of things to say"
      title="Conversation deck"
      subtitle="Tap a card to flip it and reveal a question."
    >
      <div className="chips" role="group" aria-label="Card category">
        {['All', ...CARD_CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            className={`chip ${category === c ? 'is-active' : ''}`}
            aria-pressed={category === c}
            onClick={() => pickCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="deck">
        <button
          type="button"
          className={`flip ${flipped ? 'is-flipped' : ''}`}
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? 'Flip card back' : 'Flip card to reveal the question'}
        >
          <span className="flip__inner">
            <span className="flip__face flip__front">
              <Icon name="heart" size={34} strokeWidth={1.6} />
              <span className="flip__brand">VibeDate</span>
              <span className="flip__hint">Tap to reveal</span>
            </span>
            <span className="flip__face flip__back">
              <span className="flip__cat">{card.category}</span>
              <span className="flip__q">{card.q}</span>
            </span>
          </span>
        </button>

        <div className="deck__controls">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(-1)} aria-label="Previous card">
            <Icon name="chevronLeft" size={16} />
          </button>
          <span className="deck__count" aria-live="polite">{index + 1} / {deck.length}</span>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(1)} aria-label="Next card">
            <Icon name="chevronRight" size={16} />
          </button>
          <button type="button" className="btn btn--soft btn--sm" onClick={reshuffle}>
            <Icon name="shuffle" size={16} /> Shuffle
          </button>
        </div>
      </div>
    </Section>
  )
}
