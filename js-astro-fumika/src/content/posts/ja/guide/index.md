---

title: Fumika のシンプルガイド (ja)
published: 2024-04-01
description: "このブログテンプレートの使い方。"
image: "./cover.jpg"
tags: ["Fumika", "Blogging", "Customization"]
category: Guides
ogImage: "/media/images/guide-cover.jpg"
draft: false
---

> カバー画像の出典: [出典](https://www.pixiv.net/en/artworks/137505032)

このブログテンプレートは [Astro](https://astro.build/) で構築されています。このガイドで言及されていない内容については、[Astro ドキュメント](https://docs.astro.build/) を参照してください。

## 記事のフロントマター

```yaml
---
title: 初めてのブログ記事
published: 2023-09-09
description: これは新しい Astro ブログの最初の投稿です。
image: ./cover.jpg
tags: [Foo, Bar]
category: フロントエンド
draft: false
---
```

| 属性          | 説明　                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`       | 記事のタイトル                                                                                                                                                                                               |
| `published`   | 記事の公開日                                                                                                                                                                                                 |
| `description` | 記事の簡単な説明。インデックスページに表示されます。                                                                                                                                                         |
| `image`       | 記事のカバー画像のパス。<br/>1. `http://` または `https://` で始まる場合: Web 上の画像を使用<br/>2. `/` で始まる場合: `public` ディレクトリ内の画像<br/>3. 接頭辞がない場合: Markdown ファイルからの相対パス |
| `tags`        | 記事のタグ                                                                                                                                                                                                   |
| `category`    | 記事のカテゴリー                                                                                                                                                                                             |
| `ogImage`     | OpenGraph画像用。記事のデフォルトの `ogImage` を上書きします。<br/>基本システムは `image` と全く同じですが、<br/>`ogImage` は Markdown ファイルからの相対パスを読み込むことができません。                    |
| `draft`       | この記事が下書き状態かどうか（下書きの場合は表示されません）                                                                                                                                                 |

## 記事ファイルの配置場所

記事ファイルは `src/content/posts/` ディレクトリに配置する必要があります。記事やアセットを整理しやすくするためにサブディレクトリを作成することも可能です。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.webp
    └── index.md
```
