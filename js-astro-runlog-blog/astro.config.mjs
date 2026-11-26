// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import fs from 'node:fs';
import { load } from 'js-yaml';

// 默认从 config.yaml 读取站点上线域名 (Single Source of Truth)
let siteUrl = 'https://dxer.github.io';
let basePath = '/astro-runlog-blog';

try {
  if (fs.existsSync('./config.yaml')) {
    const raw = /** @type {any} */ (load(fs.readFileSync('./config.yaml', 'utf-8')));
    if (raw?.site?.url) {
      const u = new URL(raw.site.url);
      siteUrl = u.origin;
      basePath = (u.pathname && u.pathname !== '/') ? u.pathname.replace(/\/$/, '') : '/';
    }
  }
} catch {}

// 如果在 GitHub Actions 中自动构建并发布到 GitHub Pages，自适应二级子路径与 GitHub 域名
if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  siteUrl = `https://${owner}.github.io`;
  basePath = `/${repo}`;
}

export default defineConfig({
  site: siteUrl,
  base: basePath,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
  },
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
