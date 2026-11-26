import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The content tests' routes as an Astro integration. With CONTENT_CONFORMANCE
 * set (the test runners set it), it injects the adapter conformance check and,
 * if given, a normalized snapshot of every collection that the parity runner
 * compares across sources. Without it, it adds nothing.
 *
 *   integrations: [contentTests({ conformance: "./src/content/conformance.route.ts", snapshot: "./src/content/snapshot.route.ts" })]
 */

/**
 * @param {{ conformance: string; snapshot?: string }} routes Entry points, relative to the project root.
 * @returns {import("astro").AstroIntegration}
 */
export function contentTests({ conformance, snapshot }) {
	return {
		name: "content-conformance",
		hooks: {
			"astro:config:setup": ({ injectRoute }) => {
				if (!process.env.CONTENT_CONFORMANCE) return;
				injectRoute({ pattern: "/_conformance.json", entrypoint: conformance });
				if (snapshot) injectRoute({ pattern: "/_snapshot.json", entrypoint: snapshot });
			},
		},
	};
}

/**
 * Private responses: adds theme-core's middleware (`@astronomic/theme-core/middleware`, order "post"). Edit-mode
 * and preview-token requests, and requests a page marked reader-private, get `Cache-Control: private, no-store`
 * and the route cache off, on every response (HTML, the feed, the sitemap, card PNGs). See src/middleware.ts for
 * the known limit (a warm public route-cache hit is served before any middleware).
 *
 *   integrations: [staticSearch(), privateResponses()]
 *
 * @returns {import("astro").AstroIntegration}
 */
export function privateResponses() {
	return {
		name: "astronomic-private-responses",
		hooks: {
			"astro:config:setup": ({ addMiddleware }) => {
				addMiddleware({ entrypoint: "@astronomic/theme-core/middleware", order: "post" });
			},
		},
	};
}

/**
 * Static search: after a static build, Pagefind indexes the built pages
 * (only those with `data-pagefind-body`) and writes `pagefind/` next to them. With no such
 * page (every entry deleted or hidden from search engines) it warns and writes a stand-in
 * `pagefind/pagefind.js` that finds nothing: the search page then says no results. A server build keeps the source's request search:
 * this does nothing there and never loads Pagefind.
 *
 *   integrations: [staticSearch()]
 *
 * @param {{ exclude?: string[] }} [options] CSS selectors Pagefind leaves out of the index.
 * @param {{ pagefind?: any }} [deps] For tests only: a stand-in for the pagefind package.
 * @returns {import("astro").AstroIntegration}
 */
export function staticSearch(options = {}, deps = {}) {
	let output;
	return {
		name: "astronomic-static-search",
		hooks: {
			"astro:config:setup": ({ config, updateConfig }) => {
				// Pagefind's URLs end in a slash; SearchPage drops it unless the site always uses one.
				updateConfig({ vite: { define: { "import.meta.env.ASTRONOMIC_SEARCH_KEEP_TRAILING_SLASH": JSON.stringify(config.trailingSlash === "always") } } });
			},
			"astro:config:done": ({ config, buildOutput }) => {
				// A static config with on-demand routes builds a server.
				output = buildOutput ?? config.output;
			},
			"astro:build:done": async ({ dir, logger }) => {
				if (output !== "static") return;
				const path = fileURLToPath(dir);
				// Without any data-pagefind-body page, Pagefind would index every page (lists, home, search),
				// and an index with no pages does not load in the browser. So an empty corpus gets a stand-in.
				if (!hasIndexedPage(path)) {
					mkdirSync(join(path, "pagefind"), { recursive: true });
					writeFileSync(join(path, "pagefind", "pagefind.js"), EMPTY_PAGEFIND);
					logger.warn("Pagefind: no built page has data-pagefind-body, so there is nothing to search; a stand-in index that finds nothing was written. Entry pages mark their main element with it; hidden (noindex) entries do not.");
					return;
				}
				const pagefind = deps.pagefind ?? (await import("pagefind"));
				try {
					const created = await pagefind.createIndex(options.exclude?.length ? { excludeSelectors: options.exclude } : {});
					failOn(created.errors);
					const added = await created.index.addDirectory({ path });
					failOn(added.errors);
					const outputPath = join(path, "pagefind");
					failOn((await created.index.writeFiles({ outputPath })).errors);
					const pages = indexedPages(outputPath);
					logger.info(pages === undefined ? "Pagefind: index written; the page count is not known" : `Pagefind: ${pages} pages indexed`);
				} finally {
					await pagefind.close();
				}
			},
		},
	};
}

/** The stand-in for an empty corpus: the search page loads it and shows its "no results" text. */
export const EMPTY_PAGEFIND = "export async function init() {}\nexport async function search() { return { results: [] }; }\n";

/**
 * True when some built HTML file has `data-pagefind-body`.
 * @param {string} dir
 */
function hasIndexedPage(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
		if (entry.isFile() && entry.name.endsWith(".html") && readFileSync(join(entry.parentPath, entry.name), "utf8").includes("data-pagefind-body")) return true;
	}
	return false;
}

/**
 * Pages in the written index (`addDirectory` counts every file it read, also those without `data-pagefind-body`), or
 * undefined when the file cannot be read yet: Pagefind may not have finished writing it. Only a log line needs the count,
 * so this never fails the build.
 * @param {string} outputPath
 * @returns {number | undefined}
 */
function indexedPages(outputPath) {
	try {
		const entry = JSON.parse(readFileSync(join(outputPath, "pagefind-entry.json"), "utf8"));
		return Object.values(entry.languages ?? {}).reduce((n, language) => n + (language.page_count ?? 0), 0);
	} catch {
		return undefined;
	}
}

/** @param {string[] | undefined} errors */
function failOn(errors) {
	if (errors?.length) throw new Error(`Pagefind: ${errors.join("; ")}`);
}
