export const FILTER_PARAM = "filter";

export function readFilterFromSearch(
	search: string,
	allowedFilters: readonly string[],
): string | undefined {
	const params = new URLSearchParams(search);
	const filter = params.get(FILTER_PARAM);
	return filter && allowedFilters.includes(filter) ? filter : undefined;
}

export function buildFilterSearch(search: string, filter: string): string {
	const params = new URLSearchParams(search);

	if (filter === "all") {
		params.delete(FILTER_PARAM);
	} else {
		params.set(FILTER_PARAM, filter);
	}

	const nextSearch = params.toString();
	return nextSearch ? `?${nextSearch}` : "";
}

export function isFilterSectionVisible(
	activeFilter: string,
	sectionFilter: string | undefined,
): boolean {
	return activeFilter === "all" || sectionFilter === activeFilter;
}
