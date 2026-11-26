# Changelog

All notable changes to this project will be documented in this file.

## 0.9.0 - 2026-09-08

### Features

- Added MDX rendering and nested content paths for posts, projects, and teaching
  entries while preserving existing top-level URLs.
- Added isolated browser regressions for navigation, themes, filters, citations,
  keyboard scrolling, enlarged text, and delayed network resources.

### Fixes

- Fixed BibTeX parsing of nested braces, comments, string macros, and author names,
  and preserved the original entries when exporting BibTeX citations.
- Fixed missing-cover layouts, empty publication libraries, and dark-mode accent
  styles; gave citation dialogs accessible names.
- Kept long text, wide tables, and enlarged detail headings within narrow screens;
  made tables keyboard-focusable and preserved single-line publication indexes.
- Kept the skip link fully hidden until focused, including with enlarged text.
- Optimized content covers with responsive WebP images through Astro assets.

### Maintenance

- Updated Astro to 7.3.1, MDX to 8.0.0, Sharp to 0.35.4, UnoCSS to 66.10.0,
  Vitest to 5.0.0, and compatible integrations and transitive dependencies.
- Added Playwright 1.63.0 as a development dependency. CI and tagged releases
  require Chromium, Firefox, and WebKit checks before completion or publication.
- Added content regressions for nested routes, drafts, missing covers, and empty
  collections to the shared verification command.

### Upgrade notes

- Run `pnpm install --frozen-lockfile` and `pnpm verify` after updating.
- The template updater removes the obsolete `[slug].astro` route files. For a
  manual update, replace them with `[...slug].astro` in all three collections;
  do not keep both files. Existing content and configuration remain supported.
- Browser checks additionally require `pnpm exec playwright install chromium
  firefox webkit` (add `--with-deps` on Linux), followed by `pnpm test:browser`.
- TypeScript remains on version 6 to satisfy the Astro check integration's peer
  requirements. WebKit tests do not replace Safari testing on real devices.

## 0.8.0 - 2026-09-04

### Features

- Added compact publication actions and a citation dialog with BibTeX, APA 7,
  Chicago, and Harvard formats.
- Added an editorial Blog index, reusable post cards, cover imagery, and
  reading-time metadata while retaining simple Markdown authoring.

### Improvements

- Expanded the active-project demonstration and aligned publications, courses,
  projects, posts, and profile records around one entirely fictional identity.
- Refined the About page hierarchy, responsive section navigation, content
  guidance, and tolerance for existing partial records.
- Improved light and dark interface contrast and kept publication controls
  compact without competing with expanded abstracts.

## 0.7.0 - 2026-09-02

### Features

- Added validated Markdown content collections and dedicated detail pages for
  projects and teaching entries.
- Added internal detail navigation alongside explicitly modeled external
  project and course resources.

### Improvements

- Unified Projects, Teaching, and Publications around a quieter editorial list
  system with clearer hierarchy, responsive layouts, and accessible controls.
- Refined mobile navigation, detail-page metadata, footer configuration, theme
  behavior, and generated-site assertions.
- Added complete project and teaching authoring guidance with image, link, and
  migration examples.

### Upgrades

- Added automatic conversion of legacy `src/data/projects.yml` and
  `src/data/teaching.yml` records while preserving the original YAML files.
- Changed the updater to use migration logic from the target release, verify
  the personalized site before opening a pull request, and exclude workflow
  files automatically when no workflow-enabled token is configured.

## 0.6.1 - 2026-08-12

### Fixes

- Added a verified upgrade path for sites created before `v0.6.0`, including
  automatic migration of the legacy site configuration and cleanup of obsolete
  template files.
- Made generated-site assertions independent of demo identity and content so
  personalized downstream sites can run the full verification pipeline.
- Kept the compatibility configuration entry template-owned during future
  updates.

## 0.6.0 - 2026-08-12

### Features

- Added strict build-time validation for About, Projects, and Teaching YAML
  data.
- Added continuous integration for tests, Astro checks, production builds,
  and generated-site assertions.

### Improvements

- Replaced placeholder identities and links with coherent demo content.
- Simplified filters, theme controls, and publication abstracts with native,
  accessible browser semantics.
- Removed duplicate section navigation from filtered pages.
- Reduced the icon dependency footprint to the three collections used by the
  theme and changed internal-page prefetching to user intent.
- Classified uncategorized BibTeX entries as Other and limited homepage
  selections to published work.
- Restricted GitHub Release automation to the upstream template repository.

## 0.5.0 - 2026-06-25

### Features

- Added shared filter and page jump components for Research, Projects,
  Teaching, and About pages.
- Added URL-persisted filter state and shared section-anchor generation.
- Added `siteUrl` and `ogImage` configuration for canonical URLs, Open Graph
  image URLs, and sitemap consistency.

### Improvements

- Extracted layout browser behavior into a reusable script module while keeping
  the pre-paint theme bootstrap inline.
- Replaced fragile filter span-order updates with semantic marker attributes.
- Migrated UnoCSS config from deprecated `presetWind` to `presetWind3`.
- Expanded generated-site assertions for SEO, accessibility, layout scripts,
  filter controls, canonical URLs, and section anchors.
- Updated English and Chinese documentation for the current configuration shape
  and release verification flow.

## 0.4.0 - 2026-05-28

### Features

- Added SemVer release tracking with `.template-version`, release validation
  scripts, and a GitHub release workflow for pushed `vX.Y.Z` tags.
- Added a downstream template update workflow that checks upstream release tags,
  overlays template-owned files, and opens pull requests in user repositories.
- Extended YAML content fields for Projects, Teaching, and About custom sections
  with optional links, badges, highlights, and metadata while preserving the
  existing simple structure.

## 0.3.0 - 2025-12-11

### Features

- **UI Redesign ("Soft Modern"):**
  - Overhauled the entire card design language across the site (Home, About, Projects, Teaching, Researches, Posts).
  - **Styles:** Removed hard borders (`border-gray-200`) in favor of soft shadows (`shadow-sm` -> `hover:shadow-md`).
  - **Geometry:** Increased border radius to `rounded-2xl` for a more modern, friendly aesthetic.
  - **Spacing:** Increased internal card padding (standardized to `p-6`) to improve readability and "breathing room".

- **Homepage:**
  - Redesigned the "Recent Posts" section from a simple list to a **grid card layout** to match the visual weight of the "Selected Publications" section.

- **Configuration:**
  - Added `profileImageWidth` and `profileImageHeight` support in `siteConfig` (and `types/config.ts`) to allow precise pixel-level control over the hero image dimensions (replacing the previous CSS class-based approach).
  - Added configurable Page Titles and Descriptions in `siteConfig` for better customization without editing templates.

### Improvements

- **About Page:** Updated layout for Education, Experience, Service, and Award sections to strictly align with the new card styling.
- **Projects & Teaching:** Refined "Active" and "Past" section cards to ensure visual consistency with the rest of the site.
- **Researches Page:** Adjusted padding specifically for this page (`pl-8`) to perfectly accommodate index badges within the new borderless design.
- **Reliability:** Enhanced Astro templates to gracefully handle missing YAML fields (optional chaining) to prevent build errors.
