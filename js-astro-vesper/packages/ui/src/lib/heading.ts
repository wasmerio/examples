/** The level of a section heading (decision 0015: h2 to h4; the page's h1 belongs to the Hero). */
export type SectionHeadingTag = "h2" | "h3" | "h4";
/** The level of each item's heading in a list: one under a section heading (h3 to h5), or h2 to h5 without one. */
export type ItemHeadingTag = "h2" | "h3" | "h4" | "h5";

/**
 * The element for each item heading: one level under the section heading when there is one (h2 gives h3), else
 * itemHeadingTag (default h3). A shell cannot pass a value into its slot content (decision 0013), so each recipe
 * calls this once and gives the result to every item part. With the types above, h6 cannot come out.
 */
export function childHeadingTag({ heading, headingTag = "h2", itemHeadingTag = "h3" }: { heading?: string; headingTag?: SectionHeadingTag; itemHeadingTag?: ItemHeadingTag }): ItemHeadingTag {
	if (!heading) return itemHeadingTag;
	return `h${Number(headingTag.slice(1)) + 1}` as ItemHeadingTag;
}
