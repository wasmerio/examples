import { defineConfig } from 'astro/config';
import wisp from 'astro-wisp';

export default defineConfig({
  // 正式域名：RSS、Sitemap、canonical 与图表下载链接都需要它
  site: 'https://example.com',
  integrations: [
    wisp({
      site: {
        title: '我的博客',
        description: '记录值得分享的技术思考',
        author: '你的名字',
        lang: 'zh-CN',
      },
      nav: [
        { label: '归档', href: '/archive/' },
        { label: '标签', href: '/tags/' },
        { label: '关于', href: '/about/' },
      ],
      social: [{ kind: 'rss', href: '/rss.xml' }],

      // 以下都是可选项，删掉即使用默认值。完整说明见主题文档“配置参考”。
      // 追加样式（不分层、最后加载，总能覆盖主题）：
      customCss: ['./src/styles/custom.css'],
      // 覆盖组件：components: { Footer: './src/components/Footer.astro' },
      // 调色板：palette: './design/palette.json'（只写要改的键，与默认值深度合并）
      // 关掉主题的某个路由后自己实现：routes: { about: false },
    }),
  ],
});
