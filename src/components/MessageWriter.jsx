import { useMemo, useState } from 'react'
import { useDate } from '../context/DateContext.jsx'
import { useCopy } from '../utils/format'
import { MESSAGE_PURPOSES, MESSAGE_TONES, generateMessage } from '../utils/messages'
import Section from './Section.jsx'
import Icon from './Icon.jsx'

export default function MessageWriter() {
  const { yourName, setYourName, theirName, setTheirName, venue, dateISO, startMin } = useDate()
  const [purpose, setPurpose] = useState('ask')
  const [tone, setTone] = useState('Flirty')
  const [variant, setVariant] = useState(0)
  const [edited, setEdited] = useState(null) // null = show the generated text
  const [copied, copy] = useCopy()

  const generated = useMemo(
    () => generateMessage({ purpose, tone, variant, them: theirName.trim(), me: yourName.trim(), venue, dateISO, startMin }),
    [purpose, tone, variant, theirName, yourName, venue, dateISO, startMin],
  )
  const text = edited === null ? generated : edited

  const pick = (setter) => (value) => {
    setter(value)
    setEdited(null)
  }

  return (
    <Section
      id="messages"
      eyebrow="Step 6 · Say the right thing"
      title="Message writer"
      subtitle="Pick the moment and the tone, tweak it, then send."
    >
      <div className="glass writer">
        <div className="writer__fields">
          <label className="field">
            <span>Their name</span>
            <input type="text" value={theirName} onChange={(e) => setTheirName(e.target.value)} placeholder="e.g. Riya" maxLength={40} />
          </label>
          <label className="field">
            <span>Your name (sign-off)</span>
            <input type="text" value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="optional" maxLength={40} />
          </label>
        </div>

        <p className="writer__label">When</p>
        <div className="chips" role="group" aria-label="Message type">
          {MESSAGE_PURPOSES.map((p) => (
            <button
              key={p.key}
              type="button"
              className={`chip ${purpose === p.key ? 'is-active' : ''}`}
              aria-pressed={purpose === p.key}
              onClick={() => pick(setPurpose)(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="writer__label">Tone</p>
        <div className="chips" role="group" aria-label="Tone">
          {MESSAGE_TONES.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${tone === t ? 'is-active' : ''}`}
              aria-pressed={tone === t}
              onClick={() => pick(setTone)(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="writer__label" htmlFor="message-text">Your message (editable)</label>
        <textarea
          id="message-text"
          className="writer__text"
          rows={5}
          value={text}
          onChange={(e) => setEdited(e.target.value)}
        />

        <div className="writer__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setVariant((v) => v + 1); setEdited(null) }}>
            <Icon name="refresh" size={16} /> Regenerate
          </button>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => copy(text)}>
            <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? 'Copied!' : 'Copy'}
          </button>
          <a
            className="btn btn--lime btn--sm"
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="send" size={16} /> WhatsApp
          </a>
        </div>
      </div>
    </Section>
  )
}
