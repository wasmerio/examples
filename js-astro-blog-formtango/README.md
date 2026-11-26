<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Blog Formtango](https://github.com/formtango/astro-blog-template) Astro theme by formtango, copied from commit `75970d25dadd7c3418d8ef38b2d3f6d46c0ef13b` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-blog-formtango.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `SITE_URL`, `BASE_PATH`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [formtango](https://github.com/formtango), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro blog template

A reading-first personal blog for [Astro](https://astro.build), with a newsletter signup and a contact form that work on any static host. No server, no UI framework, no database.

**[Live demo](https://formtango.github.io/astro-blog-template/)**

## Features

- An editorial design with its own character: a large lead post, numbered entries, a margin column and drop caps
- Light and dark themes that follow the system, with a switch that remembers the choice
- Posts in Markdown, with tags, reading time and earlier/later links
- A newsletter signup on the home page and under every post, and a contact page, both handled by [FormTango](https://formtango.com): submissions arrive in an inbox and by email, with spam filtered out
- RSS feed and sitemap
- Self-hosted fonts (Newsreader and Bricolage Grotesque), no external requests, no images to replace
- Accessible and responsive from 360px: skip link, labeled inputs, visible focus, reduced-motion support
- Builds to plain static files and works in a subfolder such as GitHub Pages

## Quick start

You need Node 22.12 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:4321. To build the static site into `dist/`:

```bash
npm run build
```

## Add a post

Create a Markdown file in `src/content/posts/`. The file name becomes the address, so `my-first-post.md` is published at `/posts/my-first-post/`.

```markdown
---
title: My first post
description: One sentence that sums it up. Shown in lists and in search results.
date: 2026-12-01
tags: [Notes]
---

Write here.
```

Add `draft: true` to keep a post out of the site until it is ready.

## Make the forms work

Until you do this, both forms run in demo mode and say so when submitted.

1. Get a form address for each form. Sign up free at https://formtango.com (1,000 submissions a month), or create one with no account. Run this once per form:

   ```bash
   curl -X POST https://formtango.com/api/v1/claims \
     -H "Content-Type: application/json" -d '{"name":"Newsletter"}'
   ```

   The reply contains an `endpoint` (the form address) and a `claimUrl`. Open the claim link to see submissions and turn on email notifications.

2. Paste the two addresses into `src/forms.ts`:

   ```ts
   export const NEWSLETTER_FORM = 'https://formtango.com/f/YOUR_NEWSLETTER_FORM_ID';
   export const CONTACT_FORM = 'https://formtango.com/f/YOUR_CONTACT_FORM_ID';
   ```

That is all. The forms are plain HTML, so they also work with JavaScript turned off.

## Deploy

The build is a folder of static files, so any static host works. Two optional environment variables tell the site where it lives:

| Variable    | What it is                      | Default               |
| ----------- | ------------------------------- | --------------------- |
| `SITE_URL`  | The origin the site is served from | `https://example.com` |
| `BASE_PATH` | The folder it lives in          | `/`                   |

Set `SITE_URL` to your real address so the RSS feed, sitemap and canonical links are correct. You can also put both in a `.env` file (see `.env.example`).

- **Netlify, Vercel, Cloudflare Pages:** import the repository. Build command `npm run build`, output folder `dist`. Add `SITE_URL` in the project's environment variables.
- **GitHub Pages:** in your repository go to Settings, then Pages, and set the source to GitHub Actions. Copy `docs/github-pages-workflow.yml` to `.github/workflows/deploy.yml`; it builds on every push to `main` and sets both variables for you. To build by hand for a project site:

  ```bash
  SITE_URL=https://you.github.io BASE_PATH=/astro-blog-template/ npm run build
  ```

## Customize

- **Name, author and navigation:** `src/site.ts`.
- **Colors, fonts and sizes:** the first block of `src/styles/global.css`. The dark theme is right below it.
- **About and contact text:** `src/pages/about.astro` and `src/pages/contact.astro`.
- **Home page layout:** `src/pages/index.astro`.
- **More form fields:** add inputs with a `name` and a label. They are sent automatically.
- **Links:** build internal links with `link()` from `src/lib/url.ts` so they keep working under a base path.

Working with an AI coding agent? `AGENTS.md` tells it how the project and its forms are set up.

## License

MIT. No attribution needed, though the footer link is appreciated.
