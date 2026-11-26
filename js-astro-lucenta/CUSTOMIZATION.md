# Customization Guide

Use this guide when adapting Lucenta for a real design studio, agency or portfolio.

Most of the site is built from three content collections: **work**, **people**, and **journal**. A journal entry names its authors and the projects it discusses, and the services, homepage and studio page pull covers, counts and related work from the work collection. Copy and data that are not long-form content live in small files in [src/config](./src/config).

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It controls the studio `name` and `legalName`, the `tagline`, the one-line `summary` in the footer, default metadata, the canonical domain, language and date locale, the `email` used across the site, the call to action, the `availability` line, the contact form, the `studios`, and social links.

Update `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, RSS, robots, sitemap, and JSON-LD all depend on it.

- `action` is the "Start a project" button in the header, the hero and the footer.
- `availability` is the line beside the green status dot on the contact page. Set it to an empty string to hide it.
- `studios` lists each studio with its `city`, `address` lines, `phone`, and an IANA `timeZone`. They appear in the footer, and on the contact page with their local time.
- `socials` are the links in the footer, the mobile menu and the contact page, each with a `label` and an `href`. The label picks the icon through [src/lib/socials.ts](./src/lib/socials.ts), which knows Behance, Dribbble, Instagram, LinkedIn, RSS and X.

## Logo

The logo is live text: [src/components/ui/Logo.astro](./src/components/ui/Logo.astro) sets `siteConfig.name` in lowercase beside a round mark whose right edge is filled with the accent colour. To use an SVG logo instead, replace the contents of `Logo.astro` and keep `fill="currentColor"` so it follows the header's light and dark tones.

The favicon is [public/favicon.svg](./public/favicon.svg).

## Navigation

The header reads `navigation` in [src/config/site.ts](./src/config/site.ts). It slides away while scrolling down and returns on the way up, and it reads what sits underneath it to choose light or dark text: images and dark or deep-coloured sections get light text, everything else dark. The bar is solid, in the colour of the section below it. A section can force a tone with `data-tone="light"` or `data-tone="dark"`. Below `64rem` the links move into a full-screen menu.

The footer columns are `footerNavigation`; its Services column lists every service from [src/config/services.ts](./src/config/services.ts). The links under the footer and at the top of the legal pages are `legalNavigation`.

## Work

Each project is a folder in [src/content/work](./src/content/work) with an `index.md`, its `cover.jpg`, and any stills. The folder name is the id and the URL: `halden/` becomes `/work/halden/`. The body of `index.md` is the case study.

| Field         | Notes                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| `title`       | The client's name, up to 24 characters. It is set very large, so shorter is better.                                |
| `headline`    | The italic line under the name, up to 60 characters.                                                               |
| `summary`     | 40 to 240 characters, used on the case study and as the meta description.                                          |
| `disciplines` | One or more keys from [src/config/work.ts](./src/config/work.ts). They drive the filters on the work index.        |
| `sector`      | A short label, such as "Coffee roaster".                                                                           |
| `year`        | The year the project launched. The work index is sorted newest first.                                              |
| `location`    | Optional.                                                                                                          |
| `color`       | The project's own colour as a six-digit hex. It paints the case study header, the list hover and the dot on cards. |
| `ink`         | `light` or `dark`: the text colour that reads best on `color`.                                                     |
| `cover`       | A landscape image, at least 2000px wide.                                                                           |
| `coverAlt`    | Describes the cover.                                                                                               |
| `stills`      | A list of `{ src, alt }`. The first sits beside the testimonial (portrait works best); the rest run full width.    |
| `results`     | Up to four `{ value, label }` figures.                                                                             |
| `testimonial` | Optional `{ quote, name, role }`.                                                                                  |
| `credits`     | A list of `{ role, name }`.                                                                                        |
| `website`     | Optional link to the live project.                                                                                 |
| `featured`    | Featured projects appear on the homepage, in `order`, up to `selectedWork.limit`.                                  |
| `draft`       | Hidden from production builds.                                                                                     |

The disciplines themselves are in [src/config/work.ts](./src/config/work.ts). Add, rename or remove keys there; a project that names a key that no longer exists fails the build.

## Services

[src/config/services.ts](./src/config/services.ts) lists the services in order. Each has a `key` that matches a discipline (so the services page can list related work), a `title`, a short `summary` for the homepage, a longer `description`, a list of `deliverables`, and a `project`: the folder name of the project whose cover appears beside it on the services page and trails the cursor on the homepage list.

## People

Each person is a folder in [src/content/people](./src/content/people) with an `index.md` and a `portrait.jpg` (portrait, 2:3). The frontmatter holds `name`, `role`, `location`, optional `linkedin` and `instagram` links, and `order`. The body is a short bio shown under the portrait on the studio page. People are also the authors of journal entries.

## Journal

Each entry is a folder in [src/content/journal](./src/content/journal) with an `index.md` or `index.mdx` and an optional cover. The frontmatter holds `title`, `description`, `date`, optional `updated`, a `category` from [src/config/journal.ts](./src/config/journal.ts), `authors` (people folder names, lead author first), `cover` and `coverAlt`, and optional `work` (project folder names, shown as cards under the entry). The `featured` entry leads the first page of the journal. Entries per page are set by `journalPageSize`.

## Pages

- **Homepage**: the copy is in [src/config/home.ts](./src/config/home.ts). `hero.lines` are the lines of the headline, and `hero.capsuleLine` is the one that ends in the capsule of cycling project covers. `manifesto.text` is the paragraph that lights up word by word. `figures` are the counters, `testimonial` the quote under the client marquee.
- **Studio**: [src/config/studio.ts](./src/config/studio.ts) holds the lead, story paragraphs, the four `approach` steps (also used on the services page), `recognition`, and the careers band. The two studio photographs are in [src/assets/studio](./src/assets/studio).
- **Clients**: [src/config/clients.ts](./src/config/clients.ts) lists the logos in the homepage marquee and the studio grid. Each `logo` is the name of an SVG in [src/assets/clients](./src/assets/clients), drawn in `currentColor`.
- **Contact**: [src/config/contact.ts](./src/config/contact.ts) holds the lead, the budget and timing options, the thank-you message, and the FAQ. The interest chips come from the services.
- **Legal**: the privacy and terms pages are Markdown in [src/pages/legal](./src/pages/legal).

## Contact Form

The form posts to `siteConfig.contact.action` once `siteConfig.contact.enabled` is `true` and `action` is set, using the `method` beside them. It works with Formspree, Basin, Netlify Forms or your own endpoint. Fields are `name`, `email`, `company`, `timing`, `interests` (repeated), `budget` and `message`. Until an endpoint is set, the form validates and shows its thank-you message without sending anything.

## Motion

Every scroll and pointer effect lives in [src/scripts/motion.ts](./src/scripts/motion.ts) and attaches to a data attribute, so markup decides where it runs:

| Attribute      | Effect                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------- |
| `data-reel`    | Cycles through children marked `data-frame` (the value is the interval in milliseconds). |
| `data-expand`  | Grows from an inset card to full bleed as it scrolls in.                                 |
| `data-words`   | Words light up one by one across the screen.                                             |
| `data-marquee` | Drifts on its own and speeds up and turns with the scroll.                               |
| `data-count`   | Counts up to its value once, when it comes into view.                                    |
| `data-follow`  | An image (`data-follow-image`) trails the pointer over items marked `data-follow-key`.   |

Section reveals and parallax use CSS scroll-driven animations: `.reveal` and `.reveal-img` (with an IntersectionObserver fallback), and `.parallax` on an image frame to let its image drift inside it. Page transitions are native cross-document view transitions; the clicked project card morphs into the case study cover. Under `prefers-reduced-motion` all of it is off and the reel shows its first image.

## Design Tokens

Colours, spacing and radii are custom properties at the top of [src/styles/global.css](./src/styles/global.css): `--paper`, `--paper-2`, `--ink`, `--ink-2`, `--mute`, the rules `--line` and `--line-strong`, and the accent `--signal`. `.on-ink` flips the tokens for a dark section, and `.on-tint` with `ink-light` or `ink-dark` paints a section in `--tint` (a project's colour).

Lucenta self-hosts two families in [public/fonts](./public/fonts), each with its license: **Epilogue** for headlines (`--font-display`) and **Mona Sans** for text (`--font-sans`). To swap typefaces, replace the `@font-face` rules and the font tokens in `global.css`, and update the font preloads in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro).

The display sizes are `.display-xxl`, `.display-xl`, `.display-lg`, `.display-md` and `.display-sm`, each a fluid `clamp()`.

## Feeds and SEO

RSS is at `/rss.xml` (the latest twenty journal entries), robots at `/robots.txt`, and the sitemap at `/sitemap-index.xml`. Every page sets a canonical URL, Open Graph and Twitter/X cards; case studies and journal entries generate their share image from the cover. JSON-LD covers the organization, website, case studies and articles.
