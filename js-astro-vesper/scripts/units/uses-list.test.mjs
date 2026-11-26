/** The uses list's markup (src/components/UsesList.astro), rendered: every name in the description list has a description. */
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { renderer } from "../lib/render.mjs";

const USES_LIST = new URL("../../src/components/UsesList.astro", import.meta.url);
let r;
before(async () => {
	r = await renderer();
});
after(() => r?.close());

/** Each item's children, as tag names: ["dt", "dd", …]. */
const itemTags = (html) => [...html.matchAll(/<div data-uses-item>([\s\S]*?)<\/div>/g)].map((m) => [...m[1].matchAll(/<(dt|dd)\b/g)].map((t) => t[1]));

test("every uses item is a name and one or more descriptions, a name alone included (an empty, hidden one)", async () => {
	const items = [
		{ name: "A pencil" },
		{ name: "Laptop", note: "Fast enough." },
		{ name: "Notes app", link: { href: "/notes", label: "Try it", button: false } },
		{ name: "Editor", note: "Plain text.", link: { href: "/editor", label: "Get it", button: true } },
	];
	const html = await r.render(USES_LIST, { props: { groups: [{ group: "Desk", id: "uses-desk", items }] } });
	assert.deepEqual(itemTags(html), [["dt", "dd"], ["dt", "dd"], ["dt", "dd"], ["dt", "dd", "dd"]]);
	assert.match(html, /<dt>A pencil<\/dt><dd hidden(="")?><\/dd>/, "the name alone gets a hidden, empty description");
	assert.equal((html.match(/<dd hidden/g) ?? []).length, 1, "only the name alone gets one");
});
