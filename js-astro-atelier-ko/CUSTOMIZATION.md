# Customization Guide

Use this guide when adapting Atelier Kō for a real workshop or catalogue.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It holds the studio name, tagline, default title and description, contact address, region, theme colour, navigation, footer columns and blurb, commerce defaults, and which products the theme promotes. Components read from it rather than hardcoding copy, so renaming the studio does not mean editing markup.

`name` fills the wordmark, the footer, `og:site_name`, the `author` meta tag, the Organization and Product JSON-LD, and — through `pageTitle()` — every page title.

`tagline` is used for the homepage `<title>` and as the Organization `slogan`.

`defaultTitle` and `description` are the fallbacks for any page that does not pass its own.

`email` is linked from the footer's last column and from the "Write to us" button on the studio page. It is also emitted in the Organization JSON-LD.

`themeColor` fills the `theme-color` meta tag. Keep it in step with `--canvas` in [src/styles.css](./src/styles.css) so the mobile browser chrome matches the page.

`socialImage` is the fallback share card, served from `public/`. Any page that does not pass its own `image` uses it — the homepage, catalogue, studio, cart and 404 — while product pages pass their own photography. Replace `public/og-image.png` and update the dimensions if your card is not 1200×630.

The canonical domain is deliberately **not** in this file. It is `site` in [astro.config.mjs](./astro.config.mjs), read from the `SITE` environment variable with the demo URL as a fallback, so there is only ever one source of truth:

```bash
SITE=https://your-domain.com npm run build
```

## Navigation

`siteConfig.navigation` drives both the desktop header and the mobile menu, in order:

```ts
navigation: [
  { label: "Index", href: "/" },
  { label: "Catalogue", href: "/catalog" },
  { label: "Studio", href: "/about" },
];
```

The active item is matched by prefix, except `/`, which matches exactly. It is marked with `aria-current="page"` and an accent rule beneath the label — colour is never the only signal.

The mobile menu numbers its items from this list and gives the cart the next number automatically, so adding a fourth link renumbers everything without further edits.

## Footer

`siteConfig.footerBlurb` fills the first column. `siteConfig.footerColumns` is an array of `{ heading, links }` — add, remove, or reorder columns freely. The contact address from `siteConfig.email` is appended to the last column automatically, so it is configured once.

The grid in [src/components/SiteFooter.astro](./src/components/SiteFooter.astro) assumes one wide column plus three narrow ones. If you change the number of columns, adjust the `md:col-span-*` classes there.

## Featured Products

`siteConfig.featured` decides which pieces are promoted. Each value is a filename in [src/content/products](./src/content/products) without the `.md`:

```ts
featured: {
  homepageGrid: ["arvid-chair", "low-plinth-table", "tora-desk"],
  homepageSolo: "monolith-bench",
  mobileMenu: "oken-stool",
}
```

These resolve through `requireProduct()` in [src/data/products.ts](./src/data/products.ts), which throws a named error at build time when a slug does not exist. A typo fails the build rather than shipping an empty section.

## Product Frontmatter

Products live in [src/content/products](./src/content/products), one Markdown file per piece. The filename becomes the slug. The schema is in [src/content.config.ts](./src/content.config.ts).

```md
---
name: Arvid Chair
collection: Collection 01 — Seating
category: Seating
material: Ash
price: 840
shortDescription: Curved Ash
dimensions: W 54 × D 56 × H 92 cm
finish: Soap-Treated
leadTime: 6–8 Weeks
images:
  - ../../assets/p-arvid-1.jpg
  - ../../assets/p-arvid-2.jpg
order: 2
---

A single sculpted shell of steam-bent ash, the Arvid Chair traces the silhouette of the body.
```

The Markdown body is the long description, used on the product page, in the meta description, and in the Product JSON-LD. Keep it to a paragraph or two.

`order` controls the default "Featured" sort; ties fall back to alphabetical name. `category` and `material` are free text — whatever values you use become the catalogue filter chips automatically, so there is no second list to maintain.

`images` are relative paths into [src/assets](./src/assets). The first is the card and social image. The gallery grid on the product page is three columns wide, so three images per piece sits best.

## Catalogue Filters and Sorting

[src/pages/catalog.astro](./src/pages/catalog.astro) builds its chips from `getProductFilters()`, which collects the distinct `category` and `material` values across all products. Filtering, sorting, the result count, and the empty state are handled by one inline script that toggles the `hidden` attribute and reorders nodes in place — no re-rendering and no framework.

