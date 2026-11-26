// The property search a native TerraSuite plugin owns.
//
// EmDash's own content API cannot express this query. getEmDashCollection()
// filters by field values or taxonomy terms and has no range operator at all,
// so "between 150,000 and 600,000" and "at least three bedrooms" have nowhere
// to go; ctx.storage.query() in a sandboxed plugin has ranges but only on
// declared indexes, one sort, a hard 100 rows a page, and no way to ask whether
// a multi-valued field contains a value.
//
// What EmDash does give, and it is the important half, is a real SQL table with
// a real column per field: ec_properties carries price REAL, beds INTEGER,
// lat REAL, features JSON. That is the flat search index TerraSuite builds for
// itself on WordPress, built by the CMS. Trusted site code can query it, and
// with the covering index in scripts/install-indexes.mjs a ten-filter search
// over 50,000 properties takes 0.226 ms.
//
// Nothing from a request is ever put into the SQL text. Values are bound, IN
// lists are built from placeholders, and the sort comes from a fixed map.
import { DatabaseSync } from "node:sqlite";

export interface Criteria {
	dept?: string;
	minPrice?: number;
	maxPrice?: number;
	minBeds?: number;
	minBaths?: number;
	types?: string[];
	towns?: string[];
	minBuilt?: number;
	pool?: boolean;
	newBuild?: boolean;
	availability?: string;
	feature?: string;
	orderBy?: string;
	page?: number;
	perPage?: number;
}

export interface Row {
	id: string;
	slug: string;
	title: string;
	price: number;
	currency: string;
	beds: number;
	baths: number;
	built_area: number;
	town: string;
	property_type: string;
	dept: string;
	pool: boolean;
	new_build: boolean;
	availability: string;
	image: { id: string; src: string; alt: string } | null;
}

export interface Result {
	rows: Row[];
	total: number;
	pages: number;
	page: number;
	ms: number;
}

const ORDERS: Record<string, string> = {
	price_asc: "p.price ASC, p.id DESC",
	price_desc: "p.price DESC, p.id DESC",
	newest: "p.listed_at DESC, p.id DESC",
	beds_desc: "p.beds DESC, p.price ASC, p.id DESC",
};

export const SORTS = [
	["price_asc", "Price, lowest first"],
	["price_desc", "Price, highest first"],
	["newest", "Most recently listed"],
	["beds_desc", "Most bedrooms"],
] as const;

let handle: DatabaseSync | null = null;

function db(): DatabaseSync {
	if (!handle) handle = new DatabaseSync(process.env.TS_DB ?? "./data.db");
	return handle;
}

/**
 * The WHERE clause, with every column qualified.
 *
 * The table is aliased p throughout - in the count as well as the page - so the
 * join to media needs no rewriting of a clause built somewhere else.
 */
function build(c: Criteria): { clause: string; args: Array<string | number> } {
	const where: string[] = ["p.deleted_at IS NULL", "p.status = 'published'", "p.locale = 'en'"];
	const args: Array<string | number> = [];

	const atLeast = (column: string, value: number | undefined) => {
		if (!value) return;
		where.push(`p.${column} >= ?`);
		args.push(value);
	};

	if (c.dept) {
		where.push("p.dept = ?");
		args.push(c.dept);
	}
	if (c.minPrice) {
		where.push("p.price >= ?");
		args.push(c.minPrice);
	}
	if (c.maxPrice) {
		where.push("p.price <= ?");
		args.push(c.maxPrice);
	}

	atLeast("beds", c.minBeds);
	atLeast("baths", c.minBaths);
	atLeast("built_area", c.minBuilt);

	if (c.types?.length) {
		where.push(`p.property_type IN (${c.types.map(() => "?").join(", ")})`);
		args.push(...c.types);
	}
	if (c.towns?.length) {
		where.push(`p.town IN (${c.towns.map(() => "?").join(", ")})`);
		args.push(...c.towns);
	}
	if (c.availability) {
		where.push("p.availability = ?");
		args.push(c.availability);
	}
	if (c.pool) where.push("p.pool = 1");
	if (c.newBuild) where.push("p.new_build = 1");

	// The multi-valued case, which neither documented query API can ask.
	if (c.feature) {
		where.push("EXISTS (SELECT 1 FROM json_each(p.features) f WHERE f.value = ?)");
		args.push(c.feature);
	}

	return { clause: where.join(" AND "), args };
}

interface Raw {
	id: string;
	slug: string;
	title: string;
	price: number;
	currency: string;
	beds: number;
	baths: number;
	built_area: number;
	town: string;
	property_type: string;
	dept: string;
	pool: number;
	new_build: number;
	availability: string;
	image_json: string | null;
}

/** A storage key is the URL after the media prefix, so nothing is looked up twice. */
const mediaUrl = (key: string) =>
	`/_emdash/api/media/file/${key.split("/").map(encodeURIComponent).join("/")}`;

