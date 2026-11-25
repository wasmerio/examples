# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

Any Node package manager works. The project includes `mise.toml` for Node version management.

## Architecture

This is an Astro 7 static site template (single-author blog + personal site). No client-side JavaScript or cookies; everything renders to static HTML.

**Styling:** Pico CSS v2 via SCSS. `src/styles/main.scss` controls which Pico modules are included. The theme uses minimal custom CSS and avoids CSS classes in favour of semantic HTML elements.

**Path aliases** are defined in `tsconfig.json`.

**Content:** Blog posts live in `src/content/blog/` as Markdown files. The file path becomes the post URL. Content schema is defined in `src/content.config.ts` using Astro's glob loader.

**Tags:** Tags are slugified via `tagToSlug()` in `src/utils/tags.ts`. Tag pages are generated dynamically from `src/pages/tags/[id].astro`.

**Site config:** `src/settings.ts` exports `siteConfig` with title, description, lang, favicon path, and Open Graph image settings. Edit this to customise the site identity.

**Navigation:** Managed directly in `src/components/PageHeader.astro`.

**Templates:** `src/templates/` contains starter files for new pages (`page.astro`) and posts (`post.md`).

**RSS:** Auto-generated at `/rss.xml` via `src/pages/rss.xml.js`.
