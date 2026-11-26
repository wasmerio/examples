/**
 * Layout classes shared by the theme's parts. Written out in full so Tailwind finds them. Sizes and spaces read the
 * Vesper tokens (`--v-*`, src/styles/vesper.css); the breakpoints are the theme's: phones up to 600px (`max-phone:`),
 * tablets up to 900px (`max-tablet:`, where the nav folds into the menu), the wide layout from 1101px (`wide:`).
 */

/** The page container: at most --v-wrap (1200px) wide, with --v-gut each side (40px, 20px up to 900px). */
export const wrap = "v-wrap";

/** Space above a section: --v-sec (120px, 88px up to 900px). */
export const sectionSpace = "mt-v-sec";

/** A plain text link: underlined on hover. */
export const hoverUnderline = "no-underline hover:underline";

// ---------------------------------------------------------------------------
// Image sizes, per slot. The container is at most 1200px.
// ---------------------------------------------------------------------------

export const imageSizes = {
	/** Full width. */
	full: { widths: [640, 800, 960, 1280, 1600, 2000, 2400], sizes: "100vw" },
	/** The container's width. */
	container: { widths: [480, 640, 800, 960, 1200, 1600, 2400], sizes: "(min-width: 1280px) 1200px, calc(100vw - 40px)" },
	/** The avatar in the nav (40px; KitImage gives a fixed size its 1x, 2x and 3x widths). */
	avatar: { sizes: "40px" },
	/** The author box's avatar (64px). */
	author: { sizes: "64px" },
	/** A mark's logo in the Work and Projects cards (40px). */
	mark: { widths: [40, 80, 120], sizes: "40px" },
	/** A collage photo: about a third of the band on desktop and tablet, half the screen on phones (Mosaic's widest cells). */
	collage: { widths: [320, 480, 640, 960], sizes: "(min-width: 1101px) 32vw, (min-width: 601px) 40vw, 50vw" },
	/** A project card's photo: a third of the container, half up to 1100px, the full width on phones. */
	project: { widths: [400, 560, 800, 1120], sizes: "(min-width: 1101px) 374px, (min-width: 601px) calc(50vw - 40px), calc(100vw - 40px)" },
	/** The photo beside a page's text (the Now page's, the about portrait): 360px, the full width up to 900px. */
	aside: { widths: [360, 540, 720, 1080], sizes: "(min-width: 901px) 360px, calc(100vw - 40px)" },
	/** A post card's photo in the article grid: half the container (two columns), the full width on phones. */
	card: { widths: [400, 580, 800, 1160], sizes: "(min-width: 1280px) 580px, (min-width: 601px) calc(50vw - 60px), calc(100vw - 40px)" },
	/** A uses group's photo: the group's 18rem side column beside its items; up to 900px at most 32rem, the full width on phones. */
	usesGroup: { widths: [288, 400, 576, 800, 1024], sizes: "(min-width: 901px) 288px, (min-width: 553px) 512px, calc(100vw - 40px)" },
	/** A post row's thumbnail: 200px square, the full width on phones. */
	thumb: { widths: [200, 400, 600, 800], sizes: "(min-width: 601px) 200px, calc(100vw - 40px)" },
} as const;
