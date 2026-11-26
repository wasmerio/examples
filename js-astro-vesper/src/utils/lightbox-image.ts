/**
 * The large file a photo opens in the lightbox (the kit's LightboxBar), per source kind, and which photos open at all.
 *
 * - A local image (`source.kind` "astro-image", its ImageMetadata in the source): getImage() at 1200, 1800 and 2400
 *   wide, each capped at the photo's own width; `href` is the largest, `srcset` all of them (with two or more).
 * - Any other image (EmDash media, a plain URL): `href` is the photo's own `src`, no srcset (EmDash's image service
 *   does not resize).
 *
 * Every file goes through safeImageUrl() before it reaches a link's href or the large srcset: a photo whose file is
 * not a plain web address (a script or data URL, say) opens nothing (lightboxImage() gives undefined). A local image
 * whose made files are all refused falls back to its own `src`, so isTrigger() (which checks that `src`) is the one
 * test: a trigger always has a large file, and a page's Base `lightbox` flag and its photo links agree.
 *
 * `getImage` is passed in (components import it from astro:assets), so plain Node runs this file
 * (scripts/units/lightbox-image.test.mjs). Type imports only: no EmDash package (the import walls).
 */
import type { ContentImage } from "@astronomic/content";

/** The large view's widths, before the photo's own width caps them. */
export const LARGE_WIDTHS = [1200, 1800, 2400] as const;

/** The About photo opens large only at this width or wider: a small avatar would only get blurry. */
export const ABOUT_MIN_WIDTH = 1000;

/** What lightboxImage() returns: the link's href and the lightboxAttrs() size options. */
export interface LargeImage {
	href: string;
	srcset?: string;
	sizes?: string;
	width?: number;
	height?: number;
}

/** astro:assets getImage(), as far as this file uses it. */
export type GetImage = (options: { src: never; width: number }) => Promise<{ src: string; attributes: Record<string, unknown> }>;

type Meta = { src?: string; width?: number; height?: number };

/** LARGE_WIDTHS each capped at `width`, deduped, ascending: 1400 gives 1200 and 1400; 900 gives 900. */
export function largeWidths(width: number): number[] {
	return [...new Set(LARGE_WIDTHS.map((w) => Math.min(w, width)))].sort((a, b) => a - b);
}

/**
 * The URL when it is safe for a link to a photo, else undefined: an http: or https: URL with a host, or a path (root
 * relative or relative), trimmed. It is judged with control characters and whitespace removed (a browser ignores
 * them, so they could hide a scheme); a backslash or a protocol-relative "//host" is refused. Not content/links.ts
 * safeHref, which refuses http: (EmDash serves its media from http://localhost:<port> in development).
 */
export function safeImageUrl(url: string | undefined): string | undefined {
	const clean = (url ?? "").replace(/[\u0000-\u0020\u007f-\u009f]/g, "");
	if (!clean || clean.includes("\\") || clean.startsWith("//")) return undefined;
	const safe = (url ?? "").trim();
	if (!/^[a-z][a-z0-9+.-]*:/i.test(clean)) return safe;
	if (!/^https?:\/\/[^/?#]/i.test(clean)) return undefined;
	try {
		return new URL(clean).host ? safe : undefined;
	} catch {
		return undefined;
	}
}

const num = (value: unknown): number | undefined => (typeof value === "number" && value > 0 ? value : typeof value === "string" && Number(value) > 0 ? Number(value) : undefined);

/** The photo's own size, when it has one. */
const sizeOf = (image: ContentImage) => (image.width && image.height ? { width: image.width, height: image.height } : {});

/** The large file for a photo: see the file's header. */
export async function lightboxImage(image: ContentImage, getImage: GetImage): Promise<LargeImage | undefined> {
	const meta = image.source?.kind === "astro-image" ? (image.source.value as Meta | undefined) : undefined;
	if (!meta?.width || !meta.height) {
		const href = safeImageUrl(image.src);
		return href === undefined ? undefined : { href, ...sizeOf(image) };
	}
	const made = await Promise.all(
		largeWidths(meta.width).map(async (width) => {
			const file = await getImage({ src: meta as never, width });
			return { src: safeImageUrl(file.src), width: num(file.attributes.width) ?? width, height: num(file.attributes.height) ?? Math.round((width * meta.height!) / meta.width!) };
		}),
	);
	const files = made.filter((file): file is typeof file & { src: string } => file.src !== undefined);
	const largest = files[files.length - 1];
	if (!largest) {
		const href = safeImageUrl(image.src);
		return href === undefined ? undefined : { href, ...sizeOf(image) };
	}
	const srcset = files.length > 1 ? { srcset: files.map((file) => `${file.src} ${file.width}w`).join(", "), sizes: "100vw" } : {};
	return { href: largest.src, ...srcset, width: largest.width, height: largest.height };
}

/**
 * Whether a photo opens in the lightbox: it has alt words (a decorative photo, alt "", in a link would be a nameless
 * link) and its `src` is a safe web address (safeImageUrl; then lightboxImage() always gives a large file). With
 * `minWidth`, also only when its width is known and at least that (the About photo: ABOUT_MIN_WIDTH). The pages use
 * it for both the photo link and the Base `lightbox` flag, so a page never carries an empty dialog.
 */
export function isTrigger(image: { src?: string; alt?: string; width?: number } | undefined, { minWidth }: { minWidth?: number } = {}): boolean {
	if (!image?.alt?.trim() || safeImageUrl(image.src) === undefined) return false;
	return minWidth === undefined || (image.width !== undefined && image.width >= minWidth);
}

/** A collage photo, as far as collageOpens() reads it: its alt, its own link, its image's file. */
type CollageLike = { alt?: string; href?: string; image?: { src?: string } };

/** Whether a collage photo opens in the lightbox: no link of its own (that link wins), and isTrigger (alt words, a safe file). */
export const collageOpens = (photo: CollageLike): boolean => !photo.href && isTrigger({ src: photo.image?.src, alt: photo.alt });

/** Whether the home collage has a photo that opens in the lightbox (collageOpens). */
export function collageHasTrigger(photos: readonly CollageLike[]): boolean {
	return photos.some(collageOpens);
}

/** A collage photo's lightbox caption: its place and year ("Heather Lake, WA, 2025"), never the map label; else undefined. */
export function collageCaption({ place, year }: { place?: string; year?: number }): string | undefined {
	return [place?.trim(), year === undefined ? undefined : String(year)].filter(Boolean).join(", ") || undefined;
}
