# Contributing to BlogGPT

Thank you for your interest in contributing to [BlogGPT](https://github.com/Raincarnator/astro-theme-BlogGPT)! Whether you are fixing a bug, improving documentation, or proposing a new feature, your help is welcome.

## Project Structure

This repository is organized as a `pnpm` workspace monorepo:

- `src/` — Core Astro theme components, layouts, styles, routes, and TypeScript schemas.
- `apps/docs` — Documentation site built for [bloggpt.reincarnatey.net](https://bloggpt.reincarnatey.net/en/) (Simplified Chinese in `apps/docs/` and English in `apps/docs/en/`).
- `starter/` — Template files used to generate the standalone [astro-theme-BlogGPT-starter](https://github.com/Raincarnator/astro-theme-BlogGPT-starter) repository.

## Local Development Workflow

### Prerequisites

- **Node.js**: `>= 22.12.0`
- **pnpm**: `>= 11.0.0`

### Setup & Commands

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/astro-theme-BlogGPT.git
   cd astro-theme-BlogGPT
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install
   ```
3. Start the local development server:
   ```bash
   pnpm dev
   ```
4. Run a production build check before submitting changes:
   ```bash
   pnpm build
   ```

## Pull Request Guidelines

- **Keep PRs focused**: Submit one logical change or fix per pull request.
- **Sync documentation**: If you add or modify configuration options in `blog.config.ts` or frontmatter fields, update both the Chinese (`apps/docs/`) and English (`apps/docs/en/`) documentation pages.
- **Verify builds**: Ensure `pnpm build` completes without TypeScript or Astro build errors.
- **Describe your changes**: Clearly explain the problem solved or feature added in your PR description, and include screenshots when modifying UI styles.

## Reporting Issues

When opening an issue on [GitHub Issues](https://github.com/Raincarnator/astro-theme-BlogGPT/issues), please include:

1. Your Node.js, pnpm, and operating system versions.
2. Minimal steps or configuration to reproduce the problem.
3. Expected behavior vs. actual behavior (with terminal logs or screenshots if applicable).
