#!/usr/bin/env node
/**
 * `pnpm seed:emdash [--reset]`
 *
 * Loads seed/seed.json (schema and demo content) and seed/seo.json (the demo's SEO fields) into ./data.db, with the
 * demo images (see scripts/lib/demo-db.mjs).
 *
 * --reset deletes data.db and uploads/demo first. Without it, the script stops if data.db exists.
 */
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { seedDemo } from "./lib/demo-db.mjs";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const db = join(cwd, "data.db");
const reset = process.argv.includes("--reset");

if (existsSync(db)) {
	if (!reset) {
		console.error("data.db exists. Run with --reset to replace it (this deletes its content).");
		process.exit(1);
	}
	for (const suffix of ["", "-wal", "-shm"]) rmSync(`${db}${suffix}`, { force: true });
	rmSync(join(cwd, "uploads/demo"), { recursive: true, force: true });
}

try {
	const { media, dates } = seedDemo(db);
	console.log(`\nDemo images: ${media}. Publish dates: ${dates}.`);
} catch (err) {
	console.error(err.message);
	process.exit(1);
}
