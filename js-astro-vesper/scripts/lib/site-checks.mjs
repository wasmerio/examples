/**
 * Vesper's checks of the site files, the share cards, private responses and search, for scripts/theme-tests.mjs's
 * `assertPages` (the content tests run it on every source). Each returns a list of problems.
 *
 *   privateResponseProblems(kind, h)   run first: the editor-first URLs must have had no request yet
 *   siteFileProblems(kind, h)          robots.txt, sitemap.xml (equals SITEMAP), sitemap-<collection>.xml, rss.xml
 *   shareProblems(kind, h, pages)      the share tags on every page of `pages` (path -> status), every card
 *   searchProblems(kind, h, html)      the search page per build, and which pages static search indexes
 *
 * SITEMAP, INDEXED, NOT_INDEXED and PHOTO_PAGES name the demo's pages with every page switch on (the default).
 */
import { existsSync, readdirSync } from "node:fs";
import { attrs } from "@astronomic/theme-core/scripts/harness.mjs";

/** The site URL the test builds use (astro.config.mjs's default; SITE_URL is not set). */
export const SITE = "https://example.com";

/** The test-only post with "hide from search engines" set (fixtures/noindex/posts/), by its file name. */
const fixtures = new URL("../../fixtures/noindex/posts/", import.meta.url);
const NOINDEX_POST = existsSync(fixtures) ? `/articles/${readdirSync(fixtures).find((f) => f.endsWith(".md"))?.replace(/\.md$/, "")}` : undefined;

/** The demo's posts, newest first: the feed's items, in its order. */
export const FEED = [
	"/articles/designing-for-people-who-are-offline-on-purpose",
	"/articles/what-a-35mm-prime-taught-me-about-interface-density",
	"/articles/shipping-a-map-app-that-works-above-treeline",
	"/articles/my-field-kit-for-a-week-in-the-north-cascades",
	"/articles/a-darkroom-in-a-closet-for-180",
	"/articles/a-type-scale-for-cracked-screens",
	"/articles/two-nights-at-stevens-pass",
	"/articles/two-days-on-a-trail-crew",
	"/articles/the-notebook-i-keep-for-every-project",
	"/articles/fog-on-the-fence-trail",
];

/** The demo's projects, in their order (`order`, then the rest). */
export const PROJECTS = ["/projects/ridgeline", "/projects/contour", "/projects/darkroom-notes", "/projects/larch-watch"];

/**
 * Every page /sitemap.xml lists, in its order, for every source (src/utils/public-pages.ts publicPages()). Not
 * listed: search, 404, paged lists, the noindex fixture post.
 */
export const SITEMAP = [
	"/",
	"/articles",
	"/projects",
	"/speaking",
	"/uses",
	"/now",
	...FEED,
	...PROJECTS,
	"/about",
	"/privacy",
	"/articles/category/design",
	"/articles/category/field-notes",
	"/articles/category/photography",
	"/articles/category/tools",
	"/tags/film",
	"/tags/gear",
	"/tags/maps",
	"/tags/offline",
	"/tags/performance",
	"/tags/typography",
];

/**
 * Pages static search indexes (the entries, and /speaking and /uses as one page each), and structural pages it leaves
 * out.
 */
export const INDEXED = [
	"/articles/designing-for-people-who-are-offline-on-purpose",
	"/articles/a-type-scale-for-cracked-screens",
	"/articles/two-days-on-a-trail-crew",
	"/projects/ridgeline",
	"/projects/larch-watch",
	"/speaking",
	"/uses",
	"/now",
	"/about",
	"/privacy",
];
export const NOT_INDEXED = ["/", "/articles", "/articles/page/2", "/articles/category/design", "/tags/film", "/projects", "/search"];

/**
 * Entry pages whose share image is the entry's photo (a post's thumbnail, a project's or a page's photo); an entry
 * with none (/projects/larch-watch, /privacy) and the list pages (/uses too: it shows no page photo) share
 * their own card.
 */
