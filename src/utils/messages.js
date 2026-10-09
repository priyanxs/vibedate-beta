import { formatDay, minutesToLabel } from './format'

export const MESSAGE_PURPOSES = [
  { key: 'ask', label: 'Ask them out' },
  { key: 'confirm', label: 'Confirm plans' },
  { key: 'followup', label: 'Post-date follow-up' },
]

export const MESSAGE_TONES = ['Flirty', 'Casual', 'Direct', 'Cute']

const buildCtx = ({ them, me, venue, dateISO, startMin }) => {
  const day = formatDay(dateISO)
  return {
    hi: them ? `Hey ${them}` : 'Hey',
    nm: them ? `, ${them}` : '',
    sign: me ? `\n— ${me}` : '',
    at: venue ? `at ${venue.name}` : 'somewhere nice',
    where: venue ? venue.name : 'our spot',
    when: day ? `on ${day} at ${minutesToLabel(startMin)}` : 'this weekend',
    time: minutesToLabel(startMin),
  }
}

// Each tone has two variants so "Regenerate" gives a fresh take.
const TEMPLATES = {
  ask: {
    Flirty: [
      (c) => `${c.hi} 😉 I've been thinking — you, me, dinner ${c.at} ${c.when}. Say yes and I'll make sure it's worth dressing up for.${c.sign}`,
      (c) => `${c.hi}, I have a slightly dangerous idea: dinner ${c.at} ${c.when}. Fair warning — I'm very bad at sharing dessert. 😏${c.sign}`,
    ],
    Casual: [
      (c) => `${c.hi}! Want to grab a bite ${c.at} ${c.when}? No pressure — good food and good company. 🙂${c.sign}`,
      (c) => `${c.hi}, are you free ${c.when}? Thinking of heading ${c.at}. Would love to have you join me!${c.sign}`,
    ],
    Direct: [
      (c) => `${c.hi}, I'd like to take you out for dinner ${c.at} ${c.when}. Would you like to join me?${c.sign}`,
      (c) => `${c.hi}. I enjoy talking to you and I'd like to spend more time together. Dinner ${c.at} ${c.when}?${c.sign}`,
    ],
    Cute: [
      (c) => `${c.hi} 🌸 Quick question: would you be my plus-one for dinner ${c.at} ${c.when}? I promise good snacks and better stories.${c.sign}`,
      (c) => `${c.hi}! I checked my calendar and it said "free ${c.when}, ask them out ${c.at}." Who am I to argue? 💌${c.sign}`,
    ],
  },
  confirm: {
    Flirty: [
      (c) => `${c.hi} 😉 Just confirming we're on for ${c.when} ${c.at}. I'm already looking forward to it — don't be late, I'll be the one smiling.${c.sign}`,
      (c) => `Counting down to ${c.when}${c.nm}. Our evening ${c.at} is all sorted. Wear something that makes me forget the menu. 😏${c.sign}`,
    ],
    Casual: [
      (c) => `${c.hi}! Just checking we're still good for ${c.when} ${c.at}. Let me know if anything changes!${c.sign}`,
      (c) => `Hey, quick confirm — ${c.when}, ${c.at}. I'll message you when I'm on my way. See you soon!${c.sign}`,
    ],
    Direct: [
      (c) => `${c.hi}, confirming our plan: ${c.when} ${c.at}. I'll pick you up on time — please tell me if anything changes.${c.sign}`,
      (c) => `${c.hi}. Reservation is set ${c.at} ${c.when}. Let me know your pick-up spot and I'll be there.${c.sign}`,
    ],
    Cute: [
      (c) => `${c.hi} 🌷 Official reminder: you + me + ${c.where} ${c.when}. I'm already excited!${c.sign}`,
      (c) => `Ding ding! 🔔 Our date ${c.when} ${c.at} is happening. Come hungry, bring your best laugh. 😊${c.sign}`,
    ],
  },
  followup: {
    Flirty: [
      (c) => `${c.hi} 😉 I'm still smiling about tonight. Thank you for the company — when do I get to see you again?${c.sign}`,
      (c) => `Tonight was far too good to end at the door. Thank you${c.nm}. Same time next week? 😏${c.sign}`,
    ],
    Casual: [
      (c) => `${c.hi}! Had a great time tonight. Thanks for coming out — let's do it again soon!${c.sign}`,
      (c) => `Thanks for a fun evening ${c.at}! Hope you got home safe. Let me know when you're free next. 🙂${c.sign}`,
    ],
    Direct: [
      (c) => `${c.hi}, I really enjoyed tonight and I'd like to see you again. Are you free this coming week?${c.sign}`,
      (c) => `I had a great time with you tonight. I'm interested in getting to know you better — would you like to plan another date?${c.sign}`,
    ],
    Cute: [
      (c) => `${c.hi} 🌟 Tonight gets a solid 10/10. Thank you for being such wonderful company! 💛${c.sign}`,
      (c) => `Just texting to say my cheeks hurt from smiling. Thank you for tonight! Can we do dessert round two soon? 🍰${c.sign}`,
    ],
  },
}

export const generateMessage = ({ purpose, tone, variant, ...plan }) => {
  const list = (TEMPLATES[purpose] && TEMPLATES[purpose][tone]) || TEMPLATES.ask.Casual
  const v = Number.isFinite(variant) ? Math.round(variant) : 0
  const fn = list[((v % list.length) + list.length) % list.length] || list[0]
  return typeof fn === 'function' ? fn(buildCtx(plan)) : ''
}
