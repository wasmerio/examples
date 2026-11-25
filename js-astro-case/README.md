<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Case](https://github.com/erlandv/case) Astro theme by erlandv, copied from commit `c7072e44ce345f59e47b9fa5fc0f338bf783943d` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-case.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** The theme's example env file lists `SITE_URL`, `SITE_LANGUAGE`, `SITE_AUTHOR_NAME`, `SITE_AUTHOR_TITLE`, `SITE_AUTHOR_BIO`, `SITE_AUTHOR_EMAIL`, `SITE_AUTHOR_LOCATION`, `SOCIAL_GITHUB`, `SOCIAL_LINKEDIN`, `SOCIAL_TWITTER`, `SOCIAL_MASTODON`, `SOCIAL_BLUESKY`, `SITE_TITLE`, `SITE_DESCRIPTION`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [erlandv](https://github.com/erlandv), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Case — A Case-Study-First Portfolio Theme for Astro

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A case-study-first portfolio theme for Astro. Designed for professionals who want to showcase their thinking, decisions, and real impact—not just screenshots and tech stacks.

## Why Case?

Most portfolio themes focus on listing projects with screenshots and bullet points. Case takes a different approach: it treats every project as a case study with a structured narrative—problem, constraints, approach, key decisions, and measurable outcomes.

This lets you demonstrate not just what you built, but how you think. Hiring managers and clients see your decision-making process, trade-offs you considered, and the real impact of your work. You stand out by showing depth, not just breadth.

## Demo

<div align="center">

[![View Demo](https://img.shields.io/badge/View_Demo-→-0077FF?style=for-the-badge&logo=astro&logoColor=white)](https://case.erland.me)

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/light-mode.webp" loading="lazy" alt="Light Mode">
      <p align="center"><em>Light Mode</em></p>
    </td>
    <td width="50%">
      <img src="./screenshots/dark-mode.webp" loading="lazy" alt="Dark Mode">
      <p align="center"><em>Dark Mode</em></p>
    </td>
  </tr>
</table>

</div>

## Features

### Case Studies Over Screenshots

Document your engineering thinking with structured project narratives.

- **Problem → Solution framework**: Context, constraints, approach, and measurable impact
- **Decision documentation**: Trade-offs, alternatives, and reasoning behind key choices
- **Quantified outcomes**: Performance improvements, team impact, and business results
- **Strategic highlighting**: Feature your strongest work on the homepage

### Built-in Decision Records

Document architectural decisions with full context and alternatives.

- Problem statement and background context
- Options considered with trade-off analysis
- Chosen approach with reasoning
- Outcomes and learnings
- Tag-based organization and filtering

### Content Types for Technical Portfolios

Purpose-built collections for engineering professionals.

- **Projects** — Deep-dive case studies with structured narratives
- **Decisions** — ADR-style technical decision logs
- **Journey** — Career milestones, transitions, and key learnings
- **Writing** — Technical articles with auto-generated TOC
- **Speaking** — Talks, podcasts, and workshop materials
- **Tools** — Tech stack and development environment
- **Testimonials** — Peer and client recommendations

## Quick Start

### 1. Create a new project

```bash
npm create astro@latest -- --template erlandv/case
```

### 2. Configure your site

```bash
cp .env.example .env
# Edit .env with your information
```

### 3. Start development

```bash
npm run dev
```

Your site is now running at [http://localhost:4321](http://localhost:4321)

## Documentation

Full documentation is available in the [`docs/`](./docs/) folder:

### Getting Started
- [Installation](./docs/01-getting-started/installation.md) — Prerequisites and setup
- [Quick Start](./docs/01-getting-started/quick-start.md) — See results in 5 minutes
- [Project Structure](./docs/01-getting-started/project-structure.md) — Understand the codebase

### Configuration
- [Configuration](./docs/02-configuration/configuration.md) — Environment variables, navigation, favicons

### Content
- [Content Guide](./docs/03-content/content-guide.md) — All content types and schemas
- [Templates](./docs/03-content/templates.md) — Copy-paste templates for quick content creation
- [Images](./docs/03-content/images.md) — Image handling and optimization
- [Content Strategy](./docs/03-content/content-strategy.md) — Best practices for featured content

### Customization
- [Styling](./docs/04-customization/styling.md) — Colors, typography, spacing, breakpoints
- [Components](./docs/04-customization/components.md) — Modifying and creating components
- [Advanced](./docs/04-customization/advanced.md) — Layouts, new content collections

### Deployment
- [Deployment](./docs/05-deployment/deployment.md) — Build and deploy to various platforms
- [Post-Deployment](./docs/05-deployment/post-deployment.md) — Verification checklist

### Reference
- [Troubleshooting](./docs/06-reference/troubleshooting.md) — Common issues and solutions

## License

Case Theme is free for personal and commercial use under the [MIT License](./LICENSE). Attribution is not required, but a link back to this repository is always appreciated if you find the theme useful.
