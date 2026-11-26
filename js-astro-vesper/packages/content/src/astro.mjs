/**
 * Astro config side of the content source. `astro.config.mjs` calls
 * `contentSource(name)` once; that is the only switch.
 *
 * A source named `x` is the set of files in `src/content/sources/`:
 *   x.ts          the adapter (required)
 *   x.setup.mjs   its Astro setup: output, server adapter, integrations (optional)
 *   x.live.ts     its live-collection loaders for src/live.config.ts (optional)
 *
 * Setup files import their packages dynamically, so a site that does not
 * select a source does not need that source's packages installed.
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * @param {string} name  Source name, e.g. "markdown", "emdash", "my-cms".
 * @param {string | URL} root  The project root (pass `import.meta.url` from astro.config.mjs).
 */
export async function contentSource(name, root) {
	const dir = new URL("./src/content/sources/", root);
	const file = (suffix) => new URL(`${name}${suffix}`, dir);

	if (!existsSync(file(".ts"))) {
		throw new Error(`Content source "${name}": src/content/sources/${name}.ts does not exist.`);
	}
	const setup = existsSync(file(".setup.mjs")) ? await (await import(/* @vite-ignore */ file(".setup.mjs").href)).default() : {};
	const live = existsSync(file(".live.ts")) ? file(".live.ts") : new URL("./no-live.ts", import.meta.url);

	const output = setup.output ?? "static";
	return {
		name,
		output,
		/** Pass to `vite.define`. Lets runtime code know the output mode. */
		define: { "import.meta.env.CONTENT_OUTPUT": JSON.stringify(output) },
		adapter: setup.adapter,
		integrations: setup.integrations ?? [],
		alias: {
			"astronomic:content/source": fileURLToPath(file(".ts")),
			"astronomic:content/live": fileURLToPath(live),
		},
	};
}
