# 博客使用指南

这份指南面向实际博客仓库。主题仓库负责组件、样式和功能；博客仓库保留你的文章、图片、站点信息、域名和部署设置。日常写作、改个人资料和发布，都应在博客仓库中完成。

## 1. 开始前

需要 Node.js 22.12.0+ 和 pnpm 10。第一次进入博客仓库时安装依赖：

```powershell
cd D:\Code\Blog
pnpm install
pnpm dev
```

打开终端显示的本地地址（默认是 <http://localhost:4321>）。开发服务器会监听文章、配置和样式的改动；新增文章后刷新页面即可看到。

日常会用到的命令：

| 命令           | 用途                                       |
| -------------- | ------------------------------------------ |
| `pnpm dev`     | 启动开发服务器，边写边看效果               |
| `pnpm check`   | 检查 Astro、内容 schema 和 TypeScript 问题 |
| `pnpm test`    | 验证主题同步脚本与核心行为                 |
| `pnpm build`   | 先检查，再生成可部署的 `dist/`             |
| `pnpm preview` | 在本机检查 `dist/` 的最终效果              |
| `pnpm format`  | 用 Prettier 格式化文件；会直接写入文件     |

发布前至少运行 `pnpm build`。若本次更新过主题，也运行 `pnpm test`。

## 2. 先区分主题与博客

| 放在主题仓库 `D:\Code\astro-theme-ink`         | 放在博客仓库 `D:\Code\Blog`                          |
| ---------------------------------------------- | ---------------------------------------------------- |
| 组件、布局、样式、通用页面、同步脚本和主题说明 | 文章、个人图片、头像与图标、域名、部署配置、个人资料 |

博客的 `src/site-config.ts`、`astro.config.ts` 和 `src/content/` 是个人内容。更新主题时不要直接用主题文件覆盖它们；使用 [主题同步说明](./theme-sync.md) 的预览和合并流程。

## 3. 配置你的站点

日常配置在 `src/site-config.ts`。修改后在本地页面确认即可。

| 配置                                | 何时修改                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `site`                              | 站点标题、作者、描述、语言、头像、favicon、分享图、默认配色和明暗模式    |
| `header.menu`                       | 顶部导航。链接用站内路径，如 `/blog`、`/about`                           |
| `home.hero`                         | 首页姓名上方文字、地点、简介和按钮                                       |
| `home.recentPosts`                  | 首页最近文章数。`0` 隐藏；任意正数最多显示 5 篇                          |
| `home.education`、`home.skills`     | 首页履历与技能；空数组或不填写即不展示                                   |
| `home.showTags`、`home.showFriends` | 首页标签云和友链预览开关                                                 |
| `footer`                            | 页脚版权、链接、社交账号和名言。名言默认显示，设 `showQuote: false` 关闭 |
| `blog.pageSize`                     | `/blog`、标签和归档列表的每页文章数                                      |
| `search.enabled`                    | 搜索入口和构建期索引开关                                                 |
| `comment`、`pageview`               | Waline 评论、文章阅读量与页脚总访问量                                    |

`site.avatar`、`site.favicon` 和 `site.ogImage` 是 `public/` 下的 URL 路径，例如 `/avatar.webp`。文件本身放在 `public/` 后，浏览器才可通过这个路径取得它。

域名在 `astro.config.ts` 的 `site` 中设置。它会影响 canonical URL、RSS、sitemap 和分享链接；换域名或首次发布前必须改为真实的 `https://` 地址。

## 4. 新建一篇文章

在 `src/content/blog/` 中新建一个 `.md` 或 `.mdx` 文件。文件名就是 URL 的最后一段：

```text
src/content/blog/hello-astro.md        -> /blog/hello-astro
src/content/blog/notes/index.md        -> /blog/notes
src/content/blog/2026/reading.md       -> /blog/2026/reading
```

最小可发布文章需要标题、摘要和发布日期：

