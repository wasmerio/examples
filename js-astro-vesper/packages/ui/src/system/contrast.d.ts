type Rgb = [number, number, number];

/** WCAG 2 relative luminance of an sRGB color, channels 0–255. */
export declare function luminance(rgb: Rgb): number;
/** WCAG 2 contrast ratio of two sRGB colors, channels 0–255 (1 to 21). */
export declare function contrast(a: Rgb, b: Rgb): number;
/** `color` at `alpha` (0 to 1) over `under`, per channel. */
export declare function over(colour: Rgb, alpha: number, under: Rgb): Rgb;
/** The shares of --ui-scrim that CardOverlay and HeroCover lay over an image under the text, bottom first. */
export declare const SCRIM_LAYERS: number[];
/** The scrim layers over a black and over a white image: the two ends of what shows behind the text. */
export declare function scrimBackdrops(scrim: Rgb, layers?: number[]): [Rgb, Rgb];
/** The lowest contrast of `fg` on the scrim over any image. */
export declare function contrastOnImage(fg: Rgb, scrim: Rgb, layers?: number[]): number;
