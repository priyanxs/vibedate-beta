import { CITIES, CITY_BY_ID, GIFTS, KIND_LABELS, VENUES, kindOf } from '../data'
import { formatINR } from './format'
import { buildCartLines, minDateCost, suggestMenu } from './plan'

/* Mock "AI" for VibeDate's Wingman. A topic is chosen by keyword score and
   its reply is filled in from the user's current plan. The real Gemini call
   lives in ../services/ai.js and falls back to this when no key is set. */

const startsWord = (text, key) => new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(text)

const plan = (ctx) => (ctx.venue ? ` at **${ctx.venue.name}**` : '')

const TOPICS = [
  {
    id: 'greeting',
    match: (t) => /^(hi+|hello|hey+|namaste|yo|sup)\b/.test(t) && t.split(' ').length <= 4,
    reply: () =>
      "Hey! Great to see you. 👋 I can help with **conversation starters**, **etiquette**, **what to wear**, **how to make them feel special**, or **calming first-date nerves**. What do you need?",
  },
  {
    id: 'starters',
    keys: ['conversation', 'starter', 'talk', 'topic', 'awkward', 'silence', 'icebreak', 'question', 'what to say', 'what do i say'],
    reply: (ctx, n) => {
      const sets = [
        `Here are some easy openers${plan(ctx)}:\n- "What's been the best part of your week so far?"\n- "If we could teleport anywhere after dinner, where are we going?"\n- "What's a small thing that always makes your day better?"\n- "What's your go-to comfort food?"\n\n**Pro tip:** ask open questions, listen for the story, then follow up with "What happened next?". Stuck? Flip a card in the **Conversation Deck**.`,
        `Try these when things get quiet:\n- "What's something you're proud of that most people don't know?"\n- "What's the best trip you've ever taken?"\n- "What would your perfect lazy Sunday look like?"\n- "What's a skill you'd love to master?"\n\nBe curious, not interrogating — share your own answers too so it feels like a conversation.`,
      ]
      return sets[n % sets.length]
    },
  },
  {
    id: 'nervous',
    keys: ['nervous', 'anxious', 'anxiety', 'scared', 'butterflies', 'shy', 'panic', 'worried', 'confidence', 'confident', 'first date'],
    reply: (ctx) =>
      `Nerves just mean you care — that's a good sign. 💛 Try this:\n- **Breathe slowly** for a minute before you arrive (in for 4, out for 6).\n- **Arrive 10 minutes early** so you can settle in.\n- **Focus on them**, not on performing. Curiosity beats perfection.\n- It's okay to say "I'm a little nervous, but I'm really glad we're here" — honesty is charming.\n${ctx.venue ? `\nYou've picked **${ctx.venue.name}** — a ${ctx.venue.vibe.toLowerCase()} setting is great for relaxing into the evening.` : ''}`,
  },
  {
    id: 'special',
    keys: ['please', 'impress', 'special', 'make her', 'make him', 'make them', 'happy', 'romantic', 'charm', 'appreciat', 'treat'],
    reply: (ctx, n) => {
      const sets = [
        `The secret is **attention**, not extravagance:\n- Remember small details (their favourite drink, a story they told) and bring them up later.\n- Give **specific compliments** — "I love how you laugh at your own jokes" beats "you look nice".\n- Put your phone away. Full presence is the biggest compliment.\n- Check they're comfortable: seat, temperature, food choices.\n- Plan one small surprise${ctx.remaining > 0 ? ` — with ${formatINR(ctx.remaining)} left you have room for it` : ''}.`,
        `A few things that make people feel genuinely special:\n- Ask follow-up questions and actually listen.\n- Let them choose the dessert (or share one).\n- Respect their pace — never rush the evening or the conversation.\n- End with sincerity: "I really enjoyed this evening, thank you."`,
      ]
      return sets[n % sets.length]
    },
  },
  {
    id: 'bill',
    keys: ['bill', 'pay', 'split', 'tip', 'cheque', 'check please', 'payment'],
    reply: (ctx) =>
      `Bill etiquette in a nutshell:\n- If you invited them, **offer to pay** — it's a graceful default. If they'd like to split, accept kindly: "Sure, thank you!"\n- Settle it **discreetly** — step away or signal the waiter early instead of debating at the table.\n- A **5–10%** tip is appreciated where service isn't already included.\n- Your plan so far: **${formatINR(ctx.total)}** of your **${formatINR(ctx.budget)}** budget.`,
  },
  {
    id: 'etiquette',
    keys: ['etiquette', 'manner', 'rule', 'behave', 'polite', 'do and don', 'dos', 'table', 'phone', 'protocol', 'tips'],
    reply: (ctx) =>
      `Date etiquette essentials${plan(ctx)}:\n- **Be on time** (or early) and message if anything changes.\n- **Phone away**, face up on silent at most.\n- **Be kind to staff** — it's one of the most-noticed traits.\n- **Offer** them the better seat and let them order first.\n- **Don't dominate** — aim for roughly 50/50 talking and listening.\n- **Respect boundaries**: a "no" or "not yet" is always okay, from either side.\n- Avoid bringing up exes, salary, or heavy politics early on.`,
  },
  {
    id: 'outfit',
    keys: ['wear', 'outfit', 'dress', 'cloth', 'colour', 'color', 'style', 'look good', 'fashion'],
    reply: (ctx) =>
      `For a **${ctx.vibe}** vibe${plan(ctx)}, think ${ctx.venue ? `**${ctx.venue.dressCode.toLowerCase()}**` : 'smart casual'}:\n- Fit matters more than price — make sure everything is comfortable and well fitted.\n- Choose **one** standout piece (a bold colour or accessory) and keep the rest simple.\n- Wear shoes you can walk in.\n- Go easy on fragrance.\n\nOpen the **Outfit Coordinator** below for colour palettes matched to your vibe.`,
  },
  {
    id: 'venue',
    keys: ['venue', 'restaurant', 'place', 'where', 'menu', 'order', 'food', 'dish', 'eat', 'cafe', 'dinner'],
    reply: (ctx) =>
      ctx.venue
        ? `You've picked **${ctx.venue.name}** (${ctx.venue.cuisine}). A few ideas:\n- Share a starter — it's a great way to ease into the evening.\n- Ask your date about dietary preferences before ordering.\n- Highlights here: ${ctx.venue.highlights.join(', ').toLowerCase()}.\n- After dinner: ${ctx.venue.afterSpot}`
        : 'You haven\'t picked a venue yet. Choose a **Vibe** first — Romantic, Cozy, Vibrant or Casual — then browse the venues that fit your budget. Not sure? A cozy café is the safest bet for a first date.',
  },
  {
    id: 'budget',
    keys: ['budget', 'cost', 'money', 'afford', 'cheap', 'expensive', 'spend', 'price', 'save'],
    reply: (ctx) =>
      `Your budget is **${formatINR(ctx.budget)}** and your plan is at **${formatINR(ctx.total)}**, which leaves **${formatINR(ctx.remaining)}**.\n${ctx.remaining < 0 ? '\nYou\'re over budget. Try swapping a main for a cheaper one, sharing a dessert, or choosing a lighter gift.' : '\nA good rule: spend about 70–80% on the meal and keep 10–20% for a thoughtful gift. Effort and attention matter more than the price tag.'}`,
  },
  {
    id: 'gift',
    keys: ['gift', 'flower', 'present', 'chocolate', 'jewel', 'bouquet', 'surprise'],
    reply: (ctx) =>
      `Gift advice:\n- Match the gift to the **${ctx.vibe}** vibe — roses for romance, handwritten notes and candles for cozy.\n- A single, well-chosen item beats a pile of generic ones.\n- Hand it over **at pick-up**, not mid-dinner.\n- You have **${formatINR(Math.max(ctx.remaining, 0))}** left to play with — see the **Gift Suggester** for ideas that fit.`,
  },
  {
    id: 'ending',
    keys: ['end the night', 'end the date', 'goodnight', 'good night', 'kiss', 'drop', 'leave', 'wrap', 'hug', 'ending', 'end well'],
    reply: () =>
      `Ending well is simple:\n- **Say it plainly:** "I had a really great time tonight."\n- **Read the moment** — a warm hug or a handshake is perfectly fine. Always **ask or watch for consent**; if you're unsure, don't.\n- **See them home safely** or make sure their ride is sorted.\n- **Text the next day** (or that night) — use the Message Writer for a follow-up.\n- If you'd like a second date, say so clearly instead of leaving it vague.`,
  },
  {
    id: 'followup',
    keys: ['text', 'message', 'follow', 'reply', 'call', 'ghost', 'after the date', 'next day', 'wait'],
    reply: () =>
      `Follow-up rules of thumb:\n- Send a short, genuine message **within 24 hours** — same night is fine.\n- Mention a specific moment you enjoyed.\n- Don't play games with waiting periods.\n- If they're slow to reply, give it a day or two before nudging once.\n\nThe **Message Writer** can draft it in Flirty, Casual, Direct or Cute.`,
  },
  {
    id: 'late',
    keys: ['late', 'cancel', 'reschedul', 'delay', 'traffic', 'postpone'],
    reply: () =>
      `If plans shift:\n- **Message early** — a heads-up beats a silent no-show.\n- Be brief and sincere: "I'm so sorry, I'm running 15 minutes behind. Thank you for your patience."\n- Offer a concrete alternative if you need to reschedule.\n- Never blame traffic repeatedly — leave extra buffer next time.`,
  },
  {
    id: 'avoid',
    keys: ['avoid', 'red flag', 'taboo', 'mistake', 'never', 'wrong', 'ex '],
    reply: () =>
      `Common first-date mistakes to dodge:\n- Talking about exes or past heartbreak at length.\n- Checking your phone repeatedly.\n- Interrupting or finishing their sentences.\n- Being rude to staff.\n- Oversharing too soon, or interrogating them.\n- Pressuring for anything — conversation, drinks or physical contact.`,
  },
  {
    id: 'body',
    keys: ['body language', 'eye contact', 'posture', 'signal', 'interested', 'flirt', 'attraction'],
    reply: () =>
      `Positive body language is easy to spot:\n- Natural **eye contact** (not a stare) and genuine smiles.\n- Leaning slightly in when you speak.\n- Relaxed, open posture — uncrossed arms.\n- Mirroring small gestures.\n\nMirror that warmth yourself. And if signals are unclear, a polite direct question beats guesswork.`,
  },
  {
    id: 'diet',
    keys: ['veg', 'vegetarian', 'allergy', 'allergic', 'diet', 'vegan', 'jain'],
    reply: (ctx) =>
      `Always ask about **dietary preferences or allergies** before booking or ordering. In the menu panel you can tick **Veg only** to filter dishes${ctx.venue ? ` at ${ctx.venue.name}` : ''}. Offering options for both of you is thoughtful.`,
  },
  {
    id: 'thanks',
    keys: ['thank', 'thanks', 'awesome', 'great help'],
    reply: () => "Anytime! 💛 You've got this. Go have a wonderful evening — and be yourself.",
  },
]

