/**
 * Your site's look: pick each choice here. `pnpm check` and the build stop on an unknown id. Pages and the layout
 * read these through `getConfig()` (src/utils/config.ts), never from this file.
 */
import type { Accent, ArticleList, Collage, LookId, OptionalPage } from "./utils/config.ts";

/**
 * The look (colors, fonts and the photo treatment): "clear" (cool neutral gray, Host Grotesk over Onest; the
 * default), "field" (Field notes: warm paper, Vollkorn over Commissioner; photos become prints with a one-line
 * caption) or "trail" (Trail map: cool gray with a fine grain and contour lines behind the intro, Sora over Public
 * Sans; photos sit in an even mat inside a thin line). Each is a file in src/styles/looks/.
 */
export const look: LookId = "clear";

/**
 * The accent: links, buttons, the focus ring and small accent text. "glacier" (lake blue; the default), "moss"
 * (green), "alpenglow" (warm red) or "dusk" (violet). Each passes 4.5:1 as text in every look, light and dark. Each
 * is a file in src/styles/accents/, listed in accents.json.
 */
export const accent: Accent = "glacier";

/**
 * The photo band on the home page: "mosaic" (a wide grid past the text column; the default), "row" (one full-width
 * row; two offset rows on smaller screens) or "sheet" (Contact sheet: an even sheet of frames). Each packs its
 * rectangle exactly for 4, 5 or 6 photos (the collage collection); with none, there is no band.
 */
export const collage: Collage = "mosaic";

/**
 * The article lists (/articles, each category and each tag): "grid" (cards in two columns, one on phones: the photo
 * on top, then the date and category, the title and a short summary; a post with no photo gets a tile in the
 * accent with its category; the default) or "rows" (the home page's rows: a square photo beside the text).
 */
export const articleList: ArticleList = "grid";

/** The photo on each post in a list (a row's square, a card's top). Off: the same rows and cards, text only. */
export const thumbnails = true;

/** The Now line under the intro on the home page (the Now status in your settings). Off: no line. */
export const nowLine = true;

/**
 * The optional pages. Off leaves a page out everywhere: its address answers 404, and the nav, the footer, the
 * sitemap, search, the feed and the home page's cards drop it.
 */
export const pages: Record<OptionalPage, boolean> = { projects: true, speaking: true, uses: true, now: true };

/** The "Built with Astronomic" link in the footer. Off by default: turn it on to credit the theme. */
export const builtWith = false;
