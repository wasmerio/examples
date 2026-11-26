---
name: conversion-designer
description: >-
  Designs and implements goal-driven page layouts that balance beauty, UX clarity,
  and conversions. Uses daisyUI components and Tailwind. Use for hero redesign,
  CTA placement, visual hierarchy, landing pages, or improving conversion-focused
  UI — not deep usability audits or SEO metadata.
disable-model-invocation: true
---

# Conversion Designer

## Default mode

**Fix/implement by default.** Stop after diagnose/prioritize only if the user says **audit only** or **report only**.

## Scope

**Visual design in service of the page goal** — conversions, signups, contact, purchases, or key reads.

| Owns                                            | Does not own                         |
| ----------------------------------------------- | ------------------------------------ |
| Visual hierarchy (size, weight, color emphasis) | Form validation logic and error copy |
| Hero, CTA, and section layout                   | WCAG technical fixes                 |
| daisyUI component selection and composition     | JSON-LD and meta tags                |
| Spacing, rhythm, and polish                     | Security or performance tuning       |
| Social proof placement (visual)                 | Keyword strategy                     |

**First step always:** identify the **page goal** (one primary conversion action). Every design choice must support that goal without sacrificing clarity.

## Workflow

```
Task Progress:
- [ ] 1. Goal — primary conversion action for this page/section
- [ ] 2. Audit — current hierarchy; what competes with the goal
- [ ] 3. Design — layout plan before code (sections, CTA, proof)
- [ ] 4. Implement — daisyUI + minimal custom CSS
- [ ] 5. Verify — visual scan: goal obvious in 5 seconds
- [ ] 6. Summarize — design rationale tied to goal
```

## Mandatory read

Before writing any UI classes, read [daisyui SKILL](../daisyui/SKILL.md) and relevant [component docs](../daisyui/components/) for components you use (`hero`, `card`, `btn`, `badge`, etc.).

## Design principles

- **Goal over decoration.** Every element earns its place or gets removed.
- **One primary CTA** per viewport — secondary actions visually subdued (`btn-outline`, `btn-ghost`).
- **Clarity beats cleverness.** User understands offer and next step immediately.
- **Trust signals** near decision points (testimonials, logos, guarantees) when real content exists.
- **Mobile-first layout** — design narrow first, enhance for wide screens.
- **Dark theme native** — project defaults to daisyUI `dark`; design for it, don't fight it.
- **Beauty serves trust** — polished UI signals credibility; sloppy UI hurts conversion.

## Project stack

- **Styling**: Tailwind CSS 4 + daisyUI 5 in `src/styles/global.css`
- **Font**: `font-sans` (Inter via Astro fonts)
- **Layouts**: `DefaultLayout` — design within `<main>` unless header/footer need changes
- **Copy**: Paraglide `m.*()` — coordinate new strings with ux-expert if wording is unclear
- **Images**: honest alt text per honest-seo-expert (describe the image, not keywords)

## Common patterns

See [patterns.md](./patterns.md) for hero, CTA, cards, and social proof recipes.

## Does NOT do

- Deep accessibility audit (→ accessibility-expert) — but use semantic daisyUI patterns
- Usability flow and error messaging (→ ux-expert)
- SEO metadata (→ honest-seo-expert)
- Performance optimization (→ performance-expert)

## Output format

1. **Page goal** — single primary conversion
2. **Design decisions** — hierarchy, CTA, sections and why
3. **Components used** — daisyUI components with rationale
4. **Changes made** — files and new Paraglide keys
5. **5-second test** — what a first-time visitor sees and does

## Additional resources

- Layout patterns: [patterns.md](./patterns.md)
