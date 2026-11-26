/** The content tests' page checks (scripts/lib/page-checks.mjs): each passes a good page and names what breaks a bad one. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { articleProblems, headingProblems, homeProblems, isPostListPath, LIGHTBOX_CAPTION, LONG_POST, lightboxProblems, lightboxTriggers, listHeadProblems, mainLinks, postListProblems, reservedIdProblems, sectionPageProblems, srcsetProblems } from "../lib/page-checks.mjs";

const page = (main, head = "") => `<html><head>${head}</head><body><main id="main">${main}</main></body></html>`;
const feed = '<link rel="alternate" type="application/rss+xml" href="https://example.com/rss.xml">';
const figure = (alt) => `<figure><img src="/a.jpg" alt="${alt}"></figure>`;
const band = (figures) => `<section class="v-band">${figures.join("")}</section>`;
const row = (href) => `<li data-post><h3 data-post-title><a href="${href}">A post</a></h3></li>`;
const goodHome = (over = {}) =>
	page(
		`<h1>Hi</h1>${over.band ?? band(Array.from({ length: 6 }, (_, i) => figure(`Photo ${i}`)))}<ul>${over.rows ?? row("/articles/a-post") + row("/articles/b-post")}</ul>${over.extra ?? ""}`,
		over.head ?? feed,
	);

test("home: a good page passes", () => {
	assert.deepEqual(homeProblems(goodHome()), []);
});

test("home: two h1s, a missing band, a short band, a photo with no alt", () => {
	assert.match(homeProblems(goodHome({ extra: "<h1>Again</h1>" })).join("\n"), /2 h1 elements/);
	assert.match(homeProblems(goodHome({ band: "" })).join("\n"), /no collage band/);
	assert.match(homeProblems(goodHome({ band: band([figure("a"), figure("b")]) })).join("\n"), /2 figures/);
	const blank = band([...Array.from({ length: 5 }, (_, i) => figure(`P${i}`)), figure(" ")]);
	assert.match(homeProblems(goodHome({ band: blank })).join("\n"), /collage photo 6 has no image with alt text/);
});

test("home: no rows, a row that links off the articles, no feed link", () => {
	assert.match(homeProblems(goodHome({ rows: "" })).join("\n"), /no post rows/);
	assert.match(homeProblems(goodHome({ rows: row("/projects/x") })).join("\n"), /a post row links to \/projects\/x/);
	assert.match(homeProblems(goodHome({ head: "" })).join("\n"), /0 feed links/);
});

const toc = (ids) => `<div class="v-toc"><nav>${ids.map((id) => `<a href="#${id}">${id}</a>`).join("")}</nav></div>`;
const hero = (srcset) => `<div data-media-frame><img src="/h.jpg" alt=""${srcset ? ` srcset="${srcset}"` : ""}></div>`;

test("article: a good long post passes, and a short post needs no contents or hero", () => {
	const cat = '<a href="/articles/category/design" data-art-cat class="v-cat">Design</a>';
	assert.deepEqual(articleProblems(LONG_POST, page(`${cat}<h1>T</h1>${hero("/h-400.jpg 400w")}${toc(["one", "two"])}<h2 id="one">One</h2><h2 id="two">Two</h2>`)), []);
	assert.match(articleProblems(LONG_POST, page(`<h1>T</h1>${hero("/h-400.jpg 400w")}${toc(["one", "two"])}<h2 id="one">One</h2><h2 id="two">Two</h2>`)).join("\n"), /no category link/);
	assert.match(articleProblems("/articles/x", page('<a href="/tags/design" data-art-cat>Design</a>')).join("\n"), /the category links to \/tags\/design/);
	assert.deepEqual(articleProblems("/articles/short", page("<h1>T</h1><p>Text</p>")), []);
});

test("article: a contents link with no target, the long post with no contents, a hero with no srcset", () => {
	assert.match(articleProblems("/articles/x", page(`${toc(["one", "gone"])}<h2 id="one">One</h2>`)).join("\n"), /contents link #gone has no target/);
	const bad = articleProblems(LONG_POST, page(`<h1>T</h1>${hero("")}`)).join("\n");
	assert.match(bad, /no table of contents/);
	assert.match(bad, /the hero photo has no srcset/);
});

test("list heads: the pages entry's h1 and lead, and the Now page's caption", () => {
	const uses = "<h1>What’s in the bag, and on the desk.</h1><p data-head-lead>People ask, so here it is. More.</p>";
	assert.deepEqual(listHeadProblems("/uses", page(uses)), []);
	assert.deepEqual(listHeadProblems("/elsewhere", page("")), []);
	const bad = listHeadProblems("/uses", page("<h1>Uses</h1><p data-head-lead>Other words.</p>")).join("\n");
	assert.match(bad, /the h1 is "Uses"/);
	assert.match(bad, /the lead is/);
	assert.match(listHeadProblems("/now", page("<h1>What I’m doing now.</h1><figure><figcaption>Other</figcaption></figure>")).join("\n"), /the photo's caption is "Other"/);
});

test("headings: starts at h1 and never skips a level going down", () => {
	assert.deepEqual(headingProblems("/p", page("<h1>A</h1><h2>B</h2><h3>C</h3><h2>D</h2>")), []);
	assert.deepEqual(headingProblems("/p", page("")), []);
	assert.match(headingProblems("/p", page("<h2>A</h2>")).join("\n"), /first heading in <main> is h2/);
	assert.match(headingProblems("/p", page("<h1>A</h1><h3>B</h3>")).join("\n"), /h1 then h3/);
	// Headings outside <main> do not count.
	assert.deepEqual(headingProblems("/p", `<header><h4>Site</h4></header>${page("<h1>A</h1>")}`), []);
});

test("reserved ids: once is fine, twice is a problem; other ids may repeat", () => {
	assert.deepEqual(reservedIdProblems("/p", page('<h2 id="latest-heading">L</h2><p id="x"></p><p id="x"></p>')), []);
	assert.match(reservedIdProblems("/p", page('<h2 id="work-history">W</h2><h2 id="work-history">W</h2>')).join("\n"), /id "work-history" appears 2 times/);
	// The <main id="main"> wrapper plus a heading that took "main".
	assert.match(reservedIdProblems("/p", page('<h2 id="main">Main</h2>')).join("\n"), /id "main" appears 2 times/);
});

test("srcset: content images need one, an SVG does not, images outside <main> do not count", () => {
	assert.deepEqual(srcsetProblems("/p", `<header><img src="/logo.png"></header>${page('<img src="/a.jpg" srcset="/a-400.jpg 400w"><img src="/m.svg">')}`), []);
	assert.match(srcsetProblems("/p", page('<img src="/b.jpg">')).join("\n"), /an image with no srcset \(\/b\.jpg\)/);
	assert.match(srcsetProblems("/p", page('<img src="/c.jpg" srcset=" ">')).join("\n"), /no srcset/);
});

test("main links: site paths in <main>, no files, queries or fragments", () => {
	const html = `<nav><a href="/nav">N</a></nav>${page('<a href="/articles/a">A</a><a href="/cv.pdf">CV</a><a href="#top">T</a><a href="https://x.com/">X</a><a href="/b?q=1">B</a>')}`;
	assert.deepEqual(mainLinks(html), ["/articles/a"]);
});

const card = (inner, href = "/articles/a-post") => `<li data-post data-post-card>${inner}<h2 data-post-title><a href="${href}">A post</a></h2></li>`;

test("post lists: the card grid, each card a post link with a photo or a tile", () => {
	for (const path of ["/articles", "/articles/page/2", "/articles/category/tools", "/articles/category/tools/page/2", "/tags/film"]) assert.ok(isPostListPath(path), path);
	for (const path of ["/articles/a-post", "/tags", "/uses"]) assert.ok(!isPostListPath(path), path);
	const good = page(`<h1>Articles</h1><ol data-post-grid>${card('<img src="/a.jpg" alt="">')}${card('<div data-post-tile aria-hidden="true"></div>')}</ol>`);
	assert.deepEqual(postListProblems("/articles", good), []);
	assert.deepEqual(postListProblems("/uses", page("")), []);
	assert.match(postListProblems("/tags/film", page('<ol class="v-posts"></ol>')).join("\n"), /no card grid/);
	const bad = postListProblems("/articles", page(`<ol data-post-grid>${card("")}${card('<img src="/a.jpg" alt="">', "/projects/x")}</ol>`)).join("\n");
	assert.match(bad, /card 1 has neither a photo nor a tile/);
	assert.match(bad, /card 2 links to \/projects\/x/);
});

test("uses and speaking: jump links to the groups, the group photo, the button link, no page photo, hidden separators", () => {
	const group = (id, inner = "") => `<section id="${id}" aria-labelledby="${id}-heading" data-uses-group><h2 id="${id}-heading">G</h2>${inner}</section>`;
	const extras = '<img alt="A film camera resting on sand at the edge of the water"><a href="https://example.com/darkroom-notes" class="x">Try Darkroom Notes</a>';
	const jump = (ids) => `<nav aria-label="Groups" data-jump><ul>${ids.map((id) => `<li><a href="#${id}">G</a></li>`).join("")}</ul></nav>`;
	assert.deepEqual(sectionPageProblems("/uses", page(`${jump(["uses-a", "uses-b"])}${group("uses-a", extras)}${group("uses-b")}`)), []);
	// A photo outside the groups would be a page photo, which /uses does not show.
	const photo = '<img alt="Film cameras, a lantern, a notebook and prints spread on a map">';
	assert.match(sectionPageProblems("/uses", page(`${jump(["uses-a", "uses-b"])}${photo}${group("uses-a", extras)}${group("uses-b")}`)).join("\n"), /a photo outside the groups/);
	const bad = sectionPageProblems("/uses", page(`${jump(["uses-a", "uses-gone"])}${group("uses-a")}${group("uses-b")}`)).join("\n");
	assert.match(bad, /#uses-gone has no target/);
	assert.match(bad, /are not the groups/);
	assert.match(bad, /no group photo/);
	assert.match(bad, /Try Darkroom Notes/);
	assert.match(sectionPageProblems("/uses", page(group("uses-a"))).join("\n"), /no jump links/);
	const talk = (sep) => page(`<p data-talk-meta><span>Event</span>${sep}<time>June 1</time></p>`);
	assert.deepEqual(sectionPageProblems("/speaking", talk('<span data-sep aria-hidden="true">/</span><span class="sr-only">, </span>')), []);
	assert.match(sectionPageProblems("/speaking", talk("<span>/</span>")).join("\n"), /no separators/);
	assert.match(sectionPageProblems("/speaking", talk("<span data-sep>/</span>")).join("\n"), /not hidden from screen readers/);
});

// The lightbox: a page's dialog and its photo links (data-lightbox="photos").
const dialog = '<dialog data-lightbox-dialog aria-label="Photo"></dialog>';
const lbPage = (main, extra = dialog) => `<html><head></head><body><main id="main">${main}</main>${extra}</body></html>`;
const heroLink = (alt = "A ridge") => `<a href="/_astro/hero.webp" data-lightbox="photos" class="v-photo-link"><figure><img src="/h.webp" alt="${alt}"></figure></a>`;
const mdFig = (caption = LIGHTBOX_CAPTION, alt = "A tent") => `<figure class="v-fig"><a href="/_astro/tent.webp" data-lightbox="photos"><img src="/t.webp" alt="${alt}"></a>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
const emFig = (caption = LIGHTBOX_CAPTION) => `<figure class="emdash-image" data-astro-cid-x><a href="http://localhost:4601/_emdash/api/media/file/demo/tent.webp" data-lightbox="photos"><img src="/t.webp" alt="A tent"></a><figcaption data-astro-cid-x>${caption}</figcaption></figure>`;

test("lightboxTriggers: each photo link in page order, with its href, alt, kind and caption", () => {
	const triggers = lightboxTriggers(lbPage(`${heroLink()}<p>Text &amp; more</p>${mdFig("Stevens Pass &amp; the &quot;cold&quot;")}${emFig()}<a href="/x">x</a>`));
	assert.deepEqual(
		triggers.map(({ href, group, alt, hero, figure, caption }) => ({ href, group, alt, hero, figure, caption })),
		[
			{ href: "/_astro/hero.webp", group: "photos", alt: "A ridge", hero: true, figure: undefined, caption: undefined },
			{ href: "/_astro/tent.webp", group: "photos", alt: "A tent", hero: false, figure: "v-fig", caption: 'Stevens Pass & the "cold"' },
			{ href: "http://localhost:4601/_emdash/api/media/file/demo/tent.webp", group: "photos", alt: "A tent", hero: false, figure: "emdash-image", caption: LIGHTBOX_CAPTION },
		],
	);
});

test("lightbox: the demo post passes in either source: one dialog, the hero first, then the captioned text photo", () => {
	assert.deepEqual(lightboxProblems(LONG_POST, lbPage(`<h1>T</h1>${heroLink()}${mdFig()}`)), []);
	assert.deepEqual(lightboxProblems(LONG_POST, lbPage(`<h1>T</h1>${heroLink()}${emFig()}`)), []);
});

test("lightbox: the demo post with the photos out of order, a missing caption, a wrong one, or no text figure", () => {
	assert.match(lightboxProblems(LONG_POST, lbPage(`${mdFig()}${heroLink()}`)).join("\n"), /the first photo link is not the hero/);
	assert.match(lightboxProblems(LONG_POST, lbPage(`${heroLink()}${mdFig("")}`)).join("\n"), /photo link 2's caption is "", not "Stevens Pass/);
	assert.match(lightboxProblems(LONG_POST, lbPage(`${heroLink()}${mdFig("Elsewhere")}`)).join("\n"), /photo link 2's caption is "Elsewhere"/);
	assert.match(lightboxProblems(LONG_POST, lbPage(`${heroLink()}${heroLink()}`)).join("\n"), /photo link 2 is not in a text figure/);
	assert.match(lightboxProblems(LONG_POST, lbPage(heroLink())).join("\n"), /1 photo links \(2 expected\)/);
});

test("lightbox: an article or project needs exactly one dialog, even with no photo", () => {
	assert.deepEqual(lightboxProblems("/articles/a-post", lbPage("<p>No photo</p>")), []);
	assert.match(lightboxProblems("/articles/a-post", lbPage(heroLink(), "")).join("\n"), /0 lightbox dialogs \(one expected\)/);
	assert.match(lightboxProblems("/projects/ridgeline", lbPage(heroLink(), dialog + dialog)).join("\n"), /2 lightbox dialogs \(one expected\)/);
	assert.deepEqual(lightboxProblems("/projects/ridgeline", lbPage(heroLink())), []);
	// The demo's projects: Ridgeline has its hero photo, Larch Watch none (the dialog all the same).
	assert.match(lightboxProblems("/projects/ridgeline", lbPage("<p>No photo</p>")).join("\n"), /0 photo links \(1 expected\)/);
	assert.match(lightboxProblems("/projects/ridgeline", lbPage(mdFig())).join("\n"), /the first photo link is not the hero/);
	assert.deepEqual(lightboxProblems("/projects/larch-watch", lbPage("<p>No photo</p>")), []);
	assert.match(lightboxProblems("/projects/larch-watch", lbPage(heroLink())).join("\n"), /1 photo links \(0 expected\)/);
});

test("lightbox: home, Now and About carry the dialog only with a photo link; other pages never", () => {
	// null: the rule alone, without the demo's own expectations (the demo's About photo is too small to open).
	for (const path of ["/", "/now", "/about"]) {
		assert.deepEqual(lightboxProblems(path, lbPage(heroLink()), null), [], path);
		assert.deepEqual(lightboxProblems(path, lbPage("<p>x</p>", ""), null), [], path);
		assert.match(lightboxProblems(path, lbPage("<p>x</p>"), null).join("\n"), /a lightbox dialog with no photo link/, path);
		assert.match(lightboxProblems(path, lbPage(heroLink(), ""), null).join("\n"), /photo links but no lightbox dialog/, path);
	}
	assert.match(lightboxProblems("/about", lbPage(heroLink())).join("\n"), /1 photo links \(0 expected\)/);
	// The demo's own: home's six collage photos and the Now photo, so neither page can lose its dialog unnoticed.
	const collage = (n) => Array.from({ length: n }, (_, i) => `<a href="/_astro/c${i}.webp" data-lightbox="photos"><img src="/c.webp" alt="Photo ${i}"></a>`).join("");
	assert.deepEqual(lightboxProblems("/", lbPage(collage(6))), []);
	assert.match(lightboxProblems("/", lbPage("<p>x</p>", "")).join("\n"), /0 photo links \(6 expected\)/);
	assert.match(lightboxProblems("/", lbPage(collage(5))).join("\n"), /5 photo links \(6 expected\)/);
	assert.deepEqual(lightboxProblems("/now", lbPage(heroLink())), []);
	assert.match(lightboxProblems("/now", lbPage("<p>x</p>", "")).join("\n"), /0 photo links \(1 expected\)/);
	assert.match(lightboxProblems("/now", lbPage(heroLink(), dialog + dialog)).join("\n"), /2 lightbox dialogs/);
	for (const path of ["/speaking", "/uses", "/articles", "/articles/page/2", "/privacy"]) {
		assert.deepEqual(lightboxProblems(path, lbPage("<p>x</p>", "")), [], path);
		assert.match(lightboxProblems(path, lbPage("<p>x</p>")).join("\n"), /a lightbox dialog on a page with no photos/, path);
		assert.match(lightboxProblems(path, lbPage(heroLink(), "")).join("\n"), /a photo link on a page with no photos/, path);
	}
});

test("lightbox: every trigger is in the photos set, with alt words; a page's own expectations (count, hero, caption)", () => {
	assert.match(lightboxProblems("/articles/a", lbPage(heroLink(" "))).join("\n"), /photo link 1 \(\/_astro\/hero\.webp\) has no image with alt text/);
	assert.match(lightboxProblems("/articles/a", lbPage('<a href="/x.webp" data-lightbox="other"><img alt="A"></a>')).join("\n"), /photo link 1 \(\/x\.webp\) is in the set "other", not "photos"/);
	assert.match(lightboxProblems("/articles/a", lbPage('<a data-lightbox="photos"><img alt="A"></a>')).join("\n"), /photo link 1 has no href/);
	// Every href is one safeImageUrl() accepts: a script, data or protocol-relative address is refused; http(s) and paths pass.
	for (const href of ["javascript:alert(1)", "data:image/png;base64,AAAA", "//example.com/x.webp", "java&#9;script:alert(1)", "/x\\y.webp"]) {
		assert.match(lightboxProblems("/articles/a", lbPage(`<a href="${href}" data-lightbox="photos"><img alt="A"></a>`)).join("\n"), /photo link 1 \(.*\) is not a safe image address/, href);
	}
	for (const href of ["/_astro/x.webp", "x.webp", "https://example.com/x.webp", "http://localhost:4601/_emdash/api/media/file/x.webp"]) {
		assert.deepEqual(lightboxProblems("/articles/a", lbPage(`<a href="${href}" data-lightbox="photos"><img alt="A"></a>`)), [], href);
	}
	// The fixture post: one trigger, its titled text photo; the linked photo keeps its link and its caption (a figure,
	// Markdown's or EmDash's), and the decorative photo is plain.
	const cap = "My camera.";
	const fixture = { count: 1, captions: ["Packed for four cold nights, October 2024."], linked: [{ href: "/uses", caption: cap }] };
	const opens = mdFig("Packed for four cold nights, October 2024.");
	const plain = '<p><img src="/a.webp" alt=""></p>';
	const mdLinked = (c = cap, extra = "") => `<figure class="v-fig"><a href="/uses"${extra}><img src="/n.webp" alt="A camera"></a>${c ? `<figcaption>${c}</figcaption>` : ""}</figure>`;
	const emLinked = `<figure class="emdash-image" data-astro-cid-x><a href="/uses"><img src="/n.webp" alt="A camera"></a><figcaption data-astro-cid-x>${cap}</figcaption></figure>`;
	assert.deepEqual(lightboxProblems("/articles/a-fixture-post", lbPage(`${opens}${mdLinked()}${plain}`), fixture), []);
	assert.deepEqual(lightboxProblems("/articles/a-fixture-post", lbPage(`${opens}${emLinked}${plain}`), fixture), []);
	assert.match(lightboxProblems("/articles/a-fixture-post", lbPage(`${opens}${heroLink()}${mdLinked()}`), fixture).join("\n"), /2 photo links \(1 expected\)/);
	assert.match(lightboxProblems("/articles/a-fixture-post", lbPage(`${opens}<p><a href="/uses"><img src="/n.webp" alt="A camera" title="${cap}"></a></p>`), fixture).join("\n"), /no text figure with its own link to \/uses/);
	assert.match(lightboxProblems("/articles/a-fixture-post", lbPage(`${opens}${mdLinked("")}`), fixture).join("\n"), /the linked photo \(\/uses\)'s caption is "", not "My camera\."/);
	const both = `<figure class="v-fig"><a href="/uses"><img src="/n.webp" alt="A camera"></a><a href="/n.webp" data-lightbox="photos"><img src="/n.webp" alt="A camera"></a><figcaption>${cap}</figcaption></figure>`;
	assert.match(lightboxProblems("/articles/a-fixture-post", lbPage(`${opens}${both}`), { ...fixture, count: 2 }).join("\n"), /the linked photo \(\/uses\) also has a photo link/);
	assert.match(lightboxProblems("/articles/two-days-on-a-trail-crew", lbPage(`${heroLink()}${mdFig()}`)).join("\n"), /2 photo links \(1 expected\)/);
	assert.deepEqual(lightboxProblems("/articles/two-days-on-a-trail-crew", lbPage(heroLink())), []);
});
