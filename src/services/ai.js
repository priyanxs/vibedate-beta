import { getMockReply } from '../utils/wingman'
import { formatINR } from '../utils/format'

/* Wingman AI service.
   - With no key: returns the built-in mock replies (works instantly).
   - With a Gemini API key: calls the Gemini REST API from the browser.
   Key sources (first found wins):
     1. localStorage — pasted into the chat's settings panel (safe for public hosting:
        it never leaves the visitor's own browser).
     2. VITE_GEMINI_API_KEY — local dev only; Vite inlines it into the public bundle. */

const KEY_STORAGE = 'vibedate:gemini-key'
// 'gemini-flash-latest' always points at the current Flash model (older fixed names get retired).
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-flash-latest'

export const getStoredKey = () => {
  try {
    return localStorage.getItem(KEY_STORAGE) || ''
  } catch {
    return ''
  }
}

export const storeKey = (key) => {
  try {
    if (key) localStorage.setItem(KEY_STORAGE, key)
    else localStorage.removeItem(KEY_STORAGE)
  } catch {
    /* storage unavailable — ignore */
  }
}

export const getApiKey = () => getStoredKey() || import.meta.env.VITE_GEMINI_API_KEY || ''

const systemPrompt = (ctx) =>
  [
    'You are "Wingman", the friendly dating coach inside VibeDate, a date-planning app for Indian cities.',
    'Give warm, practical, respectful advice on etiquette, conversation starters, outfits, gifts and pleasing your date.',
    'Always respect consent and boundaries. Keep answers under 150 words, use short bullet points, and use **bold** for key phrases.',
    `Current plan — city: ${ctx.city || 'not chosen'}; vibe: ${ctx.vibe}; venue: ${ctx.venue ? ctx.venue.name : 'not chosen yet'}; budget: ${formatINR(ctx.budget)}; planned spend: ${formatINR(ctx.total)}; remaining: ${formatINR(ctx.remaining)}.`,
  ].join('\n')

/**
 * @param {{role:'user'|'assistant', text:string}[]} history  chat so far, last item is the new user message
 * @param {object} ctx  plan context (vibe, venue, budget, total, remaining)
 * @returns {Promise<{text:string, source:'gemini'|'mock'}>}
 */
export const askWingman = async (history, ctx) => {
  const last = history[history.length - 1].text
  const turn = history.filter((m) => m.role === 'user').length - 1
  const key = getApiKey()
  if (!key) return { text: getMockReply(last, ctx, turn), source: 'mock' }

  try {
    // Gemini requires the conversation to start with a user turn.
    const recent = history.slice(-12)
    const firstUser = recent.findIndex((m) => m.role === 'user')
    const contents = recent.slice(firstUser).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }))

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(ctx) }] },
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
      }),
    })
    if (!res.ok) throw new Error(`Gemini responded with ${res.status}`)
    const data = await res.json()
    const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
    const text = parts ? parts.map((p) => p.text || '').join('').trim() : ''
    if (!text) throw new Error('Empty Gemini response')
    return { text, source: 'gemini' }
  } catch {
    return {
      text: `${getMockReply(last, ctx, turn)}\n\n(Couldn't reach Gemini, so this is a built-in answer. Check your API key in settings.)`,
      source: 'mock',
    }
  }
}
