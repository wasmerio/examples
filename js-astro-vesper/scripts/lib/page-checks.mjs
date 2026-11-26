/**
 * Vesper's checks of one built page's HTML, for scripts/theme-tests.mjs's `assertPages` (the content tests run them
 * on every source) and the unit tests (scripts/units/page-checks.test.mjs). Each returns a list of problems.
 *
 *   homeProblems(html)                 the home page: one h1, the collage band, the post rows, the feed link
 *   articleProblems(path, html)        an article: contents links resolve; the long post's contents and hero srcset
 *   listHeadProblems(path, html)       a list page's or the Now page's head from its pages entry
 *   headingProblems(path, html)        the heading outline in <main> starts at h1 and skips no level
 *   reservedIdProblems(path, html)     the layout's ids appear at most once
 *   srcsetProblems(path, html)         every content image in <main> but an SVG has a srcset
 *   lightboxProblems(path, html, exp)  the lightbox dialog where photos open large, and those photo links
 *
 * mainLinks(html) gives the site paths a page links to in <main>, for the link check; lightboxTriggers(html) the photo
 * links (data-lightbox) in page order, for the lightbox checks and the large-file check; textFigures(html) the text
 * figures, with their captions and links.
 */
import { attrs } from "@astronomic/theme-core/scripts/harness.mjs";
import { parse } from "parse5";
import { reservedIds } from "../../src/utils/ids.ts";
import { safeImageUrl } from "../../src/utils/lightbox-image.ts";

/** The long post: the table of contents, the series, the hero photo. */
export const LONG_POST = "/articles/designing-for-people-who-are-offline-on-purpose";

/**
 * The home page: one h1, the collage band with its six demo photos (each an image with alt text), the newest posts'
 * rows each linking to a post, and the feed link in the head.
 */
export function homeProblems(html) {
	const problems = [];
	const h1s = (html.match(/<h1\b/g) ?? []).length;
	if (h1s !== 1) problems.push(`/: ${h1s} h1 elements (one expected)`);
	const band = html.match(/<section\b[^>]*\bclass="v-band"[^>]*>[\s\S]*?<\/section>/)?.[0];
	if (!band) problems.push("/: no collage band");
	else {
		const figures = band.match(/<figure\b[\s\S]*?<\/figure>/g) ?? [];
		if (figures.length !== 6) problems.push(`/: the band has ${figures.length} figures (6 expected)`);
		for (const [i, figure] of figures.entries()) {
			const img = figure.match(/<img\b[^>]*>/)?.[0];
			if (!img || !attrs(img).alt?.trim()) problems.push(`/: collage photo ${i + 1} has no image with alt text`);
		}
	}
	const rows = [...html.matchAll(/<li\b[^>]*\bdata-post\b[\s\S]*?<\/li>/g)].map((m) => m[0]);
	if (rows.length === 0) problems.push("/: no post rows");
	for (const row of rows) {
		const link = /<h[23]\b[^>]*data-post-title[^>]*>\s*<a\b[^>]*href="([^"]+)"/.exec(row)?.[1];
		if (!link || !/^\/articles\/[a-z0-9-]+$/.test(link)) problems.push(`/: a post row links to ${link ?? "nothing"}`);
	}
	const head = html.match(/<head[\s\S]*?<\/head>/)?.[0] ?? "";
	const feed = [...head.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0])).filter((a) => a.rel === "alternate" && a.type === "application/rss+xml");
	if (feed.length !== 1 || !/\/rss\.xml$/.test(feed[0].href ?? "")) problems.push(`/: ${feed.length} feed links in the head (one to /rss.xml expected)`);
	return problems;
}

/**
 * An article: every table of contents link names an id in the text, the hero photo has a srcset (both sources), and
 * the long post shows its contents.
 */
