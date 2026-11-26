import type { MediaImage } from "./image";

/** One feature in FeatureGridCards' items: a title, a short text and an optional image. */
export interface FeatureCardItem {
	title: string;
	text: string;
	/** An image for the item (FeatureGridCards: at the top of its card, Card's `image`). */
	image?: MediaImage;
}

/** The most columns a feature grid takes (FeatureGridIcons' and FeatureGridCards' `cols`, Grid's name). */
export type FeatureCols = 2 | 3 | 4;

/**
 * The list's columns for a cap: one column, two from a 36rem features box, then the cap from 56rem (four from 64rem,
 * so four items are never squeezed). Six items with a cap of three split three and three, never four and two.
 * Written out in full, so Tailwind sees every class.
 */
export const featureCols: Record<FeatureCols, string> = {
	2: "@xl/features:grid-cols-2",
	3: "@xl/features:grid-cols-2 @4xl/features:grid-cols-3",
	4: "@xl/features:grid-cols-2 @5xl/features:grid-cols-4",
};

/** Without a cap: as many columns as fit, each at least 15rem (auto-fit, so a few items stretch to fill the row). */
export const featureAutoCols = "grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))]";
