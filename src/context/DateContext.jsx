import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BUDGET, CITY_BY_ID, DEFAULT_CITY, GIFT_BY_ID, VENUES, VENUE_BY_ID, VIBE_LIST } from '../data'
import { nextSaturdayISO, parseISODate, todayISO } from '../utils/format'
import { MAX_QTY, MAX_SPLIT, TIP_OPTIONS, buildCartLines, flattenMenu, splitBill, suggestMenu } from '../utils/plan'
import { encodeSharedPlan, decodeSharedPlan, sanitizeName } from '../utils/share'

const STORAGE_KEY = 'vibedate:plan:v1'

const DateContext = createContext(null)

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

export { encodeSharedPlan }

/** Reads the shared link or the saved plan and validates every field, so bad/old data can never crash the app. */
const loadInitialState = () => {
  let saved = {}
  try {
    saved = decodeSharedPlan() || JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    saved = {}
  }
  if (typeof saved !== 'object' || Array.isArray(saved) || saved === null) saved = {}

  const budget =
    typeof saved.budget === 'number' && Number.isFinite(saved.budget)
      ? clamp(Math.round(saved.budget / BUDGET.step) * BUDGET.step, BUDGET.min, BUDGET.max)
      : BUDGET.default

  const venueId = saved.venueId && VENUE_BY_ID[saved.venueId] ? saved.venueId : null
  // A saved venue decides the city; otherwise use the saved city (or the default).
  const city = venueId ? VENUE_BY_ID[venueId].city : saved.city && CITY_BY_ID[saved.city] ? saved.city : DEFAULT_CITY

  const cart = {}
  if (venueId && saved.cart && typeof saved.cart === 'object' && !Array.isArray(saved.cart)) {
    flattenMenu(VENUE_BY_ID[venueId]).forEach((item) => {
      const qty = Number(saved.cart[item.id])
      if (Number.isInteger(qty) && qty > 0) cart[item.id] = Math.min(qty, MAX_QTY)
    })
  }

  const giftIds = Array.isArray(saved.giftIds) ? [...new Set(saved.giftIds)].filter((id) => GIFT_BY_ID[id]) : []

  // A saved date in the past is replaced with the next Saturday.
  const dateOk = parseISODate(saved.dateISO) && saved.dateISO >= todayISO()

  return {
    budget,
    city,
    vibeFilter: saved.vibeFilter === 'All' || VIBE_LIST.includes(saved.vibeFilter) ? saved.vibeFilter : 'All',
    venueId,
    cart,
    giftIds,
    yourName: sanitizeName(saved.yourName),
    theirName: sanitizeName(saved.theirName),
    dateISO: dateOk ? saved.dateISO : nextSaturdayISO(),
    startMin: Number.isInteger(saved.startMin) && saved.startMin >= 0 && saved.startMin < 1440 ? saved.startMin : 18 * 60,
    splitOn: saved.splitOn === true,
    splitCount: Number.isInteger(saved.splitCount) && saved.splitCount >= 2 && saved.splitCount <= MAX_SPLIT ? saved.splitCount : 2,
    tipPct: TIP_OPTIONS.includes(saved.tipPct) ? saved.tipPct : 0,
  }
}

