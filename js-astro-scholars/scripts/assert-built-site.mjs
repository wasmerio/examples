import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "yaml";

const root = process.argv[2] ? pathToFileURL(`${resolve(process.argv[2])}/`) : new URL("../dist/", import.meta.url);

async function readDist(path) {
	return readFile(new URL(path, root), "utf8");
}

async function readDistCss() {
	const assetRoot = new URL("_astro/", root);
	const entries = await readdir(assetRoot);
	const cssFiles = entries.filter((entry) => entry.endsWith(".css"));
	const contents = await Promise.all(
		cssFiles.map((file) => readFile(new URL(file, assetRoot), "utf8")),
	);
	return contents.join("\n");
}

async function readDistJs() {
	const assetRoot = new URL("_astro/", root);
	const entries = await readdir(assetRoot);
	const jsFiles = entries.filter((entry) => entry.endsWith(".js"));
	const contents = await Promise.all(
		jsFiles.map((file) => readFile(new URL(file, assetRoot), "utf8")),
	);
	return contents.join("\n");
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function titles(html) {
	return [...html.matchAll(/<title>(.*?)<\/title>/g)].map((match) => match[1]);
}

function countMatches(html, value) {
	return html.split(value).length - 1;
}

function footer(html) {
	return html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "";
}

function main(html) {
	return html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
}

function readAttribute(html, pattern) {
	return html.match(pattern)?.[1] ?? "";
}

function canonicalUrl(html) {
	return readAttribute(html, /<link rel="canonical" href="([^"]+)"/);
}

function assertPageMetadata(html, pageName) {
	const canonical = canonicalUrl(html);
	const ogUrl = readAttribute(
		html,
		/<meta property="og:url" content="([^"]+)"/,
	);
	const ogImage = readAttribute(
		html,
		/<meta property="og:image" content="([^"]+)"/,
	);

	assert(
		titles(html).length === 1 && titles(html)[0].trim(),
		`${pageName} page should emit one non-empty title`,
	);
	assert(
		/^https?:\/\//.test(canonical) && ogUrl === canonical,
		`${pageName} page should emit matching absolute canonical and Open Graph URLs`,
	);
	assert(
		/^https?:\/\//.test(ogImage) &&
			Boolean(readAttribute(html, /<meta property="og:image:alt" content="([^"]+)"/)) &&
			Boolean(readAttribute(html, /<meta name="author" content="([^"]+)"/)) &&
			Boolean(
				readAttribute(
					html,
					/<meta name="twitter:card" content="(summary(?:_large_image)?)"/,
				),
			),
		`${pageName} page should emit complete social and author metadata`,
	);

	return canonical;
}

function assertFilterGroup(html, pageName) {
	assert(
		html.includes('role="group"') &&
			html.includes('aria-label="Filter sections"') &&
			!html.includes('role="toolbar"'),
		`${pageName} page should render filter controls as a labeled button group`,
	);
	assert(
		countMatches(html, 'data-filter="all"') === 1 &&
			html.includes('data-active="true"') &&
			html.includes('aria-pressed="true"'),
		`${pageName} page should render one active all filter button`,
	);
	assert(
		html.includes("data-filter-icon") &&
			html.includes("data-filter-count") &&
			html.includes("data-filter-label"),
		`${pageName} page should render semantic filter button markers`,
	);
}

function assertOptionalFilterGroup(html, pageName) {
	if (html.includes('data-filter="')) {
		assertFilterGroup(html, pageName);
	} else {
		assert(
			!html.includes('role="toolbar"') && !html.includes('data-filter="all"'),
			`${pageName} page should omit filter controls when filtering is unnecessary`,
		);
	}
}

const index = await readDist("index.html");
const siteTitleLink = index.match(/<a[^>]*data-site-title[^>]*>/)?.[0] ?? "";
assert(
	siteTitleLink && !siteTitleLink.includes("aria-label"),
	"site title link should use its visible text as its accessible name",
);
const indexCanonical = assertPageMetadata(index, "home");
assert(
	index.includes('"@type":"ProfilePage"') &&
		index.includes('"@type":"Person"') &&
		index.includes('"@type":"WebSite"'),
	"home page should render linked profile and website structured data",
);
assert(
	index.includes('meta name="astro-view-transitions-enabled" content="true"'),
	"pages should enable Astro client-side navigation",
);
if (index.includes('data-astro-image="constrained"')) {
	assert(
		index.includes('fetchpriority="high"') && index.includes('loading="eager"'),
		"rendered home profile images should use priority loading hints",
	);
}
assert(
	!index.includes("data-abstract-toggle") &&
		(!index.includes("<details") || index.includes("<summary")),
	"home page abstracts should use native disclosure elements when rendered",
);
if (index.includes('id="selected-publications"')) {
	assert(
		main(index).includes("data-publication-list"),
		"selected publications should use the shared publication list",
	);
}

const research = await readDist("researches/index.html");
const researchCanonical = assertPageMetadata(research, "research");
assertOptionalFilterGroup(research, "research");
assert(
	!research.includes('aria-label="Page sections"') &&
		!research.includes("data-abstract-toggle") &&
		(!research.includes("<details") || research.includes("<summary")),
	"research filters should not duplicate section navigation and abstracts should work natively when rendered",
);
assert(
	(main(research).includes("data-publication-list") && !research.includes("data-empty-publications")) ||
		(research.includes('data-publication-total="0"') && research.includes("data-empty-publications") && !main(research).includes("data-publication-list")),
	"research should render publication lists or an explicit empty state",
);

