# 2026 Static Site Template Specification

> **One source of truth** for building a modern static site template using Astro 6, Tailwind v4, Starwind UI, Playwright, and Netlify. Every section is written as a directive an AI agent can follow verbatim.

---

## 1. Purpose & Philosophy

This template is a **general-purpose business website starter** — the kind agencies clone per client for service businesses, portfolios, and local companies. It replaces the CodeStitch Intermediate Kit (Eleventy 3 + LESS + Decap CMS).

### Core Principles

1. **Zero JS by default.** Astro ships pure HTML. JavaScript only loads inside explicit `client:*` islands.
2. **Utility-first CSS.** Tailwind v4 with CSS-variable theming. No custom preprocessor, no BEM, no LESS.
3. **Copy-owned components.** Starwind UI components live in the project source. No black-box node_modules UI.
4. **Type-safe everything.** TypeScript strict mode. Zod-validated content schemas. `astro:env` typed env vars.
5. **Near-100 Lighthouse.** Every architectural decision targets Performance 100, Accessibility 100, Best Practices 100, SEO 100.
6. **Deploy-ready.** One `git push` to Netlify. Branch previews, image CDN, and forms work out of the box.
7. **Fast to develop.** Scaffold a new page or blog post with one command. Hot reload in <200ms.

---

## 2. Tech Stack

| Package | Version | Role |
|---|---|---|
| `astro` | `^6.0` | Static site generator, zero-JS output, Content Layer, View Transitions |
| `@astrojs/tailwind` | `^6` | Astro integration for Tailwind v4 |
| `tailwindcss` | `^4` | Utility-first CSS framework, CSS-variable theming |
| `@tailwindcss/typography` | `^0.5` | Prose styling for blog post markdown content |
| `@astrojs/sitemap` | `^3` | Auto-generates `sitemap.xml` from static routes |
| `@astrojs/netlify` | `^6` | Netlify adapter (static + optional edge/serverless) |
| `astro-robots-txt` | `^1` | Auto-generates `robots.txt` |
| `starwind` | `latest` | Tailwind v4 native, Astro-native copy-owned component library |
| `typescript` | `^5.7` | Strict mode type checking |
| `@playwright/test` | `^1.50` | E2E testing, visual regression, accessibility auditing |
| `@axe-core/playwright` | `^4` | Accessibility testing via axe-core inside Playwright |

### Not Included (and why)

- **No React/Vue/Svelte** — zero-JS pages don't need a framework runtime.
- **No Decap CMS** — Astro Content Layer with file-based `glob` loader replaces it. Swap in any CMS loader later.
- **No LESS/Sass** — Tailwind v4 handles all styling via utilities and CSS variables.
- **No esbuild config** — Astro uses Vite 7 internally with zero config.

### Node & Runtime Requirements

- **Node 22.12.0 or higher** is required. Astro 6 dropped Node 18 and Node 20 support.
- Set this in `.nvmrc`: `22.12.0`
- Set `NODE_VERSION = "22"` in `netlify.toml` build environment.

---

## 3. Project Structure

```
/
├── astro.config.mjs              # Astro config (integrations, adapter, image, fonts)
├── tailwind.config.ts            # Only if customization exceeds @theme inline
├── tsconfig.json                 # TypeScript strict config (extends astro/tsconfigs/strict)
├── netlify.toml                  # Build command, publish dir, redirects, headers
├── package.json
├── playwright.config.ts          # Playwright test config
├── public/                       # Static assets copied verbatim (favicons, robots.txt override)
│   ├── favicons/
│   │   ├── favicon.svg
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── site.webmanifest
│   └── _redirects                # Netlify redirect rules
├── scripts/                      # Dev utility scripts
│   ├── create-page.ts            # Scaffold a new page
│   └── create-post.ts            # Scaffold a new blog post
├── src/
│   ├── assets/                   # Processed assets (images optimized by Astro at build)
│   │   ├── images/               # Source jpg/png/webp — Astro generates avif/webp variants
│   │   └── svgs/                 # SVG files imported as Astro components
│   ├── components/               # Reusable .astro components
│   │   ├── ui/                   # Starwind UI components (button, card, etc.)
│   │   ├── Head.astro            # <head> with SEO, OG, JSON-LD, fonts, favicons
│   │   ├── Nav.astro             # Site navigation (mobile + desktop)
│   │   ├── Footer.astro          # Site footer
│   │   ├── CTA.astro             # Reusable call-to-action section
│   │   ├── Banner.astro          # Inner page hero/banner
│   │   └── DarkModeToggle.astro  # Dark mode toggle island
│   ├── content/                  # Content collections (Astro Content Layer)
│   │   └── blog/                 # Markdown blog posts
│   │       ├── first-post.md
│   │       ├── second-post.md
│   │       └── third-post.md
│   ├── content.config.ts         # Collection definitions + Zod schemas (at src/ root, NOT src/content/)
│   ├── data/                     # Global data files
│   │   └── client.ts             # Business name, phone, address, socials, domain
│   ├── layouts/                  # Page layouts
│   │   ├── BaseLayout.astro      # Master HTML shell (Head, Nav, <slot />, Footer)
│   │   └── PostLayout.astro      # Blog post layout (extends BaseLayout)
│   ├── pages/                    # File-based routing
│   │   ├── index.astro           # Homepage
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── reviews.astro
│   │   ├── projects/
│   │   │   ├── index.astro       # Projects listing
│   │   │   └── [slug].astro      # Dynamic project pages
│   │   └── blog/
│   │       ├── index.astro       # Blog listing
│   │       └── [...slug].astro   # Dynamic blog post pages from content collection
│   └── styles/
│       └── global.css            # @import "tailwindcss"; @theme block; base layer overrides
├── tests/
│   ├── visual/                   # Playwright visual regression tests
│   │   └── pages.spec.ts
│   ├── a11y/                     # Accessibility tests
│   │   └── audit.spec.ts
│   └── smoke/                    # Network, 404, form submission tests
│       └── smoke.spec.ts
└── .env.example                  # Template env vars (SITE_URL, etc.)
```

