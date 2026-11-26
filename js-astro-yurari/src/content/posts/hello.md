---
title: はじめての投稿
published: 2026-10-20
description: このテーマの基本的な使い方を紹介します。
tags: [Astro, Guide]
category: Guide
---

## ようこそ

これは **Yurari** テーマのサンプル記事です。`src/content/posts` にMarkdownを追加すると記事が増えます。

- Tailwind CSS v4
- ダークモード対応
- テーマカラーの変更

> 引用ブロックもこのように表示されます。

```ts
const hello = (name: string) => `Hello, ${name}!`;
```

## 画像

画像をクリックすると拡大表示されます。

![サンプル画像](/hero.svg)

## 長いコード

```ts
const veryLongLine =
  "これは横スクロールが発生するくらい長い行です。これは横スクロールが発生するくらい長い行です。これは横スクロールが発生するくらい長い行です。これは横スクロールが発生するくらい長い行です。";
```

## コールアウト

> [!NOTE]
> 補足情報を目立たせたいときに使います。

> [!TIP] ひとこと
> タイトルは `[!TIP]` の後ろに書くと変えられます。

> [!IMPORTANT]
> 見落としてほしくない内容です。

> [!WARNING]
> 注意が必要な内容です。

> [!CAUTION]
> 危険を伴う操作です。
