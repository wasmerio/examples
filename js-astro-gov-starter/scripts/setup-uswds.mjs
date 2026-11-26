#!/usr/bin/env node
/**
 * Copies USWDS static assets (fonts, images, JS) from node_modules to public/.
 * Run automatically via `predev` and `prebuild` scripts.
 * Safe to run multiple times — will overwrite with the installed version.
 */

import { cpSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const uswdsDist = resolve(__dirname, '../node_modules/@uswds/uswds/dist');
const publicUswds = resolve(__dirname, '../public/uswds');

if (!existsSync(uswdsDist)) {
  console.error('ERROR: @uswds/uswds not found. Run `pnpm install` first.');
  process.exit(1);
}

const assets = [
  { src: `${uswdsDist}/fonts`, dest: `${publicUswds}/fonts` },
  { src: `${uswdsDist}/img`, dest: `${publicUswds}/img` },
  { src: `${uswdsDist}/js`, dest: `${publicUswds}/js` },
];

for (const { src, dest } of assets) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

console.log('USWDS assets copied to public/uswds/');
