---
title: Academic Pages Astro is a modern, high-performance starter template for academic personal websites
---

This website is powered by the **[Academic Pages Astro template](https://github.com/arghyadipchak/academicpages-astro)** and hosted on GitHub Pages. Built with **Astro 7**, **TypeScript**, and **Tailwind CSS v4**, this template provides blazing-fast load times, strict type safety, and all the content features needed for academic careers: publications, talks, teaching, portfolios, blog posts, and a dynamically-generated CV.

You can fork [this template](https://github.com/arghyadipchak/academicpages-astro) right now, customize the configuration and Markdown files, add your own PDFs and media, and deploy your site for free!

A modern, type-safe academic website
======

Academic Pages Astro strictly separates your website's content from its layout. The content and metadata of your website live in structured Markdown files validated by Astro Content Collections and Zod schemas, while Astro components specify how to render that content into static HTML pages.

Features & Built-in Capabilities
------

- ⚡ **Astro 7 + Tailwind CSS v4**: Zero client JS by default, sub-second builds, and modern `@theme` design tokens
- 📚 **Academic Content Collections**: Structured collections for `publications`, `talks`, `teaching`, `portfolio`, `blog`, and `pages`
- 📋 **1-Click BibTeX Copy & Downloads**: Direct clipboard copy and badge links for papers, slide decks, and citation records
- 🎓 **Google Scholar & Highwire Press SEO**: Automatic citation meta tags for instant indexing by academic search engines
- 📐 **KaTeX Mathematical Typesetting**: Fast, server-rendered LaTeX math equations (e.g. $E = mc^2$ or $\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$)
- 🔍 **Real-Time Client Search (`Cmd+K`)**: Keyboard-navigable modal search across all publications, talks, teaching, portfolio items, blog posts, and pages
- 🌓 **Dark & Light Mode**: Instant theme switching with 32 built-in presets and zero flash of unstyled content

Getting started
======

1. Fork [this template on GitHub](https://github.com/arghyadipchak/academicpages-astro) by clicking the **"Use this template"** button
2. Clone your repository locally and install dependencies:

   ```bash
   pnpm install
   ```

3. Start the local development server:

   ```bash
   pnpm dev
   ```

4. Customize your information in `src/data/siteConfig.ts` and navigation items in `src/data/navigation.ts`
5. Add your publications and talks in `src/content/publications/` and `src/content/talks/`
6. Push to GitHub — the built-in GitHub Actions workflow will automatically build and deploy your site to GitHub Pages

Site-wide configuration
------

The main configuration file for the site is in **`src/data/siteConfig.ts`**, which defines the sidebar author profile, social links, and global SEO metadata. The top navigation menu is configured in **`src/data/navigation.ts`**.

Adding your content
------

All content is organized into type-safe content directories inside `src/content/`:

- **Publications**: `src/content/publications/*.md` (with fields for `category`, `venue`, `citation`, `pdf_url`, `paper_url`, `slides_url`, `code_url`, `bibtex`)
- **Talks & Presentations**: `src/content/talks/*.md` (with fields for `venue`, `type`, `date`, `slides_url`)
- **Teaching**: `src/content/teaching/*.md` (with fields for `venue`, `type`, `year`, `semester`)
- **Blog Posts**: `src/content/blog/*.md`
- **Portfolio Projects**: `src/content/portfolio/*.md` (with fields for `timeline`, `venue`, `date`, `pdf_url`, `slides_url`, `code_url`, `image`)

For more info
------

More documentation and guides can be found in the [Markdown guide](/markdown/) and on the [GitHub repository](https://github.com/arghyadipchak/academicpages-astro)
