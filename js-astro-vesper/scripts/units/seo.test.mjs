/** SEO in the Markdown collections (src/content/seo.ts): the `seo:` block's schema and its mapping into the model. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { z } from "astro/zod";
import { isAbsoluteHttpUrl, markdownSeo, seoSchema } from "../../src/content/seo.ts";

/** The block as a collection sees it; a plain string stands in for `image()`. */
const schema = z.object({ seo: seoSchema(z.string()) });
const issues = (seo) => {
	const result = schema.safeParse({ seo });
	assert.equal(result.success, false, JSON.stringify(seo));
	return result.error.issues;
};
/** A stand-in for `h.image(image)?.src`. */
const src = (image) => (image ? `/_astro/${image}` : undefined);

test("seoSchema: every field is optional, and the block may be left out", () => {
	assert.deepEqual(schema.parse({}), {});
	assert.deepEqual(schema.parse({ seo: {} }), { seo: {} });
});

test("seoSchema: texts are trimmed; the four fields pass through", () => {
	const seo = { title: "  Notes from the pass ", description: "Two nights.\n", image: "share.webp", canonical: " https://rowan.com/notes/ " };
	assert.deepEqual(schema.parse({ seo }).seo, { title: "Notes from the pass", description: "Two nights.", image: "share.webp", canonical: "https://rowan.com/notes/" });
	assert.equal(schema.parse({ seo: { canonical: "http://rowan.com/a" } }).seo.canonical, "http://rowan.com/a", "http is allowed");
});

test("seoSchema: an empty or blank text stops the build, naming the key", () => {
	for (const key of ["title", "description"]) {
		for (const value of ["", "  ", "\n"]) {
			const [issue] = issues({ [key]: value });
			assert.deepEqual(issue.path, ["seo", key]);
			assert.match(issue.message, new RegExp(`seo\\.${key} is empty`));
		}
	}
});

test("seoSchema: a canonical that is not an absolute http(s) URL stops the build", () => {
	for (const canonical of ["", "/original-post/", "original-post", "//rowan.com/a", "ftp://rowan.com/a", "javascript:alert(1)", "mailto:rowan", "https://"]) {
		const [issue] = issues({ canonical });
		assert.deepEqual(issue.path, ["seo", "canonical"], canonical);
		assert.match(issue.message, /absolute http\(s\) URL/, canonical);
	}
});

test("seoSchema: a key left blank in YAML (null) gets the same message as an empty one", () => {
	assert.match(issues(null)[0].message, /seo: has no fields under it/);
	for (const key of ["title", "description"]) assert.match(issues({ [key]: null })[0].message, new RegExp(`seo\\.${key} is empty`));
	assert.match(issues({ canonical: null })[0].message, /absolute http\(s\) URL/);
});

test("seoSchema: an unknown key stops the build (noindex stays a top-level key)", () => {
	for (const key of ["noindex", "noIndex", "canonicalUrl"]) assert.equal(issues({ [key]: true })[0].code, "unrecognized_keys", key);
});

test("isAbsoluteHttpUrl", () => {
	for (const ok of ["https://rowan.com", "http://rowan.com/a?b#c", "https://example.com/a/"]) assert.equal(isAbsoluteHttpUrl(ok), true, ok);
	for (const bad of ["", "/a", "rowan.com", "https:rowan.com/a", "data:text/plain,x"]) assert.equal(isAbsoluteHttpUrl(bad), false, bad);
});

test("markdownSeo: nothing set gives undefined; noindex alone stays as it was", () => {
	assert.equal(markdownSeo({}, src), undefined);
	assert.equal(markdownSeo({ seo: {}, noindex: false }, src), undefined);
	assert.deepEqual(markdownSeo({ noindex: true }, src), { noindex: true });
});

test("markdownSeo: the block's fields, the image as its URL, and the top-level noindex", () => {
	const data = { seo: { title: "T", description: "D", image: "share.webp", canonical: "https://rowan.com/t/" }, noindex: true };
	assert.deepEqual(markdownSeo(data, src), { title: "T", description: "D", image: "/_astro/share.webp", canonical: "https://rowan.com/t/", noindex: true });
	assert.deepEqual(markdownSeo({ seo: { description: "D" } }, src), { description: "D" }, "a missing field is left out, so the page's fallback applies");
});

test("the collection config gives posts, projects and pages the block, built on image()", () => {
	const text = readFileSync(new URL("../../src/content.config.ts", import.meta.url), "utf8");
	assert.equal(text.match(/seo: seoSchema\(image\(\)\),/g)?.length, 3);
	const source = readFileSync(new URL("../../src/content/sources/markdown.ts", import.meta.url), "utf8");
	assert.equal(source.match(/seo: seoOf\(e, h\),/g)?.length, 3);
});
