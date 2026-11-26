# Getting Started

This guide is the fastest way to turn Revamped Astro Zozo into your own site.

## 1. Install

```bash
bun install
```

Recommended local environment:

- Bun `1.3.10` or newer
- Node.js `22.12.0` or newer in the `22.x` line

## 2. Start the project

```bash
bun run dev
```

Run validation before publishing:

```bash
bun run check
bun run build
```

## 3. Replace branding first

Start with these files:

- `src/config.ts`
- `public/sample/logo.svg`
- `public/sample/home-hero.jpg`
- `public/sample/about-hero.jpg`
- `public/site.webmanifest`

Recommended replacements:

- site title
- site description
- footer tagline
- social links
- logo and hero art
- sample domain placeholders such as the current demo URL `https://revamped-astrozozo.netlify.app`

## 4. Replace content

Main content entry points:

- `src/content/posts/` for blog posts
- `src/content/gallery/` for gallery entries and notes
- `src/data/friends.ts` for the friends page

The template is set up so most recurring edits happen in content files rather than route components.

## 5. Replace media

Sample media lives in:

- `public/sample/`
- `src/assets/sample/`

You can either overwrite those files or create your own asset directories and update the references in markdown and page files.

## 6. Optional features

Look here when enabling or adjusting optional site behavior:

- `src/config.ts` for search, comments, and UI toggles
- `giscus.json` and `src/config.ts` for comments
- `src/utils/gallery.ts` for gallery category metadata

## 7. Deploy to Netlify

Recommended Netlify settings:

- Base directory: `/`
- Build command: `bun run build`
- Publish directory: `dist`
- Node.js: `22.12.0` or newer in the `22.x` line

This template already includes footer attribution for Netlify.

## 8. Before publishing publicly

Do a final pass for placeholders:

- replace `example.com` URLs
- replace the demo URL with your own production domain
- replace sample people and sample notes
- replace sample gallery art and portraits
- review README and NOTICE if you are redistributing your own fork
