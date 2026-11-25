// Every generated js-astro-* folder must build on its own from the catalog Deploy button:
// under 10 MB, no paths outside the folder, one lockfile, LICENSE, and UPSTREAM.json with a commit and sha256.
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HANDWRITTEN, checkFolder } from './astro-batch.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folders = readdirSync(root).filter((name) => name.startsWith('js-astro-') && !HANDWRITTEN.has(name) && statSync(path.join(root, name)).isDirectory());
let failed = 0;
for (const name of folders) {
  const errors = checkFolder(path.join(root, name));
  if (!existsSync(path.join(root, name, 'preview.jpg'))) errors.push('missing preview.jpg');
  if (errors.length) {
    failed += 1;
    console.error(`${name}: ${errors.join('; ')}`);
  } else {
    console.log(`${name} ok`);
  }
}
if (!folders.length) console.log('no generated astro folders');
if (failed) process.exit(1);
