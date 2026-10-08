import { CITIES } from '../data'
import Section from './Section.jsx'
import Icon from './Icon.jsx'

const STEPS = [
  { icon: 'wallet', title: 'Set your city & budget', text: `Pick one of ${CITIES.length} cities and slide your budget. Everything below adapts to it.` },
  { icon: 'utensils', title: 'Choose the venue & menu', text: 'Browse by vibe, build a menu for two and watch the cost update live.' },
  { icon: 'gift', title: 'Add a gift, plan the night', text: 'Get gift ideas that fit what is left, a timeline, an outfit and the right words to send.' },
]

export default function HowItWorks() {
  return (
    <Section id="how" eyebrow="How it works" title="Plan a date in three steps" subtitle="No sign-up, no fuss — your plan is saved on this device.">
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className="step glass tilt rise" style={{ '--i': i }}>
            <span className="step__num">{i + 1}</span>
            <span className="step__icon"><Icon name={s.icon} size={22} /></span>
            <h3 className="step__title">{s.title}</h3>
            <p className="step__text">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
