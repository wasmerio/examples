---
title: "歡迎使用 Flipside"
description: "Flipside 網站要編輯的地方：設定、資料與內容。"
pubDate: "2026-01-01"
tags: ["meta"]
heroImage: "./hero-guitar.jpg"
# heroImage credit: Brent Ninaber, https://unsplash.com/photos/HALqu3hIsuk
# (cropped to drop the headstock — no third-party brand visible)
---

這是全新安裝的 Flipside 的第一篇文章。如果你是在建置好的網站上看到它，代表
部落格的功能都已經接好了：標籤、分頁、RSS、搜尋、閱讀時間，一應俱全。底層
的管線不需要你動手，真正要編輯的地方只有三處。

## `src/config.ts`

網站標題、描述、作者、導覽列連結、社群連結，以及功能旗標（`features.math`、
`features.mermaid`、`features.giscus`）。一個檔案，大多是字串跟布林值。

## `src/data/*`

「關於」頁面的內容（時間軸、數據、作品卡片、連結）都放在這裡，是純資料檔，
不是版面標記。改資料，頁面就會自動更新。

## `src/content/blog/`

就是這個資料夾。丟一個 Markdown 檔進來，在 frontmatter 填上 `title` 和
`pubDate`，它就會變成一篇文章：排進列表、加上標籤、同步到 `rss.xml`，下次
建置時也會被索引進搜尋。

接下來看〈功能總覽〉那篇文章，裡面示範了 Markdown 管線支援的所有東西。
