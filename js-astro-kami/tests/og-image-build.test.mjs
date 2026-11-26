import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

test("generated Chinese OG images pass raster sanity checks at the expected dimensions", async () => {
	const chineseOgImages = (await readdir(new URL("../dist/og-image/zh/", import.meta.url))).filter(
		(file) => file.endsWith(".png"),
	);
	assert.ok(chineseOgImages.length > 0, "missing generated Chinese OG images");

	for (const filename of chineseOgImages) {
		const png = await readFile(new URL(`../dist/og-image/zh/${filename}`, import.meta.url));

		assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
		assert.equal(png.readUInt32BE(16), 1200, `${filename} width`);
		assert.equal(png.readUInt32BE(20), 630, `${filename} height`);
		assert.ok(png.byteLength > 12 * 1024, `${filename} is suspiciously small`);
	}
});

test("the complete build-time Chinese font is not deployed as a static asset", async () => {
	const dist = new URL("../dist/", import.meta.url);
	const files = await readdir(dist, { recursive: true });
	assert.ok(files.every((file) => !/MapleMono-CN-Regular\.ttf$/iu.test(file)));

	for (const file of files.filter((path) => /\.(?:css|js|otf|ttf|woff2?)$/iu.test(path))) {
		const metadata = await stat(new URL(file, dist));
		if (metadata.isFile()) {
			assert.ok(metadata.size < 2 * 1024 * 1024, `${file} may contain an embedded complete font`);
		}
	}
});
