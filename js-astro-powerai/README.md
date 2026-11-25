<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [PowerAI Astro](https://github.com/sitepins/powerai-astro) Astro theme by sitepins, copied from commit `a1176bf882bf0b1af98115f3280c2a6928e69261` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-powerai.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml, wrangler.jsonc.
  - The theme has no lockfile, so this folder adds a package-lock.json generated with npm.
- **Environment variables:** None.
- **Credit:** theme by [sitepins](https://github.com/sitepins), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<h1 align=center>PowerAI Astro - A Free AI SaaS Website Template</h1>

<p align=center> PowerAI Astro is a free, dark-themed AI SaaS website template built with Astro, Tailwind CSS, TypeScript, and React. Designed for AI product teams, SaaS founders, and agencies who need a complete, launch-ready web presence. It ships with 15+ pre-built unique pages, 47 components and shortcodes, Framer Motion animations, and full MDX support. Ready to deploy on Cloudflare Workers, Vercel, Netlify, or Docker.

<p align=center>
  <a href="https://powerai-astro.pages.dev/">
    <img width="1920" height="1080" alt="powerai-astro-free-ai-saas-website-template-built-with-astro" src="https://github.com/user-attachments/assets/f3e93268-c11a-47e3-b3b8-17eb5cf09992" />
  </a>
</p>
</p>


<p align="center">
  Made with ♥ by <a href="https://sitepins.com/?utm_source=github&utm_medium=readme&utm_campaign=powerai_astro&aff=poweraiastro">Sitepins CMS</a> 
  &nbsp; | &nbsp;
  <a href="https://powerai-astro.pages.dev/">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20Site-blue?style=for-the-badge&logo=cloudflare" alt="Live Demo" valign="middle">
  </a>
  &nbsp; | &nbsp;
  <a target="_blank" href="https://app.sitepins.com/new/clone?name=PoweraiAstro&repository=https://github.com/sitepins/powerai-astro&aff=poweraiastro">
    <img src="https://sitepins.com/button.svg" alt="Edit with Sitepins" valign="middle">
  </a>
</p>


## 💎 Key Features 

* **16 pre-built pages** covering every section a modern AI SaaS product needs: homepage, features, pricing, blog, case studies, careers, integrations, changelog, contact, and more
* **47 components, partials, and shortcodes** including animated buttons, pricing tables, video modals, testimonials, and MDX-ready interactive elements
* **Framer Motion animations** (v12) for scroll-triggered reveals, transitions, and micro-interactions throughout
* **Built with Astro 6, Tailwind CSS 4, TypeScript, and React 19** for minimal JavaScript output and a modern, type-safe codebase
* **MDX shortcodes** for embedding accordions, tabs, notices, video players, and YouTube players directly in content
* **Git-based CMS integration** via Sitepins for visual content editing without touching code
* **Pre-configured for Cloudflare Workers, Netlify, and Docker** with zero additional setup
* **Fully responsive** across desktops, tablets, and smartphones
* **Highly customizable** colors, fonts, navigation, social links, and SEO meta tags via JSON config files
* **Fully SEO optimized** with clean semantic markup and meta tag support
* **Astro Content Collections** for type-safe content management across blog posts, case studies, careers, and integrations
* **Free Google Fonts** and React Icons included
* **MIT licensed** for personal and commercial use

## 👥 Who is PowerAI Astro for?

* **AI product founders and SaaS teams.** If you're shipping an AI tool, developer platform, or SaaS product and need a site that covers features, pricing, case studies, and careers all in one template, PowerAI Astro has every page pre-built and ready to fill in.

* **Agencies and freelancers working on AI client projects.** The JSON-based config system, clean folder structure, and Sitepins CMS integration make it practical to hand off to non-technical clients. Customize the theme once and ship for multiple projects under the MIT license.

* **Developers who want a full-featured starting point, not a bare skeleton.** With 47 components already built and wired up, Framer Motion animations ready to go, and Cloudflare Workers deployment preconfigured, you're writing product copy instead of boilerplate from day one.

* **Content teams who need editorial control without a developer in the loop.** The Sitepins integration and MDX shortcode library let writers publish blog posts, case studies, and job listings visually, without touching source files.

## 📄 15+ Pre-built Pages

1. Home
2. Pricing
3. Features
4. Changelog
5. About Us
6. Contact
7. Blog
8. Blog Details
9. Careers
10. Career Details
11. Case Studies
12. Case Study Details
13. Integrations
14. Integration Details
15. Error (404)
16. Regular Content Pages (e.g., Privacy Policy, Terms of Service)

## 🧩 Components, Partial & Shortcodes (47)

| Components (24)          | Partials (16)                        | Shortcodes (7)     |
|--------------------------|--------------------------------------|--------------------|
| Accordion                | Call To Action                       | MDX Accordion      |
| Animated Button          | Essential Features                   | MDX Button         |
| Badge                    | FAQ (Frequently Asked Questions)     | Notice (Alert box) |
| Blog Card                | Footer                               | Tab (Single Tab pane) |
| Career Card              | Gallery                              | Tabs (Tab group container) |
| Case Study Card          | Header (Navigation layout)           | Video Player       |
| Contact Form             | Integration View                     | YouTube Player     |
| Counter                  | Key Features                         |                    |
| Featured Case Study      | Open Positions (Careers)             |                    |
| Featured Post            | Our Team                             |                    |
| Hero                     | Page Header                          |                    |
| Icon Box                 | Pricing Section                      |                    |
| Integration List         | Testimonials                         |                    |
| Logo                     | Trusted Clients (Client logos)       |                    |
| Main Container           | Our Goals                            |                    |
| Pagination               | Why Choose Us                        |                    |
| Pricing Card             |                                      |                    |
| Pricing Table            |                                      |                    |
| Section Header           |                                      |                    |
| Share (Social Share links) |                                    |                    |
| Social (Social Media Icons) |                                   |                    |
| Statistics               |                                      |                    |
| Tailwind Size Indicator  |                                      |                    |
| Video Modal              |                                      |                    |


## 🔗 Main Technology Stacks

*   **astro** v6.0.4
*   **tailwind** v4.2.1
*   **react** v19.2.4
*   **vite** v8.0.0
*   **typescript** v5.9.3
*   **mdx** (@astrojs/mdx) v5.0.0
*   **motion** (framer-motion) v12.0.0
*   **prettier** v3.8.1
*   **wrangler** v4.73.0 _(for Cloudflare Workers deployment)_
*   **date-fns** v4.1.0
*   **marked** v17.0.4
*   **sharp** v0.34.5
*   **react-icons** v5.6.0

## 🚀 Getting Started

### How to get started

- Download or clone the repository from GitHub
- Run `yarn install` to install dependencies
- Run `yarn run dev` to start the local development server
- Update `src/config/config.json` with your site name, base URL, and favicon
- Edit `src/config/theme.json` to set your brand colors and fonts
- Replace placeholder content in `src/content/` with your own pages, posts, and case studies
- Run `yarn run build` and deploy to Cloudflare Workers, Netlify, or your preferred platform

### 📦 Dependencies

- astro v5.15+
- node v22.0+
- yarn v1.22+
- tailwind v4+

## 🚀 Deployment

This project supports multiple deployment options. Choose the one that best fits your needs.

### ☁️ Cloudflare Workers/Pages

Deploy to Cloudflare's global network for optimal performance and low latency.

#### Prerequisites

- [Cloudflare Account](https://dash.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

#### Deploy to Cloudflare Workers

```bash
# Install Wrangler CLI (if not already installed)
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Deploy to production
yarn deploy:cf-workers
```

#### Preview Locally with Cloudflare

```bash
yarn preview:cf-workers
```

This will start a local development server that mimics the Cloudflare Workers environment.

### 🌐 Netlify

Deploy to Netlify for easy CI/CD and global CDN.

#### Automatic Deployment

1. Connect your GitHub repository to [Netlify](https://netlify.com)
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`
4. Deploy!

````

### 🐳 Docker

Deploy using Docker containers for consistent environments.

#### Build and Run With Docker

```bash
docker build -t powerai-astro .
# or
# docker build --build-arg INSTALLER=npm -t powerai-astro .
# or
# docker build --build-arg INSTALLER=pnpm -t powerai-astro .

docker run -p 3000:80 powerai-astro
# or
# docker run --rm -p 3000:80 powerai-astro
````

To access the shell within the container:

```bash
docker run -it --rm powerai-astro ash
```

<!-- edit with sitepins -->

## 📝 Edit Content with CMS

This template comes pre-configured with [**Sitepins**](https://sitepins.com/?utm_source=github&utm_medium=readme&utm_campaign=powerai_astro&aff=poweraiastro), a Git-based Headless CMS designed for seamless content management. You can update your website’s content, assets, and configuration without touching a single line of code.

**How to get started:**

Click the Edit with Sitepins button below and follow the on-screen instructions to start editing your content visually.

  <a target="_blank" href="https://app.sitepins.com/new/clone?name=PoweraiAstro&repository=https://github.com/sitepins/powerai-astro&aff=poweraiastro">
    <img src="https://sitepins.com/button.svg" alt="Edit with Sitepins">
  </a>

## 📁 Project Structure

```
powerai-astro/
├── public/                  # Static assets (images, icons, fonts)
│   └── images/
├── scripts/                 # Build scripts
│   ├── themeGenerator.js    # Generates CSS from theme.json
│   └── jsonGenerator.js     # Generates JSON search index
├── src/
│   ├── config/              # Site configuration
│   │   ├── config.json      # Site settings, metadata, GTM
│   │   ├── menu.json        # Navigation menu structure
│   │   ├── social.json      # Social media links
│   │   └── theme.json       # Colors, fonts, sizing
│   ├── content/             # Markdown content (Astro Content Collections)
│   │   ├── homepage/        # Homepage content
│   │   ├── blog/            # Blog posts
│   │   ├── case-studies/    # Case study entries
│   │   ├── careers/         # Job listings
│   │   ├── integrations/    # Integration pages
│   │   ├── sections/        # Reusable section content (CTA, FAQ, etc.)
│   │   └── pages/           # Regular pages (privacy, terms)
│   ├── layouts/
│   │   ├── Base.astro       # Main HTML layout
│   │   ├── components/      # UI components (.astro + .tsx)
│   │   │   ├── animations/  # Motion animation wrappers
│   │   │   └── shape/       # SVG decorative shapes
│   │   ├── helpers/         # Helper components (DynamicIcon, etc.)
│   │   ├── partials/        # Page sections (Header, Footer, etc.)
│   │   └── shortcodes/      # MDX shortcodes (Accordion, Tabs, etc.)
│   ├── lib/                 # Utility libraries
│   │   ├── animations.ts    # Animation variant definitions
│   │   ├── contentParser.ts # Content loading utilities
│   │   └── utils/           # Helper functions
│   ├── pages/               # Astro file-based routing
│   ├── styles/              # CSS files
│   │   ├── main.css         # Main entry point
│   │   ├── base.css         # Base/reset styles
│   │   ├── buttons.css      # Button styles
│   │   ├── components.css   # Component styles
│   │   ├── navigation.css   # Nav/header styles
│   │   └── utilities.css    # Utility classes
│   ├── types/               # TypeScript type definitions
│   └── content.config.ts    # Astro content collection config
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## ⚙️ Configuration

### Site Settings (`src/config/config.json`)

```json
{
  "site": {
    "title": "Power AI",
    "base_url": "https://your-domain.com",
    "favicon": "/images/favicon.png"
  },
  "settings": {
    "pagination": 3,
    "sticky_header": true
  }
}
```

### Theme Customization (`src/config/theme.json`)

Customize colors, fonts, and sizing:

```json
{
  "colors": {
    "default": {
      "theme_color": {
        "primary": "#8F2FFE",
        "secondary": "#DF53FE",
        "body": "#0E0912",
        "card": "#151019"
      }
    }
  },
  "fonts": {
    "font_family": {
      "primary": "Inter:wght@300;400;500;600"
    }
  }
}
```

### Navigation (`src/config/menu.json`)

Supports regular links, dropdowns, and mega menus:

```json
{
  "main": [
    { "name": "Home", "url": "/" },
    { "name": "Features", "url": "/features" },
    {
      "name": "Pages",
      "hasChildren": true,
      "mega_menu": { ... }
    }
  ]
}
```

## 📝 Adding Content

### Blog Posts

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "Post description"
image: "/images/blog/your-image.png"
category: "Technology"
author:
  name: "Author Name"
  avatar: "/images/avatars/avatar.jpg"
date: 2026-01-01
draft: false
featured: false
---

Your markdown content here...
```

### Case Studies

Create a new `.md` file in `src/content/case-studies/`:

```markdown
---
title: "Case Study Title"
description: "Brief description"
image: "/images/case-studies/image.png"
logo: "/images/case-studies/logo.png"
date: 2026-01-01
featured: false
---

Case study content...
```

### Career Listings

Create a new `.md` file in `src/content/careers/`:

```markdown
---
title: "Job Title"
description: "Role description"
job_info:
  employ_type: "Full-time"
  experience: "3+ years"
  salary_range: "$80k - $120k"
  location: "Remote"
  department: "Engineering"
  deadline: "2026-12-31"
---

Job details...
```

## 🐞 Reporting Issues

Found a bug? Please [open an issue](https://github.com/sitepins/powerai-astro/issues).

## 📝 License

Copyright (c) 2026 - Present, Designed by [Sitepins CMS](https://sitepins.com/?utm_source=github&utm_medium=readme&utm_campaign=powerai_astro&aff=poweraiastro)

**Code License:** Released under the [MIT](https://github.com/sitepins/powerai-astro/blob/main/LICENSE) license.
