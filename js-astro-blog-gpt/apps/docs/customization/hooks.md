# 自定义 Hook 与扩展

在 BlogGPT 中，你无需修改主题核心源码，即可通过项目根目录 `custom/` 文件夹中的扩展文件注入自定义 `<head>` 标签、覆盖 CSS 样式或编写客户端交互脚本。

## 1. 注入自定义 `<head>` 标签（`custom/head.html`）

写在 `custom/head.html` 中的所有内容都会被直接注入到每个页面的 `<head>` 标签内。文件按原始 HTML 读取，不执行 Astro Frontmatter。这里非常适合放置：

- 第三方访问统计脚本（如 Umami、Plausible、Google Analytics、Cloudflare Web Analytics）
- 外部 Web 字体样式表（`<link rel="stylesheet" href="...">`）
- 搜索引擎站长验证 `<meta>` 标签

```html
<!-- custom/head.html -->
<!-- 示例：引入 Umami 网站统计 -->
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="your-website-id"
></script>
```

`custom/body-start.html` 和 `custom/body-end.html` 也会以原始 HTML 注入到 `<body>` 的开头和末尾。

## 2. 覆盖样式与 CSS 变量（`custom/styles.css`）

使用 `custom/styles.css` 可以方便地调整全局字体、主题色或特定组件的样式。由于该文件在主题默认样式之后加载，你的自定义规则会自然生效：

```css
/* custom/styles.css */
body {
  font-family:
    'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

code,
pre {
  font-family: 'JetBrains Mono', monospace;
}

/* 针对深色模式微调背景或强调色 */
html[data-theme='dark'] {
  /* 自定义深色样式 */
}
```

## 3. 客户端切页钩子（`custom/client.ts`）

为了保持侧边栏状态并实现顺滑的阅读体验，BlogGPT 采用客户端无刷新路由切换页面。由于点击站内链接时浏览器不会重新刷新整个页面，普通的 `DOMContentLoaded` 事件只在首次打开网站时触发一次。

如果你希望某段前端脚本在**首次加载**以及**每次切换文章后**都能自动运行，请在 `custom/client.ts` 中导出 `onPageLoad` 函数：

```ts
// custom/client.ts
export function onPageLoad() {
  // 首次进入页面及每次客户端路由切换完成后均会触发
  console.log('当前访问路径：', window.location.pathname);

  // 示例：在此处初始化评论组件或自定义 DOM 交互
}
```
