/** A page number, or a gap shown as an ellipsis. */
export type PageItem = number | "gap";

/**
 * Pages to show: the first, the last, and `around` pages either side of the
 * current one. Runs of hidden pages become a gap; a gap of one page shows the page.
 */
export function pageItems(current: number, total: number, around = 1): PageItem[] {
	const shown = new Set<number>([1, total]);
	for (let n = current - around; n <= current + around; n++) {
		if (n >= 1 && n <= total) shown.add(n);
	}
	const sorted = [...shown].sort((a, b) => a - b);
	const items: PageItem[] = [];
	let previous = 0;
	for (const n of sorted) {
		if (n - previous === 2) items.push(n - 1);
		else if (n - previous > 2) items.push("gap");
		items.push(n);
		previous = n;
	}
	return items;
}
