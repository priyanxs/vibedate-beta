import { VIBE_LIST } from '../data'
import { useDate } from '../context/DateContext.jsx'

// Endless scrolling strip of vibes and the current city's venues. Content is repeated so the loop never shows a gap.
export default function Marquee() {
  const { cityVenues } = useDate()
  const base = [...VIBE_LIST, ...cityVenues.map((v) => v.name)]
  const words = []
  while (words.length < 16) words.push(...base)

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group">
            {words.map((w, i) => (
              <li key={`${copy}-${i}`}>
                <span className="marquee__dot" /> {w}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
