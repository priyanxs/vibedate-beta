import { useEffect, useState } from 'react'
import { VIBES } from '../data'
import { venuePhoto } from '../utils/links'

// Venue photo when one exists (and loads); otherwise the vibe-coloured gradient with the venue emoji.
export default function VenueBanner({ venue, className = '', children }) {
  const [failed, setFailed] = useState(false)
  const photo = venuePhoto(venue)

  // A previous photo failing to load must not hide the next venue's photo.
  useEffect(() => setFailed(false), [photo])

  const showPhoto = Boolean(photo) && !failed

  return (
    <div className={`venue-banner ${className}`} style={{ background: VIBES[venue.vibe].gradient }}>
      {showPhoto ? (
        <>
          <img src={photo} alt={`${venue.name}`} loading="lazy" onError={() => setFailed(true)} />
          <span className="venue-banner__shade" aria-hidden="true" />
          <span className="venue-banner__flag">Illustrative photo</span>
        </>
      ) : (
        <span className="venue-banner__emoji" aria-hidden="true">{venue.emoji}</span>
      )}
      {children}
    </div>
  )
}