---

## 4. Bootstrap Commands

Run these commands in order to create the project from scratch:

```bash
# 0. Verify Node version (must be 22.12.0+)
node -v
# If needed: nvm use 22 or nvm install 22

# 1. Create Astro project
npm create astro@latest -- --template minimal --typescript strict --install --git

# 2. Install Astro integrations
npx astro add tailwind sitemap netlify

# 3. Install additional packages
npm install astro-robots-txt @tailwindcss/typography

# 4. Initialize Starwind UI (copy-owned components into src/components/ui/)
npx starwind@latest init --defaults --pro
npx starwind add button card

# 5. Install Playwright for testing
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium

# 6. Create directory structure
mkdir -p src/{assets/{images,svgs},components/ui,content/blog,data,layouts,pages/{projects,blog},styles}
mkdir -p public/favicons scripts tests/{visual,a11y,smoke}

# 7. Create .nvmrc
echo "22.12.0" > .nvmrc
```

---

## 5. astro.config.mjs

In Astro 6, `fonts`, `responsiveImages`, and `svg` are **stable features** — they no longer require an `experimental` block.

```js
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://www.example.com",
  output: "static",

  integrations: [
    tailwindcss(),
    sitemap(),
  ],

  adapter: netlify({
    imageCDN: true,
  }),

  // Fonts API — stable in Astro 6, no longer behind experimental flag
  // fontProviders is imported from "astro/config" (not from a sub-path)
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-heading",
      weights: [700, 900],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-body",
      weights: [400, 500, 700],
      styles: ["normal"],
    },
  ],

  image: {
    // Responsive images with srcset/sizes are stable in Astro 6
    // Use layout prop on <Image>: "constrained" | "full-width" | "fixed"
    domains: [],
    remotePatterns: [],
  },

  // SVG component imports are stable in Astro 6 — no experimental flag needed
  // import Logo from "../assets/svgs/logo.svg" works natively

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
```

### Config Notes

- `output: "static"` — fully pre-rendered. Add `export const prerender = false` to any route that needs SSR.
- `adapter: netlify()` — even for static sites, enables Netlify Image CDN transforms and future edge routes.
- `imageCDN: true` — rewrites `<Image>` src to `/.netlify/images?url=...` for on-the-fly CDN transforms.
- `fonts` (top-level, stable) — downloads and self-hosts fonts at build time, generates `<link rel="preload">`, computes fallback font metrics. Import `fontProviders` from `"astro/config"`.
- `<Image layout="...">` (stable) — `layout` prop replaces the old `fit` prop for responsive images. Values: `"constrained"`, `"full-width"`, `"fixed"`.
- SVG imports (stable) — import `.svg` files as Astro components. No config flag needed.
- `prefetch.prefetchAll` — prefetches all same-origin links on viewport entry for near-instant navigation.
- **Removed in Astro 6:** All `experimental` flags for fonts, responsiveImages, svg, headingIdCompat, preserveScriptOrder, staticImportMetaEnv. Do not include an `experimental` block for these.
- **Vite 7** is the underlying build tool. No separate vite config needed for basic projects.

---

## 6. Tailwind v4 Setup

### `src/styles/global.css`

```css
@import "tailwindcss";

/* Static design tokens — colors, spacing, type scale */
@theme {
  /* Color palette — maps to the old CodeStitch CSS vars */
  --color-primary: #ff6a3e;
  --color-primary-light: #ffba43;
  --color-secondary: #ffba43;

  --color-header: #1a1a1a;
  --color-body: #4e4b66;
  --color-body-white: #fafbfc;

  /* Dark mode palette */
  --color-dark: #082032;
  --color-dark-medium: #2c394b;
  --color-dark-accent: #334756;

  /* Fluid type scale */
  --text-topper: clamp(0.8125rem, 1.6vw, 1rem);
  --text-title: clamp(1.9375rem, 3.9vw, 3.0625rem);
  --text-body: 1rem;

  /* Fluid spacing */
  --spacing-section: clamp(3.75rem, 7.82vw, 6.25rem);

  /* Container */
  --container-max: 80rem;
}

/*
  @theme inline is required when referencing Astro-generated CSS variables
  (like --font-heading / --font-body from the Fonts API) because those
  variables are injected at runtime and cannot be resolved at build time.
  This tells Tailwind to emit the var() reference directly, not inline the value.
*/
@theme inline {
  --font-heading: var(--font-heading), "Inter", system-ui, sans-serif;
  --font-body: var(--font-body), "Inter", system-ui, sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-body);
    color: var(--color-body);
    transition: background-color 0.3s;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    line-height: 1.2;
    color: var(--color-header);
  }

  /* Dark mode base overrides */
  .dark body,
  body.dark-mode {
    background-color: var(--color-dark);
    color: var(--color-body-white);
  }

  .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6,
  body.dark-mode h1, body.dark-mode h2, body.dark-mode h3,
  body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 {
    color: var(--color-body-white);
  }
}
```

### Key Tailwind v4 Patterns

