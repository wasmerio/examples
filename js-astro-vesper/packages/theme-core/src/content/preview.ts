/**
 * The preview of a locked post, and plain body text.
 *
 * A preview is plain text blocks (paragraphs, h2 and h3), never rich text, so a locked body's markup, components,
 * embeds, media and code can never reach a page through it. It is rendered by `PreviewText.astro`.
 *
 * - `previewBlocks(body)` reads a body as plain data, per format, and keeps prose only. For Markdown and MDX it is
 *   a line scanner with state (fences, open JSX and HTML elements, `{…}` expressions, ESM statements). When in
 *   doubt (anything left open at the end) it returns no blocks: no automatic preview for that body.
 * - `makePreview` prefers the author's preview (public by definition: the author wrote it to be shown). Else one
 *   paragraph of the body, at most `maxChars` and at most `maxShare` of the post, and none for a post shorter than
 *   `minBodyChars`.
 *
 * No CMS imports and no run-time imports of `@astronomic/content` (types only): plain Node can load it.
 */
import type { Preview, PreviewBlock, RichText } from "@astronomic/content";
import { decodeEntities, headingIds, type OutlineItem } from "../outline.ts";

export const PREVIEW_BOUNDS = Object.freeze({ maxChars: 320, maxShare: 0.25, minBodyChars: 600, authorMaxChars: 1500 } as const);

export type PreviewBounds = { maxChars: number; maxShare: number; minBodyChars: number; authorMaxChars: number };

const norm = (text: string) => decodeEntities(text).replace(/\s+/g, " ").trim();

// ---------------------------------------------------------------------------
// Markdown and MDX
// ---------------------------------------------------------------------------

/** Lower-case HTML elements whose content is never prose, even inline. */
const OPAQUE_HTML = new Set([
	"script",
	"style",
	"iframe",
	"template",
	"svg",
	"math",
	"object",
	"embed",
	"video",
	"audio",
	"canvas",
	"noscript",
	"select",
	"textarea",
	"pre",
	"code",
	"figure",
	"picture",
	"table",
]);
const VOID_HTML = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

type Frame = { name: string; opaque: boolean };

/**
 * True when an attribute list (the text of a tag after its name) has a `hidden` attribute, as a browser reads it:
 * names end at space, "=", "/", ">" or a quote, a quoted or braced value is skipped whole, so `class="x"hidden` and
 * a name on its own line count. A list that cannot be read (an unclosed quote or brace) counts as hidden.
 */
