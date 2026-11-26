/** Alt text in the Markdown collections (src/content/alt.ts): a content photo that is set needs words; whitespace is none. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { z } from "astro/zod";
import { altForImages, altText, requiredAlt } from "../../src/content/alt.ts";

const schema = z
	.object({ image: z.string().optional(), imageAlt: altText.optional(), logo: z.string().optional(), logoAlt: altText.optional() })
	.superRefine(altForImages([["image", "imageAlt"]]));

test("altForImages: an image that is set needs alt text with words in it", () => {
	for (const imageAlt of [undefined, "", " ", "\n\t "]) {
		const result = schema.safeParse({ image: "a.webp", imageAlt });
		assert.equal(result.success, false, JSON.stringify(imageAlt));
		assert.deepEqual(result.error.issues.map((i) => i.path), [["imageAlt"]]);
	}
	assert.deepEqual(schema.parse({ image: "a.webp", imageAlt: "  A trail in fog  " }), { image: "a.webp", imageAlt: "A trail in fog" }, "trimmed");
});

test("altForImages: no image, no alt needed; a pair it was not given (a logo) stays optional", () => {
	assert.equal(schema.safeParse({}).success, true);
	assert.equal(schema.safeParse({ imageAlt: "" }).success, true);
	assert.equal(schema.safeParse({ logo: "l.svg" }).success, true);
});

test("requiredAlt (the collage): whitespace alone is no alt text", () => {
	for (const alt of ["", " ", "\n"]) assert.equal(requiredAlt.safeParse(alt).success, false, JSON.stringify(alt));
	assert.equal(requiredAlt.parse(" Larches in October "), "Larches in October");
});

test("the collection config uses them for every content photo, and leaves the logo and the avatar optional", async () => {
	const { readFileSync } = await import("node:fs");
	const text = readFileSync(new URL("../../src/content.config.ts", import.meta.url), "utf8");
	for (const pair of ['["thumbnail", "thumbnailAlt"]', '["groupImage", "groupImageAlt"]']) assert.ok(text.includes(`altForImages([${pair}])`), pair);
	assert.equal(text.match(/altForImages\(\[\["image", "imageAlt"\]\]\)/g)?.length, 2, "projects and pages");
	assert.match(text, /alt: requiredAlt,/);
	assert.match(text, /avatarAlt: z\.string\(\)\.optional\(\)/);
});