Active chips are marked with `aria-pressed`, and the `.chip` styles in [src/styles.css](./src/styles.css) key off that attribute rather than a separate class, so state and styling cannot drift apart.

To add a sort option, add an `<option>` to the `[data-catalog-sort]` select and a matching branch in the comparator.

## Cart and Checkout

The cart is `localStorage` only. [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) defines `window.AtelierCart` in the document head — `read`, `write`, `count`, `add`, `remove`, `setQuantity` — and dispatches an `atelier-cart-change` event that the header badge and the cart page both listen for.

Commerce defaults come from `siteConfig.commerce`:

```ts
commerce: {
  locale: "en-US",
  currency: "USD",
  shippingFlatRate: 120,
}
```

`locale` and `currency` feed `formatPrice()` in [src/data/products.ts](./src/data/products.ts) for server-rendered prices. [src/pages/cart.astro](./src/pages/cart.astro) serializes the same three values into its `#cart-data` JSON payload alongside the product list, so the client-side cart formats prices identically without hardcoding anything.

Each cart row is cloned from a `<template>` rendered per product, which keeps the Astro image pipeline in charge of the thumbnails while the row itself is built on the client.

The checkout is a two-step preview. Submitting it calls `alert()` and nothing else. To connect it, replace the `submit` handler at the bottom of that page; the card, expiry and CVC inputs already normalise their own formatting.

## Cart Drawer

[src/components/CartDrawer.astro](./src/components/CartDrawer.astro) renders once per page from `SiteHeader`. The panel slides in from the right over a backdrop, and lists each line with a thumbnail, a `.qty` stepper, a remove control, a subtotal, and a link through to the full cart page.

Open and close is delegated from [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro), which owns focus, the scroll lock, Escape, and the focus trap. Two attributes are the whole API:

- `data-cart-toggle` on any element opens or closes the panel.
- `data-cart-close` on any element inside it closes it.

Pages never wire up their own handlers. The header cart is a real `<a href="/cart">` that the script upgrades, so with JavaScript off it stays an ordinary link to the cart page and the drawer never appears.

Because the stored cart holds only `{ slug, quantity }`, the drawer ships a small catalogue snapshot — name, price, material, thumbnail — built in its frontmatter. Thumbnails go through `getImage()` at build time, so the panel is on optimized WebP without an `<Image>` per line.

## Add to Cart

Any control can add to the cart. Give it `data-add-to-cart="<slug>"` and, optionally, `data-add-quantity`:

```html
<button type="button" data-add-to-cart="arvid-chair" data-add-quantity="1">Add to cart</button>
```

The delegated handler in `BaseLayout` reads both, adds the line, and opens the drawer — the drawer is the confirmation, so there is no label that swaps to "Added" and back.

The product page pairs this with a `.qty` stepper that writes the chosen value into `data-add-quantity` and resets to 1 after a successful add. That is the only page-level cart script in the theme.

## Newsletter

The signup is a centred band at the top of [src/components/SiteFooter.astro](./src/components/SiteFooter.astro), so it appears on every page rather than as one more homepage section. It is a headline, one field and a button — no supporting paragraph.

It is a visual starter: it validates, disables the button, and prints a confirmation into a `role="status"` element. It posts nowhere. Replace the `submit` handler at the bottom of that component, or point the `<form>` at your provider and delete the script.

The input uses `.newsletter-field`, which is the underlined `.field` treatment centred for this block.

## Theme Tokens

All colour, geometry, easing and layout values are custom properties on `:root` in [src/styles.css](./src/styles.css). Nothing below that block hardcodes a colour, so retheming is a single edit:

```css
:root {
  --canvas: #f4f4f2; /* page background */
  --surface: #eaeae7; /* image and panel backgrounds */
  --surface-strong: #dededa; /* the next step down */

  --ink: #101010; /* body and headings */
  --muted: #5a5a56; /* secondary copy, labels */

  --accent: #8a5322; /* oiled walnut — links, active states, focus */
  --accent-ink: #ffffff; /* text on accent fills */

  --line: color-mix(in oklab, var(--ink) 13%, transparent); /* hairlines */
  --line-strong: color-mix(in oklab, var(--ink) 26%, transparent); /* field underlines */

  --radius: 0px; /* square by default */
  --gutter: 1.5rem; /* page inset, 2.5rem from lg */
  --shell: 96rem; /* max content width */
}
```

