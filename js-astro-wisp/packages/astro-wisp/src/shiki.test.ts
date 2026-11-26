import { describe, it, expect } from 'vitest';
import {
  createShikiHighlighter,
  type CreateShikiHighlighterOptions,
  type ShikiHighlighterHighlightOptions,
} from '@astrojs/markdown-remark/shiki';
import { wispShikiConfig, parseFoldMeta } from './shiki';
import { wispConfigSchema } from './config';

async function render(
  code: string,
  lang: string,
  lineNumbers = true,
  meta?: string,
  fold: object = {},
  codeWrap = false,
) {
  const c = wispShikiConfig(
    wispConfigSchema.parse({ features: { lineNumbers, codeFold: fold, codeWrap } }),
  );
  const h = await createShikiHighlighter({
    themes: c.themes as unknown as CreateShikiHighlighterOptions['themes'],
    langs: [lang] as unknown as CreateShikiHighlighterOptions['langs'],
  });
  const options: ShikiHighlighterHighlightOptions = {
    defaultColor: c.defaultColor,
    transformers: c.transformers,
    ...(meta !== undefined ? { meta } : {}),
  };
  return h.codeToHtml(code, lang, {
    ...options,
  });
}

describe('wispShikiConfig', () => {
  it('双主题且无 defaultColor', async () => {
    const html = await render('const a = 1', 'ts');
    expect(html).toContain('--shiki-light:');
    expect(html).toContain('--shiki-dark:');
    expect(html).not.toMatch(/style="color:#/);
  });
  it('语言标签与 data-language', async () => {
    const html = await render('const a = 1', 'ts');
    expect(html).toContain('data-language="ts"');
    expect(html).toContain('class="wisp-lang"');
  });
  it('lineNumbers 开关', async () => {
    expect(await render('a', 'ts', true)).toContain('wisp-ln');
    expect(await render('a', 'ts', false)).not.toContain('wisp-ln');
  });
  it('codeWrap 默认关闭；开启时容器带 wisp-code--wrap，且不写内联 white-space', async () => {
    const off = await render('a', 'ts');
    expect(off).toMatch(/class="wisp-code wisp-code--copy"/);
    expect(off).not.toContain('wisp-code--wrap');
    const on = await render('a', 'ts', true, undefined, {}, true);
    expect(on).toContain('class="wisp-code wisp-code--copy wisp-code--wrap"');
    expect(on).not.toContain('white-space');
  });
  it('行号不进入文本内容（由 CSS counter 生成）', async () => {
    const html = await render('a\nb', 'ts');
    expect((html.match(/class="line/g) ?? []).length).toBe(2);
  });
  it('[!code ++] 标记被剥除并加 class', async () => {
    const html = await render('a // [!code ++]\nb # [!code --]\nc', 'ts');
    expect(html).not.toContain('[!code');
    expect(html).toContain('line diff add');
    expect(html).toContain('line diff remove');
  });
  it('低对比度色值的 token 加 tok-low', async () => {
    const html = await render('// hi\nconst a = 1', 'ts');
    expect(html).toContain('tok-low');
    expect(html).toMatch(/class="tok-low"[^>]*>\/\/ hi|tok-low[^>]*>\/\/ hi/);
  });
  it('diff 语言按 +/- 着色', async () => {
    const html = await render('+x\n-y\n z', 'diff');
    expect(html).toContain('diff add');
    expect(html).toContain('diff remove');
  });

  describe('代码折叠标记', () => {
    const long = (n: number) =>
      Array.from({ length: n }, (_, i) => `const a${i} = ${i}`).join('\n');
    it('parseFoldMeta', () => {
      expect(parseFoldMeta(undefined)).toBeUndefined();
      expect(parseFoldMeta('title="x"')).toBeUndefined();
      expect(parseFoldMeta('fold')).toEqual({ fold: true });
      expect(parseFoldMeta('nofold')).toEqual({ fold: false });
      expect(parseFoldMeta('fold=8')).toEqual({ fold: true, lines: 8 });
    });
    it('所有块写入 data-lines', async () => {
      expect(await render(long(3), 'ts')).toContain('data-lines="3"');
    });
    it('超过 maxLines 自动折叠，data-fold = previewLines', async () => {
      const html = await render(long(30), 'ts');
      expect(html).toContain('data-lines="30"');
      expect(html).toContain('data-fold="12"');
    });
    it('未超过 maxLines 不折叠', async () => {
      expect(await render(long(24), 'ts')).not.toContain('data-fold');
    });
    it('nofold 阻止折叠', async () => {
      expect(await render(long(40), 'ts', true, 'nofold')).not.toContain('data-fold');
    });
    it('fold 强制折叠短块，fold=8 指定预览行数', async () => {
      expect(await render(long(15), 'ts', true, 'fold')).toContain('data-fold="12"');
      expect(await render(long(15), 'ts', true, 'fold=8')).toContain('data-fold="8"');
    });
    it('行数不超过预览行数时不折叠', async () => {
      expect(await render(long(5), 'ts', true, 'fold')).not.toContain('data-fold');
    });
    it('enabled=false 时一律不折叠', async () => {
      expect(await render(long(40), 'ts', true, 'fold', { enabled: false })).not.toContain(
        'data-fold',
      );
    });
  });
});
