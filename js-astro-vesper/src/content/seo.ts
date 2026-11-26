/**
 * SEO in the Markdown collections (src/content.config.ts) and its mapping into the model (sources/markdown.ts). A
 * post, a project or a page may set an `seo:` block; `noindex: true` stays a top-level key.
 *
 *   seo:
 *     title: For search results and shares        # else the entry's title
 *     description: One or two sentences.         # else its summary
 *     image: ../media/share.webp                 # a local image; else the entry's photo
 *     canonical: https://example.com/original/  # an absolute http(s) URL; else none
 *   noindex: true
 *
 * The values reach the head as EmDash's SEO panel does (the pages pass `seo.title ?? title`, and so on, to Base.astro).
 * A bad value stops the build: an empty or blank text, a canonical that is not an absolute http(s) URL, or an
 * unknown key.
 *
 * Plain Node loads this file (the unit tests).
 */
import type { Seo } from "@astronomic/content";
import { z } from "astro/zod";

/** The error for a key left blank in YAML (null), else zod's own. */
const ifNull = (message: string) => ({ error: (issue: { input?: unknown }) => (issue.input === null ? message : undefined) });

/** A text field, trimmed; blank (or a key with no value) is an error (leave the key out instead). */
const seoText = (key: string) => {
	const message = `seo.${key} is empty: write it, or leave the key out.`;
	return z.string(ifNull(message)).trim().min(1, message);
};

const canonicalMessage = "seo.canonical must be an absolute http(s) URL, such as https://example.com/original-post/.";

/** True for an absolute `http:` or `https:` URL with a host, written out in full (`https:host/a` parses, but is not). */
export function isAbsoluteHttpUrl(value: string): boolean {
	if (!/^https?:\/\/[^/]/i.test(value)) return false;
	try {
		const url = new URL(value);
		return (url.protocol === "https:" || url.protocol === "http:") && url.hostname !== "";
	} catch {
		return false;
	}
}

/**
 * The `seo:` block's schema. `image` is the collection's `image()` (a local image, resolved like the entry's other
 * images); the unit tests pass a plain string schema.
 */
export function seoSchema<I extends z.ZodType>(image: I) {
	return z
		.object({
			title: seoText("title").optional(),
			description: seoText("description").optional(),
			image: image.optional(),
			canonical: z.string(ifNull(canonicalMessage)).trim().refine(isAbsoluteHttpUrl, canonicalMessage).optional(),
		}, ifNull("seo: has no fields under it: write them, or leave seo: out."))
		.strict()
		.optional();
}

/** What the mapping reads from an entry's data. */
type SeoData<I> = {
	seo?: { title?: string; description?: string; image?: I; canonical?: string };
	noindex?: boolean;
};

/**
 * An entry's SEO for the model: the `seo:` block's fields that are set, and `noindex` from the top-level key.
 * Undefined when none is set. `imageSrc` turns the block's image into its URL (the source's `h.image(...)?.src`).
 */
export function markdownSeo<I>(data: SeoData<I>, imageSrc: (image: I | undefined) => string | undefined): Seo | undefined {
	const { title, description, image, canonical } = data.seo ?? {};
	const src = imageSrc(image);
	const out: Seo = {
		...(title ? { title } : {}),
		...(description ? { description } : {}),
		...(src ? { image: src } : {}),
		...(canonical ? { canonical } : {}),
		...(data.noindex ? { noindex: true } : {}),
	};
	return Object.keys(out).length ? out : undefined;
}
