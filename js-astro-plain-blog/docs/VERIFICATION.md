# 验收

仓库检查是 `pnpm check`、`pnpm format`、`pnpm lint`、`pnpm test` 和 `pnpm build`。`lint` 是 Astro 诊断别名。`pnpm test` 会构建并读取真实 HTML，不包含浏览器操作。

浏览器复验：

```sh
pnpm build
pnpm preview --host 127.0.0.1 --port 4323
```

检查首页、文章、Projects、About、目录键盘操作、浏览器返回，以及 320px 和 390px 下没有整页横向滚动。代码和表格应在自身区域滚动。`/blog/` 和不存在的文章应显示 404，草稿不应出现。

已在桌面 Chromium 和 macOS Safari 做过这些检查。尚未覆盖 iOS Safari、Firefox、读屏器、远端 CI 或生产域名。静态 404 的真实状态码取决于主机是否把未知路径映射到 `dist/404.html`。

## 子路径部署

`SITE_URL=https://example.org/ BASE_PATH=/PlainBlog pnpm build` 的产物已检查：首页、面包屑、文章链接、静态资源、canonical 和 RSS 绝对地址都带 `/PlainBlog` 前缀，RSS 内容里没有重复前缀，也没有遗留的根路径链接。首页介绍里手写的 `[关于本站](/about/)` 会渲染成 `/PlainBlog/about/`，站外链接不变，Astro 生成的图片地址不会被重复加前缀。`pnpm test` 中的隔离构建会重复覆盖这条路径。

## 尚未执行的部署检查

`.github/workflows/deploy.yml` 已经写好，但没有在远端跑过。启用前需要在仓库 Settings → Pages 把 Source 设为 GitHub Actions；之后 push 到 `main` 才会产生首次部署。`https://wutongyuonce.github.io/PlainBlog/` 上的实际渲染、404 状态码与资源加载尚未验证。
