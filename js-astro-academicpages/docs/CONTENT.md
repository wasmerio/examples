# ✍️ Content Authoring Guide (`CONTENT.md`)

This guide details how to write, structure, name, and organize content across all Astro content collections in `academicpages-astro`.

---

## 1. Directory Structure & File Naming Conventions

All content collections live in `src/content/`. Astro Content Layer validates every entry against schemas defined in [`src/content.config.ts`](../src/content.config.ts).

| Collection       | Directory                   | Recommended Naming | URL Route                    |
| :--------------- | :-------------------------- | :----------------- | :--------------------------- |
| **Publications** | `src/content/publications/` | `paper-title.md`   | `/publications/[...slug]/`   |
| **Talks**        | `src/content/talks/`        | `talk-title.md`    | `/talks/[...slug]/`          |
| **Teaching**     | `src/content/teaching/`     | `course-name.md`   | `/teaching/[...slug]/`       |
| **Portfolio**    | `src/content/portfolio/`    | `project-name.md`  | `/portfolio/[...slug]/`      |
| **Blog Posts**   | `src/content/blog/`         | `post-title.md`    | `/posts/[...slug]/`          |
| **Pages**        | `src/content/pages/`        | `page-slug.md`     | Rendered on dedicated routes |

### URL Slugs & Breadcrumbs Generation

- **URL Slugs**: The Markdown filename directly determines the route URL (e.g. `src/content/blog/neural-networks.md` $\rightarrow$ `/posts/neural-networks/`)
- **Permalink Override**: You can optionally specify `permalink: /custom/path/` in the frontmatter to override the default route
- **Breadcrumbs Hierarchy**: When `breadcrumbs: true` is enabled in `src/data/siteConfig.ts`, breadcrumbs dynamically parse the URL path (e.g. `Home / Posts / Neural Networks`)
- **Segment Formatting**: Slug delimiters (hyphens `-` and underscores `_`) are converted to spaces, each word is capitalized in Title Case (`neural-networks` $\rightarrow$ `Neural Networks`), and known acronyms (`CV`, `API`, `RSS`, `FAQ`, `PDF`, `HTML`, `JSON`, `XML`) are automatically capitalized in uppercase

---

## 2. Universal Frontmatter Fields

The following base properties are available across content collections and static pages (defined in `baseContentSchema` and `layoutSchema` in `src/content.config.ts`):

| Field            | Type         | Required      | Description                                                                              |
| :--------------- | :----------- | :------------ | :--------------------------------------------------------------------------------------- |
| `title`          | `string`     | **Yes**       | Item title (supports inline KaTeX math, e.g. `$E=mc^2$`)                                 |
| `description`    | `string`     | No            | Short summary for SEO meta tags, social cards, and live search (`Cmd+K`)                 |
| `date`           | `YYYY-MM-DD` | _Collections_ | Publication or event date (required on publications, talks, blog, portfolio)             |
| `author_profile` | `boolean`    | No            | Shows author bio sidebar on desktop and follow toggle on mobile (default: `true`)        |
| `toc`            | `boolean`    | No            | Renders retractable Table of Contents when 2+ `h2`/`h3` headings exist (default: `true`) |
| `image`          | `string`     | No            | Optional hero or card preview banner path (e.g. `/images/project.png`)                   |
| `permalink`      | `string`     | No            | Custom URL slug override (supported on content collections in `baseContentSchema`)       |

---

## 3. Publications (`src/content/publications/`)

Research papers, preprints, books, and conference articles.

### Unique Fields

| Field        | Type     | Description                                                                            |
| :----------- | :------- | :------------------------------------------------------------------------------------- |
| `category`   | `enum`   | Category filter tab (`books`, `journals`, `conferences`)                               |
| `venue`      | `string` | Journal or conference name                                                             |
| `citation`   | `string` | Formatted academic citation (supports Markdown and math)                               |
| `pdf_url`    | `string` | Local download path (`/files/paper.pdf`) or external PDF link for the `[PDF]` badge    |
| `paper_url`  | `string` | Fallback external publisher, DOI, or preprint link for `[PDF]` when `pdf_url` is unset |
| `slides_url` | `string` | Slides presentation link                                                               |
| `code_url`   | `string` | Code repository link                                                                   |
| `bibtex`     | `string` | Raw BibTeX entry rendered with an interactive 1-click copy badge                       |

### Example

```markdown
---
title: High-Throughput Learning of Neural Potentials
date: 2026-03-15
description: A scalable deep learning framework for molecular dynamics
category: journals
venue: Nature Machine Intelligence
citation: 'Doe, J., & Smith, A. (2026). "High-Throughput Learning of Neural Potentials." *Nature Machine Intelligence*, 8(3), 200-215.'
pdf_url: /files/paper1.pdf
slides_url: /files/slides1.pdf
code_url: https://github.com/username/project
bibtex: |
  @article{Doe2026,
    title   = {High-Throughput Learning of Neural Potentials},
    author  = {Doe, Jane and Smith, Alex},
    journal = {Nature Machine Intelligence},
    year    = {2026},
    volume  = {8},
    pages   = {200--215}
  }
---

Detailed abstract, methodology, results, and discussion go here. Standard Markdown, figures, and KaTeX math ($E=mc^2$) are fully supported.
```

---