const FALLBACK = (ctx) =>
  `I'm your date-night wingman! Try asking me about:\n- **Conversation starters**\n- **Etiquette** and who pays\n- **What to wear**${ctx.venue ? ` at ${ctx.venue.name}` : ''}\n- How to make them feel **special**\n- Calming your **nerves**\n- How to **end the night** well`

/* ---------------- data-aware answers (venues, menus, gifts) ---------------- */

const parseBudget = (t) => {
  const m =
    t.match(/(?:₹|rs\.?\s*|inr\s*|under\s*|below\s*|within\s*|upto\s*|up to\s*|budget(?: of| is)?\s*|for\s*)\s*([0-9][0-9,]{2,5})/i) ||
    t.match(/\b([0-9]{3,5})\b/)
  if (!m) return null
  const n = parseInt(m[1].replace(/,/g, ''), 10)
  return Number.isFinite(n) && n >= 100 ? n : null
}

const findCity = (t) => CITIES.find((c) => new RegExp(`(^|[^a-z])${c.name.toLowerCase()}($|[^a-z])`).test(t))

const findKind = (t) => {
  if (/caf[eé]s?(?![a-z])|coffee|brunch|bakery/.test(t)) return 'cafe'
  if (/street|chaat|stalls?|night market/.test(t)) return 'street'
  if (/restaurants?|dinner|lunch|biryani|thali|kebabs?/.test(t)) return 'restaurant'
  return null
}

