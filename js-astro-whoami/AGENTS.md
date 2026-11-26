# AGENTS.md

Minimal, text-forward, AI-agent-friendly personal website template built with Astro.

## Quick Start

```bash
npm install
npm run dev       # Dev server at localhost:4321
npm run build     # Production build to ./dist/
npm run preview   # Preview production build
```

## Structure

```text
astro-whoami/
├── src/
│   ├── site.config.ts      # Single config file for personalization
│   ├── content.config.ts   # Content collection schemas (blog, projects)
│   ├── styles/global.css   # Theme variables (light/dark) + typography
│   ├── layouts/             # BaseLayout, PageLayout, PostLayout
│   ├── components/          # Nav, Footer, ThemeToggle, PostList, ProjectCard
│   ├── pages/               # Routes: index, blog, projects, about, rss, 404
│   └── data/                # Markdown content (blog/, projects/)
├── public/                  # Static assets (favicon, robots.txt)
├── astro.config.ts
└── tailwind.css
```

## Key Files

- `src/site.config.ts` -- all personalization (name, bio, socials, nav, featured posts)
- `src/styles/global.css` -- theme colors and prose typography
- `src/content.config.ts` -- Zod schemas for blog and project frontmatter

## Stack

- Astro 5 (static output, no client-side framework)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- TypeScript
- Shiki (code highlighting with light/dark theme support)

## Linting

```bash
npm run format:check  # Check Prettier formatting
npm run lint          # ESLint
npm run check         # Astro type check
npm run lint:md       # Markdownlint
npm run format        # Auto-format with Prettier
```

Pre-commit hooks (husky + lint-staged) run automatically on commit.
Commitlint enforces conventional commit messages.

## Commit Workflow

Branch protection is enabled. All changes require PRs.

```bash
git checkout -b <type>/<short-description>
git add <files>
git commit -m "<type>: <description>"
git push -u origin HEAD
gh pr create --fill
```

## Conventions

- Conventional commits required
- Pure Astro components, no React/Vue/Svelte
- Markdown only for content (no MDX)
- Semantic HTML5 throughout
- JSON-LD structured data on every page type
