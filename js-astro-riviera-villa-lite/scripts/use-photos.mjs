#!/usr/bin/env node
/**
 * Switches the photos the site uses (src/assets/photos/).
 *
 *   node scripts/use-photos.mjs placeholders   sober placeholders (what the theme ships with)
 *   node scripts/use-photos.mjs demo           royalty-free demo photos from demo/photos/ (demo site only)
 *
 * Your own photos: copy them into src/assets/photos/ with the file names used in villa.config.ts.
 * Running this script replaces every file of src/assets/photos/.
 */
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const target = fileURLToPath(new URL('src/assets/photos/', root));
const sources = {
  placeholders: fileURLToPath(new URL('src/assets/placeholders/', root)),
  demo: fileURLToPath(new URL('demo/photos/', root)),
};

const mode = process.argv[2];
if (mode !== 'placeholders' && mode !== 'demo') {
  console.error('Usage: node scripts/use-photos.mjs <placeholders|demo>');
  process.exit(1);
}

const source = sources[mode];
if (!existsSync(source)) {
  console.error(`${source} does not exist.${mode === 'demo' ? ' Demo photos are not part of the theme package.' : ''}`);
  process.exit(1);
}

const isImage = (f) => /\.(jpe?g|png|webp|avif)$/i.test(f);

await mkdir(target, { recursive: true });
for (const file of await readdir(target)) {
  if (isImage(file) || file === 'credits.json') await rm(`${target}${file}`);
}

let count = 0;
for (const file of await readdir(source)) {
  if (isImage(file)) {
    await copyFile(`${source}${file}`, `${target}${file}`);
    count++;
  }
}

if (mode === 'demo' && existsSync(`${source}credits.json`)) {
  await copyFile(`${source}credits.json`, `${target}credits.json`);
} else {
  await writeFile(`${target}credits.json`, '[]\n');
}

console.log(`${count} ${mode} photos copied to src/assets/photos/`);
