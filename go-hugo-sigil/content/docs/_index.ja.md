---
title: "ドキュメント"
translationKey: "docs"
slug: docs
---


# ドキュメント

SIGIL を自分のものにするために必要なすべて。このページは地図です。
[設定例](../../config-example/) はそのまま使える出発点、
[API 契約](../../api/) は凍結された正式リファレンス。要件とインストールは
[README](https://github.com/ouatis/hugo-theme-sigil#install) に。

{{< page-anatomy >}}

## はじめに

SIGIL は Hugo ≥ 0.166 extended で動作し、ビルド手順は不要です。`baseURL` を設定し、
設定例から `[params]` を選び、Markdown で記事を書きます。標準でラテン組版、傍注、
検索、ダークモードが使えます。日本語を実際の Plex で出したい場合は、任意のフォント
サブセット（`bash scripts/build-fonts.sh corpus`）が必要です。入れなければシステム
フォントにフォールバックします。

## 機能の使いかた

各機能はページ単位で opt-in です。ページが要求しないものは読み込まれません。記事の
front matter で：

```toml
math    = true   # KaTeX。$...$ と \(...\) に対応
mermaid = true   # ```mermaid ブロックからの図
lightbox = true  # 画像のクリック拡大
```

- **傍注** —— 脚注 `[^1]` を書き、末尾で `[^1]: 注の内容` と定義します。広い画面では
  余白に浮かび、狭い画面では巻末の注に畳まれます。テーマ固有の構文ではなく、普通の
  Markdown です。
- **多言語** —— 各言語の翻訳に同じ `translationKey` を付けると、言語切替が対応する記事へ
  飛びます。翻訳のないページはその言語のホームに戻ります。右から左に書く言語
  （アラビア語・ペルシャ語・ヘブライ語・中央クルド語）は、サイト設定で
  `direction = "rtl"` を指定すれば、傍注・浮遊目次・矢印を含むレイアウト全体が
  鏡像になります。
- **フォント** —— `latin`（既定・クリーンな状態）、`corpus`（デモの日本語、約 200 KB）、
  `full`（SC + JP 全体、約 3 MB）。ページではなくサイト単位で選びます。
