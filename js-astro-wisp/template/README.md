# Wisp starter

使用 [Wisp](https://github.com/xingcanlee/astro-wisp) 主题的 Astro 站点。主题以 npm 包 `astro-wisp` 提供，本仓库只有你的配置和内容。

## 创建

```bash
pnpm create astro@latest my-blog -- --template xingcanlee/astro-wisp/template
cd my-blog
pnpm dev
```

首次使用前编辑 `astro.config.ts`：把 `site` 改成正式域名，修改 `wisp({ site })` 中的标题和作者；再编辑 `src/content/pages/about.md`，并替换 `src/content/posts/starter/index.md`。

## 目录

```text
astro.config.ts          # 站点与主题配置（wisp({...})）
src/content.config.ts    # 内容集合（使用 astro-wisp/content 的 loader 与 schema）
src/content/posts/       # 文章：每篇一个目录，入口 index.md / index.mdx
src/content/pages/       # 独立页面（about.md）
src/styles/custom.css    # 可选：覆盖主题样式
```

## 定制

| 想做的事            | 方式                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| 改配色              | `wisp({ palette: { color: { base: { accent: { light: '…', dark: '…' } } } } })` 或指向一个 JSON 文件 |
| 改样式              | `wisp({ customCss: ['./src/styles/custom.css'] })`                                                   |
| 看外观规范          | 主题的视觉规范随包发布：`node_modules/astro-wisp/DESIGN.md`。覆盖样式或组件前先读它                  |
| 改组件              | `wisp({ components: { Footer: './src/components/Footer.astro' } })`                                  |
| 自己写某个页面      | `wisp({ routes: { about: false } })`，然后写 `src/pages/about.astro`                                 |
| 加 frontmatter 字段 | `postsSchema({ extend: z.object({ … }) })`                                                           |
| 交互讲解组件        | `pnpm astro add react && pnpm add motion`，组件从 `astro-wisp/explainers` 组合                       |

## 升级主题

```bash
pnpm up astro-wisp
```

你的覆盖都在本仓库自己的文件里，升级不会产生冲突。

## 命令

```bash
pnpm dev             # 开发服务器
pnpm build           # 生产构建
pnpm check           # astro check + 图表 manifest 检查
pnpm diagram build   # 生成图表（需要 uv）
```

环境要求：Node.js `>=22.23.4` 和 pnpm 12.18.0（版本由 `package.json#packageManager` 固定）。
