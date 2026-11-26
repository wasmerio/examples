# Changelog

All notable changes to this project will be documented in this file.

This project follows semantic versioning where practical.

## [2.0.0] - 2026-08-17

A full visual redesign, a move to Astro 7, and a central configuration file. The
content schema is unchanged, so existing product Markdown continues to work, but
every template and all styling has been rewritten.

### Added — Cart

- Slide-in cart drawer, rendered once per page from the header, with per-line quantity steppers, thumbnails, a live subtotal, and a link through to the full cart page.
- The drawer is the confirmation after adding: it opens on add rather than swapping the button label to "Added" and back.
- Any control becomes an add-to-cart button with `data-add-to-cart` and an optional `data-add-quantity`; the delegated handler in the layout does the rest, so pages carry no cart wiring.
- Quantity stepper on the product page, writing the chosen value into the add-to-cart button and resetting after each add.
- Shared `.qty` stepper used by the product page, the cart page, and every drawer line.
- The header cart is a real link to `/cart` that script upgrades into a drawer toggle, so the cart is still reachable without JavaScript.
- Drawer manages focus, traps Tab, closes on Escape or backdrop click, locks page scroll, and restores focus to whichever control opened it.

### Changed — Design

- Rebuilt the visual language as cool and architectural: gallery-grey surfaces, true-black ink, concrete-grey secondary text, and a single oiled-walnut accent, replacing the warm off-white and brown palette.
- Removed the caption-above-headline eyebrow from every section. Sections are now introduced by a headline over a rule, so a long page no longer reads as the same block repeated.
- Removed the vertical dividers from the specification bands; cells are separated by space and by the band's own top and bottom rules.
- Rebuilt the homepage hero as a split layout — headline, lead and calls to action on the left against a full-height photograph on the right — replacing the full-width headline that pushed the image below the fold.
- Moved the newsletter out of the homepage and into a centred band at the top of the footer, where it reaches every page.
- Removed the square mark from the wordmark.
- Dropped the coordinates line from the footer, and moved all contact details onto a neutral `email@example.com` placeholder.
- Trimmed the newsletter to a headline, one field and a button.
- The sticky header now fills solid on scroll instead of going translucent, so type never shows through it.
- Retired the `.label-index` accent numeral along with the eyebrows that used it.
- Replaced Instrument Serif and Inter with variable Archivo for display and UI, and IBM Plex Mono for labels, reference numbers and specification data.
- Squared every corner. `--radius` is now `0px` and drives buttons, chips, fields and image frames from one token.
- Replaced cards and soft shadows with a hairline system — sections, spec bands and card meta rows are separated by rules rather than boxes.
- Removed the italic accent phrase from every headline; emphasis now comes from scale and space.
- Removed the trailing arrow glyph from every link. Links underline with a left-to-right wipe, and product cards signal hover by recolouring their meta rule.
- Replaced pill buttons with square ones whose accent panel wipes up from the baseline on hover and focus.
- Added a fluid type scale as component classes — `.type-hero` through `.type-body` — so a heading carries one class rather than three utilities. `.type-hero` is sized to sit in a column beside the hero image rather than span the page.
- Added `.shell`, `.rule` and `.fact` layout primitives, and `.btn`, `.link`, `.chip`, `.field`, `.qty` control classes.
- Kept the mono `.label` for spec terms, form labels and column headings only — data, never decoration.
- Added a very low-opacity paper grain over the page.
- Rebuilt every page against the new system: homepage, catalogue, product detail, studio, cart and 404.
- Unified the homepage hero, which previously rendered separate mobile and desktop markup with duplicate hero images, into one responsive layout.
- Redesigned the mobile menu as a numbered index with staggered entry.
- Rewrote the 404 page to match the rest of the theme instead of standing alone without header or footer.

### Added — Motion

