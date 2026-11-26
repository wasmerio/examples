import { describe, expect, it } from 'vitest';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeCitations from './rehype-citations';

async function render(md: string, lang?: string, fmLang?: string) {
  const p = await createMarkdownProcessor({ rehypePlugins: [[rehypeCitations, { lang }]] });
  const r = await p.render(md, fmLang ? { frontmatter: { lang: fmLang } } : undefined);
  return r.code;
}

const MD = '正文[^a]，另一处[^b][^a]。\n\n[^a]: 第一条。\n\n[^b]: 第二条。\n';

describe('rehypeCitations', () => {
  it('文内标记：sup.wisp-cite + 可读的 aria-label 与 interestfor / aria-describedby', async () => {
    const html = await render(MD);
    const firstCite = html.match(/<sup class="wisp-cite"><a [^>]+>/)?.[0] ?? '';
    expect(firstCite).toContain('data-footnote-ref');
    expect(firstCite).toContain('aria-label="参考 1"');
    expect(firstCite).toContain('interestfor="wisp-cite-pop-user-content-fn-a"');
    expect(firstCite).toContain('aria-describedby="wisp-cite-pop-user-content-fn-a"');
    expect(html).toMatch(
      /<div id="wisp-cite-pop-user-content-fn-a" popover="hint" role="tooltip" class="wisp-cite-pop">\s*<p>第一条。\s*<\/p>\s*<\/div>/,
    );
    expect((html.match(/<sup class="wisp-cite[" ]/g) ?? []).length).toBe(3);
  });
  it('只有真正紧挨着的引用才合并', async () => {
    const html = await render(MD);
    // [^b][^a] 紧挨着；[^a] 与 [^b] 之间隔着文字
    expect((html.match(/wisp-cite--joined/g) ?? []).length).toBe(1);
    expect((html.match(/wisp-cite--cont/g) ?? []).length).toBe(1);
    expect(html).toMatch(
      /<sup class="wisp-cite wisp-cite--joined"><a [^>]*>2<\/a><\/sup><sup class="wisp-cite wisp-cite--cont">/,
    );
  });
  it('可见的列表标题，按语言', async () => {
    const zh = await render(MD);
    expect(zh).toContain('class="footnotes wisp-notes"');
    expect(zh).toMatch(/<h2 class="wisp-notes-title" id="footnote-label">参考与注释<\/h2>/);
    expect(zh).not.toContain('sr-only');
    const en = await render(MD, 'en');
    expect(en).toContain('>References</h2>');
    expect(en).toContain('aria-label="Reference 1"');
  });
  it('frontmatter lang 优先于站点语言', async () => {
    expect(await render(MD, 'zh-CN', 'en')).toContain('>References</h2>');
  });
  it('回链是 Lucide 图标，不再是 ↩ 字符，并带区分序号的 aria-label', async () => {
    const html = await render(MD);
    expect(html).not.toContain('↩');
    expect(html).toMatch(/<a [^>]*class="wisp-backref"[^>]*><svg[^>]*class="wisp-icon"/);
    expect(html).toContain('aria-label="返回正文：参考 1"');
    expect(html).toContain('aria-label="返回正文：参考 2"');
  });
  it('同一条被引用多次：只保留单枚回链，不堆砌序号尾巴', async () => {
    const html = await render(MD);
    // MD 共两条脚注（[^a] 引用 2 次、[^b] 引用 1 次），总共只应输出 2 枚回链
    expect((html.match(/data-footnote-backref/g) ?? []).length).toBe(2);
    expect(html).not.toContain('wisp-backref-n');
    expect(html).not.toContain('第 2 处引用');
    const en = await render(MD, 'en');
    expect(en).toContain('aria-label="Back to text: reference 1"');
    expect(en).toContain('aria-label="Back to text: reference 2"');
  });
  it('没有脚注时不改动', async () => {
    const html = await render('普通段落。');
    expect(html).toBe('<p>普通段落。</p>');
  });
});
