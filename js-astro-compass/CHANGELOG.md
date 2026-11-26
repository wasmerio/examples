# Changelog

All notable changes to Compass are documented here.

## 3.0.1 - 2026-10-21

- Updated the starter docs to match the current theme: frontmatter, edit links, search, navigation, branding, project structure, and the image lightbox.
- Fixed the Code Tabs usage example.
- Removed a duplicate example from the Syntax Highlighting article.
- The sticky header and mobile "On this page" bar are now fully opaque.
- Updated Astro to 7.4.1 and other dependencies.
- Updated `AGENTS.md` for Astro 7.

## 3.0.0 - 2026-10-08

- Redesigned the theme with a new indigo accent, refined light and dark palettes, softer surfaces, and consistent motion.
- Replaced Geist with self-hosted Plus Jakarta Sans and JetBrains Mono.
- Added a new logo mark and matching favicons.
- Added a `Ctrl/⌘ + K` search palette available from every page, with popular articles before the first keystroke.
- Search results show the article's category, a highlighted excerpt, and a preselected first result.
- Redesigned the homepage hero with a dot grid, a soft glow, a large search field, and popular article chips.
- Added a recently updated list and a closing support band to the homepage.
- Docs sidebar lists every article in the section, grouped by category, with the current page highlighted.
- Added an "On this page" rail on wide screens with the current heading highlighted, an edit link, and back to top.
- Article headers show the category, reading time, last updated date, and a deprecated badge.
- Added a "Copy page" button that copies the article as Markdown.
- Added heading anchor links in articles.
- Previous and next article links are now cards.
- Category pages list articles with their descriptions, and parent pages show a card per category.
- Redesigned code blocks with a fixed language header and a quieter copy button.
- Restyled callouts, badges, buttons, cards, quotes, accordions, checklists, steps, tabs, code tabs, file trees, and tables.
- Callouts use bundled Lucide icons.
- Added a footer with section links, resources, and social links.
- Redesigned the 404 page with search and section links.
- Mobile menu lists every category with its icon.
- Theme toggle follows the system setting until a reader picks a mode.
- "Edit this page" links are generated for every article from `editBaseUrl`.
- Added `robots.txt`, `llms.txt`, and JSON-LD for the site, articles, and breadcrumbs.
- Added a skip link.
- Moved site settings to `src/config/site.ts`, docs categories to `src/config/docs.ts`, and homepage copy to `src/config/home.ts`.
- Moved styles to `src/styles/global.css` with design tokens for color, type, and shadows.
- Replaced `@tailwindcss/typography` with the theme's own article styles.
- Added a local icon set and `Icon` component.
- Added `CUSTOMIZATION.md`, `wrangler.jsonc`, and a `release:check` script.
- Updated Astro to 7.3, MDX to 8, and all other dependencies.
- Raised the minimum Node.js version to 22.12.
- Removed the sidebar search field in favor of the search palette.
- Removed the `clean`, `start`, and `lint` scripts and the custom dev server port.
- Fixed the search field staying disabled after Pagefind failed to load.
- Fixed tab scripts being repeated for every tabs block on a page.
- Fixed file trees being hidden from screen readers.
- Fixed code block headers scrolling with long lines.
- Fixed the RSS feed language being hardcoded.
- Fixed `npm run format:check` failing on Windows checkouts.

## 2.0.0 - 2026-07-15

- Updated the project to Astro 7.
- Raised the Node.js requirement to `^20.19.0 || >=22.12.0`.
- Pagefind no longer loads during `npm run dev`.

## 1.0.0 - 2026-06-19

- Initial release.
- Astro 6 and Tailwind CSS 4 docs theme with MDX content collections.
- Parent landing pages, sub-category pages, article pages, breadcrumbs, and previous and next article links.
- Pagefind search on the homepage and in the docs sidebar.
- MDX components for callouts, badges, cards, card grids, buttons, tabs, code tabs, file trees, tables, accordions, steps, checklists, and quotes.
- Article frontmatter for descriptions, tags, status, authors, edit links, hero images, redirects, related links, search visibility, ordering, and update dates.
- Self-hosted Geist fonts, light and dark modes, favicons, Open Graph images, RSS, and sitemap.
- Table of contents, code copy buttons, image lightbox, and keyboard-friendly search.
