---
language: 'zh-CN'
title: '从零开始：安装与使用'
description: '在本地启动主题，写一篇有固定地址的 Markdown 文章，再把构建好的博客发布到自己的域名或 GitHub Pages。'
publishDate: 2026-08-17
updatedDate: 2026-11-20
tags: [主题, 文档]
series: { name: 主题使用指南, order: 1 }
---

从空目录到第一篇文章，只需要一个本地开发服务。下面用 `hello.md` 作例子，它最终的地址是 `/blog/hello`。

## 安装与预览

准备 Node.js 22.12.0 或更高版本、pnpm 10 和 Git。仓库的 `package.json` 指定了 pnpm 10.20.0。第一次尝试可以直接克隆主题；如果已经创建了自己的博客仓库，就把下面的地址换成自己的。

```bash
git clone https://github.com/willimt/astro-theme-ink.git my-blog
cd my-blog
pnpm install
pnpm dev
```

打开终端显示的本地地址，默认是 `http://localhost:4321`。保持这个终端运行，保存 Markdown 文件后就能在浏览器里看到变化。

## 写下第一篇文章

新建 `src/content/blog/hello.md`，把开头三项换成自己的标题、摘要和实际发布日期：

```markdown
---
title: '窗边的第一篇笔记'
description: '周末重新整理书桌，也给写作留了一个位置。'
publishDate: 2026-11-20
tags: [随笔]
---

把书桌挪到窗边之后，我发现下午四点正适合坐下来写几行字。
```

在本地打开 `/blog/hello`，再到[文章列表](/blog)看摘要。正文里链接其他文章时，写成 `[定制指南](/blog/customize)`。主题会在构建时补上部署子路径，读者从带或不带末尾斜杠的地址进入都能正确跳转。

| 字段                                  | 用途                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `title`、`description`、`publishDate` | 必填。标题最多 80 个字符，摘要最多 200 个字符。日期可以写成 `YYYY-MM-DD`。              |
| `updatedDate`                         | 修订日期。文章页同时显示首次发表和最近更新时间。                                        |
| `tags`                                | 可选标签数组。首尾空格会被去掉，英文转为小写后去重。                                    |
| `heroImage`                           | 可选封面。`src` 是相对于文章源文件的本地图片路径，`alt` 用来描述画面。                  |
| `draft`                               | 设为 `true` 会从文章列表、搜索和 RSS 中排除。构建仍生成文章页面，知道网址的人可以阅读。 |
| `comment`                             | 设为 `false` 可关闭本篇评论。显示评论还需要配置全站 Waline 服务。                       |

要在文章旁保存插图，也可以用 `src/content/blog/hello/index.md` 组织同一篇文章，地址仍是 `/blog/hello`。两种目录结构选一种即可。

## 换成自己的博客

先在 `src/site-config.ts` 修改 `site.title`、`site.author` 和 `home.hero.about`。默认头像是 `public/avatar.webp`；替换成另一个文件时，记得一起改 `site.avatar`。首页简介、导航和评论可以等第一篇文章写完再配。[深度定制指南](/blog/customize)

## 构建与部署

```bash
pnpm build
pnpm preview
```

`pnpm build` 先运行 Astro 检查，再把静态站点写入 `dist/`。`pnpm preview` 提供这份产物的本地预览。发布前可以从首页进入文章，点一次文中的站内链接，再打开 `/rss.xml` 确认订阅链接使用自己的域名。

- **部署到域名根目录**：在托管平台的构建环境中设置 `SITE_URL`（例如 `https://example.org`），`BASE_PATH` 留空。构建命令为 `pnpm build`，发布目录为 `dist`。
- **部署到 GitHub Pages 项目子目录**：仓库自带 `.github/workflows/deploy.yml`。在仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。推送到 `main` 后，工作流会设置站点域名和 `/仓库名/` 前缀，构建并发布 `dist/`。[GitHub Pages 发布设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- **使用根域名的 GitHub Pages**：如果线上地址是 `https://用户名.github.io/` 或独立域名根目录，请相应调整工作流中的 `SITE_URL` 并清空 `BASE_PATH`。

## 以后怎样更新主题

如果主题与个人博客是两个相邻的 Git 仓库，在主题目录运行下面的命令。这里假设个人博客的目录名是 `Blog`。

```bash
pnpm theme:sync --target ../Blog
```

先读预览。出现 `REVIEW` 或 `CONFLICT` 时，按仓库中的 `docs/theme-sync.md` 核对差异。预览符合预期后，用 `pnpm theme:sync --target ../Blog --apply` 写入，再到博客目录运行 `pnpm install`、`pnpm test` 和 `pnpm build`，把 `.theme-sync.json` 与主题更新一起提交。也可以用 `pnpm theme:sync:ui` 打开本机同步面板。

同步范围不含 `src/content/` 下的文章。个人博客里的示例可以自行改写或移除，以后同步时会保留这个选择。
