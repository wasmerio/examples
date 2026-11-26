/**
 * The Search family's shared classes: the dialog (Search.astro) and the search page (SearchPage.astro) draw their
 * filter rows, pills, group labels, breadcrumbs and marks from these, so the two look alike. Each reads the values the
 * `search-scope` utility sets on the family's root (theme.css): --search-line, --search-rule, --search-band,
 * --search-fill, --search-mark and --search-radius. Class strings only, read at build time; the lazy apps never import this file.
 */
import { focusRing, touchBox } from "./button";
import { cx } from "./cn";

/** A quiet label: a filter row's name, a group's name, "Recent searches". The kit's filter-label type, muted. */
export const searchLabel = "m-0 text-filter-label leading-none tracking-filter-label uppercase font-normal text-muted";

/** One filter row: its label, then its pills on one line that scrolls sideways on a narrow box (no wrap). */
export const searchFilterRow = "flex min-w-0 items-center gap-3";

/** A filter row's label: a fixed start column, so the rows' pills line up. */
export const searchFilterLabel = cx(searchLabel, "min-w-12 shrink-0");

/**
 * A filter row's pills: on a dialog narrower than 40rem, one line that scrolls sideways with a faded end; from 40rem
 * they wrap. The padding (taken back by the negative margin) leaves room for the focus ring inside the scroll box.
 */
export const searchPills = "-m-1 flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-x-auto p-1 @max-[40rem]/search:scroll-fade @min-[40rem]/search:flex-wrap @min-[40rem]/search:overflow-visible";

/** A pill: a type tab, a facet value, a recent search, a message's action. Hairline outline, normal weight. */
export const searchPill = cx(
	"inline-flex min-h-7 shrink-0 items-center gap-2 rounded-full border border-solid border-(--search-line) bg-bg px-2.5 max-w-full text-small leading-5 font-normal text-fg [overflow-wrap:anywhere] cursor-pointer",
	"hover:border-muted",
	touchBox,
	focusRing,
);

/** The one selected look for a type tab (aria-selected) and a facet value (aria-pressed): the text color as the fill. */
export const searchPillSelected = "aria-selected:border-fg aria-selected:bg-fg aria-selected:text-bg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg";

/** A pill's count, set apart: muted figures of one width; on a selected pill, the pill's own text color, softened. */
export const searchCount = "tabular-nums text-muted in-aria-selected:text-bg/70 in-aria-pressed:text-bg/70";

/**
 * A group's label row: a band on the soft band fill (--search-band), the name at the start, its count at the end, so a
 * group's start reads at a glance. Its corners are the rows' (capped).
 */
export const searchGroupLabel = cx(searchLabel, "flex items-center justify-between gap-3 rounded-(--search-radius) bg-(--search-band) px-3 py-2");

/** A group's count. */
export const searchGroupCount = "tabular-nums";

/** A result's breadcrumb: type › theme (crumbOf()), smaller than the snippet, quiet, not uppercase. */
export const searchCrumb = "flex min-w-0 flex-wrap items-baseline gap-x-1 text-filter-label leading-4 text-muted [overflow-wrap:anywhere]";

/** The mark between two crumbs. */
export const searchCrumbSep = "text-muted";

/** A matched word: a soft accent fill, small corners, the text in the page's text color. */
export const searchMark = "rounded-[0.1875rem] bg-(--search-mark) px-0.5 -mx-0.5 text-fg box-decoration-clone";

/** A result row's corners and its active (aria-selected) fill: a rounded fill only, no edge or border. */
export const searchRow = "rounded-(--search-radius) aria-selected:bg-(--search-fill)";

/**
 * A heading result: a step below a page result, and faded until it is the active row. The row (the dialog's option, the
 * page's list item) carries `searchHeading`; its title rests on the muted color, like its snippet, and comes back to
 * the text color when the row is the active option (aria-selected), hovered, or holds the focus. The snippet stays
 * muted: the muted color is the kit's faintest text at 4.5:1 (soft, light, has little room under it). Its title the
 * small size, its snippet the eyebrow size, so a page and its sections read as one block with the page on top.
 */
export const searchHeading = "group/heading";
export const searchHeadingTitle = "text-small text-balance text-muted [overflow-wrap:anywhere] group-hover/heading:text-fg group-aria-selected/heading:text-fg group-focus-within/heading:text-fg";
export const searchHeadingSnippet = "line-clamp-2 text-eyebrow leading-snug text-pretty text-muted [overflow-wrap:anywhere]";

/**
 * A heading result's `#`, hung in the gutter before its title: a fixed width taken back by a negative start margin, so
 * the title and the snippet under it start at the same x (logical, so it hangs on the right in a right-to-left page).
 * Its row needs a start padding of at least this width (1rem) to hold it.
 */
export const searchHeadingMark = "inline-block w-4 -ms-4 shrink-0 text-eyebrow text-muted opacity-60";