- **No `tailwind.config.ts` needed** for basic theming. The `@theme` block in CSS replaces it.
- **`@theme` vs `@theme inline`:** Use `@theme` for static tokens (colors, spacing). Use `@theme inline` for values that reference other CSS variables (like Astro font variables) — this prevents Tailwind from trying to resolve the `var()` at build time.
- **Dark mode:** Use the `dark:` variant. Controlled via `class` strategy on `<html>`. Example: `class="bg-white dark:bg-dark"`.
- **Fluid type:** Use custom properties in `@theme` with `clamp()`. Reference via `text-[--text-title]` or define as `--text-*` tokens.
- **Typography plugin:** Apply `prose` class to blog post content containers for automatic markdown styling.

---

## 7. Component Architecture

### `src/layouts/BaseLayout.astro`

```astro
---
import Head from "../components/Head.astro";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import { ClientRouter } from "astro:transitions";
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  schema?: Record<string, unknown>;
}

const { title, description, image, canonicalUrl, schema } = Astro.props;
---

<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <Head {title} {description} {image} {canonicalUrl} {schema} />
    <ClientRouter />
    <slot name="head" />
  </head>
  <body class="font-body text-body bg-white dark:bg-dark transition-colors">
    <a class="sr-only focus:not-sr-only focus:absolute focus:z-[99999] focus:bg-primary focus:text-white focus:p-4" href="#main">
      Skip to main content
    </a>
    <Nav />
    <main id="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### `src/components/Head.astro`

In Astro 6 the Fonts API is stable. Add the `<Font>` component (imported from `astro:assets`) inside `<head>` to inject preload links and `@font-face` declarations for all registered fonts.

```astro
---
import { Font } from "astro:assets";
import { client } from "../data/client";

interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  schema?: Record<string, unknown>;
}

const { title, description, image, canonicalUrl, schema } = Astro.props;
const resolvedImage = image || "/favicons/og-default.png";
const resolvedCanonical = canonicalUrl || `${client.domain}${Astro.url.pathname}`;
---

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content={description} />
<link rel="canonical" href={resolvedCanonical} />
<meta name="generator" content={Astro.generator} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={resolvedCanonical} />
<meta property="og:image" content={resolvedImage} />
<meta name="twitter:card" content="summary_large_image" />

<!-- Favicons -->
<link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/favicons/site.webmanifest" />

<!--
  Astro 6 Fonts API: <Font> injects preload links + @font-face CSS for each
  font registered in astro.config.mjs. The preload prop is critical for the
  LCP font (heading/body) — it tells the browser to fetch the font file early.
  Add one <Font> tag per cssVariable defined in your fonts config.
-->
<Font cssVariable="--font-heading" preload />
<Font cssVariable="--font-body" preload />

<!-- JSON-LD Structured Data -->
{schema && (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
)}

<title>{title}</title>
```

### `src/components/Nav.astro`

Props: none (reads `Astro.url.pathname` for active state). Contains:
- Fixed header bar with logo, navigation links, dropdown support, CTA button, dark mode toggle.
- Mobile: hamburger menu with slide-in drawer.
- Desktop: horizontal nav with hover dropdowns.
- Uses `transition:persist` to keep nav state across View Transitions.
- Active link detection: `Astro.url.pathname.startsWith(href)` adds `aria-current="page"`.

### `src/components/Footer.astro`

Props: none (reads `client` data). Contains:
- Logo, description paragraph, social links.
- Navigation columns mirroring the header nav.
- Contact info section (phone, email, address from `client.ts`).
- Dark background by default — no dark mode variant needed.

### `src/components/CTA.astro`

```astro
---
interface Props {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

const {
  title = "Get It Done Right",
  description = "Ready to get started? Contact us today for a free consultation.",
  buttonText = "Contact Us",
  buttonHref = "/contact",
} = Astro.props;
---
```

Background image with dark overlay, centered text, primary CTA button. Reused on most inner pages via `<CTA />`.

### `src/components/Banner.astro`

```astro
---
interface Props {
  title: string;
  backgroundImage?: ImageMetadata;
}
---
```

Inner page hero banner with breadcrumb navigation generated from `Astro.url.pathname`.

### `src/components/DarkModeToggle.astro`

This is the **only interactive island** in the template. Uses `client:load` directive.

```astro
---
// No props — reads/writes localStorage and toggles .dark-mode on <html>
---

<button
  id="dark-mode-toggle"
  aria-label="Toggle dark mode"
  class="relative w-12 h-12 bg-transparent border-none cursor-pointer"
>
  <!-- Sun and Moon SVG icons with CSS transition -->
</button>

<script>
  const toggle = document.getElementById("dark-mode-toggle")!;
  const html = document.documentElement;

