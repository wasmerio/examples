# AGENTS.md

## Project

Nayuta is a responsive, reading-first Astro theme for personal homepages, blogs,
and notes. It generates static pages from Markdown, MDX, and Astro content, with
scoped CSS, configurable color themes, and native browser enhancements.

## Read at Session Start

- [README.md](README.md): setup, configuration, and content authoring.
- [CONTRIBUTING.md](CONTRIBUTING.md): contributing and commit conventions.
- [docs/develop/index.md](docs/develop/index.md) and every document linked in its
  directory if needed: visual design, architecture, content, and component contracts.
- [package.json](package.json), [astro.config.ts](astro.config.ts),
  [tsconfig.json](tsconfig.json):
  current dependencies, scripts, integrations, types and path alias.
- Any deeper `AGENTS.md` applicable to the files being changed.

## Technology Stack

- Astro 7 with static output, TypeScript 6 in strict mode, and vanilla scoped CSS.
- Markdown/MDX, Astro content collections, and Zod schemas from `astro/zod`.
- Bun for dependency management, repository scripts, and tests (recommended;
  no separate Node.js installation needed). Do not use Node.js for
  contributions.
- Native browser APIs and custom elements for progressive enhancement.

## Validation and Formatting

Available scripts from `package.json`:

| Command                | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `bun run check`        | Check Astro files and TypeScript without emitting output.             |
| `bun run test`         | Run Bun tests, including build fixtures and available browser checks. |
| `bun run build`        | Generate the static site in `dist/`.                                  |
| `bun run format`       | Format the repository with Prettier.                                  |
| `bun run format:check` | Check formatting without changing files.                              |
| `bun run dev`          | Start the local development server.                                   |
| `bun run preview`      | Preview the generated site for manual checks.                         |

There is no separate lint script. Documentation-only changes need formatting and
link review, but do not need to run any linting commands like check, test, build.
Application checks and tests are for changes that affect the site.
