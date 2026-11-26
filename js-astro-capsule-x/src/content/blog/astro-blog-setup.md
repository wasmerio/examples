---
title: "How to Build a Blog with Astro"
description: "Build a modern static blog from scratch using the Astro framework, covering project setup, content management, and deployment."
pubDate: 2026-07-05
tags: ["astro", "tutorial", "web"]
pinned: true
---

## Why Astro?

Among the many static site generators, Astro has several unique advantages:

- **Zero client JS by default:** No JavaScript is sent to the browser unless you explicitly opt in
- **Component-based:** Supports React, Vue, Svelte, and other framework components
- **Content-driven:** Content Collections provide type-safe content management
- **Performance-first:** Generated pages are small and load fast

## Quick Start

### Initialize the Project

```bash
# Create a new project
npm create astro@latest my-blog

# Enter the project directory
cd my-blog

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Project Structure

```
my-blog/
├── src/
│   ├── components/     # UI components
│   ├── content/        # Content collections
│   │   └── blog/       # Blog posts (Markdown)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   └── styles/         # Global styles
├── public/             # Static assets
├── astro.config.mjs    # Configuration
└── package.json
```

## Content Collections

Astro's Content Collections are the best way to manage blog content.

### Define a Schema

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Create a Post

Create a Markdown file under `src/content/blog/`:

```markdown
---
title: "My First Post"
description: "This is a test post"
pubDate: 2026-07-04
tags: ["hello", "first-post"]
---

## Body Content

Write your article content here...
```

### Query Content

```astro
---
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

{posts.map(post => (
  <article>
    <h2><a href={`/${post.id}`}>{post.data.title}</a></h2>
    <p>{post.data.description}</p>
  </article>
))}
```

## Dynamic Routes

Generate individual pages for each post:

```astro
---
// src/pages/[...slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## Styling

Astro supports multiple styling approaches. CSS Variables are recommended for theme switching:

```css
:root {
  --color-primary: #0369a1;
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
}

html.dark {
  --color-primary: #38bdf8;
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
}
```

Use scoped styles inside components:

```astro
<style>
  .title {
    color: var(--color-primary);
    font-size: 2rem;
  }
</style>
```

## Deployment

### Build

```bash
npm run build
```

Output goes to the `dist/` directory — pure static files.

### Deployment Platforms

| Platform | Command | Notes |
|----------|---------|-------|
| Vercel | `vercel deploy` | Zero config, auto-detects Astro |
| Netlify | Connect Git repo | Auto build and deploy |
| GitHub Pages | GitHub Actions | Free, great for open source |
| Cloudflare Pages | Connect Git repo | Global CDN |

### Vercel Deployment Example

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

## Conclusion

Astro is an ideal choice for building a blog: great developer experience, excellent generated performance, and convenient content management. If you want a fast, modern, and easy-to-maintain blog, Astro is worth trying.

---

> Good tools let you focus on the content itself, not on wrestling with the toolchain. Astro is exactly that kind of tool.
