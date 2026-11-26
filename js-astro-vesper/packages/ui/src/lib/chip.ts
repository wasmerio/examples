import { focusRingWithin, touchBox } from "./button.ts";
import { cn } from "./cn.ts";

/**
 * The option chip: a native checkbox (or radio) visually hidden inside its label, the label drawn as a pill
 * (FilterChoice's chips, Pro QuotePicker's picks). At rest the page Button's outline colors, checked its filled
 * colors (accent, accent-fg) and a check, so the state is not color alone. The focus ring is on the chip. The corners
 * are the pill token's (rounded-pill: --ui-radius-pill, fully round by default).
 *
 * - sm (default): FilterChoice's chip, a small control that grows to 44px on a touch screen (touchBox).
 * - lg: 44px tall at every pointer, the control type size, 12px before the label and 16px after it.
 *
 * Put optionChipInput on the input (first in the label), then either the check icon with optionChipCheck (it shows
 * only when checked), or, with box, a span with optionChipBox holding the check: an empty box at rest that fills with
 * the check when checked. The box's corners nest in the chip's: the chip's radius less its start padding (the gap).
 */
export type OptionChipSize = "sm" | "lg";

/** Per size: the height and gap, the padding and type size, the touch box, and the box's gap (the start padding). */
const sizes: Record<OptionChipSize, { height: string; pad: string; touch: string; gap: string }> = {
	sm: { height: "min-h-control-sm cursor-pointer items-center gap-1.5", pad: "px-3.5 py-1 text-control-sm", touch: touchBox, gap: "[--nest-gap:0.875rem]" },
	lg: { height: "min-h-11 cursor-pointer items-center gap-2", pad: "ps-3 pe-4 py-1 text-control", touch: "", gap: "[--nest-gap:0.75rem]" },
};

export function optionChip({ size = "sm", box = false }: { size?: OptionChipSize; box?: boolean } = {}): string {
	const s = sizes[size] ?? sizes.sm;
	return cn(
		`relative inline-flex ${s.height} rounded-pill border-ui border-solid ${s.pad} font-medium select-none`,
		"border-border-control bg-surface text-fg hover:bg-surface-2",
		"has-checked:border-accent has-checked:bg-accent has-checked:text-accent-fg has-checked:hover:border-accent-hover has-checked:hover:bg-accent-hover",
		focusRingWithin,
		"motion-ok:transition-[background-color,border-color,color] motion-ok:duration-150",
		s.touch,
		box && s.gap,
	);
}

/** The input inside the chip: visually hidden, and the peer the check and the box read. */
export const optionChipInput = "peer sr-only";

/** The check icon without a box: shown only when the input is checked. */
export const optionChipCheck = "hidden peer-checked:inline-flex";

/**
 * The box (box: true): 1.25rem, nested corners, a control edge at rest with the check drawn in no color; checked, an
 * accent-fg fill with the check in accent (the chip is accent then, so the box is its inverted pair).
 */
export const optionChipBox =
	"inline-flex size-5 shrink-0 items-center justify-center rounded-nested border-ui border-solid border-border-control text-transparent peer-checked:border-accent-fg peer-checked:bg-accent-fg peer-checked:text-accent";
