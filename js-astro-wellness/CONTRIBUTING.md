# Contributing to Astro Wellness

Thanks for helping out! This document outlines how to contribute to the Astro
Wellness gym template.

## Getting Started

Prerequisites:

- **Node.js ≥ 22.22** (see `package.json` `engines`; Astro 7 hard-fails on older versions)
- **pnpm** (the lockfile is `pnpm-lock.yaml`)

```sh
pnpm install
pnpm dev
```

Open `http://localhost:4321`.

## Project Conventions

Keep changes consistent with the existing codebase:

- **Styling** — Bulma is loaded module-by-module via Sass in
  `src/assets/styles/main.scss` (keep the granular `@use` list in sync with the
  classes you use — the barrel `bulma/sass` bloats the CSS to ~690 KB). Design
  tokens live in the `@use ... with` block and the `--aw-*` / `[data-theme='light']`
  custom properties. Always use tokens instead of hardcoded colors, never
  override Bulma classes and never use `!important`.
- **Components** — small and focused. Pages assemble presentational components
  and pull content from `src/data/*.ts` (site, services, team, pricing,
  testimonials). Keep them dumb: pass typed props, no logic in markup.
- **Theming** — both themes switch via `data-theme` on `<html>`. The default
  follows `prefers-color-scheme`; the navbar toggle persists the choice in
  `localStorage`. Scripts use document-level event delegation because
  `<ClientRouter />` re-creates the DOM on navigation.
- **Accessibility** — preserve the existing behavior: semantic HTML and
  landmarks, skip-to-content link, explicit form labels, `aria-current` on the
  active nav item, visible `:focus-visible` states, and `prefers-reduced-motion`
  support. Do not remove focus indicators or rely on color alone.
- **Content** — blog posts are Markdown files in `src/content/blog/` with typed
  frontmatter defined in `src/content.config.ts`. Import `z` from `astro/zod`
  (the `astro:content` export is deprecated and will warn under `astro check`).
- **Formatting** — match the surrounding file's conventions and keep diffs focused.

## Adding a Blog Post

1. Create a new file in `src/content/blog/`, e.g. `my-post.md`.
2. Add frontmatter matching the collection schema:

   ```md
   ---
   title: "My Post Title"
   description: "Short summary shown on the blog listing page."
   pubDate: 2026-11-01
   tags: [training, recovery]
   ---

   Your post body in Markdown here.
   ```

3. Run `pnpm dev` to verify the post appears at `/blog/my-post/`.

## Checking Your Work

```sh
pnpm check   # TypeScript + Astro diagnostics; must be clean
pnpm build   # production build; must complete without errors
```

There is still no automated test suite or linter configured, so verify the
affected pages manually in the browser at both desktop and mobile widths, in
light and dark modes, and with the keyboard (skip link, focus states, menu).

## Opening a Pull Request

The easiest way to contribute a feature or bug fix is a pull request. This is
the full workflow, from branch to merge.

### 1. Start from an up-to-date `main`

Contributors without write access: fork the repo first, then clone your fork.

```sh
git clone https://github.com/<you>/astro-wellness.git
cd astro-wellness
pnpm install
```

Set up and sync your branch base:

```sh
git remote add upstream https://github.com/<original-author>/astro-wellness.git  # fork only
git fetch upstream
git checkout -b feat/my-feature upstream/main
```

### 2. Create a focused branch

Name the branch after the change type:

| Type | Prefix | Example |
| :--- | :----- | :------ |
| New feature | `feat/` | `feat/add-schedule-section` |
| Bug fix | `fix/` | `fix/theme-toggle-svg` |
| Docs | `docs/` | `docs/update-readme` |
| Refactor | `ref/` | `ref/extract-pricing-card` |
| Chore | `chore/` | `chore/update-deps` |

One branch = one logical change. Do not mix unrelated fixes in the same PR.

### 3. Make the change and verify it

Follow the conventions in [Project Conventions](#project-conventions). Before
committing, run:

```sh
pnpm check   # TypeScript + Astro diagnostics; must be clean
pnpm build   # production build; must complete without errors
```

Then open the dev server (`pnpm dev`) and check the affected pages manually at
desktop and mobile widths, in light and dark modes, and with the keyboard
(skip link, focus states, menu). There is no automated test suite yet — this
manual pass is the verification.

### 4. Commit in small logical steps

- Use small, focused commits — one logical change per commit.
- Use a conventional prefix plus an imperative summary, e.g. `feat:`,
  `fix:`, `ref:`, `docs:`.
- Stage only the files related to the change; do not commit build output,
  `node_modules/`, `.env` files, or editor cruft (all covered by `.gitignore`).
- Update `CHANGELOG.md` under `Unreleased` when the change has user-visible impact.

```sh
git add src/components/NavBar.astro
git commit -m "fix: close mobile menu when a link is chosen"
```

### 5. Push and open the PR

```sh
git push -u origin feat/my-feature
```

Open a pull request against `main` from your branch (GitHub shows a banner with
a "Compare & pull request" button after the push). Describe the change:

- **Summary** — what changed and why (the problem it fixes or the feature it adds).
- **Testing** — `pnpm check` and `pnpm build` results, plus which pages/themes
  you verified manually.
- **Screenshots** — for UI changes, before/after (or light + dark mode) images.
- **Changelog** — note the `CHANGELOG.md` entry you added, if any.

Keep the description short but complete enough that a reviewer can verify the
change without reproducing your whole session.

### 6. After opening

- Keep the PR small and reviewable; push follow-up commits to the same branch
  as needed.
- No CI pipeline is configured yet, so a maintainer will review the diff and
  run the checks themselves. Respond to review feedback on the same PR.
- Once approved, the maintainer merges — a squash merge keeps `main` history clean.

## Reporting Security Issues

Report vulnerabilities privately — see `SECURITY.md`. Do not open a public
issue for a suspected security problem.