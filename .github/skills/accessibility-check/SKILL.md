---
name: accessibility-check
description: Audit and improve frontend accessibility, especially keyboard navigation, semantics, contrast, touch targets, forms, responsive text, and reduced motion. Use for accessibility requests and as a quality check on UI changes.
---

# Accessibility check

- Prefer semantic elements (`button`, `a`, `nav`, `main`, headings, lists) over clickable generic containers.
- Every interactive control needs a meaningful accessible name; icon-only buttons need aria-label/title.
- Ensure keyboard access and visible focus indicators; never remove outlines without a replacement.
- Use correct heading order and landmark structure; keep alt text meaningful and use empty alt for decorative images.
- Form controls require visible labels, clear validation, and nearby error/help messages.
- Meet WCAG AA contrast where feasible: 4.5:1 for normal text, 3:1 for large text/UI components.
- Target size about 44×44 CSS pixels for touch controls, with adequate spacing.
- Do not rely on hover alone, color alone, or motion alone to convey information.
- Support zoom/reflow without horizontal scrolling for ordinary content; do not disable zoom.
- Honor prefers-reduced-motion and provide non-motion alternatives for animated effects.
- After fixes, verify affected behavior and run the project build; list any issues that cannot be tested automatically.
