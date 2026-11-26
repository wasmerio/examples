/**
 * The large file a photo opens in the lightbox (src/utils/lightbox-image.ts): the widths for a local image, the file
 * per source kind (with a fake getImage, so plain Node runs it), which photos are triggers, and the home collage.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { ABOUT_MIN_WIDTH, collageCaption, collageHasTrigger, collageOpens, isTrigger, largeWidths, lightboxImage, safeImageUrl } from "../../src/utils/lightbox-image.ts";

/** A getImage stand-in: records its calls and answers "/_astro/<name>.<width>.webp" at the asked width. */
function fakeGetImage() {
	const calls = [];
	const getImage = async ({ src, width }) => {
		calls.push(width);
		return { src: `/_astro/${src.name}.${width}.webp`, attributes: { width, height: Math.round((width * src.height) / src.width) } };
	};
	return { calls, getImage };
}

const local = (width, height = Math.round(width * 0.63)) => ({
	src: `/src/media/tent.webp`,
	alt: "A small tent",
	width,
	height,
	source: { kind: "astro-image", value: { name: "tent", src: "/src/media/tent.webp", width, height, format: "webp" } },
});

test("largeWidths: 1200, 1800 and 2400, each capped at the photo's width, deduped, ascending", () => {
	assert.deepEqual(largeWidths(3000), [1200, 1800, 2400]);
	assert.deepEqual(largeWidths(2400), [1200, 1800, 2400]);
	assert.deepEqual(largeWidths(1400), [1200, 1400]);
	assert.deepEqual(largeWidths(1200), [1200]);
	assert.deepEqual(largeWidths(900), [900]);
	assert.deepEqual(largeWidths(480), [480]);
});

test("lightboxImage, a local image: href = the largest, a srcset of all, sizes 100vw, the largest's width and height", async () => {
	const { calls, getImage } = fakeGetImage();
	const large = await lightboxImage(local(1400, 882), getImage);
	assert.deepEqual(calls, [1200, 1400]);
	assert.deepEqual(large, {
		href: "/_astro/tent.1400.webp",
		srcset: "/_astro/tent.1200.webp 1200w, /_astro/tent.1400.webp 1400w",
		sizes: "100vw",
		width: 1400,
		height: 882,
	});
	const big = await lightboxImage(local(3000, 2000), fakeGetImage().getImage);
	assert.equal(big.href, "/_astro/tent.2400.webp");
	assert.equal(big.srcset, "/_astro/tent.1200.webp 1200w, /_astro/tent.1800.webp 1800w, /_astro/tent.2400.webp 2400w");
	assert.equal(big.width, 2400);
	assert.equal(big.height, 1600);
});

test("lightboxImage, a local image the size of one file: no srcset (a set of one width says nothing)", async () => {
	const large = await lightboxImage(local(900, 600), fakeGetImage().getImage);
	assert.deepEqual(large, { href: "/_astro/tent.900.webp", width: 900, height: 600 });
});

test("lightboxImage, an EmDash image: href = its media URL, no srcset, getImage never called", async () => {
	const { calls, getImage } = fakeGetImage();
	const image = { src: "https://example.com/_emdash/api/media/file/demo/tent.webp", alt: "A small tent", width: 1400, height: 882, source: { kind: "emdash", value: {} } };
	assert.deepEqual(await lightboxImage(image, getImage), { href: image.src, width: 1400, height: 882 });
	assert.deepEqual(calls, []);
});

test("lightboxImage, no source (or a local one with no size): href = src", async () => {
	const { calls, getImage } = fakeGetImage();
	assert.deepEqual(await lightboxImage({ src: "/photos/a.jpg", alt: "A" }, getImage), { href: "/photos/a.jpg" });
	assert.deepEqual(await lightboxImage({ src: "/photos/a.jpg", alt: "A", width: 800, height: 600 }, getImage), { href: "/photos/a.jpg", width: 800, height: 600 });
	assert.deepEqual(await lightboxImage({ src: "/photos/b.jpg", alt: "B", source: { kind: "astro-image", value: { src: "/photos/b.jpg" } } }, getImage), { href: "/photos/b.jpg" });
	assert.deepEqual(calls, []);
});

test("isTrigger: a photo with alt words; empty or blank alt never", () => {
	assert.equal(isTrigger({ src: "a.webp", alt: "A trail" }), true);
	for (const alt of ["", " ", "\n\t", undefined]) assert.equal(isTrigger({ src: "a.webp", alt }), false, JSON.stringify(alt));
	assert.equal(isTrigger(undefined), false);
});

test("isTrigger: only with a safe src (the same test as the photo link's, so the page's dialog flag agrees)", () => {
	for (const src of ["javascript:alert(1)", "data:image/png;base64,AA", "//example.com/a.webp", "", undefined]) {
		assert.equal(isTrigger({ src, alt: "A trail" }), false, JSON.stringify(src));
		assert.equal(isTrigger({ src, alt: "A trail", width: 2400 }, { minWidth: ABOUT_MIN_WIDTH }), false, JSON.stringify(src));
	}
	assert.equal(isTrigger({ src: "http://localhost:4604/_emdash/api/media/file/demo/a.webp", alt: "A trail" }), true);
});

