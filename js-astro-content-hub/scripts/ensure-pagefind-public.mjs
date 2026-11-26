// scripts/ensure-pagefind-public.mjs
// Ensure public/pagefind exists before `astro dev` starts, so site search
// works in the dev server. The index is generated from the most recent build
// output (dist/), then synced into public/ (see sync-pagefind-public.mjs).
//
// Fresh-clone case: there is no dist/ yet, so this prints a notice and exits
// 0 — search will show as unavailable in dev until the first `npm run build`
// produces an index. Running `npm run build` once also regenerates the index
// from current content, so dev search stays current after content edits.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distPagefind = path.join(root, 'dist', 'pagefind');

if (existsSync(distPagefind)) {
  const r = spawnSync('npm', ['run', 'search:index'], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
} else {
  console.warn(
    '[ensure-pagefind-public] no dist/pagefind yet (fresh checkout?). ' +
      'Dev search will be unavailable until `npm run build` generates the index.',
  );
}
