---
title: "Project Map & Content Customization: Where to Edit Every Section in Minrock"
description: "A developer roadmap showing the exact files to edit for your hero banner, about page, footer, social links, and metadata, followed by instant 1-click publishing."
pubDate: 2026-09-16
tags: ["architecture", "guide", "git", "workflow", "configuration"]
draft: false
---

When maintaining a personal website, you shouldn't have to hunt through dozens of deeply nested configuration files just to update your bio, social media profiles, or hero headline.

Minrock was engineered with clean separation of concerns: global site settings live in a central configuration module, while individual page layouts are declared transparently in their respective Astro files.

Here is the exact **file-by-file directory map** showing where each section of your website lives, how to edit it, and how to deploy your updates in under a minute.

---

## 1. Global Metadata & Social Links: `src/config/site.ts`

This is the primary file you should calibrate when you first set up your blog:

```text
src/config/site.ts
```

In this single file, you configure:
* **Site Identity**: `title`, `tagline`, and default meta `description`.
* **Author Details**: `author` name (your canonical URL is set separately with `SITE_URL`, see below).
* **Social Links**: Your LinkedIn profile, GitHub repository, and contact email.
* **Default Theme**: Initial color mode (`cream`, `white`, `slate`, or `midnight`).
* **Comments Integration**: Scatterleaf GitHub Discussion credentials.

```typescript
// Example from src/config/site.ts
export const siteConfig: SiteConfig = {
  title: 'Minrock',
  tagline: 'Raw ideas from your personal vault, finely polished into an ultra-fast static blog.',
  description: 'Minimalist, typography-first Astro theme.',
  author: 'Your Name',
  defaultTheme: 'cream',
  socialLinks: {
    github: 'https://github.com/your-username',
    linkedin: 'https://www.linkedin.com/in/your-profile/',
    email: 'hello@yourdomain.com'
  }
};
```

> [!IMPORTANT]
> **Set your production URL with `SITE_URL`, not by editing `siteUrl`.** Your canonical URL drives the sitemap, RSS feed, canonical tags, and `llms.txt`. Set the `SITE_URL` environment variable in your host's project settings (Vercel, Cloudflare Pages, or Netlify), for example `SITE_URL=https://your-domain.com`. For local builds, put it in a `.env` file (see `.env.example`). If you leave it unset, Minrock falls back to the demo URL.

Whenever you update `socialLinks` or `title`, the changes automatically propagate to your Header dropdown, Footer icons, RSS feed, and OpenGraph SEO cards.

---

## 2. Hero Banner & Home Page: `src/pages/index.astro`

Your home page's welcoming headline, introductory elevator pitch, and call-to-action buttons are located in:

```text
src/pages/index.astro
```

Inside the `<header class="hero-section">` element:
* **The Main Title**: Customize the bold opening statement.
* **The Bio Paragraph**: Update your current focus (e.g. *"Staff engineer writing about cloud architectures and local-first software"*).
* **CTA Buttons**: Links pointing visitors to `/blog`, `/projects`, or your `/about` page.

---

## 3. Philosophy & Bio: `src/pages/about.astro`

Your professional background, personal manifesto, tech stack, and journey are located in:

```text
src/pages/about.astro
```

Here you can customize:
* **Philosophy Principles**: The four core pillars of how you build software or write notes.
* **Tech Stack Badges**: The languages, frameworks, and tools you actively use.
* **Connect Links**: Additional social contacts and ways people can reach you.

---

## 4. Footer & Signature: `src/components/Footer.astro`

The footer appears uniformly across every page of your site:

```text
src/components/Footer.astro
```

Here you can customize:
* **The Signature**: Change the creator credit and origin flag (e.g. *"Crafted with pride in Brazil 🇧🇷"*).
* **Social Buttons**: The footer automatically pulls your links from `siteConfig.socialLinks` and renders SVGs for LinkedIn, GitHub, Email, and RSS.

---

## 5. Navigation Bar: `src/components/Header.astro`

If you want to add a new link to the top header (like a *"Resume"* or *"Now"* page):

* Open `src/config/site.ts` and add your route to `navLinks`:
  ```typescript
  navLinks: [
    { title: 'Home', href: '/' },
    { title: 'Blog', href: '/blog' },
    { title: 'Projects', href: '/projects' },
    { title: 'Tags', href: '/tags' },
    { title: 'About', href: '/about' },
    { title: 'Now', href: '/now' } // New navigation link
  ]
  ```
The header dynamically renders the new navigation item and preserves active link highlighting!

---

## 6. The 30-Second Update Workflow

Whenever you edit any of the files listed above, publishing your updates to the live web takes only two simple commands:

```bash
# 1. Stage and commit your changes
git add .
git commit -m "chore: update hero bio and social links"

# 2. Push to GitHub
git push origin main
```

*(Or, if you are working inside Obsidian, simply click the **Git Push (`↑`)** icon in the status bar).*

Your connected host (Vercel, Cloudflare Pages, or Netlify) detects the push, compiles your static bundle, and updates your site live across global CDNs in seconds.
