# Customization Guide

Use this guide when adapting Compass for a real docs site.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It holds the site name, default metadata, canonical domain, language and date locale, the social image, the repository links, the header button, the footer text, and the social links.

Set `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, RSS, `robots.txt`, `llms.txt`, the sitemap, and JSON-LD all derive from it.

| Key           | What it controls                                                                    |
| ------------- | ----------------------------------------------------------------------------------- |
| `name`        | The wordmark in the header and footer, page title suffixes, and the feed title      |
| `title`       | The homepage `<title>` and the default social title                                 |
| `description` | The default meta description and the summary at the top of `llms.txt`               |
| `language`    | The `lang` attribute and the RSS language                                           |
| `dateLocale`  | How "Updated" dates are written, for example `en-US` or `en-GB`                     |
| `socialImage` | The Open Graph and Twitter/X image, a path in `public/`                             |
| `editBaseUrl` | The start of every "Edit this page" link; leave it empty to hide them               |
| `action`      | The button at the end of the header and in the mobile menu                          |
| `footerText`  | The line under the logo in the footer                                               |
| `socials`     | The icon links in the footer; `GitHub` and `RSS` get their own icons, others a link |

`footerLinks` in the same file are the links in the footer's Resources column.

The logo mark is [src/components/ui/Logomark.astro](./src/components/ui/Logomark.astro), an inline SVG used in the header and footer. Replace its contents with your own mark, or swap the component for an `<img>`. The favicons are [public/favicon-light.svg](./public/favicon-light.svg) and [public/favicon-dark.svg](./public/favicon-dark.svg); the browser tab switches between them with the theme.

## Docs Structure

Compass has three levels: parent sections, categories, and articles. Parents and categories are declared in [src/config/docs.ts](./src/config/docs.ts):

```ts
export const docsParentCategories = [
  { slug: 'getting-started', name: 'Getting Started', description: '...' },
  { slug: 'integrations', name: 'Integrations', description: '...' },
] as const;

export const docsCategories = [
  { name: 'Start Here', slug: 'start-here', parent: 'getting-started', description: '...', icon: 'rocket' },
  // ...
] as const;
```

- Parents become the links in the header, a homepage section each, and a landing page at `/<parent>`.
- Categories become homepage cards, sidebar groups, mobile menu entries, and a page at `/<parent>/<category>`.
- `icon` is a file name from [src/icons/lucide](./src/icons/lucide).
- Order in the arrays is the order on the site.

Articles live at `/<parent>/<category>/<article>`. One-segment category URLs such as `/start-here` are not generated.

The content folders mirror the category slugs: an article in the `start-here` category lives in `src/content/docs/start-here/<article>/`. To rename a category, change its `slug`, rename its folder, update the `category` in its articles, and add `redirectFrom` entries for any URLs that were already public. `npm run check` fails if an article names a category that does not exist.

## Writing Articles

Each article is a folder in [src/content/docs](./src/content/docs) holding an `.mdx` file with the same name as the folder, plus any images it uses:

```text
src/content/docs/start-here/set-up-compass/
|-- set-up-compass.mdx
`-- screenshot.png
```

The folder name is the URL slug. Frontmatter is validated by [src/content.config.ts](./src/content.config.ts):

```yaml
---
title: 'Set Up Compass'
description: 'Start customizing the theme and content structure.'
category: 'start-here'
order: 1
updatedAt: 2026-10-08
tags: ['setup']
status: 'published'
author: 'Docs Team'
heroImage: './hero.png'
editUrl: 'https://github.com/your-org/your-repo/edit/main/...'
hideFromSearch: false
redirectFrom:
  - '/old-setup-guide'
relatedLinks:
  - title: 'Add Your Brand'
    href: '/getting-started/start-here/add-your-brand'
    description: 'Replace the starter identity.'
    eyebrow: 'Next step'
---
```

| Field            | Notes                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| `title`          | Required. The page heading, the `<title>`, and the search result title            |
| `description`    | The lede under the heading, the meta description, and the search fallback excerpt |
| `category`       | Required. A category slug from `src/config/docs.ts`                               |
| `order`          | Position within the category; lower comes first. Defaults to `100`                |
| `updatedAt`      | Shown in the article header, feeds the recently updated list and RSS              |
| `status`         | `draft`, `published`, `deprecated`, or `archived`; see below                      |
| `tags`, `author` | Indexed as Pagefind filters and metadata                                          |
| `heroImage`      | An image shown under the article header, processed by Astro's image pipeline      |
| `editUrl`        | Overrides the generated "Edit this page" link                                     |
| `hideFromSearch` | Keeps the article out of Pagefind, popular articles, RSS, and `llms.txt`          |
| `redirectFrom`   | Old paths that redirect to this article                                           |
| `relatedLinks`   | Cards under the article, under a "Continue with" heading                          |