export const PHOTO_PAGES = ["/articles/designing-for-people-who-are-offline-on-purpose", "/articles/two-days-on-a-trail-crew", "/projects/ridgeline", "/now", "/about"];

/** A post: og:type article. */
const isArticle = (path) => /^\/articles\/(?!page\/|category\/)[^/]+$/.test(path);
/**
 * An entry page (a post, a project, a page from the pages collection): it shares its photo when it has one. The list
 * pages show no page photo, so they share their card.
 */
const isEntry = (path) => isArticle(path) || /^\/projects\/[^/]+$/.test(path) || ["/now", "/about", "/privacy"].includes(path);

/** The share card path of a page (theme-core's shareImagePath). */
const cardPath = (path) => (path === "/" ? "/og/card.png" : `/og${path}/card.png`);

/** A heading without its emphasis markers (the kit's plainHeading, for the home card's title). */
const plain = (text) => text.replace(/\*/g, "");

// ---------------------------------------------------------------------------
// Search

/**
 * Search per build: a server build searches the source per request (a hit for a post, a project, /speaking and
 * /uses); a static
 * build searches with Pagefind (the entry pages carry the index markup; structural pages do not). The title and the
 * box come before the live regions.
 */
export async function searchProblems(kind, h, html) {
	const problems = [];
	const mode = (page) => page.match(/<div\b[^>]*\bdata-search-page\b[^>]*>/)?.[0] ?? "";
	const indexed = (page) => /<main\b[^>]*\bdata-pagefind-body\b/.test(page ?? "");
	const header = (path, page) => {
		const part = page.slice(Math.max(0, page.search(/<div\b[^>]*\bdata-search-page\b/)));
		const h1 = part.indexOf("<h1");
		if (h1 < 0 || /aria-live/.test(part.slice(0, h1))) problems.push(`${path}: the <h1> is missing or inside a live region`);
		if (!/<p\b[^>]*data-count-text[^>]*aria-live="polite"/.test(part)) problems.push(`${path}: no [data-count-text] with aria-live="polite"`);
		if (!/<form\b[^>]*action="\/search"[^>]*role="search"/.test(part)) problems.push(`${path}: no search box`);
	};
	if (kind === "server") {
		for (const [q, href] of [
			["treeline", "/articles/shipping-a-map-app-that-works-above-treeline"],
			["ridgeline", "/projects/ridgeline"],
			// A talk and a uses item: one hit for their page, as static search indexes it.
			["megabytes", "/speaking"],
			["tripod", "/uses"],
		]) {
			const path = `/search?q=${q}`;
			const s = await h.get(path);
			if (s.status !== 200) {
				problems.push(`${path}: status ${s.status}`);
				continue;
			}
			if (!/data-mode="request"/.test(mode(s.html)) || !/data-state="results"/.test(mode(s.html))) problems.push(`${path}: expected request results, found ${mode(s.html) || "none"}`);
			if (!s.html.includes(`href="${href}"`)) problems.push(`${path}: no hit for ${href}`);
			if (/<h2\b[^>]*data-post-title[^>]*>[^<]*<a\b[^>]*>[^<]*\*/.test(s.html)) problems.push(`${path}: an emphasis marker in a hit title`);
			header(path, s.html);
		}
		// The pages entries that word the list pages are never hits of their own: /projects is not indexed (a static
		// build leaves it out), and /speaking is one hit, titled by its entry.
		const squint = await h.get("/search?q=squint");
		if (/data-hit="href"[^>]*href="\/projects"/.test(squint.html)) problems.push("/search?q=squint: a hit for /projects (its pages entry only words the list page)");
		const talks = await h.get("/search?q=outdoors+talks");
		if (!/<h2\b[^>]*data-post-title[^>]*>\s*<a\b[^>]*href="\/speaking"[^>]*>\s*Talks about calm software and the outdoors\./.test(talks.html)) problems.push("/search?q=outdoors+talks: no /speaking hit titled by its pages entry");
		if ((talks.html.match(/data-post-title[^>]*>\s*<a\b[^>]*href="\/speaking"/g) ?? []).length > 1) problems.push("/search?q=outdoors+talks: /speaking is more than one hit");
		// The noindex fixture post is left out of the request search, as a static build leaves it out of the index.
		if (h.fixturesLoaded && NOINDEX_POST) {
			const hidden = await h.get("/search?q=old+gear+list");
			if (hidden.html.includes(`href="${NOINDEX_POST}"`)) problems.push(`/search?q=old+gear+list: a hit for the noindex post ${NOINDEX_POST}`);
		}
		const none = await h.get("/search?q=zzqxv");
		if (!/data-state="none"/.test(mode(none.html))) problems.push(`/search?q=zzqxv: expected no results, found ${mode(none.html) || "none"}`);
		for (const path of INDEXED) if (/data-pagefind-body|data-pagefind-meta/.test(html[path] ?? "")) problems.push(`${path}: search index markup on a server build`);
	} else {
		const s = html["/search"] ?? (await h.get("/search")).html;
		if (!/data-mode="static"/.test(mode(s))) problems.push('/search: no data-search-page with data-mode="static"');
		header("/search", s);
		const pf = await fetch(`${h.base}/pagefind/pagefind.js`);
		if (pf.status !== 200) problems.push(`/pagefind/pagefind.js: status ${pf.status}`);
		for (const path of INDEXED) {
			const page = html[path] ?? (await h.get(path)).html;
			if (!indexed(page)) problems.push(`${path}: <main> has no data-pagefind-body (static search must index it)`);
		}
		if (NOINDEX_POST && indexed((await h.get(NOINDEX_POST)).html)) problems.push(`${NOINDEX_POST}: the noindex post is in the search index`);
	}
	for (const path of NOT_INDEXED) {
		const page = html[path] ?? (await h.get(path)).html;
		if (indexed(page)) problems.push(`${path}: <main> has data-pagefind-body (only entry pages are indexed)`);
	}
	return problems;
}

