import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// 静态导入 MDX 的服务端渲染器（而不是 loadRenderers 的动态 import）：
// 主题作为依赖安装时，站点根目录看不到 @astrojs/mdx，运行时按包名解析会失败；静态导入由 Vite 打进产物。
import mdxServer from '@astrojs/mdx/server.js';
import { render } from 'astro:content';
import { getPosts } from '../utils/posts';
import { sitePath } from '../utils/paths';
import config from 'virtual:wisp/config';

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function absolutizeRssUrls(html: string, base: string, origin: string): string {
  return html.replace(
    /(\s(?:href|src)=(["']))(\/(?!\/)[^"']*)\2/g,
    (_, prefix: string, quote: string, path: string) =>
      `${prefix}${new URL(sitePath(base, path), origin).href}${quote}`,
  );
}

export function rssFallbackContent(
  description: string,
  absoluteLink: string,
  lang = 'zh-CN',
): string {
  const desc = escapeXml(description);
  const link = escapeXml(absoluteLink);
  return /^zh\b/i.test(lang)
    ? `<p>${desc}</p><p>本文包含交互内容，请<a href="${link}">阅读原文</a>。</p>`
    : `<p>${desc}</p><p>This post includes interactive content; <a href="${link}">read the original post</a>.</p>`;
}

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const site = context.site ?? new URL(config.siteUrl);
  const base = import.meta.env.BASE_URL;

  let container: AstroContainer | undefined;
  if (config.rss.fullText) {
    container = await AstroContainer.create({ renderers: [{ name: 'astro:jsx', ssr: mdxServer }] });
  }

  const items = await Promise.all(
    posts.map(async (post) => {
      const link = sitePath(base, `/posts/${post.id}/`);
      const absoluteLink = new URL(link, site.origin).href;
      let content: string | undefined;
      if (container) {
        try {
          const { Content } = await render(post);
          content = await container.renderToString(Content);
          // 正文中的站内相对链接改写为绝对地址（处理已带 subpath base 的 /infra-note/_astro/... 不重复前缀）
          content = absolutizeRssUrls(content, base, site.origin);
        } catch {
          // 含交互组件（React island 等）的文章无法在 RSS 中渲染：降级为摘要 + 原文链接
          content = rssFallbackContent(post.data.description, absoluteLink, config.site.lang);
        }
      }
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: absoluteLink,
        categories: [...(post.data.category ? [post.data.category] : []), ...post.data.tags],
        ...(content ? { content } : {}),
      };
    }),
  );

  return rss({
    title: config.site.title,
    description: config.site.description,
    site,
    items,
    trailingSlash: true,
    customData: `<language>${escapeXml(config.site.lang)}</language>`,
  });
}
