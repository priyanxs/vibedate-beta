import { GIFT_LINKS } from '../data'

/** Only http(s) URLs are ever used as links (blocks javascript: and other schemes). */
export const safeUrl = (value) => {
  try {
    const url = new URL(String(value))
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

const mapsQuery = (venue) => encodeURIComponent(venue.mapsQuery || `${venue.name}, Bhopal`)

export const mapsViewUrl = (venue) =>
  safeUrl(venue.mapsUrl) || `https://www.google.com/maps/search/?api=1&query=${mapsQuery(venue)}`

export const mapsDirectionsUrl = (venue) => `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery(venue)}`

/** Your own link from GIFT_LINKS, or a "find it online" search as the fallback. */
export const giftLink = (gift) => {
  const own = safeUrl(GIFT_LINKS[gift.id])
  if (own) return { url: own, label: 'Buy', custom: true }
  return {
    url: `https://www.google.com/search?q=${encodeURIComponent(`${gift.name} buy online India`)}`,
    label: 'Find online',
    custom: false,
  }
}

// Photos dropped into src/assets/venues/<venue-id>.(jpg|jpeg|png|webp) are picked up automatically.
const photoFiles = import.meta.glob('../assets/venues/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const venuePhoto = (venue) => {
  if (safeUrl(venue.photo)) return venue.photo
  const hit = Object.entries(photoFiles).find(([path]) => path.split('/').pop().replace(/\.[^.]+$/, '') === venue.id)
  return hit ? hit[1] : ''
}
