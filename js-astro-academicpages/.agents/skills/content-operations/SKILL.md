---
name: academicpages-content-operations
description: Operational runbook for adding publications, talks, teaching, blog posts, and updating CV or author profiles in Academic Pages Astro
---

# Academic Pages Astro Content Operations Skill ✍️

Operational runbook for AI coding assistants managing routine academic content, authoring publications, writing blog posts, and updating CV sections.

> 📚 **Canonical Reference Guides**:
>
> - **[Site Configuration (`docs/CONFIG.md`)](../../../docs/CONFIG.md)**: Profile handles, navigation items, and SEO settings
> - **[Content Authoring (`docs/CONTENT.md`)](../../../docs/CONTENT.md)**: Complete Zod frontmatter schemas, file naming conventions, action badges, and 1-click BibTeX
> - **[Markdown & Math Reference (`docs/MARKDOWN.md`)](../../../docs/MARKDOWN.md)**: KaTeX mathematical formulas, code highlighting, alert callouts, and Mermaid diagrams

---

## 1. Content Operations Protocol

Follow these guidelines when adding or modifying site content:

### Content Collections (`src/content/`)

Follow the exact schemas and templates in [`docs/CONTENT.md`](../../../docs/CONTENT.md):

- **Publications (`src/content/publications/`)**: Author entries using [`docs/CONTENT.md#3-publications-srccontentpublications`](../../../docs/CONTENT.md#3-publications-srccontentpublications). Populate action badges (`pdf_url`, `paper_url`, `slides_url`, `code_url`, `bibtex`) and wrap math titles in `$...$`
- **Talks (`src/content/talks/`)**: Author entries using [`docs/CONTENT.md#4-talks--presentations-srccontenttalks`](../../../docs/CONTENT.md#4-talks--presentations-srccontenttalks)
- **Teaching (`src/content/teaching/`)**: Author entries using [`docs/CONTENT.md#5-teaching-srccontentteaching`](../../../docs/CONTENT.md#5-teaching-srccontentteaching)
- **Portfolio (`src/content/portfolio/`)**: Author entries using [`docs/CONTENT.md#6-portfolio-projects-srccontentportfolio`](../../../docs/CONTENT.md#6-portfolio-projects-srccontentportfolio)
- **Blog Posts (`src/content/blog/`)**: Author entries using [`docs/CONTENT.md#7-blog-posts-srccontentblog`](../../../docs/CONTENT.md#7-blog-posts-srccontentblog)
- **Static Pages (`src/content/pages/`)**: Author custom pages using [`docs/CONTENT.md#8-static-pages-srccontentpages`](../../../docs/CONTENT.md#8-static-pages-srccontentpages)

### Mathematical Typesetting & Markdown Formatting

Follow [`docs/MARKDOWN.md`](../../../docs/MARKDOWN.md) for inline math (`$...$`), display equations (`$$...$$`), table formatting, and Mermaid diagrams.

### Profile & CV Updates

- **CV Sections**: Edit structured sections in `src/pages/cv.astro` (Education, Appointments, Awards, Service)
- **Profile & Handles**: Edit `src/data/siteConfig.ts` following [`docs/CONFIG.md`](../../../docs/CONFIG.md)
- **Navigation Links**: Edit `src/data/navigation.ts` to reorder or toggle menu items

---

## 2. Verification Pipeline

Always verify changes after modifying content:

```bash
# Verify linting, formatting, and TypeScript types
pnpm verify

# Build static production site
pnpm build
```
