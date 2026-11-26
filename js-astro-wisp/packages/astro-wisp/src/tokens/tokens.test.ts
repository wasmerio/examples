import { describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { genAll } from '../../scripts/gen-tokens';
import { genTokens, genPele, genDiagram, quoteFontFamily } from './generate';
import { checkContrast, mixSrgb } from './contrast';
import { oklch } from 'culori';
import {
  mergePalette,
  palette,
  readPalette,
  readPaletteOverride,
  resolveColor,
  nearestToken,
  type Palette,
} from './palette';

describe('palette', () => {
  it('跳过 $ 注释键', () => {
    expect(JSON.stringify(palette)).not.toContain('"$comment"');
    expect(Object.keys(palette.color.hue)).toHaveLength(8);
  });
  it('resolveColor', () => {
    expect(resolveColor('fg', 'light')).toBe('#1d1d1f');
    expect(resolveColor('fg', 'dark')).toBe('#e6e6e3');
    expect(resolveColor('blue', 'light')).toBe('#2f5783');
    expect(resolveColor('blue-fill', 'dark')).toBe('#1a2634');
    expect(resolveColor('q', 'light')).toBe('#2f5783');
    expect(resolveColor('k', 'dark')).toBe('#f2c681');
    expect(() => resolveColor('nope')).toThrow();
  });
  it('nearestToken', () => {
    expect(nearestToken('#2f5783')).toMatchObject({ name: 'blue', deltaE: 0 });
    expect(nearestToken('#305884').name).toBe('blue');
    expect(nearestToken('#e8f1fb').name).toBe('blue-fill');
  });
  it('分类色是低彩度的「印刷油墨」，填充是近纸色的淡洗（DESIGN.md Colors）', () => {
    for (const [name, { stroke, fill }] of Object.entries(palette.color.hue)) {
      for (const mode of ['light', 'dark'] as const) {
        expect(oklch(stroke[mode])!.c, `${name} stroke ${mode}`).toBeLessThanOrEqual(0.12);
        expect(oklch(fill[mode])!.c, `${name} fill ${mode}`).toBeLessThanOrEqual(0.04);
      }
      expect(oklch(fill.light)!.l, `${name} fill light`).toBeGreaterThanOrEqual(0.94);
      expect(oklch(fill.dark)!.l, `${name} fill dark`).toBeLessThanOrEqual(0.3);
    }
    // activation 与界面强调色在 light 下是同一种墨
    expect(resolveColor('activation', 'light')).toBe(resolveColor('accent', 'light'));
  });
});

describe('生成', () => {
  it('确定性', () => {
    expect(genAll()).toEqual(genAll());
  });
  it('tokens.css 结构', () => {
    const css = genTokens();
    expect(css).toContain('自动生成，勿手改');
    expect(css).toContain('@layer theme {');
    expect(css).toContain('@media print {');
    expect(css).toContain('color-scheme: light dark;');
    expect(css).toContain('accent-color: var(--wisp-accent);');
    expect(css).toContain('--wisp-bg: light-dark(#fcfcfb, #111214);');
    expect(css).toContain(':root:has(> head > meta[name="color-scheme"][content="dark"])');
    expect(css).toContain(':root:has(> head > meta[name="color-scheme"][content="light"])');
    expect(css).toContain('--wisp-sem-q: var(--wisp-hue-blue);');
    expect(css).toContain('--wisp-sem-q-fill: var(--wisp-hue-blue-fill);');
    expect(css).toContain('"Noto Sans SC Variable"');
    expect(css).toContain('"Wisp CJK Fallback"');
    expect(css).toContain('"Microsoft YaHei", monospace');
    expect(css).not.toContain('$comment');
  });
  it('quoteFontFamily 转义与引号处理', () => {
    expect(quoteFontFamily('Inter Variable')).toBe('"Inter Variable"');
    expect(quoteFontFamily('sans-serif')).toBe('sans-serif');
    expect(quoteFontFamily('ui-monospace')).toBe('ui-monospace');
    expect(quoteFontFamily('-apple-system')).toBe('-apple-system');
    expect(quoteFontFamily('Excalifont')).toBe('Excalifont');
    expect(quoteFontFamily('Font "Quote" \\ Slash')).toBe('"Font \\"Quote\\" \\\\ Slash"');
    expect(quoteFontFamily('Bad;color:red')).toBe('"Bad;color:red"');
  });
  it('pele.css', () => {
    const css = genPele();
    expect(css).toContain('@layer utilities {');
    expect(css).toContain('--pele-radius: 4px;');
    expect(css).toContain('--pele-series-1: var(--wisp-hue-blue);');
    expect(css).toContain(
      '--pele-series-1-fill: light-dark(color-mix(in srgb, var(--wisp-hue-blue) 58%',
    );
    expect(css).toContain('--pele-series-8: var(--wisp-hue-slate);');
    const fallbackCss = genPele({ ...palette, radius: {} as Palette['radius'] });
    expect(fallbackCss).toContain('--pele-radius: 4px;');
  });
  it('diagram.css', () => {
    const css = genDiagram();
    expect(css).toContain('@layer utilities {');
    expect(css).toContain('.wisp-d {');
    expect(css).toContain('--wd-blue-fill: var(--wisp-hue-blue-fill);');
    expect(css).toContain('--wd-font-hand: var(--wisp-font-hand);');
  });
  it('skills 副本与源一致', () => {
    expect(
      readFileSync(new URL('../../skills/wisp-diagram/palette.json', import.meta.url), 'utf8'),
    ).toBe(readFileSync(new URL('../../design/palette.json', import.meta.url), 'utf8'));
  });
});

describe('覆盖调色板', () => {
  it('深度合并，只改指定键', () => {
    const p = mergePalette({ color: { base: { accent: { light: '#0a5c36', dark: '#5ad19a' } } } });
    expect(p.color.base.accent).toEqual({ light: '#0a5c36', dark: '#5ad19a' });
    expect(p.color.base.fg).toEqual(palette.color.base.fg);
    expect(Object.keys(p.color.hue)).toEqual(Object.keys(palette.color.hue));
    expect(genTokens(p)).toContain('--wisp-accent: light-dark(#0a5c36, #5ad19a);');
  });
  it('数组整体替换', () => {
    const p = mergePalette({ font: { sans: ['Inter'] } });
    expect(p.font.sans).toEqual(['Inter']);
    expect(p.font.mono).toEqual(palette.font.mono);
  });
  it('提交的生成文件与默认调色板一致（忘了跑 pnpm tokens 时失败）', () => {
    for (const [rel, content] of Object.entries(genAll())) {
      const actual = readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8').replace(
        /\r\n/g,
        '\n',
      );
      expect(actual, rel).toBe(content.replace(/\r\n/g, '\n'));
    }
  });
  it('校验格式错误的调色板与覆盖配置并给出清晰错误', () => {
    expect(() => mergePalette({ color: { base: { accent: '#0a5c36' as never } } })).toThrow(
      /\[astro-wisp\] palette/,
    );
    expect(() =>
      mergePalette({
        color: { hue: { custom: { stroke: { light: '#111111', dark: '#eeeeee' } } } },
      } as never),
    ).toThrow(/\[astro-wisp\] palette/);
    expect(() => mergePalette({ font: { sans: 'Inter' as never } })).toThrow(
      /\[astro-wisp\] palette/,
    );
    expect(() => mergePalette({ radius: { md: '4px' as never } })).toThrow(
      /\[astro-wisp\] palette/,
    );
    expect(() =>
      mergePalette({ color: { base: { accent: { light: 'not-a-color', dark: '#ffffff' } } } }),
    ).toThrow(/\[astro-wisp\] palette/);

    const dir = mkdtempSync(join(tmpdir(), 'wisp-pal-'));
    try {
      const badFull = join(dir, 'bad-full.json');
      writeFileSync(badFull, JSON.stringify({ version: 1, color: {} }));
      expect(() => readPalette(badFull)).toThrow(/\[astro-wisp\] palette/);

      const badOver = join(dir, 'bad-over.json');
      writeFileSync(badOver, JSON.stringify({ color: { hue: { blue: { stroke: '#000' } } } }));
      expect(() => readPaletteOverride(badOver)).toThrow(/\[astro-wisp\] palette/);

      const goodOver = join(dir, 'good-over.json');
      writeFileSync(
        goodOver,
        JSON.stringify({ color: { base: { accent: { light: '#0a5c36', dark: '#5ad19a' } } } }),
      );
      expect(mergePalette(readPaletteOverride(goodOver)).color.base.accent.light).toBe('#0a5c36');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('对比度', () => {
  it('全部 ≥ 4.5', () => {
    const rows = checkContrast();
    expect(rows.length).toBe(2 * (3 + 24));
    expect(rows.filter((r) => !r.pass)).toEqual([]);
  });
  it('mixSrgb 支持 #rgb、#rrggbbaa 与 oklch(...) 并夹紧通道', () => {
    expect(mixSrgb('#f00', '#00f', 50)).toBe('#800080');
    expect(mixSrgb('#ff000080', '#0000ff80', 50)).toBe('#800080');
    expect(mixSrgb('oklch(0.6 0.1 200)', '#ffffff', 50)).toMatch(/^#[0-9a-f]{6}$/);
    expect(mixSrgb('oklch(0.95 0.35 140)', '#ffffff', 100)).toMatch(/^#[0-9a-f]{6}$/);
  });
});
