#!/usr/bin/env node
// Fetches the pinned upstream RSSMonster source into ./app/, applies the
// files in ./overlay/ on top (no upstream files are modified). The app/
// directory is gitignored — upstream sources are not committed to this
// repository. Run this once before installing/building.
//
// Mirroring upstream's production Dockerfile layout, app/ is the contents of
// the repo's server/ directory with the Vue client source at app/client/.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// RSSMonster @ bbca402 (2026-07-04, pinned by commit)
const UPSTREAM_TARBALL =
  'https://github.com/pietheinstrengholt/rssmonster/archive/bbca402f0b610dca9c076b5ca87140ace32fd663.tar.gz';

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
  const repoDir = path.join(extractDir, tarRoot);
  fs.renameSync(path.join(repoDir, 'server'), appDir);
  fs.renameSync(path.join(repoDir, 'client'), path.join(appDir, 'client'));
  for (const doc of ['README.md', 'LICENSE.md']) {
    fs.copyFileSync(path.join(repoDir, doc), path.join(appDir, doc));
  }
} finally {
  fs.rmSync(extractDir, { recursive: true, force: true });
  fs.rmSync(tarball, { force: true });
}

console.log('Copying overlay/ into app/ ...');
fs.cpSync(path.join(root, 'overlay'), appDir, { recursive: true });

console.log(`
Done. Next steps:
  cd app
  CI=true pnpm install --prod   # server dependencies (real files, shipped in the package)
  node build-client.mjs         # builds the Vue client (client/, npm ci) into dist/
  cd ..
  wasmer run . --net --env PORT=3000 --env DB_HOSTNAME=... --env DB_PORT=3306 \\
    --env DB_DATABASE=... --env DB_USERNAME=... --env DB_PASSWORD=...
`);
