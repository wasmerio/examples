/**
 * The no-emdash runner (a theme's `pnpm test:no-emdash`).
 *
 * Proves a Markdown build does not need `emdash`, `@emdash-cms/*` or
 * `@astrojs/node` (ADR 0003, blocker 1):
 *   1. Static: astro.config.mjs and everything it imports at top level, plus
 *      the markdown source's setup file, import none of them.
 *   2. Build: CONTENT_SOURCE=markdown under a guard that fails on any
 *      resolution of them: a Node resolve hook (config, setup files,
 *      integrations) plus a Vite plugin that astro.config.mjs adds when
 *      CONTENT_FORBID is set (bundled code; Vite does not resolve via Node).
 *   3. Self-check: the same guard must FAIL every source that uses EmDash
 *      (emdash, mixed), so a passing Markdown build means something (each is
 *      skipped if its source file does not exist).
 * Never modifies source files.
 *
 * `config`: `root` (the project root), and optionally `port` (see createHarness).
 */
import { existsSync, readFileSync, rmSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isForbidden } from "./forbid.mjs";
import { createHarness } from "./harness.mjs";

/** The Node resolve hook, next to this file. */
const HOOK = fileURLToPath(new URL("./forbid-hook.mjs", import.meta.url));

/** Import specifiers in a module. Static-only skips `import()` (lazy imports are allowed in the config graph). */
function specifiers(code, { dynamic }) {
	const out = [];
	const statik = /^\s*(?:import|export)\s+(?:[^"';]*?\s+from\s+)?["']([^"']+)["']/gm;
	for (const m of code.matchAll(statik)) out.push(m[1]);
	if (dynamic) for (const m of code.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)) out.push(m[1]);
	return out;
}

/** Resolve a relative import to a file (tries TS/JS extensions and index files). */
function resolveLocal(from, spec) {
	const target = resolve(dirname(from), spec);
	const tries = [target, ...[".ts", ".mjs", ".js", ".mts"].map((e) => target + e), ...["index.ts", "index.mjs", "index.js"].map((i) => join(target, i))];
	return tries.find((f) => existsSync(f) && statSync(f).isFile());
}

export async function runNoEmdash(config) {
	const h = createHarness(config);
	const cwd = h.root;
	const rel = (file) => relative(cwd, file);
	let failed = false;

	/** Resolve a workspace package import (`@astronomic/*`) to a file, or undefined. */
	const require = createRequire(join(cwd, "package.json"));
	function resolvePackage(spec) {
		if (!spec.startsWith("@astronomic/")) return undefined;
		try {
			return require.resolve(spec);
		} catch {
			return undefined;
		}
	}

	/** Walk relative and `@astronomic/*` imports from `entry`; return forbidden specifiers found. */
	function scan(entry, { dynamic }) {
		const seen = new Set();
		const found = [];
		const walk = (file) => {
			if (seen.has(file)) return;
			seen.add(file);
			for (const spec of specifiers(readFileSync(file, "utf8"), { dynamic })) {
				if (isForbidden(spec)) found.push(`${rel(file)}: "${spec}"`);
				else {
					const next = spec.startsWith(".") ? resolveLocal(file, spec) : resolvePackage(spec);
					if (next) walk(next);
				}
			}
		};
		walk(entry);
		return { found, files: [...seen].map(rel) };
	}

	function staticCheck() {
		console.log("=== 1. static imports ===");
		const config = scan(join(cwd, "astro.config.mjs"), { dynamic: false });
		console.log(`config graph: ${config.files.join(", ")}`);
		const setupFile = join(cwd, "src/content/sources/markdown.setup.mjs");
		const setup = existsSync(setupFile) ? scan(setupFile, { dynamic: true }) : { found: [], files: [] };
		if (setup.files.length) console.log(`markdown setup: ${setup.files.join(", ")}`);
		const found = [...config.found, ...setup.found];
		for (const f of found) console.log(`FORBIDDEN  ${f}`);
		console.log(found.length ? "FAIL" : "OK");
		return found.length === 0;
	}

	/** Build `source` under the guard. Returns { ok, violations }. */
	async function guardedBuild(source) {
		const outDir = h.tempDir(`dist-no-emdash-${source}`);
		const log = `${outDir}.log`;
		rmSync(log, { force: true });
		const code = await h.build(outDir, {
			source,
			env: {
				CONTENT_CONFORMANCE: "",
				CONTENT_FORBID: "1",
				CONTENT_FORBID_LOG: log,
				NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --import ${HOOK}`.trim(),
			},
		});
		const violations = existsSync(log) ? [...new Set(readFileSync(log, "utf8").trim().split("\n"))] : [];
		rmSync(log, { force: true });
		return { ok: code === 0 && violations.length === 0, code, violations };
	}

	try {
		if (!staticCheck()) failed = true;

		console.log("\n=== 2. markdown build under the guard ===");
		if (!readFileSync(join(cwd, "astro.config.mjs"), "utf8").includes("forbidPlugin")) {
			console.log("FAIL: astro.config.mjs does not add forbidPlugin() when CONTENT_FORBID is set");
			failed = true;
		}
		const md = await guardedBuild("markdown");
		for (const v of md.violations) console.log(`FORBIDDEN  ${v}`);
		console.log(md.ok ? "OK" : `FAIL (exit ${md.code}, ${md.violations.length} violation(s))`);
		if (!md.ok) failed = true;

		for (const source of ["emdash", "mixed"]) {
			if (!existsSync(join(cwd, `src/content/sources/${source}.ts`))) {
				console.log(`\n(self-check skipped: no src/content/sources/${source}.ts)`);
				continue;
			}
			console.log(`\n=== 3. self-check: ${source} build under the guard must fail ===`);
			const ed = await guardedBuild(source);
			for (const v of ed.violations.slice(0, 5)) console.log(`caught  ${v}`);
			if (ed.violations.length) console.log(`OK (guard caught EmDash in ${source})`);
			else {
				console.log(`FAIL: the guard did not catch EmDash in ${source} (exit ${ed.code})`);
				failed = true;
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
