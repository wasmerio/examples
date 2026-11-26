/**
 * Sort and match helpers every source shares, so all of them order and
 * filter the same way, and the conformance check tests against the same code.
 * The theme's own rules (which fields, which order) build on these.
 */

/** Text order that does not depend on the machine's locale. */
export const byText = (a: string, b: string) => a.localeCompare(b, "en");

/** Ascending; entries without a value go last. */
export function ascLast(a: number | undefined, b: number | undefined): number {
	if (a === undefined) return b === undefined ? 0 : 1;
	if (b === undefined) return -1;
	return a - b;
}

/** Descending; entries without a value go last. */
export function descLast(a: number | undefined, b: number | undefined): number {
	if (a === undefined) return b === undefined ? 0 : 1;
	if (b === undefined) return -1;
	return b - a;
}

type Ordered = { slug: string; order?: number };

/** `order` ascending (none last), then `label(entry)`, then slug. */
export function compareOrdered<T extends Ordered>(label: (e: T) => string) {
	return (a: T, b: T) => ascLast(a.order, b.order) || byText(label(a), label(b)) || byText(a.slug, b.slug);
}

/** Title, then slug. */
export const compareByTitle = (a: { title: string; slug: string }, b: { title: string; slug: string }) =>
	byText(a.title, b.title) || byText(a.slug, b.slug);

/** True when the query does not ask for `featured`, or the entry matches it. */
export const matchFeatured = (e: { featured: boolean }, q: { featured?: boolean }) =>
	q.featured === undefined || e.featured === q.featured;

/** The entry after `slug` in the full sorted list, wrapping to the first. */
export function nextAfter<T extends { slug: string }>(sorted: T[], slug: string): T | undefined {
	const i = sorted.findIndex((p) => p.slug === slug);
	if (i < 0 || sorted.length < 2) return undefined;
	return sorted[(i + 1) % sorted.length];
}

type LabelledTerm = { slug: string; label: string };

/** Label in `byText` order, then slug. */
export const compareTerms = (a: LabelledTerm, b: LabelledTerm) => byText(a.label, b.label) || byText(a.slug, b.slug);

/** A new array of the terms A to Z by label (ties by slug). */
export const sortTermsByLabel = <T extends LabelledTerm>(terms: readonly T[]): T[] => [...terms].sort(compareTerms);

type TaxonomyParts<C> = { list(name: string, ctx?: C): Promise<LabelledTerm[]> };

/**
 * Wraps a source's `taxonomies` part so every `list(name)` comes back A to Z
 * by label, whatever order the source keeps (file order, SQL collation).
 * Wrap it in every source so they all list terms by one rule.
 */
export function byLabelTaxonomies<P extends TaxonomyParts<C>, C>(parts: P | undefined): P | undefined {
	if (!parts) return undefined;
	return { ...parts, list: async (name: string, ctx?: C) => sortTermsByLabel(await parts.list(name, ctx)) };
}
