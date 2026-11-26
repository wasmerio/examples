/**
 * The adapter runner (a theme's `pnpm test:adapter`).
 *
 * Tests the selected content source: CONTENT_SOURCE if set, otherwise the one
 * astro.config.mjs selects. Builds it with the conformance route into a temp
 * out dir, serves it, prints /_conformance.json problems and the theme's page
 * assertion problems, exits 1 on any. Never modifies source files.
 *
 * `config`: `root` (the project root), `assertPages(kind, harness)` (returns
 * problems), and optionally `port` and `paritySkip` (see createHarness).
 */
import { createHarness, printAssertions, printConformance } from "./harness.mjs";

export async function runAdapter(config) {
	const h = createHarness(config);
	const source = process.env.CONTENT_SOURCE;
	const outDir = h.tempDir("dist-test-adapter");
	let failed = true;

	try {
		console.log(`=== ${source ?? "selected source (astro.config.mjs)"} ===`);
		if ((await h.build(outDir, { source })) !== 0) throw new Error("Build failed.");
		const server = await h.serve(outDir);
		try {
			const result = await h.conformance();
			printConformance(result);
			const pageProblems = await config.assertPages(server.kind, h);
			printAssertions(pageProblems);
			failed = result.problems.length > 0 || pageProblems.length > 0;
		} finally {
			server.stop();
		}
	} catch (err) {
		console.error(err.message);
	} finally {
		h.cleanup();
	}
	process.exit(failed ? 1 : 0);
}
