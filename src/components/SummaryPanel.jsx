import { useDate } from '../context/DateContext.jsx'
import { formatINR, useCopy } from '../utils/format'
import { MAX_QTY, buildPlanText } from '../utils/plan'
import Icon from './Icon.jsx'

export default function SummaryPanel() {
  const d = useDate()
  const { budget, venue, cartLines, giftLines, foodTotal, giftTotal, total, remaining, usedPct, overBudget } = d
  const [copied, copy] = useCopy()

  const empty = cartLines.length === 0 && giftLines.length === 0
  const status = overBudget ? 'over' : 'ok'

  const onCopy = () =>
    copy(buildPlanText({ venue, cartLines, giftLines, budget, foodTotal, giftTotal, total, dateISO: d.dateISO, startMin: d.startMin }))

  return (
    <div className="glass summary" data-status={status}>
      <div className="summary__head">
        <h3 className="summary__title"><Icon name="wallet" size={18} /> Your date plan</h3>
        {venue ? <span className="badge badge--glass">{venue.vibe}</span> : null}
      </div>

      <div className="meter">
        <div className="meter__row">
          <span className="meter__label">{overBudget ? 'Over budget by' : 'Budget remaining'}</span>
          <span className={`meter__value ${overBudget ? 'is-over' : 'is-ok'}`}>{formatINR(Math.abs(remaining))}</span>
        </div>
        <div
          className="meter__track"
          role="progressbar"
          aria-label="Budget used"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(usedPct)}
        >
          <div className={`meter__fill ${overBudget ? 'is-over' : ''}`} style={{ width: `${usedPct}%` }} />
        </div>
        <p className="meter__caption">
          {formatINR(total)} planned of {formatINR(budget)} ({Math.round(usedPct)}%)
        </p>
      </div>

      {overBudget ? (
        <div className="notice notice--warn" role="alert">
          <Icon name="alert" size={18} />
          <p>You're {formatINR(-remaining)} over budget. Swap a dish, share a dessert, or pick a lighter gift — or raise your budget.</p>
        </div>
      ) : (
        <div className="notice notice--ok">
          <Icon name="check" size={18} />
          <p>{total === 0 ? 'Add a venue, dishes or a gift to start.' : `On track — ${formatINR(remaining)} still free for a gift or an extra treat.`}</p>
        </div>
      )}

      <div className="summary__venue">
        <Icon name="pin" size={16} />
        <span>{venue ? venue.name : 'No venue chosen yet'}</span>
      </div>

      {empty ? (
        <p className="empty-note">Nothing added yet. Choose a venue and dishes, then a gift.</p>
      ) : (
        <div className="summary__lines">
          {cartLines.length > 0 && (
            <>
              <p className="summary__group">Menu</p>
              <ul>
                {cartLines.map(({ item, qty }) => (
                  <li key={item.id} className="line">
                    <span className="line__name">{item.name}</span>
                    <span className="mini-stepper">
                      <button type="button" onClick={() => d.changeQty(item.id, -1)} aria-label={`Remove one ${item.name}`}>
                        <Icon name="minus" size={12} />
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() => d.changeQty(item.id, 1)}
                        disabled={qty >= MAX_QTY}
                        aria-label={`Add one more ${item.name}`}
                      >
                        <Icon name="plus" size={12} />
                      </button>
                    </span>
                    <span className="line__price">{formatINR(item.price * qty)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {giftLines.length > 0 && (
            <>
              <p className="summary__group">Gifts</p>
              <ul>
                {giftLines.map((g) => (
                  <li key={g.id} className="line">
                    <span className="line__name">{g.name}</span>
                    <button type="button" className="icon-btn" onClick={() => d.toggleGift(g.id)} aria-label={`Remove ${g.name}`}>
                      <Icon name="x" size={14} />
                    </button>
                    <span className="line__price">{formatINR(g.price)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <dl className="totals">
        <div><dt>Menu</dt><dd>{formatINR(foodTotal)}</dd></div>
        <div><dt>Gifts</dt><dd>{formatINR(giftTotal)}</dd></div>
        <div className="totals__grand"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
      </dl>

      <div className="summary__actions">
        <button type="button" className="btn btn--primary btn--block" onClick={onCopy}>
          <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? 'Copied!' : 'Copy plan'}
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={d.resetPlan} disabled={!venue && empty}>
          <Icon name="refresh" size={16} /> Reset plan
        </button>
      </div>
    </div>
  )
}
