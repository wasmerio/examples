// Pre-generate var/installed_plugins.json at build time. Etherpad normally
// writes this file on first boot, but when it is missing the server runs a
// plugin migration that spawns `pnpm` — which is not available at runtime on
// EdgeJS. Generating it ahead of time (like a first native boot would) keeps
// the runtime from ever needing to spawn a package manager.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(path.join(root, 'src', 'package.json'), 'utf8'));

mkdirSync(path.join(root, 'var'), { recursive: true });
writeFileSync(
  path.join(root, 'var', 'installed_plugins.json'),
  `${JSON.stringify({ plugins: [{ name: 'ep_etherpad-lite', version }] })}\n`,
);
console.log(`build-installed-plugins: wrote var/installed_plugins.json (ep_etherpad-lite@${version})`);
