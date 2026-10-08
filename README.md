# VibeDate Beta

A budget-aware date planner for **16 Indian cities** — Bhopal, Indore, Jabalpur, Delhi, Mumbai, Bengaluru, Hyderabad, Chennai,
Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, Nagpur and Kochi — built with React, Vite and three.js.

## What's new in Beta

- **3D everywhere:** a glossy 3D heart scene (three.js, loaded on demand), a 3D city ring carousel, depth-layered venue cards,
  3D section reveals. Falls back gracefully if WebGL is unavailable and respects reduced-motion settings.
- **New design:** Fraunces + Manrope typography and four themes — Rose Noir (default), Sapphire Night, Emerald Velvet, Ivory Day (light).
- **99 venues** (cafés, restaurants, street-food spots) with menus, budget tracker, gifts, itinerary, outfits, messages, conversation deck.
- **Venue links:** Google Maps, directions, an embedded map with reviews, "Photos on Google" and "Check the real menu".
- **Smarter Wingman:** the built-in assistant recommends venues, menus and gifts from the app's own data, offline.
- **Music panel:** public-domain piano, plus a field to play any YouTube link in YouTube's own player.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Deploy to GitHub Pages

Settings → Pages → Source: **GitHub Actions**. Each push to `main` runs `.github/workflows/deploy.yml`.

## Keeping API keys hidden (important)

A website that runs in the browser **cannot hide a key**: anything shipped to the browser can be read by every visitor. So:

- **No key is in this repository, and none should ever be added** (not in source, not in `VITE_*` variables).
- The Wingman works with **no key at all** — the built-in assistant answers from the app's data.
- For live Gemini answers without exposing your key, deploy the tiny proxy in [`worker/`](worker/gemini-proxy.js) to Cloudflare Workers.
  The key lives there as an encrypted server-side secret (`wrangler secret put GEMINI_API_KEY`); then put the worker's URL in
  `src/aiConfig.js` (`AI_PROXY_URL`). Restrict `ALLOWED_ORIGIN` in `worker/wrangler.toml` to your site.
- Visitors may also paste **their own** key in the chat settings; it stays in their browser only.
- If a key was ever pasted anywhere public, revoke it and create a new one.

## Music

Built-in tracks are public-domain recordings (Chopin nocturnes, Satie) from Wikimedia Commons — see `src/musicConfig.js`.
Popular songs (for example Bollywood tracks) and their covers are copyrighted and are **not** bundled. To use one legally, open
the music panel (⌄ next to the music button) and paste its YouTube link: it plays in YouTube's official embedded player.
You can also set a default in `src/musicConfig.js` (`DEFAULT_YOUTUBE`).

## Photos and menus

- City and venue photos are freely licensed images from Wikimedia Commons, credited in the footer (`src/cityPhotos.js`, `src/photoCredits.js`).
  Photos are **not** copied from Google Maps or Google Images (copyrighted); use the "Photos on Google" link or the embedded map instead.
- Menus and prices are **illustrative sample data**. They are not copied from delivery or dining apps; use "Check the real menu" for the current menu.
- Add your own photo: put `<venue-id>.jpg` in `src/assets/venues/`. Add gift links in `src/giftLinks.js`.
