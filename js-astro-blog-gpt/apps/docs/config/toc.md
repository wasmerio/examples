# 目录与代码块

对于长篇技术文章，清晰的章节目录（TOC）与舒适的代码块高亮能显著提升阅读体验。你可以在 `blog.config.ts` 中调整这两项功能。

## 文章目录（`article.toc`）

BlogGPT 会自动提取正文中的标题（默认为二级标题 `<h2>` 至四级标题 `<h4>`），生成支持悬浮展开与滚动高亮的章节目录：

```ts
export default {
  article: {
    toc: {
      enabled: true, // 是否全局开启文章目录
      minDepth: 2, // 纳入目录的最高标题层级（2 对应 <h2>）
      maxDepth: 4, // 纳入目录的最低标题层级（4 对应 <h4>）
      expandDelay: 1000, // 悬停自动展开的延迟毫秒数
      hideDelay: 800, // 鼠标移开后自动收起的延迟毫秒数
    },
  },
};
```

如果某篇随笔篇幅较短、不需要展示目录，只需在该文章的 Frontmatter 中设置 `toc: false`。

## 代码块主题与行号（`appearance`）

代码块基于 **Expressive Code**（Shiki）构建，原生支持浅色/深色双主题自动切换与右上角一键复制按钮：

```ts
export default {
  appearance: {
    codeThemes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    showCodeLineNumbers: false, // 设为 true 时默认显示代码行号
  },
};
```

### Markdown 代码块实用技巧

- **指定语言高亮**：在开头的三个反引号后填写语言名称（如 ` ```ts `、` ```bash ` 或 ` ```python `）。
- **显示文件名标题栏**：在语言名称后添加 `title="blog.config.ts"`，即可在代码块顶部渲染带文件名的标题栏。
- **高亮特定行**：在语言名称后添加 `{2,4-6}`，即可重点高亮第 2 行以及第 4 至 6 行代码。
