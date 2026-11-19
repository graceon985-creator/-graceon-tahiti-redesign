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
