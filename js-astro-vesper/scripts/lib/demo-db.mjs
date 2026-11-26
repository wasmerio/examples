/**
 * The demo database: seed/seed.json (schema and demo content) loaded into a SQLite file, with the demo images.
 *
 * EmDash seeds only download `$media` from public URLs, and the demo images live in content/media/ (shared with the
 * Markdown source), so seed.json holds ready media values that point at `uploads/demo/...`. `seedDemo(db)`:
 *   1. copies content/media/** to uploads/demo/** (the storage keys seed.json uses),
 *   2. runs `emdash seed seed/seed.json` into `db`,
 *   3. adds each demo image to the media library,
 *   4. sets the posts' publish dates from seed/dates.json (EmDash would use the time of seeding),
 *   5. writes the SEO panel's values from seed/seo.json (a seed file has no place for them), so the EmDash demo's
 *      head matches the Markdown entries' `seo:` blocks.
 *
 * Steps 3 to 5 write EmDash's internal tables directly: `media`, `published_at`/`created_at` in `ec_posts`, and
 * `_emdash_seo`.
 * Written for EmDash 1.1.0, checked against 1.4.0; a later EmDash may change these tables, so check this file when you upgrade. Needs
 * Node 22.5+ (`node:sqlite`).
 *
 * `useFreshDemoDatabase()` is for the test runners: it seeds a new database in a temp folder and points EmDash at it
 * (EMDASH_DATABASE_URL, which the builds and servers inherit), so a run never reads an older ./data.db. The folder
 * is removed when the process exits.
 *
 * `freshFixtures(config)` does the same for a test config with test-only content (`fixtures`): the fresh database also
 * gets the fixtures' seed.json and seo.json, and the config it returns names a copy of the fixtures without them (only
 * their Markdown and images). The test harness copies ./data.db for a fixtures folder that has a seed.json, which
 * would bring back an older database; with the copy, it places the Markdown files and leaves EmDash on the fresh one.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("../../", import.meta.url));

/** Seed the demo content into the SQLite file `db` (which must not hold content yet). Throws on failure. */
export function seedDemo(db, { quiet = false } = {}) {
	const uploads = join(cwd, "uploads");
	// 1. Demo images, at the storage keys seed.json uses ("demo/<path under content/media>").
	cpSync(join(cwd, "content/media"), join(uploads, "demo"), { recursive: true });

	// 2. Schema and content.
	const bin = join(cwd, "node_modules/.bin/emdash");
	const seeded = spawnSync(bin, ["seed", "seed/seed.json", "--database", db, "--uploads-dir", uploads], {
		cwd,
		stdio: quiet ? ["ignore", "ignore", "inherit"] : "inherit",
	});
	if (seeded.status !== 0) throw new Error(`emdash seed failed (exit ${seeded.status ?? "signal"}).`);

	// 3. Media library rows for the images the content uses.
	const seed = JSON.parse(readFileSync(join(cwd, "seed/seed.json"), "utf8"));
	const media = new Map();
	(function walk(value) {
		if (Array.isArray(value)) return value.forEach(walk);
		if (!value || typeof value !== "object") return;
		if (value.provider === "local" && typeof value.meta?.storageKey === "string") media.set(value.id, value);
		Object.values(value).forEach(walk);
	})(seed.content);

	const sqlite = new DatabaseSync(db);
	try {
		const insert = sqlite.prepare(
			`INSERT OR IGNORE INTO media (id, filename, mime_type, size, width, height, alt, storage_key, status, created_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ready', ?)`,
		);
		const now = new Date().toISOString();
		for (const m of media.values()) {
			const file = join(uploads, m.meta.storageKey);
			if (!existsSync(file)) throw new Error(`Missing demo image: ${m.meta.storageKey}`);
			insert.run(m.id, m.filename, m.mimeType, statSync(file).size, m.width ?? null, m.height ?? null, m.alt ?? null, m.meta.storageKey, now);
		}

		// 4. Publish dates.
		const dates = JSON.parse(readFileSync(join(cwd, "seed/dates.json"), "utf8"));
		const setDate = sqlite.prepare("UPDATE ec_posts SET published_at = ?, created_at = ? WHERE slug = ?");
		for (const [slug, date] of Object.entries(dates)) setDate.run(date, date, slug);

		// 5. SEO.
		writeSeo(sqlite, join(cwd, "seed/seo.json"));
		return { media: media.size, dates: Object.keys(dates).length };
	} finally {
		sqlite.close();
	}
}

