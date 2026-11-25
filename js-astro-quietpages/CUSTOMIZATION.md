# Customization Guide

Use this guide when adapting Quiet Pages for a real publication.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It holds the magazine's name, the default metadata, the canonical domain, the language and date locale, the social image, the contact email, the form endpoints, and the social links.

Set `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, the RSS feed, `robots.txt`, the sitemap, and JSON-LD all derive from it.

| Key              | What it controls                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `name`           | The wordmark in the header and footer, the `<title>` suffix on every page, the feed title  |
| `title`          | The homepage `<title>` and its social title                                                |
| `description`    | The default meta description, the feed description, and the line under the footer wordmark |
| `siteUrl`        | The production domain, without a trailing slash                                            |
| `language`       | The `lang` attribute, the feed language, and the language in structured data               |
| `locale`         | The Open Graph locale, for example `en_US`                                                 |
| `dateLocale`     | How dates are written, for example `en-US` or `en-GB`                                      |
| `socialImage`    | The Open Graph and Twitter/X image for pages without their own, a path in `public/`        |
| `wordsPerMinute` | The reading speed used to estimate read time when a post has no `readingTime`              |
| `email`          | The address on the Contact page and behind the mail icon in the footer                     |
| `forms`          | The newsletter and contact form endpoints; see [Forms](#forms)                             |
| `socials`        | The icon links in the footer and the chips on the Contact page                             |

Each social link takes a `label`, an `href`, and an `icon`, which is a file name from [src/icons/bootstrap](./src/icons/bootstrap) such as `twitter-x`, `bluesky`, `github`, `mastodon`, `instagram`, or `threads`.

`navigation` in the same file is the header and mobile menu. A link is marked as the current page when the path starts with its `href`, so Writing stays highlighted while reading a post. `footerLinks` is the footer's "The magazine" column; the footer's Sections column comes from [src/config/taxonomy.ts](./src/config/taxonomy.ts).

The header and footer show `name` as a serif wordmark. The favicon is [public/favicon.svg](./public/favicon.svg), which has the accent color written into it. The footer's copyright line and type credit are in [src/components/chrome/SiteFooter.astro](./src/components/chrome/SiteFooter.astro).

The About and Contact pages are written directly in [src/pages/about.astro](./src/pages/about.astro), including its `principles`, and [src/pages/contact.astro](./src/pages/contact.astro). Rewrite both.

## Authors

Contributors live in [src/config/authors.ts](./src/config/authors.ts):

```ts
import elenaMarch from "@/assets/authors/elena-march.jpg";

export const authors = [
  {
    slug: "elena-march",
    name: "Elena March",
    role: "Editor",
    bio: "Writer and editor covering design, craft, and slow technology.",
    longBio: "Elena March writes about the quiet edges of design and technology. ...",
    avatar: elenaMarch,
    photoCredit: { name: "Photographer / Pexels", url: "https://www.pexels.com/photo/..." },
  },
] as const satisfies readonly Author[];
```

| Field         | Notes                                                                             |
| ------------- | --------------------------------------------------------------------------------- |
| `slug`        | What a post's `author` refers to, and the URL: `/authors/<slug>/`                 |
| `name`        | Shown in bylines, cards, and the author page                                      |
| `role`        | Shown under the name in the article byline, the author note, and the author pages |
| `bio`         | One line, on the Contributors page and in the author page's meta description      |
| `longBio`     | The standfirst on the author page and the author note at the end of every article |
| `avatar`      | An imported image; see below                                                      |
| `photoCredit` | Optional. A record of where the portrait came from; it is not shown on the site   |

Portraits are images in [src/assets/authors](./src/assets/authors), imported at the top of `authors.ts` so Astro can optimize them. Use square photos of at least 256x256 pixels; they are cropped to circles and rendered from 24px to 128px, at 1x and 2x. The author page uses a crop of the portrait as its social image.

A post's `author` is validated against the slugs in this file, so a typo or a removed author fails the build instead of publishing a post without a byline. Every author gets a page, even before they have published, and the array order is the order on the Contributors and About pages.

## Sections and Tags

Sections and tags live in [src/config/taxonomy.ts](./src/config/taxonomy.ts), and the config is authoritative: it, not the content, decides what exists. In the code sections are called `categories`, and their pages live at `/categories/<slug>/`.

```ts
export const categories = [
  {
    slug: "essays",
    name: "Essays",
    description: "Long-form arguments about writing, reading, and making things for the web.",
  },
  // ...
] as const satisfies readonly Category[];