## 4. Talks & Presentations (`src/content/talks/`)

Keynotes, conference talks, seminar presentations, and tutorials.

### Unique Fields

| Field        | Type     | Description                                                               |
| :----------- | :------- | :------------------------------------------------------------------------ |
| `type`       | `string` | Talk format (e.g. `Keynote Talk`, `Conference Talk`, `Workshop Tutorial`) |
| `venue`      | `string` | Event name, host institution, and location                                |
| `slides_url` | `string` | Presentation slides link                                                  |

### Example

```markdown
---
title: Scalable Graph Transformers for Protein Design
date: 2026-05-20
description: Keynote presentation on graph representation learning in biology
type: Keynote Talk
venue: International Conference on Machine Learning (ICML 2026), Vienna, Austria
slides_url: /files/slides2.pdf
---

Talk summary, abstract, slide embed, or related video links.
```

---

## 5. Teaching (`src/content/teaching/`)

Undergraduate and graduate courses, guest lectures, and workshops.

### Unique Fields

| Field      | Type     | Description                                                               |
| :--------- | :------- | :------------------------------------------------------------------------ |
| `year`     | `number` | Academic year (e.g. `2026`)                                               |
| `semester` | `enum`   | Semester term (`Autumn`, `Fall`, `Spring`, `Summer`, `Winter`)            |
| `type`     | `string` | Course level (e.g. `Undergraduate Course`, `Graduate Course`, `Workshop`) |
| `venue`    | `string` | Department or university name                                             |

### Example

```markdown
---
title: 'CS 229: Machine Learning & Scientific Computing'
year: 2026
semester: Spring
description: Graduate-level introduction to statistical learning and optimization
type: Graduate Course
venue: Department of Computer Science, University of Science
---

Course syllabus, grading policy, office hours, and lecture materials.
```

---

## 6. Portfolio Projects (`src/content/portfolio/`)

Software libraries, datasets, open-source projects, and research artifacts.

### Unique Fields

| Field        | Type     | Description                                         |
| :----------- | :------- | :-------------------------------------------------- |
| `timeline`   | `string` | Project active duration (e.g. `Aug 2025 – Present`) |
| `venue`      | `string` | Organization, lab, or institution name              |
| `pdf_url`    | `string` | Documentation or report link                        |
| `slides_url` | `string` | Presentation slides link                            |
| `code_url`   | `string` | Source code repository link                         |

### Example

```markdown
---
title: Neural Force Fields Library
date: 2025-08-01
timeline: Aug 2025 – Present
description: Open-source PyTorch framework for molecular simulation
venue: AI for Science Lab
image: /images/project-1.svg
pdf_url: https://example.com/paper.pdf
code_url: https://github.com/username/project
---

Overview of the project, features, architectural diagram, and installation guide.
```

---

## 7. Blog Posts (`src/content/blog/`)

Articles, research thoughts, and release announcements.

### Unique Fields

| Field       | Type         | Description                                                  |
| :---------- | :----------- | :----------------------------------------------------------- |
| `modified`  | `YYYY-MM-DD` | Last updated date                                            |
| `read_time` | `boolean`    | Displays estimated reading time badge (default: `true`)      |
| `tags`      | `string[]`   | Array of topic tags                                          |
| `draft`     | `boolean`    | Set to `true` to hide from listings, sitemaps, and RSS feeds |

### Example

```markdown
---
title: Accelerating Scientific Discovery with Agentic AI
date: 2026-04-10
modified: 2026-04-12
description: How AI pair programmers streamline scientific experimentation
tags:
  - AI
  - Research
  - Tooling
read_time: true
toc: true
draft: false
---

Post content with full Markdown, math equations, code blocks, and diagrams.
```

---

## 8. Static Pages (`src/content/pages/`)

Static markdown pages for the homepage biography, institutional requirements, legal disclaimers, or standalone pages:

- `about.md`: Homepage biography and research overview rendered on `/` by `src/pages/index.astro`
- `terms.md`: Academic terms of use, content licensing, and privacy notices linked in the global footer (`/terms/`)

### Creating Custom Static Pages

1. Create a markdown entry in `src/content/pages/<slug>.md`:

   ```markdown
   ---
   title: Research Statement
   description: Institutional research overview and future directions
   ---

   Page content with markdown formatting, KaTeX math equations, and diagrams.
   ```

2. Create the corresponding Astro route in `src/pages/<slug>.astro`:

   ```astro
   ---
   import { getEntry, render } from 'astro:content';

   import PageLayout from '@layouts/PageLayout.astro';

   const entry = await getEntry('pages', '<slug>');
   if (!entry) throw new Error("Missing '<slug>' page in content/pages");

   const { Content } = await render(entry);
   ---

   <PageLayout
     title={entry.data.title}
     description={entry.data.description}
     authorProfile={entry.data.author_profile}
     toc={entry.data.toc}
     image={entry.data.image}
   >
     <Content />
   </PageLayout>
   ```

---

## 9. Rich Media, Diagrams & Mathematical Formatting

Academic Pages Astro supports KaTeX math, interactive Mermaid diagrams, Plotly scientific charts, callouts, and syntax-highlighted code blocks across all markdown entries.

For the comprehensive syntax reference and formatting examples, see [`docs/MARKDOWN.md`](MARKDOWN.md)
