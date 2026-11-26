/**
 * Vesper's settings for the content tests (the runners in @astronomic/theme-core/scripts): the project root, the
 * pages parity checks with their expected status, the test-only content and Vesper's own page checks. The scripts in
 * this folder (`pnpm test:*`) pass this to their runner.
 *
 * `pages` lists every page of the demo with its expected status, and the 404 probes: a missing entry, a path one
 * segment too deep, a first segment the theme keeps for itself.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { attrs, headProblems, jsonLdNodes } from "@astronomic/theme-core/scripts/harness.mjs";
import { articleProblems, headingProblems, homeProblems, lightboxProblems, lightboxTriggers, listHeadProblems, mainLinks, postListProblems, reservedIdProblems, sectionPageProblems, srcsetProblems } from "./lib/page-checks.mjs";
import { privateResponseProblems, searchProblems, shareProblems, SITE, SITEMAP, siteFileProblems } from "./lib/site-checks.mjs";

/** The reader map's path (the llmstxt.org standard). Problem messages call it "the reader map". */
const READER_MAP = "/llms.txt";

const root = fileURLToPath(new URL("../", import.meta.url));
/** A smaller page size for the content tests' builds, so the demo's ten posts reach /articles/page/4 (src/utils/routes.ts). */
process.env.VESPER_PER_PAGE = "3";
/**
 * Test-only content (not in a released copy, fixtures/noindex/): a post with "hide from search engines" and every SEO
 * field set (Markdown's `noindex` and `seo:` block; EmDash's SEO panel, from seo.json). It stays one noindex post, so
 * the sitemap, the feed, the share cards and search leave it out as before. The runners for EmDash seed it into a
 * fresh demo database (scripts/lib/demo-db.mjs, `freshFixtures`), with its publish date from published.json.
 */
const fixtures = new URL("../fixtures/noindex/", import.meta.url);
/** The fixture posts' slugs and frontmatter, from their files (no released file names them). */
const fixturePosts = existsSync(fixtures)
	? readdirSync(new URL("posts/", fixtures))
			.filter((f) => f.endsWith(".md"))
			.map((f) => ({ slug: f.replace(/\.md$/, ""), front: readFileSync(new URL(`posts/${f}`, fixtures), "utf8").split(/^---$/m)[1] ?? "" }))
	: [];
/** The noindex fixture post: the one with `noindex: true`. Its head is checked in noindexProblems. */
export const NOINDEX_POST = fixturePosts.find((p) => /^noindex: true$/m.test(p.front))?.slug;
/** The SEO fixture post: the one with an `seo:` block (the noindex post). Its EmDash values (seo.json) are the head both sources must show. */
const SEO_POST = fixturePosts.find((p) => /^seo:$/m.test(p.front))?.slug;
const SEO_FIELDS = SEO_POST ? JSON.parse(readFileSync(new URL("seo.json", fixtures), "utf8")).posts[SEO_POST] : undefined;
const SITE_TITLE = JSON.parse(readFileSync(new URL("../content/site.json", import.meta.url), "utf8")).title;

/**
 * The sources Vesper ships: Markdown (static) and EmDash (server). The one list every runner reads: a later mixed
 * source is one more name here.
 */
export const SOURCES = ["markdown", "emdash"];

/** Path -> expected status. */
const pages = {
	"/": 200,
	"/articles": 200,
	"/articles/page/2": 200,
	"/articles/page/4": 200,
	"/articles/category/design": 200,
	"/articles/category/field-notes": 200,
	// Three demo posts are in Tools (one page of 3); the fixture post makes a fourth, so page 2 exists only with it.
	"/articles/category/tools/page/2": NOINDEX_POST ? 200 : 404,
	"/tags/film": 200,
	"/tags/film/page/2": 200,
	"/articles/designing-for-people-who-are-offline-on-purpose": 200,
	"/articles/a-type-scale-for-cracked-screens": 200,
	"/articles/two-days-on-a-trail-crew": 200,
	"/projects": 200,
	"/projects/ridgeline": 200,
	"/projects/larch-watch": 200,
	"/speaking": 200,
	"/uses": 200,
	"/now": 200,
	"/about": 200,
	"/privacy": 200,
	"/search": 200,
	"/no-such-page": 404,
	"/nope": 404,
	"/articles/nope": 404,
	"/articles/page/1": 404,
	"/articles/page/5": 404,
	"/articles/page": 404,
	"/articles/category/nope": 404,
	"/articles/category/design/page/1": 404,
	"/articles/category/design/page/9": 404,
	"/tags/nope": 404,
	"/tags/film/page/9": 404,
	"/projects/nope": 404,
	"/projects/ridgeline/x": 404,
	"/a/b": 404,
	"/about/x": 404,
	"/speaking/2026": 404,
	// The theme keeps these first segments (src/utils/routes.ts THEME_ROUTES): the root page route refuses them. Not
	// /_image: Astro's image endpoint answers there on a server build (sections.test.mjs covers the route's refusal).
	"/pagefind": 404,
	"/_astro": 404,
};

