import { focusRing } from "./button";
import { cn } from "./cn";

/**
 * A link in a footer recipe (FooterColumns, FooterSimple, FooterCentered), inside the Footer shell's
 * surface-band: on-band-muted, and on-band on hover and on the current page (the page's muted and fg, or the
 * band's text color). On the band both are one color, so a hover underlines in it instead (on-band-underline,
 * transparent on the page). The underline's color is set before the hover too, so it never fades from the text
 * color to transparent (a short flash on the page).
 */
export const footerLink = cn(
	"rounded-control text-on-band-muted no-underline decoration-on-band-underline hover:text-on-band hover:underline motion-ok:transition-[color,background-color,border-color,text-decoration-color] motion-ok:duration-150 aria-[current=page]:text-on-band",
	focusRing,
);
