// Modules that `contentSource()` (astro.mjs) points at the selected source.
declare module "astronomic:content/source" {
	// biome-ignore lint/suspicious/noExplicitAny: each source file is checked with defineAdapter<Model>().
	const adapter: import("./types").ContentAdapter<any, any>;
	export default adapter;
}
declare module "astronomic:content/live" {
	export const liveLoaders: Record<string, import("astro/loaders").LiveLoader>;
}

interface ImportMetaEnv {
	/** "static" or "server", set by contentSource() in astro.config.mjs. */
	readonly CONTENT_OUTPUT: "static" | "server";
}
