/**
 * The title link of a card that is one link as a whole (CardMedia, CardSide, CardOverlay). Its ::after covers
 * the card, which must be `relative`, so a click anywhere follows it and the focus ring goes round the whole
 * card. The title is the link's only text, so its name stays short. A hover underlines the title.
 */
export const stretchedLink =
	"text-inherit no-underline outline-none after:absolute after:inset-0 after:rounded-card hover:underline focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:outline-offset-2 focus-visible:after:outline-accent";

/**
 * The focus ring of a stretched link on a photo (CardOverlay, Pro's StoryRailCard): the card clips its overflow, so the
 * ring sits inside it, and it must show on any image: a scrim-fg line between two scrim lines (an inset ring under the
 * outline), so one of the two colors stands out on any picture. Add it after stretchedLink.
 */
export const imageCardRing = "focus-visible:after:-outline-offset-4 focus-visible:after:outline-scrim-fg focus-visible:after:inset-ring-6 focus-visible:after:inset-ring-scrim";
