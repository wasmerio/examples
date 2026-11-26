import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import wisp from 'astro-wisp';

// 演示站：直接使用工作区里的 packages/astro-wisp，与站点从 npm 安装主题的用法完全相同。
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    wisp({
      site: {
        title: 'Wisp',
        description: '专注长文阅读的技术博客',
        author: 'xingcanlee',
        lang: 'zh-CN',
      },
      nav: [
        { label: '归档', href: '/archive/' },
        { label: '标签', href: '/tags/' },
        { label: '关于', href: '/about/' },
      ],
      social: [
        { kind: 'github', href: 'https://github.com/xingcanlee/astro-wisp' },
        { kind: 'rss', href: '/rss.xml' },
      ],
      home: { featuredCount: 3, pageSize: 10 },
      features: {
        codeCopy: true,
        lineNumbers: true,
        math: true,
        mermaid: true,
        toc: true,
        diagramDownload: true,
        codeFold: { enabled: true, maxLines: 24, previewLines: 12 },
      },
      mermaid: { strict: false },
      rss: { fullText: true },
    }),
    // 交互讲解组件（React island）需要；不写讲解组件的站点不用装
    react(),
  ],
});
