import { describe, expect, it, vi } from 'vitest';
import { main, parseArgs, toPythonArgs } from './cli.ts';
import { join } from 'node:path';

const REPO_ROOT = process.cwd();
const MANIFEST_PATH = join(REPO_ROOT, 'diagrams.manifest.json');

describe('parseArgs', () => {
  it('区分位置参数、布尔开关和带值选项', () => {
    const f = parseArgs([
      'a.drawio',
      '--force',
      '--drawio',
      'browser',
      '--theme',
      'dark',
      'b.excalidraw',
      '-o',
      'x.png',
    ]);
    expect(f.positional).toEqual(['a.drawio', 'b.excalidraw']);
    expect(f.flags.get('--force')).toBe(true);
    expect(f.flags.get('--drawio')).toBe('browser');
    expect(f.flags.get('--theme')).toBe('dark');
    expect(f.flags.get('-o')).toBe('x.png');
  });
});

describe('toPythonArgs', () => {
  it('build / check / new 补上项目根与 manifest，lint 补上扫描根，其余原样转发', () => {
    expect(toPythonArgs(['build', '--force'])).toEqual([
      'build',
      '--force',
      '--root',
      REPO_ROOT,
      '--manifest',
      MANIFEST_PATH,
    ]);
    expect(toPythonArgs(['check'])).toEqual([
      'check',
      '--root',
      REPO_ROOT,
      '--manifest',
      MANIFEST_PATH,
    ]);
    expect(toPythonArgs(['new', 'a.json', '--build'])).toEqual([
      'new',
      'a.json',
      '--build',
      '--root',
      REPO_ROOT,
      '--manifest',
      MANIFEST_PATH,
    ]);
    expect(toPythonArgs(['lint', '--fix'])).toEqual(['lint', '--fix', '--root', REPO_ROOT]);
    expect(toPythonArgs(['export', 'a.svg', '--theme', 'dark'])).toEqual([
      'export',
      'a.svg',
      '--theme',
      'dark',
    ]);
    expect(toPythonArgs(['probe'])).toEqual(['probe']);
  });
});

describe('main', () => {
  it('help 返回 0，无命令返回 2，未知命令返回 2，非法主题返回 2（均不启动 Python）', () => {
    const out = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const err = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    try {
      expect(main(['help'])).toBe(0);
      expect(main([])).toBe(2);
      expect(main(['nope'])).toBe(2);
      expect(String(err.mock.calls.at(-1)?.[0])).toMatch(/未知命令/);
      expect(main(['export', '--theme', 'sepia', 'a.svg'])).toBe(2);
    } finally {
      out.mockRestore();
      err.mockRestore();
    }
  });
});