`draft` and `archived` articles are not built at all: no route, no navigation entry, no search entry, no redirect, no feed item. `deprecated` articles stay public and show a Deprecated badge in their header.

Reading time is calculated from the article body. Previous and next links follow `order` within the category.

### Images

Keep article images beside the `.mdx` file so Astro can optimize them:

```mdx
![Diagram of the publishing flow](./diagram.png)
```

Every article image opens in a lightbox on click. Its alt text becomes the caption. Use `public/` only for files that need a fixed URL, such as favicons and the social image.

## MDX Components

These components are available in every article without an import:

| Component                    | Use it for                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `Callout`                    | Notes and warnings, with `tone` `info`, `success`, `warning`, or `danger` and an optional `title` |
| `Badge`                      | Inline status labels, with the same tones plus `neutral`                                          |
| `ButtonLink`                 | A call to action, `variant` `primary` or `secondary`                                              |
| `Card`, `CardGrid`           | Linked cards in a two-column grid                                                                 |
| `Steps`, `Step`              | Numbered procedures                                                                               |
| `Tabs`                       | Alternative content in named panels                                                               |
| `CodeTabs`                   | Alternative code samples, such as npm, pnpm, and yarn                                             |
| `FileTree`                   | A folder structure from an indented list of paths                                                 |
| `Table`                      | A data table from `headers` and `rows`                                                            |
| `Accordion`                  | Collapsible questions and answers                                                                 |
| `Checklist`, `ChecklistItem` | Interactive checklists                                                                            |
| `QuoteBlock`                 | A pull quote with an optional `author`                                                            |

Each one is documented with examples in the Components section of the bundled docs. The components live in [src/components/docs](./src/components/docs). To add your own, create an `.astro` component there and register it in [src/components/docs/mdx-components.ts](./src/components/docs/mdx-components.ts).

Plain Markdown is styled too: headings, lists, links, inline code, blockquotes, tables, and images all follow the article styles in [src/styles/global.css](./src/styles/global.css). Add `not-prose` to an element to opt it out.

## Homepage

The homepage is assembled in [src/pages/index.astro](./src/pages/index.astro) from sections in [src/components/home](./src/components/home), with copy in [src/config/home.ts](./src/config/home.ts):

| Section          | Component                                     | Config key                |
| ---------------- | --------------------------------------------- | ------------------------- |
| Hero and search  | `HomeHero.astro`                              | `hero`                    |
| Popular chips    | `HomeHero.astro`                              | `popular`                 |
| Category cards   | `CategorySection.astro`, `CategoryCard.astro` | from `src/config/docs.ts` |
| Recently updated | `RecentUpdates.astro`                         | `recent`                  |
| Support band     | `SupportBand.astro`                           | `support`                 |

`popular.categories` picks which categories the popular chips and the search palette's suggestions come from, in order of `order`. `recent.limit` sets how many updated articles to list; articles without an `updatedAt` are left out. Remove an entry from `support.actions` to drop its button, or remove `<SupportBand />` from the page to drop the band.

## Search

