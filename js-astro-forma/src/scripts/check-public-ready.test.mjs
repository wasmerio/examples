import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const checkScript = fileURLToPath(new URL('../../scripts/check-public-ready.mjs', import.meta.url));
const temporaryRoots = [];

function runCheck(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forma-public-check-'));
  temporaryRoots.push(root);
  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return spawnSync(process.execPath, [checkScript], { cwd: root, encoding: 'utf8' });
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('public readiness scanner', () => {
  it('scans AGENTS.md and detects private Windows paths', () => {
    const privatePath = ['D:', String.fromCharCode(92), 'Private', String.fromCharCode(92), 'Client'].join('');
    const result = runCheck({ 'AGENTS.md': privatePath });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('private filesystem path');
  });

  it('accepts ffmpeg duration regex syntax as source code', () => {
    const result = runCheck({ 'src/compress-videos.mjs': String.raw`const pattern = /Duration:\s*/;` });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Public readiness check passed');
  });
});
