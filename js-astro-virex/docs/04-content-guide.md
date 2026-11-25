# Content Guide

Content is managed through Astro's Content Collections. All content lives in `src/content/` as Markdown or MDX files.

## Available Content Collections

The theme includes four content collections:

| Collection | Location | Purpose |
|------------|----------|---------|
| **Blog** | `src/content/blog/` | Blog posts with pagination and tags |
| **Docs** | `src/content/docs/` | Documentation with auto-generated sidebar |
| **Changelog** | `src/content/changelog/` | Version history and release notes |
| **Testimonials** | `src/content/testimonials/` | Customer quotes and reviews |

All collections support both Markdown (`.md`) and MDX (`.mdx`) files.

## Blog Posts

Create files in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description for SEO and previews"
publishedDate: 2025-01-15
author: "Your Name"
image: "/images/blog/post-image.jpg"  # Optional
tags: ["product", "update"]
draft: false
---

Your content here...
```

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `description` | string | Yes | SEO description |
| `publishedDate` | date | Yes | Publication date |
| `author` | string | Yes | Author name |
| `image` | string | No | Cover image path |
| `tags` | string[] | No | Post tags (default: []) |
| `draft` | boolean | No | Hide from listings (default: false) |

### Features

- **Pagination**: Posts are paginated at `/blog/page/2`, `/blog/page/3`, etc.
- **Tag filtering**: Filter by tag at `/blog/tag/[tag-name]`
- **Reading time**: Automatically calculated based on word count
- **RSS feed**: Published posts appear in `/rss.xml`

## Documentation

Create files in `src/content/docs/`:

```markdown
---
title: "Page Title"
description: "Page description for SEO"
section: "Getting Started"
order: 1
draft: false
---

Your documentation content...
```

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Page title |
| `description` | string | Yes | SEO description |
| `section` | string | Yes | Sidebar section name |
| `order` | number | No | Sort order within section (default: 0) |
| `draft` | boolean | No | Hide from sidebar (default: false) |

The sidebar is auto-generated from `section` and `order` fields. Pages with the same `section` are grouped together.

## Changelog

Create files in `src/content/changelog/`:

```markdown
---
version: "2.0.0"
date: 2025-01-15
title: "Major Release"
type: "major"
draft: false
---

## What's New

- New feature one
- New feature two

## Bug Fixes

- Fixed issue with...
```

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Version number |
| `date` | date | Yes | Release date |
| `title` | string | Yes | Release title |
| `type` | enum | Yes | `major`, `minor`, or `patch` |
| `draft` | boolean | No | Hide from listing (default: false) |

## Testimonials

Create files in `src/content/testimonials/`:

```markdown
---
quote: "This product changed everything for us."
author: "Jane Doe"
role: "CTO"
company: "Acme Inc"
avatar: "/images/testimonials/jane.jpg"  # Optional
featured: true
order: 1
draft: false
---
```

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quote` | string | Yes | Testimonial text |
| `author` | string | Yes | Person's name |
| `role` | string | Yes | Job title |
| `company` | string | Yes | Company name |
| `avatar` | string | No | Avatar image path |
| `featured` | boolean | No | Mark as featured testimonial (default: false) |
| `order` | number | No | Sort order (default: 0) |
| `draft` | boolean | No | Hide from listings (default: false) |

## Draft Content

Set `draft: true` in any content file to hide it from:
- Listing pages
- Navigation/sidebar
- RSS feed
- Sitemap

Draft content is still accessible via direct URL during development.

## Images

Store images in `public/images/`:

```
public/images/
├── blog/           # Blog post images
├── team/           # Team member photos
├── testimonials/   # Testimonial avatars
├── logos/          # Company/partner logos
└── og-image.png    # Default Open Graph image
```

Reference images with absolute paths:

```markdown
![Alt text](/images/blog/my-image.jpg)
```

**Note**: Dashboard sample data references placeholder images. Replace these with your actual images when connecting to real data.

## MDX Support

All content collections support MDX. You can import and use components:

```mdx
---
title: "Interactive Post"
---

import Chart from '@dashboard-ui/Chart.astro';

Here's an interactive chart:

<Chart 
  type="line"
  data={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Views',
      data: [12, 19, 3, 5, 2]
    }]
  }}
/>
```

You can use any Astro component in your MDX content. Use path aliases for cleaner imports:
- `@components/*` - All components
- `@sections/*` - Section components
- `@dashboard-ui/*` - Dashboard UI components
- `@ui/*` - UI components

## Content Tips

### Organizing Blog Posts

- Use descriptive filenames: `my-post-title.md` becomes `/blog/my-post-title`
- Tags are case-sensitive: `React` and `react` are different tags
- Future-dated posts are still published (no scheduling)

### Documentation Structure

The sidebar is auto-generated based on `section` and `order` fields:
- Pages with the same `section` are grouped together
- Lower `order` values appear first
- Sections are sorted by the minimum `order` of their pages

### Testimonials Display

Testimonials are sorted by `order` field (ascending). The `featured` field can be used for custom filtering in your pages if needed.
