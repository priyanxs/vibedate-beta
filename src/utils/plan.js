import { CITY_BY_ID, MENU_CATEGORIES } from '../data'
import { formatDay, formatINR, minutesToLabel } from './format'

export const MAX_QTY = 6

/** Every item of a venue as a flat list, tagged with its category. */
export const flattenMenu = (venue) =>
  MENU_CATEGORIES.flatMap(({ key }) => (venue.menu[key] || []).map((item) => ({ ...item, category: key })))

/**
 * Entry cost of a dinner for two: 2 × a budget-friendly main (the second-cheapest, so
 * bread/rice baskets don't count as a meal) + 2 × the cheapest drink.
 */
export const minDateCost = (venue) => {
  if (!venue || !venue.menu) return 0
  const mains = (venue.menu.mains || []).map((i) => i.price).sort((a, b) => a - b)
  const drinks = (venue.menu.drinks || []).map((i) => i.price).sort((a, b) => a - b)
  const main = mains.length ? mains[Math.min(1, mains.length - 1)] : 0
  const drink = drinks.length ? drinks[0] : 0
  return main * 2 + drink * 2
}

/** Cart lines [{item, category, qty}] for the venue, ignoring stale ids. */
export const buildCartLines = (venue, cart) => {
  if (!venue || !cart || typeof cart !== 'object') return []
  return flattenMenu(venue)
    .filter((item) => cart[item.id] > 0)
    .map((item) => ({ item, category: item.category, qty: cart[item.id] }))
}

/**
 * Builds a menu for two that fits `target` as closely as possible:
 * 1 shared starter, 2 mains, 2 drinks, 1 shared dessert.
 */
export const suggestMenu = (venue, target) => {
  if (!venue || !venue.menu) return {}
  const slots = [
    ['appetizers', 1],
    ['mains', 2],
    ['drinks', 2],
    ['desserts', 1],
  ]
  const sorted = {}
  slots.forEach(([cat]) => {
    sorted[cat] = [...(venue.menu[cat] || [])].sort((a, b) => a.price - b.price)
  })

  const build = (t) => {
    const cart = {}
    let cost = 0
    slots.forEach(([cat, count]) => {
      const list = sorted[cat]
      if (!list || !list.length) return
      const base = Math.round(t * (list.length - 1))
      for (let k = 0; k < count; k += 1) {
        let idx = base
        if (k === 1) idx = base > 0 ? base - 1 : Math.min(1, list.length - 1)
        const item = list[idx]
        if (!item || !item.id) continue
        cart[item.id] = (cart[item.id] || 0) + 1
        cost += item.price
      }
    })
    return { cart, cost }
  }

  const tiers = [1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1, 0]
  for (const t of tiers) {
    const { cart, cost } = build(t)
    if (cost <= target) return cart
  }
  return build(0).cart
}

/** Picks the single best-matching gift for the vibe and remaining budget. */
export const pickTopGift = (gifts, vibe, remaining) => {
  const pool = gifts.filter((g) => g.vibes.includes(vibe) && g.price <= remaining)
  if (!pool.length) return null
  const target = remaining * 0.35
  return [...pool].sort((a, b) => Math.abs(a.price - target) - Math.abs(b.price - target))[0]
}

const namesOf = (lines, category) =>
  lines
    .filter((l) => l.category === category)
    .map((l) => (l.qty > 1 ? `${l.item.name} ×${l.qty}` : l.item.name))
    .join(', ')

