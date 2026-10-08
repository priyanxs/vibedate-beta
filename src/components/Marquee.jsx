import { VENUES, VIBE_LIST } from '../data'

const WORDS = [...VIBE_LIST, ...VENUES.map((v) => v.name)]

// Endless scrolling strip of vibes and venue names. Content is duplicated for a seamless loop.
export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group">
            {WORDS.map((w) => (
              <li key={`${copy}-${w}`}>
                <span className="marquee__dot" /> {w}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
