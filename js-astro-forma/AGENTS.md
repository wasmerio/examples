# Project instructions

FORMA is a bilingual Astro site template for construction and renovation services. Read `README.md`, `docs/ai/quickstart.md` and the relevant files under `docs/ai/` before making changes.

## Sources of truth

| Concern | Source |
| --- | --- |
| Routes | Explicit Astro files in `src/pages/` |
| Site and business data | JSON files in `src/data/global/` |
| Navigation | JSON files in `src/data/navigation/` |
| Homepage content | JSON files in `src/data/sections/` |
| Shared UI | `src/components/ui/` |
| Page layout | `src/layouts/Layout.astro` |
| Site URL and build scope | `site.config.mjs` |
| Theme tokens | `design/default.md` |

## Editing

- Change JSON first for copy, navigation, metadata and section content.
- Reuse existing UI components and keep internal links aligned with `src/pages/` routes.
- Follow `docs/DESIGN_RULES.md` for any visual change.
- Keep demo content clearly identified and do not add private business data or unlicensed assets.
- Do not commit `.env` files, build output, dependency directories or local reports.

## Validation

Before handing off changes, run:

```bash
npm run ai:check
npm run build
```