  function applyTheme(dark: boolean) {
    html.classList.toggle("dark-mode", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  // Initialize from localStorage or system preference
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored ? stored === "dark" : prefersDark);

  toggle.addEventListener("click", () => {
    applyTheme(!html.classList.contains("dark-mode"));
  });
</script>
```

**FOUC prevention:** Add this inline script in `BaseLayout.astro` `<head>` before any stylesheet:

```html
<script is:inline>
  (function() {
    const t = localStorage.getItem("theme");
    if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark-mode");
    }
  })();
</script>
```

---

## 8. Content Collections

**Astro 6 requirement:** The config file must live at `src/content.config.ts` (at the `src/` root). The old path `src/content/config.ts` is removed and will cause a build error. All legacy `type: 'content'` collections must be updated to use `loader: glob(...)`.

**Zod import in Astro 6:** Import `z` from `"astro/zod"`, NOT from `"astro:content"`. The `z` export from `astro:content` is deprecated and removed in Astro 6.

### `src/content.config.ts`

```ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default("Team"),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
```

### Zod 4 Changes in Astro 6

Astro 6 ships with Zod 4. Key differences from Zod 3:

- String format validators moved to top-level: use `z.email()` instead of `z.string().email()`
- Error messages use `error` key: `z.string().min(5, { error: "Too short." })` (not `message`)
- Default values must match the **output** type (after transforms), not the input type
- `z.default()` short-circuits parsing when input is `undefined`

### Blog Post Frontmatter Example

```md
---
title: "How to Choose the Right Contractor"
description: "A practical guide to vetting contractors for your home renovation."
author: "Jane Smith"
date: 2026-03-10
image: "./contractor-guide.jpg"
imageAlt: "Contractor reviewing blueprints"
tags: ["guides", "renovation"]
---

Post content here. Supports full markdown + any Astro components via MDX if needed later.
```

### Querying Collections

```astro
---
import { getCollection } from "astro:content";

// In Astro 6, Content Layer entries use .id (not .slug)
const posts = (await getCollection("blog", ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
```

---

## 9. SEO System

### Per-Page SEO

Every page passes `title` and `description` to `BaseLayout.astro`, which forwards them to `Head.astro`. The Head component generates:

- `<title>` tag
- `<meta name="description">`
- `<link rel="canonical">` (auto-derived from `client.domain` + current path)
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- Twitter card meta (`twitter:card`)

### JSON-LD Structured Data

Pass a `schema` prop to `BaseLayout` on pages that need it:

```astro
<BaseLayout
  title="Home | My Business"
  description="..."
  schema={{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": client.name,
    "telephone": client.phoneForTel,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": client.address.lineOne,
      "addressLocality": client.address.city,
      "addressRegion": client.address.state,
      "postalCode": client.address.zip,
      "addressCountry": client.address.country,
    },
    "url": client.domain,
  }}
>
```

### Sitemap

`@astrojs/sitemap` auto-generates `sitemap.xml` from all static pages. No config needed beyond setting `site` in `astro.config.mjs`.

### Robots.txt

`astro-robots-txt` generates `robots.txt` automatically. Default config allows all crawlers and references the sitemap.

### URL Slug Rules

Follow the project's SEO slug guidelines:
- Lowercase, hyphens only: `/services/auto-insurance-california`
- 3-5 words, primary keyword first
- No stop words, no dates, no underscores
- Hierarchical: `/blog/how-to-choose-insurance`

---

## 10. Image Strategy

### When to Use Each

| Component | Use Case |
|---|---|
| `<Image>` from `astro:assets` | Single images. Auto-optimizes to WebP, sets `width`/`height`, `loading="lazy"`, `decoding="async"`. |
| `<Picture>` from `astro:assets` | When you need AVIF + WebP + JPEG fallback, or different art-directed crops per breakpoint. |
| SVG import (experimental) | Icons and logos. `import Logo from "../assets/svgs/logo.svg"` then `<Logo class="w-10 h-10" />`. Inlines directly into HTML. |
| `<img>` (plain) | Never use for local images. Only for external/dynamic URLs where Astro can't process at build time. |

### Responsive Images (Stable in Astro 6)

Responsive image support is **stable in Astro 6** — no `experimental` flag needed. Use the `layout` prop on `<Image>` to get auto-generated `srcset` and `sizes`:

```astro
---
import { Image } from "astro:assets";
import hero from "../assets/images/hero.jpg";
---

<!-- layout="constrained": scales down from max width, never scales up -->
<Image src={hero} alt="Hero image" width={1920} height={1080} layout="constrained" loading="eager" fetchpriority="high" />

<!-- layout="full-width": always fills its container width -->
<Image src={banner} alt="Banner" width={1920} height={600} layout="full-width" loading="lazy" />

<!-- layout="fixed": fixed pixel dimensions, no responsive scaling -->
<Image src={logo} alt="Logo" width={160} height={40} layout="fixed" />
```

`layout` replaces the old `fit` prop which was **removed in Astro 6**. Do not use `fit="cover"` — use `layout` instead.

Astro injects CSS using `data-astro-image` attributes to handle `object-fit` and `object-position`. No manual CSS needed.

### Rules

1. **Hero/LCP images:** Always set `loading="eager"` and `fetchpriority="high"`.
2. **All other images:** Default `loading="lazy"` (Astro sets this automatically).
3. **Always provide `alt` text.** Empty `alt=""` only for decorative images.
4. **Always provide `width` and `height`** — prevents CLS. Astro enforces this for local images.
5. **Use local imports** for all images in `src/assets/images/`. Astro hashes and optimizes them.
6. **SVG imports (stable):** `import Logo from "../assets/svgs/logo.svg"` then `<Logo />` — no config flag needed in Astro 6.
7. **SVG format guard:** When an image source might be an SVG, pass the format conditionally to avoid format conversion errors: `format={src.format === "svg" ? "svg" : "avif"}`.

### Netlify Image CDN

When deployed to Netlify with `imageCDN: true` in the adapter config, Astro rewrites image `src` attributes to `/.netlify/images?url=...&w=...&q=...` for on-the-fly CDN transforms. This means:
- Images are served from Netlify's edge CDN with automatic format negotiation (AVIF/WebP).
- No build-time image processing needed for remote images.
- Cache headers are set automatically.

---

## 11. Font Strategy

### Astro 6 Fonts API (Stable)

The Fonts API is **stable in Astro 6** — it is no longer behind an `experimental` flag. Configure in `astro.config.mjs` at the top level using `fonts: [...]` with `fontProviders` imported from `"astro/config"` (see Section 5).

What it does automatically:
1. Downloads font files at build time. No runtime request to Google Fonts — no user data sent to third parties.
2. Generates optimized `@font-face` declarations with `font-display: swap`.
3. Generates `<link rel="preload">` for critical fonts (when `preload` prop is passed to `<Font>`).
4. Computes accurate fallback font metrics (matching x-height, ascent, descent) to minimize CLS during font swap.
5. Exposes CSS custom properties (`--font-heading`, `--font-body`) usable anywhere in CSS.

### Applying Fonts in Head

Add the `<Font>` component once per font CSS variable in your `Head.astro`:

```astro
---
import { Font } from "astro:assets";
---

<!-- preload is recommended for fonts used above the fold (LCP region) -->
<Font cssVariable="--font-heading" preload />
<Font cssVariable="--font-body" preload />
```

This injects the `@font-face` CSS and the preload `<link>` tags. Without `<Font>` in `<head>`, the font variables are undefined and fallback fonts render.

### Wiring to Tailwind

In `src/styles/global.css` use `@theme inline` (not `@theme`) so Tailwind emits `var()` references instead of trying to resolve the CSS variable value at build time:

```css
@theme inline {
  --font-heading: var(--font-heading), "Inter", system-ui, sans-serif;
  --font-body: var(--font-body), "Inter", system-ui, sans-serif;
}
```

Use in markup: `class="font-heading"` or `class="font-body"`.

### Font Weights

- **Headings:** 700 (bold) and 900 (black) — used for `h1`-`h6`.
- **Body:** 400 (regular), 500 (medium), 700 (bold) — used for paragraphs, links, UI.

Only load the weights you use. Every unused weight adds ~20KB.

---

## 12. Dark Mode

### Strategy

Hybrid approach: respects `prefers-color-scheme` by default, with a manual toggle that persists to `localStorage`.

### Implementation

1. **FOUC prevention script** (inline in `<head>`, runs before paint):

```html
<script is:inline>
  (function() {
    var t = localStorage.getItem("theme");
    if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark-mode");
    }
  })();
</script>
```

2. **Tailwind dark variant** configured for `class` strategy. Use `dark:` prefix:

```html
<div class="bg-white dark:bg-dark text-body dark:text-body-white">
```

3. **DarkModeToggle.astro** island (see Section 7) toggles `dark-mode` class on `<html>` and writes to `localStorage`.

4. **Tailwind v4 `@theme` dark overrides** — define dark palette tokens once, use `dark:` everywhere.

### CSS Variable Dark Mode Mapping

| Light | Dark | Usage |
|---|---|---|
| `bg-white` | `dark:bg-dark` | Page background |
| `text-header` | `dark:text-body-white` | Heading color |
| `text-body` | `dark:text-body-white` | Body text |
| `bg-white` | `dark:bg-dark-medium` | Card/surface backgrounds |
| `border-gray-200` | `dark:border-dark-accent` | Borders |

---

## 13. Page Templates

### Homepage (`src/pages/index.astro`)

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { client } from "../data/client";
// Import section components as needed
---

<BaseLayout
  title={`Home | ${client.name}`}
  description="Your meta description here."
  schema={{ "@context": "https://schema.org", "@type": "LocalBusiness", "name": client.name }}
>
  <!-- Hero Section -->
  <!-- Services Section -->
  <!-- About/Side-by-Side Section -->
  <!-- Gallery Section -->
  <!-- Reviews Section -->
  <!-- CTA Section -->
</BaseLayout>
```

### Inner Page (e.g., `src/pages/about.astro`)

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Banner from "../components/Banner.astro";
import CTA from "../components/CTA.astro";
---

<BaseLayout title="About Us | My Business" description="Learn about our company.">
  <Banner title="About Us" />
  <!-- Page-specific sections -->
  <CTA />
</BaseLayout>
```

### Blog Listing (`src/pages/blog/index.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Banner from "../../components/Banner.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("blog", ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<BaseLayout title="Blog | My Business" description="Read our latest articles.">
  <Banner title="Blog" />
  <section class="py-section px-4">
    <div class="max-w-container mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article class="bg-white dark:bg-dark-medium rounded-lg shadow-md overflow-hidden">
          <a href={`/blog/${post.id}`}>
            <!-- Post card content -->
          </a>
        </article>
      ))}
    </div>
  </section>
