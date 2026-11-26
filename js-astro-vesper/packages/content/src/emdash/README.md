# EmDash adapter

Reads content per request from [EmDash](https://emdashcms.com). `@astronomic/content/emdash` is a kit that does not know your model. The starter's mapping lives in `src/content/sources/emdash.ts`.

`emdash` is an optional peer dependency of `@astronomic/content`. Install it, and `@astrojs/node` for server output, only when you use this adapter:

```sh
pnpm add emdash @astrojs/node
```

## Switch to EmDash

In `astro.config.mjs`, select the source:

```js
const content = await contentSource("emdash", import.meta.url);
```

Or keep the file as is and set `CONTENT_SOURCE=emdash` when you run Astro.

Selecting `emdash` loads three files from `src/content/sources/`:

- `emdash.ts`: the adapter (the starter's collections, mapped from EmDash).
- `emdash.setup.mjs`: the Astro setup. It sets `output: "server"`, adds the Node adapter and the `emdash()` integration with a SQLite database (`./data.db`) and local media storage (`./uploads`, served at `/_emdash/api/media/file`). It imports `@astrojs/node`, `emdash/astro` and `emdash/db` dynamically, so a site on another source does not need them.
- `emdash.live.ts`: the `_emdash` live loader that `src/live.config.ts` registers.

## Seed

`seed/seed.json` holds the schema (posts, pages, guides, series; the tag and category taxonomies; the primary menu; widgets) and demo content. Load it into a new database:

```sh
pnpm seed:emdash
```

The starter's `seed:emdash` script runs `emdash seed seed/seed.json`, then sets each post's publish date from `seed/dates.json` (a seed publishes every entry at the time it runs). `--reset` replaces an existing `data.db`.

To check the file only, run `npx emdash seed seed/seed.json --validate`. The admin is at `/_emdash/admin`.

## The API

```ts
import { emdashCollection, emdashComponents, emdashHooks, emdashRenderers, emdashSite } from "@astronomic/content/emdash";
```

### `emdashCollection<Entry, Query>(options)`

Builds one model collection from one EmDash collection.

| Option | What it does |
| --- | --- |
| `collection` | The EmDash collection slug. |
| `map(entry, h)` | Maps an EmDash entry into your entry type. May be async. Keep `slug: entry.id`, because `get(slug)` looks up the EmDash slug. |
| `where(q)` | EmDash `where` for a query: field values or taxonomy names. `undefined` values are dropped. |
| `orderBy(q)` | EmDash `orderBy`, e.g. `{ year: "desc", title: "asc" }`. |
| `filter(entry, q)` | Keeps mapped entries, for queries `where` cannot express (a reference field, for example). |
| `sort(a, b, q)` | Orders mapped entries in code, for orders `orderBy` cannot express (empty values last, for example). With `filter` or `sort`, `list` maps every entry that matches `where`, then filters, sorts and pages in memory, like the Markdown kit. Use it for small collections. |
| `taxonomies` | Taxonomies `h.terms()` reads. EmDash 1.1 folds terms into list queries; if it did not, the adapter loads each taxonomy in one batched query. |
| `mediaBaseUrl` | Must match `storage.baseUrl`. Default `/_emdash/api/media/file`. |
| `references` | Reference field slugs to load, e.g. `["client"]`. `h.reference()` and `h.references()` read them. |

Behavior:

- `list(q)` pages with `limit` and `offset`. `hasMore` is always a boolean (`false` without a `limit`).
- `get(slug)` returns `undefined` only when the entry does not exist.
- `slugs(q)` and `count(q)` run one unpaged query (EmDash has no slug-only or count query). With `filter` or `sort`, they map every match first, the same way as `list`, so `slugs()` comes back in the `sort` order.
- Every call forwards EmDash's cache hint to Astro's route cache.
- When EmDash returns an error, the call throws. An outage never looks like empty content or a 404.

The helpers `h` passed to `map`:

| Helper | Returns |
| --- | --- |
| `h.richText(value)` | `{ format: "portable-text", value }` |
| `h.image(value)` | A `ContentImage` with `source: { kind: "emdash", value }`, or `undefined` |
| `h.excerpt(textOrPortableText, max = 160)` | Plain text cut at a word boundary, or `undefined` |
| `h.terms(taxonomy)` | `{ slug, label }[]`, sorted by label |
| `h.edit({ modelField: "sourceField" })` | Visual-editing attributes per model field, as plain objects. Spread one: `<h1 {...post.edit?.title}>` |
| `h.ref()` | `{ source: "emdash", collection, id }` for page hooks |
| `h.seo()` | SEO panel values (the panel's own bare title, unset when the panel has none, as Markdown gives it, so the layout adds ` — Site`; description, image, canonical). Only in `get` on a request; otherwise `undefined` |
| `h.reference(field)` | The first target of a field named in `references` (an `EmDashEntry`), or `undefined` |
| `h.references(field)` | Every target of a field named in `references`, in the editor's order |
| `h.ctx` | The request context `map` runs in. Pass it to nested collection calls, e.g. `projects.get(slug, h.ctx)`, so their cache hints reach the route cache |

### References

EmDash 1.1 stores a `reference` field as links in a relation, not as a value on the entry. So `e.data.client` is empty; read the target with `h.reference("client")`:

```ts
const projects = emdashCollection<Project>({
	collection: "projects",
	references: ["client"],
	map: (e, h) => {
		const client = h.reference("client");
		return { slug: e.id, title: e.data.title, client: client && { slug: client.id, name: client.data.name } };
	},
});
```

- `get(slug)` passes `references` to `getEmDashEntry`, so the targets come with the entry in one call.
- `list()` loads the targets per entry, all at the same time: one `getEmDashEntry(collection, slug, { references })` per entry. EmDash 1.1 cannot batch references for a list: `getEmDashCollection` has no `references` option, and it refuses reference fields in `where` and `orderBy`. `getEmDashEntry` uses EmDash's object cache and returns a cache hint that covers the targets, and the kit forwards it. If a later EmDash adds a batched list option, only this kit changes.
- Each field returns at most EmDash's page limit: 50 targets. The kit asks for the first page only (`references: { field: true }`), so a field with more than 50 targets is cut at 50.
- A missing, deleted (trashed) or unpublished target is left out: `h.reference()` gives `undefined`, `h.references()` skips it. Nothing throws. A backend error still throws.
- Targets come without taxonomy terms or bylines (EmDash does not load them for references).
- Reference fields cannot be used inside repeaters or blocks in EmDash 1.1. Store slugs there and check them in your conformance tests.
- A reference field cannot filter a list. To list "testimonials for a project", list them and filter in memory, or store the filter value in a plain field.

### `emdashSite(options?)`

Settings (empty values are left `undefined`, so the product's defaults apply), menus and taxonomies. Pass `search: { collections, href(collection, slug) }` to add search. Add `limit` to change how many hits it returns (EmDash's default is 20).

### `emdashRenderers`, `emdashHooks`, `emdashComponents`

- `emdashRenderers`: Portable Text (`RichText.astro`) and EmDash media (`Image.astro`, which renders `image.source.value`).
- `emdashHooks`: `Head`, `BodyStart`, `BodyEnd`. They add EmDash's page contributions: plugin metadata and fragments, JSON-LD, the Twitter card, `og:type`, `og:url`, robots, verification tags and the favicon. The product layout lists the tags it rendered in `page.baseMeta` (e.g. `["description", "canonical", "og:title", "og:site_name"]`), and `Head` removes exactly those from EmDash's output. Everything else EmDash renders stays, so a page where the layout has no image still gets EmDash's og:image (the editor's, or the site default). Hooks only use `page.ref` when its `source` is `"emdash"`.

  EmDash 1.1 has no option to skip its base SEO tags (`EmDashHead` always renders them; `createPublicPageContext` has no switch), so `WithoutBaseMeta.astro` filters the rendered HTML. It parses each `<meta>`/`<link>` tag's attributes, so attribute order and quoting do not matter, but it depends on EmDash emitting these as `<meta name|property=...>` and `<link rel="canonical">`. Check it when you upgrade EmDash.

  EmDash's own site JSON-LD block (its `primary` WebSite) is off: the page context passes no site name (`page-context.ts`), and EmDash adds that block only with one. The theme's `SeoHead` renders the page's JSON-LD instead, and drops it on noindex pages. JSON-LD blocks from plugins still render. The page context keeps `siteUrl`. Check this again when you upgrade EmDash.
- `emdashComponents`: `WidgetArea` (props `{ name }`), managed in the admin.

### Member access: `emdashAccess()`

For a model with gated collections (see the content README, "Access"):

- EmDash indexes full-text search per field, not per entry: a body field marked searchable is indexed for members posts too, and its snippets come from the matched text. The guard below keeps those results from anonymous callers; the theme's own request search is filtered by `withAccess`.
- A locked page's `PageMeta` has `locked: true` and no `ref`. The hooks then give EmDash a `custom` page with no entry identity, so `EmDashHead` does not reload the entry's SEO panel and plugins, JSON-LD and fragments never see the entry.
- Every page context carries `siteUrl` from `publicOrigin()` (`EMDASH_SITE_URL`, `SITE_URL`, then `site`; a production server skips a placeholder `site` for the request's origin), so EmDash's WebSite JSON-LD names the public origin, not the request's (internal behind a proxy).
- EmDash's `/_emdash/api/search` and `/_emdash/api/search/suggest` are public, and its full-text index is per field: a searchable body field is indexed for members posts too. Add the guard in `emdash.setup.mjs`, next to `emdash()`:

  ```js
  import { emdashAccess } from "@astronomic/content/emdash/access";
  // integrations: [emdash({ ... }), emdashAccess({ collections: ["posts"] })]
  ```

  Name EmDash's collection slugs (the guard sees EmDash's names, not the model's). It answers `403` (`private, no-store`) to a `GET` or `HEAD` of either endpoint whose search could reach a gated collection: no `collections` param (EmDash then searches every collection), one that names a gated collection (names trimmed, compared without case), or a repeated `collections` param (EmDash reads the last one, and a blank one means every collection). Every path under `/_emdash/api/search` gets the same check, compared decoded, in lower case and with doubled or trailing slashes removed (a path that cannot be decoded is refused). Outside `/suggest`, a signed-in user with role 20 or more (contributor, `content:read_drafts`) may search everything. `/suggest` resolves no user, so it never reaches a gated collection.

## Customize

Change the mapping in `src/content/sources/emdash.ts`. For example, read posts from an `articles` collection with a `headline` field:

```ts
const posts = emdashCollection<Post, PostQuery>({
	collection: "articles",
	taxonomies: ["topic"],
	where: (q) => ({ topic: q.tag }),
	map: async (e, h) => ({
		slug: e.id,
		title: e.data.headline,
		body: h.richText(e.data.body),
		tags: h.terms("topic"),
		categories: [],
		edit: h.edit({ title: "headline", body: "body" }),
		// ...
	}),
});
```

If your storage serves media elsewhere, pass `mediaBaseUrl` to each collection and to `emdashSite()`, and change `storage.baseUrl` in `emdash.setup.mjs` to match.

To change a part of the finished adapter, use `extend` and `remove` from the core. Name your model, so overrides are checked against it:

```ts
import { extend, remove } from "@astronomic/content";
import type { Model } from "../model";
import base from "./emdash";

export default extend<Model>()(base, {
	renderers: { richText: { "portable-text": MyPortableText } },
	hooks: { BodyStart: remove },
});
```

To mix sources, use `compose` and `from`. Collections come from `base` unless a part replaces them; the part's renderers come along:

```ts
import { compose, from } from "@astronomic/content";
import type { Model } from "../model";
import emdash from "./emdash";
import markdown from "./markdown";

export default compose<Model>()({
	base: markdown,
	parts: [from(emdash, ["projects"])],
});
```

Learnings: EmDash's `entry.edit` is a proxy that only answers property reads, so `h.edit()` reads each field into a plain object. `getSeoMeta`'s `title` adds the site title when given one; `h.seo()` returns only the SEO panel's own bare title (EmDash's `ogTitle` falls back to the entry title, which would hide a page's computed title), so it matches Markdown's explicit `seo.title`, pages pass `seo.title ?? title`, and the layout adds the site name to `<title>` once.
