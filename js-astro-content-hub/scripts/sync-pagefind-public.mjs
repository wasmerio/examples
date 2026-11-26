// scripts/sync-pagefind-public.mjs
// Copy the Pagefind search index from dist/pagefind (build output) into
// public/pagefind so the dev server can serve it too.
//
// Why: `pagefind --site dist` writes the index to dist/pagefind, which is the
// production artifact deployed to GH Pages / Cloudflare Pages. But `astro dev`
// serves from `public/` + source, not from `dist/` — so without this copy,
// opening search in dev 404s on /<base>/pagefind/pagefind.js.
//
// `public/` is copied into `dist/` during `astro build`, so once this script
// has run, the generated index also flows into future builds (harmless
// duplication, same bytes). The index is rebuilt from the fresh dist on every
// `npm run build` (see package.json `search:index`), so it never goes stale.
//
// A fresh clone has no dist/, so `npm run dev` on first checkout will show
// search as unavailable until one `npm run build` has produced the index.
import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'dist', 'pagefind');
const dest = path.join(root, 'public', 'pagefind');

if (!existsSync(src)) {
  console.warn('[sync-pagefind-public] dist/pagefind not found — run `npm run build` first. Skipping.');
  process.exit(0);
}

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log(`[sync-pagefind-public] copied ${src} -> ${dest}`);
