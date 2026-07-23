#!/usr/bin/env node
// Fetches the pinned upstream HedgeDoc release into ./app/, applies the small
// EdgeJS patches from ./patches/, and copies the files in ./overlay/ on top.
// The app/ directory is gitignored — upstream sources are not committed to
// this repository. Run this once before installing/building.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// HedgeDoc 1.11.0 official release tarball (ships the prebuilt frontend)
const UPSTREAM_TARBALL =
  'https://github.com/hedgedoc/hedgedoc/releases/download/1.11.0/hedgedoc-1.11.0.tar.gz';

const root = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(root, 'app');

if (fs.existsSync(appDir)) {
  console.error('app/ already exists — delete it first to re-run setup.');
  process.exit(1);
}

console.log(`Downloading ${UPSTREAM_TARBALL} ...`);
const response = await fetch(UPSTREAM_TARBALL);
if (!response.ok) {
  throw new Error(`download failed: HTTP ${response.status}`);
}
const tarball = path.join(os.tmpdir(), `setup-${path.basename(root)}.tar.gz`);
fs.writeFileSync(tarball, Buffer.from(await response.arrayBuffer()));

console.log('Extracting to app/ ...');
// Extract next to app/ (not in os.tmpdir()) so the final rename never
// crosses filesystems.
const extractDir = fs.mkdtempSync(path.join(root, '.setup-extract-'));
try {
  execFileSync('tar', ['-xzf', tarball, '-C', extractDir]);
  const [tarRoot] = fs.readdirSync(extractDir);
  fs.renameSync(path.join(extractDir, tarRoot), appDir);
} finally {
  fs.rmSync(extractDir, { recursive: true, force: true });
  fs.rmSync(tarball, { force: true });
}

for (const patch of fs.readdirSync(path.join(root, 'patches')).sort()) {
  console.log(`Applying patches/${patch} ...`);
  execFileSync('git', ['apply', '--directory', 'app', path.join('patches', patch)], {
    cwd: root,
    stdio: 'inherit',
  });
}

console.log('Copying overlay/ into app/ ...');
fs.cpSync(path.join(root, 'overlay'), appDir, { recursive: true });

console.log(`
Done. Next steps:
  cd app
  CI=true pnpm install --prod   # real-file node_modules, shipped in the package
  cd ..
  wasmer run . --net --env CMD_PORT=3000 --env CMD_DB_URL=postgres://... \
    --env CMD_SESSION_SECRET=... --env CMD_ALLOW_ANONYMOUS=true
`);