export function articleProblems(path, html) {
	const problems = [];
	const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
	const toc = main.match(/<div\b[^>]*class="v-toc"[^>]*>[\s\S]*?<\/nav>/)?.[0];
	const ids = new Set([...main.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
	for (const m of toc?.matchAll(/href="#([^"]+)"/g) ?? []) if (!ids.has(m[1])) problems.push(`${path}: the contents link #${m[1]} has no target`);
	const cat = main.match(/<a\b[^>]*data-art-cat[^>]*>/)?.[0];
	if (cat && !/^\/articles\/category\/[a-z0-9-]+$/.test(attrs(cat).href ?? "")) problems.push(`${path}: the category links to ${attrs(cat).href ?? "nothing"}`);
	if (path === LONG_POST) {
		if (!cat) problems.push(`${path}: no category link in the head`);
		if (!toc) problems.push(`${path}: no table of contents`);
		const hero = main.match(/<div\b[^>]*data-media-frame[^>]*>\s*<img\b[^>]*>/)?.[0];
		if (!hero || !/\bsrcset="[^"]+"/.test(hero)) problems.push(`${path}: the hero photo has no srcset`);
	}
	return problems;
}

/**
 * The demo's pages entries for the list pages (content/pages/{projects,speaking,uses}.md, seed "pages-*"): each sets
 * its page's h1 and lead, and /now shows its photo's caption (/uses shows no page photo). Without such an entry
 * the head is the theme's words (scripts/units/sections.test.mjs and search.test.mjs cover that path).
 */
const LIST_HEADS = {
	"/projects": { h1: "Things I’ve made to get outside more and squint less.", lead: "Some are client work at Switchback Studio" },
	"/speaking": { h1: "Talks about calm software and the outdoors.", lead: "I speak a few times a year" },
	"/uses": { h1: "What’s in the bag, and on the desk.", lead: "People ask, so here it is." },
	"/now": { h1: "What I’m doing now.", caption: "Last weekend’s walk, 9.4 miles." },
};

/** The text of an HTML fragment: no tags, the entities the pages use decoded, spaces collapsed. */
const textOf = (html) =>
	html
		.replace(/<[^>]*>/g, "")
		.replace(/&#39;|&#x27;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, "&")
		.replace(/\s+/g, " ")
		.trim();

/** Problems with a list page's or the Now page's head: the pages entry's title and lead show, and the Now page's caption. */
export function listHeadProblems(path, html) {
	const want = LIST_HEADS[path];
	if (!want) return [];
	const problems = [];
	const main = mainOf(html);
	const h1 = textOf(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
	if (h1 !== want.h1) problems.push(`${path}: the h1 is ${JSON.stringify(h1)}, expected the pages entry's ${JSON.stringify(want.h1)}`);
	const lead = textOf(main.match(/<p\b[^>]*data-head-lead[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "");
	if (want.lead && !lead.startsWith(want.lead)) problems.push(`${path}: the lead is ${JSON.stringify(lead)}, expected the pages entry's`);
	if (want.caption) {
		const caption = textOf(main.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/)?.[1] ?? "");
		if (caption !== want.caption) problems.push(`${path}: the photo's caption is ${JSON.stringify(caption)}, expected ${JSON.stringify(want.caption)}`);
	}
	return problems;
}

/** The article lists: /articles and its pages, a category's and a tag's pages. */
export const isPostListPath = (path) => /^\/articles(\/page\/\d+)?$|^\/articles\/category\/[^/]+(\/page\/\d+)?$|^\/tags\/[^/]+(\/page\/\d+)?$/.test(path);

/**
 * An article list in the theme's default layout (`articleList: "grid"`): the card grid, each card's
 * title linking to a post, and each card's top a photo or, for a post with none, the tile (never an empty gap).
 */
export function postListProblems(path, html) {
	if (!isPostListPath(path)) return [];
	const main = mainOf(html);
	const grid = main.match(/<ol\b[^>]*data-post-grid[^>]*>[\s\S]*<\/ol>/)?.[0];
	if (!grid) return [`${path}: no card grid`];
	const problems = [];
	const cards = [...grid.matchAll(/<li\b[^>]*data-post-card[\s\S]*?<\/li>/g)].map((m) => m[0]);
	if (cards.length === 0) problems.push(`${path}: the grid has no cards`);
	for (const [i, card] of cards.entries()) {
		const link = /<h2\b[^>]*data-post-title[^>]*>\s*<a\b[^>]*href="([^"]+)"/.exec(card)?.[1];
		if (!link || !/^\/articles\/[a-z0-9-]+$/.test(link)) problems.push(`${path}: card ${i + 1} links to ${link ?? "nothing"}`);
		if (!/<img\b/.test(card) && !/data-post-tile/.test(card)) problems.push(`${path}: card ${i + 1} has neither a photo nor a tile`);
	}
	return problems;
}

/**
 * /uses: a jump link to each group that lands on its id, the demo's group photo with its alt
 * text, the demo's button link, and no photo outside the groups (no page photo). /speaking: a talk's meta line has its slashes hidden from screen readers.
 */
export function sectionPageProblems(path, html) {
	const main = mainOf(html);
	const problems = [];
	if (path === "/uses") {
		const jump = main.match(/<nav\b[^>]*data-jump[^>]*>[\s\S]*?<\/nav>/)?.[0];
		const ids = new Set([...main.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
		const groups = [...main.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*data-uses-group/g)].map((m) => m[1]);
		const targets = [...(jump ?? "").matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
		if (!jump) problems.push(`${path}: no jump links`);
		for (const id of targets) if (!ids.has(id)) problems.push(`${path}: the jump link #${id} has no target`);
		if (jump && targets.join(" ") !== groups.join(" ")) problems.push(`${path}: the jump links (${targets.join(", ")}) are not the groups (${groups.join(", ")})`);
		if (!main.includes('alt="A film camera resting on sand at the edge of the water"')) problems.push(`${path}: no group photo with its alt text`);
		if (!/<a\b[^>]*href="https:\/\/example\.com\/darkroom-notes"[^>]*>\s*Try Darkroom Notes/.test(main)) problems.push(`${path}: no "Try Darkroom Notes" link`);
		const outside = main.replace(/<section\b[^>]*data-uses-group[^>]*>[\s\S]*?<\/section>/g, "");
		if (/<img\b/.test(outside)) problems.push(`${path}: a photo outside the groups (the page shows no photo of its own)`);
	}
	if (path === "/speaking") {
		const meta = main.match(/<p\b[^>]*data-talk-meta[^>]*>[\s\S]*?<\/p>/)?.[0] ?? "";
		const seps = [...meta.matchAll(/<span\b[^>]*data-sep[^>]*>/g)].map((m) => m[0]);
		if (seps.length === 0) problems.push(`${path}: a talk's meta line has no separators`);
		if (seps.some((sep) => !/aria-hidden="true"/.test(sep))) problems.push(`${path}: a separator is not hidden from screen readers`);
	}
	return problems;
}

/** The <main> of a page. */
export const mainOf = (html) => html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";

/** The site paths `html` links to inside <main> (no query, no fragment, no file). */
export const mainLinks = (html) => [...mainOf(html).matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)"/g)].map((m) => m[1]).filter((href) => !/\.[a-z0-9]+$/i.test(href));

/** Problems with a page's heading outline in <main>: it starts at h1 and never skips a level going down. */
export function headingProblems(path, html) {
	const levels = [...mainOf(html).matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
	const problems = [];
	if (levels.length && levels[0] !== 1) problems.push(`${path}: the first heading in <main> is h${levels[0]}, not h1`);
	for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) problems.push(`${path}: h${levels[i - 1]} then h${levels[i]} (a skipped level)`);
	return problems;
}

/**
 * The ids the layout and pages use (src/utils/ids.ts) appear at most once on a page. The theme's own section headings
 * carry them (the home page's, "More projects", the work history), so a heading in the text that took one would
 * make it twice; the text's headings get "-2" instead (outline's `reserved`).
 */
export function reservedIdProblems(path, html) {
	const problems = [];
	const ids = [...html.matchAll(/\sid\s*=\s*["']([^"']*)["']/g)].map((m) => m[1]);
	for (const id of reservedIds) {
		const n = ids.filter((i) => i === id).length;
		if (n > 1) problems.push(`${path}: id "${id}" appears ${n} times`);
	}
	return problems;
}

/**
 * Content images (photos from the source, in <main>) carry a srcset in every source, so a phone never loads the
 * full photo. An SVG needs none.
 */
export function srcsetProblems(path, html) {
	const problems = [];
	for (const [img] of mainOf(html).matchAll(/<img\b[^>]*>/g)) {
		const a = attrs(img);
		if (/\.svg(\?|$)/.test(a.src ?? "")) continue;
		if (!a.srcset?.trim()) problems.push(`${path}: an image with no srcset (${a.src})`);
	}
	return problems;
}

/** The demo post's text photo caption (Markdown: the image title; EmDash: the image block's caption). */
export const LIGHTBOX_CAPTION = "Stevens Pass, Washington, 2025. Our test site for glare and cold batteries.";

/**
 * What the demo's photo pages show, past the rules every page follows (lightboxProblems): `count` photo links; with
 * `hero`, the first is the page's hero photo (PhotoLink's v-photo-link); `captions`, the text figures' captions in
 * order; `linked`, text figures whose photo keeps its own link (`href`) and shows `caption`, with no photo link in
 * them. The long post: the hero, then the captioned text photo. A post or project with a hero only: one link; a
 * project with no photo: none (the page still carries its dialog). Home: the six
 * collage photos, so the page carries its one dialog. Now: its photo. The demo's About photo is the 480px avatar, under
 * the size that opens large (src/utils/lightbox-image.ts ABOUT_MIN_WIDTH): none, and no dialog.
 */
export const LIGHTBOX_PAGES = {
	[LONG_POST]: { count: 2, hero: true, captions: [LIGHTBOX_CAPTION] },
	"/articles/two-days-on-a-trail-crew": { count: 1, hero: true },
	"/projects/ridgeline": { count: 1, hero: true },
	"/projects/larch-watch": { count: 0 },
	"/": { count: 6 },
	"/now": { count: 1, hero: true },
	"/about": { count: 0 },
};

/** The text figures a photo link can sit in (src/utils/lightbox-html.ts): Markdown's, EmDash's image and gallery item. */
const TEXT_FIGURES = ["v-fig", "emdash-image", "emdash-gallery-item"];

const attrOf = (el, name) => el.attrs?.find((a) => a.name === name)?.value;
const classesOf = (el) => (attrOf(el, "class") ?? "").split(/\s+/).filter(Boolean);
const textOfNode = (node) => (node.nodeName === "#text" ? node.value : (node.childNodes ?? []).map(textOfNode).join(""));

/**
 * The photo links (any `data-lightbox`) on a page, in page order: `href`, `group`, the alt of the image inside, `hero`
 * (a PhotoLink: hero, Now or About photo), `figure` (the text figure's class it sits in, if any) and that figure's
 * caption text (trimmed; undefined with no figcaption).
 */
export function lightboxTriggers(html) {
	const out = [];
	const walk = (node, figure) => {
		for (const child of node.childNodes ?? []) {
			if (!child.tagName) continue;
			const own = child.tagName === "figure" ? classesOf(child).find((c) => TEXT_FIGURES.includes(c)) : undefined;
			const fig = own ? { kind: own, el: child } : figure;
			if (child.tagName === "a" && attrOf(child, "data-lightbox") !== undefined) {
				const img = [child].flatMap(function all(n) { return [n, ...(n.childNodes ?? []).flatMap(all)]; }).find((n) => n.tagName === "img");
				const caption = fig?.el.childNodes.find((n) => n.tagName === "figcaption");
				out.push({
					href: attrOf(child, "href"),
					group: attrOf(child, "data-lightbox"),
					alt: img ? (attrOf(img, "alt") ?? "") : undefined,
					hero: classesOf(child).includes("v-photo-link"),
					figure: fig?.kind,
					caption: caption ? textOfNode(caption).trim() : undefined,
				});
			}
			walk(child, fig);
		}
	};
	walk(parse(html));
	return out;
}

/**
 * The text figures on a page (TEXT_FIGURES), in page order: `kind` (the class), `caption` (trimmed; undefined with no
 * figcaption), `link` (the href of a link in it that is no photo link) and `trigger` (it holds a photo link).
 */
export function textFigures(html) {
	const out = [];
	const walk = (node) => {
		for (const child of node.childNodes ?? []) {
			if (!child.tagName) continue;
			const kind = child.tagName === "figure" ? classesOf(child).find((c) => TEXT_FIGURES.includes(c)) : undefined;
			if (kind) {
				const all = [child].flatMap(function each(n) { return [n, ...(n.childNodes ?? []).flatMap(each)]; });
				const links = all.filter((n) => n.tagName === "a");
				const caption = child.childNodes.find((n) => n.tagName === "figcaption");
				out.push({
					kind,
					caption: caption ? textOfNode(caption).trim() : undefined,
					link: attrOf(links.find((a) => attrOf(a, "data-lightbox") === undefined && attrOf(a, "href") !== undefined) ?? {}, "href"),
					trigger: links.some((a) => attrOf(a, "data-lightbox") !== undefined),
				});
			}
			walk(child);
		}
	};
	walk(parse(html));
	return out;
}

/** An article or a project: the page always carries the lightbox (Base `lightbox`), with a photo or not. */
const alwaysLightbox = (path) => /^\/articles\/(?!page\/|category\/)[^/]+$|^\/projects\/[^/]+$/.test(path);
/** Pages that carry the lightbox only when one of their photos opens large. */
const LIGHTBOX_WHEN_PHOTO = new Set(["/", "/now", "/about"]);

/**
 * The lightbox on one page. An article or project: exactly one `dialog[data-lightbox-dialog]`. Home, Now and About:
 * one when the page has a photo link, else none. Every other page: no dialog and no photo link. Every photo link is in
 * the set "photos", has an href that safeImageUrl() (src/utils/lightbox-image.ts) accepts and holds an image with
 * alt words. Then `expected` (LIGHTBOX_PAGES for the demo's
 * pages; theme-tests.mjs passes the fixture post's): see LIGHTBOX_PAGES.
 */
export function lightboxProblems(path, html, expected = LIGHTBOX_PAGES[path]) {
	const problems = [];
	const dialogs = (html.match(/<dialog\b[^>]*\bdata-lightbox-dialog\b/g) ?? []).length;
	const triggers = lightboxTriggers(html);
	if (alwaysLightbox(path)) {
		if (dialogs !== 1) problems.push(`${path}: ${dialogs} lightbox dialogs (one expected)`);
	} else if (LIGHTBOX_WHEN_PHOTO.has(path)) {
		if (dialogs > 1) problems.push(`${path}: ${dialogs} lightbox dialogs (at most one expected)`);
		if (dialogs && !triggers.length) problems.push(`${path}: a lightbox dialog with no photo link`);
		if (!dialogs && triggers.length) problems.push(`${path}: photo links but no lightbox dialog`);
	} else {
		if (dialogs) problems.push(`${path}: a lightbox dialog on a page with no photos that open large`);
		if (triggers.length) problems.push(`${path}: a photo link on a page with no photos that open large`);
	}
	for (const [i, t] of triggers.entries()) {
		const name = `${path}: photo link ${i + 1}${t.href ? ` (${t.href})` : ""}`;
		if (!t.href) problems.push(`${path}: photo link ${i + 1} has no href`);
		else if (safeImageUrl(t.href) === undefined) problems.push(`${name} is not a safe image address`);
		if (t.group !== "photos") problems.push(`${name} is in the set "${t.group}", not "photos"`);
		if (!t.alt?.trim()) problems.push(`${name} has no image with alt text`);
	}
	if (!expected) return problems;
	if (triggers.length !== expected.count) problems.push(`${path}: ${triggers.length} photo links (${expected.count} expected)`);
	if (expected.hero && triggers.length && !triggers[0].hero) problems.push(`${path}: the first photo link is not the hero photo`);
	const first = expected.hero ? 1 : 0;
	for (const [j, caption] of (expected.captions ?? []).entries()) {
		const t = triggers[first + j];
		if (!t) continue;
		const name = `${path}: photo link ${first + j + 1}`;
		if (!t.figure) problems.push(`${name} is not in a text figure (${TEXT_FIGURES.join(", ")})`);
		else if (t.caption !== caption) problems.push(`${name}'s caption is "${t.caption ?? ""}", not "${caption}"`);
	}
	if (expected.linked?.length) {
		const figures = textFigures(html);
		for (const { href, caption } of expected.linked) {
			const fig = figures.find((f) => f.link === href);
			if (!fig) problems.push(`${path}: no text figure with its own link to ${href}`);
			else {
				if (fig.trigger) problems.push(`${path}: the linked photo (${href}) also has a photo link`);
				if (fig.caption !== caption) problems.push(`${path}: the linked photo (${href})'s caption is "${fig.caption ?? ""}", not "${caption}"`);
			}
		}
	}
	return problems;
}