</BaseLayout>
```

### Blog Post (`src/pages/blog/[...slug].astro`)

```astro
---
import { getCollection, render } from "astro:content";
import PostLayout from "../../layouts/PostLayout.astro";

// In Astro 6, use post.id (not post.slug — that was the legacy API)
// render() is a standalone function imported from "astro:content" (not entry.render())
export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<PostLayout title={post.data.title} description={post.data.description} image={post.data.image}>
  <article class="prose dark:prose-invert max-w-none">
    <Content />
  </article>
</PostLayout>
```

---

## 14. Forms

### Contact Form with Netlify Forms

Netlify Forms intercepts standard HTML `POST` form submissions at the CDN edge — no serverless function or backend needed. The form is detected at **build time** when Netlify scans the static HTML for `data-netlify="true"`.

**Per the Netlify coding rules (MCP):** Always include a honeypot field to prevent spam submissions.

```astro
---
// src/pages/contact.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import Banner from "../components/Banner.astro";
---

<BaseLayout title="Contact | My Business" description="Get in touch with us.">
  <Banner title="Contact Us" />
  <section class="py-[--spacing-section] px-4">
    <div class="max-w-2xl mx-auto">

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        action="/contact/success"
        class="flex flex-col gap-6"
      >
        <!--
          Required: hidden input so Netlify can identify the form by name
          when the page is served as a static file (Netlify reads this at build time)
        -->
        <input type="hidden" name="form-name" value="contact" />

        <!--
          Honeypot: visually hidden, never shown to real users.
          Spam bots fill every field they find — if this is filled, Netlify
          silently rejects the submission. Per Netlify MCP coding rules.
        -->
        <p class="hidden" aria-hidden="true">
          <label>
            Leave this empty:
            <input name="bot-field" tabindex="-1" autocomplete="off" />
          </label>
        </p>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-[--color-header] dark:text-[--color-body-white]">
            Name <span aria-hidden="true">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            autocomplete="name"
            class="rounded-md border border-gray-300 dark:border-[--color-dark-accent] px-4 py-2 bg-white dark:bg-[--color-dark-medium] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-[--color-header] dark:text-[--color-body-white]">
            Email <span aria-hidden="true">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autocomplete="email"
            class="rounded-md border border-gray-300 dark:border-[--color-dark-accent] px-4 py-2 bg-white dark:bg-[--color-dark-medium] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-[--color-header] dark:text-[--color-body-white]">
            Phone
          </span>
          <input
            type="tel"
            name="phone"
            autocomplete="tel"
            class="rounded-md border border-gray-300 dark:border-[--color-dark-accent] px-4 py-2 bg-white dark:bg-[--color-dark-medium] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-[--color-header] dark:text-[--color-body-white]">
            Message <span aria-hidden="true">*</span>
          </span>
          <textarea
            name="message"
            rows="5"
            required
            class="rounded-md border border-gray-300 dark:border-[--color-dark-accent] px-4 py-2 bg-white dark:bg-[--color-dark-medium] focus:outline-none focus:ring-2 focus:ring-[--color-primary] resize-y"
          ></textarea>
        </label>

        <button
          type="submit"
          class="self-start bg-[--color-primary] text-white font-bold uppercase px-8 py-4 rounded hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
      </form>

    </div>
  </section>
