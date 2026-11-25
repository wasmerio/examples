---
title: "Framework Support"
description: "Virex automatically detects and optimizes builds for 30+ frameworks including Next.js, Astro, Remix, Nuxt, and more."
section: "Features"
order: 12
draft: false
---

Virex provides zero-configuration support for all major web frameworks. When you connect your repository, we automatically detect your framework and configure optimal build settings.

## Supported Frameworks

### React Ecosystem

| Framework | Detection | Build Command | Output |
|-----------|-----------|---------------|--------|
| Next.js | `next.config.js` | `next build` | `.next` |
| Gatsby | `gatsby-config.js` | `gatsby build` | `public` |
| Create React App | `react-scripts` | `react-scripts build` | `build` |
| Vite (React) | `vite.config.js` | `vite build` | `dist` |
| Remix | `remix.config.js` | `remix build` | `build` |

### Vue Ecosystem

| Framework | Detection | Build Command | Output |
|-----------|-----------|---------------|--------|
| Nuxt 3 | `nuxt.config.ts` | `nuxt build` | `.output` |
| Vue CLI | `vue.config.js` | `vue-cli-service build` | `dist` |
| Vite (Vue) | `vite.config.js` | `vite build` | `dist` |
| VitePress | `vitepress` | `vitepress build` | `.vitepress/dist` |

### Other Frameworks

| Framework | Detection | Build Command | Output |
|-----------|-----------|---------------|--------|
| Astro | `astro.config.mjs` | `astro build` | `dist` |
| SvelteKit | `svelte.config.js` | `vite build` | `build` |
| SolidStart | `solid-start` | `solid-start build` | `.output` |
| Qwik | `qwik` | `qwik build` | `dist` |
| Angular | `angular.json` | `ng build` | `dist` |
| Eleventy | `.eleventy.js` | `eleventy` | `_site` |
| Hugo | `hugo.toml` | `hugo` | `public` |
| Jekyll | `_config.yml` | `jekyll build` | `_site` |

## Auto-Detection

When you deploy, Virex analyzes your repository to detect:

1. **Package manager** — npm, yarn, pnpm, or bun
2. **Framework** — Based on config files and dependencies
3. **Build command** — Framework-specific or from `package.json`
4. **Output directory** — Where built files are located
5. **Node version** — From `.nvmrc`, `.node-version`, or `engines`

Detection happens automatically on first deploy:

```bash
$ virex deploy

Detecting project settings...
  Framework: Next.js 14
  Build Command: next build
  Output Directory: .next
  Node Version: 20.x

Building...
```

## Framework-Specific Optimizations

### Next.js

Virex provides deep integration with Next.js:

```javascript
// Automatic optimizations applied:
// - Image optimization via Virex CDN
// - ISR support with edge caching
// - Middleware runs at the edge
// - API routes deployed as serverless functions
```

**App Router** and **Pages Router** are both fully supported.

For ISR (Incremental Static Regeneration):

```javascript
// app/blog/[slug]/page.js
export const revalidate = 3600; // Revalidate every hour

// Virex automatically:
// - Caches pages at the edge
// - Revalidates in the background
// - Serves stale content while revalidating
```

### Astro

Astro projects are optimized for static and hybrid rendering:

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'hybrid', // or 'static', 'server'
  adapter: virexAdapter(), // Optional: use Virex adapter
});
```

**SSR routes** are deployed as serverless functions. **Static pages** are cached at the edge globally.

### Remix

Remix applications get full-stack deployment:

```javascript
// Automatic handling of:
// - Loaders and actions as serverless functions
// - Static assets on CDN
// - Streaming SSR support
// - Deferred data loading
```

### Nuxt 3

Nuxt 3 projects leverage Nitro for optimal deployment:

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'virex', // Optional: explicit preset
  },
});
```

## Custom Configuration

Override auto-detected settings in `virex.config.js`:

```javascript
export default {
  framework: 'nextjs', // Explicit framework
  buildCommand: 'npm run build:production',
  outputDirectory: 'out',
  installCommand: 'npm ci',
  nodeVersion: '20.x',
};
```

Or in your project settings on the dashboard.

## Build Environment

### Node.js Versions

Specify your Node.js version:

```json
// package.json
{
  "engines": {
    "node": "20.x"
  }
}
```

Or use a version file:

```bash
# .nvmrc
20.11.0
```

Supported versions: 18.x, 20.x, 22.x

### Package Managers

Virex auto-detects your package manager:

| Lock File | Package Manager |
|-----------|-----------------|
| `package-lock.json` | npm |
| `yarn.lock` | Yarn |
| `pnpm-lock.yaml` | pnpm |
| `bun.lockb` | Bun |

### Environment Variables

Framework-specific variables are set automatically:

```bash
# Always set
NODE_ENV=production
CI=true

# Next.js
NEXT_TELEMETRY_DISABLED=1

# Nuxt
NUXT_TELEMETRY_DISABLED=1
```

## Monorepo Support

Virex supports monorepos with multiple frameworks:

```
my-monorepo/
├── apps/
│   ├── web/          # Next.js
│   ├── docs/         # Astro
│   └── admin/        # Remix
├── packages/
│   └── ui/           # Shared components
└── package.json
```

Configure the root directory for each project:

```javascript
// virex.config.js (in apps/web)
export default {
  rootDirectory: 'apps/web',
};
```

Or set it in the dashboard under **Settings → General → Root Directory**.

## Static Exports

For frameworks that support static export:

```javascript
// Next.js - next.config.js
module.exports = {
  output: 'export',
};

// Nuxt - nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
});

// Astro - astro.config.mjs
export default defineConfig({
  output: 'static',
});
```

Static exports are deployed to our edge network with optimal caching.

## Troubleshooting

### Framework not detected

Ensure config files are in the repository root (or specified root directory):

```bash
virex deploy --debug
```

### Build command failing

Test locally first:

```bash
npm run build
```

Check that all dependencies are in `package.json`, not installed globally.

### Wrong output directory

Specify explicitly:

```javascript
export default {
  outputDirectory: 'dist', // or 'build', 'out', etc.
};
```

### Missing environment variables

Framework builds may require certain variables. Add them in the dashboard or `.env` file:

```bash
# Required for some frameworks
NEXT_PUBLIC_API_URL=https://api.example.com
```
