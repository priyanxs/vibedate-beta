# VibeDate v2

A budget-aware date planner for 16 Indian cities: Bhopal, Indore, Jabalpur; Tier 1 metros Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad; and Tier 2 cities Jaipur, Lucknow, Chandigarh, Nagpur, Kochi — React + Vite single-page app, deployable to GitHub Pages.

**Features:** budget slider that drives venue/menu/gift suggestions · 9 Bhopal venues by vibe with menus · live cost calculator
with budget meter and over-budget warning · gift suggester · itinerary builder · outfit coordinator · message writer (4 tones) ·
conversation deck · AI Wingman chat (built-in answers, optional Gemini).

## What's in v2

- 99 venues in 16 cities (cafés, restaurants and street-food spots), each with a menu; landmark photos for every city and
  real photos for a few venues (all Wikimedia Commons, credited in the footer)
- Four colour themes (Golden Hour, Midnight Velvet, Lavender Dusk, Blush Day) — palette button in the navbar
- Search and sort venues, price-level badges, Google Maps links, venue photos with credits
- Polished dark design: intro splash, scroll reveals, parallax, card tilt and spotlight, toasts, back-to-top, animated stats
- Soothing background music (toggle in the navbar): public-domain Chopin nocturnes (piano) and Satie's Gymnopédie No. 1 (guitar),
  via Wikimedia Commons. The playlist is `src/musicConfig.js`; files are in `public/audio/`. Browsers only allow sound after
  the first click or tap, so it starts on your first interaction; your on/off choice is remembered. To use a different song,
  add a file you have the rights to publish — popular songs and their covers are copyrighted.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Deploy to GitHub Pages

1. Push this project to GitHub (branch `main`).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes the site.

`vite.config.js` uses `base: './'`, so it works under any `https://<user>.github.io/<repo>/` path. There is no router, so no 404 fallback is needed.

## Data

Venues, menus, gifts, outfits, cards and message templates live in `src/data.js` (+ `src/venues/*.js` for other cities). Themes: `src/themes.js` and the THEMES block of `src/index.css`. They are **illustrative sample data** — confirm
real menus and prices with each venue.

## Customising

- **Gift links:** open `src/giftLinks.js`, paste your `https://` link between the quotes next to a gift. That gift then shows a
  green **Buy** button; gifts left as `''` show **Find online** (a web search).
- **Venue photos:** `src/assets/venues/<venue-id>.jpg`. The bundled photos are freely licensed Wikimedia Commons images, all
  illustrative; credits are in `src/photoCredits.js` and shown in the app. Replace a file with your own photo and update or delete its credit entry.
- **Google Maps:** venues link to a Google Maps search automatically. For an exact pin, add `mapsUrl: 'https://maps.app.goo.gl/…'` to the venue.
- **Logo:** `public/logo.png` (navbar/footer), `public/favicon.png`, `public/apple-touch-icon.png`.

## AI Wingman / Gemini

The Wingman works out of the box with built-in answers. For live answers, open the chat → gear icon → paste a Gemini API key
(`src/services/ai.js`). The key is kept in the visitor's own browser (localStorage) and sent only to Google.
For local development you may instead set `VITE_GEMINI_API_KEY` in `.env` (see `.env.example`).
**Never set the key as a build-time secret for the deployed site** — Vite would embed it in the public JavaScript.
For a shared public key, proxy requests through your own backend.
