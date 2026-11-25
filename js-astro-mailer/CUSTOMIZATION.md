# Customization

Everything below is a file you edit. Nothing here needs a build step beyond `npm run dev`.

- [Site settings](#site-settings)
- [Navigation](#navigation)
- [Topics](#topics)
- [Writers](#writers)
- [Issues](#issues)
- [Images](#images)
- [Pictures and the lightbox](#pictures-and-the-lightbox)
- [Blocks an issue can carry](#blocks-an-issue-can-carry)
- [Sharing](#sharing)
- [The signup form](#the-signup-form)
- [Colour and theme tokens](#colour-and-theme-tokens)
- [Typography and fonts](#typography-and-fonts)
- [Pages and routes](#pages-and-routes)
- [Search](#search)
- [Feeds](#feeds)
- [SEO and structured data](#seo-and-structured-data)
- [Code blocks](#code-blocks)
- [Icons](#icons)
- [Deployment](#deployment)
- [Release checklist](#release-checklist)

## Site settings

[src/config/site.ts](./src/config/site.ts) holds everything that identifies the publication.

| Field                                | What it does                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| `name`                               | The wordmark, the title suffix, and the publisher in structured data               |
| `tagline`                            | The front-page headline and the share-card alt text                                |
| `title` / `description`              | Defaults for `<title>` and the meta description                                    |
| `siteUrl`                            | Canonical URLs, feeds, sitemap, share cards. **Set this before you build.**        |
| `email`                              | The contact address on the About and Privacy pages                                 |
| `language` / `locale` / `dateLocale` | `<html lang>`, `og:locale`, and date formatting                                    |
| `wordsPerMinute`                     | Reading speed behind every "min read" line                                         |
| `defaultColorMode`                   | `"light"`, `"dark"`, or `"system"` for a first-time visitor                        |
| `bio`                                | One sentence under the masthead and in the footer                                  |
| `cadence`                            | Printed beside the signup form — make it match what you actually send              |
| `editor`                             | The byline fronting the About page. `name` must match a writer used in frontmatter |
| `rss`                                | `fullContent` ships whole issues in the feed; `limit` caps items                   |
| `socials`                            | The footer icon row                                                                |
| `fetchBookmarkPreviews`              | Lets a `Bookmark` read the linked page's Open Graph tags at build time             |

`siteUrl` has no trailing slash. Every absolute URL in the theme is built from it.

## Navigation

Also in `src/config/site.ts`:

- `primaryNavigation` — the links in the header bar and in the mobile drawer.
- `footerNavigation` — the three footer columns. The Topics column is generated from `src/config/topics.ts`, so adding a topic updates it automatically.

## Topics

[src/config/topics.ts](./src/config/topics.ts) defines them once:

```ts
export const topics = ["Craft", "Design", "Growth", "Money", "Tools", "Interviews"] as const;
```

Adding, renaming, or removing a topic updates the frontmatter enum, the header navigation, the footer, the topic index, and the routes in one edit. Every topic needs an entry in `topicMeta` with a one-line `summary`.

Topics also carry their own chip colour. If you add one, add a matching pair of tokens in [src/styles/global.css](./src/styles/global.css) — search for `--topic-craft` — and a chip rule beside the others:

```css
.chip[data-topic="essays"] {
  background: var(--topic-essays);
  color: var(--topic-essays-ink);
}
```

Without the pair the chip falls back to the neutral grey chip, which is a fine look if you would rather not use topic colour at all.

## Writers

[src/config/writers.ts](./src/config/writers.ts) maps a byline to a portrait and a bio:

```ts
"Mara Chen": {
  bio: "Edits Mailer and writes most of the craft pieces.",
  image: maraChen,
  creditName: "Ayo Ogunseinde",
  creditUrl: "https://unsplash.com/photos/8VghbLlZUdQ",
},
```

The key must match `author.name` in frontmatter exactly. A name with no entry still works — it falls back to a monogram avatar and an empty bio. Portraits live in `src/assets/writers` and are cropped to a circle at build time, so a square source is ideal.

The bundled portraits are Unsplash placeholders of models with no connection to these fictional bylines. Replace them before you publish.

## Issues

An issue is a folder under [src/content/issues](./src/content/issues) containing `index.md` (or `index.mdx`) and its cover. The folder name is the URL slug: `src/content/issues/how-to-end-an-issue/` becomes `/issues/how-to-end-an-issue/`.

```yaml
---
issue: 5
title: "How to end an issue"
excerpt: "Openings get all the advice. The last hundred words are what decides whether anyone replies."
topic: "Craft"
date: 2026-06-11
updatedDate: 2026-06-20 # optional
author:
  name: "Mara Chen"
  role: "Editor"
cover:
  src: "./cover.jpg"
  alt: "A bright gradient of magenta, yellow and cyan"
  creditName: "Codioful"
  creditUrl: "https://www.pexels.com/photo/colorful-gradient-6985001/"
featured: false # promotes this issue to the front-page lead
draft: false
---
```

The schema is in [src/content.config.ts](./src/content.config.ts) and it is strict on purpose: a missing `excerpt`, an unknown `topic`, or a cover with no `alt` fails the build rather than shipping.

Notes on individual fields:

- **`issue`** is what the index, the archive, and the previous/next links print. It is yours to set — the theme never derives it — so a numbering scheme that restarts each year works as long as the dates stay in order.
- **`excerpt`** is used on every listing, in the feed, and as the page's meta description. Two sentences is the sweet spot.
- **`featured`** promotes one issue to the front-page lead. If none is flagged, the newest wins. Flagging several is harmless; the newest of them leads.
- **`draft: true`** removes the issue from every listing, the feed, the search index, and the sitemap, but it still builds at its own URL so you can preview it.

Read time is counted from the body at build time, so no issue carries it in frontmatter.

### MDX

An issue can be `index.mdx` instead, which lets you use components in the body. Four of the bundled issues are written that way; [plain-text-still-beats-your-template](./src/content/issues/plain-text-still-beats-your-template) is the fullest example, with two pictures, a table and a code block.

Every block listed in [src/lib/issue-components.ts](./src/lib/issue-components.ts) is handed to MDX, so `<Callout>`, `<Toggle>`, `<Bookmark>`, `<Audio>`, `<FileCard>` and `<Figure>` work with no import at the top of the file. Importing one by hand still wins, which is how the bundled issues are written. See [Blocks an issue can carry](#blocks-an-issue-can-carry).

Images imported in MDX go through Astro's optimizer, so they are responsive and sized in the markup. See [Pictures and the lightbox](#pictures-and-the-lightbox).

## Images

Covers are imported by the content schema, which means Astro validates, resizes, and fingerprints them. A source around 1600–2000px wide is plenty; the theme never serves anything larger.

Share cards are cropped from each cover at build time to 1200×630, so a cover whose subject sits dead centre survives the crop best. Pages with no cover of their own fall back to `public/og-image.png`.

The bundled covers are from [Pexels](https://www.pexels.com/) under the Pexels License, credited per issue in frontmatter. Replace them with your own before publishing, and keep the `creditName` / `creditUrl` pair accurate — it is printed under every cover.

## Pictures and the lightbox

Inside an issue, use [src/components/content/Figure.astro](./src/components/content/Figure.astro) from an `.mdx` file:

```mdx
import warmGradient from "./photo-1.jpg";

<Figure
  src={warmGradient}
  alt="A soft gradient of cream, peach and coral"
  caption="Authentication comes first."
  credit="Photo by Codioful"
  creditUrl="https://www.pexels.com/photo/a-light-color-gradient-7130554/"
  width="wide"
/>
```

`width` is `regular` (the reading column) or `wide`, which breaks out to 58rem on a wide screen — the one place an issue is allowed to be wider than its text.

A tall picture is cropped to a 32rem band in the flow so it does not push the reading off the screen. Nothing is lost: the lightbox opens it whole.

**The lightbox** is [src/components/content/Lightbox.astro](./src/components/content/Lightbox.astro), mounted once on the issue page. It picks up anything carrying `data-lightbox`, which means every picture in the body, all in one group called `issue` — so the arrows walk the issue in reading order. Pass `group="something"` to a `Figure` to keep a set to itself.

The cover is deliberately not one of them: it is the issue's own illustration rather than something a reader came to examine, so it stays a plain picture. To give it back the enlarged view, wrap its `<Image>` in the issue page in the same `data-lightbox` button a `Figure` uses.

It is a native `<dialog>`, so focus trapping, Escape, and returning focus to the trigger come from the platform. The script adds arrow keys, swipe, a counter, and preloading of the neighbouring pictures.

**Plain Markdown images** — `![alt](./photo.jpg)` in a `.md` issue — are wired up at runtime by [src/components/content/ProseRuntime.astro](./src/components/content/ProseRuntime.astro), so a writer who never reaches for a component still gets the lightbox. They carry no caption or credit, which is the reason to prefer `Figure` when a picture is not yours.

The same runtime wraps any wide Markdown table in a focusable scroll frame, so a four-column table does not drag the page sideways on a phone.

## Blocks an issue can carry

Five components beyond `Figure`, all in [src/components/content](./src/components/content) and all on show at [`/styleguide/`](./src/pages/styleguide.astro). In an MDX issue none of them needs an import.

```mdx
<Callout tone="warn" emoji="⚠️">
  <p>A caveat a reader should not miss.</p>
</Callout>

<Toggle heading="What counts as a bulk sender" open>
  <p>Detail a reader can ask for, on a `<details>` element, so it works with no JavaScript.</p>
</Toggle>

<Bookmark url="https://astro.build/" />

<Audio src="/media/sample-audio.wav" title="A sample recording" note="3:12" />

<FileCard src="/files/sample-document.pdf" title="The template" meta="PDF · 240 KB" />
```

- **`Callout`** — `tone` is `grey`, `accent`, `info`, `success`, `warn` or `danger`, and each one is mixed from the theme's own tokens rather than a fixed pastel, so it holds in both colour modes. `emoji` is one character, or nothing.
- **`Toggle`** — `heading` is required; `open` starts it expanded. Several in a row read as a short FAQ.
- **`Bookmark`** — a URL is enough. The picture, title, description and site name come from the linked page's Open Graph tags, read at build time by [src/lib/open-graph.ts](./src/lib/open-graph.ts): every lookup is cached in `.astro/open-graph.json`, times out after six seconds, and degrades to a plain card with a link glyph. Anything you write by hand wins, and a card written out in full makes no request at all. Set `fetchBookmarkPreviews: false` in the site config for offline or sealed builds.
- **`Audio`** — the browser's own player, which is keyboard accessible and follows the reader's media keys. `src` is a file in `public/` or any absolute URL.
- **`FileCard`** — a download. `meta` is written out rather than measured, so it stays honest.

To add a block of your own: write it in `src/components/content`, style it in the Content blocks section of [src/styles/global.css](./src/styles/global.css), register it in [src/lib/issue-components.ts](./src/lib/issue-components.ts), and add it to the styleguide.

## Sharing

[src/components/ShareRow.astro](./src/components/ShareRow.astro) is one button at the foot of an issue. On a device with a share sheet of its own it hands off to that; everywhere else it opens [src/components/ShareSheet.astro](./src/components/ShareSheet.astro) — eleven targets, the long tail behind **More**, and the page link with a copy button.

Every target is a plain link, so the card works the moment it opens even where the clipboard is unavailable. Edit the `targets` and `extraTargets` arrays to change the list; each entry is a label, a `LocalIcon` name, a brand colour for the hover state, and a share URL.

## The signup form

One component, [src/components/SubscribeForm.astro](./src/components/SubscribeForm.astro), used in two places: the masthead on the front page, and the closing panel on the front page, on every issue, and on the about page. The header, the drawer, and the footer link to `/#subscribe` rather than carrying another copy of the form.

It is a plain HTML form, so any provider that accepts a POST works:

```ts
newsletter: {
  enabled: true,
  action: "https://buttondown.com/api/emails/embed-subscribe/your-handle",
  method: "post",
  emailFieldName: "email",
  title: "Get the next issue",
  description: "One email every other Thursday.",
  terms: "We store your address to send the newsletter, and nothing else.",
  proof: "2,400 readers",
},
```

`emailFieldName` is the only field that varies between providers — Mailchimp wants `EMAIL`, most others want `email`. Check the embed snippet your provider gives you.

While `enabled` is false or `action` is empty, the field and button render disabled and the note says so. That is deliberate: a form posting nowhere loses addresses silently.

If your provider needs hidden fields (Mailchimp's bot trap, for instance), add them inside the `<form>` in `SubscribeForm.astro`.

## Colour and theme tokens

All of it lives at the top of [src/styles/global.css](./src/styles/global.css), as custom properties on `:root` with a dark override on `:root[data-theme="dark"]`.

| Token                                        | Used for                                  |
| -------------------------------------------- | ----------------------------------------- |
| `--page`                                     | The page background                       |
| `--surface`, `--surface-strong`              | Cards, panels, hover states               |
| `--surface-accent`                           | The signup panel and the current nav item |
| `--ink`, `--ink-soft`, `--ink-faint`         | Body text, secondary text, metadata       |
| `--line`, `--line-strong`                    | Hairlines and input borders               |
| `--accent`, `--accent-hover`, `--accent-ink` | Every interactive thing                   |
| `--r-xs` … `--r-lg`, `--r-full`              | The radius scale                          |
| `--w-page`, `--w-reading`, `--gutter`        | Layout widths                             |
| `--ease`, `--speed`                          | The one motion curve and duration         |
| `--topic-*` / `--topic-*-ink`                | One chip colour per topic                 |

The topic tokens are a walk around the accent — teal through blue to violet, one step per topic —
so a chip reads as a relative of the accent rather than a colour of its own. Keep a replacement set
inside a narrow band for the same reason, and check the `-ink` value against its own background.
Callout tones are mixed from the tokens in the Content blocks section and need nothing set here.

Changing `--accent` in both blocks re-skins the theme. The dark value should be considerably lighter than the light one — it sits on a dark ground and has to clear contrast on its own.

## Typography and fonts

One typeface, [Figtree](https://github.com/erikdkennedy/figtree), self-hosted as a variable font in `public/fonts/figtree` under the SIL Open Font License.

To swap it:

1. Drop your `.woff2` files into `public/fonts/`.
2. Update the `@font-face` blocks and `--font-sans` at the top of `global.css`.
3. Update the `<link rel="preload">` in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) to point at the new file.

Type sizes are classes, not utilities: `.t-display`, `.t-h1` through `.t-h4`, `.t-lead`, `.t-body`, `.t-small`, `.t-meta`. Changing one changes it everywhere.

## Pages and routes

| Route                                      | File                                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `/`                                        | [src/pages/index.astro](./src/pages/index.astro)                                           |
| `/issues/<slug>/`                          | [src/pages/issues/[slug].astro](./src/pages/issues/[slug].astro)                           |
| `/archive/`                                | [src/pages/archive/[...page].astro](./src/pages/archive/[...page].astro)                   |
| `/topics/`                                 | [src/pages/topics/index.astro](./src/pages/topics/index.astro)                             |
| `/topics/<topic>/`                         | [src/pages/topics/[topic]/[...page].astro](./src/pages/topics/[topic]/[...page].astro)     |
| `/writers/`                                | [src/pages/writers/index.astro](./src/pages/writers/index.astro)                           |
| `/writers/<writer>/`                       | [src/pages/writers/[writer]/[...page].astro](./src/pages/writers/[writer]/[...page].astro) |
| `/about/`, `/privacy/`, `/search/`, `/404` | Single files in `src/pages`                                                                |
| `/styleguide/`                             | [src/pages/styleguide.astro](./src/pages/styleguide.astro)                                 |

Page size for the paginated routes is the `pageSize` in each file's `getStaticPaths`. The archive
ships at 10 issues a page, topics and writers at 12.

`/styleguide/` is `noindex` and kept out of the navigation of a real publication: it exists so you
can see every block in the reading column before you write with it. Delete the file and its
`primaryNavigation` entry once you no longer need it.

To remove a page, delete its file and its entries in `primaryNavigation` and `footerNavigation`.

## Search

There is no service and no key. [src/pages/search-index.json.ts](./src/pages/search-index.json.ts) writes a static JSON file at build time, and [src/components/SearchRuntime.astro](./src/components/SearchRuntime.astro) fetches it on the first query.

Both entry points — the header dialog and `/search/` — use the same `search()` function, so a result cannot place differently depending on where it was searched from. Every term has to appear somewhere in the record; it narrows rather than guesses.

To index another field, add it in [src/lib/search.ts](./src/lib/search.ts) and include it in the haystack in `SearchRuntime.astro`.

## Feeds

One feed, at `/rss.xml`, built from [src/lib/feeds.ts](./src/lib/feeds.ts) and advertised in the head of every page. `siteConfig.rss.fullContent` decides whether the whole issue or just its excerpt ships; `limit` caps the item count.

There are deliberately no per-topic or per-writer feeds. A newsletter is one thing arriving on one schedule, and a reader who wants it subscribes — splitting the feed by section is a magazine habit that leaves most of the endpoints unread.

Full-content feeds render the issue through Astro's container, which is what lets an MDX issue reach a reader as real markup rather than as component syntax. An issue that cannot be rendered falls back to its excerpt with a warning in the build log rather than failing the build.

## SEO and structured data

[src/lib/schema.ts](./src/lib/schema.ts) builds three graphs:

- `WebSite` on every page, with a search action the site actually answers.
- `BlogPosting` on an issue, carrying its `issueNumber`, writer, topic, word count, and read time.
- `BreadcrumbList` on an issue, matching the trail the page renders.

Canonicals, Open Graph, Twitter cards, `prev`/`next`, and feed autodiscovery are all in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro). `publisherLogo` in the site config must point at a raster file in `public/` — a favicon cannot stand in for it.

## Code blocks

Shiki, configured in [src/config/code.ts](./src/config/code.ts) with `github-light` and `github-dark`. `defaultColor` is `false`, which means Shiki emits a variable per theme and the stylesheet picks one — that is how a code block follows the colour-mode toggle without a second render.

The block takes the page's own `--surface` background so it sits in the design rather than importing the theme's. To use Shiki's own background instead, swap `var(--surface)` for `var(--shiki-light-bg)` in the `.prose .astro-code` rule.

## Icons

- [src/components/ui/Icon.astro](./src/components/ui/Icon.astro) — stroked UI icons drawn inline on a 24×24 grid. Add a case to the union and a `<path>` to extend it.
- [src/components/LocalIcon.astro](./src/components/LocalIcon.astro) — brand and social marks from [Bootstrap Icons](https://icons.getbootstrap.com/) (MIT), imported as raw SVG from `src/icons/bootstrap`.

To add a social network: drop its SVG into `src/icons/bootstrap`, import it in `LocalIcon.astro`, map the label in [src/lib/socials.ts](./src/lib/socials.ts), and add it to `socials` in the site config. A label with no mapping falls back to a generic link glyph.

## Deployment

The output is static — `npm run build` writes `dist/`, which any static host will serve.

A [wrangler.jsonc](./wrangler.jsonc) is included for Cloudflare Workers static assets. For Netlify, Vercel, GitHub Pages, or anything else, point the host at `npm run build` and `dist/`.

Set `siteConfig.siteUrl` to the production origin before building. Canonicals, feeds, the sitemap, and share-card URLs are all absolute and all derived from it.

## Release checklist

```bash
npm run check   # types and Astro diagnostics
npm run build   # a real build
npm run format  # Prettier
```

`npm run release:check` runs all three.