const findVibe = (t) => {
  if (/romantic|candle|anniversary|propose|special occasion|fine dining/.test(t)) return 'Romantic'
  if (/cozy|cosy|quiet|calm|chill|relax/.test(t)) return 'Cozy'
  if (/vibrant|lively|party|energetic|buzz|fun/.test(t)) return 'Vibrant'
  if (/casual|cheap|simple|first meet|low[- ]key/.test(t)) return 'Casual'
  return null
}

const shortList = (items) => items.map((x) => `- **${x.v.name}** — ${x.v.cuisine}, from ${formatINR(x.min)} for two. ${x.v.tagline}`).join('\n')

// Recommends venues from the app's own data.
const recommendReply = (t, ctx) => {
  const city = findCity(t) || CITY_BY_ID[ctx.cityId] || CITIES[0]
  const kind = findKind(t)
  const vibe = findVibe(t)
  const budget = parseBudget(t)
  const pool = VENUES.filter((v) => v.city === city.id && (!kind || kindOf(v) === kind) && (!vibe || v.vibe === vibe)).map((v) => ({ v, min: minDateCost(v) }))
  const label = [vibe ? vibe.toLowerCase() : null, kind ? (KIND_LABELS[kind] || kind).toLowerCase().replace(/s$/, '') : 'place', budget ? `under ${formatINR(budget)}` : null].filter(Boolean).join(' ')
  if (!pool.length) {
    const any = VENUES.filter((v) => v.city === city.id).length
    return `I couldn't find a ${label} in **${city.name}** (${any} venues listed there). Try a different vibe or type, or ask about another city.`
  }
  const fits = budget ? pool.filter((x) => x.min <= budget) : pool
  if (!fits.length) {
    const cheapest = [...pool].sort((a, b) => a.min - b.min)[0]
    return `Nothing in **${city.name}** matches a ${label} for two. The most affordable is **${cheapest.v.name}** at about ${formatINR(cheapest.min)} for two — try raising your budget a little.`
  }
  const ranked = [...fits].sort((a, b) => b.min - a.min).slice(0, 3)
  return `Top ${label} picks in **${city.name}**:\n${shortList(ranked)}\n\nOpen the **Venues** section, tap **Choose**, and I'll help you plan the menu.`
}

