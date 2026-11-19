---
name: frontend-review
description: Review or verify frontend changes for regressions, maintainability, responsive behavior, functionality, performance, and correctness before reporting completion. Use after implementing UI/features or when asked to inspect code quality.
---

# Frontend Review

1. Read the diff and inspect surrounding code; do not review isolated snippets only.
2. Check TypeScript correctness, React state/effect usage, keys, event handlers, cleanup, and stale closures.
3. Check for broken routes/links, buttons with no action, forms without validation/feedback, filters/search that do not change results, and misleading placeholders.
4. Check responsive layouts at narrow mobile, tablet, and desktop widths. Look for overflow, clipped content, awkward wrapping, overlapping fixed UI, and unsafe hover-only interactions.
5. Check animation integration: GSAP/ScrollTrigger cleanup, Lenis lifecycle, no conflicting scroll handlers, no layout-jank, and reduced-motion behavior.
6. Check images: relevant imagery, duplicates, invalid URLs, lazy loading, alt text, dimensions, and licensing/credit caveats.
7. Check accessibility: semantic headings/landmarks, keyboard reachability, visible focus, button labels, color contrast, form labels, and motion preference.
8. Check project-specific content for invented factual claims, dates, prices, ratings, availability, or booking details.
9. Run the available build/test/lint commands. For this repo, at minimum `npm run build`. Do not claim tests ran if no test script exists.
10. Report findings by severity (Critical/High/Medium/Low), with file and line references when possible. Fix issues within scope; otherwise state them clearly.

Do not rewrite the whole project merely to resolve a small issue. Avoid speculative refactors.
