import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { systemEnabled } from "./gate.mjs";
import { normalizeRoute, systemHref } from "./paths.mjs";

const ID = "virtual:astronomic-system";
/** A real file (`null`), so theme code can import it even without this integration. */
const LINK_SPECIFIER = "@astronomic/ui/system/link";
const own = (path) => fileURLToPath(new URL(path, import.meta.url));

/** [page under the route, file in ./pages, footer label] */
const PAGES = [
	["", "index", "Overview"],
	["foundations", "foundations", "Foundations"],
	["components", "components", "Components"],
	["sections", "sections", "Sections"],
];

/** The code served for `@astronomic/ui/system/link`. `base` null: the pages are off. */
export function linkModule(base, route) {
	const links = base === null ? null : PAGES.map(([page, , label]) => ({ label, href: systemHref(base, route, page) }));
	return [
		`export const systemLink = ${JSON.stringify(links ? links[0].href : null)};`,
		`export const systemLinks = ${JSON.stringify(links)};`,
	].join("\n");
}

/**
 * Design system pages for an Astronomic theme. On in `astro dev`; in a build
 * only with ASTRONOMIC_SYSTEM=1. See packages/ui/README.md.
 *
 * Options: `layout` (required), `sections`, `extras` (optional theme files,
 * relative to the site root), `tokens` (theme token prefixes, e.g. ["--ag-"]),
 * `name` (shown on the pages, default "Theme") and `route` (default "/system").
 * `screens` (optional) is a module that exports `screens`: the theme's pages,
 * shown as live previews on the start page.
 *
 * `@astronomic/ui/system/link` exports `systemLink` (the start page) and
 * `systemLinks` (every page), or `null` when the pages are off. The plugin serves that value in place of
 * the file, in every build.
 */
export function astronomicSystem(options = {}) {
	return {
		name: "@astronomic/ui/system",
		hooks: {
			"astro:config:setup": ({ command, config, injectRoute, updateConfig }) => {
				const enabled = systemEnabled({ command });
				const route = normalizeRoute(options.route);
				const linkFile = own("./link.mjs");
				const linkCode = linkModule(enabled ? config.base : null, route);
				/** Virtual module id -> its code. */
				const modules = {};
				const plugin = {
					name: "astronomic-system",
					enforce: "pre",
					resolveId: (id) => (id === LINK_SPECIFIER ? linkFile : Object.hasOwn(modules, id) ? `\0${id}` : undefined),
					load: (id) => {
						if (id.split("?")[0] === linkFile) return linkCode;
						return id.startsWith("\0") && Object.hasOwn(modules, id.slice(1)) ? modules[id.slice(1)] : undefined;
					},
				};
				updateConfig({ vite: { plugins: [plugin] } });
				if (!enabled) return;

				const fromRoot = (path) => fileURLToPath(new URL(path, config.root));

				if (!options.layout) throw new Error('astronomicSystem: set `layout`, e.g. "./src/system/Layout.astro".');
				const layout = fromRoot(options.layout);
				if (!existsSync(layout)) throw new Error(`astronomicSystem: layout not found: ${layout}`);

				// Not set: the package stub. Set but missing: an error, so a typo does not hide.
				const themeFile = (key) => {
					const path = fromRoot(options[key]);
					if (!existsSync(path)) throw new Error(`astronomicSystem: ${key} file not found: ${path}`);
					return path;
				};
				const optional = (key, stub) => (options[key] ? themeFile(key) : own(stub));
				const sections = optional("sections", "./stubs/NoSections.astro");
				const extras = optional("extras", "./stubs/NoExtras.astro");
				const screens = options.screens ? themeFile("screens") : null;
				const settings = { name: options.name ?? "Theme", route, tokens: options.tokens ?? [] };

				modules[ID] = [
					`export { default as Layout } from ${JSON.stringify(layout)};`,
					`export { default as Sections } from ${JSON.stringify(sections)};`,
					`export { default as Extras } from ${JSON.stringify(extras)};`,
					screens ? `export { screens } from ${JSON.stringify(screens)};` : "export const screens = null;",
					`export const settings = ${JSON.stringify(settings)};`,
				].join("\n");

				// No `prerender` in the pages: they follow the site's output
				// (static in a static build, on demand in a server build).
				for (const [page, file] of PAGES) {
					injectRoute({
						pattern: page ? `${route}/${page}` : route,
						entrypoint: new URL(`./pages/${file}.astro`, import.meta.url),
					});
				}
			},
		},
	};
}
