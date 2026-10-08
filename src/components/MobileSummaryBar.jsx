import { useEffect, useState } from 'react'
import { useDate } from '../context/DateContext.jsx'
import { formatINR } from '../utils/format'
import SummaryPanel from './SummaryPanel.jsx'
import Icon from './Icon.jsx'

// Shown only on small screens (see CSS): a compact calculator bar that opens the full plan as a sheet.
export default function MobileSummaryBar() {
  const { remaining, total, usedPct, overBudget } = useDate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="mobile-summary">
      <div className="mobile-summary__bar glass">
        <div className="mobile-summary__info">
          <span className="mobile-summary__label">{overBudget ? 'Over budget' : 'Remaining'}</span>
          <strong className={overBudget ? 'is-over' : 'is-ok'}>{formatINR(Math.abs(remaining))}</strong>
          <div className="meter__track meter__track--thin" aria-hidden="true">
            <div className={`meter__fill ${overBudget ? 'is-over' : ''}`} style={{ width: `${usedPct}%` }} />
          </div>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => setOpen(true)}>
          Plan · {formatINR(total)}
        </button>
      </div>

      {open && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Your date plan">
          <button type="button" className="sheet__backdrop" aria-label="Close plan" onClick={() => setOpen(false)} />
          <div className="sheet__panel">
            <button type="button" className="sheet__close icon-btn" aria-label="Close" onClick={() => setOpen(false)}>
              <Icon name="x" />
            </button>
            <SummaryPanel />
          </div>
        </div>
      )}
    </div>
  )
}
