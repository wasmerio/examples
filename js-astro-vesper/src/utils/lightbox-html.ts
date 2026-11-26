/**
 * Photos in rendered rich text open large (the kit's Lightbox, group "photos"). One pass over the HTML a source's
 * renderer wrote, read with an HTML parser (parse5, with source offsets), that rewrites only the elements it changes:
 * every other byte comes back as it went in.
 *
 * - Markdown: a paragraph that holds only an image becomes
 *   `<figure class="v-fig"><a href="<large>" data-lightbox="photos" …><img …></a><figcaption>title</figcaption></figure>`.
 *   The image's `title` moves out of the image into the caption; with no title there is no caption.
 * - EmDash: an image figure (`figure.emdash-image`) or a gallery item (`figure.emdash-gallery-item`) gets the link
 *   around its image. Its own figcaption stays, and the Lightbox reads it from there.
 * - Markdown, no link: a paragraph that holds only an image already inside a link (`[![alt](x.webp "cap")](/uses)`),
 *   or only an image with empty or no alt, still becomes `<figure class="v-fig">` with its title as the caption when
 *   it has a title (as EmDash shows a caption on a linked or decorative image): the existing link goes inside the
 *   figure as it was, and no lightbox link is added. With no title it is left alone.
 * - Left alone: an image already inside a link (its link wins), an image with empty or no alt (a nameless link is no
 *   use to a screen reader), a paragraph with anything beside the image, and an element whose end tag is missing.
 *
 * The link goes to the largest `w` candidate of the image's own srcset (by number, never by place), and the srcset goes
 * along for the large view. A srcset with `x` descriptors, or one that does not parse, gives the image's `src` and no
 * large srcset. When two or more candidates are all the same file (EmDash serves one file for all widths), the link is
 * that file, with no large srcset and no size. Only plain web addresses are used (safeImageUrl() in lightbox-image.ts,
 * the one check for every photo link: http(s) with a host, or a path): any other srcset candidate is dropped, and an
 * image with no usable URL gets no link (a Markdown one with a title still gets its caption figure).
 *
 * Pure: no Astro, so plain Node tests it (scripts/units/lightbox-html.test.mjs).
 */
import { lightboxAttrs } from "@astronomic/ui/lib/lightbox.ts";
import { type DefaultTreeAdapterMap, parseFragment } from "parse5";
import { safeImageUrl } from "./lightbox-image.ts";

type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];

const GROUP = "photos";
/** The figure class for a Markdown photo (src/styles/prose.css styles it inside v-prose). */
const FIGURE_CLASS = "v-fig";
const EMDASH_FIGURES = ["emdash-image", "emdash-gallery-item"];

const escapeAttr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const isElement = (node: Node): node is Element => "tagName" in node;
const attr = (el: Element, name: string) => el.attrs.find((a) => a.name === name)?.value;
const classes = (el: Element) => (attr(el, "class") ?? "").split(/\s+/).filter(Boolean);

/** A srcset's candidates, when every one has a positive `w` descriptor; else null. An empty srcset is []. */
export function wCandidates(srcset: string): { url: string; w: number }[] | null {
	const out: { url: string; w: number }[] = [];
	let i = 0;
	const s = srcset;
	while (i < s.length) {
		while (i < s.length && /[\s,]/.test(s[i])) i++;
		if (i >= s.length) break;
		let url = "";
		while (i < s.length && !/\s/.test(s[i])) url += s[i++];
		let descriptor = "";
		if (/,+$/.test(url)) url = url.replace(/,+$/, "");
		else {
			let depth = 0;
			while (i < s.length && (s[i] !== "," || depth > 0)) {
				if (s[i] === "(") depth++;
				else if (s[i] === ")") depth--;
				descriptor += s[i++];
			}
		}
		const m = /^\s*([1-9]\d*)w\s*$/.exec(descriptor);
		if (!url || !m) return null;
		out.push({ url, w: Number(m[1]) });
	}
	return out;
}

/** Where a photo's link goes, and what the Lightbox gets with it; undefined when there is nowhere safe to go. */
export function largeOf(img: Element): { href: string; attrs: Record<string, string> } | undefined {
	const src = safeImageUrl(attr(img, "src"));
	const srcset = attr(img, "srcset") ?? "";
	const candidates = wCandidates(srcset)?.filter((c) => safeImageUrl(c.url) !== undefined);
	if (candidates && candidates.length > 0) {
		const largest = candidates.reduce((a, b) => (b.w > a.w ? b : a));
		if (candidates.length > 1 && candidates.every((c) => c.url === largest.url)) return { href: largest.url, attrs: { ...lightboxAttrs({ group: GROUP }) } };
		const w = Number(attr(img, "width"));
		const h = Number(attr(img, "height"));
		const height = w > 0 && h > 0 ? Math.round((largest.w * h) / w) : undefined;
		return { href: largest.url, attrs: { ...lightboxAttrs({ group: GROUP, srcset: candidates.map((c) => `${c.url} ${c.w}w`).join(", "), width: largest.w, height }) } };
	}
	if (src === undefined) return undefined;
	return { href: src, attrs: { ...lightboxAttrs({ group: GROUP }) } };
}

