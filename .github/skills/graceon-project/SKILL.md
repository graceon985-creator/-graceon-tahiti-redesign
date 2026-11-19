---
name: graceon-project
description: Repository-specific context, architecture, product requirements, and delivery rules for the GRACEON TahitiTourisme redesign. Use whenever working on this project.
---

# GRACEON Tahiti redesign

## Project and goal
Independent GRACEON concept redesign of TahitiTourisme.PF. Treat it as a high-quality portfolio/proposal demo—not an official or endorsed project.

## Current stack (inspect package.json before assuming)
- React 18 + TypeScript + Vite
- GSAP / @gsap/react / ScrollTrigger
- Lenis smooth scrolling
- Lucide React icons
- Leaflet + React Leaflet
- React Bits-inspired interactions implemented locally where noted

Do not replace or remove these libraries or change the stack without a clear reason and user approval.

## Content expectations
- Explore all eight islands represented in the concept: Tahiti, Moorea, Bora Bora, Huahine, Raiatea, Taha’a, Rangiroa, Fakarava.
- Provide useful visitor content beyond hero text: island information, getting around, local culture, visitor services, trip planning, accommodations, activities, food, and map features where the project scope supports them.
- Keep listings and travel details honest. Never fabricate businesses, booking links, prices, ratings, hours, event dates, or real-time availability. Mark concept/sample content clearly.
- Prefer authoritative destination/operator sources; verify facts and dates and record source links when practical.
- Avoid using the same photography repeatedly. Match imagery to each island and section, ensure URLs work, and include licensing/credit notes before commercial/public use.

## UI requirements
- Gallery-like opening view with an obvious Search action.
- Smart hide/reveal navigation: hide while scrolling down; reappear on scroll-up before reaching the top.
- GRACEON AI stays in a corner/side position as a complementary helper.
- Build browseable interfaces for accommodations, activities, restaurants, map, and trip planning as well as the assistant; do not make AI the only way to explore.
- Keep functionality wired. No inert buttons, fake search, decorative-only filters, or placeholder links disguised as real actions.

## Development discipline
1. Read the relevant files and map existing behavior before edits.
2. Make focused changes and preserve working features.
3. Use the existing component and styling patterns unless the task requires a better, justified approach.
4. Run `npm run build` after changes; check types and build output.
5. Inspect deployment workflow and latest GitHub Actions status when deployment is relevant. Do not say deployed unless confirmed.
6. In summaries, state exactly what changed, files touched, build/test result, and any remaining limitation.
