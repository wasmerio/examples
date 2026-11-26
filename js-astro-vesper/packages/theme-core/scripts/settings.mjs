/**
 * Real builds per setting, for a product's settings test (its case names as arguments; default: every case).
 *
 * Each case builds the Markdown source statically into `dist-settings-<case>`, serves it on CONTENT_TEST_PORT (else
 * 4399) and runs its check on the pages. A case sets its setting in one or more of three ways:
 *
 * - `env`: a test-only override the product reads, such as DISPATCH_LOOK.
 * - `edit`: `{ file, from, to }`, for a setting with no override (a plain look file): the file is changed for the
 *   build, `from` (a string that must be there) to `to`.
 * - `modeSwitch`: `true` or `false`, the light and dark switch: the look file's `export const modeSwitch: boolean = …;`
 *   (`modeFile`, else the one of src/theme.look.ts and src/theme.skin.ts that holds it) is set to that value for the
 *   build, whatever it says now, so a buyer's own choice never decides the case. `null` takes that line out for the
 *   build (a look file from before the setting), whatever its value.
 *
 * A changed file has a backup beside it while it is changed, and is put back on success, failure, Ctrl-C and SIGTERM.
 * A run refuses to start while a backup is there (a run stopped hard: put it back by hand).
 *
 * `check(get)` gets `get(path)` ({ status, html }) and returns its problems.
 */
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHarness, modeProblems, portInUse } from "./harness.mjs";

/** The look file's switch line. */
const MODE_LINE = /export const modeSwitch: boolean = (true|false);/;
/** The switch line with its line break, for taking it out. */
const MODE_LINE_WHOLE = /^[ \t]*export const modeSwitch: boolean = (true|false);\r?\n?/m;
/** Where a product keeps its look, when a case does not name the file. */
const LOOK_FILES = ["src/theme.look.ts", "src/theme.skin.ts"];

/**
 * The light and dark switch's cases: one build with it on (`on`), one with it off (`off`). Each sets the look file's
 * modeSwitch itself (true, then false), whatever the file says now; `file` names the look file when it is not one of
 * LOOK_FILES. An `edit` in `off` that only turns modeSwitch off is left out: the case sets it.
 */
export function modeSwitchCases({ on, off, paths, file, label = "Dark mode", count = 1, inMenu = 0 }) {
	const checkAll = (options) => async (get) => {
		const problems = [];
		for (const path of paths) {
			const { status, html } = await get(path);
			if (status !== 200) problems.push(`${path} answers ${status}`);
			problems.push(...modeProblems(path, html, options));
			if (!options.count && html.includes("aui-theme")) problems.push(`${path}: the page still names the saved choice (aui-theme): a mode script is left`);
		}
		return problems;
	};
	const { edit, ...offRest } = off;
	const offCase = edit && MODE_LINE.test(edit.from) ? offRest : off;
	return {
		"mode-switch": { ...on, modeSwitch: true, modeFile: file, check: checkAll({ label, count, inMenu }) },
		"no-mode-switch": { ...offCase, modeSwitch: false, modeFile: file, check: checkAll({ label, count: 0 }) },
	};
}

/** The look file (relative to root) a modeSwitch case changes. Throws when there is none, or more than one. */
function modeFileOf(root, given) {
	const found = (given ? [given] : LOOK_FILES).filter((f) => existsSync(join(root, f)) && MODE_LINE.test(readFileSync(join(root, f), "utf8")));
	if (found.length !== 1) throw new Error(found.length ? `modeSwitch is in ${found.join(" and ")}: name the file` : `no look file holds "export const modeSwitch: boolean = …;" (${given ?? LOOK_FILES.join(", ")})`);
	return found[0];
}

