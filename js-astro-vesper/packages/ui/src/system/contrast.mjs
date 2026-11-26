/** WCAG 2 relative luminance of an sRGB color, channels 0–255. */
export function luminance(rgb) {
	const [r, g, b] = rgb.map((v) => {
		const c = v / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio of two sRGB colors (1 to 21). */
export function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** `color` at `alpha` (0 to 1) over `under`, per channel, as the browser blends it. */
export function over(colour, alpha, under) {
	return colour.map((c, i) => alpha * c + (1 - alpha) * under[i]);
}

/**
 * The layers of --ui-scrim that the kit lays over an image under text (CardOverlay, HeroCover), bottom first: the veil
 * over the whole image (bg-scrim/20) and scrim-rise under the text block at its least, at the block's top (60%,
 * theme.css; it rises below that). The CardOverlay and HeroCover tests check that the files still use these shares.
 */
export const SCRIM_LAYERS = [0.2, 0.6];

/**
 * What shows behind text on the scrim over an image: the scrim layers over a black and over a white image. Every
 * other image lands between the two, so they are the worst cases.
 */
export function scrimBackdrops(scrim, layers = SCRIM_LAYERS) {
	return [
		[0, 0, 0],
		[255, 255, 255],
	].map((image) => layers.reduce((under, alpha) => over(scrim, alpha, under), image));
}

/** The lowest contrast of `fg` on the scrim over any image (scrimBackdrops). */
export function contrastOnImage(fg, scrim, layers = SCRIM_LAYERS) {
	return Math.min(...scrimBackdrops(scrim, layers).map((bg) => contrast(fg, bg)));
}
