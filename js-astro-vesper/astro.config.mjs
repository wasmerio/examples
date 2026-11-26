import { satteri } from "@astrojs/markdown-satteri";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { contentSource } from "@astronomic/content/astro";
import { contentTests, privateResponses, staticSearch } from "@astronomic/theme-core/astro";
import { astronomicSystem } from "@astronomic/ui/system";

// The content source: the one switch. A name of a source in src/content/sources/
// ("markdown", "emdash", or your own). CONTENT_SOURCE overrides it (used by tests).
const content = await contentSource(process.env.CONTENT_SOURCE ?? "markdown", import.meta.url);

/**
 * Checks src/theme.config.ts when the config loads (src/utils/config.ts, checkConfigFile), so `pnpm check`, `pnpm dev`
 * and every build stop on an unknown id. An EmDash build renders no page while it builds, so without this a typo would
 * build and only show up on the live site.
 */
const configFileCheck = {
	name: "vesper-config-file",
	hooks: {
		"astro:config:setup": async () => {
			const { checkConfigFile } = await import("./src/utils/config.ts");
			const problems = checkConfigFile();
			if (problems.length) throw new Error(`Vesper config file:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
		},
	},
};

export default defineConfig({
	// The public URL. The feed, the sitemap, robots.txt and share cards need it. Set SITE_URL (EmDash reads the
	// same variable; on a server build it also wins at run time) or edit this line.
	site: process.env.SITE_URL || "https://example.com",
	// Static for build-time sources (Markdown), server for per-request ones (EmDash).
	output: content.output,
	adapter: content.adapter,
	// Show quotes as written, the same as CMS sources (no automatic curly quotes). Code blocks are plain text in the
	// theme's code face on the look's surface (prose.css), the same as CMS sources: no highlighter colors.
	markdown: { processor: satteri({ features: { smartPunctuation: false } }), syntaxHighlight: false },
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		configFileCheck,
		// EmDash's admin is a React app.
		react(),
		// Design system pages at /system: in `astro dev`, and in a build with ASTRONOMIC_SYSTEM=1.
		astronomicSystem({
			name: "Vesper",
			layout: "./src/system/Layout.astro",
			sections: "./src/system/Sections.astro",
			extras: "./src/system/Extras.astro",
			screens: "./src/system/screens.ts",
			tokens: ["--v-"],
		}),
		...content.integrations,
		// The content tests (with CONTENT_CONFORMANCE set) inject two routes: the adapter
		// conformance check, and a normalized snapshot of every collection that
		// `pnpm test:parity` compares across sources.
		contentTests({ conformance: "./src/content/conformance.route.ts", snapshot: "./src/content/snapshot.route.ts" }),
		// Static builds: Pagefind indexes the entry pages after the build (dist/pagefind/), for /search.
		// Server builds keep the source's own search and skip this.
		staticSearch(),
		// Server builds: edit-mode and preview-token requests get private no-store on every response (pages, the
		// feed, the sitemap, cards), so an editor's view is never stored by a shared cache.
		privateResponses(),
	],
	vite: {
		plugins: [
			tailwindcss(),
			// `pnpm test:no-emdash` fails the build on any EmDash / @astrojs/node import.
			...(process.env.CONTENT_FORBID ? [(await import("@astronomic/theme-core/scripts/forbid.mjs")).forbidPlugin()] : []),
		],
		resolve: { alias: content.alias },
		// Test only: VESPER_CONFIG overrides the look choices for one build (src/utils/config.ts), VESPER_SETTINGS the
		// settings (src/utils/setup.ts), VESPER_PER_PAGE a smaller page size (src/utils/routes.ts). Empty by default.
		define: {
			...content.define,
			"import.meta.env.VESPER_CONFIG": JSON.stringify(process.env.VESPER_CONFIG ?? ""),
			"import.meta.env.VESPER_SETTINGS": JSON.stringify(process.env.VESPER_SETTINGS ?? ""),
			"import.meta.env.VESPER_PER_PAGE": JSON.stringify(process.env.VESPER_PER_PAGE ?? ""),
		},
		// Pre-bundle React (EmDash's admin) so the dev server doesn't re-optimize
		// mid-load (which mixes React chunks and breaks hooks on first visit).
		optimizeDeps: {
			include: ["react", "react-dom", "react-dom/client"],
		},
	},
	devToolbar: { enabled: false },
});
