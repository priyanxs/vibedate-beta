import { useEffect, useRef } from 'react'
import { formatINR } from '../utils/format'
import { MAX_QTY } from '../utils/plan'
import { DISH_PHOTO_CREDITS } from '../dishPhotos'
import Icon from './Icon.jsx'

// Full-size dish photo with its name, price and an Add button. Closes with Esc, the backdrop or the X.
export default function DishViewer({ item, photo, qty, onAdd, onClose }) {
  const closeRef = useRef(null)
  const credit = DISH_PHOTO_CREDITS[photo.key]

  useEffect(() => {
    const previous = document.activeElement
    if (closeRef.current) closeRef.current.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (previous && previous.focus) previous.focus()
    }
  }, [onClose])

  return (
    <div className="dish-viewer" role="dialog" aria-modal="true" aria-label={item.name}>
      <button type="button" className="dish-viewer__backdrop" aria-label="Close photo" onClick={onClose} tabIndex={-1} />
      <figure className="dish-viewer__card">
        <button ref={closeRef} type="button" className="dish-viewer__close icon-btn" aria-label="Close" onClick={onClose}>
          <Icon name="x" />
        </button>
        <img src={photo.url} alt={item.name} />
        <figcaption>
          <div className="dish-viewer__title">
            <span className={`diet ${item.veg ? 'diet--veg' : 'diet--nonveg'}`} role="img" aria-label={item.veg ? 'Vegetarian' : 'Non-vegetarian'} />
            <strong>{item.name}</strong>
            <span className="dish-viewer__price">{formatINR(item.price)}</span>
          </div>
          {item.desc && <p>{item.desc}</p>}
          <p className="dish-viewer__note">
            Photo shows the kind of dish; the plate at the venue may look different.
            {credit && (
              <>
                {' '}Photo by {credit.author} ·{' '}
                <a href={credit.source} target="_blank" rel="noopener noreferrer">{credit.license}</a>
              </>
            )}
          </p>
          <button type="button" className="btn btn--primary btn--sm" onClick={onAdd} disabled={qty >= MAX_QTY}>
            <Icon name="plus" size={14} /> {qty >= MAX_QTY ? `Max reached (${MAX_QTY})` : qty > 0 ? `Add another (${qty} in plan)` : 'Add to plan'}
          </button>
        </figcaption>
      </figure>
    </div>
  )
}
