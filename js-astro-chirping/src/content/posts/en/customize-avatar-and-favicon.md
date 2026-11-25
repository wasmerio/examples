---
title: 'Customize avatar and favicon (with optimized defaults)'
description: 'How to customize the sidebar avatar and browser favicon in Chirping Astro, with examples for optimized local assets plus public/remote fallbacks.'
pubDate: 2026-05-06
tags: [astro, images, avatar, favicon, customization]
categories: [Customization]
translationKey: customize-avatar-and-favicon
toc: true
---

Branding this theme usually starts with two files: your profile avatar in the sidebar and your favicon in the browser tab. This guide shows the fastest path, then the fallback options.

## Avatar: recommended path (optimized)

The theme is now optimization-first for local `src` assets.

1. Put your avatar file in `src/assets/images/site/`.
2. Import it in `src/config.ts`.
3. Set `SITE.author.avatar` to the imported object (not `.src`).

```ts
import avatarImg from './assets/images/site/avatar.png';

export const SITE: SiteConfig = {
  // ...
  author: {
    name: 'Your Name',
    avatar: avatarImg,
    bio: 'Writing about Astro and web performance.',
  },
};
```

Why this is preferred:

- Sidebar rendering uses Astro `Image` for imported metadata.
- You get Astro image pipeline behavior by default.
- You keep type safety via `author.avatar?: string | ImageMetadata`.

## Avatar fallback 1: `/public` path (no optimization)

If you need a stable public URL, use a string path under `public/`:

```ts
author: {
  name: 'Your Name',
  avatar: '/images/avatar.png',
}
```

This renders with plain `img` intentionally. Files in `public/` are served as-is.

## Avatar fallback 2: remote URL (no optimization in Sidebar fallback path)

```ts
author: {
  name: 'Your Name',
  avatar: 'https://example-cdn.com/avatars/me.jpg',
}
```

This also falls back to plain `img` in the sidebar. Use this when your avatar is managed externally.

## Favicon: quickest customization

The favicon is imported in `src/layouts/BaseLayout.astro`:

```ts
import faviconImg from '../assets/images/site/favicon.svg';
```

And linked in `<head>`:

```astro
<link rel="icon" type="image/svg+xml" href={withBase(faviconImg.src)} />
```

Fastest way to customize it:

1. Replace `src/assets/images/site/favicon.svg` with your own file.
2. Keep the same file name if you do not want to touch code.

## Favicon example: use PNG instead of SVG

If you prefer PNG, import a PNG file and update the `type`:

```ts
import faviconImg from '../assets/images/site/favicon.png';
```

```astro
<link rel="icon" type="image/png" href={withBase(faviconImg.src)} />
```

## Favicon example: provide multiple icon sizes

For broader device/browser support, add extra icon links:

```astro
<link rel="icon" type="image/svg+xml" href={withBase(faviconImg.src)} />
<link rel="icon" type="image/png" sizes="32x32" href={withBase('/icons/favicon-32.png')} />
<link rel="icon" type="image/png" sizes="16x16" href={withBase('/icons/favicon-16.png')} />
<link rel="apple-touch-icon" sizes="180x180" href={withBase('/icons/apple-touch-icon.png')} />
```

Store these fixed-size files in `public/icons/`.

## Which option should you pick?

- Want best default performance and simplest maintenance: imported avatar asset from `src/assets`.
- Need a fixed URL or externally hosted image: string avatar path/URL fallback.
- Want zero-code favicon update: replace `src/assets/images/site/favicon.svg` in place.
- Need broad legacy/device coverage: add multiple PNG/icon links.

That is all you need to fully brand the avatar and tab icon without changing the rest of the theme architecture.
