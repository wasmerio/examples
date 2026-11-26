export function slugifySectionId(label = "", fallback = "section"): string {
	const slug = label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return slug || fallback;
}

export function createUniqueSectionId(
	label: string | undefined,
	usedIds: Set<string>,
	fallback: string,
): string {
	const base = slugifySectionId(label, fallback);
	let id = base;
	let suffix = 2;

	while (usedIds.has(id)) {
		id = `${base}-${suffix}`;
		suffix += 1;
	}

	usedIds.add(id);
	return id;
}