</BaseLayout>
```

### Success Page (`src/pages/contact/success.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
---

<BaseLayout title="Message Sent | My Business" description="Your message has been received.">
  <section class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <h1 class="font-heading text-[--text-title] text-[--color-header] dark:text-[--color-body-white] mb-4">
        Message Received
      </h1>
      <p class="text-[--color-body] dark:text-[--color-body-white] mb-8">
        Thank you for reaching out. We'll get back to you within one business day.
      </p>
      <a href="/" class="bg-[--color-primary] text-white font-bold uppercase px-8 py-4 rounded hover:opacity-90 transition-opacity">
        Back to Home
      </a>
    </div>
  </section>
</BaseLayout>
```

### How Netlify Forms Works

1. During `netlify build`, Netlify scans the compiled HTML for `data-netlify="true"`.
2. It registers the form by its `name` attribute (`"contact"` here).
3. When a user submits the form, the POST goes to Netlify's edge — no serverless function runs.
4. Netlify validates the honeypot, stores the submission, and redirects to the `action` URL.
5. View submissions in the Netlify dashboard under **Forms**.
6. Enable email notifications in **Forms > Settings > Form notifications**.

### Key Requirements (do not skip)

- `data-netlify="true"` — activates Netlify Forms. Without this, the form is just a regular HTML form that POSTs to nothing.
- `name="contact"` on `<form>` — Netlify identifies the form by this name in the dashboard.
- `<input type="hidden" name="form-name" value="contact" />` — required for SPA/static deployments where the form HTML may not be present on the page that handles the POST.
- `netlify-honeypot="bot-field"` + a matching hidden input — **required per Netlify coding rules** to prevent spam.
- `action="/contact/success"` — redirect destination after successful submission. Create this page.
- **No JavaScript required.** The form works with JS disabled (pure HTML POST). Add client-side validation progressively.
- **Do not add CORS headers** to forms — Netlify handles this at the edge.

---

## 15. View Transitions

### Setup

Add `<ClientRouter />` in `BaseLayout.astro` `<head>` (already shown in Section 7). This enables:

- SPA-like page transitions with browser back/forward support.
- Automatic `fade` animation on page navigation.
- Full MPA architecture preserved (every page is a static HTML file).

### Transition Names

Use `transition:name` to animate elements across pages:

```astro
<!-- Nav logo persists across all pages -->
<a href="/" transition:persist class="...">
  <Logo />
</a>

<!-- Blog post card image morphs into post hero -->
<Image src={post.data.image} transition:name={`post-image-${post.id}`} />
```

### Naming Convention

- `nav` — navigation bar (use `transition:persist`)
- `post-image-{slug}` — blog post featured image
- `post-title-{slug}` — blog post title
- `banner` — inner page banner section
- `footer` — footer (use `transition:persist`)

### Custom Animation (optional)

```astro
---
import { fade, slide } from "astro:transitions";
---

<main transition:animate={fade({ duration: "0.2s" })}>
  <slot />
</main>
```

### Lifecycle Events

For analytics, scroll restoration, or re-initialization after navigation:

```html
<script>
  // Use string event names directly — the constant exports were removed in Astro 6
  document.addEventListener("astro:page-load", () => {
    // Runs on every page, including initial load and client-side navigations
  });

  document.addEventListener("astro:after-swap", () => {
    // Runs after the new page's DOM replaces the old one
  });

  document.addEventListener("astro:before-preparation", () => {
    // Runs before the new page begins loading
  });
