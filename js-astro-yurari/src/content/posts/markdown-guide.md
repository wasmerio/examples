---
title: 記法の一覧
published: 2026-10-24
description: このテーマで使えるMarkdown記法と拡張記法をまとめたサンプルです。
tags: [Guide, Markdown]
category: Guide
---

このページは、記事で使える記法を**実際の表示と書き方**の両方で確認するためのサンプルです。

## 見出し

`##` が大見出し、`###` が小見出しです。どちらも目次に載ります。

### 小見出しの例

## テキストの装飾

**太字**、_斜体_、~~取り消し線~~、`インラインコード`、[通常のリンク](/about) が使えます。

```md
**太字**、_斜体_、~~取り消し線~~、`インラインコード`、[通常のリンク](/about)
```

## リスト

- 箇条書き
  - ネストもできます
- もう一つの項目

1. 番号付き
2. リスト

- [x] 完了したタスク
- [ ] 未完了のタスク

```md
- 箇条書き
  - ネストもできます

1. 番号付き
2. リスト

- [x] 完了したタスク
- [ ] 未完了のタスク
```

## 引用

> 引用ブロックです。
> 複数行にもできます。

```md
> 引用ブロックです。
> 複数行にもできます。
```

## コールアウト

`> [!種類]` で始まる引用は、コールアウトになります。種類は `NOTE` `TIP` `IMPORTANT` `WARNING` `CAUTION` です。

> [!NOTE]
> 補足情報です。

> [!TIP] タイトルを変える
> `[!TIP]` の後ろにタイトルを書けます。

> [!WARNING]
> 注意が必要な内容です。

```md
> [!NOTE]
> 補足情報です。

> [!TIP] タイトルを変える
> `[!TIP]` の後ろにタイトルを書けます。
```

## コードブロック

言語を指定するとシンタックスハイライトされ、右上のボタンでコピーできます。

```ts
type Post = { title: string; published: Date };

export const sortPosts = (posts: Post[]) => posts.toSorted((a, b) => b.published.getTime() - a.published.getTime());
```

````md
```ts
const hello = "world";
```
````

## テーブル

| 記法       | 表示           | 備考 |
| ---------- | -------------- | ---- |
| `**text**` | **太字**       |      |
| `*text*`   | _斜体_         |      |
| `~~text~~` | ~~取り消し線~~ | GFM  |

```md
| 記法       | 表示     |
| ---------- | -------- |
| `**text**` | **太字** |
```

## 画像

クリックすると拡大表示になり、ホイールやピンチで拡大縮小、ドラッグで移動できます。

![サンプル画像](@/assets/images/posts/sample.jpg)

```md
![サンプル画像](@/assets/images/posts/sample.jpg)
```

## リンクカード

URLだけの行は、OGP情報からリンクカードになります。

https://astro.build

```md
https://astro.build
```

## ホバーカード

文中の外部リンク、たとえば [open-graph-scraper](https://github.com/jshemas/openGraphScraper) にマウスを乗せると、プレビューが表示されます。

```md
文中の外部リンク [open-graph-scraper](https://github.com/jshemas/openGraphScraper) にマウスを乗せる
```

## 区切り線

---

```md
---
```
