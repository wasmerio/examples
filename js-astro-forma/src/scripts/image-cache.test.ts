import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { canReuseImageDerivatives, fingerprintImage } from './image-cache';

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('image derivative cache', () => {
  it('invalidates derivatives when image contents change without changing size', async () => {
    const directory = mkdtempSync(path.join(tmpdir(), 'templar-image-cache-'));
    temporaryDirectories.push(directory);
    const sourcePath = path.join(directory, 'source.jpg');
    writeFileSync(sourcePath, 'first image');
    const previous = await fingerprintImage(sourcePath);

    writeFileSync(sourcePath, 'other image');
    const current = await fingerprintImage(sourcePath);

    expect(current.size).toBe(previous.size);
    expect(current.sha256).not.toBe(previous.sha256);
    expect(canReuseImageDerivatives(previous, current, true)).toBe(false);
  });

  it('reuses derivatives only when the fingerprint matches and all targets exist', async () => {
    const directory = mkdtempSync(path.join(tmpdir(), 'templar-image-cache-'));
    temporaryDirectories.push(directory);
    const sourcePath = path.join(directory, 'source.jpg');
    writeFileSync(sourcePath, 'same image');
    const fingerprint = await fingerprintImage(sourcePath);

    expect(canReuseImageDerivatives(fingerprint, fingerprint, true)).toBe(true);
    expect(canReuseImageDerivatives(fingerprint, fingerprint, false)).toBe(false);
  });
});
