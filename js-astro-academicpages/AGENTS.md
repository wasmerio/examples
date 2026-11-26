# Academic Pages Astro Agent Guide 🚀

Guidelines and runbook for AI coding assistants (Antigravity, Cursor, Claude Code, GitHub Copilot, Codex) working on this repository.

---

## Repository Overview

`academicpages-astro` is a modern, high-performance academic portfolio template built with **Astro 7 + TypeScript + Tailwind CSS v4**. It serves as a modern drop-in replacement for the classic Jekyll-based AcademicPages.

### Template Usage & Contributions

- **Template Repositories**: Users typically generate their personal site via GitHub's "Use this template" feature
- **Personal Websites**: When customizing a user's personal website, AI coding assistants must **never** submit a pull request back to the template repository (`academicpages-astro` or upstream `academicpages.github.io`)
- **Template Contributions**: Pull requests to `academicpages-astro` must only be for template-level improvements (bug fixes, framework upgrades, accessibility enhancements, performance optimizations)
- **Preserve Footer Attribution**: The footer credit link in `src/components/Footer.astro` linking back to `academicpages-astro` (`https://github.com/arghyadipchak/academicpages-astro`) and upstream sources must **never** be removed, commented out, or hidden during personalization, redesigns, or automated refactoring

---

## Tech Stack & Architecture

- **Framework**: Astro 7+ (Static Site Generation mode)
- **Styling**: Tailwind CSS v4 with `@theme` design tokens and `@tailwindcss/typography`
- **Content**: Astro Content Collections (`src/content.config.ts`) with strict Zod schema validation
- **Math**: Server-side KaTeX rendering (`remark-math` + `rehype-katex` for Markdown AST, `marked-katex-extension` for frontmatter and inline titles)
- **Icons**: `astro-icon` with FontAwesome 6 brands/solid and Academicons
- **Search**: Fast client-side modal search (`Cmd+K` / `Ctrl+K`) powered by `/api/search.json`
- **Quality Gates**: ESLint 10 Flat Config, Prettier with Tailwind class sorter, and TypeScript strict mode (astro check)

---

## Directory Structure

```text
academicpages-astro/
├── src/
│   ├── components/         # UI components (Masthead, Footer, AuthorProfile, ActionBadges, etc.)
│   ├── content/            # Markdown content collections
│   │   ├── blog/           # Blog posts
│   │   ├── pages/          # Static markdown pages (about, terms, markdown guide)
│   │   ├── portfolio/      # Project and research portfolio items
│   │   ├── publications/   # Academic papers, preprints, journal articles, books
│   │   ├── talks/          # Conference talks, tutorials, presentations
│   │   └── teaching/       # Courses and teaching materials
│   ├── data/
│   │   ├── navigation.ts   # Top navigation bar links
│   │   ├── siteConfig.ts   # Author profile, site title, theme, links, and category definitions
│   │   └── themes.ts       # Built-in light/dark color theme presets and token resolver
│   ├── layouts/            # BaseLayout, PageLayout, ListLayout
│   ├── pages/              # Astro routing pages (/cv, /publications, /talks, /posts, etc.)
│   └── styles/
│       └── global.css      # Design tokens, themes, and global prose styling
├── public/                 # Static downloads, PDFs, slides, and avatar images
├── tests/                  # Playwright end-to-end browser test suite
└── .agents/
    └── skills/             # Antigravity & AI assistant skills
```

---

## Operational Lifecycle & Skills Architecture

The repository follows a structured 3-phase operational lifecycle for both human maintainers and AI assistants:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 1: Initial Onboarding & Personalization (One-Time)              │
│  - Ingest user profile & scholarly handles (docs/CONFIG.md)            │
│  - Populate initial content and purge starter demo files & assets      │
│  - Retire docs/ONBOARDING.md and .agents/skills/onboarding/            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 2: Routine Content Operations & Authoring (Ongoing)             │
│  - Add publications with BibTeX and action badges (docs/CONTENT.md)    │
│  - Add talks, teaching materials, and blog posts with KaTeX math       │
│  - Update CV sections in src/pages/cv.astro and site identity          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 3: Upstream Template Synchronization (Maintenance)              │
│  - Ephemeral bare clone tag diff generation (docs/SYNC.md)             │
│  - Intelligent semantic merging across all layers of the codebase      │
│  - Dependency upgrades and pnpm verify quality gate                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Operational Skills & Documentation Matrix

- **1. Onboarding & Discovery (One-Time)**: [`docs/ONBOARDING.md`](docs/ONBOARDING.md) & [`.agents/skills/onboarding/SKILL.md`](.agents/skills/onboarding/SKILL.md) (itemized roadmap for profile ingestion, demo content purge, and scaffolding retirement; deleted once onboarding is complete)
- **2. Site & Profile Configuration**: [`docs/CONFIG.md`](docs/CONFIG.md) (complete reference for `siteConfig.ts`, 50+ academic/social handles, `navigation.ts`, base URL resolution, redirect management, and footer attribution)
- **3. Content Authoring & Operations**: [`docs/CONTENT.md`](docs/CONTENT.md) & [`.agents/skills/content-operations/SKILL.md`](.agents/skills/content-operations/SKILL.md) (Zod frontmatter schemas, paper authoring, 1-click BibTeX, action badges, talks, teaching, and KaTeX blog posts)
- **4. Markdown & Mathematical Typesetting**: [`docs/MARKDOWN.md`](docs/MARKDOWN.md) (comprehensive syntax reference for KaTeX math equations, tables, alert callouts, and Mermaid diagrams)
- **5. Template Synchronization**: [`docs/SYNC.md`](docs/SYNC.md) & [`.agents/skills/template-sync/SKILL.md`](.agents/skills/template-sync/SKILL.md) (tag-based template upgrades via ephemeral bare clones and patch generation without Git forks or remotes)

---

## Formatting & Code Style Rules

- **No Trailing Periods**: Never end single lines, bullet points, table cell descriptions, or standalone list items with a period
- **Canonical Tailwind v4 Syntax**: Use `border-(--global-border-color)`, `bg-(--global-base-color)`, `text-(--global-text-color)` instead of `[var(--...)]`
- **Semantic HTML**: Maintain landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`, `<article>`)
- **Strict Typing**: All components and helpers must pass TypeScript type checks with zero errors

---

## Verification & Quality Gates

Run these commands before committing any changes:

```bash
# Format code
pnpm format

# Run code quality verification (lint, format:check, typecheck)
pnpm verify

# Build static production site
pnpm build
```
