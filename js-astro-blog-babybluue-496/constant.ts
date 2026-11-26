import type { PostModel } from './src/interfaces/post-model'

export const config = {
  site: 'https://astro-blog-theme.vercel.app',
  description:
    'Astro Blog Theme 是一个基于 Astro 的博客主题，支持 PWA、搜索、深色模式等功能，提供完整的 Markdown 语法支持。',
  siteName: 'Astro Blog Theme',
  author: 'Astro Blog Theme',
  language: 'zh-CN',

  postsPerPage: 12,
  linkAttr: 'abbrlink',
}

export const getPostLink = (post: PostModel) => `/posts/${post.data[config.linkAttr]}`
