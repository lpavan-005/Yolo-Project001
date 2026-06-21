# Manali, in Full

A 2-day local Manali itinerary as an installable mobile-first PWA.

## What's inside
- **32 stops** across Day 1 (temples & Old Manali), Day 2 (Atal Tunnel & Sissu), Food & Drink, and Deep Cuts
- **Interactive map** with category filters, route lines, custom pins
- **Bottom sheet** with three drag-resize snap points (peek / half / full)
- **Timeline view** for day-by-day storytelling
- **Search** across names, notes, and tags
- **Smart images** with three-tier fallback (Google photo → Unsplash atmospheric → category stamp)
- **PWA installable** — add to home screen on phone for an app icon
- **Offline-resilient** — map tiles, photos and fonts cached via Workbox

## Run it locally

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build for production

```bash
npm run build        # output goes to ./dist
npm run preview      # preview the production build
```

## Deploy in 2 minutes

### Option A — Vercel (recommended)
```bash
npm install -g vercel
vercel              # follow prompts, accept all defaults
```
You'll get a URL like `manali-app-xyz.vercel.app`. Open on your phone, tap Share → "Add to Home Screen". Done.

### Option B — Netlify (drag-and-drop, no CLI)
1. Run `npm run build`
2. Open https://app.netlify.com/drop
3. Drag the `dist/` folder onto the page
4. You get a URL instantly

### Option C — Any static host
The `dist/` folder is plain static files — drop it on any host (Cloudflare Pages, GitHub Pages, S3, etc).

## Stack
- Vite + React 18 + TypeScript
- Leaflet (Carto Voyager tiles)
- vite-plugin-pwa + Workbox
- Fraunces (display) + Inter (body)

## Design notes
Direction: **Deodar Forest** — deep forest base, paper white surfaces, glacial Beas blue, prayer-flag amber, copper-rust. Deliberately not the cream-and-terracotta AI default.