/** Chronological date timeline. */
export const buildItinerary = ({ venue, cartLines, giftLines, startMin, total }) => {
  const venueName = venue ? venue.name : 'your chosen venue'
  const apps = namesOf(cartLines, 'appetizers')
  const mains = namesOf(cartLines, 'mains')
  const drinks = namesOf(cartLines, 'drinks')
  const desserts = namesOf(cartLines, 'desserts')
  const giftNames = giftLines.map((g) => g.name).join(', ')

  const steps = [
    {
      icon: giftNames ? 'gift' : 'heart',
      duration: 30,
      title: giftNames ? 'Pick up your date & present the gift' : 'Pick up your date',
      detail: giftNames
        ? `Hand over ${giftNames}. Arrive ten minutes early and keep the mood warm and easy.`
        : 'Arrive ten minutes early, offer a genuine compliment and keep the mood easy.',
    },
    {
      icon: 'pin',
      duration: 15,
      title: `Arrive at ${venueName}`,
      detail: drinks
        ? `Settle in and order drinks: ${drinks}.`
        : 'Settle in, ask for a good table and browse the menu together.',
    },
    {
      icon: 'utensils',
      duration: 30,
      title: 'Starters & easy conversation',
      detail: apps
        ? `Share ${apps}. Pull a card from the Conversation Deck if things go quiet.`
        : 'Share a starter or simply chat while you decide. Pull a card from the Conversation Deck if things go quiet.',
    },
    {
      icon: 'utensils',
      duration: 45,
      title: 'Main course',
      detail: mains
        ? `Enjoy ${mains}. Offer a taste of your dish — it is a lovely, low-key way to connect.`
        : 'Order mains you will both enjoy and offer a taste of your dish.',
    },
    {
      icon: 'sparkles',
      duration: 30,
      title: 'Dessert & the good stuff',
      detail: desserts
        ? `Share ${desserts}. This is the best moment for the deeper questions.`
        : 'Share a dessert and ask something a little deeper.',
    },
    {
      icon: 'wallet',
      duration: 10,
      title: 'Settle the bill',
      detail: `Planned total: ${formatINR(total)}. Handle it calmly and discreetly — step away from the table if you can.`,
    },
    {
      icon: 'pin',
      duration: 45,
      title: 'Stroll & unwind',
      detail: venue ? venue.afterSpot : 'Take a short walk nearby and enjoy the evening.',
    },
    {
      icon: 'heart',
      duration: 0,
      title: 'Drop-off & goodnight',
      detail: 'See them home safely, say you had a great time, and send a follow-up message (use the Message Writer).',
    },
  ]

  let offset = 0
  return steps.map((s) => {
    const step = { ...s, time: minutesToLabel(startMin + offset) }
    offset += s.duration
    return step
  })
}

/** Plain-text summary used for "Copy plan". */
export const MAX_SPLIT = 12
export const TIP_OPTIONS = [0, 5, 10, 15]

/** Splits a bill equally. Each person's share is rounded up to the next rupee so the table never comes up short. */
export const splitBill = ({ total, people, tipPct }) => {
  const n = Math.min(MAX_SPLIT, Math.max(1, Math.round(Number(people)) || 1))
  const pct = TIP_OPTIONS.includes(Number(tipPct)) ? Number(tipPct) : 0
  const base = Math.max(0, Math.round(Number(total) || 0))
  const tip = Math.round((base * pct) / 100)
  const grand = base + tip
  const perPerson = Math.ceil(grand / n)
  return { people: n, tipPct: pct, tip, grand, perPerson, collected: perPerson * n }
}

export const buildPlanText = ({ venue, cartLines, giftLines, budget, foodTotal, giftTotal, total, dateISO, startMin, split }) => {
  const lines = ['VibeDate plan', '']
  lines.push(`When: ${formatDay(dateISO) || 'TBD'} at ${minutesToLabel(startMin)}`)
  lines.push(`Where: ${venue ? `${venue.name}, ${(CITY_BY_ID[venue.city] || {}).name || ''}` : 'TBD'}`)
  lines.push(`Budget: ${formatINR(budget)}`)
  lines.push('')
  if (cartLines.length) {
    lines.push('Menu:')
    cartLines.forEach((l) => lines.push(`- ${l.item.name} x${l.qty} — ${formatINR(l.item.price * l.qty)}`))
    lines.push('')
  }
  if (giftLines.length) {
    lines.push('Gifts:')
    giftLines.forEach((g) => lines.push(`- ${g.name} — ${formatINR(g.price)}`))
    lines.push('')
  }
  lines.push(`Menu ${formatINR(foodTotal)} + Gifts ${formatINR(giftTotal)} = ${formatINR(total)}`)
  const left = budget - total
  lines.push(left >= 0 ? `Remaining: ${formatINR(left)}` : `Over budget by ${formatINR(-left)}`)
  if (split && split.people > 1) {
    lines.push('')
    lines.push(`Split ${split.people} ways${split.tipPct ? ` with ${split.tipPct}% tip (${formatINR(split.tip)})` : ''}: ${formatINR(split.perPerson)} each`)
  }
  return lines.join('\n')
}