// Suggests dishes for two that fit a budget, from the chosen (or best-fit) venue.
const menuReply = (t, ctx) => {
  const budget = parseBudget(t) || ctx.budget
  const city = findCity(t) || CITY_BY_ID[ctx.cityId] || CITIES[0]
  let venue = ctx.venue && ctx.venue.city === city.id ? ctx.venue : null
  if (!venue) {
    const kind = findKind(t)
    const vibe = findVibe(t)
    const options = VENUES.filter((v) => v.city === city.id && (!kind || kindOf(v) === kind) && (!vibe || v.vibe === vibe) && minDateCost(v) <= budget)
    venue = options.sort((a, b) => minDateCost(b) - minDateCost(a))[0] || null
  }
  if (!venue) return `I couldn't find a venue in **${city.name}** that fits ${formatINR(budget)} for two. Try a bigger budget or another city.`
  const cart = suggestMenu(venue, budget * 0.8)
  const lines = buildCartLines(venue, cart)
  const total = lines.reduce((a, l) => a + l.item.price * l.qty, 0)
  const dishes = lines.map((l) => `- ${l.qty > 1 ? `${l.qty} × ` : ''}${l.item.name} (${formatINR(l.item.price * l.qty)})`).join('\n')
  return `For two at **${venue.name}** (${city.name}) with a ${formatINR(budget)} budget, I'd order:\n${dishes}\n\nThat's about **${formatINR(total)}**, leaving ${formatINR(Math.max(budget - total, 0))} for a gift. In the menu panel, tap **AI: suggest a menu** to add it automatically.`
}