/** The file changes a case makes: [{ file (relative to root), change(text) }]. */
export function editsOf(root, { edit, modeSwitch, modeFile }) {
	const out = [];
	if (edit)
		out.push({
			file: edit.file,
			change: (text) => {
				if (!text.includes(edit.from)) throw new Error(`${edit.file} does not hold ${JSON.stringify(edit.from)}`);
				return text.replace(edit.from, edit.to);
			},
		});
	if (typeof modeSwitch === "boolean") out.push({ file: modeFileOf(root, modeFile), change: (text) => text.replace(MODE_LINE, `export const modeSwitch: boolean = ${modeSwitch};`) });
	if (modeSwitch === null) {
		const file = modeFileOf(root, modeFile);
		out.push({
			file,
			change: (text) => {
				const next = text.replace(MODE_LINE_WHOLE, "");
				if (next === text) throw new Error(`${file}: no modeSwitch line on a line of its own to take out`);
				return next;
			},
		});
	}
	return out;
}

export async function runSettings({ root, cases }) {
	const port = Number(process.env.CONTENT_TEST_PORT ?? 4399);
	const backupOf = (file) => `${file}.test-settings-backup`;
	/** The files changed now. */
	const changed = new Set();
	const restore = () => {
		for (const file of changed) {
			copyFileSync(backupOf(file), file);
			rmSync(backupOf(file), { force: true });
		}
		changed.clear();
	};
	// Before the harness's own handler, which ends the process. Until the harness is up there is no such handler, and a
	// listener of ours stops Node's own exit on the signal: then this one ends the process.
	let harnessUp = false;
	for (const sig of ["SIGINT", "SIGTERM"])
		process.on(sig, () => {
			restore();
			if (!harnessUp) process.exit(sig === "SIGTERM" ? 143 : 130);
		});
	process.on("exit", restore);

	const asked = process.argv.slice(2);
	const unknown = asked.filter((name) => !(name in cases));
	if (unknown.length) {
		console.error(`Unknown case(s): ${unknown.join(", ")}. Cases: ${Object.keys(cases).join(", ")}`);
		process.exit(1);
	}

	const files = new Set();
	for (const c of Object.values(cases)) {
		try {
			for (const { file } of editsOf(root, c)) files.add(file);
		} catch {
			// The case reports it when it runs.
		}
	}
	for (const file of files) {
		if (!existsSync(backupOf(join(root, file)))) continue;
		console.error(`FAIL: ${backupOf(join(root, file))} is there (a run was stopped hard). Check it, move it back over ${file}, then run again.`);
		process.exit(1);
	}

	if (await portInUse(port)) {
		console.error(`FAIL: port ${port} is in use. Stop that server or set CONTENT_TEST_PORT.`);
		process.exit(1);
	}

	const h = createHarness({ root, port });
	harnessUp = true;
	const get = async (path) => {
		const res = await fetch(h.base + path, { redirect: "manual" });
		return { status: res.status, html: await res.text() };
	};
	const failures = [];
	try {
		for (const name of asked.length ? asked : Object.keys(cases)) {
			const { env = {}, check } = cases[name];
			console.log(`\n--- ${name}`);
			const dir = h.tempDir(`dist-settings-${name}`);
			let problems = [];
			try {
				for (const { file: rel, change } of editsOf(root, cases[name])) {
					const file = join(root, rel);
					const text = change(readFileSync(file, "utf8"));
					if (!changed.has(file)) {
						copyFileSync(file, backupOf(file));
						changed.add(file);
					}
					writeFileSync(file, text);
				}
				const code = await h.build(dir, { source: "markdown", env });
				restore();
				if (code !== 0) throw new Error(`the build failed (exit ${code})`);
				const server = await h.serve(dir);
				try {
					problems = await check(get);
				} finally {
					server.stop();
				}
			} catch (err) {
				problems = [err.message];
			} finally {
				restore();
				rmSync(dir, { recursive: true, force: true });
			}
			if (problems.length) failures.push(name);
			console.log(problems.length ? `FAIL  ${name}\n      ${problems.join("\n      ")}` : `ok    ${name}`);
		}
	} finally {
		restore();
		h.cleanup();
	}
	if (failures.length) {
		console.log(`\nFAIL  ${failures.length} case(s): ${failures.join("; ")}`);
		process.exitCode = 1;
	} else {
		console.log("\nOK");
	}
}
