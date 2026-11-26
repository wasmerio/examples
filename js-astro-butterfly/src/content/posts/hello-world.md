---
title: 你好，Astro Butterfly
date: 2024-06-01 10:00:00
updated: 2024-06-01 10:00:00
abbrlink: 1a2b3c4d
tags: [指南]
categories: [开始]
cover: /img/covers/1.svg
description: 主题的第一篇文章：写作方式、Front Matter 字段和常用命令。
---

欢迎使用 **Astro Butterfly**。这是一个参照 Hexo Butterfly 外观、用 Astro 重新实现的博客主题：页面是纯静态 HTML，脚本只在需要的地方加载。

## 写一篇文章

文章放在 `src/content/posts/` 下，子目录随意组织。也可以用脚本生成：

```bash
pnpm new "文章标题" 分类目录
```

它会生成带好 Front Matter 和唯一 `abbrlink` 的 Markdown 文件，文章地址就是 `/posts/<abbrlink>/`。

## Front Matter

```yaml
---
title: 文章标题            # 必填
date: 2024-06-01 10:00:00  # 必填，按 site.timezone 解析
updated: 2024-06-02 09:00  # 可选：更新时间会自动跟随 git 提交
abbrlink: 1a2b3c4d         # 必填，文章 URL
tags: [Astro, 前端]
categories: [前端, 框架]    # 数组表示层级：前端 › 框架
cover: /img/covers/2.svg   # 列表卡片封面，缺省用 site.defaultCover
top_img: /img/banner.svg   # 文章顶部横幅，缺省用封面
description: 摘要          # 卡片与搜索引擎摘要，缺省截取正文
comments: true             # 关闭单篇评论设为 false
draft: false               # 草稿只在 pnpm dev 里出现
---
```

> [!TIP]
> 从 Hexo 迁移过来？Front Matter 的写法完全兼容，日期格式、`abbrlink`、`comment` 字段都能直接读取。参见仓库里的 `docs/migrate-from-hexo.md`。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 本地开发，默认 <http://localhost:4321> |
| `pnpm build` | 构建到 `dist/`，并生成站内搜索索引 |
| `pnpm preview` | 预览构建结果 |
| `pnpm check` | 类型检查 |
| `pnpm test` / `pnpm test:e2e` | 单元测试 / 浏览器测试 |

接下来可以看看 [Markdown 写作](/posts/2b3c4d5e/)、[代码块](/posts/3c4d5e6f/) 和 [标签外挂](/posts/4d5e6f70/) 三篇示例。
