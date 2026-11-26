/**
 * The frame of a picture or a video: its shape, ratio, cut corner and focal point. Media and VideoMedia both use it,
 * so a photo and a video in the same shape get the same frame.
 *
 * The frame reads only tokens: --ui-radius-media (default the card radius), --ui-media-border-w (default 0) in
 * --ui-border, --ui-media-shadow (default none) and --ui-media-dim, a filter such as brightness(0.9) that dark blocks
 * set to take the glare off pale photos (default none). surface-2 shows while the picture loads.
 *
 * shape="circle" makes the frame round (rounded-full in place of rounded-media) and square (an inline 1 / 1). ratio
 * and ratioClass are then ignored, and a dev build warns once per render when either is set. shape="cut" clips the
 * frame box only (media-cut, with the corner as data-cut), never the root or the caption, so no focus ring is cut; it
 * drops the frame's edge and shadow, which the clip would cut.
 */
import { cn } from "./cn";
import { cutCornerAttr, focalCss, ratioCss, type CutCorner, type FocalPoint, type MediaRatio } from "./image";

export type MediaShape = "rect" | "circle" | "cut";

export interface MediaFrameOptions {
	shape?: MediaShape;
	cutCorner?: string | null;
	/** The ratio. Default 16/9. */
	ratio?: MediaRatio;
	/** Whether the caller set ratio itself, for the circle's warning. Default: whether ratio is set here. */
	ratioSet?: boolean;
	ratioClass?: string;
	focalPoint?: FocalPoint;
	/** The part's name, for the dev warnings ("Media"). */
	part?: string;
	/** Whether to warn (a dev build). */
	dev?: boolean;
}

export interface MediaFrame {
	/** The frame's classes: the fill, corners, edge and dim, the circle's round, the cut and ratioClass. */
	frameClass: string;
	/** The inline aspect ratio (`aspect-ratio: 16 / 9`), or undefined when ratioClass sets the shape. */
	ratioStyle?: string;
	/** The inline focal point (`object-position: top`), or undefined for the center. */
	focalStyle?: string;
	/** The cut corner, for data-cut, with shape="cut" only. */
	corner?: CutCorner;
}

/** The frame for these options. Throws on a bad ratio, focal point or corner, so no other CSS gets in. */
export function mediaFrame({ shape = "rect", cutCorner, ratio, ratioSet = ratio !== undefined, ratioClass: ratioClassProp, focalPoint, part = "Media", dev = false }: MediaFrameOptions = {}): MediaFrame {
	const circle = shape === "circle";
	if (circle && dev && (ratioSet || ratioClassProp !== undefined)) {
		console.warn(`${part}: shape="circle" is always square, so ratio and ratioClass are ignored.`);
	}
	const cut = shape === "cut";
	if (!cut && cutCorner != null && dev) console.warn(`${part}: cutCorner works only with shape="cut", so it is ignored.`);
	// Throws on an unknown corner, as ratioCss does on a bad ratio.
	const corner = cut ? cutCornerAttr(cutCorner) : undefined;
	const ratioClass = circle ? undefined : ratioClassProp;
	const ratioStyle = circle ? `aspect-ratio: ${ratioCss("1/1")}` : ratioClass ? undefined : `aspect-ratio: ${ratioCss(ratio ?? "16/9")}`;
	const focal = focalCss(focalPoint);
	// A circle swaps the frame's corner token for a full round; cn() drops rounded-media for rounded-full.
	const frameClass = cn("bg-surface-2 rounded-media media-frame border-solid border-border", circle && "rounded-full", cut && "media-cut", ratioClass);
	return { frameClass, ratioStyle, focalStyle: focal ? `object-position: ${focal}` : undefined, corner };
}

/**
 * The inline style that names a frame for a view transition (`--vt-name: work-apogee`), or undefined with no name.
 * The part adds `motion-ok:[view-transition-name:var(--vt-name)]`, so the name applies only when motion is allowed.
 * Throws on a name that is not a CSS name (letters, digits, - and _, not starting with a digit or -), so a space never
 * breaks the transition and no other CSS gets in. part names the caller in the error ("WorkCard").
 */
export function transitionNameStyle(name: string | undefined, part = "Media"): string | undefined {
	if (name === undefined) return undefined;
	if (!/^[A-Za-z_][\w-]*$/.test(name)) {
		throw new Error(`${part}: transitionName must be a CSS name (letters, digits, - and _), like "work-apogee"; got ${JSON.stringify(name)}`);
	}
	return `--vt-name: ${name}`;
}
