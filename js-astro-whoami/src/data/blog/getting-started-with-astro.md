---
title: "Getting Started with Astro"
description: "Why I chose Astro for my personal site and what makes it a great fit for content-driven websites."
pubDate: 2025-12-01
tags: ["astro", "web", "tutorial"]
featured: true
---

Astro is a web framework built for content-driven websites. Unlike React-heavy frameworks that ship JavaScript to the browser by default, Astro renders everything to static HTML and only hydrates interactive components when you explicitly ask for it.

## Why Astro?

For a personal site, the priorities are clear: fast page loads, good SEO, and easy content authoring. Astro delivers all three out of the box.

Content collections give you typed, validated frontmatter with zero configuration beyond a schema definition. Write your posts in markdown, define what fields each post should have, and Astro handles the rest.

```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
})
```

## The Island Architecture

The key insight behind Astro is that most pages on most websites are static content. A blog post doesn't need React. A portfolio page doesn't need Vue. But maybe your search bar does need some client-side JavaScript.

Astro lets you use React, Vue, Svelte, or any other framework for those specific interactive pieces while keeping the rest of the page as pure HTML. This means your pages load fast and your Lighthouse scores stay high.

## Content as First-Class Citizen

What sold me was the content layer. Markdown files with YAML frontmatter are treated as a proper data source with type safety, validation, and query capabilities. No CMS needed, no database to manage. Just files in a folder.

The build output is plain HTML and CSS. No client-side routing, no JavaScript runtime. The result is a site that loads instantly and works everywhere.