Search is [Pagefind](https://pagefind.app/), which indexes the built HTML after `astro build`. There is no search service and no index in the page; the browser loads small index chunks on demand.

- The search palette opens with `Ctrl/⌘ + K`, `/`, or the search button in the header. It lives in [src/components/chrome/SearchDialog.astro](./src/components/chrome/SearchDialog.astro).
- The homepage has its own search field with a dropdown, in `HomeHero.astro`.
- Both share the client in [src/scripts/docs-search.ts](./src/scripts/docs-search.ts), which renders results, highlights matches, and handles the keyboard.

Only article bodies are indexed: the article template marks them with `data-pagefind-body`, and everything else is ignored. Each result carries its category. When Pagefind returns no excerpt, the article's `description` is used, delivered by [src/components/SearchPreviews.astro](./src/components/SearchPreviews.astro).

During `npm run dev`, the Pagefind bundle does not exist yet, so search shows a notice instead of results. Use `npm run build` and `npm run preview` to try it.

## Navigation

- **Header:** the logo, a link per parent section, the search button, the theme toggle, and the `action` button, in [src/components/chrome/SiteHeader.astro](./src/components/chrome/SiteHeader.astro). Below `64rem` the section links move into a menu that lists every category.
- **Sidebar:** every category in the current section with its articles, in [src/components/layout/DocsSidebar.astro](./src/components/layout/DocsSidebar.astro). It is shown from `64rem`.
- **On this page:** the article's second- and third-level headings, in [src/components/layout/TableOfContents.astro](./src/components/layout/TableOfContents.astro). It is a rail from `80rem` and a sticky disclosure bar below that.
- **Footer:** the parent sections and their categories, `footerLinks`, and `socials`, in [src/components/chrome/SiteFooter.astro](./src/components/chrome/SiteFooter.astro).

The docs pages share [src/layouts/DocsLayout.astro](./src/layouts/DocsLayout.astro), which places the sidebar, the content, and the rail. Every page shares [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro), which holds the metadata, the theme script, the header, the footer, and the search palette.

## Theme Tokens

Colors, shadows, and the header height are CSS custom properties at the top of [src/styles/global.css](./src/styles/global.css), defined once in `:root` and again for dark mode in `html.dark`:

```css
:root {
  --canvas: #ffffff;
  --sunken: #f6f6f9;
  --line: #ebebf0;
  --ink: #0e0e14;
  --body: #3d3d48;
  --muted: #6b6b78;
  --accent: #5546f0;
  --accent-strong: #4333d6;
  --accent-soft: #f0eeff;
  --accent-ink: #4232cf;
  /* ... */
}
```

To rebrand, change `--accent` and its three companions in both blocks: `--accent-strong` for hover states, `--accent-soft` for tinted backgrounds, and `--accent-ink` for accent text, which needs enough contrast against `--canvas`. The `--glow-a` and `--glow-b` colors tint the homepage hero.

The tokens are also Tailwind colors, so `bg-sunken`, `text-muted`, `border-line`, and `text-accent-ink` work in markup.

Callouts and badges derive their colors from `--accent`, `--success`, `--warning`, and `--danger`, so changing those four restyles every tone.

## Light and Dark Mode

Compass follows the reader's system setting until they press the theme toggle; their choice is then remembered in `localStorage` under `compass-theme`. The script in `BaseLayout.astro` applies the mode before the first paint, so there is no flash.

Dark mode is the `dark` class on `<html>`. Use the `dark:` variant in markup, or `.dark` in CSS.

## Fonts

Plus Jakarta Sans and JetBrains Mono are self-hosted in [public/fonts](./public/fonts) and declared at the top of `global.css`. To change them, replace the files, update the `@font-face` rules, set `--font-sans` and `--font-mono` in the `@theme` block, and update the preloaded file in `BaseLayout.astro`.

## Icons

Interface and category icons are SVG files in [src/icons/lucide](./src/icons/lucide) (Lucide) and [src/icons/bootstrap](./src/icons/bootstrap) (brand marks), rendered by [src/components/ui/Icon.astro](./src/components/ui/Icon.astro):

```astro
<Icon name="rocket" class="size-5" />
<Icon name="social-github" class="size-4" />
```

To add an icon, save its SVG from [lucide.dev](https://lucide.dev/) into `src/icons/lucide` and use its file name. Unknown names fall back to the `link` icon.

## Code Blocks

Code is highlighted at build time by Shiki with the `github-light` and `github-dark-default` themes, set in [astro.config.mjs](./astro.config.mjs). The language label and copy button are added by [src/scripts/article-enhancements.ts](./src/scripts/article-enhancements.ts); edit `codeLanguageLabels` there to rename a language or show a label for a new one. Markdown, MDX, and plain text blocks have no label.

## SEO and Feeds

- Every page has a canonical URL, Open Graph and Twitter/X tags, and JSON-LD: `WebSite` on most pages, and `TechArticle` and `BreadcrumbList` on articles.
- `/rss.xml` lists articles with an `updatedAt`, newest first.
- `/sitemap-index.xml` is generated by `@astrojs/sitemap`, and `/robots.txt` points to it.
- `/llms.txt` lists every public article with its description, grouped by section, for AI tools.
- The social image is [public/og-image.png](./public/og-image.png), 1200x630.

## Deployment

`npm run build` writes the static site and the Pagefind index to `dist/`. [wrangler.jsonc](./wrangler.jsonc) deploys it to Cloudflare Workers with `npx wrangler deploy`; any other static host works with `dist/` as the output directory and `npm run build` as the build command.

Redirects declared with `redirectFrom` are static pages that forward with a meta refresh, so they work on any host.