- Scroll reveals driven by one `IntersectionObserver`, with four variants: rise, fade, image unmask, and a self-drawing hairline. Each target is unobserved after it fires.
- Per-element stagger through a `--reveal-delay` custom property.
- Scroll-driven CSS, requiring no JavaScript where `animation-timeline` is supported: the header fills from transparent to solid, and hero and studio photographs drift against the scroll.
- A CSS-only `.hero-in` entrance for above-the-fold content, so the hero never waits on the observer.
- Motion is gated behind a `data-motion` flag set before first paint only when JavaScript is available and reduced motion is not requested. Reduced-motion and no-JavaScript visitors get complete, static pages.

### Added — Configuration

- `src/config/site.ts` as the single place for studio name, tagline, default metadata, contact address, location, theme colour, navigation, footer columns and blurb, commerce defaults, and promoted products.
- `pageTitle()` helper so every page title shares one format.
- `requireProduct()` helper, which fails the build with a named error when a configured product slug does not exist.
- Currency, locale and the flat delivery rate are now configured once and serialized to the client-side cart, rather than hardcoded in three places.
- Mobile menu numbering and the cart's index are derived from the navigation list.

### Changed — Platform

- Upgraded Astro 6.4.8 to 7.2.2, and with it Vite 8 and the rolldown-based build.
- Replaced `@tailwindcss/postcss` with the official `@tailwindcss/vite` plugin and removed `postcss.config.mjs`. Vite 8 resolves `@import` before PostCSS runs, which broke the previous setup.
- Moved `Astro.site` and `Astro.url.origin` references out of `is:inline` script bodies and into page frontmatter; Astro 7 no longer resolves them inside inline scripts.

### Fixed

- The `mask` scroll reveal set the `transition` shorthand directly on the image it revealed, which replaced the image's own `transition-transform`; the feature image's hover snapped instead of easing. The clip now lives on a wrapper.
- `.link` painted its underline across the full element box, so a blockified link underlined its whole column rather than its text. It now shrink-wraps.

- Resolved all 13 `npm audit` advisories, including high-severity findings in `sharp`, `esbuild`, `svgo` and `postcss`. The dependency tree now reports zero vulnerabilities.
- Corrected malformed markup in the mobile menu, which closed one more element than it opened.
- Fixed the cart's filled container carrying both `hidden` and `grid` classes, so its display state is now toggled correctly.
- Removed a duplicated hero image from the homepage.
- Product card headings now take a `headingLevel` prop, so related-product grids no longer emit an `h2` beneath another `h2`.

### Added — Accessibility and SEO

- Configurable fallback share card (`siteConfig.socialImage`, `public/og-image.png`) used by every page that does not supply its own artwork, with `og:image:width`, `og:image:height` and alt text emitted alongside it.
- Redrew the favicon as the bare letterform, dropping the rounded plate, border and accent underline. It is a single path that inverts under `prefers-color-scheme: dark`.

- BreadcrumbList JSON-LD on product pages.
- Contact address and region added to the Organization JSON-LD.
- The homepage headline is now a real `h1` rather than a paragraph beside a visually hidden one.
- Every form control has an associated label; the checkout and catalogue controls carry visible ones, and the single-field newsletter uses a screen-reader label rather than leaning on its placeholder.
- Cart additions and newsletter submissions announce through `role="status"` live regions.
- Catalogue filter groups are labelled, and chips expose state through `aria-pressed`.
- Product gallery thumbnails are a labelled group with per-thumbnail accessible names.
- Verified zero axe-core violations across all six routes at desktop and mobile widths, including the filled cart, the checkout step, the empty catalogue result, the open mobile menu, and the cart drawer in both its filled and empty states.

### Changed — Performance

- Font payload reduced from eight WOFF2 files to four, totalling about 93 KB, with the latin Archivo file preloaded and everything else subset by `unicode-range`.
- Regenerated `preview.webp` from the new design.

## [1.0.0] - 2026-06-18

### Added

- Initial Astro 6 theme release for Atelier Kō.
- Static homepage, catalogue, product detail pages, about page, cart page, and 404 page.
- Product catalogue entries managed through Astro content collections.
- Vanilla JavaScript enhancements for catalogue filters, product gallery, newsletter preview, and local cart.
- SEO defaults including canonical URLs, Open Graph metadata, Twitter card metadata, sitemap support, Organization JSON-LD, and Product JSON-LD.
