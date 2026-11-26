---
name: page-content-authoring
description: Use when assembling a page from components that already exist — writing or editing the `pageSections` array in a `src/content/pages/*.md` file, choosing which section to use for a content need, or looking up what page sections and building blocks the library ships. The catalog of every component and its props lives here.
---

# Page content authoring

Build a page by listing existing components in the `pageSections` frontmatter of a Markdown file under `src/content/pages/`. No `.astro` or CSS is written — each entry names a component by its `_component` path and sets its props. This skill owns the [component catalog](component-catalog.md): what sections and building blocks exist, and when to use each.

## When to use

- Creating a new page or editing an existing one under `src/content/pages/`.
- Populating or reordering the `pageSections` array.
- Deciding which shipped section fits a content need (hero, stats, features, cards, CTA, FAQ).
- Looking up a component's `_component` path or its content props.

## When not to use

| Situation                                           | Go instead to                                                  |
| --------------------------------------------------- | -------------------------------------------------------------- |
| No existing section fits — you must build a new one | [create-component](../create-component/SKILL.md)               |
| Recreating a section from a screenshot / mockup     | [screenshot-to-component](../screenshot-to-component/SKILL.md) |
| Writing a documentation page (`.mdx` body content)  | [docs-content-authoring](../docs-content-authoring/SKILL.md)   |
| Editing header, sidebar order, footer, or SEO data  | [site-data-navigation](../site-data-navigation/SKILL.md)       |

## Contents

| File                                         | Covers                                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| [component-catalog.md](component-catalog.md) | Every page section and building block: `_component` path, when to use, key props |

## Where page content lives

Pages are Markdown files under `src/content/pages/`. The file's path becomes the URL; almost all content lives in frontmatter, not the body.

| File path                          | URL        |
| ---------------------------------- | ---------- |
| `src/content/pages/index.md`       | `/`        |
| `src/content/pages/<name>.md`      | `/<name>/` |
| `src/content/pages/<dir>/index.md` | `/<dir>/`  |

Only `index.md` ships; the other rows show where a new page would go.

**Both collections mount at the site root.** `src/pages/[...slug].astro` serves `pages` and `docs` from the same route, and a slug claimed by both is a build error naming the two files — not a coin toss. Documentation pages live in `src/content/docs/`; see [docs-content-authoring](../docs-content-authoring/SKILL.md).

A `pages` entry renders inside the documentation shell (header, sidebar, footer) with the on-this-page rail dropped, so a landing page sits in the same chrome as the docs rather than in a separate site.

The `pages` collection schema is defined in `src/content.config.ts`:

| Field          | Type     | Required | Purpose                            |
| -------------- | -------- | -------- | ---------------------------------- |
| `title`        | string   | yes      | Page title (feeds `<title>` / SEO) |
| `pageSections` | array    | yes      | Ordered section blocks to render   |
| `description`  | string   | no       | Meta description                   |
| `keywords`     | string[] | no       | Meta keywords                      |
| `image`        | string   | no       | OG image path                      |
| `canonical`    | string   | no       | Canonical URL override             |

`_schema: default` appears at the top of shipped pages — it is a CloudCannon editor key, not part of the Astro schema (the Zod schema ignores unknown keys). Keep it for editor compatibility.

## The `pageSections` array

Each item is one section. **MUST:** every item has a `_component` key set to the component's kebab-case directory path under `src/components/` (e.g. `page-sections/heroes/hero-center`). Remaining keys are the component's **camelCase** props, matching the `.astro` destructure exactly. Nested content (buttons, form fields, repeating items) is itself an array of `_component` blocks.

Working example (trimmed from `src/content/pages/index.md`):

```yaml
---
_schema: default
title: Home
description: One-line meta description.
pageSections:
  - _component: page-sections/heroes/hero-center
    eyebrow:
    heading: The headline for the page
    subtext: >-
      Supporting paragraph. Use a >- block scalar for multi-line text.
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Get started
        link: /start/
        variant: primary
        size: md
    colorScheme: inherit
    backgroundColor: base
  - _component: page-sections/explainers/stats
    heading: Numbers that hold up
    stats:
      - number: 0
        suffix: KB
        label: Runtime JS
        sublabel: On most sections
    dividers: true
    colorScheme: inherit
    backgroundColor: surface
  - _component: page-sections/collections/card-collection
    eyebrow: Principles
    heading: Built for real-world web projects
    subtext: No trends. No noise. Just reliability.
    items:
      - link: /introduction/
        contentSections:
          - _component: building-blocks/core-elements/heading
            text: Web fundamentals
            level: h3
            size: xs
          - _component: building-blocks/core-elements/simple-text
            text: Semantic HTML. Lean CSS. JavaScript only when needed.
    colorScheme: inherit
    backgroundColor: surface
  - _component: page-sections/conversion/cta-split
    heading: Ready to start building?
    subtext: Start with the installation guide.
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Read the introduction
        link: /introduction/
        variant: primary
        size: md
    colorScheme: dark
    backgroundColor: surface
---
```

