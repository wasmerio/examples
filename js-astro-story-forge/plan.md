# Novel Website Implementation Plan

## Goal Description
Build a static website (SSG) for a novel project, focusing on a clean, immersive mobile-first reading experience. The site will feature markdown-based content, local storage for reading progress, and comprehensive SEO optimization.

## Technology Stack
- **Framework**: [Astro](https://astro.build) (Best-in-class performance for content sites, native Markdown support, easy SSG).
- **Styling**: [TailwindCSS](https://tailwindcss.com) (Rapid UI development, easy theming).
- **Icons**: [Lucide Icons](https://lucide.dev) (Clean, lightweight icons).
- **Deployment Target**: Static hosting (e.g., Vercel, Netlify, or Nginx as requested).

## User Review Required
> [!NOTE]
> I am proposing **Astro** instead of generic static HTML/JS because it significantly simplifies creating a blog/novel structure with Markdown, handles SSG automatically, and has zero-JS overhead by default for fast loading.

## Proposed Changes

### Project Structure
```
src/
├── components/
│   ├── Common/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Seo.astro
│   ├── Novel/
│   │   ├── ChapterNavigation.astro
│   │   ├── TableOfContents.astro
│   │   └── ReadingProgress.astro (Client-side script)
│   └── UI/
│       ├── Button.astro
│       └── Card.astro
├── content/
│   ├── config.ts (Content collections schema)
│   └── novel/
│       ├── volume-1/
│       │   ├── ch-01.md
│       │   └── ...
├── layouts/
│   ├── BaseLayout.astro (Main shell)
│   └── ChapterLayout.astro (Optimized for reading)
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   ├── about.astro
│   ├── contact.astro
│   ├── privacy.astro
│   ├── rss.xml.ts
│   └── novel/
│       ├── index.astro (Catalog)
│       └── [volume]/[chapter].astro (Chapter reader)
└── styles/
    └── global.css
```

### Key Components

#### [MODIFY] Content Collection Schema (P0)
Define strict Zod schema:
```ts
const chapterSchema = z.object({
  id: z.string(), // Permanent slug for URL generation
  volume: z.number(),
  chapter: z.number(),
  title: z.string(),
  date: z.date().optional(),
  summary: z.string().optional(),
});
```
**Sorting Logic**: Sort by `volume` ASC, then `chapter` ASC.
**Volume Handling**: Define strict mapping (e.g., `1: "第一卷"`) in a config file or constants.
**URL Generation**: `/novel/${entry.data.id}/` (or `/novel/volume-${v}/ch-${c}/` if slug is not used directly, ensuring permalink stability). User requested specific URL format, so we use `volume-{n}/ch-{nn}` but tied to stable IDs.

#### [NEW] UI Components (P0/P1)
- **StickyNavigation**: Bottom fixed bar on mobile showing Prev/Next/Menu.
- **BigNextButton**: Prominent button at end of chapter content.
- **AdSenseSlot**:
  - **Injection Strategy**: Use a Rehype plugin or Astro slot logic to inject `<AdSense />` after `N` paragraphs to avoid layout shifts.
  - **Fixed Slot**: One distinct slot at the very end of chapter content.
  - **CLS Prevention**: Reserve fixed height container before ad loads.
- **ContinueReading**: Show "Continue: {Chapter Title}" or "Start Reading: Chapter 1" if no history.

#### [NEW] Enhanced Reading Logic (P1)
- **Scroll Restoration**:
  - Save `scrollY` to localStorage.
  - On load, show subtle toast "Restored usage position" with [Cancel] button or auto-hide.
  - Catalog UI: Dim read chapters.

#### [NEW] SEO Generation (Crucial)
- **Absolute URLs**: Ensure `site` in `astro.config` is set to production domain.
- `sitemap-index.xml`: Generate with full absolute URLs.
- `robots.txt`: Manual.
- **Canonical URLs**: `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />`.
- **Open Graph**: Default fallback image for all chapters initially using absolute URLs.

## Verification Plan

### Automated Tests
- Build verification: `npm run build`.
- Check generated HTML files in `dist/`.

### Manual Verification
1. **Responsive Design**: Test on mobile (375px) and desktop (1440px) viewports.
2. **Reading Flow**:
   - Open Chapter 1 -> Scroll to bottom -> Click Next -> Ensure Chapter 2 loads.
   - Close tab -> Reopen site -> Click "Continue Reading" -> Verify correct chapter.
3. **SEO**:
   - Inspect `<head>` tags for `App title`, `description`, `og:image`.
   - Access `/sitemap-index.xml` and `/rss.xml`.
