// Builds the Pagefind search index over the built site in dist/.
//
// Only post, note and project detail pages are indexed (the glob below).
//
// Uses the Node API, not the `pagefind --site dist` CLI: with no published
// content the glob matches nothing and the CLI exits 1, while the API writes a
// valid empty bundle.
//
// `astro build` copies the previous `public/pagefind` into `dist/` and Pagefind
// never deletes old files, so `dist/pagefind` is removed first, or a stale
// index (possibly with drafts) would ship. `public/pagefind` is synced in place
// rather than re-created, or a running `astro dev` stops seeing it.
//
// Run: node scripts/build-search-index.ts (after `astro build`).
import { cpSync, readdirSync, rmSync, rmdirSync } from "node:fs";
import { join, relative } from "node:path";
import * as pagefind from "pagefind";

const DIST = "dist";
const OUTPUT = `${DIST}/pagefind`;
const PUBLIC_COPY = "public/pagefind";
const GLOB = "{blog/*/*,notes/*/*,projects/*}/index.html";

function abort(step: string, errors: string[]): never {
  console.error(`build-search-index: ${step} failed`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

rmSync(OUTPUT, { recursive: true, force: true });

const created = await pagefind.createIndex({});
if (!created.index) abort("createIndex", created.errors);
const index = created.index;

const added = await index.addDirectory({ path: DIST, glob: GLOB });
if (added.errors.length > 0) abort("addDirectory", added.errors);

const written = await index.writeFiles({ outputPath: OUTPUT });
if (written.errors.length > 0) abort("writeFiles", written.errors);

await pagefind.close();

/** Every file path under `dir`, relative to it. */
function filesUnder(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => relative(dir, join(entry.parentPath, entry.name)));
}

/** Copies `from` over `to` and removes what `from` no longer has. */
function syncInPlace(from: string, to: string): void {
  cpSync(from, to, { recursive: true, force: true });
  const wanted = new Set(filesUnder(from));
  for (const file of filesUnder(to)) {
    if (!wanted.has(file)) rmSync(join(to, file), { force: true });
  }
  // Deepest first, so a folder emptied above is removed too.
  const dirs = readdirSync(to, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => join(entry.parentPath, entry.name))
    .sort((a, b) => b.length - a.length);
  for (const dir of dirs) {
    if (readdirSync(dir).length === 0) rmdirSync(dir);
  }
}

syncInPlace(OUTPUT, PUBLIC_COPY);

console.log(
  `build-search-index: indexed ${added.page_count} page(s) into ${OUTPUT}`
);
