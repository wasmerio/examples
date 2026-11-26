/**
 * A plain image for UI components. Sites map their own image objects to this
 * (for example a CMS image, or the result of `getImage()` from `astro:assets`).
 */
export interface UiImage {
	src: string;
	alt: string;
	width?: number;
	height?: number;
}

/**
 * An image file: its URL, or an object with the URL and the file's size. Astro's imported image
 * metadata (`import photo from "./photo.jpg"`) and `getImage()` output fit this shape, so pass them
 * as they are; the kit never imports `astro:assets`.
 */
export type ImageSource = string | { src: string; width?: number; height?: number };

/** The shape of a Media frame, as `width/height`: "16/9", "4/3", "1/1", "3/4", or any other pair. */
export type MediaRatio = "16/9" | "4/3" | "1/1" | "3/4" | `${number}/${number}`;

/**
 * The point of an image to keep in view when its frame crops it, as CSS `object-position`: one or two parts, each a
 * keyword or a percentage, like `"50% 30%"`, `"top"` or `"left 20%"`. focalCss checks it.
 */
export type FocalPoint = string;

/** The corners Media's shape="cut" can slice off, in the writing direction: start is the left in left to right. */
export const CUT_CORNERS = ["top-start", "top-end", "bottom-start", "bottom-end"] as const;
export type CutCorner = (typeof CUT_CORNERS)[number];

/**
 * Media's cutCorner, checked: unset (undefined, or null from CMS data) gives the default "top-end"; anything else not
 * in CUT_CORNERS throws.
 */
export function cutCornerAttr(value: string | null | undefined): CutCorner {
	if (value == null) return "top-end";
	if (!(CUT_CORNERS as readonly string[]).includes(value)) {
		throw new Error(`Media: cutCorner must be one of ${CUT_CORNERS.join(", ")}; got ${JSON.stringify(value)}.`);
	}
	return value as CutCorner;
}

/** An image for a part's optional media slot (Card, HeroSplit, FeatureGridCards items): Media's main props. */
export interface MediaImage {
	src: ImageSource;
	/** Required. Use `""` for a purely decorative image. */
	alt: string;
	width?: number;
	height?: number;
	ratio?: MediaRatio;
	loading?: "lazy" | "eager";
	/** The point to keep in view when the frame crops the image (Media's `focalPoint`). */
	focalPoint?: FocalPoint;
}

/**
 * An image the part shows as decoration, beside text that says the same (a team member's photo under their name, a
 * post's picture above its title): Media's props without alt. The part always writes alt="", so a buyer never writes
 * alt text the part throws away.
 */
export type DecorativeImage = Omit<MediaImage, "alt">;

/**
 * What Media passes to your image component (Media's imageComponent). The names follow <img> and Astro's <Image>,
 * so Astro's <Image> takes them as they are when src is Astro's image metadata.
 * - src: the image's src exactly as you gave it. Pass your own object (a CMS image) to get it back here.
 * - class: fills and covers the kit's frame box (block size-full object-cover). Put it on the <img>.
 * - style: only the focal point (object-position), when set. Forward it to the <img> if you use focalPoint.
 * - sizes: the recipe's hint of how wide the image shows, for your srcset. Approximate: recipes size by container.
 */
export interface ImageComponentProps {
	src: ImageSource;
	alt: string;
	width?: number;
	height?: number;
	loading: "lazy" | "eager";
	/** "high" for the page's largest image (Media's fetchpriority), when the part sets it. */
	fetchpriority?: "high" | "low" | "auto";
	/** Always "async", as on the kit's own <img>: decode off the main thread. */
	decoding?: "async" | "sync" | "auto";
	sizes?: string;
	class: string;
	style?: string;
}

/**
 * Your image component: Astro's <Image>, or a small .astro wrapper for your CMS's responsive image (type its Props
 * as ImageComponentProps). One argument of any type, as IconComponent: Astro's <Image> types its src as image
 * metadata, so it would not fit ImageComponentProps exactly, and the kit needs no image package.
 */
export type ImageComponent = (props: any) => unknown;

/**
 * The sizes hint for a photo in an auto-fit grid of 18rem columns (TeamGrid, PostGrid, PostFeatured's cards), for the
 * number of items in it. The row stops at the page's lg Container (max-w-7xl, 80rem, so about 77rem inside the
 * gutters). Two columns fit from about a 40rem viewport, three from about 60rem. Auto-fit collapses the empty tracks,
 * so one item fills the row and two take half each. Approximate, since the grid sizes by its container.
 */
export function gridImageSizes(count: number): string {
	if (count <= 1) return "(min-width: 80rem) 77rem, 100vw";
	if (count === 2) return "(min-width: 80rem) 38rem, (min-width: 40rem) 50vw, 100vw";
	return "(min-width: 80rem) 25rem, (min-width: 60rem) 33vw, (min-width: 40rem) 50vw, 100vw";
}

/** The URL and size of an ImageSource; explicit width and height win over the source's own. */
export function imageAttrs(src: ImageSource, width?: number, height?: number): { src: string; width?: number; height?: number } {
	if (typeof src === "string") return { src, width, height };
	return { src: src.src, width: width ?? src.width, height: height ?? src.height };
}

/** A ratio as CSS (`16 / 9`). Throws on anything but two positive numbers, so no other CSS gets in. */
export function ratioCss(ratio: string): string {
	const m = /^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/.exec(ratio);
	if (!m || Number(m[1]) <= 0 || Number(m[2]) <= 0) throw new Error(`Media: ratio must be "width/height", like "16/9"; got ${JSON.stringify(ratio)}`);
	return `${m[1]} / ${m[2]}`;
}

const FOCAL_PART = /^(?:left|center|right|top|bottom|(?:100(?:\.0+)?|\d{1,2}(?:\.\d+)?)%)$/;
const X = new Set(["left", "right"]);
const Y = new Set(["top", "bottom"]);

/**
 * A focal point as CSS `object-position`, or undefined when none is set. One or two parts, each a keyword (left,
 * center, right, top, bottom) or a percentage from 0% to 100%; two parts are x then y, except that a pair of
 * keywords may come in either order ("top left"). Throws on anything else, so no other CSS gets in.
 */
export function focalCss(focal?: string): string | undefined {
	if (focal === undefined) return undefined;
	const parts = focal.trim().split(/\s+/);
	const fail = () => {
		throw new Error(`focalPoint must be one or two keywords (left, center, right, top, bottom) or percentages, like "50% 30%" or "top"; got ${JSON.stringify(focal)}`);
	};
	if (parts.length < 1 || parts.length > 2 || !parts.every((p) => FOCAL_PART.test(p))) fail();
	if (parts.length === 2) {
		const [a, b] = parts;
		const keywords = !a.endsWith("%") && !b.endsWith("%");
		// Two keywords: one per axis, in either order. Otherwise x then y: no top or bottom first, no left or right second.
		if (keywords ? (X.has(a) && X.has(b)) || (Y.has(a) && Y.has(b)) : Y.has(a) || X.has(b)) fail();
	}
	return parts.join(" ");
}
