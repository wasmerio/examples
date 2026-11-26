import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

const scriptPath = fileURLToPath(new URL('./compress-videos.mjs', import.meta.url));
const temporaryRoots = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('video compression command', () => {
  it('returns a failure code when a video cannot be processed', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'templar-video-compress-'));
    temporaryRoots.push(root);
    const videoDirectory = path.join(root, 'public', 'assets', 'videos');
    fs.mkdirSync(videoDirectory, { recursive: true });
    fs.writeFileSync(path.join(videoDirectory, 'broken.mp4'), 'not a video');

    const result = spawnSync(process.execPath, [scriptPath], { cwd: root, encoding: 'utf8' });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('failed files: 1');
    expect(result.stderr).toContain('Failed');
    expect(fs.existsSync(path.join(videoDirectory, 'broken.mp4.tmp.mp4'))).toBe(false);
  });
});