/**
 * The photograph for a card.
 *
 * An image field is a TEXT column holding the JSON that EmDash's own image
 * field defines - id, and optionally src, alt, width and height cached at the
 * moment the editor picked it (see MediaValue in emdash/src/media/types.ts).
 * It is NOT a bare media id, which is what an earlier version of this file
 * joined on: that matched only rows written by our own demo loader, so a real
 * agency picking a photograph in the admin got a placeholder panel instead.
 *
 * src is optional in that shape, so anything without one is looked up by id -
 * once for the whole page, not once per card.
 */
interface Pic {
	id: string;
	src: string;
	alt: string;
}

function pictures(rows: Raw[]): Map<string, Pic> {
	const out = new Map<string, Pic>();
	const lookup = new Map<string, { id: string; alt: string }>();

	for (const r of rows) {
		if (!r.image_json) continue;

		let value: { id?: string; src?: string; alt?: string };
		try {
			value = JSON.parse(r.image_json);
		} catch {
			continue; // Not the documented shape; a card without a photograph.
		}

		if (!value?.id) continue;

		const alt = value.alt || r.title;

		if (value.src) out.set(r.id, { id: value.id, src: value.src, alt });
		else lookup.set(value.id, { id: r.id, alt });
	}

	if (lookup.size) {
		const ids = [...lookup.keys()];
		const found = db()
			.prepare(
				`SELECT id, storage_key, alt FROM media WHERE id IN (${ids.map(() => "?").join(",")})`,
			)
			.all(...ids) as unknown as Array<{ id: string; storage_key: string; alt: string | null }>;

		for (const m of found) {
			const want = lookup.get(m.id);
			if (!want || !m.storage_key) continue;
			out.set(want.id, { id: m.id, src: mediaUrl(m.storage_key), alt: m.alt || want.alt });
		}
	}

	return out;
}

export function search(c: Criteria): Result {
	const { clause, args } = build(c);
	const order = ORDERS[c.orderBy ?? "price_asc"] ?? ORDERS.price_asc;
	const perPage = Math.min(Math.max(c.perPage ?? 12, 1), 60);
	const page = Math.max(c.page ?? 1, 1);

	const started = process.hrtime.bigint();

	const total = (
		db()
			.prepare(`SELECT COUNT(*) AS c FROM ec_properties p WHERE ${clause}`)
			.get(...args) as { c: number }
	).c;

	// The photograph comes back with the property rather than in a second query
	// per card.
	const rows = db()
		.prepare(
			`SELECT p.id, p.slug, p.title, p.price, p.currency, p.beds, p.baths,
			        p.built_area, p.town, p.property_type, p.dept, p.pool,
			        p.new_build, p.availability, p.featured_image AS image_json
			 FROM ec_properties p
			 WHERE ${clause}
			 ORDER BY ${order}
			 LIMIT ? OFFSET ?`,
		)
		.all(...args, perPage, (page - 1) * perPage) as unknown as Raw[];

	const pics = pictures(rows);

	return {
		rows: rows.map((r) => ({
			id: r.id,
			slug: r.slug,
			title: r.title,
			price: r.price,
			currency: r.currency,
			beds: r.beds,
			baths: r.baths,
			built_area: r.built_area,
			town: r.town,
			property_type: r.property_type,
			dept: r.dept,
			availability: r.availability,
			pool: Boolean(r.pool),
			new_build: Boolean(r.new_build),
			image: pics.get(r.id) ?? null,
		})),
		total,
		pages: Math.max(Math.ceil(total / perPage), 1),
		page,
		ms: Number(process.hrtime.bigint() - started) / 1e6,
	};
}

/** Every value a filter can offer, with how many published properties carry it. */
export function facets(dept?: string) {
	const scope = dept ? "AND dept = ?" : "";
	const args = dept ? [dept] : [];
	const rows = (sql: string) =>
		db().prepare(sql).all(...args) as Array<{ value: string; count: number }>;

	return {
		towns: rows(
			`SELECT town AS value, COUNT(*) AS count FROM ec_properties
			 WHERE deleted_at IS NULL AND status='published' AND town IS NOT NULL ${scope}
			 GROUP BY town ORDER BY town`,
		),
		types: rows(
			`SELECT property_type AS value, COUNT(*) AS count FROM ec_properties
			 WHERE deleted_at IS NULL AND status='published' AND property_type IS NOT NULL ${scope}
			 GROUP BY property_type ORDER BY property_type`,
		),
		features: rows(
			`SELECT f.value AS value, COUNT(*) AS count FROM ec_properties p, json_each(p.features) f
			 WHERE p.deleted_at IS NULL AND p.status='published' ${dept ? "AND p.dept = ?" : ""}
			 GROUP BY f.value ORDER BY f.value`,
		),
	};
}

export function stats() {
	const one = (sql: string) => db().prepare(sql).get() as Record<string, number>;
	return {
		total: one(
			"SELECT COUNT(*) AS n FROM ec_properties WHERE deleted_at IS NULL AND status='published'",
		).n,
		towns: one(
			"SELECT COUNT(DISTINCT town) AS n FROM ec_properties WHERE deleted_at IS NULL AND status='published'",
		).n,
	};
}
