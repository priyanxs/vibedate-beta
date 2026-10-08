import { CITY_BY_ID } from '../data'
import { GIFT_LINKS } from '../giftLinks'
import { PHOTO_CREDITS } from '../photoCredits'
import { CITY_PHOTO_CREDITS } from '../cityPhotos'

/** Only http(s) URLs are ever used as links (blocks javascript: and other schemes). */
export const safeUrl = (value) => {
  try {
    const url = new URL(String(value))
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

const mapsQuery = (venue) => {
  const city = CITY_BY_ID[venue.city]
  return encodeURIComponent(venue.mapsQuery || `${venue.name}${city ? `, ${city.name}` : ''}`)
}

const placeText = (venue) => decodeURIComponent(mapsQuery(venue))

/** Google Maps embed (no API key needed) — shows the place, its photos and reviews in a frame. */
export const mapsEmbedUrl = (venue) => `https://www.google.com/maps?q=${mapsQuery(venue)}&output=embed`

/** Opens Google's photo results for the place — real, current photos from the web. */
export const googlePhotosUrl = (venue) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(placeText(venue))}`

/** Opens a search for the venue's current menu (menus and prices change, so we link out instead of copying). */
export const realMenuUrl = (venue) => `https://www.google.com/search?q=${encodeURIComponent(`${placeText(venue)} menu`)}`

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

const cityFiles = import.meta.glob('../assets/cities/*.jpg', { eager: true, query: '?url', import: 'default' })

export const cityPhoto = (cityId) => {
  const hit = Object.entries(cityFiles).find(([path]) => path.split('/').pop().replace(/\.[^.]+$/, '') === cityId)
  return hit ? hit[1] : ''
}

export const cityCredit = (cityId) => CITY_PHOTO_CREDITS[cityId] || null

const giftFiles = import.meta.glob('../assets/gifts/*.jpg', { eager: true, query: '?url', import: 'default' })

export const giftPhoto = (gift) => {
  const hit = Object.entries(giftFiles).find(([path]) => path.split('/').pop().replace(/\.[^.]+$/, '') === gift.id)
  return hit ? hit[1] : ''
}

export const venueCredit = (venue) => PHOTO_CREDITS[venue.id] || null

export const venuePhoto = (venue) => {
  if (safeUrl(venue.photo)) return venue.photo
  const hit = Object.entries(photoFiles).find(([path]) => path.split('/').pop().replace(/\.[^.]+$/, '') === venue.id)
  return hit ? hit[1] : ''
}