```markdown
---
title: '文章标题'
description: '用于文章列表、搜索结果与分享卡片的一句话摘要。'
publishDate: 2026-09-07
tags: [Astro, 写作]
language: '中文' # 可选
draft: false # 可选，默认 false
comment: true # 可选，默认 true
---

从这里开始写正文。
```

字段的要求和实际效果如下：

| 字段          | 要求与作用                                                           |
| ------------- | -------------------------------------------------------------------- |
| `title`       | 必填，最多 80 个字符；用于标题、浏览器标签和 RSS                     |
| `description` | 必填，最多 200 个字符；用于列表、搜索和 SEO 描述                     |
| `publishDate` | 必填，使用 `YYYY-MM-DD`；文章按此日期倒序排列                        |
| `updatedDate` | 可选；文章有实质更新时填写，页面会显示更新时间                       |
| `tags`        | 可选字符串数组；会去空格、转为小写并自动去重                         |
| `language`    | 可选；指定正文的朗读语言，支持 `zh-CN`、`en` 等标签及旧写法 `中文`、`English`                   |
| `draft`       | `true` 时不进入首页、列表、标签、RSS 和搜索，仍可通过确定的 URL 预览 |
| `comment`     | `false` 时关闭这一篇的 Waline 评论区                                 |

文章文件中的日期和 YAML 缩进必须正确。`pnpm check` 会尽早指出字段类型、长度或图片路径的问题。

移动或改名时，可以在新文章的 frontmatter 里记录旧网址。每条路径从站点根目录开始，省略部署前缀。构建会检查重复路径并生成静态跳转，原有书签可继续使用。

```yaml
aliases: [/blog/mailserver/docker/]
```

为同一组教程指定相同的系列名和各自的正整数顺序。至少两篇已发布时，文末显示系列进度，并按阅读顺序链接前后篇。序号可以留空档，同一系列的已发布文章须使用不同序号。

```yaml
series:
  name: Spike
  order: 1
```

省略 `language` 时正文沿用 `site.lang`。日期、目录和文章导航也随站点语言显示。文章含至少五个二至四级标题时，在手机上滚过篇首目录后，可以从顶栏重新打开目录并跳到其他章节。

## 5. 封面、正文图片与图注

封面图使用本地资源，并相对**当前文章文件**引用。Astro 会在构建时优化它并生成响应式尺寸：

```markdown
---
heroImage:
  src: ../../assets/cover.png
  alt: '深蓝色的书桌与笔记本电脑'
---
```

分享文章链接时，预览卡片会使用这篇文章的封面。构建时生成宽度最多为 1200 像素的 JPEG，图片说明取自 `alt`，缺省时使用文章标题。没有封面的文章使用站点配置的 `site.ogImage`。

正文图片使用普通 Markdown。把图片单独放在一个段落中，`alt` 文字会成为图片下方的图注；因此应写清楚图片表达的内容，而不是写“图片 1”。

```markdown
![部署完成后的首页，fresh 浅色配色](https://example.com/home.png)
```

正文图片默认懒加载，可点击后以原生对话框放大；键盘用户可用 Tab 聚焦图片、用 Enter 或空格打开、用 Escape 关闭。外链图片会以不发送来源页信息的方式加载，并在首次网络错误后重试一次；持续失败时会保留图注并显示不可用提示。

文章中频繁复用、需要长期稳定的图片建议放进 `public/` 并以绝对站内路径引用，例如 `![说明图](/images/guide.png)`。图片必须先真实存在于 `public/images/guide.png`。不要把图片文件放在主题仓库再期待同步脚本带入博客：它刻意不管理个人资源。

## 6. Markdown 写作能力

普通 Markdown 的标题、列表、表格、引用、链接和脚注都可直接使用。文章标题会生成可复制的锚点；正文行宽已限制为适合阅读的长度。

### 公式和图表

````markdown
行内公式：$E = mc^2$

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$

```mermaid
flowchart LR
  写作 --> 构建 --> 发布
```
````

KaTeX 负责公式渲染。Mermaid 只会在文章实际包含 `mermaid` 代码块时下载；图表语法错误会在浏览器控制台报错，因此提交前要在本地文章页看一次。