// ---------------------------------------------------------------------------
// Site files

/** Problems with /robots.txt, /sitemap.xml, /sitemap-<collection>.xml and /rss.xml. */
export async function siteFileProblems(kind, h) {
	const problems = [];
	// The content type comes from the server; the test's static file server sends none.
	const typeOk = (res, re) => kind !== "server" || re.test(res.headers.get("content-type") ?? "");
	const robots = await fetch(`${h.base}/robots.txt`);
	const robotsText = await robots.text();
	if (robots.status !== 200 || !typeOk(robots, /^text\/plain/)) problems.push(`/robots.txt: status ${robots.status}, type ${robots.headers.get("content-type")}`);
	else {
		if (!robotsText.includes(`Sitemap: ${SITE}/sitemap.xml`)) problems.push(`/robots.txt: no "Sitemap: ${SITE}/sitemap.xml"`);
		if (kind === "server" && !robotsText.includes("Disallow: /_emdash/")) problems.push("/robots.txt: no Disallow: /_emdash/ on a server build");
		if (kind !== "server" && robotsText.includes("Disallow:")) problems.push("/robots.txt: a Disallow line on a static build");
	}

	const sitemap = await fetch(`${h.base}/sitemap.xml`);
	const xml = await sitemap.text();
	if (sitemap.status !== 200 || !typeOk(sitemap, /^application\/xml/)) problems.push(`/sitemap.xml: status ${sitemap.status}, type ${sitemap.headers.get("content-type")}`);
	else {
		const paths = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => (m[1].startsWith(SITE) ? m[1].slice(SITE.length) || "/" : m[1]));
		if (paths.join("\n") !== SITEMAP.join("\n")) problems.push(`/sitemap.xml: the pages differ from SITEMAP:\n    got:  ${paths.join(" ")}\n    want: ${SITEMAP.join(" ")}`);
		for (const path of paths) {
			const res = await fetch(h.base + path, { redirect: "manual" });
			if (res.status !== 200) problems.push(`/sitemap.xml lists ${path}, which returns ${res.status}`);
		}
		if (NOINDEX_POST && paths.includes(NOINDEX_POST)) problems.push(`/sitemap.xml lists the noindex post ${NOINDEX_POST}`);
		const posts = [...xml.matchAll(/<url><loc>[^<]*\/articles\/(?!category\/)[^<]+<\/loc>(<lastmod>[^<]*<\/lastmod>)?<\/url>/g)];
		if (posts.some((m) => !m[1])) problems.push("/sitemap.xml: a post with no <lastmod>");
	}
	for (const name of ["posts", "projects", "pages", "talks"]) {
		const res = await fetch(`${h.base}/sitemap-${name}.xml`);
		if (res.status !== 404) problems.push(`/sitemap-${name}.xml: status ${res.status}, expected 404 (the theme owns the sitemap)`);
	}

	const rss = await fetch(`${h.base}/rss.xml`);
	const feed = await rss.text();
	if (rss.status !== 200 || !typeOk(rss, /^application\/rss\+xml/)) problems.push(`/rss.xml: status ${rss.status}, type ${rss.headers.get("content-type")}`);
	else {
		const links = [...feed.matchAll(/<item>[\s\S]*?<link>([^<]*)<\/link>/g)].map((m) => m[1].slice(SITE.length));
		if (links.join(" ") !== FEED.join(" ")) problems.push(`/rss.xml: items ${links.join(" ")}, expected ${FEED.join(" ")}`);
		const items = feed.match(/<item>[\s\S]*<\/item>/)?.[0] ?? "";
		if (/\*/.test(items)) problems.push("/rss.xml: an emphasis marker in an item");
		if ((items.match(/<category>/g) ?? []).length !== FEED.length) problems.push("/rss.xml: not one category per item");
	}
	return problems;
}

