/**
 * Summary text for search hits and lists. No CMS imports: it reads the rich
 * text formats as plain data. The theme decides which field each collection
 * uses; these cut and extract.
 */
import type { RichText } from "@astronomic/content";
import { previewBlocks } from "./preview.ts";

const MAX = 160;

/** Cut at a word boundary, with an ellipsis when cut. `undefined` for empty text. */
export function trimSummary(text: string, max = MAX): string | undefined {
	const t = text.replace(/\s+/g, " ").trim();
	if (!t) return undefined;
	if (t.length <= max) return t;
	const cut = t.slice(0, max);
	const space = cut.lastIndexOf(" ");
	return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** The first paragraph of a body (Portable Text or Markdown), cut at `max`. `undefined` for other formats. */
export function firstParagraph(body: RichText, max = MAX): string | undefined {
	if (body.format !== "portable-text" && body.format !== "markdown") return undefined;
	// The preview's walkers: prose only (code, components, embeds, lists and media dropped).
	const first = previewBlocks(body).find((b) => b.type === "paragraph");
	return first ? trimSummary(first.text, max) : undefined;
}
