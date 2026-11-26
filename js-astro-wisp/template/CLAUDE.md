# Wisp starter rules

本站使用 Astro 主题集成 `astro-wisp`。主题的页面、布局、组件和样式都在 `node_modules/astro-wisp` 中，**不要修改 node_modules**；需要改动时用下列扩展点，这样 `pnpm up astro-wisp` 升级不会冲突。

- 站点配置：`astro.config.ts` 中的 `wisp({...})`；正式域名用 Astro 的 `site`。
- 覆盖组件 / 布局：`wisp({ components: { Footer: './src/components/Footer.astro' } })`，可以 `import Default from 'astro-wisp/components/Footer.astro'` 包装默认实现。
- 样式：`wisp({ customCss: ['./src/styles/custom.css'] })`；页面里可以使用 Tailwind 语义工具类（`bg-surface`、`text-muted`、`border-border`）。
- 颜色只能使用 `--wisp-*` / `--wd-*` 令牌；要换配色用 `wisp({ palette })` 覆盖调色板，不要写十六进制颜色。
- 自定义页面：先用 `wisp({ routes: { about: false } })` 关掉主题路由，再在 `src/pages/` 实现；文章只通过 `getPosts()`（`astro-wisp/utils`）读取。
- 文章放在 `src/content/posts/<slug>/index.md(x)`，正文从二级标题开始；每篇文章必须有 `title`、`description` 和 `pubDate`。
- 图表源文件和生成的 `.wisp.svg` 与文章放在同一个 `diagrams/` 目录；修改源文件后运行 `pnpm diagram build`，并提交 `diagrams.manifest.json`。
- Agent skills（随主题升级）：运行 `pnpm exec wisp skills` 查看路径。写文章用 `wisp-writer`，画图用 `wisp-diagram`。
- 提交前至少运行 `pnpm check` 和 `pnpm build`。
