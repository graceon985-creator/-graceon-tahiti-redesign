---
name: ui-ux-pro-max
description: Design, build, refine, and audit polished web UI/UX. Use for visual design, layout, typography, color, responsive behavior, interaction, accessibility, animation, or design-system choices. Inspired by the upstream UI/UX Pro Max skill; this repository contains a project-adapted instruction set, not the upstream searchable datasets/scripts.
---

# UI/UX Pro Max — GRACEON

Use for all visual/interface tasks. Upstream reference: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT; review the upstream repository when full searchable catalogs or scripts are needed).

## Workflow
1. Inspect the current project, routes, components, styles, assets, dependencies, and working interactions before changing anything.
2. Identify the product, audience, device context, and task. For GRACEON Tahiti, use premium destination editorial / immersive island tourism—not generic SaaS dashboard styling.
3. Make a coherent design decision: layout/pattern, color system, type pairing, spacing, imagery, icon system, interaction/motion, and responsive behavior. Explain briefly only if requested.
4. Prefer intentional, distinctive compositions and meaningful content hierarchy over template-like cards, random gradients, oversized empty space, or repeated stock imagery.
5. Reuse existing design tokens and components. Do not create a second theme system or gratuitously restructure code.
6. Use real, relevant photography; avoid duplicate images within adjacent sections and island pages. Never invent factual tourism listings, prices, ratings, dates, or availability.
7. Implement fully: responsive states, hover/focus/active/disabled/loading states, keyboard operation, accessible labels, and meaningful feedback.
8. Check reduced-motion settings. Animation must support orientation or emphasis—not obstruct content.
9. Verify visually at mobile and desktop sizes; run the build and report any failures.

## Baseline quality
- Mobile-first responsive layout; no unintended horizontal overflow.
- Body text comfortably readable (typically 16px); avoid tiny labels.
- Text contrast target WCAG AA (4.5:1 normal text, 3:1 large text).
- Interactive targets aim for 44×44 CSS px; provide keyboard focus.
- Use semantic HTML and SVG/icon libraries already installed; do not use emoji as interface icons.
- Reserve image dimensions/aspect ratios to prevent layout shifts; lazy-load below-fold media.
- Keep motion performant; prefer transform/opacity and avoid animating layout dimensions.
- Honor prefers-reduced-motion.

## GRACEON Tahiti visual direction
- Refined, cinematic, editorial island travel experience with strong typography, immersive but usable photography, and subtle motion.
- The assistant is a secondary side/corner companion, never the main landing-page content.
- Islands and content should feel distinct; avoid repeating the same image or copy pattern excessively.
- Do not claim this concept is official, commissioned, approved, or affiliated with Tahiti Tourisme.


## User-provided reference architecture — secondary pages (IMPORTANT)
The user supplied four reference clips (two standalone MP4s and two clips inside a ZIP). Treat these as the visual/motion architecture for ALL secondary/internal screens—not as a one-off inspiration. Reference set is saved in the user's Library under:
- WhatsApp Video 2026-11-19 at 18.34.05.mp4
- WhatsApp Video 2026-11-19 at 20.32.40.mp4
- WhatsApp Unknown 2026-11-19 at 23.05.00.zip (contains clips 23.04.40 and 23.04.43)

### Reference principles to translate (not copy literally)
- Strong art-directed, dark/editorial mood; layered surfaces and deliberate high-contrast typography, with restrained burgundy/wine, warm cream, metallic/sand accents appropriate to GRACEON.
- Large, confident headings and asymmetrical composition; visual storytelling rather than generic grids or standard template sections.
- Cinematic hero imagery/video and immersive media frames, with sections that reveal through scroll and purposeful transitions.
- Interactive details, animated navigation/menus, image-led cards, subtle depth and smooth motion; keep motion controlled, performant, and accessible.
- Pages should feel like a coherent premium experience with shared design tokens/components, but each content page must have its own art direction and imagery (avoid repetitive clone layouts).
- For secondary pages, use a distinct page opening/hero, clear content hierarchy, editorial content sections, image-led discovery, relevant filters/search where required, details and CTA, and a deliberate transition/exit/navigation path. Avoid a plain list of cards as the whole page.
- Translate reference architecture into the destination context: islands, activities, accommodation, restaurants, practical info, map, events, offers, itinerary, and island detail. Do not copy reference brand names, assets, text, or unrelated subject matter.
- Do not force the homepage/gallery into this same internal-page template. This reference system is specifically for secondary pages and their internal content experiences.
- Before implementing any secondary page, inspect the saved references and current page/components; then design the page using this architecture. Confirm visual differences across desktop/mobile and test actual transitions and controls.