test("a trigger always has a large file: isTrigger true means lightboxImage gives one", async () => {
	const { getImage } = fakeGetImage();
	for (const image of [local(1400, 882), { src: "https://example.com/a.jpg", alt: "A" }, { src: "/m/a.jpg", alt: "A", source: { kind: "emdash", value: {} } }]) {
		assert.equal(isTrigger(image), true);
		assert.ok(await lightboxImage(image, getImage), image.src);
	}
});

test("isTrigger with minWidth (the About photo): only at that width or wider; an unknown width is not", () => {
	assert.equal(ABOUT_MIN_WIDTH, 1000);
	const at = (width) => isTrigger({ src: "a.webp", alt: "Rowan", width }, { minWidth: ABOUT_MIN_WIDTH });
	assert.equal(at(480), false, "the demo avatar stays a plain photo");
	assert.equal(at(999), false);
	assert.equal(at(1000), true);
	assert.equal(at(2400), true);
	assert.equal(at(undefined), false);
	assert.equal(isTrigger({ src: "a.webp", alt: "", width: 2400 }, { minWidth: ABOUT_MIN_WIDTH }), false, "alt still needed");
});

test("collageHasTrigger: a photo with no link, with alt and a safe file", () => {
	const image = { src: "/_astro/a.webp" };
	assert.equal(collageHasTrigger([]), false);
	assert.equal(collageHasTrigger([{ alt: "A", href: "/x", image }, { alt: "B", href: "https://example.com", image }]), false, "all linked");
	assert.equal(collageHasTrigger([{ alt: "", href: undefined, image }, { alt: " ", image }]), false, "no alt");
	assert.equal(collageHasTrigger([{ alt: "B", image: { src: "javascript:alert(1)" } }, { alt: "C" }]), false, "no safe file");
	assert.equal(collageHasTrigger([{ alt: "A", href: "/x", image }, { alt: "B", image }]), true);
});

test("safeImageUrl: http(s) with a host and paths pass; scripts, data, protocol-relative and backslashes never", () => {
	assert.equal(safeImageUrl("http://localhost:4604/x.webp"), "http://localhost:4604/x.webp");
	assert.equal(safeImageUrl("https://example.com/a.jpg?w=2&amp;q=1"), "https://example.com/a.jpg?w=2&amp;q=1");
	assert.equal(safeImageUrl("/_astro/x.webp"), "/_astro/x.webp");
	assert.equal(safeImageUrl("media/x.webp"), "media/x.webp");
	assert.equal(safeImageUrl("  /_astro/x.webp\n"), "/_astro/x.webp");
	for (const bad of ["javascript:alert(1)", "data:image/svg+xml,<svg/>", " JaVa\tScR\u0000iPt:alert(1)", "java\nscript:x", "//example.com/x.webp", "/\\example.com/x", "https:///x", "http:x", "ftp://host/x", "", "   ", undefined]) {
		assert.equal(safeImageUrl(bad), undefined, JSON.stringify(bad));
	}
});

test("lightboxImage: an unsafe file is no large file (undefined); an unsafe srcset candidate is left out", async () => {
	assert.equal(await lightboxImage({ src: "javascript:alert(1)", alt: "A", source: { kind: "emdash", value: {} } }, fakeGetImage().getImage), undefined);
	assert.equal(await lightboxImage({ src: "data:image/png;base64,AA", alt: "A" }, fakeGetImage().getImage), undefined);
	const odd = async ({ width }) => ({ src: width === 1200 ? "javascript:x" : `/_astro/t.${width}.webp`, attributes: { width, height: 100 } });
	assert.deepEqual(await lightboxImage(local(1400, 882), odd), { href: "/_astro/t.1400.webp", width: 1400, height: 100 });
	// Every made file refused: the image's own src (a safe path), so isTrigger() and lightboxImage() agree.
	const bad = async ({ width }) => ({ src: "javascript:x", attributes: { width, height: 100 } });
	assert.deepEqual(await lightboxImage(local(1400, 882), bad), { href: "/src/media/tent.webp", width: 1400, height: 882 });
	assert.equal(await lightboxImage({ ...local(1400, 882), src: "javascript:x" }, bad), undefined);
});

test("collageCaption: the place and the year, never the map label", () => {
	assert.equal(collageCaption({ place: "Heather Lake, WA", year: 2025, geo: "48.08° N" }), "Heather Lake, WA, 2025");
	assert.equal(collageCaption({ place: "Heather Lake, WA" }), "Heather Lake, WA");
	assert.equal(collageCaption({ year: 2025, geo: "48.08° N" }), "2025");
	assert.equal(collageCaption({ geo: "48.08° N" }), undefined);
	assert.equal(collageCaption({ place: "  " }), undefined);
});

test("collageOpens: no link of its own and alt words", () => {
	const image = { src: "/_astro/lake.webp" };
	assert.equal(collageOpens({ alt: "A lake", image }), true);
	assert.equal(collageOpens({ alt: "A lake", href: "/articles/x", image }), false, "its own link wins");
	assert.equal(collageOpens({ alt: "", image }), false);
	assert.equal(collageOpens({ alt: " ", image }), false);
	assert.equal(collageOpens({ alt: "A lake", image: { src: "data:image/png;base64,AA" } }), false, "an unsafe file");
});