### Standard section props (every page section)

Every page section wraps `CustomSection` and accepts the same shell props on top of its content props: `sectionLabel`, `maxContentWidth`, `paddingHorizontal`, `paddingVertical`, `colorScheme`, `backgroundColor`, `background`. Their option values and behavior are documented once in [create-component's component-templates.md](../create-component/component-templates.md#standard-props-every-component) — do not guess them. The catalog lists only each section's **content** props.

In short: `colorScheme` sets the section's theme; `backgroundColor` paints its background from the active theme. Option values live in the create-component reference above; what the color tokens resolve to is owned by the [theming skill](../theming/SKILL.md).

## Pick a section for a content need

| Content need                         | Section (`_component`)                      |
| ------------------------------------ | ------------------------------------------- |
| Page intro / banner                  | `page-sections/heroes/hero-center`          |
| A row of headline numbers            | `page-sections/explainers/stats`            |
| An ordered walkthrough               | `page-sections/explainers/steps-section`    |
| Cards linking into the documentation | `page-sections/collections/card-collection` |
| Questions and answers                | `page-sections/explainers/faq-section`      |
| Closing call to action               | `page-sections/conversion/cta-split`        |
| Anything else — free composition     | `page-sections/builders/custom-section`     |

`hero-center`, `stats` and `card-collection` all take `alignmentHorizontal` — set it to `start` for a documentation landing page, where centered headings read as marketing.

Three options worth knowing when building a landing page:

- **`backgroundColor: inverse`** — a band that is dark on a light page and light on a dark one. Text and buttons inside it flip with it. Good for a closing call to action; bad for anything long.
- **`hero-center`'s `heading`** — inline markdown, so accent words are marked up in place: wrap them in `<span class="highlight">…</span>`. That is the same span CloudCannon's Styles menu inserts, so a hand-authored heading and an editor-authored one are identical.
- **`content-selector`'s `variant: panel`** (with `navigationPosition: top`) — frames the tabs and their content in one bordered box with a compact strip of labels. It is how the overview page demos the shipped components: each panel holds the real thing, not a screenshot.

A **Command Line** block (`building-blocks/core-elements/command-line`) can sit in any `buttonSections` row, so a hero's primary button can be followed by the install command.

See [component-catalog.md](component-catalog.md) for each section's props and the full building-block list.

## Spacing

Four layers, one job each:

- **Band** — space inside a section: `paddingVertical` / `paddingHorizontal` on the section. Never use it to fix a gap _between_ blocks.
- **Flow** — space between sibling blocks is automatic: each block type carries a default (`heading` loose, `text`/`simple-text` tight, `grid`/`card-grid`/`masonry` loose, everything else default). Do not add a Spacer by default.
- **Spacer** — REPLACES the flow gap: its `size` is the whole gap. Never use it to pad a first child (first children get no flow space).

Per-block override: `spaceBefore: none | tight | default | loose` — the four roles, never raw `--spacing-*` values. Overlaps are a component's design, never a `spaceBefore` value.

**`spaceBefore: default` is not a middle value.** It means "leave this block's own type default in charge" — so on a block that declares `loose` (Grid, Card Grid, Masonry, any heading) it _is_ 48px. The reachable overrides are `none`, `tight` and `loose`. For an exact gap the system's answer is a **Spacer**, which replaces the gap either side of it rather than adding to one; `src/content/pages/index.md` uses one to sit a panel label 16px above its grid.

## Placeholder images

**MUST:** use `/src/assets/images/placeholder.jpg` for any image without real artwork yet.
**Why:** it is the one committed placeholder asset; a path that does not exist breaks the image import at build time. Image paths use the `/src/assets/images/...` form.

## YAML rules that bite

- Use `>-` block scalar for multi-line text (strips the trailing newline).
- Empty array: `buttonSections: []`. Empty string: `eyebrow: ''` or `eyebrow:`.
- Booleans are unquoted `true` / `false`.
- Every nested item under an array prop needs its own `_component`.

## Section not rendering

The dev-server console logs `Component not found: <_component>. Available components: [...]`. Almost always a `_component` path typo — compare yours against the printed list. Full debugging playbook: [debug-cloudcannon](../debug-cloudcannon/SKILL.md).

## Verify your work

| Command                       | What to look for                                                        |
| ----------------------------- | ----------------------------------------------------------------------- |
| `npm run check`               | Exit 0 — schema validates, no lint/type errors.                         |
| `npm run dev`                 | The page renders; no "Component not found" console warning.             |
| `npm run dev` + Visual Editor | Sections appear and field edits live-update in the CloudCannon preview. |
