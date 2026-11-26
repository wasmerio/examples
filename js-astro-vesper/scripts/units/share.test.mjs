/** The share card's input and tree (src/utils/share-look.ts): plain titles, the Clear look's colors and the config's accent. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getConfig } from "../../src/utils/config.ts";
import { CARD_FONT, CARD_GROUND, cardColors, cardInput, cardTree } from "../../src/utils/share-look.ts";
import { propsOf, readRules } from "../lib/css.mjs";

const clear = propsOf(readRules(new URL("../../src/styles/looks/clear.css", import.meta.url)), ":root, :root[data-look=\"clear\"]");
const accents = JSON.parse(readFileSync(new URL("../../src/styles/accents/accents.json", import.meta.url), "utf8"));
const glacier = propsOf(readRules(new URL("../../src/styles/accents/glacier.css", import.meta.url)), ":root, :root[data-accent=\"glacier\"]");
const fontsCss = readFileSync(new URL("../../src/styles/fonts.css", import.meta.url), "utf8");

/** Every string child in a card tree, in order. */
function texts(node, out = []) {
	const children = node?.props?.children;
	if (typeof children === "string") out.push(children);
	else if (Array.isArray(children)) for (const child of children) texts(child, out);
	return out;
}

test("the card's ground, ink and muted text are clear.css's light :root", () => {
	assert.equal(CARD_GROUND.bg, clear["--ui-bg"]);
	assert.equal(CARD_GROUND.fg, clear["--ui-fg"]);
	assert.equal(CARD_GROUND.muted, clear["--ui-muted"]);
});

test("the default card colors: Clear and Glacier's light color, from the resolved config", () => {
	const { config } = getConfig();
	assert.equal(config.accent, "glacier");
	const colors = cardColors(config.accent, accents);
	assert.deepEqual(colors, { ...CARD_GROUND, accent: glacier["--v-accent-light"] });
	assert.equal(colors.accent, "#0a6a84");
});

test("an accent set in the settings reaches the card; an unknown id gives the ink", () => {
	const known = accents.find((a) => a.id !== "glacier");
	if (known) assert.equal(cardColors(getConfig({ config: { accent: known.id } }).config.accent, accents).accent, known.light);
	assert.equal(cardColors("nope", accents).accent, CARD_GROUND.fg);
});

test("the card's font is Clear's display face", () => {
	assert.equal(CARD_FONT, "Host Grotesk");
	assert.match(fontsCss, /font-family:\s*"Host Grotesk"/);
});

test("a heading's marker never shows on a card, and the title is one text node, never markup", () => {
	const colors = cardColors("glacier", accents);
	const { card } = cardInput({ title: "I design software by day and chase light *above treeline* by weekend." }, "Rowan Ellery", colors);
	assert.equal(card.title, "I design software by day and chase light above treeline by weekend.");
	const html = cardInput({ title: "<b>Bold</b> and *soft*", label: "Design" }, "Rowan Ellery", colors);
	assert.equal(html.card.title, "<b>Bold</b> and soft");
	const tree = cardTree(html.card, html.look);
	assert.deepEqual(texts(tree), ["Design", "<b>Bold</b> and soft", "Rowan Ellery"]);
	assert.ok(!JSON.stringify(tree).includes("*"), "no asterisk anywhere in the tree");
	assert.ok(!JSON.stringify(tree).includes("dangerouslySetInnerHTML"));
});

test("no label when it would repeat the title or the site name", () => {
	const colors = cardColors("glacier", accents);
	assert.equal(cardInput({ title: "Rowan Ellery", label: "Rowan Ellery" }, "Rowan Ellery", colors).card.label, undefined);
	assert.equal(cardInput({ title: "Articles", label: "Articles" }, "Rowan Ellery", colors).card.label, undefined);
	assert.equal(cardInput({ title: "Two days on a trail crew", label: "Design" }, "Rowan Ellery", colors).card.label, "Design");
});

test("the tree: 1200 by 630 on the ground, the mark in the accent with one cut corner", () => {
	const { card, look } = cardInput({ title: "Articles" }, "Rowan Ellery", cardColors("glacier", accents));
	const tree = cardTree(card, look);
	assert.equal(tree.props.style.width, 1200);
	assert.equal(tree.props.style.height, 630);
	assert.equal(tree.props.style.backgroundColor, CARD_GROUND.bg);
	assert.equal(tree.props.style.fontFamily, CARD_FONT);
	const [label, , foot] = tree.props.children;
	assert.equal(label.props.children, undefined, "no label: an empty spacer");
	const [mark, name] = foot.props.children;
	assert.equal(mark.props.style.backgroundColor, "#0a6a84");
	assert.match(mark.props.style.clipPath, /^polygon\(/);
	assert.equal(name.props.children, "Rowan Ellery");
});

test("a category or tag page has its own card only while it is a public page (pageAt), as the card route does", () => {
	// A term whose every post is hidden from search engines is not in publicPages(), so the card route answers 404
	// for it; the page must then share the home card, not point og:image at a card that is not there.
	for (const file of ["../../src/pages/articles/category/[slug]/[...page].astro", "../../src/pages/tags/[tag]/[...page].astro"]) {
		const text = readFileSync(new URL(file, import.meta.url), "utf8");
		assert.match(text, /const card = page === 1 && \(await pageAt\([a-zA-Z]+Href\([a-z]+\.slug\)\)\) !== undefined;/, file);
		assert.match(text, /^<Base\b.*\bcard=\{card\}>$/m, file);
	}
	const route = readFileSync(new URL("../../src/pages/og/[...path]/card.png.ts", import.meta.url), "utf8");
	assert.match(route, /pageAt\(path\)/, "the card route answers from pageAt too");
});
