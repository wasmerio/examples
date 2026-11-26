# 新增內容

文章、專案與相簿的資料位置：

- 文章：`src/content/blog/`
- 專案：`src/data/projects.ts`
- 相簿：`src/data/gallery.ts`

存檔後，`npm run dev` 會立即更新。

## 寫一篇文章

在 `src/content/blog/` 新增 `.md` 或 `.mdx` 檔，圖片放在文章旁邊，用相對路徑引用。`.mdx` 檔在建置時會以 JavaScript 執行，審查時要當作程式碼（見 [CONTRIBUTING.md](../CONTRIBUTING.md)）。

```md
---
title: "文章標題"
description: "列表與搜尋結果顯示的摘要" # 可省略
pubDate: "2026-07-13"
updatedDate: "2026-07-20" # 可省略
heroImage: "./cover.jpg" # 可省略；文章頁大圖，兼列表縮圖
tags: ["life", "music"] # 可省略
draft: true # 草稿只在 dev 顯示，建置時自動排除
---

內文為一般 Markdown。相對路徑的圖片 `![說明](./photo.jpg)` 會自動轉
webp 並產生響應式尺寸。程式碼區塊、表格、目錄與標籤都是內建功能。
```

範例文章「功能總覽」（[`kitchen-sink-zh.md`](../src/content/blog/kitchen-sink-zh.md)）列出所有可用的排版。

## 加一個專案

在 `src/data/projects.ts` 的 `PROJECTS` 陣列加一筆：

```ts
{
  name: "專案名稱",
  description: "一句話說明。",
  tech: ["Astro", "TypeScript"],       // 顯示成技術標籤
  url: "https://github.com/you/repo",  // 整個區塊都連到這裡
  img: cover,                          // 可省略；檔案頂部 import 的圖或 https URL
},
```

## 加一張照片

將圖檔放進 `src/assets/gallery/`，在 `src/data/gallery.ts` import 後加一筆：

```ts
{
  src: photo,                        // import 的圖或 https URL
  alt: "給螢幕閱讀器與搜尋引擎的描述",   // 必填
  caption: "圖下與燈箱顯示的說明",   // 可省略
},
```

陣列順序為顯示順序。
