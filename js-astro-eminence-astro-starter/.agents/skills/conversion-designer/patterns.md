# Conversion design patterns (daisyUI)

Read before implementing layout changes.

## Hero (primary landing)

Use daisyUI [hero](../daisyui/components/hero.md) for above-fold goal communication.

Structure:

```
hero (min-h or py-16)
├── hero-content (text-center or text-left)
│   ├── h1 — outcome-focused headline (Paraglide)
│   ├── p — one sentence value prop
│   └── actions — primary btn + optional secondary btn-ghost
└── hero image (optional) — real product/screenshot, honest alt
```

Rules:

- Headline ≤ 10 words when possible.
- Primary CTA uses `btn btn-primary`; one per hero.
- Secondary action: `btn btn-outline` or text link below fold.
- Avoid auto-playing video in hero without user control.

## CTA hierarchy

| Level     | Class                     | Use                                    |
| --------- | ------------------------- | -------------------------------------- |
| Primary   | `btn btn-primary`         | Main conversion (contact, signup, buy) |
| Secondary | `btn btn-outline`         | Learn more, view pricing               |
| Tertiary  | `btn btn-ghost` or `link` | Cancel, skip, minor nav                |

Spacing: `gap-4` between buttons; stack on mobile (`flex-col sm:flex-row`).

## Feature / benefit cards

Use [card](../daisyui/components/card.md) for scannable benefits.

```
grid gap-6 md:grid-cols-3
└── card bg-base-200 (or card-border)
    ├── card-body
    │   ├── h2.card-title — benefit headline
    │   └── p — one short paragraph
```

Max 3–4 cards above fold; rest below or on separate page.

## Social proof

When real testimonials/logos exist:

- Place below hero, above final CTA.
- [avatar](../daisyui/components/avatar.md) + quote for testimonials — real names only.
- Logo row: grayscale optional; honest `alt` with company name.
- Never fabricate reviews for design filler.

## Final CTA band

Repeat primary action before footer:

```
section py-16 text-center
├── h2 — restate value briefly
├── p — remove last objection if possible
└── btn btn-primary btn-lg
```

## Spacing rhythm

- Section padding: `py-12` or `py-16`
- Content width: `container mx-auto px-4` or `max-w-4xl mx-auto`
- Heading margin: `mb-4` after h1/h2; `mb-8` before CTA groups

## Color and emphasis

- Use daisyUI semantic colors: `primary`, `secondary`, `accent`, `base-content`
- One accent color for CTAs — don't rainbow buttons
- `text-base-content/70` for supporting copy
- Check contrast if using custom colors (hand off to accessibility-expert if borderline)

## Mobile conversion

- CTA full-width on small screens: `btn btn-primary w-full sm:w-auto`
- Phone/email links: `tel:` and `mailto:` for tap-to-contact
- Sticky CTA (dock/fab) only if it doesn't cover content — use [fab](../daisyui/components/fab.md) sparingly

## Anti-patterns

- Multiple competing `btn-primary` in one viewport
- Stock photo heroes unrelated to product
- Fake urgency ("Only 2 left!") without real inventory data
- Popups before user reads content
- Carousels for critical message (first slide only seen by many users)

## New page checklist

- [ ] Goal stated in one sentence before coding
- [ ] daisyUI component docs read for chosen components
- [ ] Copy added to `messages/es.json` + `messages/en.json`
- [ ] Primary CTA obvious at mobile and desktop
- [ ] Images have honest alt text
- [ ] Layout wrapped in `DefaultLayout` with proper `title`/`description`
