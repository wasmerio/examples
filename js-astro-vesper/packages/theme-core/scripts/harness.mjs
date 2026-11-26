/**
 * Shared helpers for the content test runners: build a source into its own
 * out dir, serve it (static files or the Node server), fetch pages, and clean
 * up children and temp dirs on exit or Ctrl-C. Never touches source files.
 *
 * `createHarness({ root })` gives the helpers that work in a project (build,
 * serve, fetch). The pure helpers (page text, head checks, JSON diff) are
 * module exports. Plain `.mjs`, no `.ts` imports: it runs under Node from any
 * install.
 *
 * Test-only content (`fixtures`): when the folder exists (it is not in a
 * released copy), each build gets its Markdown files, copied into
 * `content/<collection>/` as `<name>.fixture.md`, and the images next to them
 * as `<name>.fixture.<ext>` (a fixture's front matter names its image that
 * way: `image: ./<name>.fixture.webp`), all removed after the build, and,
 * when the project has EmDash and a data.db, a temp copy of data.db with
 * the folder's `seed.json` applied, the SEO rows of its `seo.json` written and
 * the publish times of its `published.json` set (`{ collection: { slug: ISO
 * time } }`; a seed cannot set them, it publishes at the time it runs).
 * The build and the server use the copy through EMDASH_DATABASE_URL. The
 * files of the folder's `storage/` (the media its seed.json points at) are
 * copied into the project's `uploads/` (EmDash's local storage) for the run
 * and removed by `cleanup()`. The project's own content/, data.db and
 * uploads are never changed.
 *
 * `hostedDemo`: builds and servers run as the hosted demo's copy, in any copy. A theme's `hostedDemo()` looks for the
 * `src/demo-brand` folder, which a released copy does not have. There a static build at no address is a demo and a
 * production server is live, so the sources differ by design; a test that compares them needs both to be one thing.
 * When the folder is missing, the harness makes an empty one for the run and removes it at the end, on an error or
 * Ctrl-C too. A run stopped hard can leave it: delete an empty `src/demo-brand`, or that copy's site counts as a demo.
 * No setting or environment variable does this, so nothing in a site's own code or its `.env` can turn it on.
 */
import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmdirSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { connect } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

// One registry for every harness in the process, so one signal handler stops them all.
const children = new Set();
const servers = new Set();
const tempDirs = new Set();
/** Fixture Markdown and image files placed in a project's content/ for one build. */
const placedFixtures = new Set();
/** Fixture media placed in a project's uploads/ for the run, and the folders made for them (deepest last). */
const placedUploads = new Set();
const madeDirs = [];
/** The empty demo markers made for this run (see `hostedDemo` at the top of this file). */
const placedMarkers = new Set();

function removePlacedMarkers() {
	for (const dir of placedMarkers) rmSync(dir, { recursive: true, force: true });
	placedMarkers.clear();
}

function removePlacedFixtures() {
	for (const file of placedFixtures) rmSync(file, { force: true });
	placedFixtures.clear();
}

function removePlacedUploads() {
	for (const file of placedUploads) rmSync(file, { force: true });
	placedUploads.clear();
	// Only the folders the harness made, and only when nothing else was put in them.
	for (const dir of madeDirs.reverse()) {
		try {
			rmdirSync(dir);
		} catch {}
	}
	madeDirs.length = 0;
}

/** Kill children, close servers, remove temp dirs and placed fixture files. Safe to call twice. */
export function cleanup() {
	removePlacedFixtures();
	removePlacedUploads();
	removePlacedMarkers();
	for (const child of children) child.kill("SIGKILL");
	children.clear();
	for (const server of servers) server.close();
	servers.clear();
	for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
	tempDirs.clear();
}

let signalsSet = false;
function setSignals() {
	if (signalsSet) return;
	signalsSet = true;
	process.on("exit", removePlacedMarkers);
	for (const sig of ["SIGINT", "SIGTERM"]) {
		process.on(sig, () => {
			console.error(`\n${sig}: stopping servers and removing temp dirs`);
			cleanup();
			process.exit(sig === "SIGTERM" ? 143 : 130);
		});
	}
}

/** True if something accepts connections on the port. */
export function portInUse(port) {
	return new Promise((resolve) => {
		const socket = connect(port, "127.0.0.1");
		socket.once("connect", () => {
			socket.destroy();
			resolve(true);
		});
		socket.once("error", () => resolve(false));
	});
}