const openLink = (large: { href: string; attrs: Record<string, string> }) =>
	`<a href="${escapeAttr(large.href)}"${Object.entries(large.attrs)
		.map(([name, value]) => ` ${name}="${escapeAttr(value)}"`)
		.join("")}>`;

/** Whether an image may be a trigger: it has a non-blank alt and its start tag was read whole. */
const usable = (img: Element) => (attr(img, "alt") ?? "").trim() !== "" && img.sourceCodeLocation?.startTag != null;

type Edit = { start: number; end: number; text: string };

/** The only element child of an element, when there is nothing else in it but white space. */
function soleChild(el: Element): Element | undefined {
	let only: Element | undefined;
	for (const child of el.childNodes) {
		if (isElement(child)) {
			if (only) return undefined;
			only = child;
		} else if (child.nodeName !== "#text" || !/^\s*$/.test((child as DefaultTreeAdapterMap["textNode"]).value)) return undefined;
	}
	return only;
}

/** A paragraph's image, when the paragraph holds only that image, or only a link that holds only that image. */
function soleImage(p: Element): { img: Element; link?: Element } | undefined {
	const child = soleChild(p);
	if (child?.tagName === "img") return { img: child };
	const inner = child?.tagName === "a" ? soleChild(child) : undefined;
	return inner?.tagName === "img" ? { img: inner, link: child } : undefined;
}

function markdownEdit(html: string, p: Element): Edit | undefined {
	const loc = p.sourceCodeLocation;
	const found = soleImage(p);
	const tag = found?.img.sourceCodeLocation?.startTag;
	if (!loc?.endTag || !found || !tag) return undefined;
	const { img, link } = found;
	let imgHtml = html.slice(tag.startOffset, tag.endOffset);
	const titleLoc = img.sourceCodeLocation!.attrs?.title;
	if (titleLoc) {
		let from = titleLoc.startOffset;
		while (from > tag.startOffset && /\s/.test(html[from - 1])) from--;
		imgHtml = html.slice(tag.startOffset, from) + html.slice(titleLoc.endOffset, tag.endOffset);
	}
	const title = (attr(img, "title") ?? "").trim();
	const caption = title ? `<figcaption>${escapeText(title)}</figcaption>` : "";
	const figure = (inner: string) => ({ start: loc.startOffset, end: loc.endTag!.endOffset, text: `<figure class="${FIGURE_CLASS}">${inner}${caption}</figure>` });
	const large = !link && usable(img) ? largeOf(img) : undefined;
	if (large) return figure(`${openLink(large)}${imgHtml}</a>`);
	// No lightbox link (a linked or decorative photo, or no safe file): a figure only for its caption.
	if (!title) return undefined;
	if (!link) return figure(imgHtml);
	const linkLoc = link.sourceCodeLocation;
	if (!linkLoc?.endTag) return undefined;
	return figure(html.slice(linkLoc.startOffset, tag.startOffset) + imgHtml + html.slice(tag.endOffset, linkLoc.endTag.endOffset));
}

function emdashEdits(html: string, figure: Element): Edit[] {
	if (!figure.sourceCodeLocation?.endTag) return [];
	const edits: Edit[] = [];
	for (const img of figure.childNodes) {
		if (!isElement(img) || img.tagName !== "img" || !usable(img)) continue;
		const large = largeOf(img);
		if (!large) continue;
		const tag = img.sourceCodeLocation!.startTag!;
		edits.push({ start: tag.startOffset, end: tag.endOffset, text: `${openLink(large)}${html.slice(tag.startOffset, tag.endOffset)}</a>` });
	}
	return edits;
}

/** The HTML with its photos made into links that open large (see the top of this file). */
export function lightboxHtml(html: string): string {
	if (!html.includes("<img")) return html;
	const edits: Edit[] = [];
	const walk = (node: { childNodes?: Node[] }, inLink: boolean) => {
		for (const child of node.childNodes ?? []) {
			if (!isElement(child)) continue;
			if (child.tagName === "a") {
				walk(child, true);
				continue;
			}
			if (!inLink && child.tagName === "p") {
				const edit = markdownEdit(html, child);
				if (edit) {
					edits.push(edit);
					continue;
				}
			}
			if (!inLink && child.tagName === "figure" && classes(child).some((c) => EMDASH_FIGURES.includes(c))) edits.push(...emdashEdits(html, child));
			walk(child, inLink);
		}
	};
	walk(parseFragment(html, { sourceCodeLocationInfo: true }), false);
	let out = html;
	for (const edit of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
	return out;
}
