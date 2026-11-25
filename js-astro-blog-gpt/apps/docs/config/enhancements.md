# 文章增强

BlogGPT 原生集成了数学公式、流程图、图片点击放大、提示块（Callouts）以及自动生成社交分享封面卡片等功能。这些特性在 `blog.config.ts` 的 `article` 下默认全部开启，你也可以在单篇文章的 Frontmatter 中按需覆盖。

## KaTeX 数学公式（`article.math`）

当 `article.math: true`（默认开启）时，你可以在正文中通过 `$...$` 编写行内公式，或通过 `$$...$$` 编写独立公式块：

```markdown
行内质能方程：$E = mc^2$。

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

如果某篇文章大量使用普通美元符号 `$`（例如讲解 Shell 脚本变量或商品价格）而不希望触发公式解析，只需在该文章的 Frontmatter 中添加 `math: false`。

## Mermaid 图表（`article.mermaid`）

当 `article.mermaid: true`（默认开启）时，使用 ` ```mermaid ` 包裹的代码块会自动渲染为自适应浅色/深色主题的矢量流程图或时序图：

````markdown
```mermaid
graph LR
  A[Markdown 原文] --> B(Astro 静态构建)
  B --> C[静态页面 + Pagefind 索引]
```
````

## 图片点击放大 Lightbox（`article.lightbox`）

当 `article.lightbox: true`（默认开启）时，读者点击正文中的任意配图即可全屏放大查看细节。若某个独立页面不需要图片灯箱效果，可在该页 Frontmatter 中设置 `lightbox: false`。

## 提示块 Callouts（`article.callouts`）

当 `article.callouts: true`（默认开启）时，支持使用 GitHub 风格的引用块语法插入醒目的提示框：

```markdown
> [!NOTE]
> 补充背景信息，帮助读者理解上下文。

> [!TIP]
> 实用的技巧、快捷方式或最佳实践建议。

> [!WARNING]
> 需要特别留意的潜在风险或操作注意事项。
```

支持的提示类型包括：`NOTE`、`TIP`、`IMPORTANT`、`WARNING` 和 `CAUTION`。

## 自动动态生成 OG 分享封面（`article.shareCover`）

即便你没有为文章手动制作配图（未设置 `image`），BlogGPT 也能在构建时自动为每篇文章生成一张 `1200×630` 的高清 PNG 社交分享卡片（`og:image`），用于在微信、X（Twitter）、Discord 等平台分享链接时展示文章标题与作者名：

```ts
export default {
  article: {
    shareCover: {
      enabled: true,
      width: 1200,
      height: 630,
      background: '#f5f5f5',
      foreground: '#171717',
      accent: '#3b82f6',
      // fontPath: './custom/fonts/NotoSansSC-Bold.otf', // 可选：指定自定义中文字体路径
    },
  },
};
```