</script>
```

**Astro 6 removal:** The named constant exports `TRANSITION_PAGE_LOAD`, `TRANSITION_AFTER_SWAP`, `TRANSITION_BEFORE_SWAP`, etc. from `astro:transitions/client` are removed. Use the string event names directly (e.g. `"astro:page-load"`, `"astro:after-swap"`, `"astro:before-preparation"`).

---

## 16. Performance Rules

### Core Web Vitals Checklist

| Metric | Target | How to Achieve |
|---|---|---|
| **LCP** | < 1.5s | Hero image: `loading="eager"`, `fetchpriority="high"`. Preload above-fold fonts. No render-blocking CSS beyond critical path. |
| **CLS** | 0 | All images have `width`/`height` (Astro enforces). Font fallback metrics via Astro Fonts API. No dynamically injected content above fold. |
| **INP** | < 100ms | Zero JS by default. Only the dark mode toggle is interactive. No heavy event listeners on main thread. |
| **FCP** | < 1.0s | Inline critical CSS (Astro does this). Preload key fonts. Minimal `<head>` blocking resources. |
| **TTFB** | < 200ms | Static HTML served from Netlify CDN edge. No server-side computation. |

### Rules for Every Page

1. **No external CSS or JS in `<head>`** that blocks rendering (except the inline dark mode script).
2. **Preload hero image** on pages where LCP is an image.
3. **Self-host all fonts** via Astro Fonts API. Never load from Google Fonts CDN at runtime.
4. **No unused CSS** — Tailwind v4 purges automatically. Tree-shaking is built in.
5. **Minified HTML** — Astro minifies production output by default.
6. **No `@import` chains in CSS** — Tailwind v4 handles this via its own bundling.
7. **Images: AVIF > WebP > JPEG** fallback chain via `<Picture>` or responsive images.
8. **SVGs inlined** — no extra network requests for icons.
9. **Prefetch enabled** — all same-origin links prefetched on viewport entry.
10. **No third-party scripts** unless absolutely necessary. If needed, load with `async` or `defer` and after the `astro:page-load` event.

---

## 17. Testing with Playwright

### `playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile", use: { ...devices["iPhone 14"] } },
    { name: "tablet", use: { ...devices["iPad Mini"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "npm run preview",
    port: 4321,
    reuseExistingServer: true,
  },
});
```

### Visual Regression Tests (`tests/visual/pages.spec.ts`)

```ts
import { test, expect } from "@playwright/test";

const pages = ["/", "/about", "/contact", "/blog", "/reviews"];

