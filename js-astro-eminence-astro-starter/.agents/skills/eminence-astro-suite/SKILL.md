---
name: eminence-astro-suite
description: >-
  Official Eminence Astro Suite reference for Astro head metadata, SEO tags,
  Open Graph, JSON-LD, favicons, manifest, robots.txt, and sitemap integration.
  Use when editing page metadata, astro.config.mjs eminence() options, or SEO/head
  output — not on every Astro page edit.
disable-model-invocation: true
---

# Eminence Astro Suite

Eminence Astro Suite is an Astro integration plus component library that generates complete metadata for Astro sites in one place:

- metadata tags (`<head>` content), and
- metadata-related files (`manifest.webmanifest`, `robots.txt`, `security.txt`, favicons, `sitemap.xml`).

The workflow is **integration first, components second**. The integration is required because it creates a Vite virtual module (`virtual:eminence-astro-suite/head-tags`) that the components read at render time. That lets you define defaults once and keep metadata behavior consistent across the site.

## When to invoke this skill

- User `@eminence-astro-suite`, attaches this skill, or asks for SEO/head/metadata help.
- Authoring or editing `astro.config.mjs` `eminence()` integration options.
- Adding or changing `Head` / `Layout` props, JSON-LD, canonical, Open Graph, hreflang, icons, manifest, robots, or sitemap config.

Do **not** load automatically on every page or `<head>` edit. Invoke explicitly (Cursor `@eminence-astro-suite`, attach `.agents/skills/eminence-astro-suite/SKILL.md`, or reference from `honest-seo-expert`).

## Mandatory reference

| Task                          | Guide                                            | Note                                                                                                                              |
| ----------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Installing the package        | [./install/SKILL.md](./install/SKILL.md)         | Use only if `eminence-astro-suite` is not already installed in the project.                                                       |
| Using the components          | [./usage/SKILL.md](./usage/SKILL.md)             | MANDATORY. Read this before writing any component code.                                                                           |
| Configuring the integration   | [./config/SKILL.md](./config/SKILL.md)           | MANDATORY. Read this before editing `astro.config.mjs`.                                                                           |
| Integration features overview | [./integration/SKILL.md](./integration/SKILL.md) | MANDATORY before configuring `icons`, `manifest`, `robotsTxt`, `securityTxt`, `sitemap`, or `headTags`.                           |
| Per-component docs            | [./components/](./components/)                   | MANDATORY. Read the matching component doc before using it. Always read multiple candidate docs before deciding which one to use. |
| Policies (what we exclude)    | [./policies/](./policies/)                       | MANDATORY before reaching for any tag or output file not listed in this skill.                                                    |
| Recommendations               | [./recommendations/](./recommendations/)         | Use to decide whether to add an optional output (manifest, humans.txt, robots.txt, security.txt).                                 |
| Guides                        | [./guides/](./guides/)                           | Pattern recipes (e.g. JSON-LD with `schema-dts`).                                                                                 |

## List of components

All components are imported from `eminence-astro-suite/components`. The integration (default export of `eminence-astro-suite`) is imported separately and configured in `astro.config.mjs`.

Primary entry points:

- [Head](./components/head.md) — MANDATORY default choice for almost every page.
- [Layout](./components/layout.md) — full `<html>`/`<body>` shell with named slots.

Tags managed by `Head`:

- [AppleItunesApp](./components/apple-itunes-app.md)
- [Base](./components/base.md)
- [Canonical](./components/canonical.md)
- [Charset](./components/charset.md)
- [ColorScheme](./components/color-scheme.md)
- [Description](./components/description.md)
- [Extend](./components/extend.md)
- [Generator](./components/generator.md)
- [HumansTxt](./components/humans-txt.md)
- [Icons](./components/icons.md)
- [JsonLd](./components/json-ld.md)
- [LanguageAlternates](./components/language-alternates.md)
- [Manifest](./components/manifest.md)
- [OpenGraph](./components/open-graph.md)
- [Robots](./components/robots.md)
- [ThemeColor](./components/theme-color.md)
- [Title](./components/title.md)
- [Verification](./components/verification.md)
- [Viewport](./components/viewport.md)

## List of integration features

All integration features are configured through the single options object passed to `eminence()` in `astro.config.mjs`. See [./integration/SKILL.md](./integration/SKILL.md) for the overview.

- [headTags](./integration/head-tags.md) — Global defaults distributed to components via the Vite virtual module.
- [icons](./integration/icons.md) — Build-time favicon and app icon generation.
- [manifest](./integration/manifest.md) — `manifest.webmanifest` generation.
- [robotsTxt](./integration/robots-txt.md) — `robots.txt` generation.
- [securityTxt](./integration/security-txt.md) — `.well-known/security.txt` generation (RFC 9116).
- [sitemap](./integration/sitemap.md) — Wraps `@astrojs/sitemap`.
- [humansTxt validation](./integration/humans-txt.md) — Validation + link tag only (you author the file yourself).

## Component discovery protocol

Before writing any Eminence component code, do this in order:

1. Read the request intent, behavior, and shape, not only literal words. Match on meaning.
2. Default to `Head`. Most pages should use only `Head` (or `Layout`, which wraps it). Only reach for individual components when you are inside `Head`'s slot, outside `Head`'s prop surface, or building your own custom head wrapper.
3. Use the component list in this file to shortlist candidates.
4. Read multiple candidate component docs before deciding. Minimum is 3 candidates when there is ambiguity.
5. Compare each candidate's prop surface, defaults, and rules against the request.
6. Select the best component(s) and apply their constraints exactly (especially mutual-exclusivity modes for `Robots`, `ThemeColor`, `AppleItunesApp`, and `OpenGraph` type-driving objects).
7. State which components were chosen and why they match the request.

Semantic matching is required even when wording differs from component names. For example, "Smart App Banner" → `AppleItunesApp`; "Twitter card image" → `OpenGraph` (the suite intentionally omits a separate `twitter:` namespace — see [policies/unsupported-tags](./policies/unsupported-tags.md)).

## Integration discovery protocol

Before editing `astro.config.mjs` or adding/removing any integration option:

1. Read [./config/SKILL.md](./config/SKILL.md) to see the full `IntegrationInput` surface.
2. Read [./integration/SKILL.md](./integration/SKILL.md) for the feature you intend to configure.
3. Read the per-feature page (linked in the table above) for the exact options, types, defaults, and validation rules.
4. Check [./recommendations/](./recommendations/) when deciding whether to enable an optional output file.
5. Check [./policies/](./policies/) before adding configuration for anything that looks like a legacy or unsupported surface.

## Architectural rules

1. **Integration is required.** Components import `virtual:eminence-astro-suite/head-tags`. Without the integration registered, builds will fail to resolve that virtual module.
2. **Configure once at integration level.** Site-wide defaults (`titleTemplate`, `siteName`, `themeColor`, `verification`, etc.) belong in `headTags`, not on every page.
3. **One entry point per page.** Prefer `Head` (or `Layout`). Do not hand-assemble `<head>` element-by-element when `Head` already covers the surface.
4. **Required props are required.** `Head` and `Layout` require `title` and `description` on every page; there is no global fallback for these.
5. **`false` suppresses.** For any prop that accepts `... | false`, pass `false` to suppress that tag even when the integration provides a default.
6. **Do not add unsupported tags or files.** See [./policies/unsupported-tags.md](./policies/unsupported-tags.md) and [./policies/unsupported-files.md](./policies/unsupported-files.md) before reaching for legacy surfaces (`apple-mobile-web-app-*`, `browserconfig.xml`, `meta[name=author]`, etc.).
