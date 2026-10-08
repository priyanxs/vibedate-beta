# VibeDate

A budget-aware date planner for **16 Indian cities** — Bhopal, Indore, Jabalpur, Delhi, Mumbai, Bengaluru, Hyderabad, Chennai,
Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, Nagpur and Kochi — built with React, Vite and three.js.

## What's new in Beta

- **3D everywhere:** a glossy 3D heart scene (three.js, loaded on demand), a 3D city ring carousel, depth-layered venue cards,
  3D section reveals. Falls back gracefully if WebGL is unavailable and respects reduced-motion settings.
- **New design:** Fraunces + Manrope typography and four themes — Rose Noir (default), Sapphire Night, Emerald Velvet, Ivory Day (light).
- **500 venues** across 16 cities (cafés, restaurants, street-food spots, Jain-food restaurants) with menus, a diet filter (pure veg / non-veg / Jain), dish photos you can tap to enlarge, budget tracker, gifts, itinerary, outfits, messages, conversation deck.
- **Venue links:** Google Maps, directions, an embedded map with reviews, "Photos on Google" and "Check the real menu".
- **Smarter Wingman:** the built-in assistant recommends venues, menus and gifts from the app's own data, offline.

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


## Photos and menus

- City and venue photos are freely licensed images from Wikimedia Commons, credited in the footer (`src/cityPhotos.js`, `src/photoCredits.js`).
  Photos are **not** copied from Google Maps or Google Images (copyrighted); use the "Photos on Google" link or the embedded map instead.
- Menus and prices are **illustrative sample data**. They are not copied from delivery or dining apps; use "Check the real menu" for the current menu.
- Add your own photo: put `<venue-id>.jpg` in `src/assets/venues/`. Add gift links in `src/giftLinks.js`.


## Hosting on Vercel (for many visitors)

The site is fully static, so Vercel serves it from its global CDN — it scales to tens of thousands of visitors without a server.

1. Import the repository in Vercel (framework: Vite, build `npm run build`, output `dist` — [`vercel.json`](vercel.json) already says so).
2. The Wingman works for everyone with no setup (built-in assistant). The Vercel serverless proxy was removed from this repository, so
   live Gemini answers come only from a visitor pasting their own key (kept in their browser) or from the Cloudflare worker in [`worker/`](worker/gemini-proxy.js)
   (`AI_PROXY_URL` in `src/aiConfig.js`). Never put a key in the repository or in a `VITE_*` variable.

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



## Split the bill

In the plan summary, tick **Split the bill**, choose 2–12 people and an optional tip (5/10/15%). Each person's share is rounded up to the next
rupee. The tip is shown separately and is not counted against your budget. The split is saved with the plan and added to **Copy plan**.

## Before you publish (checklist)

- [x] Works on GitHub Pages and Vercel (`vercel.json` adds security headers and caching).
- [x] SEO and sharing: title, description, canonical, Open Graph / Twitter tags, `robots.txt`, `sitemap.xml`, web-app manifest, 404 page.
      These use the GitHub Pages address (`https://priyanxs.github.io/vibedate-beta/`) — **if you use your own domain, replace that address in
      `index.html`, `public/robots.txt` and `public/sitemap.xml`.**
- [x] Privacy policy at `/privacy.html` (linked in the footer) — required by Google AdSense.
- [x] `ads.txt` (works only at the root of a domain, e.g. your Vercel domain) and the AdSense loader in `index.html`.
- [ ] If you serve visitors in the EEA, UK or Switzerland, switch on Google's consent message in your AdSense account (Privacy & messaging).
- [ ] Vercel: Settings → Deployment Protection → disable **Vercel Authentication** so visitors can open the site.
- [ ] Optional live AI: visitors can paste their own free Gemini key in the Wingman settings (https://aistudio.google.com/apikey). No key is stored in this repository.