/** The test-only noindex post: one robots meta (the theme's; EmDash's own is dropped) and no search index body. */
async function noindexProblems(h) {
	if (!h.fixturesLoaded || !NOINDEX_POST) return [];
	const path = `/articles/${NOINDEX_POST}`;
	const page = await h.get(path);
	const problems = [];
	const robots = [...page.html.matchAll(/<meta\b[^>]*\bname=["']robots["'][^>]*>/g)].map((m) => m[0]);
	if (page.status !== 200) problems.push(`${path}: status ${page.status}`);
	else if (robots.length !== 1 || !/content=["']noindex["']/.test(robots[0])) problems.push(`${path}: expected one <meta name="robots" content="noindex">, found ${robots.length ? robots.join(" ") : "none"}`);
	if (/data-pagefind-body/.test(page.html)) problems.push(`${path}: has data-pagefind-body (it must stay out of the search index)`);
	return problems;
}

/**
 * The fixture post's three text photos (fixtures/noindex: the Markdown post and seed.json): the titled one opens large
 * with its caption; the one inside a link keeps its link and its caption (a figure, no photo link); the decorative one
 * (empty alt) is no photo link.
 */
const FIXTURE_LIGHTBOX = { count: 1, captions: ["Packed for four cold nights, October 2024."], linked: [{ href: "/uses", caption: "My everyday camera since 2019." }] };

/** The fixture post's lightbox (FIXTURE_LIGHTBOX); its photo links' hrefs go into `hrefs` for the large-file check. */
async function fixtureLightboxProblems(h, hrefs) {
	if (!h.fixturesLoaded || !NOINDEX_POST) return [];
	const path = `/articles/${NOINDEX_POST}`;
	const page = await h.get(path);
	if (page.status !== 200) return []; // noindexProblems reports the status.
	for (const { href } of lightboxTriggers(page.html)) if (href) hrefs.add(href);
	return lightboxProblems(path, page.html, FIXTURE_LIGHTBOX);
}

/**
 * Every photo link's large file answers 200 with an image content-type. A relative href is the site's; an absolute one on this machine
 * (EmDash writes its media URLs with the server's own origin, http://localhost:<port>) is asked of the served build.
 */
async function largeFileProblems(h, hrefs) {
	const problems = [];
	for (const href of [...hrefs].sort()) {
		const url = new URL(href, `${h.base}/`);
		// The test server's SITE_URL is the site's own address here: its photos are on this server.
		const local = ["localhost", "127.0.0.1"].includes(url.hostname) || url.origin === SITE;
		const res = await fetch(local ? `${h.base}${url.pathname}${url.search}` : url.href, { redirect: "manual" });
		await res.arrayBuffer();
		const type = res.headers.get("content-type") ?? "";
		if (res.status !== 200) problems.push(`the large photo ${href} answers ${res.status}`);
		else if (!type.toLowerCase().startsWith("image/")) problems.push(`the large photo ${href} is served as "${type}", not an image`);
	}
	return problems;
}

/**
 * The SEO fixture post's head, the same in every source: the SEO title (with the site's name in `<title>`, bare in
 * og:title), description, image (the one photo, which answers) and canonical, as `<title>`, og:title, the description
 * and og:description, og:image and the canonical link; no og:image:alt (alt text belongs to the entry's own photo).
 * Its robots meta is noindexProblems'.
 */
async function seoProblems(h) {
	if (!h.fixturesLoaded || !SEO_POST) return [];
	const path = `/articles/${SEO_POST}`;
	const page = await h.get(path);
	if (page.status !== 200) return [`${path}: status ${page.status}`];
	const head = page.html.match(/<head[\s\S]*?<\/head>/)?.[0] ?? "";
	const tags = [...head.matchAll(/<(meta|link)\b[^>]*>/gi)].map((m) => [m[1].toLowerCase(), attrs(m[0])]);
	const meta = (key) => tags.filter(([t, a]) => t === "meta" && (a.property === key || a.name === key)).map(([, a]) => a.content);
	const canonical = tags.filter(([t, a]) => t === "link" && a.rel === "canonical").map(([, a]) => a.href);
	const problems = [];
	const want = (label, got, expected) => {
		if (JSON.stringify(got) !== JSON.stringify(expected)) problems.push(`${path}: ${label} ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
	};
	want("<title>", head.match(/<title>([^<]*)<\/title>/)?.[1], `${SEO_FIELDS.title} — ${SITE_TITLE}`);
	want("og:title", meta("og:title"), [SEO_FIELDS.title]);
	want("description", meta("description"), [SEO_FIELDS.description]);
	want("og:description", meta("og:description"), [SEO_FIELDS.description]);
	want("canonical", canonical, [SEO_FIELDS.canonical]);
	want("og:image:alt", meta("og:image:alt"), []);
	const image = meta("og:image");
	// The SEO image's file (gear.webp), as each source serves it: a build asset or EmDash's media route.
	const file = SEO_FIELDS.image.split("/").pop().replace(/\.\w+$/, "");
	if (image.length !== 1 || !new RegExp(`/${file}[.-]`).test(new URL(image[0]).pathname)) problems.push(`${path}: og:image ${JSON.stringify(image)} is not the SEO image (${SEO_FIELDS.image})`);
	else {
		const { status } = await h.get(new URL(image[0]).pathname);
		if (status !== 200) problems.push(`${path}: og:image ${image[0]} answers ${status}`);
	}
	return problems;
}

/** The demo post with an `updated` date (front matter and seed entry; it is in the series too), the day, and the words its meta line shows. */
const UPDATED_POST = "/articles/shipping-a-map-app-that-works-above-treeline";
const UPDATED_DAY = "2026-10-12";
const UPDATED_TEXT = "Updated October 12, 2026";
/** A post in the Building Ridgeline series, and one in no series; neither has an `updated` date. SERIES_POSTS: those in the series. */
const SERIES_POST = "/articles/designing-for-people-who-are-offline-on-purpose";
const PLAIN_POST = "/articles/a-type-scale-for-cracked-screens";
const SERIES_NAME = "Building Ridgeline";
const SERIES_POSTS = [SERIES_POST, UPDATED_POST];

/**
 * The JSON-LD types each page must carry (path -> types). Every indexable page has the site's WebSite and the owner's
 * Person; search has only those. The noindex fixture post has none.
 */
const SITE_NODES = ["WebSite", "Person"];
const JSONLD = {
	"/": SITE_NODES,
	"/search": SITE_NODES,
	[SERIES_POST]: [...SITE_NODES, "BlogPosting"],
	[PLAIN_POST]: [...SITE_NODES, "BlogPosting"],
	[UPDATED_POST]: [...SITE_NODES, "BlogPosting"],
	"/projects/ridgeline": [...SITE_NODES, "CreativeWork"],
	"/projects": [...SITE_NODES, "CollectionPage"],
	"/articles": [...SITE_NODES, "CollectionPage"],
	"/articles/page/2": [...SITE_NODES, "CollectionPage"],
	"/articles/category/design": [...SITE_NODES, "CollectionPage"],
	"/tags/film": [...SITE_NODES, "CollectionPage"],
	"/tags/film/page/2": [...SITE_NODES, "CollectionPage"],
	"/about": [...SITE_NODES, "ProfilePage"],
	"/now": [...SITE_NODES, "WebPage"],
	"/speaking": [...SITE_NODES, "WebPage"],
	"/uses": [...SITE_NODES, "WebPage"],
	"/privacy": [...SITE_NODES, "WebPage"],
};
/** The reader map's sections, in strings.readerMap's order: the fixed, list and root pages, then the articles, projects, categories and tags. */
const READER_SECTIONS = ["Pages", "Articles", "Projects", "Categories", "Tags"];
/** The reader map's link names for the main pages: short names, never the pages' headlines. */
const READER_NAMES = { "/": SITE_TITLE, "/articles": "Articles", "/projects": "Projects", "/speaking": "Speaking", "/uses": "Uses", "/now": "Now", "/about": "About", "/privacy": "Privacy" };

const typesOf = (n) => [n?.["@type"]].flat();
const ofType = (nodes, type) => nodes.filter((n) => typesOf(n).includes(type));
const mainOf = (html) => html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";

/**
 * Structured data: each JSONLD page's types; the owner is one Person at `<site>/#owner` whose sameAs holds only full
 * profile URLs (no feed, no mail link); a post's author is the owner; a series post is part of its series, another
 * post is not; the about page's main entity is the owner; the noindex fixture post has none. The updated post shows
 * "Updated <date>" in its <main> and its dateModified is that day; a post without one shows no "Updated".
 */
async function structuredDataProblems(h) {
	const problems = [];
	const owner = `${SITE}/#owner`;
	const nodesAt = {};
	for (const [path, types] of Object.entries(JSONLD)) {
		const page = await h.get(path);
		if (page.status !== 200) {
			problems.push(`${path}: status ${page.status}`);
			continue;
		}
		const nodes = jsonLdNodes(page.html);
		nodesAt[path] = { nodes, html: page.html };
		for (const type of types) if (!ofType(nodes, type).length) problems.push(`${path}: no ${type} in the JSON-LD (has ${nodes.map((n) => typesOf(n).join("/")).join(", ") || "none"})`);
		const people = ofType(nodes, "Person");
		if (people.length !== 1 || people[0]["@id"] !== owner) problems.push(`${path}: expected one Person at ${owner}, found ${JSON.stringify(people.map((p) => p["@id"]))}`);
		const links = people[0]?.sameAs ?? [];
		if (links.some((l) => !/^https:\/\//.test(l) || /\.xml$/.test(l) || new URL(l).pathname === "/")) problems.push(`${path}: the owner's sameAs ${JSON.stringify(links)} is not only full profile URLs`);
	}
	for (const path of [SERIES_POST, PLAIN_POST, UPDATED_POST]) {
		const post = ofType(nodesAt[path]?.nodes ?? [], "BlogPosting")[0];
		if (!post) continue;
		if (post.author?.["@id"] !== owner) problems.push(`${path}: the BlogPosting's author is ${JSON.stringify(post.author)}, not the owner`);
		const series = post.isPartOf;
		if (SERIES_POSTS.includes(path) ? series?.name !== SERIES_NAME : series !== undefined) problems.push(`${path}: the BlogPosting's isPartOf is ${JSON.stringify(series)}`);
	}
	const profile = ofType(nodesAt["/about"]?.nodes ?? [], "ProfilePage")[0];
	if (profile && profile.mainEntity?.["@id"] !== owner) problems.push(`/about: the ProfilePage's mainEntity is ${JSON.stringify(profile.mainEntity)}, not the owner`);
	if (h.fixturesLoaded && NOINDEX_POST) {
		const path = `/articles/${NOINDEX_POST}`;
		const nodes = jsonLdNodes((await h.get(path)).html);
		if (nodes.length) problems.push(`${path}: ${nodes.length} JSON-LD nodes on a noindex page`);
	}
	const updated = nodesAt[UPDATED_POST];
	if (updated) {
		if (!mainOf(updated.html).includes(UPDATED_TEXT)) problems.push(`${UPDATED_POST}: no "${UPDATED_TEXT}" in <main>`);
		const post = ofType(updated.nodes, "BlogPosting")[0];
		if (!post?.dateModified?.startsWith(UPDATED_DAY)) problems.push(`${UPDATED_POST}: dateModified ${post?.dateModified}, expected ${UPDATED_DAY}`);
	}
	for (const path of [SERIES_POST, PLAIN_POST]) {
		if (nodesAt[path] && /\bUpdated\b/.test(mainOf(nodesAt[path].html))) problems.push(`${path}: shows "Updated" with no updated date`);
		const post = ofType(nodesAt[path]?.nodes ?? [], "BlogPosting")[0];
		if (post && post.dateModified !== post.datePublished) problems.push(`${path}: dateModified ${post.dateModified} differs from datePublished ${post.datePublished}`);
	}
	return problems;
}

/**
 * The reader map: status 200 (on a server, plain text and publicly cached for an hour); first line `# <site title>`;
 * its links are the sitemap's pages, once each (so never the noindex post); its sections in READER_SECTIONS' order.
 * robots.txt still has no `Disallow: /` line: the default allows every crawler.
 */
async function readerMapProblems(kind, h) {
	const problems = [];
	const res = await fetch(h.base + READER_MAP);
	const body = await res.text();
	if (res.status !== 200) return [`the reader map: status ${res.status}`];
	if (kind === "server") {
		const type = res.headers.get("content-type") ?? "";
		const cache = res.headers.get("cache-control") ?? "";
		if (!/^text\/plain/.test(type)) problems.push(`the reader map: type ${type}`);
		if (cache !== "public, max-age=3600") problems.push(`the reader map: Cache-Control "${cache}"`);
	}
	const first = body.split("\n")[0];
	if (first !== `# ${SITE_TITLE}`) problems.push(`the reader map: first line ${JSON.stringify(first)}, expected "# ${SITE_TITLE}"`);
	const paths = [...body.matchAll(/^- \[[^\]]*\]\(([^)]+)\)/gm)].map((m) => (m[1].startsWith(SITE) ? m[1].slice(SITE.length) || "/" : m[1]));
	const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);
	if (dupes.length) problems.push(`the reader map: listed more than once: ${dupes.join(" ")}`);
	const want = [...SITEMAP].sort();
	const got = [...new Set(paths)].sort();
	if (got.join(" ") !== want.join(" ")) problems.push(`the reader map: the pages differ from the sitemap's:\n    got:  ${got.join(" ")}\n    want: ${want.join(" ")}`);
	if (NOINDEX_POST && paths.includes(`/articles/${NOINDEX_POST}`)) problems.push(`the reader map lists the noindex post`);
	const sections = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
	if (sections.join(" | ") !== READER_SECTIONS.join(" | ")) problems.push(`the reader map: sections ${sections.join(" | ")}, expected ${READER_SECTIONS.join(" | ")}`);
	const names = new Map([...body.matchAll(/^- \[([^\]]*)\]\(([^)]+)\)/gm)].map((m) => [m[2].startsWith(SITE) ? m[2].slice(SITE.length) || "/" : m[2], m[1]]));
	for (const [path, name] of Object.entries(READER_NAMES)) if (names.get(path) !== name) problems.push(`the reader map: ${path} is named ${JSON.stringify(names.get(path))}, expected ${JSON.stringify(name)}`);
	const robots = await (await fetch(`${h.base}/robots.txt`)).text();
	if (/^Disallow: \/$/m.test(robots)) problems.push("/robots.txt: a Disallow: / line (the default allows every crawler)");
	return problems;
}

/**
 * Vesper's page checks, for every source: private responses first (server builds), then on every page that answers
 * its expected status: head tags, the 404 page's h1, one h1, no skipped heading level, the reserved ids, a srcset on
 * every content image, the home page, articles (table of contents ids, the hero's srcset), the list pages' and the
 * Now page's heads from their pages entries, the article lists' card grid, the uses page's jump links, group photo,
 * button link and no page photo, the talks' separators, and the lightbox (its dialog and photo links); then every site
 * link in those pages' <main> answers 200; then the fixture post's lightbox, every photo link's large file (200, an image), the
 * noindex and SEO fixture posts, the site files (robots, the sitemap inventory, the
 * feed), the share cards and search.
 */
async function assertPages(kind, h) {
	// First, before any other request reaches the editor-first URLs.
	const problems = [...(await privateResponseProblems(kind, h, [READER_MAP]))];
	const html = {};
	const links = new Set();
	const largeFiles = new Set();
	for (const [path, status] of Object.entries(pages)) {
		const page = await h.get(path);
		if (page.status !== status) continue; // The runners report status differences.
		problems.push(...headProblems(path, page.html));
		if (status === 404 && !/<h1\b/.test(page.html)) problems.push(`${path}: the 404 page has no h1`);
		html[path] = page.html;
		if (status !== 200) continue;
		const h1s = (page.html.match(/<h1\b/g) ?? []).length;
		if (h1s !== 1) problems.push(`${path}: ${h1s} h1 elements (one expected)`);
		problems.push(...headingProblems(path, page.html), ...reservedIdProblems(path, page.html), ...srcsetProblems(path, page.html));
		if (path === "/") problems.push(...homeProblems(page.html));
		problems.push(...listHeadProblems(path, page.html), ...postListProblems(path, page.html), ...sectionPageProblems(path, page.html));
		if (/^\/articles\/(?!page\/|category\/)[^/]+$/.test(path)) problems.push(...articleProblems(path, page.html));
		problems.push(...lightboxProblems(path, page.html));
		for (const { href } of lightboxTriggers(page.html)) if (href) largeFiles.add(href);
		for (const href of mainLinks(page.html)) links.add(href);
	}
	// Every site link in those pages' <main> answers 200.
	for (const href of [...links].sort()) {
		if (pages[href] === 200) continue;
		const { status } = await h.get(href);
		if (status !== 200) problems.push(`a link to ${href} answers ${status}`);
	}
	problems.push(...(await fixtureLightboxProblems(h, largeFiles)), ...(await largeFileProblems(h, largeFiles)));
	problems.push(...(await noindexProblems(h)), ...(await seoProblems(h)), ...(await structuredDataProblems(h)), ...(await readerMapProblems(kind, h)));
	problems.push(...(await siteFileProblems(kind, h)), ...(await shareProblems(kind, h, pages)), ...(await searchProblems(kind, h, html)));
	return problems;
}

export default { root, pages, assertPages, fixtures, snapshot: true, paritySkip: "data-parity-skip" };
