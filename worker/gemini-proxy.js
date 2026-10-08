/* VibeDate AI proxy — a tiny Cloudflare Worker that keeps your Gemini API key SECRET on the server.
   The website sends {history, context} here; this worker adds the key and calls Gemini; the browser never sees the key.

   Deploy (free tier is enough):
     1. npm install -g wrangler && wrangler login
     2. cd worker && wrangler deploy
     3. wrangler secret put GEMINI_API_KEY        (paste your key when prompted — it is stored encrypted)
     4. Put your site's address in wrangler.toml (ALLOWED_ORIGIN) so other sites cannot use your proxy
     5. Paste the worker URL into src/aiConfig.js (AI_PROXY_URL) and redeploy the site.
*/

const MODEL = 'gemini-flash-latest'

const cors = (origin, allowed) => ({
  'Access-Control-Allow-Origin': allowed === '*' || origin === allowed ? origin || allowed : allowed,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  Vary: 'Origin',
})

const systemPrompt = (c = {}) =>
  [
    'You are "Wingman", the friendly dating coach inside VibeDate, a date-planning app for Indian cities.',
    'Give warm, practical, respectful advice on etiquette, conversation starters, outfits, gifts, venues and menus.',
    'Always respect consent and boundaries. Keep answers under 150 words, use short bullet points, and use **bold** for key phrases.',
    `Current plan — city: ${c.city || 'not chosen'}; vibe: ${c.vibe || 'any'}; venue: ${c.venue || 'not chosen yet'}; budget: ₹${c.budget}; planned: ₹${c.total}; remaining: ₹${c.remaining}.`,
  ].join('\n')

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || '*'
    const headers = { 'Content-Type': 'application/json', ...cors(request.headers.get('Origin'), allowed) }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
    if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })
    if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: 'Server is missing GEMINI_API_KEY' }), { status: 500, headers })

    let body
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers })
    }
    const history = Array.isArray(body.history) ? body.history.slice(-12) : []
    const firstUser = history.findIndex((m) => m && m.role === 'user')
    if (firstUser === -1) return new Response(JSON.stringify({ error: 'No user message' }), { status: 400, headers })
    const contents = history.slice(firstUser).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.text || '').slice(0, 1500) }],
    }))

    const key = env.GEMINI_API_KEY
    const urls = key.startsWith('AQ.')
      ? [`https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL}:generateContent`, `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`]
      : [`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL}:generateContent`]

    for (const url of urls) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt(body.context) }] },
          contents,
          generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
        const text = parts ? parts.map((p) => p.text || '').join('').trim() : ''
        if (text) return new Response(JSON.stringify({ text }), { status: 200, headers })
        break
      }
      if (res.status !== 404 && res.status !== 400) return new Response(JSON.stringify({ error: `Gemini ${res.status}` }), { status: 502, headers })
    }
    return new Response(JSON.stringify({ error: 'No reply from Gemini' }), { status: 502, headers })
  },
}
