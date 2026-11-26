import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanTree } from './verify-imports.mjs';
import { verifyBrowserMatrix } from './browser-matrix.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = process.env.PREVIEW_PORT || '44321';

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

scanTree(root);

verifyBrowserMatrix(run, root, port);

const isolated = mkdtempSync(join(tmpdir(), 'terminalnoir-astro-theme-'));
try {
  cpSync(root, isolated, {
    recursive: true,
    filter: source =>
      !source
        .split('/')
        .some(part => ['node_modules', 'dist', 'test-results', 'playwright-report', '.astro'].includes(part)),
  });
  run('npm', ['ci'], isolated);
  run('npm', ['run', 'check'], isolated);
  run('npm', ['run', 'build'], isolated, { SITE_BASE: '/' });
} finally {
  rmSync(isolated, { recursive: true, force: true });
}
