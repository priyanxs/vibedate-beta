import { getMockReply } from '../utils/wingman'
import { formatINR } from '../utils/format'
import { AI_PROXY_URL } from '../aiConfig'

/* Wingman AI service. Three modes, picked automatically:
   1. proxy    — AI_PROXY_URL is set: requests go to your own server-side proxy (the API key never reaches the browser).
   2. key      — the visitor pasted their own Gemini key in the chat settings (kept only in their browser).
   3. built-in — no setup needed: the offline assistant answers from the app's own data.
   Any failure in 1 or 2 falls back to 3, so the assistant always replies. */

const KEY_STORAGE = 'vibedate:gemini-key'
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-flash-latest'
const PROXY = import.meta.env.VITE_AI_PROXY_URL || AI_PROXY_URL

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

export const getApiKey = () => getStoredKey()

export const getAiMode = () => (PROXY ? 'proxy' : getApiKey() ? 'key' : 'builtin')

export const buildSystemPrompt = (ctx) =>
  [
    'You are "Wingman", the friendly dating coach inside VibeDate, a date-planning app for Indian cities.',
    'Give warm, practical, respectful advice on etiquette, conversation starters, outfits, gifts, venues and menus.',
    'Always respect consent and boundaries. Keep answers under 150 words, use short bullet points, and use **bold** for key phrases.',
    `Current plan — city: ${ctx.city || 'not chosen'}; vibe: ${ctx.vibe}; venue: ${ctx.venue ? ctx.venue.name : 'not chosen yet'}; budget: ${formatINR(ctx.budget)}; planned spend: ${formatINR(ctx.total)}; remaining: ${formatINR(ctx.remaining)}.`,
  ].join('\n')

const toContents = (history) => {
  // Gemini requires the conversation to start with a user turn.
  const recent = history.slice(-12)
  const firstUser = recent.findIndex((m) => m.role === 'user')
  return recent.slice(firstUser).map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
}

const readText = (data) => {
  const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
  return parts ? parts.map((p) => p.text || '').join('').trim() : ''
}

// Google issues two kinds of keys: standard ("AIza…") and Vertex AI express ("AQ.…"). Try the matching endpoint first.
const endpointsFor = (key) => {
  const standard = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
  const express = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL}:generateContent`
  return key.startsWith('AQ.') ? [express, standard] : [standard, express]
}

const callProxy = async (history, ctx) => {
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history: history.slice(-12).map((m) => ({ role: m.role, text: m.text })),
      context: { city: ctx.city, vibe: ctx.vibe, venue: ctx.venue ? ctx.venue.name : '', budget: ctx.budget, total: ctx.total, remaining: ctx.remaining },
    }),
  })
  if (!res.ok) throw new Error(`proxy ${res.status}`)
  const data = await res.json()
  if (!data || !data.text) throw new Error('empty proxy reply')
  return data.text
}

const callGemini = async (history, ctx, key) => {
  let lastStatus = 0
  for (const url of endpointsFor(key)) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(ctx) }] },
        contents: toContents(history),
        generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
      }),
    })
    lastStatus = res.status
    if (res.ok) {
      const text = readText(await res.json())
      if (text) return text
      throw new Error('empty Gemini reply')
    }
    if (res.status !== 404 && res.status !== 400) break // bad key / quota: no point trying the other endpoint
  }
  throw new Error(`Gemini ${lastStatus}`)
}

/**
 * @param {{role:'user'|'assistant', text:string}[]} history  chat so far, last item is the new user message
 * @param {object} ctx  plan context (city, cityId, vibe, venue, budget, total, remaining)
 * @returns {Promise<{text:string, source:'proxy'|'key'|'builtin'}>}
 */
export const askWingman = async (history, ctx) => {
  const last = history[history.length - 1].text
  const turn = history.filter((m) => m.role === 'user').length - 1
  const mode = getAiMode()
  const builtIn = () => getMockReply(last, ctx, turn)

  if (mode === 'builtin') return { text: builtIn(), source: 'builtin' }

  try {
    const text = mode === 'proxy' ? await callProxy(history, ctx) : await callGemini(history, ctx, getApiKey())
    return { text, source: mode }
  } catch {
    return { text: `${builtIn()}\n\n(Live AI is unavailable right now, so this is the built-in assistant.)`, source: 'builtin' }
  }
}