export const tags = [
  { slug: "writing", name: "Writing" },
  // ...
] as const satisfies readonly Term[];
```

- A post's `category` and `tags` are validated against these slugs with `z.enum`, so a typo fails the build. Add a section or tag to the config before using it in a post.
- Section and tag pages are only generated for terms with at least one published post, and the archive menus, the homepage filter and section tiles, and the Sections page skip empty terms too.
- The footer lists every configured section, so remove a section from the config rather than leaving it empty.
- Order in `categories` is the order everywhere sections are listed. Tags keep their order in the archive menu; the Tags page sorts them by post count.
- A section's `description` is the lead on its page, its line on the Sections page, and part of its meta description.

To rename a slug, change it in the config and in every post that uses it; `npm run check` lists any post you missed.

## Writing Posts

Each post is a folder in [src/content/blog](./src/content/blog) holding an `index.mdx` (or `index.md`) and the images it uses:

```text
src/content/blog/building-tools-that-disappear/
|-- index.mdx
`-- cover.jpg
```

The folder name is the URL: `src/content/blog/building-tools-that-disappear/` becomes `/blog/building-tools-that-disappear/`. Frontmatter is validated by [src/content.config.ts](./src/content.config.ts):

```yaml
---
title: "Building tools that disappear"
excerpt: "The best software for thinking gets out of the way."
date: 2026-04-30
updated: 2026-05-02
category: "engineering"
tags: ["tools", "minimalism", "web"]
author: "samuel-okafor"
thumbnail: ./cover.jpg
thumbnailAlt: "A quiet desk setup with code, a plant, and a cup within reach."
imageCredit:
  caption: "A desk in the morning."
  author: "Photographer Name"
  authorUrl: "https://unsplash.com/@photographer"
  source: "Unsplash"
  sourceUrl: "https://unsplash.com/photos/..."
featured: false
draft: false
---
```

| Field            | Notes                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `title`          | Required. The headline, the `<title>`, and the card and search title                          |
| `excerpt`        | Required. The standfirst, the card text, the meta description, the feed item, and searched    |
| `date`           | Required. The publication date; posts are listed newest first                                 |
| `updated`        | Shown as "Updated" in the byline and used as `dateModified` in the JSON-LD                    |
| `category`       | Required. A section slug from `src/config/taxonomy.ts`                                        |
| `tags`           | Tag slugs from `src/config/taxonomy.ts`. Defaults to none                                     |
| `author`         | Required. An author slug from `src/config/authors.ts`                                         |
| `thumbnail`      | Required. A local image beside the post: the card image, the lead image, and the social card  |
| `thumbnailAlt`   | Required. Alt text for the lead image on the article page                                     |
| `imageCredit`    | A caption and photo credit under the lead image. `source` defaults to `Unsplash`              |
| `readingTime`    | Minutes. Left out, it is estimated from the body, ignoring code blocks and HTML tags          |
| `featured`       | Makes the post a candidate for the homepage lead essay                                        |
| `draft`          | `true` keeps the post out of every page, listing, the feed, the search index, and the sitemap |
| `seoTitle`       | Overrides the `<title>` without changing the headline                                         |
| `seoDescription` | Overrides the meta description without changing the standfirst                                |
| `canonical`      | An absolute URL, for a piece first published elsewhere                                        |

Start the body's headings at `##`; the title is the page's only `h1`.

## Homepage

The homepage is assembled in [src/pages/index.astro](./src/pages/index.astro) from sections in [src/components/home](./src/components/home), with copy in [src/config/home.ts](./src/config/home.ts):

| Section           | Component                     | Config key                   |
| ----------------- | ----------------------------- | ---------------------------- |
| Hero              | `Hero.astro`                  | `homeConfig.hero`            |
| Lead essay        | `LeadStory.astro`             | the `featured` flag in posts |
| Latest writing    | `LatestPosts.astro`           | `homeConfig.latest`          |
| Browse by section | `SectionTiles.astro`          | `homeConfig.sections`        |
| Subscribe panel   | `chrome/SubscribePanel.astro` | `subscribeConfig`            |

