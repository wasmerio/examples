# @astronomic/content

One contract for any content source. Pages ask for content in the product's own model. An adapter maps one source (Markdown, EmDash, your own API) into that model. Switching the source never changes pages, layouts or components.

The package ships as source (`.ts`, `.astro`, `.mjs`). There is no build step. Vite compiles it in your project.

## Entry points

| Import | What it holds |
| --- | --- |
| `@astronomic/content` | Types, `defineAdapter`, `extend`, `compose`, `from`, `remove`, `createUseContent`, `checkAdapter`, and member access (`withAccess`, `markReaderPrivate`, `isReaderPrivate`, `assertNoRichText`, the access types). No CMS imports. |
| `@astronomic/content/markdown` | Markdown adapter kit (`markdownKit`, `markdownCollection`). Static. See [src/markdown/README.md](src/markdown/README.md). |
| `@astronomic/content/emdash` | EmDash adapter kit. Server. Needs `emdash` (optional peer). See [src/emdash/README.md](src/emdash/README.md). |
| `@astronomic/content/emdash/access` | `emdashAccess({ collections })`, the integration that guards EmDash's public search endpoints for gated collections. See [src/emdash/README.md](src/emdash/README.md). |
| `@astronomic/content/emdash/search-guard` | The middleware `emdashAccess()` adds. |
| `@astronomic/content/placeholder-gate` | `placeholderGate`, the one rule every theme's setup check uses for placeholders left on a site that is no longer the sample's, and the `ASTRONOMIC_ALLOW_PLACEHOLDERS=1` bypass. No imports. |
| `@astronomic/content/astro` | `contentSource(name, import.meta.url)` for `astro.config.mjs`. |
| `@astronomic/content/TrustedHtml.astro` | Renders HTML rich text as is. Sanitize untrusted HTML in your adapter's `map`. |
| `@astronomic/content/virtual` | Types for `astronomic:content/source`, `astronomic:content/live` and `import.meta.env.CONTENT_OUTPUT`. |

## What stays in your project

The package never imports your model. Your project owns:

- `src/content/model.ts`: your collections and their queries.
- `src/content/sources/<name>.ts`: one adapter per source, built with the kits above. Optional `<name>.setup.mjs` (output, server adapter, integrations) and `<name>.live.ts` (live loaders).
- `src/content/index.ts`: binds the selected source once with `createUseContent`. On a request, `useContent(Astro).settings()` and `.menu(name)` are memoized per request, so the layout and the page share one read.
- `src/content.config.ts` and `src/live.config.ts`.

## Set up

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import { contentSource } from "@astronomic/content/astro";

const content = await contentSource(process.env.CONTENT_SOURCE ?? "markdown", import.meta.url);

export default defineConfig({
	output: content.output,
	adapter: content.adapter,
	integrations: [...content.integrations],
	vite: { resolve: { alias: content.alias }, define: content.define },
});
```

```ts
// src/env.d.ts
/// <reference types="@astronomic/content/virtual" />
```

```ts
// src/live.config.ts (Astro accepts defineLiveCollection only in this file)
import { defineLiveCollection } from "astro:content";
import { liveLoaders } from "astronomic:content/live";

export const collections = Object.fromEntries(
	Object.entries(liveLoaders).map(([name, loader]) => [name, defineLiveCollection({ loader })]),
);
```

## Access

For members and paid posts. A model with no gated collection needs none of this.

- **Two models.** Sources map into a source model: records with their body. `withAccess<SourceModel, PublicModel>()(adapter, { output, canRead, collections })` returns an adapter of the public model: in each gated collection an entry is `Readable` (body included) or `Locked` (no body, no rich text and no entry `ref`, by type and by a run-time guard, `assertNoRichText`). Each gated collection has a rule: `access(record)` gives `public`, `members` or `paid` (anything else counts as paid), `project(record, state)` builds the view, `toHit(view, hit)` builds its search hit. theme-core's `postAccess()` is a ready rule for posts.
- **`canRead(subject, reader)`.** Your access check. `subject` is `{ collection, slug, access, ref? }` (never the body); `reader` is `{ request, locals, cookies }`, so a membership plugin can read its session from `locals`. It returns `"allow"`, `"deny"` (locked, no preview) or `"preview"` (locked with the preview).
- **Fail closed.** `canRead` is asked only by `get()` on a live server request (`output: "server"`, an `Astro` in the context, not prerendered). A static build, a prerendered page, a call without a request, no `canRead`, a `canRead` that throws (a warning is logged without the error's text) or returns anything else: members and paid entries are locked.
- **Lists are anonymous.** `list()`, request search, feeds, sitemaps and cards always use the anonymous view, so they stay public and cacheable. Request search keeps a locked hit only when its public text (title, excerpt, preview) matches, and rebuilds every gated hit from its view: a search snippet of a locked body never shows. A hit named by a collection the model does not have is dropped; when a source's search uses other names (EmDash's `articles` for the model's `posts`), pass `searchAliases: { articles: "posts" }`.
- **Reader-private responses.** When `get()` asks `canRead`, the response depends on the reader: `markReaderPrivate` turns Astro's route cache off, sends `Cache-Control: private, no-store`, and every later source cache hint of the request is dropped. theme-core's `privateResponses()` middleware enforces it after the page.
- **EmDash.** Add `emdashAccess({ collections })` (EmDash's collection names) next to `emdash()`: it keeps anonymous callers of `/_emdash/api/search` and `/_emdash/api/search/suggest` away from gated collections. See [src/emdash/README.md](src/emdash/README.md).

## EmDash is optional

`emdash` is an optional peer dependency. A Markdown-only project does not install it, or `@astrojs/node`. Only `@astronomic/content/emdash` and a source's `.setup.mjs` / `.live.ts` import them.

## Hide from search engines

An entry's `seo.noindex` is `true` when it should stay out of search engines: the layout renders `<meta name="robots" content="noindex">`, and the sitemap and the static search index leave it out. EmDash sets it from the entry's SEO panel ("hide from search engines"), in lists too: a list entry's `seo` holds only `noindex` (the other SEO fields need the request), and the EmDash kit loads it with one cached single-entry query per entry, only when the product's map calls `h.seo()`. In Markdown, map a `noindex: true` frontmatter field to `seo: { noindex: true }`.

## Checks

- `pnpm check`: type-checks the package.

## Customize

Adapters are plain objects. From lightest to heaviest: configure a kit, override one part with `extend`, mix sources with `compose` and `from`, write your own adapter, or eject (the code is copied into every released product).
