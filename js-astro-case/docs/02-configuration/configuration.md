# Configuration

All site configuration is managed through environment variables and `src/config.ts`.

## Environment Variables

Copy `.env.example` to `.env` and configure:

### Site Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SITE_URL` | Yes | `https://example.com` | Production URL (for sitemap, OG tags) |
| `SITE_LANGUAGE` | No | `en` | ISO 639-1 code (e.g., `en`, `id`, `de`) |
| `SITE_TITLE` | No | `Professional Portfolio` | Site title for SEO |
| `SITE_DESCRIPTION` | No | - | Default meta description |

### Author Information

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SITE_AUTHOR_NAME` | Yes | `Your Name` | Your full name |
| `SITE_AUTHOR_TITLE` | Yes | `Senior Software Engineer` | Your job title |
| `SITE_AUTHOR_BIO` | No | - | Short professional bio |
| `SITE_AUTHOR_EMAIL` | Yes | `hello@example.com` | Contact email |
| `SITE_AUTHOR_LOCATION` | No | - | Your location (leave empty to hide) |

### Social Links

Leave empty to hide a platform from your site.

| Variable | Description |
|----------|-------------|
| `SOCIAL_GITHUB` | GitHub profile URL |
| `SOCIAL_LINKEDIN` | LinkedIn profile URL |
| `SOCIAL_TWITTER` | Twitter/X profile URL |
| `SOCIAL_MASTODON` | Mastodon profile URL |
| `SOCIAL_BLUESKY` | Bluesky profile URL |

### Example Configuration

```bash
# .env
SITE_URL=https://johndoe.dev
SITE_LANGUAGE=en

SITE_AUTHOR_NAME="John Doe"
SITE_AUTHOR_TITLE="Staff Software Engineer"
SITE_AUTHOR_BIO="Building distributed systems at scale."
SITE_AUTHOR_EMAIL=hello@johndoe.dev
SITE_AUTHOR_LOCATION="San Francisco, CA"

SOCIAL_GITHUB=https://github.com/johndoe
SOCIAL_LINKEDIN=https://linkedin.com/in/johndoe
SOCIAL_TWITTER=https://twitter.com/johndoe
```

## Navigation

Navigation links are configured in `src/config.ts`:

```typescript
nav: [
  { label: 'Projects', href: '/projects' },
  { label: 'Decisions', href: '/decisions' },
  { label: 'Journey', href: '/journey' },
  { label: 'Writing', href: '/writing' },
  { label: 'Speaking', href: '/speaking' },
  { label: 'Uses', href: '/uses' },
  { label: 'Contact', href: '/contact' },
],
```

The "Home" link is automatically added. To remove a section, delete its entry from the array.

## Page Metadata

SEO metadata for static pages is centralized in `src/pages.config.ts`. Edit this file to customize page titles, descriptions, headings, and intro text:

```typescript
// src/pages.config.ts
export const pagesConfig = {
  projects: {
    title: 'Projects - Case Studies',
    description: 'Detailed case studies showcasing...',
    heading: 'Projects',
    intro: 'Case studies that demonstrate...',
  },
  // ... other pages
}
```

**Available pages:** `home`, `projects`, `decisions`, `journey`, `writing`, `speaking`, `uses`, `contact`

**Fields:**
- `title` — Browser tab and SEO title
- `description` — Meta description for SEO
- `heading` — Page h1 heading (optional, defaults to title)
- `intro` — Intro paragraph below heading (optional)

## Favicon Setup

Replace these files in `public/` with your own:

| File | Size | Purpose |
|------|------|---------|
| `favicon.svg` | - | Main favicon (modern browsers) |
| `favicon-32x32.png` | 32×32 | PNG fallback |
| `favicon-16x16.png` | 16×16 | PNG fallback |
| `favicon-192x192.png` | 192×192 | Android Chrome |
| `favicon-512x512.png` | 512×512 | PWA icon |
| `apple-touch-icon.png` | 180×180 | iOS icon |
| `og-image.png` | 1200×630 | Social sharing image |

After replacing, update `public/site.webmanifest`:

```json
{
  "name": "Your Site Name",
  "short_name": "Short Name",
  "description": "Your site description",
  "theme_color": "#0a0a0a",
  "background_color": "#0a0a0a",
  "display": "standalone"
}
```

**Tip:** Use [RealFaviconGenerator](https://realfavicongenerator.net/) to generate all sizes from a single image.

## Code Syntax Highlighting

Configure in `astro.config.mjs`:

```javascript
markdown: {
  shikiConfig: {
    theme: 'github-dark',  // Change theme here
    wrap: true
  }
}
```

Available themes: `github-dark`, `github-light`, `dracula`, `nord`, `one-dark-pro`, etc.

See [Shiki themes](https://shiki.style/themes) for all options.

## Pagination

Article pagination is configured in `src/pages/writing/[...page].astro`:

```typescript
const postsPerPage = 5; // Change this value
```

**Note:** Update both instances in the file for pagination statistics to display correctly.