/** Seed a new demo database in a temp folder and point EmDash at it for this process and its children. */
export function useFreshDemoDatabase() {
	const dir = mkdtempSync(join(tmpdir(), "vesper-demo-db-"));
	process.on("exit", () => rmSync(dir, { recursive: true, force: true }));
	const db = join(dir, "data.db");
	console.log(`Seeding a fresh demo database (${db}) from seed/seed.json`);
	seedDemo(db, { quiet: true });
	process.env.EMDASH_DATABASE_URL = `file:${db}`;
	return db;
}

/**
 * The SEO rows of `file` (`{ collection: { slug: { title, description, image, canonical, noIndex } } }`; `image` is a
 * media storage key) written to EmDash's SEO table. Every entry must exist. No file: nothing to write.
 */
function writeSeo(sqlite, file) {
	if (!existsSync(file)) return;
	const name = file.split(/[\\/]/).slice(-2).join("/");
	for (const [collection, entries] of Object.entries(JSON.parse(readFileSync(file, "utf8")))) {
		if (!/^[a-z][a-z0-9_]*$/.test(collection)) throw new Error(`${name}: bad collection name "${collection}"`);
		for (const [slug, f] of Object.entries(entries)) {
			const row = sqlite.prepare(`SELECT id FROM ec_${collection} WHERE slug = ?`).get(slug);
			if (!row) throw new Error(`${name}: no ${collection} entry "${slug}" after seeding`);
			sqlite
				.prepare(
					`INSERT OR REPLACE INTO _emdash_seo (collection, content_id, seo_title, seo_description, seo_image, seo_canonical, seo_no_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				)
				.run(collection, row.id, f.title ?? null, f.description ?? null, f.image ?? null, f.canonical ?? null, f.noIndex ? 1 : 0);
		}
	}
}

/**
 * The fixtures' seed.json, published.json (`{ collection: { slug: time } }`, as the test harness reads it) and seo.json
 * (`{ collection: { slug: { noIndex, title, ... } } }`) applied to `db`.
 */
function applyFixtures(db, dir, uploads) {
	const seed = join(dir, "seed.json");
	if (existsSync(seed)) {
		const bin = join(cwd, "node_modules/.bin/emdash");
		const seeded = spawnSync(bin, ["seed", seed, "--database", db, "--uploads-dir", uploads], { cwd, stdio: ["ignore", "ignore", "inherit"] });
		if (seeded.status !== 0) throw new Error(`emdash seed ${seed} failed (exit ${seeded.status ?? "signal"}).`);
	}
	const publishedFile = join(dir, "published.json");
	const seoFile = join(dir, "seo.json");
	if (!existsSync(publishedFile) && !existsSync(seoFile)) return;
	const sqlite = new DatabaseSync(db);
	try {
		if (existsSync(publishedFile)) {
			for (const [collection, entries] of Object.entries(JSON.parse(readFileSync(publishedFile, "utf8")))) {
				if (!/^[a-z][a-z0-9_]*$/.test(collection)) throw new Error(`published.json: bad collection name "${collection}"`);
				for (const [slug, when] of Object.entries(entries)) {
					if (typeof when !== "string" || Number.isNaN(Date.parse(when))) throw new Error(`published.json: ${collection} "${slug}": "${when}" is not a time`);
					const iso = new Date(when).toISOString();
					const done = sqlite.prepare(`UPDATE ec_${collection} SET published_at = ?, created_at = ? WHERE slug = ?`).run(iso, iso, slug);
					if (!done.changes) throw new Error(`published.json: no ${collection} entry "${slug}" after seeding`);
				}
			}
		}
		writeSeo(sqlite, seoFile);
	} finally {
		sqlite.close();
	}
}

/**
 * For a test config with `fixtures`: a fresh demo database with the fixtures applied (see the top of this file), and
 * the config with `fixtures` pointing at a copy of their Markdown and images only. Without a fixtures folder, a plain
 * fresh database and the config as it is.
 */
export function freshFixtures(config) {
	const db = useFreshDemoDatabase();
	const from = config.fixtures instanceof URL ? fileURLToPath(config.fixtures) : config.fixtures;
	if (!from || !existsSync(from)) return config;
	const dir = mkdtempSync(join(tmpdir(), "vesper-fixtures-"));
	process.on("exit", () => rmSync(dir, { recursive: true, force: true }));
	applyFixtures(db, from, join(dir, "uploads"));
	for (const entry of readdirSync(from, { withFileTypes: true })) {
		if (entry.isDirectory() && entry.name !== "storage") cpSync(join(from, entry.name), join(dir, "markdown", entry.name), { recursive: true });
	}
	return { ...config, fixtures: join(dir, "markdown") };
}
