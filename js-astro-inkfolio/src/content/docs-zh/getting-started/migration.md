---
title: 迁移已有博客
order: 4
description: 从 WordPress、Ghost、Hugo 或别的 Astro 主题把文章、图片和链接搬过来。
---

搬家是四件事：文章、资源、分类标签、链接。按这个顺序做——链接要等前三件稳定了才有意义。

## 一、文章

把 Markdown（或导出成 Markdown 的 HTML）放进 `src/content/posts/`，一个文件一篇，
文件名就是 URL slug。

frontmatter 对照：

| 旧字段 | Inkfolio |
| --- | --- |
| `title` | `title` |
| `date` / `published_at` | `date`（ISO `YYYY-MM-DD`） |
| `excerpt` / `summary` | `description` |
| `cover` / `featured_image` | `cover`（`public/` 下的路径） |
| `tags` | `tags: []` |
| `category` | `categories: []` |
| `draft: true` | 保留——草稿不进构建产物 |

其他字段会被忽略，迁移期间可以留着，不影响解析。

```bash
# 先确认每篇都能解析，再谈样式
npm run build
```

## 二、图片与附件

图片放 `public/`，用站点根路径引用：`/img/hello.jpg`，不要写相对路径。

如果旧站用的是 `wp-content/uploads/2024/05/photo.jpg`，两种做法：

1. 原样把目录搬到 `public/wp-content/uploads/...`，老链接继续可用；
2. 一次性改写正文里的引用：

```bash
grep -rl 'wp-content/uploads' src/content/posts | while read f; do
  sed -i 's#/wp-content/uploads/2024/05/#/img/#g' "$f"
done
```

## 三、分类与标签

分类和标签写在文章 frontmatter 里，页面由数据自动生成，不需要登记：

```yaml
categories: ['技术']
tags: ['cloudflare', '自建服务']
```

想给某个分类指定封面和一句说明，加到 `src/data/taxonomy.ts`，否则用该分类最新文章的封面：

```ts
export const categoryMeta = {
  技术: { cover: '/img/tech.jpg', description: '基础设施与工具。' },
};
```

## 四、链接

旧链接能不能活下来，取决于三件事：

1. `astro.config.mjs` 里的 `trailingSlash: 'always'`——链接是 `/posts/hello/` 而不是 `/posts/hello`。
2. `src/content/posts/` 里的文件名——`hello.md` 就是 `/posts/hello/`。
3. 挪过位置的地址要写跳转。Cloudflare Pages 在 `public/` 放一个 `_redirects`：

```
/2024/05/old-post/   /posts/old-post/   301
/feed/               /rss.xml           301
```

Vercel 与 Netlify 用同样的文件格式。

把被外链最多的十个地址记下来，上线后手动点一遍——404 流量基本都出在这十个里。

## 五、切 DNS 前的检查单

- [ ] `npm run build` 通过（它先跑 `astro check`）
- [ ] `dist/sitemap-index.xml` 里每篇文章都在
- [ ] `site.config.yaml` 写了真实域名和语言列表
- [ ] 每种语言各开一篇，语言切换只在有对应译文时出现
- [ ] 旧地址要么还能打开，要么 301 到新地址
- [ ] 搜索能搜到一篇老文章的标题（索引在部署时生成）
