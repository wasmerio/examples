import { describe, expect, it } from 'vitest';
import { assertDurationPreserved, replaceWithRollback, validateMediaOutput } from './video-safety.mjs';

describe('video output safety', () => {
  it('rejects empty output without starting replacement', () => {
    expect(() => validateMediaOutput('output.mp4', () => 0, () => ({ status: 0 })))
      .toThrow('empty output');
  });

  it('rejects output that FFmpeg cannot fully decode', () => {
    expect(() => validateMediaOutput('output.mp4', () => 100, () => ({ status: 1, stderr: 'truncated media' })))
      .toThrow('truncated media');
  });

  it('rejects output that decodes but is materially shorter than its source', () => {
    expect(() => assertDurationPreserved(10, 8)).toThrow('incomplete');
    expect(() => assertDurationPreserved(10, 9.8)).not.toThrow();
  });

  it('restores the original when installing a valid output fails', () => {
    const files = new Map([['video.mp4', 'original'], ['video.tmp.mp4', 'replacement']]);
    const operations = {
      exists: (file) => files.has(file),
      rename: (from, to) => {
        if (from === 'video.tmp.mp4') throw new Error('install failed');
        files.set(to, files.get(from));
        files.delete(from);
      },
      remove: (file) => files.delete(file),
    };

    expect(() => replaceWithRollback('video.tmp.mp4', 'video.mp4', operations)).toThrow('install failed');
    expect(files.get('video.mp4')).toBe('original');
    expect(files.has('video.mp4.backup')).toBe(false);
  });
});