`--line` and `--line-strong` are derived from `--ink` with `color-mix`, so changing the ink colour keeps every hairline in the same family.

The `@theme inline` block below maps these to Tailwind, giving you `bg-canvas`, `text-muted`, `border-line`, `text-accent` and so on. Add a token in `:root` and expose it there to get a matching utility.

`--radius` is `0px` because the design is architectural. Set it to `4px` or `8px` and every button, chip, field and image frame softens together.

If you change `--canvas`, update `siteConfig.themeColor` to match.

## Typography

The scale is fluid and defined as component classes rather than utilities, so headings carry one class instead of three:

| Class        | Use                                             |
| ------------ | ----------------------------------------------- |
| `.type-hero` | Homepage and 404 headline                       |
| `.type-h1`   | Page headlines                                  |
| `.type-h2`   | Section headlines                               |
| `.type-h3`   | Card and column headings                        |
| `.type-lead` | Intro paragraph under a headline                |
| `.type-body` | Body copy                                       |
| `.label`     | Mono caption — section names, spec terms        |
| `.mono`      | Mono with tabular numerals — prices, dimensions |

Each display class sets its own `font-size`, `line-height` and `letter-spacing` with `clamp()`, so they scale between the smallest phone and the widest desktop without breakpoints. Tune the middle value of the clamp to change how aggressively type scales.

`.label` is for spec terms, form labels and column headings — data, not decoration. Sections are **not** introduced by an eyebrow caption: a headline over a `.rule` carries them, which keeps a long page from reading as the same block repeated.

`.label` is `inline-flex`. Do not put a `border-t` on it directly — the rule will only span the text. Wrap it, or use a `.rule` element above it.

## Component Classes

Defined in the `@layer components` block of [src/styles.css](./src/styles.css):

- `.btn` with `.btn-primary` or `.btn-outline` — the accent panel wipes up from the baseline on hover and focus. `.btn-outline` recolours its own rule to match, so the fill never buries the border.
- `.link` — an underline that wipes in from the left, drawn with a background gradient so it never affects layout. `.link-mono` adds the small uppercase mono treatment. The rule is painted across the element box, so the class sets `width: fit-content` to hug its text wherever it has been blockified; that is ignored while the link is inline. To centre a blockified one, add `mx-auto` rather than `w-full`.
- `.chip` — catalogue filter, styled from `aria-pressed`.
- `.field` and `.field-label` — underlined inputs and selects. The underline turns accent on focus.
- `.shell` — the centred page container. Applies `--shell` and `--gutter`.
- `.rule` — a full-width hairline, and the element to attach the self-drawing reveal to.
- `.fact` — one cell of a specification band. Two-up on small screens and four-up from `md`. Cells are separated by space and by the band's own top and bottom rules; there are no vertical dividers between them.
- `.qty` (with `.qty-sm`) — the quantity stepper, shared by the product page, the cart page and every drawer line.

## Motion

Motion is opt-in at runtime. A small script in the document head sets `data-motion="on"` on `<html>` only when JavaScript is running **and** the visitor has not asked for reduced motion. Every reveal rule is scoped to that attribute, so without it each target renders in its final state. Reduced motion and no-JavaScript both get complete, static pages — this is verified, not assumed.

A single `IntersectionObserver` at the end of the body observes `[data-reveal]` and unobserves each target once it fires, so the cost falls to nothing after the first pass down the page.

Four variants:

| Attribute            | Effect                         |
| -------------------- | ------------------------------ |
| `data-reveal`        | Rises 1.75rem and fades in     |
| `data-reveal="fade"` | Fades only, no movement        |
| `data-reveal="mask"` | Unmasks its child image upward |
| `data-reveal="line"` | Draws a hairline left to right |

Stagger a group by setting `--reveal-delay` per item:

```astro
{items.map((item, index) => (
  <div data-reveal style={`--reveal-delay:${index * 110}ms`}>…</div>
))}
```

Two variants clip or scale a **child** rather than the element being observed. This is deliberate: a target clipped to zero height or scaled to zero width reports an empty intersection rectangle, and the observer would never fire for it. Keep that structure if you add variants of your own.

`data-reveal="mask"` therefore expects a plain wrapper around the image:

