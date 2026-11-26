---
title: 常见问题
order: 0
description: 十个能解释「它怎么会长这样」的答案。
---

## 页面上没有语言切换

这是对的。切换按钮只在另一种语言存在同一页面时才渲染。没有译文的文章、只在
一种语言里出现的标签，都不会有按钮。

分类按名字匹配，并为意译情况留了一张小别名表（`Setup ↔ 配置`、`Design ↔ 设计`）。
需要新的对应关系就加进 `src/data/taxonomy.ts`。

## 分类卡片的图不对，或者只显示一个字

卡片封面优先取 `src/data/taxonomy.ts`，没有就取该分类最新文章的封面，再没有就是
首字占位。想固定下来就写进映射：

```ts
export const categoryMeta = {
  技术: { cover: '/img/tech.jpg' },
};
```

## 标题变成「你好 — Inkfolio — Inkfolio」

`Base.astro` 会自动在传入的 title 后面拼站点名。只传短标题（`你好`），不要再带 `— Inkfolio`。

## 构建失败，但 `npm run dev` 正常

`npm run build` 会先跑 `astro check`，开发服务器不会。最常见的是隐式 `any`：

```
error ts(7006): Parameter 'x' implicitly has an 'any' type.
```

补上类型（`(x: string) => …`）再构建。想去掉这道闸就直接 `npx astro build`，代价是类型错误进生产。

## 新写的文档页没出现在侧栏

文档按目录分组：`getting-started/`、`configuration/`、`content/`、`reference/`。
放进别的目录，页面能构建出来但没有入口——侧栏只认 `src/lib/docs.ts` 里列出的章节。
把文件挪进已有章节，或在那里新增一个章节。

## 搜索不到刚发的文章

搜索索引由 Pagefind **在构建时**生成（`scripts/build.mjs`）。重新 `npm run build`；
`npm run dev` 不写索引。

## 图片 404

正文图片必须放 `public/`，且从站点根引用：`/img/hello.jpg`，不能写 `../assets/hello.jpg`。
构建会原样拷贝 `public/`。

## zh-Hant 页面里还是简体

zh-Hant 复用 `posts-zh/` 的文章，只转换界面文案，不转换你的正文。正文还是简体，
说明那段字写在内容里——直接写成繁体，或在 `src/lib/trad.ts` 里补词条。

## 草稿本地能看，线上没有

设计如此。`draft: true` 的文章在开发模式可见、不进构建产物。发布前改成 `draft: false`，
并确认 `date` 不是未来日期。

## 到底改 `site.config.yaml` 还是 `src/`？

读者能看到的文字、链接、配色、功能开关 → `site.config.yaml`。
改主题本身（布局、组件、样式）才动 `src/`。凡是已经配置化的属性，改 `src/` 等于下次主题更新会被覆盖。

## 还是不明白

对 `dist/` 跑一次 `npm run seo`：它会报缺失的 meta、重复标题、不对等的 hreflang、
过薄的页面——「奇怪」通常就出在这几项上。
