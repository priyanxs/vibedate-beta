export default function Section({ id, eyebrow, title, subtitle, children, action }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <header className="section__head">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="section__title">{title}</h2>
          {subtitle && <p className="section__sub">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
