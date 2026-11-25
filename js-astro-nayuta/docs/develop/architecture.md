# Architecture and Code Conventions

[< Development guide](index.md)

Nayuta generates static HTML with Astro. Keep reading and navigation available
without JavaScript, and add browser behavior only where it improves interaction.
Prefer existing dependencies, semantic HTML, and native browser APIs.

## Directory Ownership

| Path                      | Responsibility                                                                    |
| ------------------------- | --------------------------------------------------------------------------------- |
| `src/integrations/`       | Astro lifecycle integrations, including Pagefind indexing and development assets. |
| `src/pages/`              | Astro routes, static path generation, archives, RSS, and the 404 page.            |
| `src/layouts/`            | Document structure, metadata, page regions, sidebars, and responsive drawers.     |
| `src/layouts/components/` | Small reusable UI such as `Prose`, `Pagination`, `Avatar`, and `Button`.          |
| `src/layouts/widgets/`    | Composed UI and layout enhancements: `ProfileCard`, `post-list/`, `image/`.       |
| `src/templates/`          | Template definitions, registration, metadata schemas, and body presentation.      |
| `src/widgets/sidebar/`    | Sidebar widgets and their composition helpers, also used inside drawers.          |
| `src/widgets/article/`    | Public MDX components such as `Callout` and `TableContainer`.                     |
| `src/assets/styles/`      | Global style tokens and theme palettes.                                           |
| `src/assets/utils/`       | Logic actually shared by multiple build-time or browser consumers.                |
| `src/types/`              | Shared TypeScript contracts.                                                      |
| `src/content/`            | Authored content, local sidebar components, and colocated assets.                 |
| `src/content.config.ts`   | Collection loaders and common metadata schemas.                                   |
| `src/config.ts`           | Site identity, navigation, theme selection, and archive page size.                |
| `public/`                 | Files served at stable URLs without content processing.                           |
| `tests/`                  | Bun tests and isolated site/browser fixtures.                                     |

Keep queries, sorting, and display preparation in the consuming `.astro` file.
Extract a utility only when multiple consumers share the same logic. Current
shared modules are `pages.ts`, `posts.ts`, `reading-time.ts`, and `pagination.ts`
under `src/assets/utils/`. Image metadata is shared by the image component and
Markdown processing; `rehype-images.ts` owns the Markdown/MDX image transform.

## Page Composition

`frame.astro` owns the HTML document, head, responsive grid, sticky header,
drawers, footer placement, authored sidebar resolution, and the article table
of contents. Post detail, archives, search, and the 404 page use it directly.

`layouts/template.astro` is the shared entry point for the homepage and authored
pages. It looks up the template in `templates/registry.ts`, validates its metadata,
prepares breadcrumbs and body content, and wraps the template in `frame.astro`.
Templates own body presentation and receive authored content through their default
slot. See [Creating a template](templates.md) for the template contract and
[Content](content.md) for metadata and sidebar contracts.

Use `Prose.astro` around reading content. Its scoped styles apply to descendants;
adding a `prose` class to an unrelated element does not attach those styles.
Keep navigation, pagination, and tag controls outside the prose wrapper.

## Search and Indexing

`src/pages/search/index.astro` composes `Frame`, `Prose`, and dynamic `PostList`.
Its custom element owns query parsing, Pagefind requests, history, page validation,
and result conversion. `PostList` owns summaries, text highlighting, pagination,
status announcements, and keyboard focus. Browser contracts live in
`src/types/search.ts` and `src/types/post-list.ts`; Pagefind-specific retrieval
stays in the consuming route.

`src/integrations/pagefind/index.ts` registers with Astro in `astro.config.ts`.
The build hook indexes rendered HTML and writes the search bundle to
`dist/pagefind/`. In development, a development-only manifest route obtains
searchable URLs through `getPosts()`. The integration fetches those rendered pages,
builds an in-memory index, and serves `/pagefind/*`. Source changes invalidate the
cached bundle; the next index request rebuilds it. Index creation starts when the
server starts, and concurrent requests share the pending generation.

Both modes use `[data-pagefind-body]` as the index root. Post detail owns this
marker and the title, date, reading-time, and draft metadata. The generated index
contains article content; navigation, archives, standalone pages, and copyright
cards are outside its scope. The integration releases each Pagefind index after
producing its files. Development assets are served without browser caching.
See [Search](search.md) for routing, failure handling, and validation.

## Imports and Types

Use the aliases in [tsconfig.json](../../tsconfig.json) for imports within `src/`,
including same-directory imports, Astro frontmatter, component scripts, and MDX.

| Alias         | Directory        |
| ------------- | ---------------- |
| `~/`          | `src/`           |
| `@assets/`    | `src/assets/`    |
| `@layouts/`   | `src/layouts/`   |
| `@pages/`     | `src/pages/`     |
| `@templates/` | `src/templates/` |
| `@type/`      | `src/types/`     |
| `@widgets/`   | `src/widgets/`   |

Prefer the matching directory alias, such as `@assets/utils/posts`, and use `~/`
for modules such as `~/config`. Loader filesystem paths and browser URLs follow
their own APIs rather than TypeScript aliases. Root configuration and tests can
use relative imports; authored content may use relative imports for local assets
and components.

Use TypeScript 6 and the strict Astro configuration. Declare ambient types
explicitly; Bun APIs are covered by `@types/bun` and `"types": ["bun"]` in
`tsconfig.json`. Use `import type` for type-only imports and validate unknown
content metadata before consuming it.

## Styling

Use vanilla CSS in Astro `<style>` blocks for component styles. Shared typography,
spacing, and layout tokens live in `global.css`; palette tokens live in
`themes/*.css`. Reuse the semantic `--ny-*` variables described in
[Visual design](design.md), and keep local dimensions local when no shared token
exists. Add shared tokens when they represent a reusable design decision.

Keep global selectors limited to document styles or deliberate layout boundaries.
Use `:global(...)` when scoped styles must reach rendered Markdown or slotted
content. Preserve Astro scope attributes in dynamically cloned component markup.

## Browser Behavior and Accessibility

- Use semantic landmarks, native links for navigation, and buttons for actions.
  Give icon-only controls accessible names and preserve visible keyboard focus.
- Keep enhancements in the owning `.astro` file. Introduce a shared script module
  only when multiple components need the same behavior.
- Scope listeners and DOM queries to a component instance. Custom elements should
  initialize on connection and release observers/listeners on disconnection.
- Keep content and static links usable without JavaScript. The frame only hides
  sidebar content after its drawer controller is ready; otherwise sidebars stay
  in document flow.
- Preserve closed-drawer `inert` state, focus containment, Escape handling,
  `aria-expanded`, and focus restoration. Avoid duplicate IDs in content rendered
  in both a desktop sidebar and a drawer.
- Prefer the existing Astro and native DOM approach. New dependencies or client
  frameworks need a concrete benefit that justifies their runtime, compatibility,
  accessibility, and maintenance costs.

Formatting and validation commands are documented in
[Contributing to Nayuta](../../CONTRIBUTING.md#checks-and-formatting).
