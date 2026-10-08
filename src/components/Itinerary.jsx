import { useMemo } from 'react'
import { START_TIMES } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { formatDay, minutesToLabel, useCopy } from '../utils/format'
import { buildItinerary } from '../utils/plan'
import Section from './Section.jsx'
import Icon from './Icon.jsx'

export default function Itinerary() {
  const { venue, cartLines, giftLines, startMin, setStartMin, dateISO, setDateISO, total } = useDate()
  const [copied, copy] = useCopy()

  const steps = useMemo(
    () => buildItinerary({ venue, cartLines, giftLines, startMin, total }),
    [venue, cartLines, giftLines, startMin, total],
  )

  const asText = () =>
    [`Date itinerary — ${formatDay(dateISO) || 'date TBD'}`, '', ...steps.map((s) => `${s.time} — ${s.title}: ${s.detail}`)].join('\n')

  return (
    <Section
      id="itinerary"
      eyebrow="Step 4 · The evening, mapped out"
      title="Itinerary builder"
      subtitle="A timeline built from your venue, dishes and gifts."
      action={
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => copy(asText())}>
          <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? 'Copied!' : 'Copy itinerary'}
        </button>
      }
    >
      <div className="glass planner">
        <div className="planner__fields">
          <label className="field">
            <span>Date</span>
            <input type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
          </label>
          <label className="field">
            <span>Start time</span>
            <select value={startMin} onChange={(e) => setStartMin(e.target.value)}>
              {START_TIMES.map((m) => (
                <option key={m} value={m}>{minutesToLabel(m)}</option>
              ))}
            </select>
          </label>
        </div>

        <ol className="timeline">
          {steps.map((s, i) => (
            <li key={`${s.title}-${i}`} className="timeline__item">
              <span className="timeline__dot"><Icon name={s.icon} size={16} /></span>
              <div className="timeline__card">
                <p className="timeline__time">{s.time}</p>
                <h3 className="timeline__title">{s.title}</h3>
                <p className="timeline__detail">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
