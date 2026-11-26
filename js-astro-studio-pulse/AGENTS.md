# AGENTS.md

Static marketing site for a communication agency. Astro 7 (SSG) + Bulma 1.0.4, no JS UI framework. See `CONTRIBUTING.md` for team conventions.

## Commands

Use **pnpm** (not npm/yarn). Lockfile `pnpm-lock.yaml`; `package.json` `allowScripts` needed for pnpm 10 to run esbuild postinstall.

```sh
pnpm install   # install deps
pnpm dev       # dev server at http://localhost:4321
pnpm build     # production build -> ./dist (the ONLY verification step)
pnpm preview   # serve ./dist locally
```

- **No test suite, linter, formatter, or typecheck** in repo. Do not run or add `pnpm test` / `pnpm lint`.
- `astro check` **not available** (`@astrojs/check` not installed); do not reference.

## Build & runtime facts

- Node `>= 22.12.0` needed (see `package.json` `engines`).
- `astro.config.mjs` has no custom options; directory-based routing in `src/pages/`.
- `dist/`, `.astro/`, `node_modules/` gitignored — never commit.

## Blog content collections

Posts in `src/content/blog/*.md`; schema in `src/content.config.ts` (glob loader `**/*.md`). Post auto-published — no manual route registration.

- URL from **filename**: `07-my-post.md` -> `/blog/my-post/`.
- Frontmatter required: `title`, `date`, `description`, `author`; optional: `tags`, `image`.
- Listing page (`src/pages/blog/index.astro`) sorts by `date` descending; entry page `src/pages/blog/[...slug].astro`.

## Styling

- Extend Bulma + CSS custom properties in `src/styles/global.css`. Use design tokens (`--sp-*`, `--bulma-*`) and utility classes (`.u-constrained`, `.u-prose`, `.u-label-overline`, `.icon-lg`, `.has-bg-elevated`), not hardcoded colors or inline `style`.
- Theming: themeable tokens defined in **both** `:root` (light) and `[data-theme="dark"]`. New color in one theme only silently breaks dark mode.
- `Card.astro` shared card component, used by Home and About pages.

## SPA & client JS traps

- `<ClientRouter />` (from `astro:transitions`) in `Layout.astro` gives client-side navigation. Full page load only on first visit.
- `Navbar.astro` binds burger/theme-toggle via one document-level `click` listener + `astro:page-load` handler to re-sync `[data-theme]` after navigation. New client JS must follow same pattern or state lost on navigation.

## Notes

- **Static site, no backend**. Contact form in `src/pages/contact.astro` has no `action` or submit handler — intentionally non-functional (mailto placeholder).
- `.astro` indentation inconsistent (tabs in some pages, 4-space elsewhere) — match surrounding file, keep diffs focused.
- Commit style: conventional prefix + imperative summary (`feat:`, `fix:`, `ref:`, `docs:`). See `CONTRIBUTING.md`.