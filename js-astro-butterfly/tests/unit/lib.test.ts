import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/config', () => ({ site: { timezone: 'Asia/Shanghai', url: 'https://example.com' }, dates: { gitSince: '' } }));

const { slugize, HexoSlugger } = await import('../../src/lib/slug');
const { fromHexoDate, formatDateTime } = await import('../../src/lib/date');
const { countWords, formatCount } = await import('../../src/lib/wordcount');
const { parseGitLog, readIgnoreRevs, getFileGitDate, resolveUpdated } = await import('../../src/lib/git-dates');

describe('hexo slug compatibility', () => {
  it('matches hexo-util slugize', () => {
    expect(slugize('Front End')).toBe('Front-End');
    expect(slugize('模块的导入与 K 均值聚类算法类的定义')).toBe('模块的导入与-K-均值聚类算法类的定义');
    expect(slugize('k-means 算法的实现步骤：')).toBe('k-means-算法的实现步骤：');
    expect(slugize('  a.b/c  ')).toBe('a-b-c');
  });

  it('slugs escaped HTML and de-duplicates like Hexo', () => {
    const s = new HexoSlugger();
    expect(s.slug('Java Number&Math 类')).toBe('Java-Number-amp-Math-类');
    expect(s.slug('基础')).toBe('基础');
    expect(s.slug('基础')).toBe('基础-1');
    expect(s.slug('基础')).toBe('基础-2');
  });
});

describe('dates', () => {
  it('reads YAML-parsed Hexo dates as Asia/Shanghai local time', () => {
    // js-yaml turns `2024-01-02 23:34:30` into 2024-01-02T23:34:30Z
    const d = fromHexoDate(new Date('2024-01-02T23:34:30Z'))!;
    expect(d.toISOString()).toBe('2024-01-02T15:34:30.000Z');
    expect(formatDateTime(d)).toBe('2024-01-02 23:34:30');
    expect(fromHexoDate('2024-01-02 23:34:30')!.toISOString()).toBe('2024-01-02T15:34:30.000Z');
    expect(fromHexoDate('')).toBeUndefined();
  });
});

describe('word count', () => {
  it('counts CJK characters and latin words', () => {
    expect(countWords('你好世界 hello world').words).toBe(6);
    expect(countWords('a'.repeat(5)).minutes).toBe(1);
    expect(formatCount(950)).toBe('950');
    expect(formatCount(3123)).toBe('3.1k');
  });
});

describe('git-dates', () => {
  const log = [
    'COMMIT:aaaa1111 2026-12-03T10:00:00+08:00',
    'src/content/posts/a.md',
    '',
    'COMMIT:bbbb2222 2026-12-05T10:00:00+08:00', // ignored bulk change
    'src/content/posts/a.md',
    'src/content/posts/b.md',
    '',
    'COMMIT:cccc3333 2026-12-01T10:00:00+08:00', // older, listed later (merge order)
    'src/content/posts/b.md',
    'COMMIT:dddd4444 2020-01-01T10:00:00+08:00', // before the cutoff
    'src/content/posts/c.md',
  ].join('\n');

  it('takes the newest trusted commit per file', () => {
    const map = parseGitLog(log, new Set(['bbbb']), new Date('2025-01-01'));
    expect(map.get('src/content/posts/a.md')?.toISOString()).toBe('2026-12-03T02:00:00.000Z');
    expect(map.get('src/content/posts/b.md')?.toISOString()).toBe('2026-12-01T02:00:00.000Z');
    expect(map.has('src/content/posts/c.md')).toBe(false);
  });

  it('reads an ignore-revs file, skipping comments and blank lines', () => {
    const dir = mkdtempSync(join(tmpdir(), 'revs-'));
    const file = join(dir, '.git-blame-ignore-revs');
    writeFileSync(file, '# bulk migration\n694E9592DD8B76C272E80D5783C821B9F2C916AA  # trailing comment\n\n');
    expect([...readIgnoreRevs(file)]).toEqual(['694e9592dd8b76c272e80d5783c821b9f2c916aa']);
    expect(readIgnoreRevs('no-such-file').size).toBe(0);
  });

  it('uses the later of front matter and git, falling back to date', () => {
    const date = new Date('2023-01-01');
    const fm = new Date('2024-08-18');
    expect(resolveUpdated(undefined, fm, date)).toEqual(fm);
    expect(resolveUpdated(undefined, undefined, date)).toEqual(date);
    expect(resolveUpdated('non-existent-file-path-xyz.md', undefined, date)).toEqual(date);
    expect(getFileGitDate('non-existent-file-path-xyz.md')).toBeUndefined();
  });
});