export function DateProvider({ children }) {
  const [state, setState] = useState(loadInitialState)
  const { budget, city, vibeFilter, venueId, cart, giftIds, yourName, theirName, dateISO, startMin, splitOn, splitCount, tipPct } = state

  // Persist the plan on this device only.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable (private mode) — the app still works */
    }
  }, [state])

  // Dynamically load shared plans if the URL hash changes
  useEffect(() => {
    const onHash = () => {
      const shared = decodeSharedPlan()
      if (shared) setState((prev) => ({ ...prev, ...shared }))
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const patch = useCallback((changes) => setState((prev) => ({ ...prev, ...changes })), [])

  /* ---- derived values ---- */
  const venue = venueId ? VENUE_BY_ID[venueId] : null
  const cityInfo = CITY_BY_ID[city] || CITY_BY_ID[DEFAULT_CITY]
  const cityVenues = useMemo(() => VENUES.filter((v) => v.city === cityInfo.id), [cityInfo.id])
  const vibe = venue ? venue.vibe : vibeFilter !== 'All' ? vibeFilter : 'Romantic'

  const cartLines = useMemo(() => buildCartLines(venue, cart), [venue, cart])
  const giftLines = useMemo(() => giftIds.map((id) => GIFT_BY_ID[id]).filter(Boolean), [giftIds])

  const foodTotal = cartLines.reduce((acc, l) => acc + l.item.price * l.qty, 0)
  const giftTotal = giftLines.reduce((acc, g) => acc + g.price, 0)
  const total = foodTotal + giftTotal
  const remaining = budget - total
  const usedPct = budget > 0 ? Math.min(100, (total / budget) * 100) : 0
  const overBudget = total > budget
  const split = useMemo(() => splitBill({ total, people: splitOn ? splitCount : 1, tipPct: splitOn ? tipPct : 0 }), [total, splitOn, splitCount, tipPct])

  /* ---- actions ---- */
  const setBudget = useCallback((value) => {
    const n = Number(value)
    if (Number.isFinite(n)) patch({ budget: clamp(n, BUDGET.min, BUDGET.max) })
  }, [patch])

  const setVibeFilter = useCallback((value) => patch({ vibeFilter: value }), [patch])

  // Switching city clears the venue and menu (they belong to the old city).
  const setCity = useCallback((id) => {
    if (!CITY_BY_ID[id]) return
    setState((prev) => (prev.city === id ? prev : { ...prev, city: id, venueId: null, cart: {} }))
  }, [])

  const selectVenue = useCallback((id) => {
    setState((prev) => (prev.venueId === id ? prev : { ...prev, venueId: id, cart: {} }))
  }, [])

  // "Surprise me": pick a venue and fill in a sensible menu that fits the budget (after gifts) in one step.
  const planVenue = useCallback((id) => {
    const v = VENUE_BY_ID[id]
    if (!v) return
    setState((prev) => {
      const gifts = prev.giftIds.map((g) => GIFT_BY_ID[g]).filter(Boolean).reduce((acc, g) => acc + g.price, 0)
      const reserve = gifts > 0 ? gifts : prev.budget * 0.2
      return { ...prev, city: v.city, venueId: id, cart: suggestMenu(v, Math.max(0, prev.budget - reserve)) }
    })
  }, [])

  const changeQty = useCallback((itemId, delta) => {
    setState((prev) => {
      const qty = clamp((prev.cart[itemId] || 0) + delta, 0, MAX_QTY)
      const next = { ...prev.cart }
      if (qty === 0) delete next[itemId]
      else next[itemId] = qty
      return { ...prev, cart: next }
    })
  }, [])

  const clearCart = useCallback(() => patch({ cart: {} }), [patch])

  const toggleGift = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      giftIds: prev.giftIds.includes(id) ? prev.giftIds.filter((g) => g !== id) : [...prev.giftIds, id],
    }))
  }, [])

  // Fills the menu with a sensible dinner for two that fits the budget (after gifts).
  const autoPlanMenu = useCallback(() => {
    if (!venue) return
    const reserve = giftTotal > 0 ? giftTotal : budget * 0.2
    patch({ cart: suggestMenu(venue, Math.max(0, budget - reserve)) })
  }, [venue, giftTotal, budget, patch])

  const setSplitOn = useCallback((on) => patch({ splitOn: Boolean(on) }), [patch])
  const setSplitCount = useCallback((n) => patch({ splitCount: Math.min(MAX_SPLIT, Math.max(2, Math.round(Number(n)) || 2)) }), [patch])
  const setTipPct = useCallback((n) => patch({ tipPct: TIP_OPTIONS.includes(Number(n)) ? Number(n) : 0 }), [patch])

  const resetPlan = useCallback(() => patch({ venueId: null, cart: {}, giftIds: [] }), [patch])

  const value = useMemo(
    () => ({
      // state
      budget,
      city,
      vibeFilter,
      venueId,
      cart,
      giftIds,
      yourName,
      theirName,
      dateISO,
      startMin,
      splitOn,
      splitCount,
      tipPct,
      // derived
      cityInfo,
      cityVenues,
      venue,
      vibe,
      cartLines,
      giftLines,
      foodTotal,
      giftTotal,
      total,
      remaining,
      usedPct,
      overBudget,
      split,
      sharePlanLink: () => encodeSharedPlan(state),
      // actions
      setBudget,
      setVibeFilter,
      setCity,
      selectVenue,
      planVenue,
      changeQty,
      clearCart,
      toggleGift,
      autoPlanMenu,
      resetPlan,
      setSplitOn,
      setSplitCount,
      setTipPct,
      setYourName: (v) => patch({ yourName: sanitizeName(v) }),
      setTheirName: (v) => patch({ theirName: sanitizeName(v) }),
      setDateISO: (v) => {
        if (typeof v === 'string') {
          patch({ dateISO: v })
        }
      },
      setStartMin: (v) => {
        const n = Math.round(Number(v))
        if (Number.isFinite(n)) {
          patch({ startMin: ((n % 1440) + 1440) % 1440 })
        }
      },
    }),
    [
      budget, city, vibeFilter, venueId, cart, giftIds, yourName, theirName, dateISO, startMin, splitOn, splitCount, tipPct, split,
      cityInfo, cityVenues, venue, vibe, cartLines, giftLines, foodTotal, giftTotal, total, remaining, usedPct, overBudget,
      setBudget, setVibeFilter, setCity, selectVenue, planVenue, changeQty, clearCart, toggleGift, autoPlanMenu, resetPlan, setSplitOn, setSplitCount, setTipPct, patch,
    ],
  )

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>
}

export const useDate = () => {
  const ctx = useContext(DateContext)
  if (!ctx) throw new Error('useDate must be used inside <DateProvider>')
  return ctx
}
