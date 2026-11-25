# Project Structure

Overview of the codebase organization.

## Directory Structure

```
├── public/               # Static assets (favicons, images)
├── src/
│   ├── components/       # Reusable Astro components
│   ├── content/          # MDX content files
│   │   ├── projects/     # Case studies
│   │   ├── decisions/    # Decision logs
│   │   ├── journey/      # Career timeline
│   │   ├── writing/      # Blog posts
│   │   ├── speaking/     # Talks & presentations
│   │   ├── uses/         # Tools & setup
│   │   └── testimonials/ # Recommendations
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route pages
│   ├── styles/           # Global CSS
│   ├── utils/            # Utility functions
│   ├── config.ts         # Site configuration
│   ├── content.config.ts # Content schemas
│   └── pages.config.ts   # Page metadata
├── .env                  # Environment variables
└── astro.config.mjs      # Astro configuration
```

## Key Files

### Configuration

| File | Purpose |
|------|---------|
| `.env` | Environment variables (personal info, URLs) |
| `src/config.ts` | Site configuration, navigation |
| `src/pages.config.ts` | Page metadata (titles, descriptions) |
| `src/content.config.ts` | Content collection schemas |
| `astro.config.mjs` | Astro settings, integrations |

### Layouts

| File | Used For |
|------|----------|
| `BaseLayout.astro` | All pages (head, scripts, theme) |
| `PageLayout.astro` | Standard pages |
| `ArticleLayout.astro` | Blog posts |
| `CaseStudyLayout.astro` | Project detail pages |

### Components

| Component | Purpose |
|-----------|---------|
| `Navigation.astro` | Site navigation |
| `Footer.astro` | Site footer |
| `ThemeToggle.astro` | Dark/light mode toggle |
| `ProjectCard.astro` | Case study cards |
| `ArticleCard.astro` | Blog post cards |
| `SEO.astro` | Meta tags |
| `StructuredData.astro` | JSON-LD schema |

### Styles

| File | Purpose |
|------|---------|
| `global.css` | CSS custom properties, reset |
| `typography.css` | Typography styles |
| `utilities.css` | Utility classes |

## Content Collections

Each content type has its own folder in `src/content/` with schema validation defined in `src/content.config.ts`.

| Collection | Location | Description |
|------------|----------|-------------|
| projects | `src/content/projects/` | Case studies |
| decisions | `src/content/decisions/` | Technical decisions |
| journey | `src/content/journey/` | Career timeline |
| writing | `src/content/writing/` | Blog posts |
| speaking | `src/content/speaking/` | Talks & presentations |
| uses | `src/content/uses/` | Tools & setup |
| testimonials | `src/content/testimonials/` | Recommendations |

## Public Assets

Static files in `public/` are served as-is:

```
public/
├── favicon.svg          # Main favicon
├── favicon-*.png        # PNG fallbacks
├── apple-touch-icon.png # iOS icon
├── og-image.png         # Social sharing image
└── site.webmanifest     # PWA manifest
```
