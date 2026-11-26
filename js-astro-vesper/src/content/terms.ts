/**
 * Single terms: a post has one category and one series at most. EmDash lets an editor tick two; the source keeps the
 * first (A to Z by label, as every source lists terms) and records the post here, and conformance and the setup check
 * report it. The Markdown schema takes one slug, so it never records one.
 *
 * The record is kept per place and updated whenever the value is mapped again, so in `astro dev` a fixed post stops
 * being reported on the next request.
 *
 * Plain Node loads this file (the unit tests), so it imports nothing Node cannot load.
 */
import type { Term } from "@astronomic/content";

const extra = new Map<string, string[]>();

/** The first of `terms`, recording `where` when there is more than one. */
export function oneTerm(terms: readonly Term[], where: string): Term | undefined {
	if (terms.length > 1) extra.set(where, terms.map((t) => t.slug));
	else extra.delete(where);
	return terms[0];
}

/** Every place that held more than one term, one line each (sorted, so the output is stable). */
export function termProblems(): string[] {
	return [...extra]
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([where, slugs]) => `${where}: ${slugs.length} terms (${slugs.join(", ")}); one at most is allowed, so only "${slugs[0]}" is used.`);
}

/** Forgets every record (the unit tests). */
export function clearTermProblems() {
	extra.clear();
}
