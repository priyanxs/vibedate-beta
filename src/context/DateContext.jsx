import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BUDGET, GIFT_BY_ID, VENUE_BY_ID, VIBE_LIST } from '../data'
import { nextSaturdayISO, parseISODate } from '../utils/format'
import { MAX_QTY, buildCartLines, flattenMenu, suggestMenu } from '../utils/plan'

const STORAGE_KEY = 'vibedate:plan:v1'

const DateContext = createContext(null)

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

/** Reads the saved plan and validates every field, so bad/old data can never crash the app. */
const loadInitialState = () => {
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    saved = {}
  }

  const budget =
    typeof saved.budget === 'number' && Number.isFinite(saved.budget)
      ? clamp(Math.round(saved.budget / BUDGET.step) * BUDGET.step, BUDGET.min, BUDGET.max)
      : BUDGET.default

  const venueId = VENUE_BY_ID[saved.venueId] ? saved.venueId : null

  const cart = {}
  if (venueId && saved.cart && typeof saved.cart === 'object') {
    flattenMenu(VENUE_BY_ID[venueId]).forEach((item) => {
      const qty = Number(saved.cart[item.id])
      if (Number.isInteger(qty) && qty > 0) cart[item.id] = Math.min(qty, MAX_QTY)
    })
  }

  const giftIds = Array.isArray(saved.giftIds) ? saved.giftIds.filter((id) => GIFT_BY_ID[id]) : []

  return {
    budget,
    vibeFilter: saved.vibeFilter === 'All' || VIBE_LIST.includes(saved.vibeFilter) ? saved.vibeFilter : 'All',
    venueId,
    cart,
    giftIds,
    yourName: typeof saved.yourName === 'string' ? saved.yourName.slice(0, 40) : '',
    theirName: typeof saved.theirName === 'string' ? saved.theirName.slice(0, 40) : '',
    dateISO: parseISODate(saved.dateISO) ? saved.dateISO : nextSaturdayISO(),
    startMin: Number.isInteger(saved.startMin) && saved.startMin >= 0 && saved.startMin < 1440 ? saved.startMin : 18 * 60,
  }
}

export function DateProvider({ children }) {
  const [state, setState] = useState(loadInitialState)
  const { budget, vibeFilter, venueId, cart, giftIds, yourName, theirName, dateISO, startMin } = state

  // Persist the plan on this device only.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable (private mode) — the app still works */
    }
  }, [state])

  const patch = useCallback((changes) => setState((prev) => ({ ...prev, ...changes })), [])

  /* ---- derived values ---- */
  const venue = venueId ? VENUE_BY_ID[venueId] : null
  const vibe = venue ? venue.vibe : vibeFilter !== 'All' ? vibeFilter : 'Romantic'

  const cartLines = useMemo(() => buildCartLines(venue, cart), [venue, cart])
  const giftLines = useMemo(() => giftIds.map((id) => GIFT_BY_ID[id]).filter(Boolean), [giftIds])

  const foodTotal = cartLines.reduce((acc, l) => acc + l.item.price * l.qty, 0)
  const giftTotal = giftLines.reduce((acc, g) => acc + g.price, 0)
  const total = foodTotal + giftTotal
  const remaining = budget - total
  const usedPct = budget > 0 ? Math.min(100, (total / budget) * 100) : 0
  const overBudget = total > budget

  /* ---- actions ---- */
  const setBudget = useCallback((value) => {
    const n = Number(value)
    if (Number.isFinite(n)) patch({ budget: clamp(n, BUDGET.min, BUDGET.max) })
  }, [patch])

  const setVibeFilter = useCallback((value) => patch({ vibeFilter: value }), [patch])

  const selectVenue = useCallback((id) => {
    setState((prev) => (prev.venueId === id ? prev : { ...prev, venueId: id, cart: {} }))
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

  const resetPlan = useCallback(() => patch({ venueId: null, cart: {}, giftIds: [] }), [patch])

  const value = useMemo(
    () => ({
      // state
      budget,
      vibeFilter,
      venueId,
      cart,
      giftIds,
      yourName,
      theirName,
      dateISO,
      startMin,
      // derived
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
      // actions
      setBudget,
      setVibeFilter,
      selectVenue,
      changeQty,
      clearCart,
      toggleGift,
      autoPlanMenu,
      resetPlan,
      setYourName: (v) => patch({ yourName: v.slice(0, 40) }),
      setTheirName: (v) => patch({ theirName: v.slice(0, 40) }),
      setDateISO: (v) => patch({ dateISO: v }),
      setStartMin: (v) => patch({ startMin: Number(v) }),
    }),
    [
      budget, vibeFilter, venueId, cart, giftIds, yourName, theirName, dateISO, startMin,
      venue, vibe, cartLines, giftLines, foodTotal, giftTotal, total, remaining, usedPct, overBudget,
      setBudget, setVibeFilter, selectVenue, changeQty, clearCart, toggleGift, autoPlanMenu, resetPlan, patch,
    ],
  )

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>
}

export const useDate = () => {
  const ctx = useContext(DateContext)
  if (!ctx) throw new Error('useDate must be used inside <DateProvider>')
  return ctx
}
