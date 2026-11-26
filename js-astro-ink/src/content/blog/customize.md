---
language: 'zh-CN'
title: '深度定制指南'
description: '把演示站改成自己的博客：设置首页简介、头像和导航，调整纸色与排版，按需开启评论、浏览量和搜索。'
publishDate: 2026-08-16
updatedDate: 2026-11-20
tags: [主题, 文档]
series: { name: 主题使用指南, order: 2 }
heroImage:
  src: ../../assets/cover-demo.png
  alt: '蓝天下，一枝绿叶从白云前伸过。'
---

换掉站名和头像之后，最显眼的变化往往来自一句写得像自己的简介。先打开 `src/site-config.ts`；下面提到的字段都可以在现有配置里逐项修改。

## 站名、头像与分享卡片

`site.title` 出现在页头和浏览器标签页，`site.author` 是首页头像旁的名字。把头像放到 `public/`，配置里写它对外的路径。例如，`public/avatar.webp` 对应 `site.avatar: '/avatar.webp'`。站点图标用 `site.favicon`，分享卡片用 `site.ogImage`。如果沿用模板里的文件名，可以直接替换图片。

`site.lang` 用于页面的 `lang` 属性和 RSS 的语言标记。中文博客可以填 `zh-CN`。要把导航里的 “Archives” 改成“归档”，在 `header.menu` 改它的 `title`。目录、阅读时长等界面文字由相应组件提供，改语言标记不会自动翻译这些文字。

## 让首页简介比 About 页短

`home.hero.about` 可以分段写经历和兴趣，About 页会展示全文。首页优先取 `home.hero.summary`；省略这个字段时，会显示 `about` 的第一段。下面是可替换现有 `home.hero` 的示例：

```ts
hero: {
  tagline: '程序员 · 业余摄影爱好者',
  summary: '记录做工具时踩过的坑，也留一点地方给照片。',
  about: '我做开发工具，喜欢把重复的小事写成脚本。\n\n周末带相机出门，回来挑一张照片写日记。',
  buttons: [{ title: '关于我', link: '/about' }]
}
```

`home.recentPosts` 控制首页近作数量，最多 5 篇，设为 `0` 隐藏。教育经历和技能分别放在 `home.education`、`home.skills`，空数组会隐藏对应分区。想在首页显示标签或友链，开启 `home.showTags` 或 `home.showFriends`；友链内容来自 `friends`。文章列表每页显示几篇由 `blog.pageSize` 单独控制，默认 8 篇。

## 调整导航和页脚

`header.menu` 中每一项都包含显示名称 `title` 和地址 `link`。例如 `{ title: '归档', link: '/archives' }`。手机上导航在顶栏下方，当前栏目用一条短线标出。菜单只负责链接；新增自定义栏目时，先在 `src/pages/` 创建对应页面。

页脚的文字链接放在 `footer.links`，社交账号放在 `footer.social`。后者也会出现在首页简介下方。复制主题后，记得核对演示站的版权文字、社交地址和备案链接。`footer.showQuote` 决定页脚是否显示引语。

## 换纸色、字体与正文排版

只想换默认外观，可以在 `site` 中把 `palette` 设为 `'ink'` 或 `'fresh'`，把 `theme` 设为 `'system'`、`'light'` 或 `'dark'`。读者保存过的个人选择优先；检查新的站点默认值时，可以用一个新的浏览器配置文件打开预览。

| 想调整的地方                     | 修改位置                                                                                                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 浅色和深色的纸面、墨色、强调色   | `src/assets/styles/tokens.css`。`:root`、`.dark`、`.fresh` 和 `.fresh.dark` 对应四套颜色。若改变纸面颜色，`src/utils/theme.ts` 中供浏览器顶栏使用的颜色也要一起调整。 |
| 标题、正文或代码字体             | 同一文件中的 `--font-serif`、`--font-sans` 和 `--font-mono`。                                                                                                         |
| 正文基础字号、行高和代码块样式   | `src/assets/styles/global.css` 中的 `.prose` 与 `.astro-code`。                                                                                                       |
| 正文标题、引用、列表和表格的细节 | `uno.config.ts` 中的 `typography` 配置。文章列与桌面目录的布局在 `src/layouts/PostLayout.astro`。                                                                     |

## 单独开启评论或阅读量

模板默认关闭评论和访问计数。先取得自己的 Waline 服务地址，再在 `src/site-config.ts` 里填需要使用的字段。两项功能可以共用一个服务。[Waline 部署说明](https://waline.js.org/guide/get-started/)

```ts
comment: {
  provider: 'waline',
  server: 'https://waline.example.org'
},
pageview: {
  server: '', // 暂时只开放评论
  siteWide: true
}
```

启用评论后，滚动到文章末尾附近才会加载评论客户端。想单独关闭某篇的评论，在那篇文章开头加 `comment: false`。

要显示文章阅读量，把服务地址也填入 `pageview.server`。此时 `pageview.siteWide: true` 会额外显示页脚的全站访问量；只关掉 `siteWide` 就只保留文章阅读量。计数请求失败时页面显示「—」，实际计数为零时显示 `0`。

## 搜索开关控制什么

`search.enabled: false` 会隐藏页头的搜索入口，访问 `/search` 时页面会提示搜索已关闭。构建仍会生成 `/search-index.json`，其中包含已发表文章的索引。`draft: true` 的文章会从索引中排除，但文章网址依然可以访问。

写作字段和部署环境变量见[安装与使用](/blog/getting-started)。想检查自己的字号和配色是否适合阅读，可以用[Markdown 语法速查](/blog/markdown-guide)里的引用、代码和表格做对照。
