import { useState } from 'react'
import { OUTFITS, VIBES } from '../data'
import { useDate } from '../context/DateContext.jsx'
import Section from './Section.jsx'

export default function OutfitCoordinator() {
  const { vibe, venue } = useDate()
  const [style, setStyle] = useState('him')
  const outfit = OUTFITS[vibe]

  return (
    <Section
      id="outfit"
      eyebrow="Step 5 · Look the part"
      title="Outfit coordinator"
      subtitle={`Colour stories and pieces for a ${vibe.toLowerCase()} evening${venue ? ` at ${venue.name}` : ''}.`}
    >
      <div className="glass outfit">
        <div className="outfit__top">
          <div>
            <p className="outfit__label">Dress code</p>
            <p className="outfit__code">
              <span aria-hidden="true">{VIBES[vibe].emoji}</span> {venue ? venue.dressCode : outfit.dressCode}
            </p>
          </div>
          <div className="segmented" role="group" aria-label="Outfit style">
            <button type="button" className={style === 'him' ? 'is-active' : ''} aria-pressed={style === 'him'} onClick={() => setStyle('him')}>
              Menswear
            </button>
            <button type="button" className={style === 'her' ? 'is-active' : ''} aria-pressed={style === 'her'} onClick={() => setStyle('her')}>
              Womenswear
            </button>
          </div>
        </div>

        <div className="palette-grid">
          {outfit.palettes.map((p) => (
            <div key={p.name} className="palette">
              <div className="palette__swatches">
                {p.colors.map((c) => (
                  <span key={c} className="swatch" style={{ background: c }} title={c} role="img" aria-label={`Colour ${c}`} />
                ))}
              </div>
              <h3 className="palette__name">{p.name}</h3>
              <p className="palette__note">{p.note}</p>
            </div>
          ))}
        </div>

        <div className="outfit__cols">
          <div>
            <h3 className="outfit__h">What to wear</h3>
            <ul className="bullets">
              {outfit.pieces[style].map((piece) => (
                <li key={piece}>{piece}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="outfit__h">Skip</h3>
            <ul className="bullets bullets--warn">
              {outfit.avoid.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <h3 className="outfit__h">Grooming</h3>
            <p className="outfit__groom">{outfit.grooming}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
