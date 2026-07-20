// Builds the Vue client (client/) with its own npm lockfile and places the
// static output at dist/, where the Express server serves it from.
// Run from the app/ directory: node build-client.mjs

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(appDir, 'client');

execFileSync('npm', ['ci'], { cwd: clientDir, stdio: 'inherit' });
execFileSync('npm', ['run', 'build'], { cwd: clientDir, stdio: 'inherit' });

const dist = path.join(appDir, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(clientDir, 'dist'), dist, { recursive: true });
console.log(`build-client: client built -> ${dist}`);
