import { BUDGET, CITY_BY_ID, DEFAULT_CITY, GIFT_BY_ID, VENUE_BY_ID } from '../data.js'
import { MAX_QTY, MAX_SPLIT, TIP_OPTIONS, flattenMenu } from './plan.js'
import { parseISODate, todayISO, nextSaturdayISO } from './format.js'

export const SHARE_PREFIX = '#p='

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

/** Strips control characters, tags, and bounds length to keep text safe and clean. */
export const sanitizeName = (val, maxLen = 40) => {
  if (typeof val !== 'string') return ''
  return val
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // strip control chars
    .replace(/[<>]/g, '') // strip HTML brackets
    .trim()
    .slice(0, maxLen)
}

/** Encodes the plan into a compact, URL-safe base64 hash. */
export const encodeSharedPlan = (state) => {
  if (!state || typeof state !== 'object') return ''

  // Only include items that exist in the venue
  const cleanCart = {}
  if (state.venueId && state.cart && typeof state.cart === 'object' && !Array.isArray(state.cart)) {
    const venue = VENUE_BY_ID[state.venueId]
    if (venue) {
      flattenMenu(venue).forEach((item) => {
        const qty = Number(state.cart[item.id])
        if (Number.isInteger(qty) && qty > 0) {
          cleanCart[item.id] = Math.min(qty, MAX_QTY)
        }
      })
    }
  }

  // Deduplicate and filter gift IDs
  const cleanGifts = Array.isArray(state.giftIds)
    ? [...new Set(state.giftIds)].filter((id) => GIFT_BY_ID[id])
    : []

  const data = {
    b: Number.isFinite(state.budget) ? clamp(Math.round(state.budget / BUDGET.step) * BUDGET.step, BUDGET.min, BUDGET.max) : BUDGET.default,
    c: state.city && CITY_BY_ID[state.city] ? state.city : DEFAULT_CITY,
    v: state.venueId && VENUE_BY_ID[state.venueId] ? state.venueId : null,
    k: cleanCart,
    g: cleanGifts,
    d: typeof state.dateISO === 'string' ? state.dateISO : '',
    t: Number.isInteger(state.startMin) ? ((state.startMin % 1440) + 1440) % 1440 : 18 * 60,
    y: sanitizeName(state.yourName),
    n: sanitizeName(state.theirName),
    s: state.splitOn ? clamp(Math.round(Number(state.splitCount) || 2), 2, MAX_SPLIT) : 0,
    tp: TIP_OPTIONS.includes(Number(state.tipPct)) ? Number(state.tipPct) : 0,
  }

  try {
    const json = JSON.stringify(data)
    const bytes = new TextEncoder().encode(json)
    let bin = ''
    bytes.forEach((b) => {
      bin += String.fromCharCode(b)
    })
    const b64 = (typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64'))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.origin}${window.location.pathname}${SHARE_PREFIX}${b64}`
    }
    return `${SHARE_PREFIX}${b64}`
  } catch {
    return ''
  }
}

/**
 * Decodes and validates a shared plan from a URL hash string.
 * Returns a validated plan object, or null if the payload is missing/malformed.
 */
export const decodeSharedPlan = (rawHash) => {
  try {
    const hash = typeof rawHash === 'string' ? rawHash : (typeof window !== 'undefined' ? window.location?.hash || '' : '')
    if (!hash.startsWith(SHARE_PREFIX) || hash.length > 4000) return null

    const b64 = hash.slice(SHARE_PREFIX.length).replace(/-/g, '+').replace(/_/g, '/')
    const bin = (typeof atob === 'function' ? atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4)) : Buffer.from(b64, 'base64').toString('binary'))
    const jsonStr = new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)))
    const d = JSON.parse(jsonStr)

    // Protection against prototype pollution and non-objects
    if (!d || typeof d !== 'object' || Array.isArray(d)) return null

    const budget =
      typeof d.b === 'number' && Number.isFinite(d.b)
        ? clamp(Math.round(d.b / BUDGET.step) * BUDGET.step, BUDGET.min, BUDGET.max)
        : BUDGET.default

    const venueId = d.v && VENUE_BY_ID[d.v] ? d.v : null
    const city = venueId ? VENUE_BY_ID[venueId].city : d.c && CITY_BY_ID[d.c] ? d.c : DEFAULT_CITY

    const cart = {}
    if (venueId && d.k && typeof d.k === 'object' && !Array.isArray(d.k)) {
      flattenMenu(VENUE_BY_ID[venueId]).forEach((item) => {
        const qty = Number(d.k[item.id])
        if (Number.isInteger(qty) && qty > 0) cart[item.id] = Math.min(qty, MAX_QTY)
      })
    }

    const giftIds = Array.isArray(d.g) ? [...new Set(d.g)].filter((id) => GIFT_BY_ID[id]) : []

    const dateParsed = typeof d.d === 'string' && parseISODate(d.d)
    const dateOk = dateParsed && d.d >= todayISO()
    const dateISO = dateOk ? d.d : nextSaturdayISO()

    const startMin = Number.isInteger(d.t) && d.t >= 0 && d.t < 1440 ? d.t : 18 * 60
    const splitOn = Number(d.s) >= 2
    const splitCount = splitOn ? clamp(Math.round(Number(d.s)), 2, MAX_SPLIT) : 2
    const tipPct = TIP_OPTIONS.includes(Number(d.tp)) ? Number(d.tp) : 0

    return {
      budget,
      city,
      venueId,
      cart,
      giftIds,
      yourName: sanitizeName(d.y),
      theirName: sanitizeName(d.n),
      dateISO,
      startMin,
      splitOn,
      splitCount,
      tipPct,
    }
  } catch {
    return null
  }
}
