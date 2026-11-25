<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Quiet Bar](https://github.com/larry-xue/quiet-bar) Astro theme by larry-xue, copied from commit `8e69f22e4051572f1229b1a1b42836cb0f55479b` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-quiet-bar.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed lockfiles of other package managers: package-lock.json; kept pnpm-lock.yaml.
- **Environment variables:** None.
- **Credit:** theme by [larry-xue](https://github.com/larry-xue), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Quiet Bar Theme

A beautiful, vintage/industrial-styled website template for bars, pubs, and restaurants. Built with [Astro](https://astro.build/) for exceptional performance and ease of customization.

![Quiet Bar Theme](public/images/logo.svg)

> **Quiet Bar Theme** created by [yujay](https://yujay.dev)
> 
> Need help with **Customizing**, **Hosting**, or **Web Development**? [Contact me](https://yujay.dev/services) for professional support.

## One-Click Deploy

Deploy your own Quiet Bar site with one click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/itsyujay/quiet-bar)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itsyujay/quiet-bar)

**Cloudflare Pages:** Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → Create → Connect to Git → Select `itsyujay/quiet-bar`

## Features

- **Zero Dependencies** - Only Astro, no Tailwind CSS, no UI frameworks, no bloat
- **Ultra Lightweight** - Pure CSS styling, minimal vanilla JS, blazing fast load times
- **Vintage/Industrial Aesthetic** - Deep charcoal backgrounds, aged brass accents, elegant typography
- **JSON-based CMS** - All content managed through a single `site.json` file
- **Fully Responsive** - Mobile-first design with desktop, tablet, and mobile breakpoints
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, and LocalBusiness structured data
- **Accessible** - Semantic HTML, ARIA labels, keyboard navigation, high contrast ratios
- **Performance First** - Lazy-loaded images, minimal JavaScript, optimized fonts
- **Interactive Components** - Accordion menus, lightbox gallery with keyboard support
- **Article Pages** - Built-in blog/article system with list and detail pages

### Why No Third-Party Dependencies?

This theme intentionally uses **only Astro** as its dependency:

| What We Don't Use | Why |
|-------------------|-----|
| Tailwind CSS | Pure CSS with custom properties is lighter and more maintainable |
| React/Vue/Svelte | Static site doesn't need client-side frameworks |
| UI Component Libraries | Custom components are leaner and fully customizable |
| Animation Libraries | CSS animations handle everything we need |
| Lightbox Libraries | ~50 lines of vanilla JS does the job |

**Result:** A complete, production-ready site with only **one dependency** in `package.json`.

## 💼 Commercial Use

This template is **MIT** — use it for client work, invoice for it, ship it. No strings, no gated "pro" version.

If you're shipping paid projects on it, there are three ways to support the work: a one-time
**$75 commercial sponsorship**, a **$199 ship-assist** if you're stuck, and a **$499/yr agency plan**.

**→ [Commercial use & support](./COMMERCIAL.md)**

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) - One of the following versions:
  - `v18.20.8` or higher (v18.x LTS)
  - `v20.3.0` or higher (v20.x LTS)
  - `v22.0.0` or higher
  - ⚠️ **Note:** v19.x and v21.x are **not supported**
- npm, yarn, or pnpm

### Installation

#### Option 1: Using Astro CLI (Recommended)

Create a new project using the Astro template command:

```bash
npm create astro@latest -- --template itsyujay/quiet-bar
```

Then start the development server:

```bash
cd quiet-bar
npm run dev
```

#### Option 2: Clone the Repository

```bash
git clone https://github.com/itsyujay/quiet-bar.git
cd quiet-bar
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:4321` to see your site.

## Project Structure

```
quiet-bar/
├── public/
│   ├── favicon.svg           # Site favicon
│   ├── fonts/                # Self-hosted fonts (optional)
│   └── images/
│       ├── logo.svg          # Your bar's logo
│       ├── gallery/          # Gallery images
│       └── articles/         # Article cover images (optional)
├── src/
│   ├── components/           # Astro components
│   │   ├── Header.astro      # Hero section with logo
│   │   ├── InfoBar.astro     # Sticky contact bar
│   │   ├── Hours.astro       # Opening hours
│   │   ├── Tagline.astro     # Brand positioning
│   │   ├── Menu.astro        # Drinks/food menu
│   │   ├── Gallery.astro     # Photo gallery with lightbox
│   │   ├── Location.astro    # Map and directions
│   │   ├── Press.astro       # Media reviews
│   │   ├── Contact.astro     # Contact info and notices
│   │   ├── Footer.astro      # Site footer
│   │   ├── ArticleCard.astro  # Article card for listings
│   │   ├── ArticleHeader.astro # Article header component
│   │   └── ArticleContent.astro # Article content renderer
│   ├── content/
│   │   └── articles/         # Markdown article files
│   ├── data/
│   │   └── site.json         # ⭐ YOUR CONTENT GOES HERE
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML layout with SEO
│   ├── pages/
│   │   ├── index.astro       # Main page
│   │   ├── 404.astro         # 404 error page
│   │   └── articles/
│   │       ├── index.astro   # Articles list page
│   │       └── [slug].astro  # Individual article page
│   └── styles/
│       └── global.css        # Global styles and design tokens
├── astro.config.mjs          # Astro configuration
├── package.json              # Only 1 dependency: astro
└── tsconfig.json
```

## Content Management

All your bar's content is managed through a single JSON file: `src/data/site.json`

### Basic Information

```json
{
  "name": "YOUR BAR NAME",
  "shortName": "SHORT",
  "established": "2025",
  "phone": "555-123-4567",
  "email": "hello@yourbar.com",
  "tagline": "Your catchy tagline here."
}
```

### Address & Location

```json
{
  "address": {
    "full": "123 Main Street, City, State 12345",
    "short": "123 Main St, City",
    "crossStreets": "between Oak & Pine"
  },
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

> **Tip:** Get coordinates from [Google Maps](https://maps.google.com) by right-clicking on your location.

### Opening Hours

```json
{
  "openingHours": {
    "weekday": "Mon – Thu: 5:00 PM – 1:00 AM",
    "weekend": "Fri – Sun: 3:00 PM – 2:00 AM",
    "holiday": "Closed on Christmas Day"
  }
}
```

Set `holiday` to `null` if you don't have special holiday hours.

### Menu Items

```json
{
  "menu": [
    {
      "category": "Drafts",
      "items": [
        { "name": "House Lager", "description": "Crisp and refreshing", "badge": null },
        { "name": "Seasonal IPA", "description": "Rotating selection", "badge": "seasonal" },
        { "name": "Signature Stout", "description": "Rich and creamy", "badge": "featured" }
      ]
    },
    {
      "category": "Wines",
      "items": [...]
    },
    {
      "category": "Spirits",
      "items": [...]
    }
  ]
}
```

**Badge Options:**
- `null` - No badge
- `"featured"` - Shows "★ Featured" badge
- `"seasonal"` - Shows "⟡ Seasonal" badge

### Transit Information

```json
{
  "transit": [
    { "line": "A/C/E", "station": "14th Street" },
    { "line": "L", "station": "8th Avenue" },
    { "line": "Bus M14", "station": "Main & 1st" }
  ]
}
```

### Gallery Images

```json
{
  "gallery": [
    { "src": "/images/gallery/interior.jpg", "alt": "Cozy bar interior" },
    { "src": "/images/gallery/cocktails.jpg", "alt": "Signature cocktails" },
    { "src": "/images/gallery/exterior.jpg", "alt": "Street view at night" }
  ]
}
```

**Image Guidelines:**
- Recommended size: 800x600px or larger
- Formats: JPG, PNG, WebP, or SVG
- Place images in `public/images/gallery/`

### Press & Reviews

```json
{
  "press": [
    {
      "source": "Local News",
      "quote": "The best hidden gem in town...",
      "url": "https://example.com/review"
    },
    {
      "source": "Food Magazine",
      "quote": "A must-visit destination.",
      "url": null
    }
  ]
}
```

Set `url` to `null` if there's no link to the original article.

### Important Notices

```json
{
  "notices": [
    "NO RESERVATIONS",
    "CASH PREFERRED",
    "21+ ONLY WITH VALID ID"
  ]
}
```

### Social Media

```json
{
  "social": {
    "instagram": "https://instagram.com/yourbar"
  }
}
```

### SEO Settings

```json
{
  "seo": {
    "metaTitle": "Your Bar Name | Neighborhood Bar in City",
    "metaDescription": "A warm neighborhood bar serving craft beers and cocktails at 123 Main Street."
  }
}
```

### Articles

Add blog posts or news articles to your site using Markdown files:

**Step 1:** Create a Markdown file in `src/content/articles/` (e.g., `the-art-of-cocktail-making.md`):

```markdown
# Welcome to The Quiet Bar

Welcome to The Quiet Bar, a neighborhood gem nestled in the heart of Little Italy...

## Our Philosophy

Our philosophy is simple: quality over quantity...
```

**Step 2:** Add the article metadata to `src/data/site.json`:

```json
{
  "articles": [
    {
      "slug": "welcome-to-quiet-bar",
      "title": "Welcome to The Quiet Bar",
      "excerpt": "A warm corner in the city where good drinks meet better company...",
      "date": "2024-01-15",
      "author": "The Quiet Bar Team",
      "coverImage": "/images/articles/welcome.jpg",
      "markdownFile": "the-art-of-cocktail-making.md"
    }
  ]
}
```

**Article Fields:**
- `slug` - URL-friendly identifier (e.g., "welcome-to-quiet-bar")
- `title` - Article headline
- `excerpt` - Short summary for listings
- `date` - Publication date (YYYY-MM-DD format)
- `author` - Author name (optional)
- `coverImage` - Cover image path (optional)
- `markdownFile` - Filename of the Markdown file in `src/content/articles/` (required)

**Content Guidelines:**
- Use Markdown syntax for formatting (headers, bold, italic, lists, links, etc.)
- Markdown files should be placed in `src/content/articles/`
- Images should be placed in `public/images/articles/`
- Articles are automatically sorted by date (newest first)
- Access articles at `/articles` (list) and `/articles/[slug]` (individual article)
- Astro's native Markdown support handles all formatting automatically

### Robots.txt

The `public/robots.txt` file controls search engine crawling. By default, all crawlers are allowed:

```txt
User-agent: *
Allow: /
```

To add a sitemap, uncomment and update the Sitemap line with your domain:

```txt
Sitemap: https://yourdomain.com/sitemap.xml
```

## Customization

### Changing Colors

Edit the CSS custom properties in `src/styles/global.css`:

```css
:root {
  /* Background Colors */
  --color-bg-deep: #1a1a18;      /* Main background */
  --color-bg-mid: #2a2a26;       /* Section backgrounds */
  --color-bg-light: #3a3a36;     /* Hover states */
  
  /* Brand Colors */
  --color-primary: #c9a227;      /* Accent color (brass) */
  --color-secondary: #f5f0e6;    /* Light text/headings */
  --color-accent: #a85a32;       /* Secondary accent (terracotta) */
  
  /* Text Colors */
  --color-text: #e8e4dc;         /* Body text */
  --color-text-muted: #9a968e;   /* Subtle text */
}
```

### Changing Fonts

1. Update the Google Fonts link in `src/layouts/Layout.astro`
2. Update the font family variables in `src/styles/global.css`:

```css
:root {
  --font-heading: 'Your Heading Font', serif;
  --font-body: 'Your Body Font', sans-serif;
}
```

### Adding/Removing Sections

Edit `src/pages/index.astro` to add, remove, or reorder sections:

```astro
<Layout>
  <Header />
  <InfoBar />
  
  <main id="main-content">
    <Tagline />
    <Hours />
    <Menu />
    <!-- <Gallery /> --> <!-- Commented out to hide -->
    <Location />
    <Press />
    <Contact />
  </main>
  
  <Footer />
</Layout>
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized static site in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy Options

#### Option 1: One-Click Deploy (Recommended)

Use the deploy buttons at the top of this README to instantly deploy to:
- **Netlify** - Free tier available, automatic HTTPS
- **Vercel** - Free tier available, great performance
- **Cloudflare Pages** - Free tier available, global CDN

#### Option 2: Manual Deploy

**Netlify:**
1. Push your code to GitHub
2. Connect your repo to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

**Vercel:**
1. Push your code to GitHub
2. Import your repo on [Vercel](https://vercel.com)
3. Vercel auto-detects Astro settings

**Cloudflare Pages:**
1. Push your code to GitHub
2. Connect your repo to [Cloudflare Pages](https://pages.cloudflare.com)
3. Build command: `npm run build`
4. Build output directory: `dist`

#### Option 3: Self-Hosted / VPS

1. Build the site: `npm run build`
2. Upload the `dist/` folder to your server
3. Configure your web server (Nginx, Apache) to serve static files

**Nginx example:**

```nginx
server {
    listen 80;
    server_name yourbar.com;
    root /var/www/quiet-bar/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview production build locally |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## More Astro templates

- **[Astroloop](https://github.com/lx-themes/astroloop)** — a landing page for AI agent products: an agent-loop diagram with a human handoff gate, and a per-tool permission matrix. [Demo](https://astroloop.yujay.dev)
- [Astro Sassify](https://github.com/itsyujay/astro-sassify-template) — a SaaS landing page with a full design system, dark mode and view transitions. [Demo](https://astro-sassify.yujay.dev/)
- [Astro Zen Blog](https://github.com/itsyujay/astro-zen-blog) — a minimal blog, with typography tuned for long-form reading. [Demo](https://astro-zen-blog.yujay.dev/)
- [Apple-Style Portfolio](https://github.com/itsyujay/apple-style-portfolio) — a minimalist portfolio with GSAP motion and a Three.js accent. [Demo](https://apple-style-portfolio.yujay.dev)

All MIT, all free for commercial use.

## License

MIT License - Feel free to use this template for personal or commercial projects.

Using it commercially? See [COMMERCIAL.md](./COMMERCIAL.md) — MIT means you owe nothing, but there is a button if you'd rather not.

## Support

Need help? [Open an issue](https://github.com/itsyujay/quiet-bar/issues) on GitHub or [contact the creator](https://yujay.dev/services) for professional support.
