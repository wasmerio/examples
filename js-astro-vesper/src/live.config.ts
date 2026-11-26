/**
 * Live collections. The selected content source supplies its loaders
 * (EmDash: `_emdash`; Markdown: none). Add your own collections below.
 */
import { defineLiveCollection } from "astro:content";
import { liveLoaders } from "astronomic:content/live";

export const collections = {
	...Object.fromEntries(
		Object.entries(liveLoaders).map(([name, loader]) => [name, defineLiveCollection({ loader })]),
	),
	// mine: defineLiveCollection({ loader: myLoader() }),
};
