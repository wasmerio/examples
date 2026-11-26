/**
 * Injected only by the content tests (CONTENT_CONFORMANCE=1). Not part of normal builds. Returns every collection's
 * mapped data in a normalized form, so `pnpm test:parity` can compare sources field by field: each list, each entry
 * through `get(slug)`, `slugs()` and `count()`, the filtered queries the pages run (posts by category, tag and
 * series, paged and in each order; featured projects), the uses groups, and the site's settings (without
 * `sampleContent`, which only allows placeholders), menus and taxonomies, and each public page's share card input
 * (`cards`: its title, label and site name, and the look; from publicPages). The normalized form is theme-core's
 * (`normalizeSnapshot`).
 */
import { normalizeSnapshot, type SnapshotCollection, snapshotCollections, snapshotList } from "@astronomic/theme-core/conformance";
import type { APIRoute } from "astro";
import { cardInput } from "../share-card";
import { publicPages } from "../utils/public-pages";
import { siteSettings } from "../utils/setup";
import { groupUses } from "./rules";
import type { UsesItem } from "./model";
import { useContent } from "./index";

type Obj = Record<string, unknown>;
const TAXONOMIES = ["category", "tag", "series"];
const MENUS = ["primary", "footer"];

export const GET: APIRoute = async () => {
	const ctx = { cache() {} };
	const adapter = useContent().adapter;
	const cols = adapter.collections as unknown as Record<string, SnapshotCollection>;
	const { collections, entries, slugs } = await snapshotCollections(cols, ctx);

	const list = snapshotList(cols, ctx);
	const taxonomies = Object.fromEntries(await Promise.all(TAXONOMIES.map(async (t) => [t, (await adapter.taxonomies?.list(t, ctx)) ?? []] as const)));
	const queries: Obj = {
		"projects.featured": await list("projects", { featured: true }),
		"projects.featured.first3": await list("projects", { featured: true, limit: 3 }),
		"posts.page1": await list("posts", { limit: 4 }),
		"posts.page2": await list("posts", { limit: 4, offset: 4 }),
		"posts.date-asc": await list("posts", { sort: "date-asc" }),
		"posts.title": await list("posts", { sort: "title" }),
		"uses.groups": normalizeSnapshot(groupUses((await adapter.collections.uses.list(undefined, ctx)).items as UsesItem[]).map((g) => ({ group: g.group, items: g.items.map((i) => i.slug) }))),
	};
	for (const [name, key] of [
		["category", "category"],
		["tag", "tag"],
		["series", "series"],
	] as const) {
		for (const t of taxonomies[name]) {
			queries[`posts.${key}.${t.slug}`] = await list("posts", { [key]: t.slug });
			queries[`posts.${key}.${t.slug}.count`] = await cols.posts.count?.({ [key]: t.slug }, ctx);
		}
	}

	const { sampleContent: _sample, ...settings } = (await adapter.settings?.get(ctx)) ?? {};
	const site = {
		settings: normalizeSnapshot(settings),
		menus: Object.fromEntries(await Promise.all(MENUS.map(async (m) => [m, normalizeSnapshot((await adapter.menus?.get(m, ctx)) ?? [])]))),
		taxonomies: normalizeSnapshot(taxonomies),
	};
	const shared = await siteSettings(useContent());
	const cards = (await publicPages()).filter((p) => p.card).map((page) => ({ path: page.path, ...cardInput(page, shared) }));
	return Response.json({ adapter: adapter.name, collections, entries, slugs, queries, site, cards });
};
