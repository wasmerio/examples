// Assembles Next.js' standalone output into a self-contained deployable tree,
// the same way upstream's Dockerfile does: the standalone server plus the
// static assets, public files, and the GeoLite2 database (which Umami
// resolves relative to the working directory). wasmer.toml ships
// .next/standalone/ as the package filesystem.
// Run from the app/ directory after `pnpm build`: node build-standalone.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.dirname(fileURLToPath(import.meta.url));
const standalone = path.join(appDir, '.next', 'standalone');

if (!fs.existsSync(path.join(standalone, 'server.js'))) {
  throw new Error('missing .next/standalone/server.js - run `pnpm build` first');
}

const copies = [
  ['.next/static', '.next/standalone/.next/static'],
  ['public', '.next/standalone/public'],
  ['geo', '.next/standalone/geo'],
];

for (const [from, to] of copies) {
  const source = path.join(appDir, from);
  if (!fs.existsSync(source)) {
    if (from === 'geo') {
      console.warn('warning: geo/ not found (GeoIP download skipped?); visitor geolocation will fail for public IPs');
      continue;
    }
    throw new Error(`missing ${from} - run \`pnpm build\` first`);
  }
  fs.cpSync(source, path.join(appDir, to), { recursive: true });
  console.log(`copied ${from} -> ${to}`);
}

console.log('standalone deployment tree ready at .next/standalone');
