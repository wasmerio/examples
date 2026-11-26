import { afterEach, describe, expect, it, vi } from 'vitest';
import type { APIContext } from 'astro';
import { render } from 'astro:content';
import { getPosts } from '../utils/posts';
import { absolutizeRssUrls, escapeXml, GET, rssFallbackContent } from './rss.xml';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
  render: vi.fn(),
}));

vi.mock('../utils/posts', () => ({
  getPosts: vi.fn(),
}));

vi.mock('virtual:wisp/config', () => ({
  default: {
    site: {
      title: 'Test & <Blog>',
      description: 'Desc',
      author: 'a',
      lang: 'zh&<CN>',
    },
    rss: { fullText: true },
    siteUrl: 'https://example.com/infra-note/',
  },
}));

describe('RSS subpath base 与转义', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('absolutizeRssUrls 在 subpath base 下不重复拼接前缀', () => {
    const html = [
      '<p><a href="/posts/a/">站内</a>',
      '<a href="/infra-note/posts/b/">已含前缀</a>',
      '<img src="/infra-note/_astro/fig.webp" alt="图">',
      '<a href="//cdn.example.com/x.js">协议相对</a>',
      '<a href="https://other.dev/x">外链</a></p>',
    ].join('');
    const out = absolutizeRssUrls(html, '/infra-note', 'https://example.com');
    expect(out).toContain('href="https://example.com/infra-note/posts/a/"');
    expect(out).toContain('href="https://example.com/infra-note/posts/b/"');
    expect(out).toContain('src="https://example.com/infra-note/_astro/fig.webp"');
    expect(out).not.toContain('/infra-note/infra-note/');
    expect(out).toContain('href="//cdn.example.com/x.js"');
    expect(out).toContain('href="https://other.dev/x"');
  });

  it('escapeXml 与 rssFallbackContent 正确转义特殊字符', () => {
    expect(escapeXml('A & B <tag> "q" \'s\'')).toBe(
      'A &amp; B &lt;tag&gt; &quot;q&quot; &#39;s&#39;',
    );
    const fb = rssFallbackContent(
      '比较 x < y & z',
      'https://example.com/infra-note/posts/a/?x=1&y=2',
      'zh-CN',
    );
    expect(fb).toContain('<p>比较 x &lt; y &amp; z</p>');
    expect(fb).toContain('href="https://example.com/infra-note/posts/a/?x=1&amp;y=2"');
  });

  it('GET 路由在 base=/infra-note 下生成正确链接、转义 customData lang 与降级摘要', async () => {
    vi.stubEnv('BASE_URL', '/infra-note');
    vi.mocked(getPosts).mockResolvedValue([
      {
        id: 'demo',
        data: {
          title: 'Demo',
          description: '摘要 <script> & "quote"',
          pubDate: new Date('2026-01-01T00:00:00Z'),
          tags: ['t1'],
          draft: false,
        },
      } as never,
    ]);
    vi.mocked(render).mockRejectedValue(new Error('island cannot render'));

    const res = await GET({ site: new URL('https://example.com/infra-note/') } as APIContext);
    const xml = await res.text();
    expect(xml).toContain('<language>zh&amp;&lt;CN&gt;</language>');
    expect(xml).toContain('<link>https://example.com/infra-note/posts/demo/</link>');
    expect(xml).not.toContain('/infra-note/infra-note/');
    expect(xml).toContain('摘要 &lt;script&gt; &amp; &quot;quote&quot;');
  });
});
