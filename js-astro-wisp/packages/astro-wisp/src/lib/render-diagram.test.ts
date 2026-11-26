import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { FIX, makeRepo } from './render-diagram.fixture';
import {
  downloadKeyFor,
  isDiagramUrl,
  outputPathFor,
  parseDiagramUrl,
  postId,
  prepareSvg,
  renderDiagram,
  sourceForDownloadKey,
} from './render-diagram';

let repo: ReturnType<typeof makeRepo>;
beforeAll(() => {
  repo = makeRepo();
});
afterAll(() => rmSync(repo.root, { recursive: true, force: true }));

const env = (over: object = {}) => ({
  dev: false,
  root: repo.root,
  siteUrl: 'https://blog.dev',
  ...over,
});
const ids = (html: string) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

describe('url helpers', () => {
  it('recognizes diagram urls', () => {
    expect(isDiagramUrl('./diagrams/a.excalidraw')).toBe(true);
    expect(isDiagramUrl('./diagrams/a.drawio#page=encoder')).toBe(true);
    expect(isDiagramUrl('./a.png')).toBe(false);
    expect(isDiagramUrl('https://x.com/a.drawio')).toBe(false);
  });
  it('parses #page', () => {
    expect(parseDiagramUrl('./a.drawio#page=encoder')).toEqual({
      path: './a.drawio',
      page: 'encoder',
    });
    expect(parseDiagramUrl('./a%20b.drawio#page=%E6%95%B0%E6%8D%AE%E6%B5%81')).toEqual({
      path: './a b.drawio',
      page: '数据流',
    });
    expect(parseDiagramUrl('./a.excalidraw').page).toBeUndefined();
  });
  it('outputPathFor 与 Python 版 build 的命名一致', () => {
    expect(outputPathFor('/x/d/a.drawio', 0)).toBe('/x/d/a.wisp.svg');
    expect(outputPathFor('/x/d/a.drawio', 1)).toBe('/x/d/a.page-2.wisp.svg');
    expect(outputPathFor('/x/d/a.drawio', 5)).toBe('/x/d/a.page-6.wisp.svg');
  });
  it('postId matches content.config semantics', () => {
    expect(postId('attention-explained/index.mdx')).toBe('attention-explained');
    expect(postId('a/b/index.md')).toBe('a/b');
    expect(postId('foo.md')).toBe('foo');
  });
  it('maps download keys both ways', () => {
    const r = '/r';
    expect(downloadKeyFor('/r/src/content/posts/demo/diagrams/a.drawio', r)).toBe('demo/a.drawio');
    expect(downloadKeyFor('/r/src/content/posts/a/b/diagrams/a.drawio', r)).toBe('a/b/a.drawio');
    expect(downloadKeyFor('/r/src/content/shared/diagrams/a.drawio', r)).toBe('shared/a.drawio');
    expect(downloadKeyFor('/r/src/content/posts/diagrams/a.drawio', r)).toBe('a.drawio');
    expect(downloadKeyFor('/r/tests/a.drawio', r)).toBeUndefined();
    expect(sourceForDownloadKey('demo/a.drawio', r)).toBe(
      '/r/src/content/posts/demo/diagrams/a.drawio',
    );
    expect(sourceForDownloadKey('shared/a.drawio', r)).toBe(
      '/r/src/content/shared/diagrams/a.drawio',
    );
    expect(sourceForDownloadKey('a.drawio', r)).toBe('/r/src/content/posts/diagrams/a.drawio');
    expect(sourceForDownloadKey('../etc/a.drawio', r)).toBeUndefined();
    expect(sourceForDownloadKey('demo/a.svg', r)).toBeUndefined();
  });
});

