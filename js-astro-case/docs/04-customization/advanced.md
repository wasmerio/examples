# Advanced Customization

Layouts, new content collections, and deeper customizations.

## Layout Customization

Layouts are in `src/layouts/`:

| Layout | Used For |
|--------|----------|
| BaseLayout.astro | All pages (head, scripts, theme) |
| PageLayout.astro | Standard pages |
| ArticleLayout.astro | Blog posts |
| CaseStudyLayout.astro | Project detail pages |

### Changing Content Width

Edit `src/styles/global.css`:

```css
:root {
  --max-width-prose: 65ch;      /* Reading content */
  --max-width-content: 1200px;  /* Page content */
}
```

### Adding a Sidebar

```astro
---
// src/layouts/ArticleLayout.astro
---

<BaseLayout>
  <div class="article-with-sidebar">
    <aside class="sidebar">
      <slot name="sidebar" />
    </aside>
    <article class="content">
      <slot />
    </article>
  </div>
</BaseLayout>

<style>
  .article-with-sidebar {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: var(--space-xl);
  }
  
  @media (max-width: 768px) {
    .article-with-sidebar {
      grid-template-columns: 1fr;
    }
    
    .sidebar {
      order: 2;
    }
  }
</style>
```

## Adding New Content Collections

### Step 1: Define Schema

Add to `src/content.config.ts`:

```typescript
const certificationsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/certifications' }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.coerce.date(),
    credentialUrl: z.string().url().optional(),
    expiryDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  // Existing collections...
  certifications: certificationsCollection,
};
```

### Step 2: Create Content Directory

Create `src/content/certifications/` and add MDX files.

### Step 3: Create Page

Create `src/pages/certifications.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import SEO from '../components/SEO.astro';

const certifications = await getCollection('certifications');
---

<BaseLayout>
  <SEO 
    slot="head"
    title="Certifications"
    description="Professional certifications and credentials"
  />
  
  <main>
    {certifications.map((cert) => (
      <div class="certification">
        <h3>{cert.data.title}</h3>
        <p>{cert.data.issuer}</p>
      </div>
    ))}
  </main>
</BaseLayout>
```

### Step 4: Add to Navigation

Edit `src/config.ts`:

```typescript
nav: [
  // Existing items...
  { label: 'Certifications', href: '/certifications' },
],
```

## Theme Toggle Customization

Location: `src/components/ThemeToggle.astro`

**Change default theme:**

```javascript
// Default: respects system preference
const theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

// Force dark as default
const theme = stored || 'dark';
```

**Add a third theme (e.g., sepia):**

1. Add CSS variables in `src/styles/global.css`:

```css
[data-theme="sepia"] {
  --color-bg: #f4ecd8;
  --color-text: #5c4b37;
  /* ... other variables */
}
```

2. Update ThemeToggle to cycle through three themes.

## SEO & Structured Data

The theme includes JSON-LD structured data in `src/components/StructuredData.astro`.

**Supported Schema Types:**
- `WebSite` — Site-wide information
- `Article` — Blog posts
- `Project` — Case studies
- `Person` — Author information
- `BreadcrumbList` — Navigation breadcrumbs

**Usage:**

```astro
<StructuredData 
  type="Article" 
  data={{
    title: "Article Title",
    description: "Description",
    publishDate: new Date(),
    tags: ["tag1", "tag2"]
  }}
/>
```

**Customizing:**

Edit `src/components/StructuredData.astro` to add new schema types or modify existing fields.

## View Transitions

Astro View Transitions provide smooth page navigation.

**Lifecycle Events:**

```javascript
// Fires on initial load and after each navigation
document.addEventListener('astro:page-load', () => {
  // Initialize components
});

// Fires before new page content is swapped
document.addEventListener('astro:before-swap', (e) => {
  // Modify new document
});
```

**Component Persistence:**

```astro
<header class="site-header" transition:persist>
  <Navigation />
</header>
```

**Disabling:**

Remove `<ClientRouter />` from `src/layouts/BaseLayout.astro`.

## Navigation System

**Active state detection:**

```typescript
const isActive = (href: string) => {
  if (href === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(href);
};
```

- Home is only active on exact root path
- Other links are active if current path starts with their href
- Child pages highlight their parent navigation item

**Client-side updates after View Transitions:**

```javascript
document.addEventListener('astro:page-load', updateActiveNav);
```