const about = await readDist("about/index.html");
const aboutCanonical = assertPageMetadata(about, "about");
assert(
	footer(index) === footer(about) && footer(index).includes(`&copy; ${new Date().getFullYear()}`),
	"all pages should render the same configured copyright footer",
);

const detailCanonicals = [];
for (const collection of ["posts", "projects", "teaching"]) {
	const listing = await readDist(`${collection}/index.html`);
	assertPageMetadata(listing, collection);
	if (collection !== "posts") {
		assertOptionalFilterGroup(listing, collection);
		assert(!main(listing).includes('target="_blank"'), `${collection} listings should link to internal details`);
	}
	if (collection === "teaching") {
		assert(!listing.includes('aria-label="Page sections"'), "teaching filters should not duplicate section navigation");
	}
	const builtSources = new Set();
	const detailFiles = (await readdir(new URL(`${collection}/`, root), { recursive: true }))
		.map((file) => file.replaceAll("\\", "/"))
		.filter((file) => file.endsWith("/index.html"));
	for (const file of detailFiles) {
		const detail = await readDist(`${collection}/${file}`);
		if (collection !== "teaching") {
			assert(main(listing).includes(`href="/${collection}/${file.slice(0, -11)}"`), `${collection}/${file} needs a link from its index`);
		}
		detailCanonicals.push(assertPageMetadata(detail, `${collection}/${file}`));
		const source = decodeURIComponent(readAttribute(detail, /<meta name="content-source" content="([^"]+)"/));
		assert(source && !builtSources.has(source), `detail ${collection}/${file} needs a unique content source`);
		builtSources.add(source);
		assert(main(detail).includes(`href="/${collection}"`), `${collection}/${file} needs a link back to its index`);
		assert(!main(detail).includes('target="_blank"') || main(detail).includes('rel="noopener noreferrer"'), `${collection}/${file} needs safe external links`);
		if (collection === "posts") {
			assert(detail.includes('meta property="og:type" content="article"') && detail.includes('"@type":"BlogPosting"') && detail.includes('"@type":"BreadcrumbList"'), "posts should render article metadata and structured data");
		}
		const otherOfferings = detail.match(/<section aria-labelledby="other-offerings">[\s\S]*?<\/section>/)?.[0];
		if (otherOfferings) {
			assert(otherOfferings.includes('href="/teaching/') && !otherOfferings.includes(`href="/teaching/${file.slice(0, -11)}"`), "other offerings should link to related courses, not themselves");
		}
	}

	// Compare files to pages, so an unsupported extension or duplicate ID cannot silently disappear.
	const contentRoot = new URL(`../src/content/${collection}/`, root);
	const sourceFiles = await readdir(contentRoot, { recursive: true }).catch((error) => {
		if (error.code === "ENOENT") return [];
		throw error;
	});
	let publishedCount = 0;
	for (const file of sourceFiles.filter((file) => /\.mdx?$/.test(file))) {
		const text = await readFile(new URL(file.split(/[\\/]/).map(encodeURIComponent).join("/"), contentRoot), "utf8");
		const frontmatter = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
		assert(frontmatter !== undefined, `${collection}/${file} needs YAML frontmatter`);
		const data = parse(frontmatter);
		const source = `src/content/${collection}/${file.replaceAll("\\", "/")}`;
		const draft = data?.draft === true;
		assert(builtSources.has(source) === !draft, `${source} ${draft ? "must not publish a draft" : "has no generated detail page"}`);
		if (!draft) publishedCount++;
	}
	assert(builtSources.size === publishedCount, `${collection} has unexpected or missing detail pages`);
}

const sitemap = await readDist("sitemap-0.xml");
assert(
	[indexCanonical, aboutCanonical, researchCanonical, ...detailCanonicals]
		.filter(Boolean)
		.every((url) => sitemap.includes(url)),
	"sitemap should use the configured production URL",
);
const robots = await readDist("robots.txt");
assert(
	robots.includes("User-agent: *") &&
		robots.includes("Allow: /") &&
		robots.includes(`Sitemap: ${new URL("sitemap-index.xml", indexCanonical)}`),
	"robots.txt should be generated from the configured production URL",
);

const css = await readDistCss();
assert(
	css.includes(".min-h-10{min-height:2.5rem}"),
	"filter button touch target utility should be generated in CSS",
);
assert(
	/@media\s*\(prefers-reduced-motion:reduce\)/.test(css) &&
		css.includes("animation-duration:.01ms!important") &&
		css.includes("animation-iteration-count:1!important") &&
		css.includes("scroll-behavior:auto!important") &&
		css.includes("transition-duration:.01ms!important"),
	"layout should include global reduced-motion overrides",
);

const js = await readDistJs();
assert(
	js.includes("mobile-menu-toggle") &&
		js.includes("back-to-top") &&
		js.includes("prefers-reduced-motion: reduce") &&
		js.includes("astro:page-load") &&
		js.includes("AbortController"),
	"layout browser behavior should be bundled in generated JavaScript",
);

assert(css.includes("bg-accent-950"), "dark accent backgrounds must be generated from a defined color token");
for (const html of [index, research]) {
	for (const dialog of html.matchAll(/<dialog[^>]+id="([^"]+)"[^>]*>/g)) {
		assert(dialog[0].includes(`aria-labelledby="${dialog[1]}-title"`) && html.includes(`id="${dialog[1]}-title"`), "citation dialogs should have an accessible name");
	}
}
