// Shared form-control classes and the ids that link a Field's hint and error to its control.
import { focusRing } from "./button";
import { cn, cx } from "./cn";

/** Id of a Field's hint text, for the control with this id. */
export const hintId = (id: string) => `${id}-hint`;

/** Id of a Field's error text, for the control with this id. */
export const errorId = (id: string) => `${id}-error`;

/**
 * The `aria-describedby` value for a control inside a Field.
 * Pass the same `hint` and `error` you pass to the Field.
 */
export function describedBy(id: string, { hint, error }: { hint?: unknown; error?: unknown }): string | undefined {
	const ids = [hint ? hintId(id) : "", error ? errorId(id) : ""].filter(Boolean);
	return ids.length > 0 ? ids.join(" ") : undefined;
}

/** Base look of text controls (Input, Textarea). */
export const controlClasses = cx(
	// bg-field-fill is --ui-field-bg (optional, default --ui-surface). border-field is --ui-field-border-w (optional,
	// default --ui-border-w) on the top and side edges; the bottom edge keeps --ui-border-w (border-b-ui), so a filled
	// field with no side edges still shows a 3:1 line.
	"block w-full min-w-0 bg-field-fill text-fg font-body text-base leading-normal placeholder:text-muted",
	"border-field border-b-ui border-solid border-border-control",
	"hover:not-disabled:border-muted motion-ok:transition-[border-color] motion-ok:duration-150",
	// Invalid: the edge turns --ui-danger. A filled field (--ui-field-border-w under --ui-border-w) has no side
	// edges to color, so field-invalid-ring, an inset ring, makes up the difference; a bordered field gets none (0px).
	"aria-invalid:border-danger aria-invalid:hover:not-disabled:border-danger aria-invalid:focus-visible:outline-danger",
	"aria-invalid:field-invalid-ring",
	// Disabled: faded as well as grayed, so it never reads as a filled field.
	"disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted disabled:opacity-60",
	focusRing,
);

/**
 * A filter drawn as a dropdown (FilterChoice, FilterRange): a Popover whose trigger holds the field's label over its value,
 * which is the look of a Field's label over its control, all one button, so the trigger's name is the label and the value.
 * The trigger drops its own box and the value takes it, with its own chevron in place of the Popover's.
 */
export const filterDropdownClasses = {
	root: "[&>[data-popover-trigger]+span]:hidden",
	trigger: "grid h-auto gap-1.5 rounded-control border-0 border-b-0 bg-transparent p-0 pointer-coarse:min-h-0",
	label: "block truncate text-body font-medium text-fg",
	value: cn(controlClasses, "relative flex h-control items-center rounded-control ps-3.5 pe-10 pointer-coarse:min-h-11"),
	text: "block min-w-0 truncate",
	chevron: "pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-muted group-has-[:popover-open]/popover:rotate-180 motion-ok:transition-transform motion-ok:duration-200",
};
