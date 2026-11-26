/**
 * The packages a Markdown build must not need (ADR 0003, blocker 1), and the
 * two guards `pnpm test:no-emdash` uses: a Node resolve hook (forbid-hook.mjs)
 * and a Vite plugin (vite resolves bundled imports itself, not through Node).
 * Violations throw and are appended to CONTENT_FORBID_LOG, so an import that
 * something catches still fails the test.
 */
import { appendFileSync } from "node:fs";

const FORBIDDEN = [/^emdash(\/|$)/, /^@astrojs\/node(\/|$)/, /^@emdash-cms\//];
const FORBIDDEN_PATH = /\/node_modules\/(emdash|@astrojs\/node|@emdash-cms\/[^/]+)\//;

export const isForbidden = (specifier) => FORBIDDEN.some((re) => re.test(specifier));
export const isForbiddenPath = (path) => FORBIDDEN_PATH.test(path);

/** Record a violation and return the error to throw. */
export function violation(what, importer) {
	const line = `${what}${importer ? ` (imported by ${importer})` : ""}`;
	if (process.env.CONTENT_FORBID_LOG) appendFileSync(process.env.CONTENT_FORBID_LOG, `${line}\n`);
	return new Error(`[content-forbid] forbidden import: ${line}`);
}

/** Vite plugin: fail on any forbidden import in the bundled code. */
export function forbidPlugin() {
	return {
		name: "content-forbid",
		enforce: "pre",
		resolveId(source, importer) {
			if (isForbidden(source)) throw violation(source, importer);
			return null;
		},
		load(id) {
			if (isForbiddenPath(id)) throw violation(id);
			return null;
		},
	};
}