/**
 * The project helpers.
 *
 * - `root`: the project root (absolute path). Builds, temp dirs and the Node server run there.
 * - `port`: where builds are served. Default CONTENT_TEST_PORT, else 4399.
 * - `paritySkip`: what `pageText` leaves out of <main> (see `pageText`). Default `data-parity-skip`.
 * - `fixtures`: a folder (URL or path) of test-only content (see the top of this file). Skipped when it does not exist.
 * - `hostedDemo`: build and serve as the hosted demo's copy, in any copy (see the top of this file).
 */
export function createHarness({ root, port = Number(process.env.CONTENT_TEST_PORT ?? 4399), paritySkip = "data-parity-skip", fixtures, hostedDemo = false }) {
	setSignals();
	const cwd = root;
	const base = `http://127.0.0.1:${port}`;
	const fixtureDir = fixtures ? (fixtures instanceof URL ? fileURLToPath(fixtures) : fixtures) : undefined;
	const useFixtures = !!fixtureDir && existsSync(fixtureDir);
	/** Makes the empty demo marker if this copy has no marker. Each build and server asks, as `cleanup()` removes it. */
	function placeMarker() {
		const marker = join(cwd, "src/demo-brand");
		if (!hostedDemo || placedMarkers.has(marker)) return;
		if (existsSync(marker)) {
			// An empty folder is one a killed run left behind. git cannot show it, and it would make any later build a demo.
			if (readdirSync(marker).length === 0) throw new Error(`${marker} is empty: a killed test run left it. Delete it and run again.`);
			return;
		}
		mkdirSync(marker);
		placedMarkers.add(marker);
	}
	/** The fixture database's path; null when there is none to make; undefined until first needed. */
	let fixtureDb;

	/** Copies each `<collection>/<name>.md` (and `<name>.<image ext>`) of the fixtures into content/<collection>/<name>.fixture.<ext>. */
	function placeFixtureMarkdown() {
		for (const dir of readdirSync(fixtureDir, { withFileTypes: true })) {
			if (!dir.isDirectory() || dir.name === "storage") continue;
			for (const name of readdirSync(join(fixtureDir, dir.name))) {
				const ext = /\.(md|avif|gif|jpe?g|png|svg|webp)$/i.exec(name)?.[0];
				if (!ext) continue;
				const dest = join(cwd, "content", dir.name, `${name.slice(0, -ext.length)}.fixture${ext}`);
				if (existsSync(dest)) throw new Error(`Fixture ${dest} is already there: remove it (a run was stopped hard).`);
				copyFileSync(join(fixtureDir, dir.name, name), dest);
				placedFixtures.add(dest);
			}
		}
	}

	/** Copies each file of the fixtures' `storage/` into the project's uploads/ (EmDash's local storage), at the same path. Not named `uploads/`: products ignore that name in git. */
	function placeFixtureUploads() {
		const from = join(fixtureDir, "storage");
		if (!existsSync(from)) return;
		const mkdirs = (dir) => {
			if (existsSync(dir)) return;
			mkdirs(dirname(dir));
			mkdirSync(dir);
			madeDirs.push(dir);
		};
		for (const entry of readdirSync(from, { recursive: true, withFileTypes: true })) {
			if (!entry.isFile()) continue;
			const src = join(entry.parentPath, entry.name);
			const dest = join(cwd, "uploads", relative(from, src));
			if (existsSync(dest)) throw new Error(`Fixture upload ${dest} is already there: remove it (a run was stopped hard).`);
			mkdirs(dirname(dest));
			copyFileSync(src, dest);
			placedUploads.add(dest);
		}
	}

	/** A temp copy of data.db with the fixtures' seed.json, seo.json and published.json applied, or null. Made once per harness. */
	async function fixtureDatabase() {
		if (fixtureDb !== undefined) return fixtureDb;
		const seed = join(fixtureDir, "seed.json");
		const bin = join(cwd, "node_modules/.bin/emdash");
		const source = join(cwd, "data.db");
		if (!existsSync(seed) || !existsSync(bin) || !existsSync(source)) return (fixtureDb = null);
		const { DatabaseSync } = await import("node:sqlite");
		const dir = mkdtempSync(join(tmpdir(), "astronomic-fixture-db-"));
		tempDirs.add(dir);
		const db = join(dir, "data.db");
		// VACUUM INTO makes a consistent copy, WAL included, without writing to the project's data.db.
		const from = new DatabaseSync(source, { readOnly: true });
		from.exec(`VACUUM INTO '${db.replaceAll("'", "''")}'`);
		from.close();
		const seeded = spawnSync(bin, ["seed", seed, "--database", db, "--uploads-dir", join(dir, "uploads")], { cwd, stdio: "inherit" });
		if (seeded.status !== 0) throw new Error(`emdash seed ${seed} failed (exit ${seeded.status}).`);
		placeFixtureUploads();
		/** Each `[collection, slug, value, row id]` of a fixture JSON file (`{ collection: { slug: value } }`), checked against the seeded rows. */
		const fixtureRows = (to, file) => {
			const rows = [];
			for (const [collection, entries] of Object.entries(JSON.parse(readFileSync(join(fixtureDir, file), "utf8")))) {
				if (!/^[a-z][a-z0-9_]*$/.test(collection)) throw new Error(`${file}: bad collection name "${collection}"`);
				for (const [slug, value] of Object.entries(entries)) {
					const row = to.prepare(`SELECT id FROM ec_${collection} WHERE slug = ?`).get(slug);
					if (!row) throw new Error(`${file}: no ${collection} entry "${slug}" after seeding`);
					rows.push([collection, slug, value, row.id]);
				}
			}
			return rows;
		};
		if (existsSync(join(fixtureDir, "published.json"))) {
			const to = new DatabaseSync(db);
			for (const [collection, slug, when, id] of fixtureRows(to, "published.json")) {
				if (typeof when !== "string" || Number.isNaN(Date.parse(when))) throw new Error(`published.json: ${collection} "${slug}": "${when}" is not a time`);
				to.prepare(`UPDATE ec_${collection} SET published_at = ? WHERE id = ?`).run(new Date(when).toISOString(), id);
			}
			to.close();
		}
		const seoFile = join(fixtureDir, "seo.json");
		if (existsSync(seoFile)) {
			const to = new DatabaseSync(db);
			for (const [collection, , fields, id] of fixtureRows(to, "seo.json"))
				to.prepare(
					`INSERT OR REPLACE INTO _emdash_seo (collection, content_id, seo_title, seo_description, seo_image, seo_canonical, seo_no_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				).run(collection, id, fields.title ?? null, fields.description ?? null, fields.image ?? null, fields.canonical ?? null, fields.noIndex ? 1 : 0);
			to.close();
		}
		return (fixtureDb = db);
	}

	/** Env that points EmDash at the fixture database, once it exists. */
	const fixtureEnv = () => (fixtureDb ? { EMDASH_DATABASE_URL: `file:${fixtureDb}` } : {});

	/** Register a dir to delete on cleanup. Returns its absolute path. */
	function tempDir(name) {
		const dir = join(cwd, name);
		tempDirs.add(dir);
		return dir;
	}

	/** Run a command; resolves to its exit code. Output streams to the terminal. */
	function run(cmd, args, env = {}) {
		return new Promise((resolve) => {
			const child = spawn(cmd, args, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
			children.add(child);
			child.on("exit", (code, signal) => {
				children.delete(child);
				resolve(code ?? (signal ? 1 : 0));
			});
		});
	}

	/** Each build's own SITE_URL, for its server. */
	const builtSites = new Map();

	/**
	 * `astro build --outDir <outDir>` with the given source (undefined = config default), with the fixtures when
	 * they exist. Returns the exit code.
	 */
	async function build(outDir, { source, env = {} } = {}) {
		rmSync(outDir, { recursive: true, force: true });
		builtSites.set(outDir, env.SITE_URL);
		placeMarker();
		const astro = join(cwd, "node_modules/astro/bin/astro.mjs");
		if (useFixtures) await fixtureDatabase();
		try {
			// Inside the try, so a half-placed set (one file already there) is removed too.
			if (useFixtures) placeFixtureMarkdown();
			return await run(process.execPath, [astro, "build", "--outDir", outDir], {
				CONTENT_CONFORMANCE: "1",
				...(source ? { CONTENT_SOURCE: source } : {}),
				...fixtureEnv(),
				...env,
			});
		} finally {
			removePlacedFixtures();
		}
	}

	/**
	 * Content types the static server sends, as a real host does: images, so a check can tell an image from any other
	 * file, and scripts, styles and fonts, which a browser refuses without one (a module script with no type does not
	 * run, so a page's external scripts, such as Form's once it is past Vite's inline limit, would never start).
	 */
	const CONTENT_TYPES = {
		".avif": "image/avif",
		".gif": "image/gif",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".png": "image/png",
		".svg": "image/svg+xml",
		".webp": "image/webp",
		".js": "text/javascript",
		".mjs": "text/javascript",
		".css": "text/css",
		".wasm": "application/wasm",
		".woff2": "font/woff2",
		".woff": "font/woff",
	};

	/** Minimal static file server for a static build (directory-format HTML); images, scripts, styles and fonts carry their content type. */
	function serveStatic(dir) {
		const read = (p) => {
			const file = normalize(join(dir, p));
			return file.startsWith(dir) && existsSync(file) ? readFileSync(file) : null;
		};
		const server = createServer((req, res) => {
			const path = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\//, "");
			const file = /\.\w+$/.test(path) ? read(path) : read(join(path, "index.html"));
			const type = CONTENT_TYPES[/\.\w+$/.exec(path)?.[0].toLowerCase()];
			if (file) res.writeHead(200, type ? { "Content-Type": type } : {}).end(file);
			else res.writeHead(404).end(read("404.html"));
		});
		server.listen(port, "127.0.0.1");
		servers.add(server);
		return { kind: "static", stop: () => (server.close(), servers.delete(server)) };
	}

	/** Serve a build: the Node server if it has one, else its static files. */
	async function serve(outDir) {
		if (await portInUse(port)) throw new Error(`Port ${port} is in use. Stop that server or set CONTENT_TEST_PORT.`);
		placeMarker();
		const entry = join(outDir, "server/entry.mjs");
		let handle;
		if (existsSync(entry)) {
			// EmDash reads data.db from the working directory, so run from the project root.
			const child = spawn(process.execPath, [entry], {
				cwd,
				// The checks read one fixed address. A server with no SITE_URL would use each request's instead (publicOrigin).
				env: { SITE_URL: builtSites.get(outDir) || "https://example.com", ...process.env, ...fixtureEnv(), PORT: String(port), HOST: "127.0.0.1" },
				stdio: ["ignore", "ignore", "inherit"],
			});
			children.add(child);
			child.on("exit", () => children.delete(child));
			handle = { kind: "server", stop: () => (child.kill("SIGKILL"), children.delete(child)) };
		} else {
			handle = serveStatic(outDir);
		}
		for (let i = 0; i < 120; i++) {
			try {
				await fetch(base);
				return handle;
			} catch {
				await new Promise((r) => setTimeout(r, 250));
			}
		}
		handle.stop();
		throw new Error(`Server did not start on ${base}`);
	}

	/** Fetch /_conformance.json. Returns { adapter, problems }; a fetch/parse failure is reported as a problem. */
	async function conformance() {
		try {
			const res = await fetch(`${base}/_conformance.json`);
			if (!res.ok) return { adapter: "?", problems: [`/_conformance.json returned ${res.status}`] };
			return await res.json();
		} catch (err) {
			return { adapter: "?", problems: [`/_conformance.json failed: ${err.message}`] };
		}
	}

	/** Fetch /_snapshot.json: every collection's mapped data, normalized. A failure is returned as `{ error }`. */
	async function snapshot() {
		try {
			const res = await fetch(`${base}/_snapshot.json`);
			if (!res.ok) return { error: `/_snapshot.json returned ${res.status}` };
			return await res.json();
		} catch (err) {
			return { error: `/_snapshot.json failed: ${err.message}` };
		}
	}

	const text = (html) => pageText(html, { skip: paritySkip });

	/** Fetch each path: { status, title, text }. */
	async function fetchPages(paths) {
		const out = {};
		for (const path of paths) {
			const res = await fetch(base + path, { redirect: "manual" });
			const html = await res.text();
			out[path] = { status: res.status, title: title(html), text: text(html) };
		}
		return out;
	}

	return {
		root,
		port,
		base,
		/** True when the fixtures folder exists, so each build has the test-only content. */
		fixturesLoaded: useFixtures,
		tempDir,
		run,
		build,
		serve,
		conformance,
		snapshot,
		fetchPages,
		cleanup,
		/** <main> as normalized text, with this harness's `paritySkip`. */
		pageText: text,
		/** Fetch one path from the served build: { status, html }. */
		get: (path) => getPage(base, path),
	};
}

/** Paths where two JSON values differ, e.g. "collections.projects[2].year: 2024 vs undefined". */
export function diffJson(a, b, path = "", out = []) {
	if (out.length >= 20) return out;
	const isObj = (v) => v && typeof v === "object";
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) out.push(`${path}: ${a.length} items vs ${b.length}`);
		for (let i = 0; i < Math.min(a.length, b.length); i++) diffJson(a[i], b[i], `${path}[${i}]`, out);
	} else if (isObj(a) && isObj(b) && !Array.isArray(a) && !Array.isArray(b)) {
		for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffJson(a[k], b[k], path ? `${path}.${k}` : k, out);
	} else if (JSON.stringify(a) !== JSON.stringify(b)) {
		out.push(`${path}: ${JSON.stringify(a)?.slice(0, 100)} vs ${JSON.stringify(b)?.slice(0, 100)}`);
	}
	return out;
}

export function printConformance({ adapter, problems }) {
	if (!problems.length) return console.log(`conformance (${adapter}): OK`);
	console.log(`conformance (${adapter}): ${problems.length} problem(s)`);
	for (const p of problems) console.log(`  - ${typeof p === "string" ? p : JSON.stringify(p)}`);
}

const NAMED = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
/** Decode one HTML entity body (`#39`, `#x27`, `amp`), so encoding choices do not count as differences. */
const decode = (e) =>
	e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : NAMED[e.toLowerCase()];

/**
 * <main> as normalized text, without the parts that differ by design between
 * sources (source-managed areas, such as admin widgets). `skip` names them:
 *
 * - a `data-` attribute (default `data-parity-skip`): drops each element that
 *   carries it. The marked element must not contain a nested element with
 *   the same tag.
 * - a tag name, e.g. `aside`: drops each such element (no nesting).
 */
export function pageText(html, { skip = "data-parity-skip" } = {}) {
	const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
	const skipped = skip.startsWith("data-")
		? new RegExp(`<([a-z][\\w-]*)\\b[^>]*\\b${skip}\\b[^>]*>[\\s\\S]*?<\\/\\1>`, "gi")
		: new RegExp(`<${skip}[\\s\\S]*?<\\/${skip}>`, "g");
	return main
		.replace(skipped, "")
		.replace(/<(script|style)[\s\S]*?<\/\1>/g, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/&(#x[\da-f]+|#\d+|nbsp|amp|lt|gt|quot|apos);/gi, (_, e) => decode(e))
		.replace(/\s+/g, " ")
		.trim();
}

export const title = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? "";

// ---------------------------------------------------------------------------
// Helpers for a theme's page assertions (run per source)
// ---------------------------------------------------------------------------

/** Attributes of one tag, lower-cased names: `<meta name="x" content="y">` -> { name: "x", content: "y" }. */
export function attrs(tag) {
	const out = {};
	for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4];
	return out;
}

/** Plain text of an HTML fragment. */
export const text = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/** Texts of every <h2> inside <main>. */
export const mainH2s = (html) => [...(html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "").matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => text(m[1]));

/** Head tags that must appear at most once; a duplicate means a source hook repeats the product's meta. */
const HEAD_ONCE = {
	"meta[name=robots]": (t, a) => t === "meta" && a.name === "robots",
	'meta[name=description]': (t, a) => t === "meta" && a.name === "description",
	"link[rel=canonical]": (t, a) => t === "link" && a.rel === "canonical",
	"og:title": (t, a) => t === "meta" && a.property === "og:title",
	"og:description": (t, a) => t === "meta" && a.property === "og:description",
	"og:image": (t, a) => t === "meta" && a.property === "og:image",
	"og:site_name": (t, a) => t === "meta" && a.property === "og:site_name",
};

/** The JSON-LD scripts in the page's <head>: each one's text, and its data or the parse error. */
export function jsonLdBlocks(html) {
	const head = html.match(/<head[\s\S]*?<\/head>/)?.[0] ?? "";
	return [...head.matchAll(/<script\b[^>]*\btype=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map(([, text]) => {
		try {
			return { text, data: JSON.parse(text) };
		} catch (error) {
			return { text, error: error.message };
		}
	});
}

/** Every JSON-LD node in the page's <head>, in order, with each block's `@graph` flattened. */
export function jsonLdNodes(html) {
	return jsonLdBlocks(html).flatMap(({ data }) => {
		if (!data) return [];
		const top = Array.isArray(data) ? data : [data];
		return top.flatMap((n) => (Array.isArray(n?.["@graph"]) ? n["@graph"] : [n]));
	});
}

/** JSON-LD keys whose string values must be absolute URLs. */
const LD_URL_KEYS = new Set(["url", "@id", "logo", "image", "mainEntityOfPage"]);

/** `key value` for each string under a URL key, at any depth, that is not an absolute URL. */
function relativeLdUrls(value, key = "") {
	if (typeof value === "string") return LD_URL_KEYS.has(key) && !/^[a-z][a-z\d+.-]*:/i.test(value) ? [`${key} ${value}`] : [];
	if (Array.isArray(value)) return value.flatMap((v) => relativeLdUrls(v, key));
	if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => relativeLdUrls(v, k));
	return [];
}

/**
 * Problems with the page's JSON-LD: a block that does not parse, more than one WebSite, a theme node on a noindex page,
 * a relative URL. A theme node has an `@id` (theme-core's builders give every one); a node without one is a plugin's
 * (EmDash renders plugin blocks on every page), so it may stay on a noindex page.
 */
function jsonLdProblems(path, html, noindex) {
	const problems = [];
	const blocks = jsonLdBlocks(html);
	const ours = noindex ? jsonLdNodes(html).filter((n) => typeof n?.["@id"] === "string") : [];
	if (ours.length) problems.push(`${path}: JSON-LD on a noindex page (${ours.length} node${ours.length === 1 ? "" : "s"} with an @id)`);
	for (const b of blocks) if (b.error) problems.push(`${path}: a JSON-LD block does not parse: ${b.error}`);
	const sites = jsonLdNodes(html).filter((n) => [n?.["@type"]].flat().includes("WebSite")).length;
	if (sites > 1) problems.push(`${path}: ${sites} WebSite nodes in the JSON-LD (expected at most 1)`);
	const relative = blocks.flatMap((b) => (b.data ? relativeLdUrls(b.data) : []));
	if (relative.length) problems.push(`${path}: JSON-LD values not absolute: ${relative.join(", ")}`);
	return problems;
}

/** Problems with head tags on one page, and with its JSON-LD (see jsonLdProblems). */
export function headProblems(path, html) {
	const problems = [];
	const head = html.match(/<head[\s\S]*?<\/head>/)?.[0] ?? "";
	const tags = [...head.matchAll(/<(meta|link)\b[^>]*>/gi)].map((m) => [m[1].toLowerCase(), attrs(m[0])]);
	for (const [label, match] of Object.entries(HEAD_ONCE)) {
		const n = tags.filter(([t, a]) => match(t, a)).length;
		if (n > 1) problems.push(`${path}: ${label} appears ${n} times`);
	}
	const titles = (head.match(/<title\b/g) ?? []).length;
	if (titles !== 1) problems.push(`${path}: <title> appears ${titles} times (expected 1)`);
	const noindex = tags.some(([t, a]) => t === "meta" && a.name?.toLowerCase() === "robots" && /\bnoindex\b/i.test(a.content ?? ""));
	problems.push(...jsonLdProblems(path, html, noindex));
	return problems;
}

/**
 * Problems with the light and dark switch on one page (the kit's ModeToggle and its no-flash script, modeScript in
 * @astronomic/ui/lib/mode.ts). The script is inline (a classic script, so it runs at once) in <head>, before every
 * stylesheet, so a saved choice is on <html> before the first paint. The page has `count` switches in the site nav's
 * bar and `inMenu` in its menu panel (the <dialog>: one shown on a narrow phone, in place of the bar's), each a
 * `type="button"` named `label` (its aria-label, or with none its visible text; with both, the aria-label starts with
 * the text, WCAG 2.5.3), not pressed as rendered (the script sets the state), hidden without JavaScript
 * (`noscript:hidden`) and with a 44px hit area (`tap-area`). `count: 0` (and no `inMenu`) checks that a page has no
 * switch and no script: the switch is turned off.
 */
export function modeProblems(path, html, { label = "Dark mode", count = 1, inMenu = 0 } = {}) {
	const problems = [];
	const head = html.match(/<head[\s\S]*?<\/head>/)?.[0] ?? "";
	const scripts = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => m[2].includes('localStorage.getItem("aui-theme")'));
	if (count + inMenu === 0) {
		if (scripts.length) problems.push(`${path}: the mode script is in <head> on a page with no switch`);
		if (/\bdata-mode-script\b/.test(html)) problems.push(`${path}: a data-mode-script element on a page with no switch`);
	} else if (scripts.length !== 1) problems.push(`${path}: the mode script is in <head> ${scripts.length} times (expected 1)`);
	else {
		const [tag, attributes] = scripts[0];
		const a = attrs(`<script ${attributes}>`);
		if (a.src || a.type === "module" || /(^|\s)(defer|async)\b/.test(attributes)) problems.push(`${path}: the mode script is not an inline classic script: ${tag.slice(0, 80)}`);
		const style = head.search(/<link\b[^>]*\brel=["']?stylesheet|<style\b/);
		if (style >= 0 && style < head.indexOf(tag)) problems.push(`${path}: a stylesheet comes before the mode script in <head> (a flash of the system's look)`);
	}
	const toggles = [...html.matchAll(/<button\b[^>]*\bdata-mode-toggle\b[^>]*>/g)].map((m) => m[0]);
	if (toggles.length !== count + inMenu) problems.push(`${path}: ${toggles.length} light and dark switches (expected ${count + inMenu})`);
	const header = [...html.matchAll(/<header\b[\s\S]*?<\/header>/g)].map((m) => m[0]).find((h) => /\bdata-nav-menu\b/.test(h)) ?? "";
	const panels = [...header.matchAll(/<dialog\b[\s\S]*?<\/dialog>/g)].map((m) => m[0]).join("");
	const bar = header.replace(/<dialog\b[\s\S]*?<\/dialog>/g, "");
	const switches = (part) => [...part.matchAll(/<button\b[^>]*\bdata-mode-toggle\b[^>]*>/g)].length;
	if (switches(bar) !== count) problems.push(`${path}: ${switches(bar)} switches in the nav bar (expected ${count})`);
	if (switches(panels) !== inMenu) problems.push(`${path}: ${switches(panels)} switches in the menu panel (expected ${inMenu})`);
	for (const [tag, inner] of [...html.matchAll(/(<button\b[^>]*\bdata-mode-toggle\b[^>]*>)([\s\S]*?)<\/button>/g)].map((m) => [m[1], m[2]])) {
		const a = attrs(tag);
		const shown = text(inner);
		const classes = (a.class ?? "").split(/\s+/);
		if (a.type !== "button") problems.push(`${path}: a switch is not type="button": ${tag}`);
		const name = a["aria-label"] ?? shown;
		if (name !== label) problems.push(`${path}: a switch is named ${JSON.stringify(name)}, not ${JSON.stringify(label)}`);
		if (shown && a["aria-label"] !== undefined && !a["aria-label"].toLowerCase().startsWith(shown.toLowerCase())) problems.push(`${path}: a switch shows ${JSON.stringify(shown)} but is named ${JSON.stringify(a["aria-label"])}`);
		if (a["aria-pressed"] !== "false") problems.push(`${path}: a switch renders aria-pressed=${JSON.stringify(a["aria-pressed"])}, not "false"`);
		for (const c of ["noscript:hidden", "tap-area"]) if (!classes.includes(c)) problems.push(`${path}: a switch has no ${c}`);
	}
	return problems;
}

/** Fetch one path: { status, html }. Redirects are not followed. */
export async function getPage(base, path) {
	const res = await fetch(base + path, { redirect: "manual" });
	return { status: res.status, html: await res.text() };
}

export function printAssertions(problems) {
	if (!problems.length) return console.log("page assertions: OK");
	console.log(`page assertions: ${problems.length} problem(s)`);
	for (const p of problems) console.log(`  - ${p}`);
}