**The hero.** In `hero.title`, words wrapped in `*asterisks*` are set in italic: `"An independent magazine on *writing*, *design*, and the *slow web*."` The `primary` button links to the lead essay, and `secondary` takes a label and a link. To change the photograph behind it, see [The Hero Image](#the-hero-image).

**The lead essay** is the newest post with `featured: true`, or the newest post if none is flagged. Flag more than one and the newest flagged post wins; the others appear in the grid.

**Latest writing** lists every post except the lead. `latest.count` sets how many cards show at once, for "All" and for each section filter. The filter has a button for every section with a post in the grid; it works in place, keeps no URL state, and is hidden without JavaScript, when the first `count` posts show.

**Browse by section** is a row of tiles, one per section with a post, each showing the cover of that section's newest post with the section name and post count over it. Below `64rem` the row scrolls sideways. The Sections page lists the same sections with their descriptions, using `SectionIndex.astro`.

**The subscribe panel** sits above the footer on every page except Contact and the 404, and the header's Subscribe button jumps to it. Its copy is `subscribeConfig` in `home.ts`. Pass `subscribe={false}` to `BaseLayout` to hide it on another page.

Remove a component from `index.astro` to drop its section.

## The Hero Image

The homepage hero is a full-bleed photograph of misty hills, [src/assets/hero-mist.jpg](./src/assets/hero-mist.jpg), imported at the top of [src/components/home/Hero.astro](./src/components/home/Hero.astro). The headline sits in the mist at the top of the photo in the normal ink color, and the hills fill the bottom of the screen. To replace it, put your image in `src/assets` and change the import:

```astro
import heroImage from "@/assets/your-photo.jpg";
```

- Pick a landscape photo at least 2500 pixels wide with a pale, quiet upper half, such as sky, fog, or water, so dark type stays readable. It is anchored to the bottom (`object-bottom`) and cropped to fill the screen.
- It is the page's largest image, so it loads with `loading="eager"` and `fetchpriority="high"` and is served from 640 to 2600 pixels wide. Keep those attributes on whatever replaces it.
- The photo is decorative, with empty alt text, since the headline carries the meaning.
- The `.hero-shade` gradient in the component's style block fades the top of the photo into `--canvas`, which keeps the text readable on narrow screens where the hills climb higher. In dark mode the photo is dimmed and the shade fades from the dark canvas instead. A busier photo needs a longer fade; adjust the gradient stops rather than the text colors.

The header sits transparent at the top of every page and turns solid once the page scrolls. It hides while the reader scrolls down and returns when they scroll up or tab into it. To use a photo hero on another page, pull the section up behind the header with `-mt-(--header-h)` and `pt-(--header-h)`, as `Hero.astro` does.

## Search

The search palette is [src/components/chrome/SearchDialog.astro](./src/components/chrome/SearchDialog.astro), included on every page by `BaseLayout.astro`. It opens with the search button in the header, `Ctrl/⌘ + K`, or `/` when the cursor is not in a text field. Any element with a `data-search-open` attribute opens it too, like the "Search the archive" button on the 404 page. Without JavaScript the header button is a plain link to the archive.

- The index is `/search-index.json`, built from [src/pages/search-index.json.ts](./src/pages/search-index.json.ts). It holds each published post's title, excerpt, section, tags, author, and date, not the full text, so it stays small. It is fetched the first time the palette opens, or as soon as a reader hovers or focuses a search button.
- Before the first keystroke the palette lists the five most recent posts.
- Every word in the query must match somewhere. A word in the title scores 8, in the section or tags 4, in the author's name 2, and in the excerpt 1; the whole query in the title adds 4. Ties go to the newer post, and the top eight are shown. Matching ignores case and accents.
- The last row, "Search the archive for …", opens the archive with the query filled in.
- Arrow keys move through the results, `Enter` opens one, and `Escape` or a click on the backdrop closes the palette and returns focus to whatever opened it.

`MAX_RESULTS` and `RECENT_COUNT` at the top of the palette's script set the number of results and recent posts. To index another field, add it to `SearchEntry` in `search-index.json.ts` and to the `search` function in the palette.

## The Archive

[src/pages/blog/index.astro](./src/pages/blog/index.astro) renders every published post as a grid of cards, newest first, then filters it in the browser. Three controls combine in the toolbar above the grid: a search field, a **Section** menu, and a **Tag** menu.

- The search field filters as you type, matching titles, excerpts, sections, tags, and author names. Every word must appear. The text it matches is the card's `data-search` attribute, built in [src/components/blog/PostCard.astro](./src/components/blog/PostCard.astro).
- Each menu is a native `<details>` element. One opens at a time, and it closes on a selection, a click outside, or `Escape`, which returns focus to the pill.
- Each option shows how many posts it would return given the other active filters and the query. Options that would return nothing are dimmed, and options with no published post behind them are left out at build time.
- Every option is a real link to its section or tag page, so without JavaScript the menus still work as navigation and the whole list is shown.
- Selecting the active option again clears it, and **Clear filters** appears while a section or tag is selected.
- The state lives in the URL as `?q=&cat=&tag=&page=`, so a filtered view can be shared and the Back button walks through it. An unknown section or tag in the URL is ignored. The search palette's archive row and the site's `SearchAction` structured data both link here with `?q=`.

`pageSize` at the top of the page script sets how many posts show at a time and how many **Show more** adds; it is `9`, three full rows on desktop.

To add another filter, such as author:

1. Add a `data-` attribute with the value to both card variants in `PostCard.astro`, next to `data-category` and `data-tags`.
2. Add a `<details data-filter-menu>` menu whose options carry `data-filter="author"` and `data-value="<slug>"`, with a `data-filter-label="author"` element in its pill, following the two already there.
3. Add the key to the `State` and `FilterKey` types and to `emptyLabels`.
4. Add the comparison to `matches`, which decides what every count, the empty state, and the pagination see.
5. Add the parameter to `stateFromUrl` and `writeUrl`, and clear it in the **Clear filters** handler.

## Article Pages

[src/pages/blog/[slug].astro](./src/pages/blog/[slug].astro) assembles the reading page from the frontmatter:

- **The header** has breadcrumbs, the title, the excerpt as a standfirst, the author's portrait, name, and role, the date, the updated date, and the reading time.
- **The lead image** is the `thumbnail` at 16:9, wider than the text, with the `imageCredit` caption under it.
- **The reading column** is set in Newsreader, about 42rem wide.
- **On this page** lists the body's `##` and `###` headings in a rail from `80rem`, and highlights the one being read. It appears when a post has at least two headings. Change the filter in [src/components/blog/TableOfContents.astro](./src/components/blog/TableOfContents.astro) to include `####`.
- **Tags** link to their tag pages.
- **The share sheet**, [src/components/blog/ShareSheet.astro](./src/components/blog/ShareSheet.astro), is a native `<dialog>` opened by the Share buttons in the byline and at the end of the article, or by any element with `data-share-open`. It lists seven services, with Bluesky, Mastodon, Reddit, and Pinterest behind **More**, and a copy-link field. Every target is a plain link built from the canonical URL, so no third-party script is loaded. Add or reorder entries in `targets` and `extraTargets`. The Share buttons are hidden without JavaScript.
- **The author note** shows the author's `longBio` and links to their page.
- **Previous and next** follow publication order across the whole magazine: Previous is the older post, Next the newer one.
- **Keep reading** shows three related posts, scored in `getRelatedPosts` in [src/lib/posts.ts](./src/lib/posts.ts): two points for sharing the section, one for each shared tag, newest first on a tie.
- **The progress bar** is the accent hairline at the top of the viewport.

There are no comments. To add them, place your provider's embed in `[slug].astro`, for example after the author note; most providers key a thread by the page URL or `post.slug`. Load its script only on article pages, and mention it in your privacy notice.

## Prose and Code

The article body is styled by the `prose-article` utility in [src/styles/global.css](./src/styles/global.css): paragraphs, `##` and `###` headings, lists, links, blockquotes set as large italic pull quotes, images, captions, horizontal rules set as three dots, inline code, code blocks, and callouts. It works on any element; the About page uses it for its body copy.

A callout is a tinted aside, written as HTML in the MDX:

```mdx
<div class="callout">A short aside, set apart from the text around it.</div>
```

Code blocks are highlighted at build time by Shiki with the `github-light` and `github-dark-default` themes, set in `markdown.shikiConfig` in [astro.config.mjs](./astro.config.mjs). The block background follows the theme's `--surface` token in both modes. Every code block in an article gets a copy button, added by the script at the end of `[slug].astro`; it appears on hover or keyboard focus.

## Images

Every image a post uses lives in the post's own folder, next to its `index.mdx`, and goes through Astro's image pipeline. `thumbnail` is an `image()` in the schema, so it must be a local file; a remote URL fails validation.

**Pictures in the body.** Drop the file into the post folder and write ordinary Markdown:

```md
![A spool of waxed linen thread beside a steel ruler.](./binding-thread.jpg)
```

It is optimized at build time, set to the reading column's width, and opens in the lightbox when clicked. The alt text doubles as the lightbox caption.

**Pictures with a caption.** Use `Figure`, which every MDX post can use without importing the component. Import the image itself at the top of the post, below the frontmatter:

```mdx
import printedPage from "./printed-page.jpg";

<Figure
  src={printedPage}
  alt="Close-set lines of printed text on the page of an open book."
  caption="A narrow measure, set close and read slowly."
  credit="Photo by Brett Jordan on Unsplash"
  creditUrl="https://unsplash.com/photos/LtDiekEGH0Y"
  width="wide"
/>
```

`alt` is required; `caption`, `credit`, and `creditUrl` are optional; `width="wide"` lets the picture break out of the reading column on large screens. The lightbox opens a full-size rendition, up to 2400 pixels wide.

**The lightbox** is [src/components/blog/Lightbox.astro](./src/components/blog/Lightbox.astro), a native `<dialog>` included on every article page. Every body image in a post joins one set, in reading order: the arrows (hidden on phones, where you swipe instead), the `←` and `→` keys, and a swipe step through it, and a counter shows the position. It closes with the close button, `Escape`, or a click outside the picture, and focus returns to the image that opened it. The cover image is not part of the set.

**Covers.**

- Use covers at least 1600 pixels wide. The article shows them at 16:9 and cards at 3:2, cropped from the center.
- Each place requests its own sizes, from 320 to 1600 pixels wide. The article's lead image loads eagerly with high priority; card images load lazily.
- Cards show the cover with empty alt text, since the headline beside it carries the meaning. `thumbnailAlt` is used on the article page.
- Every post's social card is a 1200x630 crop of its cover, generated at build time in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro). Author pages use the portrait. Every other page uses `siteConfig.socialImage`, `/og-image.png`, a 1200x630 image in `public/`.

## Icons

Interface icons are SVG files in [src/icons/lucide](./src/icons/lucide) (Lucide) and brand marks in [src/icons/bootstrap](./src/icons/bootstrap) (Bootstrap Icons), rendered by [src/components/ui/Icon.astro](./src/components/ui/Icon.astro):

```astro
<Icon name="arrow-right" class="size-4" />
<Icon name="social-github" class="size-4" />
```

To add an icon, save its SVG from [lucide.dev](https://lucide.dev/) into `src/icons/lucide` and use its file name, or save a brand mark from [icons.getbootstrap.com](https://icons.getbootstrap.com/) into `src/icons/bootstrap` and use it as `social-<file name>`. A name with no matching file throws an error and stops the build, so a missing icon never ships as a blank square.

## Forms

The newsletter form in the subscribe panel and the form on the Contact page post to the endpoints in `siteConfig.forms`:

```ts
forms: {
  newsletter: "https://example.com/subscribe",
  contact: "https://example.com/contact",
},
```

While an endpoint is empty, the default, its form runs in demo mode: it validates, clears, and shows a confirmation, but sends nothing. The confirmation says so, and without JavaScript the form is hidden, so nobody submits into nothing.

Set an HTTPS endpoint from your newsletter provider or a form service and the form becomes a plain `POST` to it, with no JavaScript involved. The fields are named `email` in the newsletter form, and `name`, `email`, `topic`, and `message` in the contact form; rename them in [src/components/chrome/SubscribePanel.astro](./src/components/chrome/SubscribePanel.astro) and [src/pages/contact.astro](./src/pages/contact.astro) if your provider expects other names. The demo confirmations are the `data-success` attributes on the two forms, and demo mode is handled by [src/scripts/forms.ts](./src/scripts/forms.ts).

## Routes

Every URL ends with a trailing slash (`trailingSlash: "always"` in `astro.config.mjs`). Keep internal links in that form; in development a link without the slash returns a 404.

| Page         | Source                                                                 | URL                   |
| ------------ | ---------------------------------------------------------------------- | --------------------- |
| Home         | [src/pages/index.astro](./src/pages/index.astro)                       | `/`                   |
| Archive      | [src/pages/blog/index.astro](./src/pages/blog/index.astro)             | `/blog/`              |
| Article      | `src/pages/blog/[slug].astro`                                          | `/blog/<slug>/`       |
| Sections     | [src/pages/categories/index.astro](./src/pages/categories/index.astro) | `/categories/`        |
| Section      | `src/pages/categories/[slug].astro`                                    | `/categories/<slug>/` |
| Tags         | [src/pages/tags/index.astro](./src/pages/tags/index.astro)             | `/tags/`              |
| Tag          | `src/pages/tags/[slug].astro`                                          | `/tags/<slug>/`       |
| Contributors | [src/pages/authors/index.astro](./src/pages/authors/index.astro)       | `/authors/`           |
| Author       | `src/pages/authors/[slug].astro`                                       | `/authors/<slug>/`    |
| About        | [src/pages/about.astro](./src/pages/about.astro)                       | `/about/`             |
| Contact      | [src/pages/contact.astro](./src/pages/contact.astro)                   | `/contact/`           |
| Not found    | [src/pages/404.astro](./src/pages/404.astro)                           | `/404.html`           |
| Feed         | [src/pages/rss.xml.ts](./src/pages/rss.xml.ts)                         | `/rss.xml`            |
| Search index | [src/pages/search-index.json.ts](./src/pages/search-index.json.ts)     | `/search-index.json`  |
| Robots       | [src/pages/robots.txt.ts](./src/pages/robots.txt.ts)                   | `/robots.txt`         |
| Sitemap      | generated by `@astrojs/sitemap`                                        | `/sitemap-index.xml`  |

Section, tag, and author pages list every post they hold on one page. If a section outgrows that, add Astro's `paginate` to its route.

## Theme Tokens

Colors, shadows, the header height, the gutter, and the page width are CSS custom properties at the top of [src/styles/global.css](./src/styles/global.css), defined once in `:root` and again for dark mode in `:root.dark`:

```css
:root {
  --canvas: #fbfdfe;
  --surface: #ffffff;
  --sunken: #eff4f6;
  --line: #e0e8ec;
  --line-strong: #cad7de;
  --ink: #0b1f2c;
  --body: #2f4351;
  --muted: #5a6d79;
  --accent: #2a6380;
  --accent-soft: #e2eef3;
  --inverse: #0b1f2c;
  --on-inverse: #fbfdfe;
  /* ... */
}
```

The palette is drawn from the hero photograph: the mist is `--canvas`, the pine shadows are `--ink`, and the tree line is `--accent`. To rebrand, change `--accent` and `--accent-soft` in both blocks. The accent marks links, focus rings, the reading progress bar, and hover states. Primary buttons use `--inverse` and `--on-inverse`, not the accent. Update the color in [public/favicon.svg](./public/favicon.svg) to match, and the two `theme-color` tags in `BaseLayout.astro`, which follow `--canvas`.

The tokens are also Tailwind colors, so `bg-canvas`, `bg-surface`, `bg-sunken`, `border-line`, `text-ink`, `text-body`, `text-muted`, and `text-accent` work in markup. The type scale (`text-display`, `text-headline`, `text-section`, `text-title`, `text-lead`) and the radii (`rounded-card`, `rounded-panel`) are defined in the `@theme` block of the same file.

Shared pieces such as `.shell`, `.serif`, `.btn`, `.chip`, `.meta`, `.media`, `.field`, and the archive's filter styles are in the components layer of `global.css`.

## Fonts

Newsreader, Geist, and Geist Mono are self-hosted in [public/fonts](./public/fonts) and declared at the top of `global.css`:

- **Newsreader**, `--font-serif`, sets headlines and the reading column. It is bundled in roman and italic, each split into Latin and Latin Extended files that load only when a page needs them.
- **Geist**, `--font-sans`, sets the interface.
- **Geist Mono**, `--font-mono`, sets code and counts.

All three are variable fonts with `font-display: swap`. Newsreader's Latin roman and Geist are preloaded in `BaseLayout.astro`, since they carry everything above the fold.

To change them, replace the files, update the `@font-face` rules, set `--font-sans`, `--font-serif`, and `--font-mono` in the `@theme` block, update the preloaded files in `BaseLayout.astro`, and edit the "Set in" line in `SiteFooter.astro`.

## Light and Dark Mode

Quiet Pages follows the reader's system setting until they press the theme toggle; their choice is then remembered in `localStorage` under `quietpages-theme`. The script in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) applies the mode before the first paint, so there is no flash.

Dark mode is the `dark` class on `<html>`. Use the `dark:` variant in markup, or `.dark` in CSS. The toggle is hidden without JavaScript, when the system setting decides.

## Motion

Page headers rise in on load: add `rise` to an element to opt it in, and `style="--rise-order: 2"` to stagger it. Cards zoom their image slightly on hover, and the search palette fades in. All of it is CSS, and all of it stops when the reader prefers reduced motion.

## SEO and Structured Data

[src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) writes the document head from the props each page passes:

| Prop             | Purpose                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `title`          | The page title, suffixed with the site name                            |
| `description`    | The meta description and both social descriptions                      |
| `image`          | An imported image, cropped to a 1200x630 social card, or a public path |
| `imageAlt`       | Alt text for the social image                                          |
| `type`           | `website`, `article`, or `profile` for Open Graph                      |
| `canonical`      | Overrides the canonical URL                                            |
| `noindex`        | Adds `noindex, follow`; the 404 page uses it                           |
| `publishedTime`  | `article:published_time`                                               |
| `modifiedTime`   | `article:modified_time`                                                |
| `subscribe`      | `false` hides the subscribe panel                                      |
| `structuredData` | The page's JSON-LD; pages without it get the `WebSite` schema          |

- Every page has a canonical URL, Open Graph and Twitter/X tags, and JSON-LD. The schemas are built with the helpers in [src/lib/schema.ts](./src/lib/schema.ts): `WebSite` with a `SearchAction` on the homepage, `BlogPosting` on articles, `CollectionPage` on the archive and the section, tag, and contributor pages, `ProfilePage` on author pages, and `AboutPage` and `ContactPage`. Every page below the homepage adds a `BreadcrumbList` matching its visible breadcrumbs.
- `/rss.xml` lists every published post, newest first, with its excerpt, author, and section.
- `/sitemap-index.xml` is generated by `@astrojs/sitemap`, and `/robots.txt` points to it.

## Deployment

`npm run build` writes the static site to `dist/`. [vercel.json](./vercel.json) configures Vercel and [wrangler.jsonc](./wrangler.jsonc) deploys to Cloudflare Workers with `npx wrangler deploy`. Any other static host works with `dist/` as the output directory and `npm run build` as the build command. Delete the config files for hosts you do not use.

## Before Launch

- Set `siteConfig.siteUrl` to your domain, build, and confirm a page's canonical tag shows it.
- Replace the name, title, description, email, and social links in `src/config/site.ts`.
- Replace the demo contributors and their portraits in `src/config/authors.ts` and `src/assets/authors`.
- Trim `src/config/taxonomy.ts` to the sections and tags you publish under.
- Replace the eight demo posts in `src/content/blog`, with their covers and credits.
- Set the form endpoints in `siteConfig.forms` and send a test through each form.
- Rewrite the homepage copy in `src/config/home.ts`, and the About and Contact pages.
- Replace the homepage photograph, `public/favicon.svg`, and `public/og-image.png`.
