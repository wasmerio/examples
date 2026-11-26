<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [CapsuleX](https://github.com/wangjacks/capsule-x) Astro theme by wangjacks, copied from commit `d868c9a9fc6854810ff9cdd81e177889e30f558e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-capsule-x.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [wangjacks](https://github.com/wangjacks), Apache-2.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<p align="center">
  <img src="public/logo.svg" alt="CapsuleX Logo" width="120">
</p>

<h1 align="center">CapsuleX</h1>

<p align="center">
  A minimal, modern blog theme for Astro with capsule floating navigation.
</p>

<p align="center">
  <a href="https://capsule-x-brown.vercel.app">Demo</a> •
  <a href="https://github.com/wangjacks/capsule-x">GitHub</a>
</p>

---

> [!NOTE]
> This theme is in beta. There are no official releases or npm packages yet. If you want to use it, clone directly from the repository.
> 
> If you make any contributions but get no reply or need help, please leave a issue.

## Features

### Navigation & Layout

- **Capsule Floating Navigation** — Glassmorphism nav bar with backdrop blur, fixed at top
- **Tri-State Theme Switcher** — Auto (follow device) / Light / Dark with smooth transitions
- **Responsive Design** — Mobile-first, hamburger menu on small screens
- **Footer** — Capsule-style footer with social links

### Reading Experience

- **Floating TOC** — Desktop sticky sidebar + mobile capsule toggle button
- **Reading Progress Bar** — Fixed top line, scales as you scroll
- **Estimated Reading Time** — Based on word count (EN ~200 WPM, CN ~400 CPM)
- **Prev/Next Navigation** — Bottom of each post, responsive grid
- **Pinned Posts** — Pin important articles to the top of the list

### Content Components

- **Callout Blocks** — GitHub-style `[!NOTE]`, `[!WARNING]`, `[!TIP]`, `[!INFO]` syntax
- **Code Block Enhancements** — Filename labels, diff syntax, copy button (Shiki transformers)
- **Image Lightbox** — Click to view fullscreen, keyboard navigation (← → ESC)
- **Tags System** — Filter posts by tags with dedicated tag pages

### Interaction & Animation

- **Scroll Fade-in Animations** — Posts fade in as you scroll
- **View Transitions API** — Smooth page transitions with Astro's ClientRouter
- **Back to Top Button** — Capsule style, appears after scrolling

### Search & Feed

- **Client-Side Search** — Fuse.js powered, modal UI with keyboard shortcut (⌘K)
- **RSS Feed** — Auto-generated with `@astrojs/rss`, auto-discovery in head

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/wangjacks/capsule-x.git
cd capsule-x

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## Configuration

All settings are centralized in `src/config.ts`:

```ts
export const siteConfig = {
  title: 'CapsuleX',
  description: 'A minimal blog theme with capsule design',
  author: 'Your Name',
  site: 'https://your-domain.com',
  lang: 'en',

  nav: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Tags', href: '/tags' },
  ],

  social: {
    github: 'https://github.com/your-username',
  },

  features: {
    readingProgress: true,
    backToTop: true,
    callout: true,
    lightbox: true,
    rss: true,
    search: true,
  },
};
```

### Feature Toggles

| Feature | Default | Description |
|---------|---------|-------------|
| `readingProgress` | `true` | Reading progress bar on post pages |
| `backToTop` | `true` | Back to top button |
| `callout` | `true` | Callout blocks in blog posts |
| `lightbox` | `true` | Image lightbox on click |
| `rss` | `true` | RSS feed generation |
| `search` | `true` | Client-side search with Fuse.js |

---

## Writing Content

### Blog Posts

Create `.md` or `.mdx` files in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description"
pubDate: 2026-07-04
tags: ["tag1", "tag2"]
pinned: false
---

Your content here...
```

### Frontmatter Options

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Post title |
| `description` | `string` | Yes | Post description |
| `pubDate` | `date` | Yes | Publication date |
| `tags` | `string[]` | No | Post tags |
| `pinned` | `boolean` | No | Pin to top of list |
| `draft` | `boolean` | No | Exclude from build |

### Callout Blocks (Markdown)

```markdown
> [!NOTE]
> This is a note callout.

> [!TIP]
> This is a tip callout.

> [!WARNING]
> This is a warning callout.

> [!CAUTION]
> This is a caution callout.
```

### Code Blocks

````markdown
```ts title="src/utils.ts"
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```diff
- oldFunction();
+ newFunction();
```
````

---

## Project Structure

```
capsule-x/
├── public/                  # Static assets (favicon, logo, images)
├── src/
│   ├── components/          # UI components
│   │   ├── BackToTop.astro
│   │   ├── CodeBlockCopy.astro
│   │   ├── Footer.astro
│   │   ├── Lightbox.astro
│   │   ├── Navigation.astro
│   │   ├── ReadingProgress.astro
│   │   ├── Search.astro
│   │   ├── SearchModal.astro
│   │   └── TableOfContents.astro
│   ├── content/
│   │   ├── about/           # About page content
│   │   └── blog/            # Blog posts (Markdown/MDX)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro      # Home page
│   │   ├── about.astro      # About page
│   │   ├── tags/            # Tag pages
│   │   ├── rss.xml.js       # RSS feed
│   │   └── 404.astro        # 404 page
│   ├── styles/
│   │   ├── global.css       # Global styles & CSS variables
│   │   └── callout.css      # Callout block styles
│   ├── utils/
│   │   └── readingTime.ts   # Reading time calculator
│   └── config.ts            # Site configuration
├── docs/                    # Project documentation
├── astro.config.mjs         # Astro configuration
├── package.json
└── tsconfig.json
```

---

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Astro 7 |
| Content | Markdown / MDX |
| Styling | CSS Variables + Native CSS |
| Syntax Highlighting | Shiki |
| Search | Fuse.js |
| RSS | @astrojs/rss |

---

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### Other Platforms

CapsuleX generates static HTML, so it can be deployed to any static hosting service.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

[Apache 2.0](LICENSE)
