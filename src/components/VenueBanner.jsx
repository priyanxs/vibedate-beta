import { useEffect, useState } from 'react'
import { CITY_BY_ID, VIBES } from '../data'
import { cityPhoto, venueCredit, venuePhoto } from '../utils/links'

// Venue photo when one exists (and loads); otherwise the city's landmark photo under the vibe colour
// (or just the vibe gradient with the venue emoji if there is no photo at all).
export default function VenueBanner({ venue, className = '', children }) {
  const [failed, setFailed] = useState(false)
  const photo = venuePhoto(venue)
  const cityPic = cityPhoto(venue.city)

  // A previous photo failing to load must not hide the next venue's photo.
  useEffect(() => setFailed(false), [photo])

  const showPhoto = Boolean(photo) && !failed
  const cityName = (CITY_BY_ID[venue.city] || {}).name

  return (
    <div className={`venue-banner ${className}`} style={{ background: VIBES[venue.vibe].gradient }}>
      {showPhoto ? (
        <>
          <img src={photo} alt={`${venue.name}`} loading="lazy" onError={() => setFailed(true)} />
          <span className="venue-banner__shade" aria-hidden="true" />
          <span className="venue-banner__flag">{(venueCredit(venue) || {}).real ? 'Photo of this place' : 'Illustrative photo'}</span>
        </>
      ) : (
        <>
          {cityPic && (
            <>
              <img className="venue-banner__city" src={cityPic} alt="" loading="lazy" aria-hidden="true" />
              <span className="venue-banner__tint" style={{ background: VIBES[venue.vibe].gradient }} aria-hidden="true" />
              {cityName && <span className="venue-banner__flag">📍 {cityName}</span>}
            </>
          )}
          <span className="venue-banner__emoji" aria-hidden="true">{venue.emoji}</span>
        </>
      )}
      {children}
    </div>
  )
}
