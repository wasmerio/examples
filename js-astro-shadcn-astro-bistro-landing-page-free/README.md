<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Bistro](https://github.com/shadcnstudio/shadcn-astro-bistro-landing-page-free) Astro theme by shadcnstudio, copied from commit `024e3b60c2cfa7b337e82191b86998b5ab969ca8` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-shadcn-astro-bistro-landing-page-free.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
- **Environment variables:** The theme's example env file lists `SITE_URL`, `EMAIL`, `LICENSE_KEY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [shadcnstudio](https://github.com/shadcnstudio), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<p align="center">
   <a href="https://shadcnstudio.com/templates/bistro-restaurant-template-free" target="_blank">
      <img src="https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/logo.png" alt="bistro-logo" width="32px" height="32px">
   </a>
</p>

<h1 align="center">
   <a href="https://shadcnstudio.com/templates/bistro-restaurant-template-free" target="_blank" align="center">
      Bistro - Shadcn UI Restaurant Landing Page Template - Free
   </a>
</h1>

<p align="start">Bistro is a free, responsive Astro landing page template crafted for restaurants, cafés, and bistros. It showcases menus, featured dishes, offers, reservation CTAs, location, and testimonials with clean, modern design.</p>

![GitHub](https://img.shields.io/github/license/shadcnstudio/shadcn-astro-bistro-landing-page-free) ![GitHub issues](https://img.shields.io/github/issues/shadcnstudio/shadcn-astro-bistro-landing-page-free) ![GitHub closed issues](https://img.shields.io/github/issues-closed/shadcnstudio/shadcn-astro-bistro-landing-page-free) ![Twitter Follow](https://img.shields.io/twitter/follow/ShadcnStudio?style=social)

<kbd>[![Bistro - Demo Screenshot](https://cdn.shadcnstudio.com/ss-assets/landing-page/template-page/template-detail-page/landing-page/bistro/og-image.png)](https://shadcnstudio.com/templates/bistro-restaurant-template-free)</kbd>

## Introduction 🍽️

Bistro is built with Astro and Tailwind CSS, offering a production-ready landing page to promote your restaurant online. It includes menu highlights, new items, offers, popular dishes, testimonials, and a clear reservation CTA.

[View Demo](https://shadcnstudio.com/preview/templates/shadcn-astro-bistro-landing-page)

[View Documentation](https://shadcnstudio.com/docs/getting-started/shadcn-studio-template-astro)

<p>
   Supported by
   <a href="https://shadcnstudio.com" target="_blank">
      Shadcn Studio
   </a>
   , with a commitment to empowering the open-source community.
</p>

## Key Features ✨

- **Restaurant-Focused Layouts** - Hero, menu highlights, featured dishes, offers, and reservation CTA
- **Menu Sections** - Categorize items with images, descriptions, and prices
- **Offers & Specials** - Promote limited-time deals and seasonal items
- **Reservations & Contact** - Reservation CTA, address, opening hours, and contact info
- **Built with Astro** - Static-first rendering, partial hydration, and lightning-fast performance with built-in SEO support
- **Tailwind CSS** - Easy theming and utility-based styling
- **Responsive & Mobile-First** - Designed to look great on all devices
- **Accessible Components** - Semantic markup and accessible UI patterns

## Page Structure & Sections

**Pages**

- **Homepage** - Hero with reservation CTA, featured dishes, and menu highlights
- **Menu Section** - Categorized menu items with images and prices
- **Offers Section** - Special deals and promotions
- **Contact / Location** - Map, address, opening hours, and contact form

**Key UI Sections**

- **Hero Section** - Large visual header with a clear reservation CTA
- **Popular Dishes** - Showcase bestsellers with images and short descriptions
- **New Items & Offers** - Highlight seasonal or promotional dishes
- **Testimonials** - Customer reviews and ratings
- **Footer** - Social links, hours, and navigation

---

<br />

<a href="https://shadcnstudio.com" target="_blank">
  <img src="https://cdn.shadcnstudio.com/ss-assets/smm/marketing/shadcn-studio-smm-banner.png" alt="shadcn/studio banner" width="1200">
</a>

<p>
   <a href="https://shadcnstudio.com" target="_blank">
      shadcn/studio
   </a>
   is an open-source collection of copy-and-paste shadcn components, blocks, and templates - paired with a powerful theme generator & AI Tools to craft, customize, and ship faster. 🚀
</p>

## Table of Contents 📋

- [Table of Contents 📋](#table-of-contents-)
- [Features ✨](#-features)
- [Project Structure 🏗️](#-project-structure)
- [Quick Start 🚀](#-quick-start)
- [Available Commands 🧞](#-available-commands)
- [Code Formatting 🎨](#-code-formatting)
- [Configuration ⚙️](#-configuration)
- [Deployment 🌐](#-deployment)
- [Documentation 📚](#documentation-)
- [Community 🤝](#community-)
- [Credits 🤘](#credits-)
- [Useful Links 🎁](#useful-links-)
- [Social Media :earth_africa:](#social-media-earth_africa)

---

## Overview 🌏

**This isn&apos;t a traditional component library or a replacement for Shadcn**. Instead, it&apos;s a unique collection offers customizable variants of components, blocks, and templates. Preview, customize, and copy-paste them into your apps with ease.

Building on the solid foundation of the Shadcn components & blocks, we&apos;ve enhanced it with custom-designed components & blocks to give you a head start. This allows you to craft, customize, and ship your projects faster and more efficiently.

### Not a standard library, but a distribution of components

Following the philosophy of Shadcn, shadcn/studio isn&apos;t a conventional &quot;install-from-NPM&quot; library. Rather, it&apos;s an open-source distribution of components designed for maximum adaptability. You can copy the code, modify styles, adjust logic, or integrate it with other tools—free from the limitations of typical libraries. This &quot;open code&quot; model empowers you to customize with confidence and creativity.

## Why should I use shadcn/studio? 💡

shadcn/ui aims to provide core components with a unique distribution system, allowing developers to copy and paste reusable, customizable UI elements directly into their codebase.

While this approach offers flexibility and control, it comes with some limitations: a lack of diverse component variants examples, limited theme customization options, and limited pre-built blocks. Additionally, its extensive customization options, though powerful, can sometimes feel overwhelming, especially for those seeking a more guided or streamlined experience.

# Shadcn + Astro — Bistro Landing Page

This project showcases a complete business website with sections for Header, Hero, Popular Dishes, About Us, Testimonials, New Items, Contact Us and Offers components.

## ✨ Features

- 🚀 **Built with Astro** - Fast, modern static site generation
- 🎨 **Shadcn Studio Components** - Beautiful, ready-to-use Tailwind CSS components
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Optimized Performance** - Fast page loads and excellent SEO
- 🔧 **TypeScript Support** - Type-safe configuration and development
- 💅 **Prettier Integration** - Automatic code formatting with Tailwind class sorting
- 🌙 **Tailwind CSS 4** - Latest Tailwind with modern features

## 🏗️ Project Structure

```text
shadcn-studio-astro-template/
├── public/                    # Public static assets
│   ├── favicon/               # Favicon files
│   ├── images/                # Public images
│   ├── _headers               # Netlify Deploy Headers
│   ├── robots.txt             # SEO crawler rules
│   └── site.webmanifest       # PWA manifest
│
├── src/
│   ├── assets/                # SVG and other assets
│   │
│   ├── components/            # Reusable UI components
│   │   └── blocks/            # Block components
│   │   └── layout/            # Layout components
│   │   └── sections/          # Data of components
│   │   └── ui/                # Base UI components
│   │
│   ├── layouts/               # Astro layout files
│   │   ├── BlankLayout.astro  # Minimal layout
│   │   ├── HeadSeo.astro      # SEO head layout
│   │   └── Layout.astro       # Main site layout
│   │
│   ├── lib/                   # Helper libraries
│   │   └── utils.ts           # Utility functions
│   │
│   ├── pages/                 # Route-based pages
│   │   ├── 404.astro          # 404 page
│   │   ├── index.astro        # Home page
│   │   ├── login.astro        # Login page
│   │   └── rss.xml.js         # RSS feed generator
│   │
│   ├── styles/
│   │   └── global.css         # Global styles
│   │
│   ├── utils/                 # Utility functions
│   │   └── seo.ts             # SEO helpers
│   └── consts.ts              # Application constants (SEO)
│
├── astro.config.mjs           # Astro configuration
├── content.config.ts          # Content collections config
├── .env.example               # Environment variable template
├── components.json            # shadcn/ui config
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18, 20, or 22+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start the development server:**

   ```bash
   pnpm run dev
   ```

   The site will be available at `http://localhost:4321`

3. **Build for production:**

   ```bash
   pnpm build
   ```

   The built site will be in the `dist/` folder with relative asset paths for easy deployment.

4. **Preview the production build:**

   ```bash
   pnpm run preview
   ```

## 🧞 Available Commands

The template comes with several pre-configured scripts to help you with development, building, and maintaining your project. All scripts can be run using your package manager of choice (npm, pnpm, yarn, or bun) from the root of the project.

| Command       | Action                                                                                                                                 |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`         | Starts the Astro development server with hot-reload enabled. Your application will be available at http://localhost:4321/              |
| `build`       | Creates an optimized production build of your application. This command generates static files and optimizes your code for deployment. |
| `preview`     | Preview production site locally. Use this to test your production build locally before deploying.                                      |
| `lint`        | Runs ESLint to check your code for potential errors and code quality issues. This helps maintain clean and consistent code.            |
| `lint:fix`    | Runs ESLint and automatically fixes problems where possible.                                                                           |
| `format`      | Formats all files using Prettier to ensure consistent code style.                                                                      |
| `check-types` | Checks TypeScript types to catch type errors before building or deploying.                                                             |

## 🎨 Code Formatting

This project uses **Prettier** for code formatting with the following features:

- **Automatic formatting on save** in VS Code
- **Tailwind CSS class sorting** - Classes are automatically sorted in the recommended order
- **Extra space removal** - Trailing whitespace and extra spaces are removed
- **Consistent code style** - Enforced across all `.astro`, `.js`, `.ts`, and `.css` files

### Setup

1. **Install recommended VS Code extensions** (you'll be prompted when opening the project):
   - Prettier - Code formatter
   - Astro
   - Tailwind CSS IntelliSense
   - EditorConfig for VS Code

2. **Formatting will work automatically** on save thanks to:
   - `.prettierrc` - Prettier configuration
   - `.editorconfig` - Editor settings
   - `.vscode/settings.json` - VS Code workspace settings

3. **Manual formatting:**

   ```bash
   pnpm run format        # Format all files
   ```

## ⚙️ Configuration

Edit `src/consts.ts` to customize your site:

```typescript
export const siteConfig = {
  creatorName: 'Shadcn Studio',
  demoName: 'Bistro',
  templateName: 'Restaurant Landing Page'
  // ... more settings
}
```

### 🔍 SEO & Site Configuration

Configure the site's SEO and global metadata in `src/consts.ts`. These settings power the `HeadSeo.astro` layout and `seo.ts` helpers so pages have correct titles, descriptions, and social previews.

Recommended fields:

- `siteTitle`: The site-wide default title.
- `siteDescription`: Default meta description for pages.
- `siteUrl`: The canonical base URL for building absolute links.
- `siteLocale`: Locale string used for html/lang and Open Graph (e.g. `en-US`).
- `siteAuthor`: Default author/creator name.
- `siteKeywords`: Array of SEO keywords.
- `socialImage`: Path to the default social preview image (OG/Twitter card).
- `faviconPath`: Path to the favicon in `/public`.
- `themeColor`: Theme color meta for browsers and PWA.
- `twitterHandle`: Official Twitter/X handle for site cards.
- `analyticsId`: Optional analytics measurement id (Google Analytics, Plausible, etc.).

Example `siteConfig` with SEO fields:

```typescript
// Example SEO & site settings — edit src/consts.ts
export const siteConfig = {
  siteTitle: 'Bistro — Restaurant Landing Page',
  siteDescription:
    'Enjoy fresh ingredients, thoughtfully prepared meals, and a welcoming space designed for memorable moments. Experience bistro dining made simple and delicious.',
  siteUrl: 'https://example.com',
  siteLocale: 'en-US',
  siteAuthor: 'Shadcn Studio',
  siteKeywords: ['bistro', 'restaurant', 'landing page', 'astro', 'shadcn'],
  socialImage: '/images/social-preview.png',
  faviconPath: '/favicon/favicon.ico',
  themeColor: '#0ea5e9',
  twitterHandle: '@ShadcnStudio',
  analyticsId: '' // optional
}
```

Tips:

- Keep `siteUrl` consistent with your deployed domain to ensure correct canonical and Open Graph URLs.
- Place social preview images in `public/images` and reference them with absolute paths (e.g. `/images/social-preview.png`).

## 🌐 Deployment

The production build creates static files with relative asset paths, making it easy to deploy to:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any static hosting service**

Simply upload the contents of the `dist/` folder after running `pnpm run build`.

## Documentation 📚

For comprehensive documentation, please visit [shadcn/studio documentation](https://shadcnstudio.com/docs/getting-started/introduction).

## Community 🤝

Join the shadcn/studio community to discuss the library, ask questions, and share your experiences:

- 🐦 [Follow us on Twitter](https://x.com/ShadCNStudio)
- 🎮 [Join us on Discord](https://discord.com/invite/kBHkY7DekX)

## Credits 🤘

We are grateful for the contributions of the open-source community, particularly:

- [shadcn/ui](https://ui.shadcn.com/)
- [tweakcn](https://tweakcn.com/) (Our Theme Generator is heavily inspired by tweakcn)

These projects form the backbone of shadcn/studio, allowing us to build a powerful copy-and-paste components.

## Useful Links 🎁

- [Shadcn Blocks](https://shadcnstudio.com/blocks)
- [Shadcn Templates](https://shadcnstudio.com/templates)
- [Shadcn Figma UI Kit](https://shadcnstudio.com/figma)
- [Shadcn Theme Generator](https://shadcnstudio.com/theme-generator)
- [Shadcn MCP Server](https://shadcnstudio.com/mcp)
- [Shadcn IDE Extension](https://shadcnstudio.com/ide-extension)
- [Shadcn Components](https://shadcnstudio.com/components)
- [Shadcn Figma to Code](https://shadcnstudio.com/figma-plugin)

## Social Media :earth_africa:

- [x](https://x.com/ShadcnStudio)
- [Discord](https://discord.com/invite/kBHkY7DekX)
- [YouTube](https://www.youtube.com/@themeselection)
