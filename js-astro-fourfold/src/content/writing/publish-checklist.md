---
title: "发布前值得看一遍的清单"
description: "域名、草稿、图片说明和分享卡片，在第一次推上线之前集中检查。"
locale: zh-cn
translationKey: publish-checklist
publishedAt: 2026-07-02
updatedAt: 2026-09-12
author: "Site Author"
tags: [发布, 写作]
featured: true
minutes: 5
column: "个人出版物基础"
columnOrder: 4
draft: false
---

示例站点可以带着占位内容上线，自己的站点不应该。下面这些检查，对应的都是这个主题已经生成的文件，而不是一份抽象的发布仪式。

## 身份和地址

1. 改 `src/data/site.ts` 里的站名、简介和作者。
2. 生产构建设置 `SITE_URL` 和 `BASE_PATH`。项目站点不要把子路径写进 `SITE_URL`。
3. 确认页脚的内容许可是你真正想声明的协议。

## 内容和资源

- 草稿不会出现在列表、RSS 和搜索里，但会留在仓库中。发布前搜一遍 `draft: true`。
- 每张公开图片都要有说明。影像页的 `alt` 是必填的。
- 外链应指向你检查过的地址。示例友链可以整组删掉。

## 构建本身

```bash
npm run validate:content
npm run check
npm run build
```

构建成功之后，再打开 RSS、站点地图和一篇文章的分享卡片。canonical 应该落在你的域名上，而不是 `example.org`。
