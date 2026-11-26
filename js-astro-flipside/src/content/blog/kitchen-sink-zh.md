---
title: "功能總覽"
description: "這個範本支援的 Markdown 功能，濃縮在同一篇文章裡。"
pubDate: "2026-01-03"
tags: ["demo"]
heroImage: "./hero-studio.jpg"
# heroImage credit: Leo Wieling, https://unsplash.com/photos/Sby_GQz1-5E
---

這篇文章示範 Markdown 轉換流程支援的所有排版功能，同時也用來驗證中文內容的閱讀時間估算、
目錄（TOC）與標題錨點（slug）是否正常運作。原始檔在
`src/content/blog/kitchen-sink-zh.md`，可以對照著看。

## 程式碼區塊

### 檔名與行號

在 code fence 加上 `title` 會顯示檔名框；加上 `showLineNumbers` 則會顯示行號。

```ts title="example.ts"
export function greet(name: string): string {
  return `哈囉，${name}！`;
}
```

```ts showLineNumbers
export function add(a: number, b: number): number {
  return a + b;
}
```

### 差異標記

標記為 `diff` 並加上 `lang="…"` 的 code fence，會把 `+`／`-` 開頭的行顯示為新增或刪除，
其餘部分仍保有語法上色。

```diff lang="ts"
  function total(items: number[]): number {
-   return items.reduce((a, b) => a + b);
+   return items.reduce((a, b) => a + b, 0);
  }
```

## 文字

行內程式碼像 `npm run build` 可以直接放在句子中間，不會打斷閱讀。

> 引言區塊：以下所有內容都是從這一個 Markdown 檔案產生的（主題樣式、閱讀時間、
> 目錄，全部都讀同一份原始檔）。

## 表格

| 功能       | 套件                           | 開關               |
| ---------- | ------------------------------ | ------------------ |
| 程式碼區塊 | `astro-expressive-code`        | 預設開啟           |
| 數學公式   | `remark-math` / `rehype-katex` | `features.math`    |
| 圖表       | `mermaid`                      | `features.mermaid` |
| 留言區     | giscus                         | `features.giscus`  |

## 清單

- [x] 寫完功能總覽這篇文章
- [x] 示範程式碼、表格與註腳
- [ ] 打開數學公式與 mermaid 開關，畫一張真正的圖表

## 圖片

<!--
  相片檔案跟這篇文章放在同一個資料夾（colocated），這是 Astro 官方文件記載
  的 content collection 圖片慣例：檔案放在 Markdown 原始檔旁邊，建置時的
  資源管線就會接手處理、最佳化並自動帶上 base 前綴，跟從 `src/` import
  進來的圖片完全相同（已驗證：會渲染成
  `/astro-flipside/_astro/avatar.<hash>.webp`——Astro 預設的圖片服務會把
  點陣圖重新編碼成 webp，跟這裡原本那張 SVG「原封不動複製」的行為不同）。
  純 Markdown 的 `![](/og.png)` 這類絕對路徑不會有這層處理，只有 frontmatter 的 `heroImage`
  （見 BlogPost.astro）和這種 colocated 相對路徑才會自動帶 base 前綴。
  （照片：Baruk Granda，跟 Life／Work 卡片同一張大頭貼——
  https://unsplash.com/photos/OHLRskxOpjI。）
-->

![Flipside 的預留大頭貼](./avatar.jpg)

圖片預設會撐滿整個欄寬；加上 `width` 屬性就能縮小，像下面這個示範一樣。

<!--
  縮放需要一個真正的 width 屬性，但 Markdown 的 ![]() 語法沒辦法設定，所以
  這裡改用 raw HTML —— Astro 的 Markdown 管線會原封不動地照抄過去（已用
  `npm run build` 驗證：src 完全照字面輸出，沒有雜湊、也沒有加上 base
  前綴）。這也代表常見的 root-relative 捷徑在這裡會 404（已對照
  `npm run preview` 確認）：唯一真的能解析成功的 src，是手動把 base 前綴寫
  進 `public/` 檔案路徑裡，跟 `src/config.ts` 的 `SITE.base` 是同一個字串。
-->

<img src="/astro-flipside/og.png" width="160" alt="圖片縮放示範">

## 數學與圖表

`src/config.ts` 裡的 `features.math` 與 `features.mermaid` 預設都是 **關閉**
的，所以 `$$…$$` 和 ` ```mermaid ` 區塊如果直接寫，只會被當成一般文字或程式碼，
不會變成公式或圖表。這裡改用逸出（escaped）的方式呈現語法本身，等打開開關後再看
實際渲染效果。

```text
$$
E = mc^2
$$
```

```text
graph TD
  A[Markdown] --> B[remark-mermaid]
  B --> C[渲染後的圖表]
```

## 註腳

這篇文章的閱讀時間也是從渲染後的文字內容計算出來的，中文字同樣算在內[^1]。

[^1]:
    參見 `plugins/remark-reading-time.mjs`：它用 `reading-time` 套件計算
    `mdast` 樹的內容，中文字是逐字計算，不是逐詞計算。