for (const path of pages) {
  test(`visual snapshot: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveScreenshot(`${path.replace(/\//g, "-") || "home"}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
```

### Accessibility Tests (`tests/a11y/audit.spec.ts`)

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright"; // package: @axe-core/playwright

const pages = ["/", "/about", "/contact", "/blog", "/reviews"];

for (const path of pages) {
  test(`a11y audit: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

### Smoke Tests (`tests/smoke/smoke.spec.ts`)

```ts
import { test, expect } from "@playwright/test";

test("no 404 resources on homepage", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(failed).toEqual([]);
});

test("contact form submits", async ({ page }) => {
  await page.goto("/contact");
  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('textarea[name="message"]', "Hello from Playwright");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/success/);
});

test("sitemap.xml exists", async ({ page }) => {
  const res = await page.goto("/sitemap-index.xml");
  expect(res?.status()).toBe(200);
});

test("robots.txt exists", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
});
```

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:visual": "playwright test tests/visual",
    "test:a11y": "playwright test tests/a11y",
    "test:smoke": "playwright test tests/smoke",
    "test:update": "playwright test --update-snapshots"
  }
}
```

---

## 18. Netlify Deployment

### `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  # Astro 6 requires Node 22+
  NODE_VERSION = "22"

# Cache Astro build output for faster rebuilds
[[plugins]]
  package = "netlify-plugin-cache"
  [plugins.inputs]
    paths = [
      "node_modules/.astro",
      "dist/assets/images"
    ]

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Immutable cache for hashed assets
[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Image CDN cache
[[headers]]
  for = "/.netlify/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Deployment Flow

1. Push to `main` branch triggers Netlify build.
2. `npm run build` runs `astro build` (static output to `dist/`).
3. Netlify serves `dist/` from its global CDN.
4. Branch deploys auto-generate preview URLs for PRs.

### Environment Variables

| Variable | Context | Purpose |
|---|---|---|
| `SITE_URL` | Production | The canonical domain (e.g., `https://www.mybusiness.com`) |
| `SITE_URL` | Deploy Preview | Auto-set by Netlify to the preview URL |

Access in Astro via `astro:env`:

```ts
// src/env.d.ts
/// <reference types="astro/client" />

// astro.config.mjs
env: {
  schema: {
    SITE_URL: envField.string({ context: "client", access: "public", optional: true }),
  }
}
```

---

## 19. Utility Scripts

### `scripts/create-page.ts`

Creates a new page with boilerplate layout and metadata:

```ts
import { writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: npx tsx scripts/create-page.ts <page-name>");
  process.exit(1);
}

const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const filePath = resolve("src/pages", `${slug}.astro`);

if (existsSync(filePath)) {
  console.error(`Page already exists: ${filePath}`);
  process.exit(1);
}

const titleCase = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

const template = `---
import BaseLayout from "../layouts/BaseLayout.astro";
import Banner from "../components/Banner.astro";
import CTA from "../components/CTA.astro";
---

<BaseLayout title="${titleCase} | My Business" description="">
  <Banner title="${titleCase}" />
  <section class="py-section px-4">
    <div class="max-w-container mx-auto">
      <h2 class="font-heading text-title text-header dark:text-body-white">${titleCase}</h2>
      <p class="text-body max-w-prose mt-4">Content goes here.</p>
    </div>
  </section>
  <CTA />
</BaseLayout>
`;

writeFileSync(filePath, template);
console.log(`Created: ${filePath}`);
```

### `scripts/create-post.ts`

Creates a new blog post with frontmatter:

```ts
import { writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: npx tsx scripts/create-post.ts <post-title>");
  process.exit(1);
}

const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const filePath = resolve("src/content/blog", `${slug}.md`);

if (existsSync(filePath)) {
  console.error(`Post already exists: ${filePath}`);
  process.exit(1);
}

const today = new Date().toISOString().split("T")[0];

const template = `---
title: "${name}"
description: ""
author: "Team"
date: ${today}
tags: []
draft: true
---

Write your post content here.
`;

writeFileSync(filePath, template);
console.log(`Created: ${filePath}`);
```

### npm Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "create-page": "npx tsx scripts/create-page.ts",
    "create-post": "npx tsx scripts/create-post.ts"
  }
}
```

---

## 20. Lighthouse Targets

| Category | Target | Key Decisions That Achieve It |
|---|---|---|
| **Performance: 100** | LCP < 1.5s, CLS 0, INP < 100ms | Zero JS by default. Static HTML from CDN. Astro `<Image>` with responsive srcset. Fonts preloaded via Astro Fonts API. Prefetch all links. |
| **Accessibility: 100** | No axe violations | Skip-to-content link. Semantic HTML landmarks (`<nav>`, `<main>`, `<footer>`). All images have `alt`. Form inputs have `<label>`. Focus styles visible. ARIA on interactive elements. Color contrast meets WCAG AA. |
| **Best Practices: 100** | HTTPS, no mixed content, no deprecated APIs | Netlify HTTPS by default. No `document.write`. No console errors. Security headers in `netlify.toml`. |
| **SEO: 100** | Crawlable, meta tags, sitemap, structured data | `<title>` and `<meta description>` on every page. Canonical URLs. Open Graph tags. JSON-LD structured data. Auto-generated `sitemap.xml` and `robots.txt`. Semantic heading hierarchy. |

### Verification Workflow

1. Run `npm run build && npm run preview` to serve production build locally.
2. Run `npx playwright test` to execute visual, a11y, and smoke tests.
3. Open Chrome DevTools > Lighthouse and run audit on `http://localhost:4321`.
4. After Netlify deploy, run Lighthouse on the live URL to verify CDN + image transforms.
5. Fix any audit failures before merging to `main`.

---

## Global Data: `src/data/client.ts`

Ported from the old `src/_data/client.js`:

```ts
export const client = {
  name: "My Business Name",
  email: "hello@mybusiness.com",
  phoneForTel: "555-779-4407",
  phoneFormatted: "(555) 779-4407",
  address: {
    lineOne: "123 Main Street",
    lineTwo: "Suite 100",
    city: "Denver",
    state: "CO",
    zip: "80206",
    country: "US",
    mapLink: "https://maps.app.goo.gl/example",
  },
  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
  domain: "https://www.example.com",
} as const;

export type Client = typeof client;
```

Import anywhere: `import { client } from "../data/client";`

---

## Summary: What This Template Replaces

| Old (CodeStitch Eleventy Kit) | New (This Template) |
|---|---|
| 15 dependencies | ~10 dependencies (Astro handles image processing, bundling, minification internally) |
| LESS + PostCSS + cssnano pipeline | Tailwind v4 (zero-config CSS) |
| Nunjucks templates (no types) | `.astro` components with TypeScript props |
| Manual responsive `<picture>` with Sharp plugin | `<Image layout="constrained">` with auto-generated `srcset` |
| Manual font `@font-face` + preload | Astro 6 Fonts API (stable) — auto-preload, fallback metrics, privacy-safe |
| No dark mode consistency | Tailwind `dark:` + FOUC-free toggle |
| No testing | Playwright visual + a11y + smoke tests |
| Decap CMS (requires proxy server) | Astro Content Layer (file-based, zero runtime) |
| Manual sitemap plugin | `@astrojs/sitemap` auto-generation |
| ~1000 lines of LESS for nav alone | Tailwind utilities + <100 lines per component |
| esbuild manual config | Vite 7 built into Astro (zero config) |
| No View Transitions | `<ClientRouter />` for SPA-feel navigation |
| No contact form backend | Netlify Forms (HTML-only, edge-processed, honeypot spam protection) |

## Astro 6 Key Differences from Astro 5

| Feature | Astro 5 | Astro 6 |
|---|---|---|
| **Node requirement** | Node 18+ | **Node 22.12.0+** |
| **Vite version** | Vite 6 | **Vite 7** |
| **Fonts API** | `experimental.fonts` | **`fonts` top-level (stable)** |
| **Responsive images** | `experimental.responsiveImages` | **`layout` prop stable, no flag** |
| **SVG imports** | `experimental.svg` | **Stable, no flag** |
| **`fit` prop on `<Image>`** | Supported | **Removed — use `layout`** |
| **Content config location** | `src/content/config.ts` | **`src/content.config.ts`** |
| **Legacy collections** | Optional compat flag | **Fully removed** |
| **Zod version** | Zod 3 | **Zod 4 (`z.email()`, `error:` key)** |
| **`z` from `astro:content`** | Supported | **Deprecated — use `astro/zod`** |
| **Transition constants** | `TRANSITION_AFTER_SWAP` etc. | **Removed — use string event names** |
| **`Astro.site` in getStaticPaths** | Supported | **Deprecated — use `import.meta.env.SITE`** |

This spec is designed to be followed section-by-section to produce a production-ready template that exceeds the original kit in performance, DX, type safety, and Lighthouse scores.
