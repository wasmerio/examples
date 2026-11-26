# Contributing to Studio Pulse

Thanks for helping out! This document outlines how to contribute to the Studio Pulse marketing site.

## Getting Started

Prerequisites:

- **Node.js ≥ 22.12** (see `package.json` `engines`)
- **pnpm** (the lockfile is `pnpm-lock.yaml`)

```sh
pnpm install
pnpm dev
```

Open `http://localhost:4321`.

## Project Conventions

Keep changes consistent with the existing codebase:

- **Styling** — build on Bulma classes and the CSS custom properties in `src/styles/global.css`. Always use the design tokens (`--sp-*`, `--bulma-*`) instead of hardcoded colors. Prefer the existing utility classes (`.u-constrained`, `.u-prose`, `.u-label-overline`, `.icon-lg`) over inline `style` attributes.
- **Components** — small and focused. Reuse `src/components/Card.astro` where it fits instead of duplicating markup.
- **Accessibility** — preserve the existing behavior: semantic HTML and landmarks, explicit form labels, `aria-current` on the active nav item, visible `:focus-visible` states, and `prefers-reduced-motion` support. Do not remove focus indicators or rely on color alone.
- **Content** — blog posts are Markdown files in `src/content/blog/` with typed frontmatter defined in `src/content.config.ts`. See [Adding a Blog Post](#adding-a-blog-post).
- **Formatting** — match the surrounding file's indentation (tabs in page components, spaces/CSS 2-space in styles) and keep diffs focused.

## Adding a Blog Post

1. Create a new file in `src/content/blog/`, e.g. `07-my-post.md`.
2. Add frontmatter matching the collection schema:

   ```md
   ---
   title: "My Post Title"
   date: 2025-11-01
   description: "Short summary shown on the blog listing page."
   author: "Team Member"
   tags: [strategy, branding]
   ---

   Your post body in Markdown here.
   ```

3. Run `pnpm dev` to verify the post appears at `/blog/my-post/`.

## Checking Your Work

```sh
pnpm build        # production build; must complete without errors
```

There is still no automated test suite or linter configured, so verify the affected pages manually in the browser at both desktop and mobile widths and in light and dark modes. On every push and pull request, CI runs `pnpm install`, `pnpm audit`, and `pnpm build` (see `.github/workflows/ci.yml`).

## Reporting Security Issues

Report vulnerabilities privately — see `SECURITY.md`. Do not open a public issue for a suspected security problem.

## Git Workflow

- Use small, focused commits — one logical change per commit.
- Follow the existing commit style: a conventional prefix plus an imperative summary, e.g. `feat:`, `fix:`, `ref:`, `docs:`.
- Stage only the files related to the change; do not commit build output, `node_modules/`, `.env` files, or editor cruft (all covered by `.gitignore`).
- Optionally update `CHANGELOG.md` under `Unreleased` when a change has user-visible impact.
