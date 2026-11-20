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


## GitHub Copilot skills

Project-specific agent skills live in `.github/skills/` and are automatically available to supported GitHub Copilot surfaces when relevant:

- `ui-ux-pro-max` — visual design, layout, interaction, motion, responsive and accessibility basics (project-adapted instructions; upstream full catalog/scripts are not bundled). Upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- `graceon-project` — project architecture, design/content requirements, and delivery constraints.
- `frontend-review` — regression, responsive, functional, performance and build review.
- `accessibility-check` — accessibility-specific audits and fixes.

Always-on repo guidance: `.github/copilot-instructions.md`.


## Prototype feature boundaries
- **GRACEON Guide:** multilingual, rule-based demo replies; it is not connected to a live generative AI model.
- **Community:** posts, profile details, and hidden/reported posts are stored in the visitor's browser only. They are not shared with other visitors, backed by a server, or moderated. Treat this as a UI prototype, not a live community.
- **My Journey, passport, notes, and saved items:** browser-local demo data; it does not sync across devices or accounts.
- **Check-ins:** browser-side prototype only; geolocation can be used to support the demo, but check-ins are not server-verified.
- **Maps, accommodation, and activity links:** verify current conditions, availability, prices, schedules, access and operator details directly with official/local providers before travel.
