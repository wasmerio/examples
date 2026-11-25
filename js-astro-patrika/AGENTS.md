# AGENTS.md

## Project

Patrika is a notebook-inspired personal publishing theme built with Astro.

It is not a blog theme.

The design draws inspiration from:
- commonplace books
- field notebooks
- literary journals
- printed magazines
- index cards
- marginalia

The goal is to create a calm reading experience where typography and whitespace take precedence over decoration.

---

# Principles

## Content First

Content is the product.
Components exist only to present content.
Never introduce UI that competes with the writing.

---

## Editorial, not Application

Patrika should feel edited rather than engineered.
Avoid dashboards, cards with heavy chrome, widgets, badges, statistics or application-like interfaces.
Prefer layouts inspired by books and magazines.

---

## Quiet Interfaces

Every element should justify its existence.
When uncertain, remove rather than add.
Whitespace is a design element.

---

## Typography is Layout

Hierarchy should primarily come from:

- typography
- spacing
- rhythm
- alignment

Avoid relying on borders, shadows or colors to create structure.

---

## Components are Editorial Primitives

Components represent publishing concepts.

Good:

- Section
- SectionHeader
- LeadEntry
- EntryList
- EntryListItem
- NotesGrid
- NoteCard
- ImageFigure
- Callout

Avoid:

- HeroCard
- FancyPost
- FeatureWidget
- ContentBox

---

# Architecture

Pages compose sections.

Sections compose editorial components.

Editorial components render content.

Utilities format data.

Example:

Page
 └── Section
      ├── LeadEntry
      └── EntryList
            └── EntryListItem

Keep responsibilities small.

---

# Content Collections

Collections represent content types.

Examples:

- posts
- notes
- pages

Collections should never know about presentation.

Presentation belongs to components.

---

# Styling

Use Tailwind utilities.

Prefer composition over custom CSS.

Avoid deeply nested selectors.

Avoid utility duplication by extracting reusable components rather than creating utility classes.

---

# Layout

Desktop layouts should prefer CSS Grid.

Grid expresses editorial layouts better than Flexbox.

Use Flexbox for alignment inside components.

Examples:

✓ image + content
✓ metadata + title
✓ note cards

---

# Responsiveness

Mobile is the default.

Desktop enhances the composition.

Never maintain separate desktop and mobile markup.

Prefer CSS Grid that naturally collapses into a single column.

---

# Naming

Use nouns.

Good:

LeadEntry
EntryList
Section
NoteCard

Avoid names describing location.

Avoid:

HomepageHero
HomePost
SidebarCard

Components should describe what they are, not where they are used.

---

# Metadata

Metadata is secondary.

Dates, categories and reading time should never visually compete with titles.

Metadata should use:

- mono typography
- uppercase
- smaller size
- muted colors

---

# Images

Images support the writing.

They should never dominate the page.

Avoid decorative imagery.

Respect original aspect ratios whenever practical.

---

# Motion

Minimal.

Prefer:

- opacity
- underline
- subtle background change

Avoid:

- scale
- bounce
- dramatic transitions
- parallax

---

# Accessibility

Use semantic HTML.

Prefer:

header
section
article
nav
figure
figcaption
time

Maintain proper heading hierarchy.

Do not sacrifice semantics for styling.

---

# Performance

Static first.

Avoid client-side JavaScript unless interaction genuinely requires it.

Prefer Astro islands over hydrated applications.

Every hydrated component should have a clear justification.

---

# Code Style

Prefer readable code over clever code.

Extract components when duplication represents a reusable editorial pattern.

Avoid premature abstraction.

Small duplication is acceptable.

Complex abstraction is not.

---

# Decision Rule

When making implementation decisions ask:

1. Does this improve reading?
2. Does this simplify the code?
3. Does this preserve editorial aesthetics?
4. Would this exist in a printed notebook?

If the answer to any is "no", reconsider the implementation.

## Current Implementation

Reference for what's actually wired up, since it's gone well past a default
Astro scaffold:

- **Content collections**: `posts`, `notes`, `pages`, plus `siteConfig`
  (config-as-content via the `file()` loader). Schemas live in
  [content.config.ts](src/content.config.ts).
- **Config**: defaults in [site.config.ts](src/site.config.ts), overridden by
  [config.yaml](src/content/siteConfig/config.yaml), merged by `getConfig()`
  in [utils/config.ts](src/utils/config.ts). Always go through `getConfig()`
  — never import `site.config.ts` directly.
- **Markdown pipeline**: [Sätteri](https://www.npmjs.com/package/satteri)
  (`@astrojs/markdown-satteri`), not remark/unified. Custom plugins live in
  [src/plugins/](src/plugins/) (`satteri.ts`, `satteri-gallery.ts`) and are
  wired in [astro.config.mjs](astro.config.mjs). Supported Obsidian-flavored
  syntax: wikilinks and image embeds (native to Sätteri), `%%comments%%` and
  `==highlights==` (custom plugin), `:::aside`/`:::annotation` directives,
  inline image galleries with a lightbox (GLightbox), and note backlinks
  (`buildBacklinkMap()` in [utils/content.ts](src/utils/content.ts)).
- **Browse system**: a generic, `meta`-driven browsing index at `/browse`,
  configured entirely from `config.yaml`'s `browse` key — it has no
  hardcoded knowledge of what metadata keys mean. See
  [src/pages/browse/](src/pages/browse/).
- **Search**: [Pagefind](https://pagefind.app), wired via its native
  Component UI (`@pagefind/component-ui` custom elements), not the
  `astro-pagefind` package. The index is built post-`astro build` (see the
  `build` script in `package.json`) and a copy is checked into
  `public/pagefind/` so `astro dev` has working search without a build step.
- **RSS/sitemap**: `@astrojs/rss` and `@astrojs/sitemap` are wired up; both
  depend on `site` in `astro.config.mjs` being a real domain.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