function hasHiddenAttribute(attrs: string): boolean {
	let i = 0;
	const n = attrs.length;
	while (i < n) {
		const c = attrs[i];
		if (/[\s/>]/.test(c)) {
			i++;
			continue;
		}
		if (c === '"' || c === "'") {
			// A stray quoted run (after a value with no "="): skip it.
			const end = attrs.indexOf(c, i + 1);
			if (end < 0) return true;
			i = end + 1;
			continue;
		}
		let j = i;
		while (j < n && !/[\s=/>"']/.test(attrs[j])) j++;
		if (attrs.slice(i, j).toLowerCase() === "hidden") return true;
		i = j;
		while (i < n && /\s/.test(attrs[i])) i++;
		if (attrs[i] !== "=") continue;
		i++;
		while (i < n && /\s/.test(attrs[i])) i++;
		const q = attrs[i];
		if (q === '"' || q === "'") {
			const end = attrs.indexOf(q, i + 1);
			if (end < 0) return true;
			i = end + 1;
		} else if (q === "{") {
			let depth = 0;
			for (; i < n; i++) {
				if (attrs[i] === "{") depth++;
				else if (attrs[i] === "}" && --depth === 0) break;
			}
			if (i >= n) return true;
			i++;
		} else {
			while (i < n && !/[\s>]/.test(attrs[i])) i++;
		}
	}
	return false;
}

/**
 * The scanner's state across lines. `stack`: open elements; `depth`: open `{` outside strings; `tag`: inside an
 * opening or closing tag (its props may span lines); `quote`: an open string inside a tag or an expression;
 * `comment`: inside `<!-- -->`.
 */
class Scanner {
	stack: Frame[] = [];
	depth = 0;
	tag: { name: string; closing: boolean; opaque: boolean; slash: boolean; attrs: string } | undefined;
	quote = "";
	comment = false;
	/** Inside a JavaScript block comment. */
	jsComment = false;
	/** A `/` in JavaScript that is not a comment (division or a regex literal): the scanner cannot be sure. */
	unsure = false;

	get balanced() {
		return !this.stack.length && !this.depth && !this.tag && !this.quote && !this.comment && !this.jsComment;
	}

	private get hidden() {
		return this.depth > 0 || this.stack.some((f) => f.opaque);
	}

	/**
	 * Scans one line. Returns the visible prose (text outside opaque elements and expressions; inline code kept as
	 * text, escapes resolved). `forceOpaque`: every element opened here is opaque (a block that starts with a tag).
	 * `js`: the line is JavaScript (an ESM statement): only strings and braces count, never tags.
	 */
	line(src: string, { forceOpaque = false, js = false } = {}): string {
		let out = "";
		let i = 0;
		// A tag that runs over lines: its attributes keep the line break as a boundary.
		if (this.tag) this.tag.attrs += "\n";
		while (i < src.length) {
			const c = src[i];
			if (this.comment) {
				const end = src.indexOf("-->", i);
				if (end < 0) return out;
				this.comment = false;
				i = end + 3;
				continue;
			}
			if (this.jsComment) {
				const end = src.indexOf("*/", i);
				if (end < 0) return out;
				this.jsComment = false;
				i = end + 2;
				continue;
			}
			if (this.quote) {
				if (this.tag) this.tag.attrs += c === "\\" ? src.slice(i, i + 2) : c;
				if (c === "\\") i += 2;
				else {
					if (c === this.quote) this.quote = "";
					i++;
				}
				continue;
			}
			if (this.tag) {
				if (this.depth > 0 || c === "{") {
					// An expression inside a tag's props.
					this.tag.attrs += c;
					i = this.code(src, i);
					continue;
				}
				if (c === '"' || c === "'" || c === "`") this.quote = c;
				else if (c === "/" && src[i + 1] === ">") {
					this.tag.slash = true;
				} else if (c === ">") {
					this.endTag();
					i++;
					continue;
				}
				this.tag.attrs += c;
				i++;
				continue;
			}
			if (this.depth > 0 || js) {
				i = this.code(src, i, js);
				continue;
			}
			// Prose (inside or outside elements).
			if (c === "\\" && i + 1 < src.length) {
				if (!this.hidden) out += src[i + 1];
				i += 2;
				continue;
			}
			if (c === "`") {
				const run = /^`+/.exec(src.slice(i))![0];
				const end = src.indexOf(run, i + run.length);
				if (end > 0) {
					if (!this.hidden) out += src.slice(i + run.length, end);
					i = end + run.length;
					continue;
				}
				if (!this.hidden) out += run;
				i += run.length;
				continue;
			}
			if (c === "{") {
				this.depth = 1;
				i++;
				continue;
			}
			if (c === "<") {
				const rest = src.slice(i);
				const auto = /^<([a-z][a-z0-9+.-]{1,31}:[^\s<>]*)>/i.exec(rest);
				if (auto) {
					if (!this.hidden) out += auto[1];
					i += auto[0].length;
					continue;
				}
				if (rest.startsWith("<!--")) {
					this.comment = true;
					i += 4;
					continue;
				}
				const open = /^<(\/?)([A-Za-z][\w.:-]*)?/.exec(rest);
				if (open && (open[2] !== undefined || rest[1] === ">" || rest.startsWith("</>"))) {
					const name = open[2] ?? "";
					const closing = open[1] === "/";
					const component = name === "" || !/^[a-z][a-z0-9-]*$/.test(name);
					const opaque = forceOpaque || component || OPAQUE_HTML.has(name);
					this.tag = { name, closing, opaque, slash: false, attrs: "" };
					i += open[0].length;
					continue;
				}
			}
			if (!this.hidden) out += c;
			i++;
		}
		return out;
	}

	/** JavaScript: strings and braces. Returns the next index. */
	private code(src: string, i: number, js = false): number {
		const c = src[i];
		if (c === '"' || c === "'" || c === "`") this.quote = c;
		else if (c === "{") this.depth++;
		else if (c === "}") this.depth = Math.max(0, this.depth - 1);
		else if (c === "/" && src[i + 1] === "/" && (js || this.depth > 0)) return src.length;
		else if (c === "/" && src[i + 1] === "*") {
			this.jsComment = true;
			return i + 2;
		} else if (c === "/") this.unsure = true;
		return i + 1;
	}

	private endTag() {
		const t = this.tag!;
		this.tag = undefined;
		if (t.closing) {
			const at = this.stack.map((f) => f.name).lastIndexOf(t.name);
			if (at >= 0) this.stack.length = at;
			return;
		}
		if (VOID_HTML.has(t.name.toLowerCase())) return;
		// An element with a `hidden` attribute is not shown: its content is never prose. A browser ignores "/>" on
		// a non-void HTML element, so a hidden one stays open (if nothing closes it, there is no preview).
		const hidden = hasHiddenAttribute(t.attrs);
		if (t.slash && !(hidden && /^[a-z]/.test(t.name))) return;
		this.stack.push({ name: t.name, opaque: t.opaque || hidden || this.stack.some((f) => f.opaque) });
	}
}

/** The index of the bracket that closes the one at `at` (nesting counted; in a link target, a title quoted after a space is skipped), or -1. */
function closing(text: string, at: number, open: string, close: string): number {
	let depth = 0;
	let quote = "";
	for (let i = at; i < text.length; i++) {
		if (text[i] === "\\") i++;
		else if (quote) {
			if (text[i] === quote) quote = "";
		} else if (open === "(" && depth === 1 && /\s/.test(text[i - 1]) && (text[i] === '"' || text[i] === "'")) quote = text[i];
		else if (text[i] === open) depth++;
		else if (text[i] === close && --depth === 0) return i;
	}
	return -1;
}

/**
 * Images dropped whole and links reduced to their text, with nested brackets counted (`![alt [x] y](u.png)`).
 * `undefined` when an image or a link target is left open: the caller drops the block (fail closed).
 */
function stripLinks(text: string): string | undefined {
	let out = "";
	let i = 0;
	while (i < text.length) {
		const image = text.startsWith("![", i);
		if (!image && text[i] !== "[") {
			out += text[i++];
			continue;
		}
		const start = image ? i + 1 : i;
		const end = closing(text, start, "[", "]");
		if (end < 0) {
			if (image) return undefined;
			out += text[i++];
			continue;
		}
		let next = end + 1;
		if (text[next] === "(" || text[next] === "[") {
			const target = closing(text, next, text[next], text[next] === "(" ? ")" : "]");
			if (target < 0) return undefined;
			next = target + 1;
		}
		if (!image) {
			const inner = stripLinks(text.slice(start + 1, end));
			if (inner === undefined) return undefined;
			out += inner;
		}
		i = next;
	}
	return out;
}

/** Inline Markdown to text: images dropped, links keep their text, emphasis marks removed. "" when unsure. */
function inline(text: string): string {
	const stripped = stripLinks(text);
	if (stripped === undefined) return "";
	return norm(stripped.replace(/(^|[^\w])[*_~]+|[*_~]+(?=[^\w]|$)/g, "$1"));
}

const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const SKIP_BLOCK = /^\s*([-*+]\s|\d+[.)]\s|>|\|)|^ {4,}\S|^\s*\[[^\]]+\]:\s/;
const RULE = /^ {0,3}([-*_])(\s*\1){2,}\s*$/;
const HEADING = /^ {0,3}(#{1,6})(?:\s+|$)(.*)$/;

function markdownBlocks(src: string): PreviewBlock[] {
	const lines = src.replace(/\r\n?/g, "\n").split("\n");
	let start = 0;
	if (/^---\s*$/.test(lines[0] ?? "")) {
		const end = lines.findIndex((l, i) => i > 0 && /^(---|\.\.\.)\s*$/.test(l));
		if (end < 0) return [];
		start = end + 1;
	}
	const blocks: PreviewBlock[] = [];
	const s = new Scanner();
	let para: string[] = [];
	/** The current block is dropped: "tag" (starts with a tag or expression), "js" (ESM), "skip" (list, quote…). */
	let drop: "" | "tag" | "js" | "skip" = "";
	let fence = "";

	const flush = () => {
		const text = inline(para.join(" "));
		if (text) blocks.push({ type: "paragraph", text });
		para = [];
	};

	for (let n = start; n < lines.length; n++) {
		const line = lines[n];
		if (fence) {
			const close = FENCE.exec(line);
			if (close && close[1][0] === fence[0] && close[1].length >= fence.length && !line.slice(close[0].length).trim()) fence = "";
			continue;
		}
		const blank = !line.trim();
		if (!s.balanced) {
			// Inside an element, expression, tag or string that began earlier: blank lines do not end it.
			const text = s.line(line, { forceOpaque: drop === "tag", js: drop === "js" });
			if (!drop && text) para.push(text);
			continue;
		}
		if (blank) {
			if (!drop) flush();
			drop = "";
			continue;
		}
		if (drop) {
			// A dropped block runs to the next blank line.
			s.line(line, { forceOpaque: true, js: drop === "js" });
			continue;
		}
		const trimmed = line.trimStart();
		const fenceOpen = FENCE.exec(line);
		if (fenceOpen) {
			flush();
			fence = fenceOpen[1];
			continue;
		}
		if (!para.length && /^(import|export)\s/.test(trimmed)) {
			drop = "js";
			s.line(line, { js: true });
			continue;
		}
		if (trimmed[0] === "<" || trimmed[0] === "{") {
			flush();
			drop = "tag";
			s.line(line, { forceOpaque: true });
			continue;
		}
		const heading = HEADING.exec(line);
		if (heading) {
			flush();
			const level = heading[1].length;
			const text = inline(s.line(heading[2].replace(/\s+#+\s*$/, "")));
			if (s.balanced && text && (level === 2 || level === 3)) blocks.push({ type: "heading", level, text });
			continue;
		}
		if (RULE.test(line) || /^ {0,3}(=+|-+)\s*$/.test(line)) {
			// A thematic break, or a setext underline (its heading text is dropped with it).
			para = [];
			continue;
		}
		if (!para.length && SKIP_BLOCK.test(line)) {
			drop = "skip";
			s.line(line, { forceOpaque: true });
			continue;
		}
		if (para.length && SKIP_BLOCK.test(line) && !/^ {4,}/.test(line)) {
			flush();
			drop = "skip";
			s.line(line, { forceOpaque: true });
			continue;
		}
		para.push(s.line(line));
	}
	if (fence || !s.balanced || s.unsure) return [];
	if (!drop) flush();
	return blocks;
}

// ---------------------------------------------------------------------------
// Portable Text and HTML
// ---------------------------------------------------------------------------

type PtBlock = { _type?: unknown; style?: unknown; listItem?: unknown; children?: unknown };

function portableTextBlocks(value: unknown): PreviewBlock[] {
	if (!Array.isArray(value)) return [];
	const blocks: PreviewBlock[] = [];
	for (const b of value as PtBlock[]) {
		if (!b || b._type !== "block" || b.listItem) continue;
		const children = Array.isArray(b.children) ? (b.children as { _type?: unknown; text?: unknown }[]) : [];
		const text = norm(children.map((c) => (c && (c._type === undefined || c._type === "span") && typeof c.text === "string" ? c.text : "")).join(""));
		if (!text) continue;
		const style = b.style ?? "normal";
		if (style === "normal") blocks.push({ type: "paragraph", text });
		else if (style === "h2") blocks.push({ type: "heading", level: 2, text });
		else if (style === "h3") blocks.push({ type: "heading", level: 3, text });
	}
	return blocks;
}

/** Elements whose whole content is never prose. */
const HTML_DROP = new Set([
	"iframe",
	"template",
	"svg",
	"math",
	"object",
	"video",
	"audio",
	"canvas",
	"noscript",
	"select",
	"pre",
	"figure",
	"picture",
	"table",
	"ul",
	"ol",
	"blockquote",
	"h1",
	"h4",
	"h5",
	"h6",
	"details",
]);
/** Elements whose content is raw text (never parsed as tags): skipped to their closing tag. */
const HTML_RAW = new Set(["script", "style", "textarea", "title", "xmp"]);
/** Elements that end a block of text. */
const HTML_BLOCK = new Set(["p", "h2", "h3", "div", "section", "article", "li", "header", "footer", "main", "aside"]);

/**
 * HTML to text blocks, with a small tokenizer: quoted attribute values may hold ">", dropped elements nest, raw
 * text elements (script, style) are skipped whole. Fails closed like the Markdown scanner: an unclosed tag,
 * comment, raw text element or dropped element gives no blocks at all.
 */
function htmlBlocks(value: unknown): PreviewBlock[] {
	if (typeof value !== "string") return [];
	const src = value;
	const lower = src.toLowerCase();
	const blocks: PreviewBlock[] = [];
	const dropped: string[] = [];
	let text = "";
	let heading: 2 | 3 | undefined;
	let breaks = 0;
	const flush = () => {
		const t = norm(text);
		if (t) blocks.push(heading ? { type: "heading", level: heading, text: t } : { type: "paragraph", text: t });
		text = "";
		heading = undefined;
	};
	let i = 0;
	while (i < src.length) {
		const c = src[i];
		if (c !== "<") {
			if (!dropped.length) text += c;
			if (!/\s/.test(c)) breaks = 0;
			i++;
			continue;
		}
		if (src.startsWith("<!--", i)) {
			const end = src.indexOf("-->", i + 4);
			if (end < 0) return [];
			i = end + 3;
			continue;
		}
		if (src.startsWith("<!", i)) {
			// CDATA, a doctype or another declaration: skipped whole.
			const cdata = src.startsWith("<![CDATA[", i);
			const end = cdata ? src.indexOf("]]>", i + 9) : src.indexOf(">", i + 2);
			if (end < 0) return [];
			i = end + (cdata ? 3 : 1);
			continue;
		}
		const open = /^<(\/?)([a-zA-Z][\w:-]*)/.exec(src.slice(i, i + 80));
		if (!open) {
			if (!dropped.length) text += c;
			i++;
			continue;
		}
		// The tag's end, outside quoted attribute values.
		let j = i + open[0].length;
		let quote = "";
		for (; j < src.length; j++) {
			const ch = src[j];
			if (quote) {
				if (ch === quote) quote = "";
			} else if (ch === '"' || ch === "'") quote = ch;
			else if (ch === ">") break;
		}
		if (j >= src.length) return [];
		const name = open[2].toLowerCase();
		const closing = open[1] === "/";
		const selfClosing = src[j - 1] === "/";
		const attrs = src.slice(i + open[0].length, j);
		i = j + 1;
		if (!closing && HTML_RAW.has(name) && !selfClosing) {
			const end = lower.indexOf(`</${name}`, i);
			const close = end < 0 ? -1 : lower.indexOf(">", end);
			if (close < 0) return [];
			i = close + 1;
			continue;
		}
		// An element with a `hidden` attribute is not shown: dropped like the elements above.
		const hidden = !closing && hasHiddenAttribute(attrs);
		if (closing) {
			// Inside a dropped element every element is counted, so a nested one of the same name cannot end it early.
			const at = dropped.lastIndexOf(name);
			if (at >= 0) {
				dropped.length = at;
				continue;
			}
		} else if ((dropped.length || hidden || HTML_DROP.has(name)) && (!selfClosing || hidden) && !VOID_HTML.has(name)) {
			// A browser ignores "/>" on a non-void element, so a hidden one stays open.
			dropped.push(name);
			continue;
		}
		if (dropped.length || HTML_DROP.has(name) || hidden) continue;
		if (name === "br") {
			if (++breaks >= 2) {
				flush();
				breaks = 0;
			}
			continue;
		}
		if (!closing && (name === "h2" || name === "h3")) {
			flush();
			heading = name === "h2" ? 2 : 3;
			continue;
		}
		if (HTML_BLOCK.has(name)) flush();
	}
	if (dropped.length) return [];
	flush();
	return blocks;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * What a body says, as one string: the Markdown source itself, else the JSON of its value. A memo keeps it and is
 * used only while the body still says the same (a body changed in place is read again).
 */
export function bodySignature(body: RichText): string {
	const v = body.value as { body?: unknown } | string | undefined;
	if (body.format === "markdown") return typeof v === "string" ? v : typeof v?.body === "string" ? v.body : "";
	if (typeof v === "string") return `${body.format}\u0000${v}`;
	return `${body.format}\u0000${JSON.stringify(v) ?? ""}`;
}

/** Blocks per body object (a body is read again for its preview, excerpt, reading time and copy check). */
const blocksOf = new WeakMap<object, { signature: string; blocks: readonly PreviewBlock[] }>();

/** The text blocks of a body (or a Markdown string): prose paragraphs and h2/h3 headings only. */
export function previewBlocks(body: RichText | string): PreviewBlock[] {
	if (typeof body === "string") return markdownBlocks(body);
	if (!body || typeof body !== "object") return [];
	const signature = bodySignature(body);
	let known = blocksOf.get(body);
	if (!known || known.signature !== signature) {
		known = { signature, blocks: Object.freeze(readBlocks(body).map((b) => Object.freeze(b))) };
		blocksOf.set(body, known);
	}
	return [...known.blocks];
}

function readBlocks(body: RichText): PreviewBlock[] {
	if (body.format === "markdown") {
		const v = body.value as { body?: unknown } | string | undefined;
		const src = typeof v === "string" ? v : typeof v?.body === "string" ? v.body : "";
		return markdownBlocks(src);
	}
	if (body.format === "portable-text") return portableTextBlocks(body.value);
	if (body.format === "html") return htmlBlocks(body.value);
	return [];
}

/** Cut at a word boundary to at most `max` characters, "…" included. */
function cut(text: string, max: number): string {
	if (text.length <= max) return text;
	const head = text.slice(0, Math.max(0, max - 1));
	const space = head.lastIndexOf(" ");
	return `${(space > 0 ? head.slice(0, space) : head).replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** Heading levels shifted so the first heading is an h2 (the preview sits under the page's h1). */
function promote(blocks: PreviewBlock[]): PreviewBlock[] {
	const first = blocks.find((b) => b.type === "heading");
	if (!first || first.type !== "heading" || first.level === 2) return blocks;
	const shift = first.level - 2;
	return blocks.map((b) => (b.type === "heading" ? { ...b, level: Math.max(2, b.level - shift) as 2 | 3 } : b));
}

function freeze(source: Preview["source"], blocks: PreviewBlock[]): Preview {
	return Object.freeze({ kind: "preview", source, blocks: Object.freeze(blocks.map((b) => Object.freeze({ ...b }))) }) as Preview;
}

/**
 * The preview of a locked entry. The author's (`author`: a string, blank lines between paragraphs, or rich text)
 * first, cut at `authorMaxChars`. Else the body's first paragraph, cut to `min(maxChars, maxShare × the body's text
 * length)`; none for a body under `minBodyChars`. `undefined` when there is none.
 */
export function makePreview(input: { author?: string | RichText; body: RichText }, bounds: PreviewBounds = PREVIEW_BOUNDS): Preview | undefined {
	const { author, body } = input;
	if (author !== undefined) {
		const blocks: PreviewBlock[] =
			typeof author === "string"
				? author
						.split(/\n\s*\n/)
						.map((p) => p.replace(/\s+/g, " ").trim())
						.filter(Boolean)
						.map((text) => ({ type: "paragraph", text }))
				: previewBlocks(author);
		if (blocks.length) {
			const kept: PreviewBlock[] = [];
			let left = bounds.authorMaxChars;
			for (const b of blocks) {
				if (left <= 1) break;
				if (b.text.length <= left) {
					kept.push(b);
					left -= b.text.length;
				} else {
					kept.push({ ...b, text: cut(b.text, left) });
					break;
				}
			}
			return freeze("author", promote(kept));
		}
	}
	const blocks = previewBlocks(body);
	const total = blocks.reduce((n, b) => n + b.text.length, 0);
	if (total < bounds.minBodyChars) return undefined;
	const first = blocks.find((b) => b.type === "paragraph");
	if (!first) return undefined;
	const max = Math.min(bounds.maxChars, Math.floor(total * bounds.maxShare));
	return freeze("auto", [{ type: "paragraph", text: cut(first.text, max) }]);
}

/** The preview's text, blocks joined with one space. "" for none. */
export function previewText(preview: Preview | undefined): string {
	return preview ? preview.blocks.map((b) => b.text).join(" ") : "";
}

/** The preview's h2s as outline items, with the ids `outline()` gives the same headings. */
export function previewOutline(preview: Preview | undefined, opts: { reserved?: readonly string[] } = {}): OutlineItem[] {
	if (!preview) return [];
	const idFor = headingIds(opts.reserved);
	return preview.blocks.filter((b) => b.type === "heading" && b.level === 2).map((b) => ({ id: idFor(b.text), text: b.text }));
}

const sentences = (text: string) =>
	text
		.split(/(?<=[.!?…])\s+/)
		.map((s) => s.trim())
		.filter(Boolean);

/** The share (0..1) of the body's text, by sentence, that appears word for word in the preview. */
export function previewCoverage(preview: Preview | undefined, body: RichText): number {
	const all = sentences(bodyText(body));
	const total = all.reduce((n, s) => n + s.length, 0);
	if (!preview || !total) return 0;
	const shown = previewText(preview);
	return all.reduce((n, s) => n + (shown.includes(s) ? s.length : 0), 0) / total;
}

/** All prose text of a body (paragraphs and h2/h3), for reading time and a readable post's excerpt. */
export function bodyText(body: RichText): string {
	return previewBlocks(body)
		.map((b) => b.text)
		.join(" ");
}

/** Minutes to read `text` at `wpm` words a minute, at least 1. `undefined` for no words. */
export function readingTime(text: string, wpm = 230): number | undefined {
	const words = text.split(/\s+/).filter(Boolean).length;
	return words ? Math.max(1, Math.round(words / wpm)) : undefined;
}
