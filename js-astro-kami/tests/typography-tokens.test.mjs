import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(path) {
	return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function tokenNames(css) {
	return [...css.matchAll(/(--type-[\w-]+)\s*:/g)].map(([, name]) => name).sort();
}

test("English and Chinese typography adapters implement the same token interface", async () => {
	const [english, chinese] = await Promise.all([
		readProjectFile("src/styles/typography/en.css"),
		readProjectFile("src/styles/typography/zh.css"),
	]);

	assert.match(english, /:root:lang\(en\)/);
	assert.match(chinese, /:root:lang\(zh-CN\)/);
	assert.deepEqual(tokenNames(chinese), tokenNames(english));
	assert.ok(tokenNames(english).length > 0);
});

test("Built pages expose the language selectors used by the typography adapters", async () => {
	const [english, chinese] = await Promise.all([
		readProjectFile("dist/index.html"),
		readProjectFile("dist/zh/index.html"),
	]);

	assert.match(english, /<html\b[^>]*\blang=(?:"en"|en)(?:\s|>)/);
	assert.match(chinese, /<html\b[^>]*\blang=(?:"zh-CN"|zh-CN)(?:\s|>)/);
});

test("Maple webfonts are isolated from the shared stylesheet", async () => {
	const globalStyles = await readProjectFile("src/styles/global.css");

	assert.doesNotMatch(globalStyles, /@automann\/maple-mono-cn/);
	assert.doesNotMatch(globalStyles, /@fontsource\/maple-mono/);
});

test("Article-only KaTeX styles stay out of the shared stylesheet", async () => {
	const [globalStyles, blogPost] = await Promise.all([
		readProjectFile("src/styles/global.css"),
		readProjectFile("src/layouts/BlogPost.astro"),
	]);

	assert.doesNotMatch(globalStyles, /katex\/dist\/katex\.min\.css/);
	assert.doesNotMatch(globalStyles, /\.aside-title\s*\{/);
	assert.match(blogPost, /katex\/dist\/katex\.min\.css/);
	assert.match(blogPost, /\.aside-title\s*\{/);
});

test("Language-neutral Showcase metadata and footer reset inherited body typography", async () => {
	const [globalStyles, footer] = await Promise.all([
		readProjectFile("src/styles/global.css"),
		readProjectFile("src/components/layout/Footer.astro"),
	]);

	const stackRule = globalStyles.match(/ul\.work-list \.stack\s*\{([^}]*)\}/)?.[1] ?? "";
	const footerRule = footer.match(/\.site-footer\s*\{([^}]*)\}/)?.[1] ?? "";

	for (const rule of [stackRule, footerRule]) {
		assert.match(rule, /font-weight:\s*400;/);
		assert.match(rule, /letter-spacing:\s*normal;/);
		assert.match(rule, /line-height:\s*1\.62;/);
	}
});