// Suggests gifts that fit an amount.
const giftReply = (t, ctx) => {
  const amount = parseBudget(t) || (ctx.remaining > 0 ? ctx.remaining : 600)
  const vibe = findVibe(t) || ctx.vibe
  const pool = GIFTS.filter((g) => g.price <= amount).sort((a, b) => (b.vibes.includes(vibe) ? 1 : 0) - (a.vibes.includes(vibe) ? 1 : 0) || b.price - a.price).slice(0, 3)
  if (!pool.length) return `Nothing in the gift list is under ${formatINR(amount)} — a handwritten note is free and always lands well. 💌`
  return `Gift ideas up to ${formatINR(amount)} that suit a **${vibe}** evening:\n${pool.map((g) => `- ${g.emoji} **${g.name}** (${formatINR(g.price)}) — ${g.note}`).join('\n')}\n\nAdd any of them in the **Gift suggester**.`
}

const smartReply = (t, ctx) => {
  // Questions about clothes, nerves or manners are answered by the topic engine below, not the venue finder.
  if (/(wear|outfit|dress code|clothes|nervous|etiquette|manners|split the bill|who pays)/.test(t)) return null
  const asksRecommend = /(recommend|suggest|best|where|which|find|show me|top|good|nice|any )/.test(t)
  const namesPlace = /(place|spot|venue|restaurants?|caf[eé]s?(?![a-z])|coffee shop|brunch|street food|dinner)/.test(t)
  const asksMenu = /(what (should|do|can) (we|i) (order|eat|get|have)|order|menu|combo|plan (a )?date|plan my)/.test(t)
  const asksGift = /(gift|present|flowers?|bouquet|chocolates?|jewel)/.test(t)
  if (asksGift && (parseBudget(t) || /(idea|suggest|what|which|under|best)/.test(t))) return giftReply(t, ctx)
  if (asksMenu && (parseBudget(t) || ctx.venue)) return menuReply(t, ctx)
  // "Romantic dinner spot in Jaipur", "best café under 500", "cozy places in Pune" ...
  if (namesPlace && (asksRecommend || findCity(t) || findVibe(t) || parseBudget(t))) return recommendReply(t, ctx)
  if (asksRecommend && (findKind(t) || findCity(t))) return recommendReply(t, ctx)
  return null
}

export const getMockReply = (input, ctx = {}, turn = 0) => {
  const text = String(input || '').toLowerCase().trim()
  const safeCtx = ctx && typeof ctx === 'object' ? ctx : {}
  const smart = smartReply(text, safeCtx)
  if (smart) return smart
  let best = null
  let bestScore = 0

  TOPICS.forEach((topic) => {
    const score = topic.match ? (topic.match(text) ? 5 : 0) : topic.keys.filter((k) => startsWord(text, k)).length
    if (score > bestScore) {
      best = topic
      bestScore = score
    }
  })

  return best ? best.reply(safeCtx, turn) : FALLBACK(safeCtx)
}
