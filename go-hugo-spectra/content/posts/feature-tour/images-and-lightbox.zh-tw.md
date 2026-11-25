---
title: "圖片、封面、還有放大檢視"
date: 2025-03-01
draft: false
tags: [Spectra, 圖片, 展示]
math: false
cover: "images/demo01.jpg"
toc: true
description: "封面圖設定、圖片插入、點擊放大 — Spectra 的圖片功能一次看完。"
series: [Spectra 功能導覽]
---


## 封面圖

你現在看到這篇文章最上面那張大圖，就是封面圖。設定方式很簡單，在 front matter 裡面加一行：

```yaml
cover: "images/demo01.jpg"
```

封面圖會自動加上漸層遮罩，讓標題文字不會被背景吃掉。如果不想要封面圖，留空字串 `""` 就好。

## 插入圖片

Markdown 標準語法就能插入圖片：

```markdown
![替代文字](/images/example.webp)
```

圖片會自動套用圓角樣式。`alt` 文字除了無障礙用途，在圖片載入失敗的時候也會顯示出來，記得填。

![範例架構圖](/images/sample-architecture.svg)

## 點擊放大

Spectra 內建 lightbox 功能。點一下文章裡的圖片，它會放大到全螢幕，背景會暗下來。再點一下或按 `Esc` 就能關閉。

不需要額外設定，所有文章內的圖片都自動支援。

![終端機畫面](/images/sample-terminal.svg)

試試看點上面這張圖。

## 圖片格式建議

不同格式各有適合的場景：

| 格式 | 適合用途 | 檔案大小 | 透明度 |
|------|---------|---------|--------|