### 代码块

代码块会显示语言、复制按钮，超过 15 行时自动折叠。可增加文件标题、单行高亮和增删标记：

````markdown
```bash title="deploy.sh"
pnpm build                 # [!code highlight]
git add dist/              # [!code ++]
rm -rf old-output/         # [!code --]
```
````

`title="..."` 显示标题条；`[!code highlight]` 高亮一行；`[!code ++]` 与 `[!code --]` 标记新增和删除。若要在代码中原样展示这些标记，将 `!` 写成 `\!`。

打印文章或另存为 PDF 时，屏幕上折叠的长代码也会完整输出。

## 7. 草稿到发布的工作流

1. 创建文章时先设 `draft: true`，用确定 URL 在本地检查内容。
2. 检查标题、摘要、发布日期、图注、链接、代码块、公式和移动端布局。
3. 改为 `draft: false`；确认首页只显示最新 5 篇，完整文章在 `/blog` 中可见。
4. 运行 `pnpm build`，再运行 `pnpm check:links`。后者会列出失效站内链接、章节锚点和图片所在的页面。运行 `pnpm preview` 可以检查实际排版。
5. 提交文章、资源和配置；按已有部署方式发布 `dist/`。

`draft: true` 并不是访问控制。静态站点仍会生成该文章的 URL，所以不要把敏感内容、未公开链接或密钥写进草稿。

## 8. 评论、阅读量和搜索

Waline 评论与计数是独立开关，但可使用同一个 Waline 服务地址：

```ts
comment: {
  provider: 'waline',
  server: 'https://your-waline.example.com/'
},
pageview: {
  server: 'https://your-waline.example.com/',
  siteWide: true
}
```

将 `comment.server` 或 `pageview.server` 留空可关闭对应功能。`siteWide: false` 只关闭页脚全站计数。设置 `search.enabled: false` 会隐藏搜索入口，搜索页会显示停用提示。构建仍会生成已发表文章的索引 `/search-index.json`。

## 9. 更新主题而不覆盖个人内容

主题有功能或样式更新时，在主题目录先预览，再应用：

```powershell
cd D:\Code\astro-theme-ink
pnpm theme:sync --target ../Blog
pnpm theme:sync --target ../Blog --apply

cd ..\Blog
pnpm test
pnpm build
```

同步会管理主题组件、样式、脚本和这份说明；不会自动覆盖文章、个人资源、域名、部署配置和个人站点配置。出现 `REVIEW` 或 `CONFLICT` 时，先按 [主题同步说明](./theme-sync.md) 合并，再执行应用命令。将 `.theme-sync.json` 与本次主题更新一起提交，不要手工编辑它。

若终端已位于博客目录，可使用已同步的脚本，但必须明确主题来源：

```powershell
pnpm theme:sync --source ../astro-theme-ink --target .
pnpm theme:sync --source ../astro-theme-ink --target . --apply
```

不要跳过预览直接执行 `--apply`。预览列出的 `UPDATE`、`ADD` 或 `DELETE` 是本次即将写入的文件；先核对它们，再应用。

也可以在主题目录启动图形化面板，完成同样的预览与确认应用：

```powershell
pnpm theme:sync:ui
```

浏览器会打开本机 `http://127.0.0.1:4175`。面板不提交、推送或部署；关闭终端或按 Ctrl+C 即可停止它。

## 10. 发布前清单

- `astro.config.ts` 中的 `site` 是线上真实域名，且以 `https://` 开头。
- 新文章不再是草稿，标题和摘要足够清楚，标签没有无意的重复。
- 图片可加载、图注有意义，外链图片没有依赖临时地址。
- `pnpm check`、`pnpm test`（主题更新后）和 `pnpm build` 已通过。
- 用 `pnpm preview` 或线上预览检查首页、文章页、窄屏导航、深浅色和 RSS 链接。
- Git diff 中没有意外的个人配置覆盖或构建产物。
