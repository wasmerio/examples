import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeFigure from './rehype-figure';
import { figureCaptionHtml, splitFigureCaption } from './figure-caption';

describe('splitFigureCaption', () => {
  it.each([
    ['图 05-1：注意力', '图 05-1：', '注意力'],
    ['图05-1：注意力', '图05-1：', '注意力'],
    ['图 3: 流程', '图 3:', ' 流程'],
    ['图 3 ：流程', '图 3：', '流程'],
    ['圖 2．資料流', '圖 2．', '資料流'],
    ['Figure 2. Data flow', 'Figure 2.', ' Data flow'],
    ['Figure 2.1. Data flow', 'Figure 2.1.', ' Data flow'],
    ['Fig. 2: Data flow', 'Fig. 2:', ' Data flow'],
    ['fig 10a: lower case', 'fig 10a:', ' lower case'],
    ['FIGURE 4: upper', 'FIGURE 4:', ' upper'],
    ['图 4 — 破折号', '图 4', ' — 破折号'],
    ['图 7', '图 7', ''],
  ])('%s', (caption, label, text) => {
    expect(splitFigureCaption(caption)).toEqual({ label, text });
  });

  it.each([
    '图 3 展示了数据流',
    'Figure 2.1 shows the flow',
    '图 1.5 倍的放大',
    '图表 1：不是图号',
    'Figures 2: plural',
    '自注意力的计算流程',
    'See figure 2: inline',
    '图：没有编号',
  ])('不拆：%s', (caption) => {
    expect(splitFigureCaption(caption)).toEqual({ text: caption });
  });

  it('输出转义后的 HTML', () => {
    expect(figureCaptionHtml('图 1：<b>')).toBe('<span class="wisp-fig-no">图 1：</span>&lt;b&gt;');
    expect(figureCaptionHtml('a & b')).toBe('a &amp; b');
  });
});

async function render(md: string) {
  const p = await createMarkdownProcessor({ rehypePlugins: [rehypeFigure] });
  return (await p.render(md, { fileURL: pathToFileURL(resolve('src/content/posts/a/index.md')) }))
    .code;
}

describe('rehypeFigure', () => {
  it('带标题的独立图片变成 figure + 题注，去掉 title', async () => {
    const html = await render("![注意力](https://cdn.test/a.png '图 05-3：注意力矩阵')");
    expect(html).toBe(
      '<figure class="wisp-figure wisp-image"><img src="https://cdn.test/a.png" alt="注意力"><figcaption><span class="wisp-fig-no">图 05-3：</span>注意力矩阵</figcaption></figure>',
    );
  });

  it('没有图号时是普通题注', async () => {
    const html = await render("![a](https://cdn.test/a.png '一张截图')");
    expect(html).toContain('<figcaption>一张截图</figcaption>');
    expect(html).not.toContain('wisp-fig-no');
  });

  it('不带标题、行内、链接里的图片保持原样', async () => {
    expect(await render('![a](https://cdn.test/a.png)')).toBe(
      '<p><img src="https://cdn.test/a.png" alt="a"></p>',
    );
    expect(await render("前文 ![a](https://cdn.test/a.png 't') 后文")).toContain(
      '<p>前文 <img src="https://cdn.test/a.png" alt="a" title="t"> 后文</p>',
    );
    expect(await render("[![a](https://cdn.test/a.png 't')](https://x.test)")).not.toContain(
      '<figure',
    );
  });

  it('本地图片仍交给 Astro 优化（rehype-images 在用户插件之后）', async () => {
    const html = await render("![本地](./shot.webp '图 1：截图')");
    expect(html).toMatch(/^<figure class="wisp-figure wisp-image"><img __ASTRO_IMAGE_="/);
    const json = JSON.parse(
      /__ASTRO_IMAGE_="([^"]+)"/.exec(html)![1]!.replace(/&#x22;|&quot;/g, '"'),
    );
    expect(json).toMatchObject({ src: './shot.webp', alt: '本地' });
    expect(json).not.toHaveProperty('title');
    expect(html).toContain('<figcaption><span class="wisp-fig-no">图 1：</span>截图</figcaption>');
  });
});
