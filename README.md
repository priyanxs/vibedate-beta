# VibeDate Beta

A budget-aware date planner for **16 Indian cities** — Bhopal, Indore, Jabalpur, Delhi, Mumbai, Bengaluru, Hyderabad, Chennai,
Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, Nagpur and Kochi — built with React, Vite and three.js.

## What's new in Beta

- **3D everywhere:** a glossy 3D heart scene (three.js, loaded on demand), a 3D city ring carousel, depth-layered venue cards,
  3D section reveals. Falls back gracefully if WebGL is unavailable and respects reduced-motion settings.
- **New design:** Fraunces + Manrope typography and four themes — Rose Noir (default), Sapphire Night, Emerald Velvet, Ivory Day (light).
- **300+ venues** across 16 cities (cafés, restaurants, street-food spots, Jain-food restaurants) with menus, a diet filter (pure veg / non-veg / Jain), dish photos you can tap to enlarge, budget tracker, gifts, itinerary, outfits, messages, conversation deck.
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


## Hosting on Vercel (for many visitors)

The site is fully static, so Vercel serves it from its global CDN — it scales to tens of thousands of visitors without a server.

1. Import the repository in Vercel (framework: Vite, build `npm run build`, output `dist` — [`vercel.json`](vercel.json) already says so).
2. Optional live AI: add the environment variables below, then redeploy. Without them the built-in assistant still works for everyone.
   | Variable | Value |
   | --- | --- |
   | `GEMINI_API_KEY` | your Gemini key (mark it *Sensitive*; it stays on the server in [`api/wingman.js`](api/wingman.js)) |
   | `ALLOWED_ORIGINS` | your site, e.g. `https://vibedate.vercel.app` |
   | `VITE_AI_PROXY_URL` | `/api/wingman` |
   | `WINGMAN_PER_MIN` / `WINGMAN_PER_DAY` | optional per-visitor limits (default 10 / 80) |
3. Set a spending cap on your Google key, and add a Vercel Firewall rate-limit rule for `/api/wingman` (the in-function limit is per warm instance).

### Security

[`vercel.json`](vercel.json) sends a strict Content-Security-Policy (no inline scripts; only YouTube's player, Google Maps embeds and fonts are
allowed), HSTS, `X-Frame-Options: DENY`, `nosniff`, a locked-down Permissions-Policy and long-lived caching for hashed assets.
In the code: all text is rendered as text (no `innerHTML`), outbound links allow only http(s) with `rel="noopener"`, saved browser data is
validated on load, pasted YouTube links are parsed to an 11-character id (other hosts are rejected), and no API key is stored in the repository.
The one thing a browser site cannot hide is a key a visitor pastes themselves — that stays in their own browser only.

## Real menus

Menus start as illustrative templates (their prices follow each place's rough cost for two). To show a venue's real menu, add it to
[`src/realMenus.js`](src/realMenus.js) — the file explains the format. Those venues then display "Menu and prices from <source>".
Only add menus you have the right to publish (your own photos of a menu card, or the venue's permission).

## Music

Besides the built-in free-licence tracks, the music panel has a **Bollywood love instrumentals** list (`BOLLYWOOD_PICKS` in
`src/musicConfig.js`). These play inside YouTube's own embedded player, so no copyrighted audio is bundled. If an uploader removes a
video, swap its id in that list.