// ---------------------------------------------------------------------------
// Share cards

/** The head's <meta>/<link> tags as [tag, attrs]. */
const headTags = (html) => [...(html.match(/<head[\s\S]*?<\/head>/)?.[0] ?? "").matchAll(/<(meta|link)\b[^>]*>/gi)].map((m) => [m[1].toLowerCase(), attrs(m[0])]);
const metas = (tags, key) => tags.filter(([t, a]) => t === "meta" && (a.property === key || a.name === key)).map(([, a]) => a.content);

/** The kind of image the bytes are (by signature), or undefined. */
function imageKind(bytes) {
	const b = new Uint8Array(bytes);
	const ascii = (from, to) => String.fromCharCode(...b.slice(from, to));
	if (b[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
	if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
	if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
	if (ascii(4, 8) === "ftyp") return "avif";
	return undefined;
}

/**
 * Share head tags on every page of `pages` (path -> status) that returns 200: one absolute og:image under SITE that
 * serves an image, og:url, og:type, one twitter:card and one RSS alternate link. A post with a photo shares the photo
 * (with its alt); a sitemap page without one shares its own card, a PNG; a page outside the sitemap (search, paged
 * lists) shares the home card. Every sitemap page has its card, the card pages equal SITEMAP, no card title holds an
 * emphasis marker, and the home card's title is the headline.
 */
export async function shareProblems(kind, h, pages) {
	const problems = [];
	const checked = new Map();
	const fetchImage = async (target) => {
		if (!checked.has(target)) {
			const res = await fetch(h.base + target, { redirect: "manual" });
			const bytes = res.status === 200 ? await res.arrayBuffer() : new ArrayBuffer(0);
			checked.set(target, { status: res.status, type: res.headers.get("content-type") ?? "", kind: imageKind(bytes) });
		}
		return checked.get(target);
	};
	for (const [path, status] of Object.entries(pages)) {
		if (status !== 200) continue;
		const page = await h.get(path);
		const tags = headTags(page.html);
		const images = metas(tags, "og:image");
		if (images.length !== 1) {
			problems.push(`${path}: ${images.length} og:image tags (expected 1)`);
			continue;
		}
		const image = images[0];
		if (!image.startsWith(`${SITE}/`)) problems.push(`${path}: og:image ${image} is not under ${SITE}/`);
		else {
			const url = new URL(image);
			const target = url.pathname + url.search;
			const got = await fetchImage(target);
			if (got.status !== 200 || !got.kind || (kind === "server" && !/^image\//.test(got.type))) problems.push(`${path}: og:image ${target} returns ${got.status} ${got.type || "(no type)"} ${got.kind ?? "(not an image)"}`);
			if (PHOTO_PAGES.includes(path) || !target.startsWith("/og/")) {
				if (target.startsWith("/og/")) problems.push(`${path}: og:image is a card (${target}), not the entry's photo`);
				if (!isEntry(path)) problems.push(`${path}: shares a photo (${target}) but is not an entry page`);
				const alt = metas(tags, "og:image:alt");
				const main = page.html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
				if (alt.length !== 1 || !alt[0] || !main.includes(`alt="${alt[0]}"`)) problems.push(`${path}: og:image:alt ${JSON.stringify(alt)} is not the photo's alt`);
			} else {
				const want = SITEMAP.includes(path) ? cardPath(path) : cardPath("/");
				if (target !== want) problems.push(`${path}: og:image ${target}, expected ${want}`);
				else if (got.kind !== "png" || (kind === "server" && got.type !== "image/png")) problems.push(`${path}: the card is not a PNG (${got.type} ${got.kind})`);
			}
		}
		const ogUrl = metas(tags, "og:url");
		const wantUrl = new URL(path, SITE).href;
		if (ogUrl.length !== 1 || ogUrl[0] !== wantUrl) problems.push(`${path}: og:url ${JSON.stringify(ogUrl)}, expected ${wantUrl}`);
		const type = metas(tags, "og:type");
		const wantType = isArticle(path) ? "article" : "website";
		if (type.length !== 1 || type[0] !== wantType) problems.push(`${path}: og:type ${JSON.stringify(type)}, expected ${wantType}`);
		if (metas(tags, "twitter:card").length !== 1) problems.push(`${path}: ${metas(tags, "twitter:card").length} twitter:card tags (expected 1)`);
		const feeds = tags.filter(([t, a]) => t === "link" && a.rel === "alternate" && a.type === "application/rss+xml");
		if (feeds.length !== 1 || feeds[0][1].href !== `${SITE}/rss.xml`) problems.push(`${path}: ${feeds.length} RSS alternate links (expected 1, href ${SITE}/rss.xml)`);
		const title = page.html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
		if (title.includes("*")) problems.push(`${path}: an emphasis marker in <title>: ${title}`);
	}
	// Every sitemap page has its own card (a PNG); a page outside it has none.
	for (const path of SITEMAP) {
		const got = await fetchImage(cardPath(path));
		if (got.status !== 200 || got.kind !== "png") problems.push(`${cardPath(path)}: status ${got.status}, ${got.kind ?? "not an image"}`);
	}
	for (const path of ["/search", "/articles/page/2", ...(NOINDEX_POST ? [NOINDEX_POST] : [])]) {
		const got = await fetchImage(cardPath(path));
		if (got.status !== 404) problems.push(`${cardPath(path)}: status ${got.status}, expected 404 (not a public page)`);
	}
	const snap = await h.snapshot();
	if (snap.error) problems.push(`share cards: ${snap.error}`);
	else {
		const paths = (snap.cards ?? []).map((c) => c.path);
		if (paths.join(" ") !== SITEMAP.join(" ")) problems.push(`share cards: the card pages differ from SITEMAP: ${paths.join(" ")}`);
		for (const c of snap.cards ?? []) if (c.card.title.includes("*")) problems.push(`${c.path}: the card title holds a marker: ${c.card.title}`);
		const home = snap.cards?.find((c) => c.path === "/");
		const headline = snap.site?.settings?.headline;
		if (!headline || home?.card.title !== plain(headline)) problems.push(`/: the home card's title ${JSON.stringify(home?.card.title)} is not the plain headline ${JSON.stringify(headline)}`);
	}
	return problems;
}

// ---------------------------------------------------------------------------
// Private responses (server builds)

/** The EmDash edit-mode cookie (EmDash reads it in its request-context middleware). */
const EDIT_COOKIE = "emdash-edit-mode=true";
const PRIVATE = "private, no-store";
/** Signs of edit-mode output that must never reach an anonymous visitor: EmDash's toolbar and edit attributes. */
const EDIT_OUTPUT = /id="emdash-toolbar"|data-emdash-ref/;

/**
 * Private responses (server builds): edit-mode and preview-token requests get `private, no-store` on every
 * response, the feed, the sitemap and the card PNG included, while anonymous ones stay public. Run first, so the
 * editor-first URLs have had no request yet on this server: each gets an edit-mode request, then an anonymous one,
 * which must not be a route cache hit of it nor carry edit-mode output. `siteFiles` adds more site files (public for
 * an hour) to the cache checks.
 */
export async function privateResponseProblems(kind, h, siteFiles = []) {
	if (kind !== "server") return [];
	const problems = [];
	const ask = async (path, cookie) => {
		const res = await fetch(h.base + path, { redirect: "manual", headers: cookie ? { Cookie: cookie } : {} });
		const type = res.headers.get("content-type") ?? "";
		const body = /^(text|application\/(xml|rss|json))/.test(type) ? await res.text() : "";
		return { status: res.status, cache: res.headers.get("cache-control") ?? "", hit: res.headers.get("x-astro-cache") ?? "", body };
	};
	for (const path of ["/articles/fog-on-the-fence-trail", "/rss.xml", "/_snapshot.json", "/og/card.png"]) {
		const edit = await ask(path, EDIT_COOKIE);
		if (edit.cache !== PRIVATE) problems.push(`${path} in edit mode (first request): Cache-Control is "${edit.cache}", not "${PRIVATE}"`);
		const anon = await ask(path);
		if (anon.status !== 200) problems.push(`${path} after edit mode: status ${anon.status}`);
		if (anon.hit === "HIT") problems.push(`${path} after edit mode: a route cache hit`);
		if (anon.cache.includes("private")) problems.push(`${path} after edit mode: anonymous Cache-Control is "${anon.cache}"`);
		if (EDIT_OUTPUT.test(anon.body)) problems.push(`${path} after edit mode: anonymous response carries edit-mode output`);
	}
	for (const [path, publicCache] of [
		["/sitemap.xml", "public, max-age=3600"],
		["/rss.xml", "public, max-age=3600"],
		["/og/card.png", "public, max-age=86400"],
		...siteFiles.map((path) => [path, "public, max-age=3600"]),
	]) {
		const edit = await ask(path, EDIT_COOKIE);
		if (edit.cache !== PRIVATE) problems.push(`${path} in edit mode: Cache-Control is "${edit.cache}", not "${PRIVATE}"`);
		const preview = await ask(`${path}?_preview=x`);
		if (preview.cache !== PRIVATE) problems.push(`${path}?_preview=x: Cache-Control is "${preview.cache}", not "${PRIVATE}"`);
		const anon = await ask(path);
		if (anon.cache !== publicCache) problems.push(`${path} anonymous: Cache-Control is "${anon.cache}", not "${publicCache}"`);
	}
	return problems;
}
