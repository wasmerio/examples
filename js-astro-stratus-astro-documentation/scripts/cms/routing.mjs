/**
 * Write `_cloudcannon/routing.json` into the build output: editor redirects from
 * `src/data/redirects.json` ahead of `.cloudcannon/routing.json`, whose catch-all
 * 404 rule must stay last. Not an Astro route — Astro never emits `_`-prefixed pages.
 * Headers stay source-only so the CMS can never drop a security header.
 *
 *   node scripts/cms/routing.mjs [--out dist]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");

const args = process.argv.slice(2);
const outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : "dist";

const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));

const base = readJson(".cloudcannon/routing.json");
const { routes = [] } = readJson("src/data/redirects.json");

// A half-filled row would redirect readers to `undefined`.
const editorRoutes = routes
  .filter((route) => route?.from?.trim() && route?.to?.trim())
  .map((route) => ({
    from: route.from.trim(),
    to: route.to.trim(),
    status: Number(route.status) || 301,
  }));

const routing = { ...base, routes: [...editorRoutes, ...(base.routes ?? [])] };

const target = join(root, outDir, "_cloudcannon", "routing.json");

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(routing, null, 2)}\n`);

console.log(
  `ok     ${outDir}/_cloudcannon/routing.json written — ` +
    `${editorRoutes.length} editor redirect(s) ahead of ${base.routes?.length ?? 0} source rule(s).`
);
