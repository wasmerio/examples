import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkGenerated } from './hugo-batch.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folders = readdirSync(root).filter((name) => name.startsWith('go-hugo-') && existsSync(path.join(root, name, 'UPSTREAM.json')));
let failed = 0;
for (const name of folders) {
  const errors = checkGenerated(path.join(root, name));
  if (errors.length) {
    failed += 1;
    console.error(`${name}: ${errors.join('; ')}`);
  } else {
    console.log(`${name} ok`);
  }
}
if (!folders.length) console.log('no generated hugo folders');
if (failed) process.exit(1);
