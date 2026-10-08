import Icon from './Icon.jsx'

// Fixed values (not random) so the layout is stable between renders.
const HEARTS = [
  { left: 6, size: 18, delay: 0, dur: 11 },
  { left: 16, size: 12, delay: 3, dur: 14 },
  { left: 28, size: 22, delay: 6, dur: 12 },
  { left: 41, size: 14, delay: 1.5, dur: 15 },
  { left: 55, size: 20, delay: 8, dur: 13 },
  { left: 66, size: 12, delay: 4, dur: 11 },
  { left: 78, size: 24, delay: 2, dur: 16 },
  { left: 90, size: 16, delay: 7, dur: 12 },
]

export default function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className={`floating-hearts__item ${i % 3 === 0 ? 'is-lime' : ''}`}
          style={{ left: `${h.left}%`, width: h.size, height: h.size, animationDelay: `${h.delay}s`, animationDuration: `${h.dur}s` }}
        >
          <Icon name="heart" size={h.size} strokeWidth={0} className="fill-heart" />
        </span>
      ))}
    </div>
  )
}
