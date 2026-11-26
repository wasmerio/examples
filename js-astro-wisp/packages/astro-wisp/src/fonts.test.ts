import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FONT_VARS, fontsourceSubset, paletteUsesExcalifont, wispFonts } from './fonts';
import { genTokens } from './tokens/generate';
import { mergePalette, palette } from './tokens/palette';

describe('fonts（Astro Fonts API）', () => {
  it('注册 Inter / JetBrains Mono / Excalifont，变量与令牌一致', () => {
    const fams = wispFonts();
    expect(fams.map((f) => [f.name, f.cssVariable])).toEqual([
      ['Inter Variable', FONT_VARS.sans],
      ['JetBrains Mono Variable', FONT_VARS.mono],
      ['Excalifont', FONT_VARS.hand],
    ]);
    // 关闭回退优化：否则生成的 sans-serif 会挡住字体栈后面的中文字体
    for (const f of fams) expect(f.fallbacks).toEqual([]);
  });

  it('Excalifont 分片文件都随包分发', () => {
    const hand = wispFonts().find((f) => f.name === 'Excalifont')!;
    const variants = (hand as unknown as { options: { variants: Array<{ src: URL[] }> } }).options
      .variants;
    expect(variants).toHaveLength(7);
    for (const v of variants) expect(existsSync(fileURLToPath(v.src[0]!))).toBe(true);
  });

  it('从 Fontsource 文件名取子集（供 preload 过滤）', () => {
    expect(fontsourceSubset('/x/inter-latin-wght-normal.woff2')).toBe('latin');
    expect(fontsourceSubset('/x/inter-latin-ext-wght-italic.woff2')).toBe('latin-ext');
    expect(fontsourceSubset('/x/jetbrains-mono-cyrillic-ext-wght-normal.woff2')).toBe(
      'cyrillic-ext',
    );
    expect(fontsourceSubset('/x/noto-sans-sc-87-wght-normal.woff2')).toBe('87');
    expect(fontsourceSubset('/x/foo.woff2')).toBeUndefined();
  });

  it('令牌通过变量引用 Fonts API 字体，并保留原族名作回退；思源黑体仍按族名引用', () => {
    const css = genTokens();
    expect(css).toContain(
      '--wisp-font-sans: var(--font-wisp-sans, "Inter Variable"), "Noto Sans SC Variable"',
    );
    expect(css).toContain('--wisp-font-mono: var(--font-wisp-mono, "JetBrains Mono Variable")');
    expect(css).toContain('--wisp-font-hand: var(--font-wisp-hand, Excalifont)');
  });

  it('支持按调色板手写字体栈决定是否注册 Excalifont', () => {
    expect(paletteUsesExcalifont(palette)).toBe(true);
    const noHand = mergePalette({ font: { hand: ['Inter Variable', 'sans-serif'] } });
    expect(paletteUsesExcalifont(noHand)).toBe(false);
    expect(wispFonts({ includeExcalifont: false }).map((f) => f.name)).toEqual([
      'Inter Variable',
      'JetBrains Mono Variable',
    ]);
  });
});
