# 迁移现有博客

由于 BlogGPT 采用标准的 Markdown 文件与 YAML Frontmatter，从 **Hugo**、**Hexo**、**Jekyll** 或其他 Astro 主题迁移文章非常顺畅。你可以按照以下五个步骤完成迁移。

## 1. 整理文章

将原有的 `.md` 或 `.mdx` 文章复制到 `content/posts/` 目录下。你可以直接平铺放置，也可以按年份或主题建立子文件夹分类存放——BlogGPT 会自动递归扫描 `content/posts/` 下的所有文件。

随后检查每篇文章顶部的 Frontmatter 字段：

- **`title`** _(必填)_：确保每篇文章都有字符串类型的 `title`。
- **发布日期必填，兼容字段无需改名**：BlogGPT 原生兼容 `date`、`published` 和 `pubDatetime` 作为发布时间，同时兼容 `updated`、`modDatetime` 和 `lastmod` 作为更新时间，绝大多数旧博客无需批量重命名日期字段。
- **草稿状态**：未完成的文章保留 `draft: true` 即可。

## 2. 资源管理（配图与附件）

根据你旧博客存放配图的方式，可以选择以下两种方案之一：

- **文章与配图同目录（内容包 Bundle）**：如果旧博客采用类似 Hugo Page Bundles 的结构（每篇文章一个文件夹，内含 `index.md` 和图片），直接将该文件夹放入 `content/posts/<文章目录>/`，并在正文中通过 `./image.png` 相对路径引用即可。详见[内容包与附件](../content/bundles.md)。
- **全局静态目录（`public/`）**：如果旧文章统一使用 `/images/cover.jpg` 这类根路径引用图片，只需把原来的静态资源文件夹整体移入 `public/images/`，正文中的图片链接无需做任何修改。

## 3. 分类与标签

在 BlogGPT 中，文章通过分类和标签的 `slug`（短名称）进行归类：

1. 检查文章 Frontmatter 中的 `categories` 与 `tags`（支持数组如 `categories: [frontend]`，也兼容单字符串 `category: frontend`）。
2. 在 `content/categories/<slug>.md` 和 `content/tags/<slug>.md` 中创建对应的定义文件，为该分类或标签设置易读的中文标题（`title`）、简介（`description`）和封面图。详见[分类、标签和页面](../content/taxonomy.md)。

## 4. 保持原有链接地址

如果你希望迁移后尽量保持原有的文章 URL 结构，避免外部链接失效：

- **单篇自定义短名称**：在文章 Frontmatter 中指定 `slug` 可覆盖默认文件名。只允许小写 ASCII 字母、数字和连字符，且必须以字母或数字开头；不能把任意旧路径（如含斜杠的地址）直接填入 `slug`。
- **按年份/月份添加 URL 前缀**：如果旧博客的文章路径带有年份或月份（例如 `/posts/2026/03/my-post`），可在 `blog.config.ts` 中设置 `posts.pathPrefix: '[year]/[month]'`（或 `'[year]'`）。详见[目录与网址](../content/organization.md)。

## 5. 检查与发布

迁移完成后，在本地执行正式构建以校验所有文章的 Frontmatter 格式与资源引用：

```bash
pnpm build
pnpm preview
```

根据终端提示修复缺失的必填字段（如个别旧文章缺少 `title`），在浏览器中抽查几篇带图文章与搜索功能，确认无误后即可部署上线！
