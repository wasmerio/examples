# Contributing to astro-gov-starter

Thank you for helping improve this template. Contributions that benefit the
broader government web community are especially welcome.

---

## Quick start

```bash
git clone https://github.com/ctrimm/astro-gov-starter.git
cd astro-gov-starter
pnpm install        # installs all dependencies
pnpm dev            # starts dev server at http://localhost:4321
```

`pnpm dev` and `pnpm build` automatically copy USWDS fonts, images, and JS
from `node_modules` to `public/uswds/`. You don't need to run anything extra.

---

## Local quality gates

Run all checks before opening a PR:

```bash
bash scripts/check.sh          # TypeScript + build + plain-language + compliance + HTML validate
bash scripts/check.sh --verbose # same, with per-file output
```

Individual checks:

```bash
pnpm check                              # TypeScript only
pnpm build                              # full build
npx html-validate 'dist/**/*.html'      # HTML validation
node scripts/plain-language.mjs         # readability (avg FK grade ≤ 8)
node scripts/compliance-check.mjs       # USWDS banner/identifier/skip-nav
```

Accessibility and Lighthouse are run only in CI (they need a browser).
To test locally, run `pnpm preview` then:

```bash
npx @axe-core/cli http://localhost:4321/
```

---

## Project structure

```
src/
├── components/uswds/    # Thin wrappers around USWDS HTML patterns
├── config/site.ts       # Agency name, domain, required identifier links
├── content/             # Markdown/MDX content collections (services, faqs, ...)
├── i18n/                # Translation strings (en, es) + useTranslations helper
├── layouts/             # BaseLayout, ServiceLayout, ApplyLayout
├── pages/               # Route files (English at /, Spanish at /es/)
└── styles/              # uswds-theme.scss entry point + globals.css
scripts/
├── setup-uswds.mjs      # Copies USWDS assets to public/uswds/ (runs on dev/build)
├── plain-language.mjs   # Flesch-Kincaid readability check on content
├── compliance-check.mjs # USWDS compliance check on built HTML
└── init-agency.mjs      # One-time setup wizard for new agencies
```

---

## Adding a USWDS component wrapper

1. Check [designsystem.digital.gov/components](https://designsystem.digital.gov/components/)
   for the canonical USWDS markup.
2. Create `src/components/uswds/ComponentName.astro`.
3. Use `Astro.props` for any configurable parts; use `<slot />` for content.
4. Do not recreate USWDS behaviour in JavaScript — rely on the USWDS JS bundle
   already loaded in `BaseLayout.astro`.
5. Add the component to the preview page at `src/pages/internal/components.astro`.

---

## Adding a content collection

1. Add your schema to `src/content.config.ts` using the `glob()` loader.
2. Create `src/content/<collection-name>/` with at least one `.md` file.
3. Add the corresponding page(s) in `src/pages/` (and `src/pages/es/` for Spanish).
4. Export the new collection from `collections` in `src/content.config.ts`.

---

## i18n guidelines

- English is the primary locale (pages live at `/`).
- Spanish is the mirrored locale (pages live at `/es/`).
- All user-visible strings belong in `src/i18n/translations/en.ts` and `es.ts`.
- Pages in `src/pages/es/` should mirror their English counterparts structurally.
- Content that differs substantively between locales (e.g., program names that
  don't translate) can stay hardcoded in the page file.

---

## Accessibility requirements

All contributions must maintain **WCAG 2.1 Level AA** compliance:

- Every image needs meaningful `alt` text (or `alt=""` if decorative).
- Every form input needs a visible `<label>` associated by `for`/`id` or `aria-label`.
- Interactive elements must be keyboard-operable and have visible focus indicators.
- Color contrast: 4.5:1 for normal text, 3:1 for large text and UI components.
- Dynamic content changes must be announced to screen readers via ARIA live regions.
- Do not suppress focus styles.

The CI `a11y` job runs axe-core against key pages on every push. Zero violations
is the threshold — PRs that introduce violations will not be merged.

---

## Commit messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat(component): add Table wrapper with sortable column support
fix(ci): correct axe-core server startup timing
docs: update quick-start instructions for Cloud.gov Pages
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `ci`, `chore`.

---

## Opening a pull request

1. Fork the repository and create a branch from `main`.
2. Make your changes and run `bash scripts/check.sh`.
3. Fill out the pull request template completely.
4. Ensure all CI checks pass before requesting review.

PRs that add new components or page templates should include a screenshot or
screen recording showing the component in the preview page (`/internal/components/`).

---

## Scope policy

This is a **starter template**, not an application framework. We accept:

- Thin USWDS component wrappers
- Generic page templates applicable to most government service sites
- CI gate improvements
- Documentation improvements
- Dependency updates

We generally decline:

- Application-specific logic (form backends, authentication, databases)
- Components that reimplment USWDS behaviour in Astro/JavaScript
- Features applicable only to one agency or program type

If you're unsure, open an issue first to discuss before implementing.

---

## Releases

Every change that lands on `main` goes into the `## [Unreleased]` section of
[CHANGELOG.md](./CHANGELOG.md) as part of its own PR — that section becomes the
release notes verbatim, so write the entry for someone deciding whether to
adopt the release, not for someone reading the diff.

Choose the section by impact on a project already built on this starter:
`Added` for new capability, `Changed` for altered behaviour, `Fixed`,
`Removed`, `Security`.

Releases are cut from `main` by pushing a `vX.Y.Z` tag. Major versions track
Astro major versions — see [RELEASING.md](./RELEASING.md) for the full process
and the versioning contract.
