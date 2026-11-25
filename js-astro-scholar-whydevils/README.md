<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Y Astro Scholar](https://github.com/whydevils/astro-scholar) Astro theme by whydevils, copied from commit `99b4c5db777e20438c5f047505bf6f855719089f` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-scholar-whydevils.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed the GitHub Pages sub-path `base: '/astro-scholar'` from astro.config.mjs, so assets load at the root of the Wasmer app.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [whydevils](https://github.com/whydevils), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Scholar

**[Live demo](https://whydevils.github.io/astro-scholar)**


Built with [Astro](https://astro.build). Simple, fast, easy to configure and extend. Pages for introduction, publications, presentations, and a blog.

## 🚀 Getting started

**The fastest path** is to fork this repo, edit the files listed below, and push to GitHub. The site deploys automatically to GitHub Pages — no local setup needed.

If you want to preview or build locally, you'll need [Node.js 18+](https://nodejs.org/en/download):

```bash
npm install
npm run dev        # http://localhost:4321
```

## ✏️ What to change

### 1. Your details — `src/constants.ts`

Name, tagline, and social links. Set any field to `""` to hide it.

### 2. Portrait — `src/assets/portrait.png`

Replace with your own photo. Ideally square, 400×400px or larger.

### 3. Pages — `src/pages/`

Each `.astro` file is a page. Edit them directly:

- `index.astro` — homepage
- `about.astro` — bio, positions, education, awards
- `publications.astro` — the filter UI (data is in `src/data/publications.json`)
- `presentations.astro` — talks and slides

### 4. Publications — `src/data/publications.json`

```json
{
  "id": 1,
  "title": "Paper Title",
  "authors": "You, Coauthor A",
  "journal": "Journal or Conference Name",
  "year": 2025,
  "link": "https://...",
  "authorship": "first",
  "abstract": "...",
  "doi": "10.xxxx/xxxxx",
  "publicationType": "Journal"
}
```

`authorship`: `"first"`, `"last"`, or `"other"`. Drives the authorship filter.
`publicationType`: any string — `"Journal"`, `"Conference"`, `"Preprint"`, `"Book Chapter"`, etc. Each unique value becomes a filter button.

See `src/data/README.md` for full field details.

### 5. Blog posts — `src/pages/blog/`

Add a `.md` file per post:

```markdown
---
layout: '../../layouts/BlogPost.astro'
title: 'Post Title'
date: '2025-06-01'
description: 'One sentence shown on the index.'
tags: ['methodology', 'field-notes']
---

Post content here.
```

Tags become clickable filters on the blog index. Keep them lowercase and hyphenated, and reuse them across posts so the filter is useful.

Images go in `public/images/blog/`. In markdown files you cannot use `BASE_URL`, so the path must include your base manually:
- Root deployment (`username.github.io`): `/images/blog/filename.png`
- Sub-path deployment (`username.github.io/repo-name`): `/repo-name/images/blog/filename.png`

### 6. Adding or removing pages

Any `.astro` file in `src/pages/` becomes a route. To add a page, copy an existing one and add a link in `src/components/Navigation.astro`. To remove one, delete the file and remove its nav link.

### 7. Colours and fonts

Accent colour and font are set in `src/styles/global.css`. The font is loaded from Google Fonts — swap the import and the `font-family` declaration to change it.

## 🌐 Deployment

### GitHub Pages

Push to `main` and GitHub Actions deploys automatically (workflow at `.github/workflows/deploy.yaml`).

**One-time setup:** in your repo go to **Settings → Pages → Build and deployment** and set the source to **GitHub Actions** (not "Deploy from a branch"). Without this, pushes will not trigger a deployment.

Edit `astro.config.mjs` to match your deployment URL:

**Root domain** (repo named `your-github-username.github.io` → `https://your-github-username.github.io`):

```javascript
export default defineConfig({
  site: 'https://your-github-username.github.io',
});
```

**Sub-path** (any other repo name → `https://your-github-username.github.io/repo-name`):

```javascript
export default defineConfig({
  site: 'https://your-github-username.github.io',
  base: '/repo-name/',
});
```

### Other hosts

[Netlify](https://netlify.com), [Vercel](https://vercel.com), and [Cloudflare Pages](https://pages.cloudflare.com) all support Astro with minimal configuration. Or build with `npm run build` and upload `dist/` anywhere.

## 📁 Project structure

```
src/
├── constants.ts              # Name, tagline, social links
├── assets/portrait.png       # Profile picture
├── data/publications.json    # Publications
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── publications.astro
│   ├── presentations.astro
│   └── blog/
│       ├── index.astro
│       └── *.md
├── layouts/
│   ├── Layout.astro
│   └── BlogPost.astro
├── components/
└── styles/
public/
├── presentations/            # HTML slide decks
├── posters/
└── images/blog/              # Blog post images
```

## 📄 License

MIT — see [LICENSE](LICENSE).

Created by [whydevils](https://github.com/whydevils).
