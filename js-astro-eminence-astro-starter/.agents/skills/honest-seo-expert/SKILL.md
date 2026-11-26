---
name: honest-seo-expert
description: >-
  Implements honest, integrity-first SEO for Astro sites using eminence-astro-suite
  Head/Layout props and schema-dts JSON-LD. Fixes metadata and page content without
  keyword stuffing. Use for SEO, meta tags, structured data, canonical, Open Graph,
  hreflang, or image alt text.
disable-model-invocation: true
---

# Honest SEO Expert

## Core values

**Honesty, transparency, and integrity** are non-negotiable:

- Titles and descriptions must accurately describe page content.
- Structured data must reflect what users actually see — no fabricated ratings, prices, or reviews.
- No hidden text, cloaking, or misleading redirects.
- No keyword stuffing in titles, body copy, or alt text.

## Default mode

**Fix/implement by default.** Stop after diagnose/prioritize only if the user says **audit only** or **report only**.

## Workflow

```
Task Progress:
- [ ] 1. Scope — page(s); read layout, content, and integration config
- [ ] 2. Diagnose — metadata gaps, schema mismatches, i18n holes, weak content structure
- [ ] 3. Prioritize — user-visible accuracy first, then discoverability
- [ ] 4. Implement — Head/Layout props, JsonLd, page content, Paraglide messages
- [ ] 5. Verify — pnpm build (eminence warnings), astro check
- [ ] 6. Summarize — what changed and integrity checks passed
```

## Mandatory reads (before head/metadata changes)

1. [eminence-astro-suite SKILL](../eminence-astro-suite/SKILL.md) — integration first, components second.
2. [eminence-astro-suite usage](../eminence-astro-suite/usage/SKILL.md) — `Head` props, `false` suppression, fallback rules.
3. Relevant component docs under [eminence-astro-suite/components/](../eminence-astro-suite/components/) — read at least `head.md`, `json-ld.md`, and any prop you touch.
4. [json-ld-with-schema-dts.md](../eminence-astro-suite/guides/json-ld-with-schema-dts.md) — typed JSON-LD pattern.

## How metadata flows in this project

```
Page (e.g. index.astro)
  → DefaultLayout title={m.page_title()} description={m.page_description()}
    → BaseLayout {...HeadProps}
      → <Head {...Astro.props}> from eminence-astro-suite
```

- **Never** hand-write `<meta>`, `<link rel="canonical">`, or Open Graph tags.
- **Always** pass metadata through `DefaultLayout` / `BaseLayout` props (which extend `HeadProps`).
- Site-wide defaults belong in `eminence()` integration `headTags` in `astro.config.mjs`, not repeated per page.
- `title` and `description` are **required** on every page — source from Paraglide `m.*()` functions.

## Structured data

- Use `schema-dts` types (`WithContext<T>`, specific `@type` interfaces).
- Render via `jsonLd` prop on `Head` / layout, or `<JsonLd jsonLd={schema} />` in the head slot.
- One `JsonLd` block per page; combine entities with `@graph` when needed.
- Values must match visible page content (headline, dates, prices, author names).
- Generate from real page data — do not hardcode drifting values.

## i18n

- Visible strings: Paraglide `m.*()` in `messages/es.json` (base) + `messages/en.json`.
- `languageAlternates` on `Head` for hreflang — map each locale to its localized URL via `localizeHref`.
- `html lang` is set by `getLocale()` in `BaseLayout.astro` — do not override manually.

## Image alt text

For every `<img>`, `<Image>`, or decorative image:

- **Honest alt**: describe what the image actually shows, for UX and accessibility.
- **Never SEO-keyword alt**: do not stuff location names, product keywords, or synonyms into alt text.
- **Decorative images**: use `alt=""` (empty), not omitted alt.
- **Functional images** (icons with meaning): alt describes the action or meaning, not "icon".

## Page content (when metadata is not enough)

Improve in the page body when needed:

- Single clear `<h1>` per page matching the title intent.
- Logical heading hierarchy (`h2` → `h3`, no skips for styling).
- Descriptive link text (not "click here").
- Sufficient visible copy for what JSON-LD claims.

## Does NOT do

- Keyword density tuning, link schemes, or paid-backlink tactics.
- Fake `AggregateRating`, `Review`, or `Offer` schema without real data.
- `apple-mobile-web-app-*`, `twitter:` tags, or other [unsupported tags](../eminence-astro-suite/policies/unsupported-tags.md).
- Performance optimization (→ performance-expert).
- Visual redesign (→ conversion-designer).

## Output format

1. **Page intent** — what the page is honestly about
2. **Metadata changes** — props added/changed on layout
3. **JSON-LD** — `@type`(s) chosen and why they match visible content
4. **Content changes** — headings, copy, alts (with before/after intent)
5. **Integrity checklist** — confirm no misleading or fabricated data

## Additional resources

- Allowed vs forbidden patterns: [integrity-rules.md](./integrity-rules.md)
