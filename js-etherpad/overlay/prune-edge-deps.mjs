// Remove hoisted leftovers of the mssql/tedious driver chain after a
// production install. The mssql driver itself is stubbed via the overrides in
// pnpm-workspace.yaml (ueberdb2 loads database drivers lazily, and this
// deployment does not use MSSQL), but pnpm's peer-dependency resolution still
// hoists tedious and its Azure SDK subtree (~55 MB) into node_modules. Nothing
// requires these at runtime; dropping them keeps the deployed package small.

import { rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

// typescript is needed at build time (admin UI's tsc + openapi-typescript)
// but never loaded at runtime; it only appears in the production graph as an
// (unused) ueberdb2 dependency.
for (const dep of ['tedious', '@azure', '@js-joda', 'typescript']) {
  const target = path.join(root, 'node_modules', dep);
  if (existsSync(target)) {
    rmSync(target, { recursive: true });
    console.log(`prune-edge-deps: removed node_modules/${dep}`);
  }
}
