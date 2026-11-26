<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Academic Pages Astro](https://github.com/arghyadipchak/academicpages-astro) Astro theme by arghyadipchak, copied from commit `aee8ebb9fbb0fd14397f6eddbf3866b66d9f9c06` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-academicpages.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [arghyadipchak](https://github.com/arghyadipchak), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 🎓 Academic Pages — Astro Edition

[![CI](https://img.shields.io/github/actions/workflow/status/arghyadipchak/academicpages-astro/ci.yml?logo=github-actions&logoColor=white)](https://github.com/arghyadipchak/academicpages-astro/actions/workflows/ci.yml)
[![GitHub Release](https://img.shields.io/github/v/release/arghyadipchak/academicpages-astro?logo=github&logoColor=white&color=0969da)](https://github.com/arghyadipchak/academicpages-astro/releases/latest)
[![Astro 7](https://img.shields.io/badge/Astro-v7-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen?logo=git&logoColor=white)](https://commitizen.github.io/cz-cli/)
[![License](https://img.shields.io/github/license/arghyadipchak/academicpages-astro?color=8250DF)](LICENSE)

A modern, high-performance academic personal website and portfolio template built with **Astro 7**, **TypeScript**, and **Tailwind CSS v4**, ported from the classic [academicpages](https://github.com/academicpages/academicpages.github.io) Jekyll theme.

🌐 **Live Demo**: [arghyadipchak.github.io/academicpages-astro](https://arghyadipchak.github.io/academicpages-astro)

---

## ✨ Features

- ⚡ **Blazing Fast**: 100% static HTML generation with sub-second page loads and zero client-side JavaScript framework bloat
- 🎨 **Modern Aesthetic & Dark Mode**: Classic Academic Pages aesthetic modernized with 32 built-in light/dark theme presets, custom 5-token palettes, and automatic OS preference fallback
- 📚 **Strict Content Collections**: Zod-validated schemas for publications (with 1-click BibTeX), talks, teaching, portfolio projects, and KaTeX blog posts
- 🔍 **Instant Search (`Cmd + K`)**: Fast, lightweight client-side fuzzy search across all publications, talks, teaching, portfolio items, blog posts, and pages
- 📐 **Mathematical Rigor ($\LaTeX$ / KaTeX)**: Fast, static server-side math rendering across Markdown content, frontmatter titles, and archive listings via KaTeX
- 🌐 **Scholarly SEO & Syndication**: Google Scholar and Highwire Press citation meta tags, RSS 2.0 (`/rss.xml`), RSS feed alias (`/feed.xml`), XML sitemaps, and crawlers index (`/robots.txt`)
- 🤖 **AI-Native & Agent Ready**: Pre-equipped with turnkey prompts, specialized agent skills (`.agents/skills/`), and machine-readable `/llms.txt` indexing
- 📱 **Exhaustive Sidebar**: Sticky author profile on desktop supporting **50+ academic, code, and social platforms** with responsive mobile drawer
- 🧪 **Comprehensive Test Suite**: Automated Playwright browser tests covering desktop and mobile viewports
- 🛠️ **Editor & Cloud Ready**: Pre-configured for **VS Code** (`.vscode/`), **Zed** (`.zed/`), and **GitHub Codespaces** (`.devcontainer/`)

---

## 🛠️ Tech Stack

| Layer                  | Technologies                                                                                  |
| :--------------------- | :-------------------------------------------------------------------------------------------- |
| **Framework**          | [Astro 7](https://astro.build/)                                                               |
| **Language**           | [TypeScript 5](https://www.typescriptlang.org/) (Strict mode)                                 |
| **Styling & Design**   | [Tailwind CSS v4](https://tailwindcss.com/)                                                   |
| **Math Engine**        | [KaTeX](https://katex.org/) (via `remark-math`, `rehype-katex`, and `marked-katex-extension`) |
| **Icons**              | [Astro Icon](https://www.astro-icon.dev/) (`academicons`, `fa6-brands`, `fa6-solid`)          |
| **Search Engine**      | Fast client-side fuzzy search (`/api/search.json`)                                            |
| **Testing**            | [Playwright](https://playwright.dev/) (Desktop & Mobile Chrome)                               |
| **Automation & CI/CD** | GitHub Actions (`ci.yml`, `release.yml`), Dependabot, `git-cliff`                             |
| **Package Manager**    | [pnpm](https://pnpm.io/)                                                                      |

---

## 🚀 Quick Start

### ⚡ One-Click Cloud Development

Launch an instant cloud development environment with zero local setup:

[![Open in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-0969DA?logo=github&logoColor=white)](https://codespaces.new/arghyadipchak/academicpages-astro)
[![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/arghyadipchak/academicpages-astro)

### 💻 Local Development

#### 1. Prerequisites

- [Node.js](https://nodejs.org/) `>= 22.11.0` (Node 22, 24, or 26+)
- [pnpm](https://pnpm.io/) `>= 11.0.0`

#### 2. Installation

```bash
# 1. Clone the repository
git clone https://github.com/arghyadipchak/academicpages-astro.git
cd academicpages-astro

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev
```

Visit `http://localhost:4321` in your browser

---

## 🛠️ Commands

| Command             | Description                                                      |
| :------------------ | :--------------------------------------------------------------- |
| `pnpm dev`          | Starts the Astro development server at `localhost:4321`          |
| `pnpm build`        | Compiles production static HTML to `dist/`                       |
| `pnpm preview`      | Previews the production build locally                            |
| `pnpm typecheck`    | Runs Astro TypeScript typechecking                               |
| `pnpm verify`       | Runs quality gate checks (`lint` + `format:check` + `typecheck`) |
| `pnpm test`         | Runs the Playwright automated browser test suite                 |
| `pnpm format`       | Formats all code with Prettier and Tailwind class sorter         |
| `pnpm format:check` | Checks code formatting without writing changes                   |
| `pnpm lint`         | Runs ESLint 10 code quality checks                               |
| `pnpm lint:fix`     | Runs ESLint 10 autofix                                           |

---

## ⚙️ AI Prompt Playbook & Customization Guide

If you use an AI coding assistant (**Antigravity**, **Cursor**, **Claude Code**, or **GitHub Copilot**), use these turnkey prompts across each stage of your site's lifecycle:

### 🚀 Stage 1: Initial Onboarding & Personalization (One-Time)

Copy and paste this prompt to personalize your entire website in one step:

> [!TIP]
> **Stage 1 Prompt — Site Onboarding**:
>
> ```markdown
> Please personalize this academic portfolio website for me by following `.agents/skills/onboarding/SKILL.md` and `docs/ONBOARDING.md`:
>
> - CV / Resume: [Files in `cv/` (LaTeX `.tex`, Markdown, PDF, or text), or paste text/link]
> - Google Scholar: [Profile URL or ID, or leave blank]
> - GitHub: [Username or URL, or leave blank]
> - LinkedIn: [Profile URL, or leave blank]
> - Existing / Old Website: [URL or directory path of old Jekyll/Hugo/WordPress site, or leave blank]
> - Other Profiles / Links: [e.g. ORCID, Twitter/X, ResearchGate, personal lab page]
> ```

---

### ✍️ Stage 2: Routine Content Authoring (Ongoing)

Use these turnkey prompts to add new academic items into your collections:

<details open>
<summary><b>📄 Adding a Publication</b></summary>

```markdown
Please add a new publication to `src/content/publications/` following `.agents/skills/content-operations/SKILL.md` and `docs/CONTENT.md`:

- Title: [Paper title, e.g. "Deep Learning for Mathematical Reasoning $\mathcal{M}$"]
- Category: [conferences | journals | books]
- Venue: [e.g. "NeurIPS 2025"]
- Date: [YYYY-MM-DD]
- Authors: [List of authors, with asterisks for co-first authors if applicable]
- Links / Badges: [PDF URL, publisher/arXiv paper URL, GitHub code URL, slides URL]
- BibTeX: [Raw BibTeX snippet or leave blank to generate from metadata]
- Abstract / Summary: [Paste paper abstract or notes]
```

</details>

<details>
<summary><b>🎤 Adding Talks & Presentations</b></summary>

```markdown
Please add a new talk to `src/content/talks/` following `.agents/skills/content-operations/SKILL.md` and `docs/CONTENT.md`:

- Title: [Talk title]
- Type: [Keynote Talk | Conference Talk | Workshop Tutorial | Seminar]
- Date: [YYYY-MM-DD]
- Venue: [Event name, host institution, and location]
- Slides URL: [Local `/files/slides.pdf` or external URL]
- Abstract / Links: [Brief description, talk outline, or recording/event links for the page body]
```

</details>

<details>
<summary><b>🎓 Adding Teaching & Courses</b></summary>

```markdown
Please add a new course to `src/content/teaching/` following `.agents/skills/content-operations/SKILL.md` and `docs/CONTENT.md`:

- Title: [Course title, e.g. "Introduction to Machine Learning"]
- Year: [e.g. 2026]
- Semester: [Autumn | Fall | Spring | Summer | Winter]
- Type: [Undergraduate Course | Graduate Course | Workshop]
- Venue: [Department or university name]
- Description: [Course description, office hours, syllabus outline, and links]
```

</details>

<details>
<summary><b>📝 Writing a Blog Post with Math</b></summary>

```markdown
Please create a new blog post in `src/content/blog/` following `.agents/skills/content-operations/SKILL.md` and `docs/MARKDOWN.md`:

- Title: [Post title, supports inline math like $E=mc^2$]
- Date: [YYYY-MM-DD]
- Tags: [List of tags]
- Description: [Brief summary for SEO and feed]
- Topic / Draft: [Topic outline, equations to typeset in KaTeX, and key takeaways]
```

</details>

---

### 🔄 Stage 3: Upstream Template Upgrades (Maintenance)

When new releases are published in `academicpages-astro`, update your site with:

> [!TIP]
> **Stage 3 Prompt — Template Synchronization**:
>
> ```markdown
> Please upgrade my website with the latest template improvements from `academicpages-astro` following `.agents/skills/template-sync/SKILL.md` and `docs/SYNC.md`.
> ```

---

## 📚 Documentation & Operational Matrix

This repository is organized around a canonical **3-phase operational lifecycle** with dedicated reference guides and automated agent skills:

| Lifecycle Phase              | Focus Area                              | Technical Reference                      | Operational Skill                                                                  |
| :--------------------------- | :-------------------------------------- | :--------------------------------------- | :--------------------------------------------------------------------------------- |
| **1. Onboarding (One-Time)** | Profile discovery, demo purge & setup   | [docs/ONBOARDING.md](docs/ONBOARDING.md) | [`.agents/skills/onboarding/`](.agents/skills/onboarding/SKILL.md)                 |
| **2. Configuration**         | Site metadata, 50+ handles & navigation | [docs/CONFIG.md](docs/CONFIG.md)         | —                                                                                  |
| **2. Content Authoring**     | Collections, frontmatter & BibTeX       | [docs/CONTENT.md](docs/CONTENT.md)       | [`.agents/skills/content-operations/`](.agents/skills/content-operations/SKILL.md) |
| **2. Markdown & Math**       | KaTeX equations, callouts & Mermaid     | [docs/MARKDOWN.md](docs/MARKDOWN.md)     | —                                                                                  |
| **3. Synchronization**       | Tag-to-tag whole-codebase upgrades      | [docs/SYNC.md](docs/SYNC.md)             | [`.agents/skills/template-sync/`](.agents/skills/template-sync/SKILL.md)           |

> 🤖 **Master AI Constitution**: For strict engineering standards, quality gate workflows, and agent rules, see [**AGENTS.md**](AGENTS.md)

---

## 🚢 Deployment to GitHub Pages

1. In your GitHub repository settings, go to **Settings** $\rightarrow$ **Pages**
2. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**
3. Set your deployment `url` in `src/data/siteConfig.ts` (see [docs/CONFIG.md](docs/CONFIG.md#3-base-url--deployment-resolution-astroconfigts) for user vs project site details)
4. Push to `main` — `.github/workflows/ci.yml` will automatically verify, build, and publish the site

---

## 🤝 Contributing & Community

Contributions are welcome! Please check out the following resources before contributing:

- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Development workflow, quality gate verification, and Conventional Commit guidelines
- **[SECURITY.md](SECURITY.md)**: Security policy and vulnerability disclosure instructions
- **[GitHub Discussions](https://github.com/arghyadipchak/academicpages-astro/discussions)**: Q&A, feature discussions, and community showcase

---

## 🙏 Acknowledgements & Credits

Academic Pages Astro is built upon the foundational work of the open-source community:

- **[Academic Pages (Jekyll)](https://github.com/academicpages/academicpages.github.io)** — The classic academic website template created by [Stuart Geiger](https://github.com/stuartgeiger) and contributors
- **[Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)** — The flexible Jekyll theme created by [Michael Rose](https://github.com/mmistakes)
- **[Astro](https://astro.build)** — The web framework for content-driven websites
- **[Tailwind CSS](https://tailwindcss.com)** — The utility-first CSS framework

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © 2026 [Arghyadip Chakraborty](https://github.com/arghyadipchak). Derived from [academicpages](https://github.com/academicpages/academicpages.github.io)
