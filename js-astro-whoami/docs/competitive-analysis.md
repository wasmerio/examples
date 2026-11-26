# Competitive Analysis: Astro Personal Website Templates

Research conducted March 2026. Covers the most popular Astro blog/portfolio templates on GitHub.

## Templates Surveyed

| Template         | Stars | Repo                              | Category                     |
| ---------------- | ----- | --------------------------------- | ---------------------------- |
| AstroWind        | 5,473 | onwidget/astrowind                | Feature-rich website builder |
| AstroPaper       | 4,268 | satnaing/astro-paper              | Minimal blog                 |
| Cactus           | 1,530 | chrismwilliams/astro-theme-cactus | Opinionated blog             |
| Astrofy          | 1,318 | manuelernestog/astrofy            | Portfolio + CV               |
| Astro Theme Pure | 828   | cworld1/astro-theme-pure          | Blog + docs                  |
| Astro Nano       | 813   | markhorn-dev/astro-nano           | Minimal portfolio + blog     |
| Blogster         | 656   | flexdinesh/blogster               | Multi-theme collection       |
| Astro Sphere     | 638   | markhorn-dev/astro-sphere         | Animated portfolio + blog    |
| Retypeset        | 619   | radishzzz/astro-theme-retypeset   | Typography-focused blog      |
| Typography       | 579   | moeyua/astro-theme-typography     | Reading-optimized blog       |
| Astro Micro      | 484   | trevortylerlee/astro-micro        | Nano fork with extras        |
| Dante            | 471   | JustGoodUI/dante-astro-theme      | Single-author blog           |

## Feature Comparison

| Feature           | whoami | AstroPaper   | Cactus       | Nano     | Micro        | AstroWind     |
| ----------------- | ------ | ------------ | ------------ | -------- | ------------ | ------------- |
| Astro version     | 5      | 5            | 5            | 5        | 5            | 5             |
| Content format    | MD     | MD           | MD + MDX     | MD + MDX | MD + MDX     | MD + MDX      |
| CSS framework     | TW v4  | TW v4        | TW v4        | TW v3    | TW v4        | TW v3         |
| JSON-LD           | Yes    | Yes          | No           | No       | No           | No            |
| Dynamic OG images | No     | Yes (satori) | Yes (satori) | No       | No           | No            |
| Search            | No     | Pagefind     | Pagefind     | No       | Pagefind     | No            |
| View transitions  | No     | ClientRouter | No           | No       | ClientRouter | No            |
| Comments          | No     | No           | Webmentions  | No       | Giscus       | No            |
| Reading time      | No     | No           | Yes          | No       | No           | Yes           |
| Tag pages         | No     | Yes          | Yes          | No       | Yes          | Yes           |
| Pagination        | No     | Yes          | No           | No       | No           | Yes           |
| TOC               | No     | No           | No           | No       | Yes          | No            |
| Analytics         | No     | No           | No           | No       | No           | GA + Splitbee |
| i18n              | No     | RTL only     | Locale       | No       | No           | textDirection |
| SkipLink          | No     | No           | Yes          | No       | No           | No            |
| a11y linting      | No     | No           | No           | jsx-a11y | No           | No            |
| JS framework      | None   | None         | None         | None     | None         | None          |
| CMS integration   | No     | No           | No           | No       | No           | Decap CMS     |

## Developer Tooling Comparison

| Tooling           | whoami                        | AstroPaper     | Cactus          | Nano | Micro | AstroWind            |
| ----------------- | ----------------------------- | -------------- | --------------- | ---- | ----- | -------------------- |
| Pre-commit hooks  | Husky + lint-staged           | No             | No              | No   | No    | No                   |
| Commitlint        | Yes                           | No             | No              | No   | No    | No                   |
| Lighthouse CI     | Yes (assertions)              | No             | No              | No   | No    | No                   |
| ESLint            | Yes                           | Yes            | Biome           | Yes  | No    | Yes                  |
| Prettier          | Yes                           | Yes            | Yes             | No   | Yes   | Yes                  |
| Markdownlint      | Yes                           | No             | No              | No   | No    | No                   |
| CI/CD workflows   | 3 (lint, lighthouse, commits) | 1 (lint+build) | 1 (check+build) | No   | No    | 1 (multi-node build) |
| Branch protection | Yes                           | No             | No              | No   | No    | No                   |
| Dependabot        | Yes (grouped)                 | No             | Yes             | No   | No    | No                   |
| CLAUDE.md         | Yes                           | No             | No              | No   | No    | No                   |
| CONTRIBUTING.md   | Yes                           | Yes            | No              | No   | No    | No                   |

## What astro-whoami Does Uniquely

No other surveyed template combines all of these:

