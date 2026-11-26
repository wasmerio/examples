/**
 * The shape every pill shares: round ends (the control radius), the small control label, no underline at rest, and a
 * short color transition (none under reduced motion). The height comes from wrap (below). Each tone adds its own full
 * state map; the tones never share colors.
 */
const shape =
	"inline-flex items-center rounded-control px-3.5 text-control-sm no-underline motion-ok:transition-[color,background-color,border-color,text-decoration-color] motion-ok:duration-150";
/** A pill that wraps (a topic): it grows from the small control height, and a long word breaks inside it. */
const wraps = "h-auto min-h-control-sm py-1 [overflow-wrap:anywhere]";
/** A one-line pill (FilterNav's filters, which keep each label on one line): the fixed small control height. */
const oneLine = "h-control-sm";

/**
 * The page tone (FilterNav's filters, a post's topic on the page): a hairline edge and muted text, both turning fg on
 * hover; the current item (aria-current="page") filled in fg with the page color as its text.
 */
const page = [
	"border-ui border-solid border-border text-muted",
	"hover:border-fg hover:text-fg",
	"aria-[current=page]:border-fg aria-[current=page]:bg-fg aria-[current=page]:text-bg aria-[current=page]:font-semibold",
].join(" ");

/**
 * The image tone (a topic on a photo, under a scrim): a scrim-fg fill with scrim text, the same on hover, which only
 * adds an underline. No page color: in a dark preset fg is light, and it would put light text on the light pill.
 * No current state: a pill on a photo is a link to elsewhere.
 */
const image = "border-ui border-solid border-transparent bg-scrim-fg text-scrim hover:underline underline-offset-2";

/**
 * A pill link or tag (FilterNav's filters, a post's topic): the control's small height, round ends. tone image: on a
 * photo, under a scrim (scrim-fg fill, scrim text). The focus ring is the caller's: focusRing on the page; on a photo,
 * a focus-on-image wrapper around the pill (it rings descendants, not its host). Add tap-area for a 44px hit area.
 * wrap (default true): a long label wraps inside the pill; false keeps the fixed one-line height (FilterNav).
 */
export function pillClasses({ tone = "page", wrap = true }: { tone?: "page" | "image"; wrap?: boolean } = {}): string {
	return `${shape} ${wrap ? wraps : oneLine} ${tone === "image" ? image : page}`;
}
