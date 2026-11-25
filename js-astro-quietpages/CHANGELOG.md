# Changelog

All notable changes to Quiet Pages are documented here.

## 3.0.1 - 2026-10-21

- The article byline shows the author on one row and the date, reading time, and Share button on a second row.
- Breadcrumbs stay on one line and shorten the current page title to fit.
- Article breadcrumbs leave out the post title on small screens.
- Updated Astro to 7.4.1 and other dependencies.
- Updated `AGENTS.md` for Astro 7.

## 3.0.0 - 2026-10-08

- Redesigned the theme with a palette taken from the hero photograph: a mist-white canvas, pine-navy ink, a deep teal accent (`#2a6380`), and refined light and dark modes.
- Replaced Inter, Fraunces, and JetBrains Mono with self-hosted Newsreader, Geist, and Geist Mono.
- Redesigned the homepage hero with a full-bleed photograph of misty hills and a serif headline set in the mist.
- The hero photograph is served up to 2600 pixels wide.
- The header turns solid once the page scrolls, hides while scrolling down, and returns when scrolling up.
- Added a serif wordmark and a new favicon.
- Redesigned the homepage with a lead essay, latest writing with a section filter, and section tiles with each section's latest cover.
- Added a `Ctrl/⌘ + K` search palette available from every page, with recent posts before the first keystroke.
- Added a subscribe panel above the footer.
- Added Sections, Tags, and Contributors index pages.
- Redesigned article pages with a byline, a wide lead image, a serif reading column, and an "On this page" rail.
- Added a share sheet with eleven services and a copy-link field, opened from the article byline and the end of each article.
- Added an author note, previous and next cards, and a "Keep reading" section to articles.
- Added an image lightbox to article pages, opened from plain Markdown images and the new `Figure` component.
- Added syntax highlighting with light and dark themes.
- Archive search now updates as you type and matches sections, tags, and authors.
- The archive is a grid of cards, newest first, with one toolbar for search and filters.
- Redesigned the archive, section, tag, author, About, Contact, and 404 pages.
- Redesigned the footer with section, magazine, and social links.
- Forms run in demo mode until an endpoint is set in `siteConfig.forms`.
- Replaced the initials avatars with author portraits.
- Post `category`, `tags`, and `author` are validated against the config, and `thumbnailAlt` is required.
- Added JSON-LD for the site, collection pages, author profiles, and breadcrumbs.
- Replaced the custom sitemap and feed with `@astrojs/sitemap` and `@astrojs/rss`.
- URLs now end with a trailing slash.
- The color mode is stored under `quietpages-theme`.
- Moved site settings to `src/config/site.ts`, authors to `authors.ts`, sections and tags to `taxonomy.ts`, and homepage copy to `home.ts`.
- Moved styles to `src/styles/global.css` with design tokens for color, type, and shadows.
- Replaced the inline icon map with local Lucide and Bootstrap Icons files.
- Added `CONTRIBUTING.md`, `vercel.json`, `wrangler.jsonc`, `tsconfig.json`, `prettier-plugin-astro`, and `check` and `release:check` scripts.
- Updated Astro to 7.3, MDX to 8, and all other dependencies.
- Set the minimum Node.js version to 22.12.
- Removed the `SITE_URL` and `PUBLIC_SITE_URL` environment variables in favor of `siteConfig.siteUrl`.
- Removed the category sidebar, the comments placeholder, and the `prune-unused-assets` build step.

## 2.2.0 - 2026-08-12

- Added `CUSTOMIZATION.md`.
- Replaced the archive's category and tag chip rows with two dropdown menus.
- Archive filter options show live counts, and options that would return nothing are dimmed.
- Archive filter options with no posts are left out.
- Added a "Clear filters" control to the archive.
- Archive filter menus open one at a time and close on selection, an outside click, or `Escape`.

## 2.1.0 - 2026-07-01

- Added a local SVG favicon.
- Tuned homepage hero and post card image sizes.
- The homepage hero image loads with high priority.
- Forms without an endpoint no longer submit to `mailto:`.
- Enlarged the touch targets of metadata links on post cards.

## 2.0.0 - 2026-06-30

- Upgraded the theme to Astro 7.
- Added theme settings in `src/config/theme.config.ts`.
- Added local initials avatars for authors.
- Added optional `seoTitle`, `seoDescription`, `canonical`, `updated`, `readingTime`, `featured`, and `draft` frontmatter.
- Added `thumbnailAlt` frontmatter for article images.
- Reading time is estimated when `readingTime` is left out.
- Added generated social images for articles.
- Added a build step that removes unreferenced original images.
- Archive category and tag controls link to their pages.
- Forms use configurable actions, labels, and autocomplete attributes.
- Fonts use `font-display: swap`.
- Removed the `tw-animate-css` dependency.

## 1.0.0 - 2026-06-19

- Initial release.
- Homepage, archive, article, category, tag, author, About, Contact, and 404 pages.
- MDX posts in a content collection, and an archive with search, category and tag filters, and load-more pagination.
- RSS feed, sitemap, `robots.txt`, canonical URLs, Open Graph and Twitter cards, and article JSON-LD.
- Light and dark mode, self-hosted Inter, Fraunces, and JetBrains Mono, and responsive images.
