# VibeDate

A budget-aware date planner for Bhopal — React + Vite single-page app, deployable to GitHub Pages.

**Features:** budget slider that drives venue/menu/gift suggestions · 9 Bhopal venues by vibe with menus · live cost calculator
with budget meter and over-budget warning · gift suggester · itinerary builder · outfit coordinator · message writer (4 tones) ·
conversation deck · AI Wingman chat (built-in answers, optional Gemini).

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

All venues, menus, gifts, outfits, cards and message templates live in `src/data.js`. They are **illustrative sample data** — confirm
real menus and prices with each venue.

## Customising

- **Gift links:** in `src/data.js`, add entries to `GIFT_LINKS` (gift id → your full `https://` link). That gift's card then shows a
  **Buy** button opening your link; gifts without one show **Find online** (a web search).
- **Venue photos:** drop `<venue-id>.jpg` (or png/webp) into `src/assets/venues/` — see the README there for the id list.
- **Google Maps:** venues link to a Google Maps search automatically. For an exact pin, add `mapsUrl: 'https://maps.app.goo.gl/…'` to the venue.
- **Logo:** `public/logo.png` (navbar/footer), `public/favicon.png`, `public/apple-touch-icon.png`.

## AI Wingman / Gemini

The Wingman works out of the box with built-in answers. For live answers, open the chat → gear icon → paste a Gemini API key
(`src/services/ai.js`). The key is kept in the visitor's own browser (localStorage) and sent only to Google.
For local development you may instead set `VITE_GEMINI_API_KEY` in `.env` (see `.env.example`).
**Never set the key as a build-time secret for the deployed site** — Vite would embed it in the public JavaScript.
For a shared public key, proxy requests through your own backend.
