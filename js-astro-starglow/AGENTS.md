# starglow: notes for AI coding agents

starglow is an Astro 7 + Tailwind 4 static theme. Read this before changing it.

## Commands

- `pnpm dev`, `pnpm build`, `pnpm verify`; or `./dev.sh ci` (Docker) for the full CI set.
- A change is done when `./dev.sh ci` passes: format, lint, `astro check`, build, lychee, `verify-dist`.

## Where things live

- Config: `starglow.config.ts` (user), types and docs in `src/types/config.ts`, defaults resolved in `src/config.ts`.
- Content: `src/content/{blog,notes,projects,pages}`; schemas in `src/content.config.ts` (strict).
- Palettes: `src/palettes.ts` (the only place colours live). Theme styles: `src/styles/site-theme.css`. `theme.css`, `typography.css` and `global.css` stay close to upstream.
- User slots, never overwritten: `src/custom/*.astro`.
- Build assertions: `scripts/verify-dist.ts`; placeholder check: `scripts/check-markers.ts`.

## Recipes

- **Add a post:** `./dev.sh new post <slug>` → `src/content/blog/<year>/<slug>.md`; the folder year must match `pubDatetime`.
- **Add a config option:** add it with JSDoc to `src/types/config.ts`, a default in `src/config.ts`, the key to `starglow.config.ts`, a row in `docs/02-configuration.md` and a `breaking`, `enhancement` or `bug` label on the pull request (release notes are generated from labels).
- **Add a badge icon:** a bitmap in `src/utils/badges.ts` and a `--badge-<type>` colour token.
- **Change the design:** keep the type scale (13/14/16/20/32), the 4px grid, 1px borders and zero radius; `verify-dist` checks the type scale.

## Commits

- Agents commit locally and never push. A human reviews every commit and pushes.
- Header only: `type(scope): subject` on one line, no description body and no trailers. Types `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`; `!` after the type for breaking changes. Subject in the imperative, lowercase, no trailing full stop, at most 72 characters.
- One logical change per commit; `./dev.sh ci` passes on every commit.
- Write "starglow" lowercase, also in commit messages.
- No personal content, secrets or generated files (`dist/`, `.astro/`).
- Enable the checker once per clone: `git config core.hooksPath .githooks`.

## Rules

- Minimal client JS; no framework islands.
- WCAG AA contrast; honour `prefers-reduced-motion`; hover never shifts layout.
- No build may depend on a network service.
- GitHub Actions are pinned to full commit SHAs.