```html
<a class="group block overflow-hidden" data-reveal="mask">
  <div><img class="transition-transform duration-[1100ms] group-hover:scale-[1.04]" /></div>
</a>
```

The wrapper matters. The mask rule sets the `transition` shorthand on its child, so pointing it straight at the image would replace the image's own transition and its hover would snap instead of easing.

Above-the-fold content uses the `.hero-in` class instead, a plain CSS keyframe that runs immediately, so the hero never waits on the observer.

Two effects need no JavaScript at all where the browser supports `animation-timeline`:

- `.site-header` starts transparent over the hero and fills to a solid, ruled bar over the first 96px of scroll. Where scroll timelines are unsupported it is solid and ruled from the start, which is why the header is always legible.
- `.parallax` drifts an image against the scroll inside its `overflow-hidden` frame. Where unsupported, the image is simply static.

Durations and the two easing curves are tokens (`--ease-out-expo`, `--ease-out-quart`). Change them once to retime the whole theme.

## Images

Every theme image goes through Astro's `<Image>` component with explicit `width` and `height`, `format="webp"`, and an aspect-ratio class on the element, so nothing shifts as images load.

Above-the-fold images — the homepage hero, the studio photograph, the first product view, and the first three catalogue cards — are `loading="eager"` with `decoding="sync"`. Everything else is lazy. If you reorder the homepage, move the eager flag with the first image.

`ProductCard` takes an `eager` prop for exactly this reason:

```astro
<ProductCard product={product} eager={index < 3} index={index} revealDelay={index * 110} />
```

## Product Card

[src/components/ProductCard.astro](./src/components/ProductCard.astro) takes typed props:

- `product` — required.
- `eager` — load the image immediately. Above the fold only.
- `headingLevel` — `"h2"` or `"h3"`. Set it so the card does not break the page's heading order; the product page passes `"h3"` because its related grid sits under an `h2`.
- `index` — renders a mono reference number beside the name.
- `revealDelay` — milliseconds of stagger for the scroll reveal.

The meta row's top rule turns accent on hover. That is the whole hover affordance — the theme has no arrow glyphs.

## Fonts

Four WOFF2 files in [src/assets/fonts](./src/assets/fonts), declared at the top of [src/styles.css](./src/styles.css):

- `archivo-latin-wght-normal.woff2` and the latin-ext pair — one variable file covering weights 100–900
- `ibm-plex-mono-latin-400-normal.woff2` and the latin-ext pair — regular only

Each `@font-face` carries a `unicode-range`, so latin-ext is only fetched by pages that need it. `Kō` is a latin-ext character, which is why the wordmark pulls that subset.

The latin Archivo file is preloaded in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) by importing it with `?url`, which resolves to the same hashed asset the stylesheet references. Only that one file is preloaded — it paints the hero.

To swap a family, drop the new WOFF2 into that folder, update the `@font-face` blocks and `--font-sans` or `--font-mono` in `@theme inline`, and update the preload import. To drop webfonts entirely, delete the `@font-face` blocks and point the tokens at system stacks; the fallback stacks are already chosen to match the metrics closely.

## Pages and SEO

[src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) owns all metadata. Its props:

| Prop            | Purpose                                                   |
| --------------- | --------------------------------------------------------- |
| `title`         | Page title. Use `pageTitle("Name")` for the house format. |
| `description`   | Meta and social description                               |
| `image`         | Social image — an imported asset or a root-relative path  |
| `noindex`       | Adds `robots: noindex,nofollow`                           |
| `includeHeader` | Render the site header                                    |
| `includeFooter` | Render the site footer                                    |

Canonical URLs, Open Graph and Twitter tags are derived from `site` and the current pathname. JSON-LD is built in page frontmatter and passed through `set:html`, never assembled inline in the template — Astro 7 does not resolve `Astro.*` inside an `is:inline` script.

Structured data shipped: Organization on the homepage, Product and BreadcrumbList on product pages. `@astrojs/sitemap` generates the sitemap, and [src/pages/robots.txt.js](./src/pages/robots.txt.js) generates `robots.txt` from the configured site.

The cart and 404 pages set `noindex`.

To add a page, create it in [src/pages](./src/pages) and wrap it in `BaseLayout` with its own title and description. Give it one `h1`, open with a `.label` and a `.type-h1`, and wrap content in `.shell`.