1. **JSON-LD on every page type** (WebSite, Person, BlogPosting, ProfilePage). Only AstroPaper also has JSON-LD, and only for BlogPosting.
2. **Pre-commit hooks** (husky + lint-staged). No other template enforces code quality at commit time.
3. **Commitlint**. No other template validates commit message format.
4. **Lighthouse CI with assertions**. No other template runs Lighthouse in CI with score thresholds.
5. **CLAUDE.md / AI-agent documentation**. No other template provides machine-readable project context.
6. **Grouped Dependabot**. Only Cactus has Dependabot, but without grouping.
7. **Three CI workflows** (lint, Lighthouse, semantic PR title). Most templates have zero or one.

## Gaps to Address

Sorted by impact, with estimated effort.

### High Impact

| Feature           | What it adds                                   | Who has it                | Effort     |
| ----------------- | ---------------------------------------------- | ------------------------- | ---------- |
| Pagefind search   | Static search with zero JS at rest             | AstroPaper, Cactus, Micro | Medium     |
| Dynamic OG images | Auto-generated social sharing images per post  | AstroPaper, Cactus        | Medium     |
| Reading time      | Estimated minutes per post                     | Cactus, AstroWind         | Low        |
| Tag pages         | `/tags/[tag]` archive routes                   | AstroPaper, Cactus, Micro | Low-Medium |
| Pagination        | Split long post lists across pages             | AstroPaper, AstroWind     | Low        |
| View transitions  | Smooth page transitions via Astro ClientRouter | AstroPaper, Micro         | Low        |

### Medium Impact

| Feature            | What it adds                              | Who has it          | Effort  |
| ------------------ | ----------------------------------------- | ------------------- | ------- |
| Table of contents  | Auto-generated heading nav for long posts | Micro, Cactus, Pure | Medium  |
| SkipLink component | "Skip to content" link for keyboard users | Cactus              | Trivial |
| a11y ESLint plugin | Catch accessibility issues at lint time   | Nano (jsx-a11y)     | Trivial |
| Prev/next post nav | Navigate between posts sequentially       | Micro               | Low     |
| Copy-to-clipboard  | Code block copy button                    | Sphere              | Low     |
| Related posts      | Suggest posts with shared tags            | AstroWind           | Low     |

### Low Priority

These are differentiators for their respective templates but not essential for a minimal template:

| Feature         | Who has it            | Notes                    |
| --------------- | --------------------- | ------------------------ |
| Giscus comments | Micro, Retypeset      | Adds external dependency |
| Analytics slot  | AstroWind             | Users can add manually   |
| i18n routing    | Retypeset, Typography | Significant complexity   |
| CMS integration | AstroWind (Decap)     | Adds admin overhead      |
| MDX support     | Most templates        | Adds build complexity    |
| Webmentions     | Cactus                | Niche IndieWeb feature   |

## Architectural Patterns Observed

### Config File Naming

Most templates use a single config file in `src/`:

- `consts.ts` (Nano, Sphere, Micro) -- flat exports
- `config.ts` (AstroPaper) -- typed SITE object
- `site.config.ts` (Cactus, whoami) -- most descriptive name
- `config.yaml` (AstroWind) -- loaded via custom integration

### Content Organization

- Modern pattern: `src/content/` or `src/data/` with colocated images
- All use Astro content collections with Zod schemas
- AstroPaper and Cactus have the richest frontmatter schemas (draft, featured, canonical URL, OG image, timezone)
- Cactus uniquely uses a "notes" collection for short-form content and "tags" as a content collection with descriptions

### Search Implementation

Pagefind is the dominant choice for static search:

- Runs at build time, generates a static index
- Zero JavaScript at rest (loads only when search is opened)
- Aligns with zero-framework philosophy
- AstroPaper, Cactus, and Micro all use it
- Sphere uses Fuse.js (requires SolidJS runtime)

### OG Image Generation

AstroPaper and Cactus both use the same stack:

- `satori` converts HTML/CSS to SVG
- `@resvg/resvg-js` converts SVG to PNG
- Generated at build time via Astro endpoint (`/og-image/[slug].png`)
- No runtime cost

### Linting Landscape

- No template uses husky + lint-staged (we are unique here)
- Most use Prettier for formatting
- Cactus uses Biome (newer, faster alternative to ESLint + Prettier)
- Nano is the only template with `eslint-plugin-jsx-a11y` for accessibility linting

## Strategic Positioning

astro-whoami occupies a distinct niche: **minimal, AI-agent-friendly, developer-tooling-first**. The closest competitors by philosophy are:

- **Astro Nano** (minimal, zero-framework) -- but lacks tooling and structured data
- **AstroPaper** (SEO-focused, accessible) -- but more feature-heavy
- **Cactus** (opinionated, well-maintained) -- but more complex

Our advantage is the combination of structured data depth, developer experience tooling, and deliberate simplicity. The recommended roadmap adds user-facing features (search, OG images, reading time) without compromising that identity.