describe('prepareSvg', () => {
  const svg = readFileSync(join(FIX, 'hand-attention.wisp.svg'), 'utf8');
  it('strips root width/height and keeps viewBox', () => {
    const r = prepareSvg(svg, { suffix: '1', fallbackTitleId: 't' });
    const root = /<svg\b[^>]*>/.exec(r.svg)![0];
    expect(root).not.toMatch(/\s(width|height)=/);
    expect(root).toContain('viewBox="0 0 848 391"');
    expect(r.width).toBe(848);
  });
  it('suffixes ids and rewrites references', () => {
    const r = prepareSvg(svg, { suffix: '3', fallbackTitleId: 't' });
    expect(r.svg).toContain('aria-labelledby="hand-attention-title-3 hand-attention-desc-3"');
    expect(r.svg).toContain('url(#hand-attention-mask-edge-2-k-s-3)');
    for (const id of ids(r.svg)) expect(id).toMatch(/-3$/);
    // 引用目标都存在
    const all = new Set(ids(r.svg));
    for (const m of r.svg.matchAll(/url\(#([^)]+)\)/g)) expect(all.has(m[1]!)).toBe(true);
  });
  it('does not touch data-cell-id', () => {
    const c = readFileSync(join(FIX, 'clean-transformer.wisp.svg'), 'utf8');
    const r = prepareSvg(c, { suffix: '1', fallbackTitleId: 't' });
    expect(r.svg).toContain('data-cell-id="mha"');
  });
  it('writes alt into <title> (escaped)', () => {
    const r = prepareSvg(svg, { suffix: '1', alt: 'A <b> & C', fallbackTitleId: 't' });
    expect(r.svg).toContain('<title id="hand-attention-title-1">A &lt;b&gt; &amp; C</title>');
  });
  it('inserts <title> when missing', () => {
    const r = prepareSvg('<svg viewBox="0 0 10 10" width="10"><rect/></svg>', {
      suffix: '1',
      alt: 'x',
      fallbackTitleId: 'f-title-1',
    });
    expect(r.svg).toBe(
      '<svg viewBox="0 0 10 10" aria-labelledby="f-title-1" role="img"><title id="f-title-1">x</title><rect/></svg>',
    );
  });
  it('strips drawio-cli MathJax crispEdges style rule', () => {
    const legacy =
      '<svg viewBox="0 0 10 10"><defs><style xmlns="http://www.w3.org/1999/xhtml" type="text/css">.MathJax svg{shape-rendering:crispEdges}</style></defs><rect/></svg>';
    const r = prepareSvg(legacy, { suffix: '1', fallbackTitleId: 't' });
    expect(r.svg).not.toContain('crispEdges');
    expect(r.svg).not.toContain('<defs>');
  });
});

describe('renderDiagram', () => {
  it('renders figure with caption and download link', () => {
    const r = renderDiagram(
      {
        src: './diagrams/flow.excalidraw',
        from: repo.post,
        alt: '流程',
        caption: '图 1：<b>',
        seq: 1,
      },
      env(),
    );
    expect(r.ok).toBe(true);
    expect(r.style).toBe('hand');
    expect(r.html).toMatch(
      /^<figure class="wisp-figure wisp-diagram" data-style="hand" aria-labelledby="flow-caption-1" style="--wd-w:848px"><div class="wisp-diagram-body" tabindex="0" role="group" aria-label="流程"><svg /,
    );
    // 题注独占全宽，图号拆成 .wisp-fig-no；动作作为 figure 子元素排在末尾（桌面悬浮右上角，窄屏/触屏落底）
    expect(r.html).toMatch(
      /<figcaption id="flow-caption-1"><span class="wisp-fig-no">图 1：<\/span>&lt;b&gt;<\/figcaption><span class="wisp-fig-actions"><a class="wisp-diagram-dl"[^>]*>[\s\S]*?<\/a><\/span><\/figure>$/,
    );
    expect(r.html).toContain('href="/diagrams/demo/flow.excalidraw" download="flow.excalidraw"');
    expect(r.html).toContain('aria-label="下载源文件 flow.excalidraw（Excalidraw）"');
    expect(r.html).toMatch(
      /class="wisp-diagram-dl"[^>]*title="下载源文件 flow\.excalidraw"[^>]*><svg [^>]*class="wisp-icon"[^>]*aria-hidden="true"[\s\S]*?<\/svg>源文件<\/a>/,
    );
    expect(r.html).not.toContain('app.diagrams.net'); // Excalidraw 没有在线打开
    expect(r.html).toContain('>流程</title>');
  });
  it('caption / actions: four shapes', () => {
    const base = { src: './diagrams/flow.excalidraw', from: repo.post, seq: 1 };
    // 只有动作：动作单独一行，不包 figcaption，figure 不需要 aria-labelledby
    const actionsOnly = renderDiagram(base, env()).html;
    expect(actionsOnly).toMatch(
      /<\/div><span class="wisp-fig-actions"><a [\s\S]*<\/span><\/figure>$/,
    );
    expect(actionsOnly).not.toContain('<figcaption');
    expect(actionsOnly).not.toContain('aria-labelledby="flow-caption');
    // 只有题注：没有图号时是普通 muted 题注
    const captionOnly = renderDiagram(
      { ...base, caption: '自注意力', download: false },
      env(),
    ).html;
    expect(captionOnly).toMatch(/<\/div><figcaption>自注意力<\/figcaption><\/figure>$/);
    expect(captionOnly).not.toContain('wisp-fig-no');
    expect(captionOnly).toMatch(
      /^<figure class="wisp-figure wisp-diagram" data-style="hand" style="--wd-w:848px"><div/,
    );
    // 都没有
    const bare = renderDiagram({ ...base, download: false }, env()).html;
    expect(bare).toMatch(/<\/svg><\/div><\/figure>$/);
  });
  it('selects draw.io page by name, by 1-based index, defaults to first', () => {
    const first = renderDiagram({ src: './diagrams/model.drawio', from: repo.post, seq: 1 }, env());
    expect(first.html).toContain('data-page="encoder"');
    const byName = renderDiagram(
      { src: './diagrams/model.drawio#page=数据流', from: repo.post, seq: 2 },
      env(),
    );
    const byIndex = renderDiagram(
      { src: './diagrams/model.drawio#page=2', from: repo.post, seq: 2 },
      env(),
    );
    const byProp = renderDiagram(
      { src: './diagrams/model.drawio', page: 2, from: repo.post, seq: 2 },
      env(),
    );
    expect(byName.html).toContain('data-page="数据流"');
    expect(byName.html).toContain('clean-transformer-p2-title-2');
    expect(byIndex.html).toBe(byName.html);
    expect(byProp.html).toBe(byName.html);
  });
  it('adds open-in-draw.io link only with a real site url', () => {
    const r = renderDiagram({ src: './diagrams/model.drawio', from: repo.post, seq: 1 }, env());
    expect(r.html).toMatch(
      /class="wisp-diagram-open"[^>]*aria-label="在 draw\.io 中打开（新窗口）"[^>]*><svg [^>]*class="wisp-icon"[\s\S]*?<\/svg>draw\.io<\/a>/,
    );
    expect(r.html).toContain(
      `https://app.diagrams.net/#U${encodeURIComponent('https://blog.dev/diagrams/demo/model.drawio')}`,
    );
    const r2 = renderDiagram(
      { src: './diagrams/model.drawio', from: repo.post, seq: 1 },
      env({ siteUrl: 'https://example.com' }),
    );
    expect(r2.html).not.toContain('app.diagrams.net');
  });
  it('respects base, download=false and the global switch', () => {
    expect(
      renderDiagram(
        { src: './diagrams/flow.excalidraw', from: repo.post, seq: 1 },
        env({ base: '/blog/' }),
      ).html,
    ).toContain('href="/blog/diagrams/demo/flow.excalidraw"');
    expect(
      renderDiagram(
        { src: './diagrams/flow.excalidraw', from: repo.post, seq: 1, download: false },
        env(),
      ).html,
    ).not.toContain('wisp-diagram-dl');
    expect(
      renderDiagram(
        { src: './diagrams/flow.excalidraw', from: repo.post, seq: 1 },
        env({ downloads: false }),
      ).html,
    ).not.toContain('wisp-fig-actions');
  });
  it('shared diagrams download from /diagrams/shared/', () => {
    const r = renderDiagram(
      { src: '../../shared/diagrams/shared-flow.excalidraw', from: repo.post, seq: 1 },
      env(),
    );
    expect(r.html).toContain('href="/diagrams/shared/shared-flow.excalidraw"');
  });
  it('wide adds .wisp-wide', () => {
    expect(
      renderDiagram(
        { src: './diagrams/flow.excalidraw', from: repo.post, seq: 1, wide: true },
        env(),
      ).html,
    ).toMatch(/^<figure class="wisp-figure wisp-diagram wisp-wide"/);
  });
  it('switches UI labels to English for non-zh lang', () => {
    const r = renderDiagram(
      { src: './diagrams/model.drawio', from: repo.post, seq: 1 },
      env({ lang: 'en' }),
    );
    expect(r.html).toContain('aria-label="Diagram"');
    expect(r.html).toContain('aria-label="Download source model.drawio (draw.io)"');
    expect(r.html).toContain('title="Download source model.drawio"');
    expect(r.html).toContain('>Source</a>');
    expect(r.html).toContain('aria-label="Open in draw.io (new tab)"');
    expect(r.html).toContain('title="Open in draw.io"');

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const missing = renderDiagram(
      { src: './diagrams/none.excalidraw', from: repo.post, seq: 1 },
      env({ dev: true }),
      'en',
    );
    warn.mockRestore();
    expect(missing.html).toContain('<strong>Diagram not ready</strong>');
  });
  it('same diagram twice → disjoint ids', () => {
    const a = ids(
      renderDiagram({ src: './diagrams/flow.excalidraw', from: repo.post, seq: 1 }, env()).html,
    );
    const b = ids(
      renderDiagram({ src: './diagrams/flow.excalidraw', from: repo.post, seq: 2 }, env()).html,
    );
    expect(a.length).toBeGreaterThan(0);
    expect(a.filter((x) => b.includes(x))).toEqual([]);
  });
  it('unknown page: build throws, dev shows placeholder', () => {
    expect(() =>
      renderDiagram({ src: './diagrams/model.drawio#page=nope', from: repo.post, seq: 1 }, env()),
    ).toThrow(/找不到页面 "nope"/);
  });

  describe('missing / stale outputs', () => {
    it('missing source file', () => {
      expect(() =>
        renderDiagram({ src: './diagrams/none.excalidraw', from: repo.post, seq: 1 }, env()),
      ).toThrow(/源文件不存在/);
    });
    it('hash mismatch: build throws, dev placeholder', () => {
      const svgPath = join(repo.root, 'src/content/posts/demo/diagrams/flow.wisp.svg');
      const orig = readFileSync(svgPath, 'utf8');
      writeFileSync(svgPath, orig.replace('自注意力', '改过'));
      try {
        expect(() =>
          renderDiagram({ src: './diagrams/flow.excalidraw', from: repo.post, seq: 1 }, env()),
        ).toThrow(/哈希不一致[\s\S]*pnpm diagram build/);
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const r = renderDiagram(
          { src: './diagrams/flow.excalidraw', from: repo.post, seq: 1 },
          env({ dev: true }),
        );
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
        expect(r.ok).toBe(false);
        expect(r.html).toMatch(/^<div class="wisp-diagram-missing" role="note">/);
        expect(r.html).toContain('pnpm diagram build');
      } finally {
        writeFileSync(svgPath, orig);
      }
    });
    it('unbuilt (not in manifest)', () => {
      const p = join(repo.root, 'src/content/posts/demo/diagrams/new.excalidraw');
      writeFileSync(p, '{}');
      try {
        expect(() =>
          renderDiagram({ src: './diagrams/new.excalidraw', from: repo.post, seq: 1 }, env()),
        ).toThrow(/尚未构建/);
      } finally {
        rmSync(p);
      }
    });
  });
});
