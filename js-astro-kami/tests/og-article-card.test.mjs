import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
	articleCardMarkup,
	createArticleCardModel,
	titleTypography,
} from "../src/components/og/article-card.ts";

const baseArticle = {
	author: "John Doe",
	description: "A concise summary that gives the social card useful editorial context.",
	host: "automann.github.io",
	publishDate: new Date("2026-07-16T00:00:00.000Z"),
	readingTime: "5 min read",
	tags: ["design", "typography"],
	title: "Designing an editorial visual system",
};

test("English article-card model includes localized editorial metadata", () => {
	const model = createArticleCardModel({ ...baseArticle, locale: "en" });

	assert.equal(model.htmlLang, "en");
	assert.equal(model.sectionLabel, "Journal");
	assert.equal(model.dateLabel, "July 16, 2026");
	assert.equal(model.byline, "By John Doe · 5 min read");
	assert.equal(model.tagsLine, "DESIGN · TYPOGRAPHY");
	assert.equal(model.description, baseArticle.description);
});

test("Chinese article-card model localizes labels, date, reading time, and tags", () => {
	const model = createArticleCardModel({
		...baseArticle,
		description: "在分享链接之前，用一句摘要交代文章的核心判断。",
		locale: "zh",
		tags: ["设计", "排版"],
		title: "从页面样式走向视觉系统",
	});

	assert.equal(model.htmlLang, "zh-CN");
	assert.equal(model.sectionLabel, "文章");
	assert.equal(model.dateLabel, "2026年7月16日");
	assert.equal(model.byline, "作者 John Doe · 5 分钟阅读");
	assert.equal(model.tagsLine, "设计 · 排版");
});

test("article-card markup renders description and accepts injectable font families", () => {
	const markup = articleCardMarkup(createArticleCardModel({ ...baseArticle, locale: "en" }), {
		body: "Body Placeholder",
		brand: "Brand Placeholder",
		display: "Display Placeholder",
		displayWeight: 400,
		meta: "Meta Placeholder",
	});
	const serialized = JSON.stringify(markup);

	assert.match(serialized, /A concise summary/);
	assert.match(serialized, /"fontFamily":"Display Placeholder"/);
	assert.match(serialized, /"fontFamily":"Body Placeholder"/);
	assert.match(serialized, /"fontFamily":"Meta Placeholder"/);
	assert.match(serialized, /"fontFamily":"Brand Placeholder"/);
	assert.match(serialized, /"fontWeight":"400"/);
});

test("title typography accounts for locale and long titles", () => {
	assert.equal(titleTypography("Short title", "en").fontSize, 68);
	assert.equal(titleTypography("A".repeat(90), "en").fontSize, 48);
	assert.equal(titleTypography("中文标题", "zh").fontSize, 64);
	assert.equal(titleTypography("长".repeat(35), "zh").fontSize, 48);
});

test("article-card metadata caps visible tags so the host stays readable", () => {
	const model = createArticleCardModel({
		...baseArticle,
		locale: "en",
		tags: ["design", "typography", "astro", "performance", "internationalization"],
	});

	assert.equal(model.tagsLine, "DESIGN · TYPOGRAPHY · ASTRO · +2");
});

test("schema-maximum copy is bounded before it reaches the fixed-size layout", () => {
	const english = createArticleCardModel({
		...baseArticle,
		description: "D".repeat(160),
		locale: "en",
		title: "T".repeat(120),
	});
	const chinese = createArticleCardModel({
		...baseArticle,
		description: "摘".repeat(160),
		locale: "zh",
		title: "题".repeat(120),
	});

	assert.equal(Array.from(english.title).length, 100);
	assert.equal(Array.from(english.description).length, 145);
	assert.equal(Array.from(chinese.title).length, 44);
	assert.equal(Array.from(chinese.description).length, 78);
	for (const value of [english.title, english.description, chinese.title, chinese.description]) {
		assert.ok(value.endsWith("…"));
	}
});

test("the production build emits 1200 by 630 article cards for both locales", async () => {
	for (const path of [
		"../dist/og-image/hello-world.png",
		"../dist/og-image/zh/designing-a-visual-system.png",
	]) {
		const png = await readFile(new URL(path, import.meta.url));
		assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
		assert.equal(png.readUInt32BE(16), 1200);
		assert.equal(png.readUInt32BE(20), 630);
		assert.ok(png.byteLength > 5_000);
	}
});
