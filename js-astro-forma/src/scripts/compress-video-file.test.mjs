import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { compressVideoFile } from './compress-video-file.mjs';

const temporaryRoots = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function createFixture(extension, scenario = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'templar-video-operation-'));
  temporaryRoots.push(root);
  const file = path.join(root, `sample${extension}`);
  fs.writeFileSync(file, 'original video data');
  const target = extension === '.webm' ? file.replace(/\.webm$/i, '.mp4') : file;
  const calls = [];

  const files = {
    exists: (filePath) => fs.existsSync(filePath),
    size: (filePath) => fs.statSync(filePath).size,
    rename: (from, to) => {
      if (scenario.failInstall && from.endsWith('.tmp.mp4') && to === target) {
        throw new Error('install failed');
      }
      if (scenario.failRestore && from === `${target}.backup` && to === target) {
        throw new Error('restore failed');
      }
      fs.renameSync(from, to);
    },
    remove: (filePath) => {
      if (scenario.failSourceRemoval && filePath === file) throw new Error('source removal failed');
      fs.rmSync(filePath);
    },
  };

  const probe = (filePath) => ({
    height: 720,
    duration: filePath.endsWith('.tmp.mp4') && scenario.shortDuration ? 8 : 10,
  });

  const runFfmpeg = (args) => {
    calls.push(args);
    if (args[0] === '-v') {
      return scenario.decodeFailure
        ? { status: 1, stderr: 'decode failed' }
        : { status: 0 };
    }

    const temporary = args.at(-1);
    if (scenario.encodeFailure) {
      fs.writeFileSync(temporary, 'partial output');
      return { status: 1, stderr: 'encode failed' };
    }
    fs.writeFileSync(temporary, 'validated compressed media');
    return { status: 0 };
  };

  const compress = () => compressVideoFile({
    file,
    probe,
    runFfmpeg,
    files,
    now: (() => { let time = 100; return () => time++; })(),
  });

  return { root, file, target, calls, compress };
}

describe('single video compression operation', () => {
  it('validates and replaces an MP4 only after complete output validation', () => {
    const fixture = createFixture('.mp4');

    const result = fixture.compress();

    expect(result.converted).toBe(false);
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('validated compressed media');
    expect(fs.existsSync(`${fixture.file}.backup`)).toBe(false);
    expect(fs.existsSync(`${fixture.file}.tmp.mp4`)).toBe(false);
  });

  it('converts WebM to MP4 and removes the source after validated installation', () => {
    const fixture = createFixture('.webm');

    const result = fixture.compress();

    expect(result.converted).toBe(true);
    expect(fs.existsSync(fixture.file)).toBe(false);
    expect(fs.readFileSync(fixture.target, 'utf8')).toBe('validated compressed media');
  });

  it('retains the WebM source and validated MP4 when source removal fails', () => {
    const fixture = createFixture('.webm', { failSourceRemoval: true });

    expect(fixture.compress).toThrow('source removal failed');
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('original video data');
    expect(fs.readFileSync(fixture.target, 'utf8')).toBe('validated compressed media');
  });

  it('keeps the original and removes partial output when encoding fails', () => {
    const fixture = createFixture('.mp4', { encodeFailure: true });

    expect(fixture.compress).toThrow('encode failed');
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('original video data');
    expect(fs.existsSync(`${fixture.file}.tmp.mp4`)).toBe(false);
  });

  it('keeps the original and removes output that fails decoding', () => {
    const fixture = createFixture('.mp4', { decodeFailure: true });

    expect(fixture.compress).toThrow('decode failed');
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('original video data');
    expect(fs.existsSync(`${fixture.file}.tmp.mp4`)).toBe(false);
  });

  it('keeps the original when output duration is too short', () => {
    const fixture = createFixture('.mp4', { shortDuration: true });

    expect(fixture.compress).toThrow('incomplete');
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('original video data');
    expect(fs.existsSync(`${fixture.file}.tmp.mp4`)).toBe(false);
  });

  it('restores the original if the validated MP4 cannot be installed', () => {
    const fixture = createFixture('.mp4', { failInstall: true });

    expect(fixture.compress).toThrow('install failed');
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('original video data');
    expect(fs.existsSync(`${fixture.file}.backup`)).toBe(false);
    expect(fs.existsSync(`${fixture.file}.tmp.mp4`)).toBe(false);
  });

  it('preserves a recovery backup when installation and rollback both fail', () => {
    const fixture = createFixture('.mp4', { failInstall: true, failRestore: true });

    let caught;
    try {
      fixture.compress();
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(Error);
    expect(caught.message).toContain(`${fixture.file}.backup`);
    expect(caught.recoveryPath).toBe(`${fixture.file}.backup`);
    expect(caught.cause.message).toBe('install failed');
    expect(caught.rollbackCause.message).toBe('restore failed');
    expect(fs.existsSync(fixture.file)).toBe(false);
    expect(fs.readFileSync(caught.recoveryPath, 'utf8')).toBe('original video data');
    expect(fs.existsSync(`${fixture.file}.tmp.mp4`)).toBe(false);
  });

  it('refuses a WebM conversion when the MP4 destination already exists', () => {
    const fixture = createFixture('.webm');
    fs.writeFileSync(fixture.target, 'existing mp4');

    expect(fixture.compress).toThrow('Refusing to overwrite existing MP4 target');
    expect(fixture.calls).toHaveLength(0);
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('original video data');
    expect(fs.readFileSync(fixture.target, 'utf8')).toBe('existing mp4');
  });

  it('refuses a stale temporary file without deleting or replacing it', () => {
    const fixture = createFixture('.mp4');
    const temporary = `${fixture.file}.tmp.mp4`;
    fs.writeFileSync(temporary, 'unowned temporary file');

    expect(fixture.compress).toThrow('Refusing to overwrite existing temporary output');
    expect(fs.readFileSync(fixture.file, 'utf8')).toBe('original video data');
    expect(fs.readFileSync(temporary, 'utf8')).toBe('unowned temporary file');
  });
});
