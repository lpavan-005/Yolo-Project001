# Manali, in Full — Project Context

## What this is
A 2-day local-depth Manali itinerary, built as an installable PWA (Vite + React + TypeScript). Built for Pavan's trip in late July 2026, immediately preceding a Hampta Pass trek. The goal throughout has been "experience Manali, don't just visit it" — iconic stops plus real local depth (food, culture, history), with honest caveats where something is mixed-quality or has a lookalike scam risk.

## Stack
- Vite + React 18 + TypeScript
- Leaflet (not react-leaflet) for the map, Carto Voyager tiles
- vite-plugin-pwa + Workbox for installability and caching
- No Tailwind — hand-written CSS using design tokens (see Design System below)
- Fonts: Fraunces (display/serif) + Inter (body), loaded via Google Fonts in `src/styles/global.css`

## Project structure
```
src/
  data/places.ts          ← ALL content lives here. 32 places, typed.
  components/
    MapCanvas.tsx          ← Leaflet wrapper, custom pins, route polylines
    BottomSheet.tsx         ← Mobile drag-resize sheet (peek/half/full snap points)
    PlaceDetail.tsx          ← Detail card content (photo, notes, maps link)
    PlaceList.tsx            ← Searchable, grouped list (drawer/sidebar content)
    FilterChips.tsx           ← Category filter pills
    SmartImage.tsx             ← 3-tier image fallback (see below)
    Timeline.tsx                ← Day 1 / Day 2 vertical timeline view
  icons/index.tsx            ← Hand-written inline SVG icons, no icon library dependency
  styles/
    global.css               ← Design tokens (CSS vars), font imports, Leaflet overrides
    components.css            ← All component styles
  App.tsx                      ← Orchestrates mobile layout (drawer+sheet) vs desktop layout (sidebar+floating card), breakpoint at 880px
```

## Design system — "Deodar Forest"
Deliberately NOT the cream-and-terracotta AI-default look. Direction is grounded in actual Manali materials: cedar wood, deodar forest, glacial river, prayer flags, sulphur hot springs.

- `--paper: #FAFAF7` — base surface (not cream)
- `--forest-deep: #1F2A24` / `--forest: #2A3A32` — deep forest, used sparingly
- `--beas: #5687A8` — glacial river blue (Day 1 accent)
- `--amber: #D4933A` — prayer-flag amber (Day 2 accent)
- `--copper: #A85432` — hot-spring sandstone (Food accent)
- `--moss: #4A6B5A` — old stone moss (Deep Cuts accent)
- Display type: Fraunces, body: Inter, numbers: tabular mono for timestamps

Category colors are defined once in `CATEGORY_META` in `places.ts` — change them there, not per-component.

## The SmartImage fallback system (important — don't regress this)
Google Place photo URLs (`lh3.googleusercontent.com/place-photos/...`) are undocumented and can rate-limit or fail unpredictably. Every image in this app goes through `SmartImage.tsx`, which tries, in order:
1. The Google photo URL (`place.photo`)
2. A curated Unsplash atmospheric photo (`place.fallbackPhoto`) — assigned per-category in `places.ts`
3. A category-colored stamp panel (always works, pure CSS)

If you add a new place, **always provide a `fallbackPhoto`** — pull from Unsplash, free, no API key needed, just a stable URL.

## How to add a new place
Edit `src/data/places.ts`, add an object to the `PLACES` array matching the `Place` interface. Required: `id` (unique slug), `cat` (`day1`/`day2`/`food`/`deep`), `name`, `lat`, `lng`, `photo` (or `null`), `fallbackPhoto`, `note`, `maps` (Google Maps link). `day1`/`day2` entries also need `order` (for route line sequencing and timeline numbering). `food`/`deep` entries use `sub` instead of `time` typically (e.g. "Breakfast", "Coffee", "Local institution").

## Tone of the `note` copy
Written in second-person-adjacent, specific, with honest caveats baked in where relevant (e.g. Khyber Restaurant's mixed recent reviews, the Himalayan Trout Farm's flood damage, the Asli Himcoop lookalike-shop warning). Don't sand down honest caveats when editing — they were deliberately researched and included.

## Deployment
- GitHub repo: connected, pushes to `main` auto-deploy via Vercel
- Workflow: edit → `npm run dev` to preview locally → `git add . && git commit -m "..." && git push` → Vercel rebuilds automatically (~60-90s)
- Vercel keeps every past deployment — rollback via Vercel dashboard → Deployments → "Promote to Production" on any older one

## Testing approach used when building
Every change was verified with a real headless-browser pass (Playwright) on both mobile (390×844) and desktop (1280×800) viewports before being called done — checked: pins render, drawer/sheet open-close, filters work, images actually load (not just "should work"), zero console errors. Worth holding to this bar for anything nontrivial — `npm run build` at minimum should always pass clean before considering a change finished.

## Things deliberately decided against
- No Tailwind (kept hand-written CSS for full control over the non-default design direction)
- No full offline map-tile caching (added later if needed — current PWA caches tiles/photos/fonts via Workbox runtime caching, but doesn't pre-download the whole region)
- No backend/database — all content is static in `places.ts`, rebuilt and redeployed on every change
