# GRACEON — Islands of Tahiti Redesign Concept

An independent, responsive React concept for exploring the islands of Tahiti.

## Stack
- React + Vite + TypeScript
- GSAP + ScrollTrigger via `@gsap/react`
- Lenis smooth scrolling (native wheel/keyboard scrolling retained)
- React Bits-inspired SpotlightCard pointer interaction (locally implemented in `src/SpotlightCard.tsx`)

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Notes
- This is an independent concept, not commissioned, approved or endorsed by Tahiti Tourisme.
- Destination descriptions are original summaries based on publicly available destination information. Verify all travel logistics and event dates with official sources before travel.
- Photography currently uses Unsplash image URLs as visual placeholders; replace with Tahiti Tourisme-approved/licensed destination photography and add image credits before any public/commercial presentation.
- No live booking, event feed, map API or Apidae integration is claimed.
- Footer credits GRACEON Digital Studio as the concept designer/developer; it does not imply legal registration or client affiliation.


## Server-backed island check-ins (next-stage foundation)

A Supabase Edge Function, database migration, and setup guide are included under `supabase/` and `docs/server-verified-checkins.md`. The public GitHub Pages experience still uses device-local prototype check-ins until a Supabase project, authentication, database migration, and function deployment are configured. Do not describe the current browser-only check-ins as fraud-proof or server-verified.
