# @astronomic/theme-core

The plumbing every Astronomic theme shares: content helpers, routes, the "On this page" outline, the conformance checks, the test runners and a few parts with no look of their own. Each theme keeps its model, sources, pages, strings and look, and passes its own values in.

The package ships as source (`.ts`, `.astro`, `.mjs`). There is no build step. Vite compiles it in your project.

## Entry points

| Import | What it holds |
| --- | --- |
| `@astronomic/theme-core` | `count(n, one, many)` and the shared types. |
| `@astronomic/theme-core/content` | `createThemeContent` (binds the selected source), `searchLimits`, `simpleSearch`, `searchMode`, `toShownHit`, `trimSummary`, `firstParagraph`, the sort and match helpers (`byText`, `ascLast`, `descLast`, `compareOrdered`, `compareByTitle`, `matchFeatured`, `nextAfter`), and member access: `postAccess`, `PublicPost` and its types, `postShare`, `publicMatch`, the preview (`makePreview`, `previewBlocks`, `previewText`, `previewOutline`, `previewCoverage`, `PREVIEW_BOUNDS`), `bodyText`, `readingTime`, `bodySignature`. |
| `@astronomic/theme-core/conformance` | The checks behind a theme's conformance route: field predicates, `fields`, `duplicateSlugs`, `reservedRoutes`, `sortProblems`, the model snapshot helpers, and `authorPreviewProblems` (an author preview that shows most of a gated body). |
| `@astronomic/theme-core/astro` | `contentTests({ conformance, snapshot })`, the integration that adds the two test routes; `staticSearch({ exclude })`, the integration that runs Pagefind after a static build; `privateResponses()`, the integration that adds the private-response middleware. |
| `@astronomic/theme-core/middleware` | `privateResponse` (`onRequest`), the middleware `privateResponses()` adds. |
| `@astronomic/theme-core/routes` | `parsePage`, `pageHref`, `extraPages`, `pagedPaths`, `termPagePaths`, `slugParams`, `withCounts`, `isCurrentPath`, `currentPath`, `searchQuery`, `notFound` (a root route's not-found answer: a rewrite to `/404`, or a plain 404 when the route caught `/404` itself, so a missing `404.astro` cannot loop). Page size and param names are arguments. |
| `@astronomic/theme-core/outline` | `slugify` and `outline` (h2 ids and the "On this page" list); `PART_IDS`, the ids the parts set by default (reserve them). |
| `@astronomic/theme-core/date` | `formatDate` (UTC); `latestDate(a, b)`, the later valid date (a post's last change); `updatedAfter(date, updated)`, the update date to show, only when it is on a later day. |
| `@astronomic/theme-core/seo` | `pageMeta`, the title rule and the meta list; `publicOrigin`, the site's public origin. |
| `@astronomic/theme-core/jsonld` | The structured data builders (see Structured data): `siteGraph`, `siteIds`, `ownerNode`, `sameAs`, `webPageNode`, `collectionPageNode`, `personNode`, `profilePageNode`, `faqPageNode`, `serviceNode`, `creativeWorkNode`, `blogPostingNode`, `jsonLdGraph`, `jsonLdScript`. |
| `@astronomic/theme-core/feeds` | `feedItems` and `rssResponse` (the RSS feed, through `@astrojs/rss`), `sitemapXml`, `robotsTxt` (with the `aiTraining` switch), `llmsTxt` and `llmsSections` (the reader map), `xmlResponse`, `publicItems`, `listedPages`, `isShown`, `shownEntries`, `escapeXml`, `absoluteUrl`. |
| `@astronomic/theme-core/share` | `cardTree`, `renderCard`, `cardResponse` (the share card PNG), `cachedCard` (a rendered card kept per process by its public input), `WIDTH`, `HEIGHT`, `titleSize`, `shareImagePath`, `shareKey`, `fontFromDataUrl`. |
| `@astronomic/theme-core/components/*.astro` | `RichText`, `PreviewText`, `ContentImage`, `SearchForm`, `SearchToggle`, `SearchPage`, `SearchIndex`, `SeoHead`, `OnThisPage`. Renderers, strings and look classes come in as props. |
| `@astronomic/theme-core/scripts/*` | The test runners: adapter, no-emdash, system, parity, skins, and the harness they share (`headProblems` also checks the JSON-LD; `jsonLdNodes(html)` lists a page's nodes). Each takes your project root. `sentinel.mjs`: `findSentinel({ dir, responses }, strings)` finds secret strings in a build folder (plain, encoded and gzipped files, the Pagefind index) and in recorded responses. |

## Rules

- No EmDash. Nothing in the package imports `emdash`, `@emdash-cms/*` or `@astrojs/node`. `emdash` is an optional peer, so a Markdown-only project installs neither.
- No theme files. Nothing imports `~/…`. Parts take data, strings, renderers and look classes as props.
- No look. No theme tokens, colours or fonts. Kit role classes (`border-border`, `text-muted`) and kit helpers (`cn`, `buttonClasses`) are allowed, as in `@astronomic/ui`.
- The runners in `scripts/` are plain `.mjs` and import no `.ts` file, so they run under Node from any install.

## Use it in a theme

Add a `@source` line to the theme's CSS when it renders a part from `components/`, so Tailwind sees the part's classes:

```css
@source "../../node_modules/@astronomic/theme-core/src";
```

`SearchToggle` works with or without Astro's `<ClientRouter />`: it binds the button when its script runs and again on `astro:page-load`.

Set `site` in `astro.config.mjs` to the public origin (the products use `process.env.SITE_URL || "https://example.com"`). The feed, the sitemap, robots.txt and the share cards need absolute URLs. Get the origin from `publicOrigin`: on a server build `EMDASH_SITE_URL` or `SITE_URL` at run time wins, as in EmDash. A production server with neither treats a placeholder `site` (`example.com`, `.org`, `.net`, `.example`, and subdomains) as unset: it uses the request's origin (`Astro.url`: `localhost` unless `security.allowedDomains` names the host) and logs one line asking for `SITE_URL`. `declaredOrigin` gives the address as configured, for a value that must not come from a request, such as a form's redirect.

Put the theme's own test settings (its page list, `assertPages`, skins paths) in `scripts/theme-tests.mjs`. Each `test:*` script in the theme is a few lines that pass those settings and the project root to a runner here.

## Site files

A theme owns four route files in `src/pages/`, each a few lines that call a builder here:

- `rss.xml.ts`: `feedItems` and `rssResponse`.
- `sitemap.xml.ts`: `sitemapXml` and `xmlResponse`.
- `robots.txt.ts`: `robotsTxt` and `xmlResponse`. `aiTraining: false` adds one group that asks the training crawlers (`TRAINING_CRAWLERS`) to stay off the site; search crawlers stay allowed. The theme keeps the switch in one constant at the top of the file.
- `og/[...path]/card.png.ts`: `cardTree`, `renderCard` and `cardResponse`.

The reader map (`llmsTxt`) is a fifth route file: the site's public pages in the llmstxt.org format, one `## ` section per area (`llmsSections` groups the public pages by their `section` key, in the order and with the headings of the theme's `strings.readerMap`; a page with no section is under `pages`), each link absolute with its description. Feed it the same public page list as the sitemap, so noindex and locked pages stay out. It is a map for a coding assistant or other reading tool that someone sends to the site, so the tool can see which pages it has. No tool has to read it, and it promises no results. It does not raise search rank, and search engines do not use it to rank pages. Serve it with `xmlResponse(..., "text")`.

A sixth file, `sitemap-[collection].xml.ts`, answers 404 so EmDash adds no per-collection sitemaps.

They are files, not routes an integration adds, because EmDash checks `src/pages/` for its own sitemap and robots.txt. It adds its own routes unless such files exist there, and an integration's route does not stop it. One list of the theme's public pages feeds the sitemap and the cards.

Every output here is anonymous: it never depends on who asks (no cookie, no reader), so each may be cached publicly.

## Structured data

`@astronomic/theme-core/jsonld` builds schema.org JSON-LD as plain objects. The site's `WebSite` and its owner (an `Organization` or a `Person`) are one node each, at `<origin>/#website` and `<origin>/#owner` (`siteIds`); page nodes point at them by `@id`. `siteGraph(origin, { name, description, owner })` gives both. Each builder copies only the fields it names and drops empty ones, and every URL comes out absolute. The owner's `logo` is the site logo only (never the share card); `sameAs(links)` keeps absolute http(s) profile links, without feeds or mail links.

`blogPostingNode` takes a `BlogPostingInput` (title, description, image, path, date, updated, access, authors, series) and nothing else, so a post's body cannot reach the page. `dateModified` is `latestDate(date, updated)`. `isAccessibleForFree` comes from `access` (`"public"` only), never from what the reader can see.

A theme's `Base` builds one graph per page (the site nodes, then the page's own nodes) and passes it to `pageMeta({ jsonLd })` only. `pageMeta` lists `"jsonld"` last in `baseMeta` and keeps the graph as `page.jsonLd` only with a `site` (the URLs must be absolute), a non-empty graph and no noindex; `<SeoHead page={page} />` renders one `<script type="application/ld+json">` from `page.jsonLd` only then. `jsonLdScript` writes every `<` as `\u003c`, so no value can close the script.

## Search

`searchMode(content.search, import.meta.env.CONTENT_OUTPUT)` picks the search a page offers:

- `"request"`: a server build whose source searches. The search page calls `content.search(query)` and passes the hits (`toShownHit`) to `SearchPage`, which renders them on the server.
- `"static"`: a static build. Add `staticSearch()` to the integrations. After the build it runs Pagefind on the built pages and writes `dist/pagefind/`. `SearchPage` searches that index in the browser and fills the theme's hit markup. Pagefind indexes only pages with `data-pagefind-body`; put it on the entry pages' main element, with `SearchIndex` inside it for the kind, title and summary. When no page has it (every entry deleted or hidden from search engines), the build warns and writes a stand-in `pagefind/pagefind.js` that finds nothing, so the search page says no results; Pagefind never indexes the unmarked pages (lists, home, search).

`SearchPage` renders the same markup in both modes. The default slot is a function of one hit (`ShownHit`); mark its link `data-hit="href"` and its parts `data-hit="title"`, `"excerpt"` and `"kind"`. Named slots:

- `header`: the page title and search box, rendered first and outside every live region. It may be a function of the count text.
- `empty` (no query) and `none` (no results). The none block has its own polite live region, so screen readers hear "no results".
- `count`: a function of the count text that renders one element with `data-count-text aria-live="polite"`. Leave it out and the part renders its own. A `header` function that renders the `data-count-text` element takes its place.

A named function slot needs an element wrapper, which Astro drops: `<p slot="count">{(text) => <p data-count-text aria-live="polite">{text}</p>}</p>`. With `<Fragment slot="count">` the function gets no text.

Pagefind's URLs end in a slash (`/work/a/`). Static hits drop it, as the theme's links do, unless `trailingSlash` is `"always"` in the Astro config (`staticSearch()` passes that on).

In `astro dev` there is no built index, so static search shows the `devOnly` text. Run `astro build` and serve `dist` to try it.

## Share cards

`cardTree` lays out a 1200 x 630 card (label, title, site name); `renderCard` draws it to a PNG with satori and resvg. The PNG is the same on every build.

- The theme passes its own colours (`ShareLook`) and font files. There is no default look.
- Fonts must be WOFF, TTF or OTF. satori does not read WOFF2. Import the file with `?inline` and pass it through `fontFromDataUrl`.
- A card shows only public fields: never a body or a summary.
- The site lists `satori` and `@resvg/resvg-js` in its own dependencies, as it would `sharp`. resvg's native binary cannot be bundled, and Vite leaves a package out of the server bundle only when it finds it from the project root. Use `satori` 0.35.0 exactly: 0.35.2 fails on its first render in Node 26.

## Public view

`feedItems` and `publicItems` take each entry through a `view` function (`PublicView`) and leave out an entry when it returns `undefined`; a theme's public page list (for the sitemap and the cards) takes one too. `isShown(entry, view)` is the one meaning of "shown": not marked noindex, and kept by the view. `shownEntries(entries, view)` gives the shown entries as their view, asking the view once per entry. Agency and the starter pass no view (every entry shows as it is). A theme with member access reads its lists through the public model, so they already hold the public view of locked posts.

## Member access

A theme with members and paid posts names its source model and passes `access` to `createThemeContent`:

```ts
export const useContent = createThemeContent<Model, Settings, SourceModel>(source, DEFAULT_SETTINGS, {
	output: import.meta.env.CONTENT_OUTPUT,
	access: { canRead, collections: { posts: postAccess({ keep: ["tags", "authors"] }) } },
});
```

It applies `withAccess` from `@astronomic/content` (the two models, `canRead`, fail-closed rules and reader-private responses are described in its README).

- **`postAccess()` and `PublicPost`.** One projection for every page, list, feed item, search hit and card. A readable post is the record (without `preview` and `authorExcerpt`) with an excerpt, a description and a reading time. A locked post holds only `slug`, `title`, `access`, `locked`, `reason`, `date`, `updated`, `image`, `excerpt`, `description`, an allow-listed `seo`, the `preview`, its `headings`, and the record keys you name in `keep` (never a key the projection owns, and never rich text: the guard throws). It has no body, no `edit` attributes, no reading time (it would tell the post's length) and no entry `ref` (a source hook could load the entry with it).
- **What a locked post keeps.** `authorExcerpt` is only text the author wrote as the excerpt. On a locked post it is dropped when it copies the body beyond what the preview shows: any run of 8 words (or a 40-character stretch of letters and digits) found in the body, compared as written, as plain text, without marks or accents and with entities decoded. This is fail safe: an honest excerpt that reuses an 8-word phrase of the locked body is dropped too; then the excerpt comes from the preview. `seo` keeps `title`, `image`, `canonical` and `noindex` (editor-set public metadata) and `description` under the same copy rule; no other SEO key.
- **The preview.** The author's `preview` field first (public by definition, cut at 1,500 characters; `authorPreviewProblems` in `./conformance` reports one that shows more than half of the body). Else the body's first paragraph, at most 320 characters and at most a quarter of the post; none for a post under 600 characters. `previewBlocks` reads Markdown, MDX, Portable Text and HTML as plain data and keeps prose paragraphs and h2/h3 only: code, embeds, components, expressions, hidden elements, lists, quotes, tables and media are dropped, and a body it cannot read for sure (an element, expression or fence left open) gives no automatic preview. The first preview heading is an h2.
- **`PreviewText`.** The preview's own renderer: escaped text, h2 ids from `previewOutline` (pass the same `reserved` as the page's outline), classes as props. `RichText` refuses a preview. Pass `entry: { slug, locked: true }` to `pageMeta` on a locked page.
- **Media in locked bodies.** An image or file a locked body uses is public to anyone who has its URL. In Markdown builds Astro emits a locked body's images even though the body is never rendered; EmDash serves every media file at `/_emdash/api/media/file/`. No public page, feed, search result or index names them, but keep secrets out of locked-body media, or link out to them.
- **Caches.** Lists, feeds, sitemaps and cards are anonymous and may be cached. A post page that asks `canRead` is private and never stored. A post changed from public to gated is still served from caches until the CMS invalidates them or they expire: EmDash clears its in-process route cache by the entry's tags when it is published; CDN copies, other server processes and Markdown sites until the next deploy are not covered. Keep a short `maxAge` on post routes and at the CDN.
- **Titles on EmDash.** EmDash's SQL order for titles is not `byText`; sort titles in memory with `compareByTitle`.

## Share card cache

`cachedCard(card, look, render)` keeps rendered card PNGs per process, by a hash of their public input, so a server build renders each card once. Each product's `share-card.ts` exports `cardInput(page, siteName)` for it.

## Private responses

Add `privateResponses()` to the integrations of a server build. Its middleware sends `Cache-Control: private, no-store` and turns Astro's route cache off for every response (HTML, the feed, the sitemap, card PNGs) of a request with the EmDash edit-mode cookie (`emdash-edit-mode=true`) or a preview token (`?_preview=`), and of a page that depends on the reader (`markReaderPrivate` from `@astronomic/content`). Such a response also loses every CDN and edge cache header (`CDN-Cache-Control`, `Surrogate-Control`, `Surrogate-Key`, `Cache-Tag` and the Vercel, Netlify, Cloudflare and Akamai forms). It runs after the page, so a direct `Astro.cache.set(...)` or a public `Cache-Control` the page set cannot undo it.

Agency and the starter use it on their server builds. Known limit: Astro's route cache answers a cached URL before any middleware runs. So an editor or a member can get a warm public copy of a page (public data, possibly stale), never a private one: a private response is never stored.

## Develop

- `pnpm check`: type-checks the package.
