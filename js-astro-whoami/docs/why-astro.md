# Why Astro for Personal Websites

A justification for choosing Astro over other frameworks for content-driven personal sites.

## The Core Problem

A personal website is mostly static content: text, images, links. Blog posts don't need client-side routing. Portfolio pages don't need React state management. Yet most modern frameworks ship a JavaScript runtime to the browser by default, adding weight and complexity to pages that are fundamentally documents.

Astro solves this by treating static HTML as the default output and JavaScript as an opt-in exception.

## Astro vs. Alternatives

### vs. Next.js

Next.js is a full-stack React framework. For a personal site, the trade-offs are clear:

- Next.js ships the React runtime (~80KB+) to every page, even static ones
- App Router adds complexity (server components, client components, layouts) that a personal site doesn't need
- Build times are slower due to the React compilation step
- Markdown support requires MDX configuration or custom loaders
- Hosting often needs serverless functions (ISR, SSR), adding cost and vendor lock-in

Astro renders to pure HTML with zero client-side JavaScript by default. A blog post is a blog post, not a React application.

### vs. Hugo

Hugo is fast and mature, but has friction points:

- Go templates have unintuitive syntax that's hard to customize
- Theming system is powerful but complex (baseof, partials, shortcodes, lookup order)
- No native TypeScript support for configuration or tooling
- Limited component model compared to Astro's `.astro` files
- Adding any interactivity requires separate JavaScript tooling

Hugo is the right choice if you want pure speed and will use an existing theme without heavy customization. Astro is better when you want to build your own design with a modern developer experience.

### vs. Eleventy (11ty)

Eleventy is flexible and minimal, which is both its strength and weakness:

- No built-in component model (relies on template languages like Nunjucks, Liquid)
- Small theme ecosystem, you'll likely build from scratch
- No built-in TypeScript support
- Content collections require plugins or manual setup
- Styling is entirely bring-your-own

Eleventy gives you maximum freedom but minimal structure. Astro provides opinionated defaults (content collections, component model, built-in integrations) while staying lightweight.

### vs. Gatsby

Gatsby was once the default for static React sites, but has declined:

- Heavy build process with GraphQL data layer
- Large dependency tree and slow installations
- React runtime shipped to every page
- Plugin ecosystem has fragmented
- Active development has slowed significantly

Astro is effectively what Gatsby should have become: a content-focused framework that doesn't force a client-side runtime.

## Why Astro Wins for Personal Sites

### 1. Content Collections Are First-Class

Astro's content layer treats markdown files as a proper data source with type safety:

```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
})
```

Frontmatter is validated at build time. Type errors are caught before deployment. No runtime surprises.

### 2. Zero JavaScript by Default

The build output is plain HTML and CSS. No client-side router, no framework runtime, no hydration cost. Pages load instantly on any connection. This directly translates to:

- 100 Lighthouse performance scores
- No layout shifts from JavaScript loading
- Works with JavaScript disabled
- Smaller hosting bandwidth usage

### 3. Island Architecture for Selective Interactivity

When you do need JavaScript (a theme toggle, a search bar), Astro's island architecture lets you hydrate individual components without shipping a framework to the entire page:

```astro
<ThemeToggle client:load />
```

The rest of the page remains static HTML. In practice, a personal site needs very little client-side JavaScript. This template uses a single inline script for theme toggling.

### 4. Framework-Agnostic Components

Astro `.astro` files are essentially enhanced HTML templates. No JSX required, no virtual DOM, no reactivity model to learn. But if you want React, Vue, or Svelte for a specific component, you can add it without converting your entire site.

### 5. Built-In Integrations

The things every personal site needs are available as official integrations:

- `@astrojs/sitemap` for automatic sitemap generation
- `@astrojs/rss` for RSS feed generation
- Shiki for code syntax highlighting with theme support
- Tailwind CSS via the Vite plugin

### 6. Fast Builds

A typical personal site (20-50 pages) builds in under 2 seconds. Hot module replacement during development is near-instant. The feedback loop from editing a markdown file to seeing the change is measured in milliseconds.

### 7. Deployment Flexibility

Astro's static output deploys anywhere that serves files:

- Cloudflare Pages (recommended for this template)
- Vercel, Netlify, GitHub Pages
- Any CDN or static file host
- S3 + CloudFront

No serverless functions required. No vendor lock-in. The output is HTML files in a folder.

## The AI-Agent Argument

Personal websites are becoming machine-readable identity layers. AI agents will crawl, parse, and reason about your site's content to answer questions about you on your behalf.

Astro's static HTML output is inherently more parseable than JavaScript-rendered content. A page that exists as HTML in the source is always readable. A page that requires JavaScript execution to render may not be.

Combined with semantic HTML, JSON-LD structured data, and clean URL patterns, an Astro-built personal site is optimized for both human readers and machine consumers.

## Summary

| Requirement                | Astro   | Next.js        | Hugo    | 11ty   |
| -------------------------- | ------- | -------------- | ------- | ------ |
| Zero JS shipped by default | Yes     | No             | Yes     | Yes    |
| Typed content collections  | Yes     | No             | No      | No     |
| Modern component model     | Yes     | Yes (React)    | No      | No     |
| Markdown-first authoring   | Yes     | Partial        | Yes     | Yes    |
| Build speed (small site)   | Fast    | Slow           | Fastest | Fast   |
| Theme ecosystem            | Growing | Paid mostly    | Large   | Small  |
| Static output, no server   | Yes     | Optional       | Yes     | Yes    |
| Selective interactivity    | Islands | Full hydration | Manual  | Manual |

Astro occupies the sweet spot: modern developer experience with static site simplicity. For a content-driven personal website, it's the most aligned tool available.
