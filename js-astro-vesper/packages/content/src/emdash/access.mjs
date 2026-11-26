/**
 * `emdashAccess({ collections })`: an Astro integration for EmDash sites with gated collections. It adds the
 * search guard (`@astronomic/content/emdash/search-guard`), which keeps anonymous callers and non-editors of
 * `/_emdash/api/search` and `/suggest` away from those collections. Add it next to `emdash()` in
 * `emdash.setup.mjs`. Plain JavaScript, no imports: config files load it before Vite.
 */

/** @param {{ collections: string[] }} options */
export function emdashAccess(options) {
	const collections = options?.collections;
	if (!Array.isArray(collections) || collections.length === 0) {
		throw new Error("emdashAccess: name the gated collections, e.g. emdashAccess({ collections: [\"posts\"] }).");
	}
	return {
		name: "astronomic-emdash-access",
		hooks: {
			"astro:config:setup": ({ addMiddleware, updateConfig }) => {
				addMiddleware({ entrypoint: "@astronomic/content/emdash/search-guard", order: "post" });
				updateConfig({
					vite: { define: { "import.meta.env.ASTRONOMIC_GATED_COLLECTIONS": JSON.stringify(collections) } },
				});
			},
		},
	};
}

export default emdashAccess;
