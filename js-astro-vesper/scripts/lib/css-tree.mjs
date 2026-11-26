/**
 * A small reader for nested stylesheets (src/styles/), for the collage and motion unit tests: every block that holds
 * declarations, with the chain of block heads above it (selectors, `@utility`, `@media`, `@container`), and its
 * declarations as written. It knows only what the theme's files hold: no strings with braces, no `@import` blocks.
 */
import { readFileSync } from "node:fs";

/**
 * The blocks of a stylesheet: `{ heads, decls }`, where `heads` is the chain of block heads from the top (each with
 * its whitespace folded) and `decls` the declarations directly in that block, as `[property, value]` pairs in order.
 * Comments are dropped.
 */
export function cssBlocks(text) {
	const css = text.replace(/\/\*[\s\S]*?\*\//g, "");
	const blocks = [];
	const stack = [{ heads: [], decls: [] }];
	let buf = "";
	const flush = () => {
		for (const part of buf.split(";")) {
			const m = /^\s*([-\w]+)\s*:\s*([\s\S]+?)\s*$/.exec(part);
			if (m) stack.at(-1).decls.push([m[1], m[2].replace(/\s+/g, " ")]);
		}
		buf = "";
	};
	for (const ch of css) {
		if (ch === "{") {
			// The text since the last `;` is the new block's head; anything before it is declarations.
			const cut = buf.lastIndexOf(";");
			const head = buf.slice(cut + 1).trim().replace(/\s+/g, " ");
			buf = buf.slice(0, cut + 1);
			flush();
			const block = { heads: [...stack.at(-1).heads, head], decls: [] };
			blocks.push(block);
			stack.push(block);
		} else if (ch === "}") {
			flush();
			stack.pop();
		} else buf += ch;
	}
	return blocks.filter((b) => b.decls.length);
}

export const readBlocks = (path) => cssBlocks(readFileSync(path, "utf8"));

/** The `@media` heads in a chain, joined with " and " ("" when there is none). */
export const mediaOf = (heads) =>
	heads
		.filter((h) => h.startsWith("@media"))
		.map((h) => h.replace(/^@media\s*/, ""))
		.join(" and ");
