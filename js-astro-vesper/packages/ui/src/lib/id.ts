let count = 0;

/** A page-unique id for linking labels and descriptions (e.g. `aria-labelledby`). */
export function uid(prefix = "ui"): string {
	count += 1;
	return `${prefix}-${count}`;
}
