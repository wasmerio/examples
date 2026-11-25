# Changelog

All notable changes to Mailer are documented here.

## 1.0.1 - 2026-10-21

- Updated Astro to 7.4.1 and other dependencies.
- Updated `AGENTS.md` for Astro 7.
- Files check out with LF line endings on every platform.

## 1.0.0 - 2026-09-21

- Initial release.
- Numbered issues in Markdown or MDX, validated by Astro content collections, with read time counted from the body at build time and drafts excluded from every listing, feed, and search index.
- Front page dealt from the archive with no repeats between blocks: a masthead with the signup form, a full-width lead issue, two recent issues as cards, a numbered index of back issues, a topic grid, a writer row, and a closing signup panel. Any block with nothing to show hides itself.
- Archive read as a numbered index grouped by year, shared by the topic, writer, and search-results pages, all paginated.
- Issue pages with a fixed reading column, a reading-progress bar, a writer note, previous/next navigation, and a share card with eleven targets and a copy-link field.
- Six blocks for the issue body handed to MDX with no import needed — figure, callout, toggle, bookmark, audio, and file download — with bookmark cards filled in from the linked page's Open Graph tags at build time, and a styleguide page showing every one of them.
- A lightbox on every issue with arrow keys, swipe, a counter, and neighbours preloaded, wired up at runtime so plain Markdown images get it too.
- Provider-neutral signup form that renders disabled until `newsletter.action` is configured.
- Client-side search over a statically generated JSON index, shared by a header dialog and a results page that keeps its query in the URL.
- One feed at `/rss.xml` carrying full issue content, with summary-only feeds and the item cap as settings.
- Site identity, SEO, navigation, topics, and writers in three config files under `src/config`.
- Canonical URLs, sitemap, `robots.txt`, Open Graph, Twitter/X cards, and JSON-LD, with share cards cropped from each cover at build time.
- Static output with no framework islands, responsive Astro images with Sharp, and one self-hosted variable typeface.
- Skip link, landmarks, labelled controls, visible focus states, full `prefers-reduced-motion` support, and system-aware light and dark modes.
