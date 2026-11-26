/**
 * Server renders of the theme's .astro components for the unit tests: a Vite dev server in middleware mode with the
 * project's Astro config compiles the file, and Astro's container API renders it to a string. Only the markup: no
 * CSS, no browser. Run from the project root (`pnpm test:units` does).
 *
 * It depends on two things Astro may change, so check it on every Astro upgrade: experimental_AstroContainer, and
 * calling getViteConfig(...) by hand (the function it returns, with a mode and command), as a Vite config would.
 */
import { realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getViteConfig } from "astro/config";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

/** Vite is Astro's own dependency, so it is resolved from Astro, through its package exports. */
const astroDir = realpathSync(fileURLToPath(new URL("../../node_modules/astro", import.meta.url)));
const { createServer } = await import(pathToFileURL(createRequire(`${astroDir}/package.json`).resolve("vite")).href);

/** A renderer: `render(url, { props, slots })` gives the HTML. Call `close()` when done. */
export async function renderer() {
	const config = await getViteConfig({ logLevel: "silent", server: { middlewareMode: true, hmr: false } }, { logLevel: "silent" })({ mode: "test", command: "serve" });
	const server = await createServer({ ...config, configFile: false });
	let container;
	try {
		container = await AstroContainer.create();
	} catch (error) {
		await server.close();
		throw error;
	}
	return {
		async render(url, options = {}) {
			const mod = await server.ssrLoadModule(fileURLToPath(url));
			return container.renderToString(mod.default, options);
		},
		close: () => server.close(),
	};
}
