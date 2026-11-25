# 目录与网址

BlogGPT 基于 Astro Content Collections 管理所有内容。你无需手动编写路由表——文件所在的目录与 Frontmatter 会自动决定每个页面的最终网址（URL）。

## 四类内容

`content/` 目录下共划分为四个子目录，分别对应四类内容：

| 目录路径              | 用途说明                               | 生成的网址规则                                      |
| --------------------- | -------------------------------------- | --------------------------------------------------- |
| `content/posts/`      | 博客文章                               | `/posts/<slug>`（支持配置 `posts.pathPrefix` 前缀） |
| `content/pages/`      | 独立页面（如关于、留言、近况等）       | `/<slug>`                                           |
| `content/categories/` | 分类信息定义（分类名称、简介、封面图） | `/categories/<slug>`                                |
| `content/tags/`       | 标签信息定义（标签名称、简介）         | `/tags/<slug>`                                      |

## 文件与 Slug 规则

每篇内容的网址标识符（**`slug`**）按以下优先级生成：

1. **Frontmatter 中的 `slug` 字段**：如果在文件头部显式指定了 `slug: custom-path`，则优先使用该值。
2. **文件名或目录名**：
   - 普通单文件（如 `content/posts/hello-world.md` 或 `hello-world.zh.md`）默认使用去除语言后缀后的文件名 `hello-world`。
   - [内容包目录](./bundles.md)（如 `content/posts/2026-trip/index.md` 或 `index.zh.md`）默认使用其所在的文件夹名称 `2026-trip`。

你可以在 `content/posts/` 下按年份或主题自由创建多层子目录来整理源文件（例如 `content/posts/tech/2026/my-post.md`），最终生成的 URL 默认只取末尾的 `my-post`。`slug` 只允许小写 ASCII 字母、数字和连字符，且必须以字母或数字开头，不能包含斜杠。需要日期目录时，请使用下面的 `posts.pathPrefix`。

## 网址规则

### 自定义文章路径前缀（`posts.pathPrefix`）

默认情况下，文章的访问路径为 `/posts/<slug>`。如果你习惯带年份或月份的网址格式（或者正在从 Hexo、Hugo 迁移旧博客），可以在 `blog.config.ts` 中设置 `posts.pathPrefix`：

```ts
export default {
  posts: {
    // 支持的占位符：[year]、[month]、[day]
    pathPrefix: '[year]/[month]',
  },
};
```

配置为 `'[year]/[month]'` 后，发布日期为 `2026-03-29`、slug 为 `hello-world` 的文章网址将自动变为 `/posts/2026/03/hello-world`。

### 多语言路由前缀

在开启多语言时，网址是否包含语言前缀（例如 `/en/posts/hello-world`）取决于 `blog.config.ts` 中的 `site.localePrefixPolicy` 配置。详细说明请参阅[语言与多语言内容](./languages.md)。
