<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Baseline](https://github.com/alexandredesane/astro-baseline) Astro theme by alexandredesane, copied from commit `3bd642ce6a6987953de90f07d5d1659e558c96f7` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-baseline.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** The theme's example env file lists `SITE_URL`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [alexandredesane](https://github.com/alexandredesane), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Baseline
A boring, production-ready Astro starter.

Astro Baseline is an HTML-first starter designed for developers who want a clean foundation, not a framework demo.

No UI kit.<br>
No runtime JavaScript by default.<br>
No magic.

Just solid structure, senior defaults, and a clear separation of concerns.

## Philosophy

Astro Baseline follows a simple rule:

**HTML is the source of truth.**

- Structure lives in `.astro` files
- Content lives in data (`site.ts`, Markdown, YAML, etc.)
- Behavior is opt-in and explicit
- CSS is boring, predictable, and layered

This starter is meant to disappear once you start building.

## What you get

### Structure

- Clean layout system (`Base.astro`)
- Header / Footer components
- Skip link for accessibility
- 404 page included
- Predictable file organization

### SEO (done properly)

- Centralized SEO.astro component
- Canonical URLs
- Open Graph & Twitter cards
- JSON-LD support (opt-in, per page)
- Robots meta handling
- Theme color

### Accessibility basics

- Skip link (SkipLink.astro)
- Semantic HTML
- Focusable main content
- No JS-only interactions

### CSS architecture

No framework. No Tailwind by default.

Layered CSS structure:

```
src/styles/
├─ global.css
├─ partials/
│  ├─ tokens.css      // design tokens (colors, spacing, fonts)
│  ├─ reset.css       // minimal reset
│  ├─ fonts.css       // @font-face declarations
│  ├─ behaviors.css   // behavior-related CSS (x-dialog, etc.)
│  └─ structure.css   // layout & base styles
```

- BEM-friendly
- Easy to delete or replace
- Easy to extend

### Fonts

- Fonts served from `/public/fonts`
- Explicit @font-face
- No external font dependency by default

### Configuration as data

All site metadata lives in one place:

```
// src/content/site.ts
export const site = {
  name,
  tagline,
  description,
  url,
  locale,
  author,
  nav,
  seo
};
```

Used consistently across:

- Header
- Footer
- SEO
- Pages
- JSON-LD

No duplication.

## Layout API

The layout is explicit and declarative.

Example:

```
<Base
  title="Contact"
  description="Get in touch"
  canonicalPath="/contact"
  mainCentered
>
  ...
</Base>
```

Supported layout flags:

- `mainCentered` (example)
- Easy to extend (`mainWide`, `mainNarrow`, etc.)

The layout never guesses.
Pages declare intent.

## JSON-LD (opt-in)

JSON-LD is rendered only if provided.

Example:

```
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url
};
```

Passed directly to the layout:

`<Base jsonLd={jsonLd}>`

No JSON-LD pollution by default.

## Environment

Astro Baseline expects the following environment variable:

`SITE_URL=https://example.com`

Create a `.env` file:

`cp .env.example .env`

Update `SITE_URL` with your domain.

Used for:
- Canonical URLs
- JSON-LD
- SEO consistency

Documented, explicit, predictable.

## Who this is for

This starter is for developers who:

- Prefer HTML over abstractions
- Care about SEO and accessibility
- Want a clean base, not opinions forced on them
- Are tired of over-engineered starters

If you want a UI kit or heavy interactivity out of the box, this is not for you.

## Who this is not for

- Page builders
- No-code tools
- “Install and ship in 5 minutes” demos
- Framework-centric mental models

## Extending Astro Baseline

Astro Baseline is designed to pair naturally with:

- **Astro Content Collections**
- **Build-time tools** (e.g. Frontmatter Core)
- **HTML-first behavior layers** (e.g. Web Components, Alpine.js)
- **Progressive enhancement**

You add complexity only when you need it.

## License

MIT

Do whatever you want.
Build good websites.

## Final note

Astro Baseline is intentionally boring.

That’s the point.

If you never think about this starter again once your project starts, it did its job.
