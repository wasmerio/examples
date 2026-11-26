# Markdown adapter

Reads Markdown (and MDX) files with Astro content collections. Content loads at build time, so pages prerender.

The adapter does not know your model. It gives you factories. Your product maps each collection into its own types in `src/content/sources/markdown.ts`.

## What it reads

Collections are defined in `src/content.config.ts`. The data lives in `content/` at the project root.

```
content/
  posts/*.md        title, date, excerpt?, image?, imageAlt?, tags[], categories[], draft?
  pages/*.md        title, draft?
  projects/*.md     title, client?, year?, summary?, image?, imageAlt?, services[], featured?, draft?
  taxonomies.json   { "tag": [{ "slug", "label" }], "category": [...], "service": [...] }
  menus.json        { "primary": [{ "label", "href", "target?", "children?" }] }
  site.json         { "title", "tagline?", "logo?", "logoAlt?" }
```

The file name is the entry id: `content/posts/welcome.md` has id `welcome`.

- Term fields (`tags`, `services`, ...) hold slugs. Labels come from `taxonomies.json`. An unknown slug uses the slug as its label.
- `image` is a path relative to the Markdown file, e.g. `./cover.jpg`. Astro optimizes it.
- `draft: true` hides an entry in production builds. It still shows in `astro dev`.

## The API

```ts
markdownKit({ settings?, menus?, taxonomies? })    // → { collection, site, renderers }, one shared config
markdownCollection<Entry, Query>({ collection, map, filter?, sort?, include?, taxonomies? })
markdownSite({ settings?, menus?, taxonomies? })   // defaults: "site", "menus", "taxonomies"
markdownRenderers                                  // RichText for "markdown", Image for "astro-image"
```

Use `markdownKit`. It passes the same `taxonomies` collection to every `md.collection(...)` (for `h.terms()`) and to `md.site` (for `taxonomies.list()`). If you call `markdownCollection` and `markdownSite` directly, their `taxonomies` options must match, or term labels and term pages disagree.

`markdownCollection` maps every entry, then filters, sorts and pages in memory. `get(slug)` looks up the mapped `slug`, so a `map` that changes the slug keeps URLs working. Errors are not caught.

In production the mapped list (and the taxonomy lookup) is built once and reused by every `list`, `get`, `slugs` and `count` call, so enumerating routes maps each file once per build. In `astro dev` nothing is cached, so file edits show up. Entries returned in production are shared: do not mutate them.

`map(entry, h)` gets the raw entry and helpers:

- `h.richText(entry)`: the body, for the `RichText` renderer.
- `h.image(img, alt)`: a local image as a `ContentImage`.
- `h.excerpt(entry, max = 160)`: plain text from the body.
- `h.terms(slugs, taxonomy)`: terms with labels, sorted by label.
- `h.lookup(target, ref)`: the entry of another collection that `ref` points at, or `undefined`. `ref` is a slug or the `{ collection, id }` value of Astro's `reference()`. The target's `list()` runs once per mapping pass (dev and production), so N entries cost one load, not N.

## References

Store a reference with Astro's `reference()` in `src/content.config.ts`, and resolve it in `map` with `h.lookup`:

```ts
// src/content.config.ts
projects: defineCollection({ loader: glob(...), schema: z.object({ client: reference("clients").optional() }) }),

// src/content/sources/markdown.ts
const clients = md.collection<Client>({ collection: "clients", map: (e) => ({ slug: e.id, name: e.data.name }) });
const projects = md.collection<Project>({
	collection: "projects",
	map: async (e, h) => {
		const client = await h.lookup(clients, e.data.client);
		return { slug: e.id, title: e.data.title, client: client && { slug: client.slug, name: client.name } };
	},
});
```

A missing target gives `undefined`. Astro already fails the build when a `reference()` points at an entry that does not exist; a product conformance check can also report it.

## Map a collection

```ts
import { markdownKit } from "@astronomic/content/markdown";
import { defineAdapter } from "@astronomic/content";
import type { Model, Project, ProjectQuery, Settings } from "../model";

const md = markdownKit();

const projects = md.collection<Project, ProjectQuery>({
	collection: "projects",
	map: async (e, h) => ({
		slug: e.id,
		title: e.data.title,
		body: h.richText(e),
		services: await h.terms(e.data.services, "service"),
		featured: e.data.featured,
	}),
	filter: (p, q) => q.featured === undefined || p.featured === q.featured,
	sort: (a, b) => a.title.localeCompare(b.title),
});

export default defineAdapter<Model, Settings>()({
	name: "markdown",
	collections: { posts, pages, projects },
	...md.site,
	renderers: md.renderers,
});
```

To read another Astro collection, define it in `src/content.config.ts` and pass its name as `collection`.

## Customize

Change one part with `extend`. It is checked against the model, so pass the model type first. Only optional parts can be removed.

```ts
// src/content/sources/my-site.ts
import { extend, remove } from "@astronomic/content";
import type { Model, Settings } from "../model";
import base from "./markdown";
import MyRichText from "../../components/MyRichText.astro";

export default extend<Model, Settings>()(base, {
	renderers: { richText: { markdown: MyRichText } },
	menus: remove,
});
```

Collection methods can be replaced one at a time: `collections: { posts: { list: myList } }`. To change fields, write your own `map`. To show drafts everywhere, pass `include: () => true`.

## Mix sources

Take some collections from another source with `compose` and `from`. Settings, menus and taxonomies come from `base`. Each part brings its own renderers.

```ts
// src/content/sources/mixed.ts
import { compose, from } from "@astronomic/content";
import type { Model, Settings } from "../model";
import emdash from "./emdash";
import markdown from "./markdown";

export default compose<Model, Settings>()({
	base: markdown,
	parts: [from(emdash, ["projects"])],
});
```

The mixed source needs whatever the other source needs. EmDash, for example, needs server output and its own setup.

## Setup

No setup file is needed. The output is static by default, and no server adapter is required.

MDX is optional. Run `pnpm astro add mdx` to add `@astrojs/mdx`. Then `.mdx` files load like `.md` files.

## Not supported

No search, no head/body hooks, no widget areas. Pages hide those parts.

Search needs server output (a static build has no request to search with), so a Markdown site has no header search.
