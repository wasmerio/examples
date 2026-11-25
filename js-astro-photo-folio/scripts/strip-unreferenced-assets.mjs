// Post-build hardening: delete image files in dist/ that aren't referenced by
// any built HTML/CSS/JS. While transforming images, Astro also copies the
// source originals into the output; this removes those orphans so the deployed
// site only ever serves the web-resolution WebP renditions it actually uses
// (no full-resolution originals reachable, even by guessing URLs).
import { readdir, readFile, rm } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const IMAGE = /\.(jpe?g|png|webp|avif|gif|tiff?)$/i;
const TEXT = /\.(html|css|js|mjs|json|xml|txt|map)$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = await walk(DIST);

// Build a haystack of everything that could reference an asset by filename.
let haystack = '';
for (const file of files.filter((f) => TEXT.test(f))) {
  haystack += await readFile(file, 'utf8');
}

let removed = 0;
let bytes = 0;
for (const image of files.filter((f) => IMAGE.test(f))) {
  if (!haystack.includes(basename(image))) {
    const { size } = await import('node:fs').then((fs) => fs.promises.stat(image));
    await rm(image);
    removed += 1;
    bytes += size;
  }
}

console.log(
  `strip-unreferenced-assets: removed ${removed} orphaned image file(s) (${(bytes / 1024 / 1024).toFixed(1)} MB).`
);
