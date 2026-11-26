/**
 * The parity runner (a theme's `pnpm test:parity [source ...]`, default:
 * markdown emdash mixed).
 *
 * Builds each source into its own out dir (dist-<source>), runs conformance,
 * checks expected page statuses and the theme's page assertions, then
 * compares every source against the first:
 *   - model snapshots (with `snapshot: true`): each collection's mapped data,
 *     normalized (/_snapshot.json, see `contentTests`);
 *   - pages: status, <title>, and <main> text (without the `paritySkip`
 *     parts: source-managed areas that differ by design).
 * Removes the out dirs at the end. Never modifies source files. EmDash needs
 * a seeded data.db.
 *
 * `config`: `root` (the project root), `pages` (path -> expected status),
 * `assertPages(kind, harness)` (returns problems), `snapshot` (compare the
 * model snapshots), and optionally `paritySkip` and `port` (see createHarness).
 */
import { createHarness, diffJson, printAssertions, printConformance } from "./harness.mjs";

export async function runParity(config) {
	const h = createHarness(config);
	const sources = process.argv.slice(2).length ? process.argv.slice(2) : ["markdown", "emdash", "mixed"];
	const PAGES = config.pages;
	const paths = Object.keys(PAGES);

	const results = {};
	const snapshots = {};
	let failed = false;

	try {
		for (const source of sources) {
			console.log(`\n=== ${source} ===`);
			const outDir = h.tempDir(`dist-${source}`);
			if ((await h.build(outDir, { source })) !== 0) {
				console.log(`BUILD FAILED: ${source}`);
				failed = true;
				continue;
			}
			const server = await h.serve(outDir);
			try {
				const result = await h.conformance();
				printConformance(result);
				if (result.problems.length) failed = true;
				const pageProblems = await config.assertPages(server.kind, h);
				printAssertions(pageProblems);
				if (pageProblems.length) failed = true;
				results[source] = await h.fetchPages(paths);
				if (config.snapshot) {
					snapshots[source] = await h.snapshot();
					if (snapshots[source].error) {
						console.log(`SNAPSHOT  ${snapshots[source].error}`);
						failed = true;
					}
				}
			} finally {
				server.stop();
			}

			for (const path of paths) {
				const got = results[source][path].status;
				if (got !== PAGES[path]) {
					console.log(`STATUS  ${path}: expected ${PAGES[path]}, got ${got}`);
					failed = true;
				}
			}
		}

		const [first, ...rest] = sources.filter((s) => results[s]);
		for (const other of rest) {
			console.log(`\n=== ${first} vs ${other} ===`);
			if (config.snapshot) {
				const { adapter: _a, ...want } = snapshots[first] ?? {};
				const { adapter: _b, ...got } = snapshots[other] ?? {};
				const diffs = diffJson(want, got);
				const sizes = (o) => Object.values(o ?? {}).reduce((n, v) => n + Object.keys(v ?? {}).length, 0);
				console.log(
					`${diffs.length ? "DIFF" : "same"}  model snapshot (${Object.keys(want.collections ?? {}).length} lists, ${sizes(want.entries)} get(slug), ${Object.keys(want.queries ?? {}).length} queries)`,
				);
				for (const d of diffs) console.log(`  ${d}`);
				if (diffs.length) failed = true;
			}
			for (const path of paths) {
				const x = results[first][path];
				const y = results[other][path];
				const same = x.status === y.status && x.title === y.title && x.text === y.text;
				console.log(`${same ? "same" : "DIFF"}  ${path}  (${x.status} / ${y.status})`);
				if (same) continue;
				failed = true;
				if (x.title !== y.title) console.log(`  title: ${JSON.stringify(x.title)} vs ${JSON.stringify(y.title)}`);
				if (x.text !== y.text) {
					let i = 0;
					while (x.text[i] === y.text[i]) i++;
					const at = Math.max(0, i - 80);
					console.log(`  text differs at char ${i}:\n  ${first}: …${x.text.slice(at, i + 240)}\n  ${other}: …${y.text.slice(at, i + 240)}`);
				}
			}
		}
	} catch (err) {
		console.error(err.message);
		failed = true;
	} finally {
		h.cleanup();
	}
	console.log(failed ? "\nFAIL" : "\nOK");
	process.exit(failed ? 1 : 0);
}
