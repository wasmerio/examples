# Sumi 墨

墨・和紙・余白でつくった Astro 7 のブログテーマ。

明暗ふたつの配色をひとつのトークンから引き、外部リクエストはゼロ、記事ページには JavaScript を一切載せません。トップページの背後では WebGL の流体シミュレーションが動いていて、カーソルで墨をかき混ぜられます。

[English README →](./README.md)

![ダークモードのヒーロー](./docs/screenshot-dark.png)
![和紙の上の記事ページ](./docs/screenshot-light.png)

## 特徴

- **明暗の配色を一度だけ書く。** 色は `light-dark()` で宣言し、`color-scheme` で切り替えます。トグルは属性をひとつ置くだけ。JavaScript を切っていても OS の設定にそのまま従います。
- **外部リクエストなし。** 欧文フォントはサブセットして同梱。日本語は数 MB の CJK フォントを積まず、システムの明朝スタックに任せます。
- **ハイドレーションなし。** 記事ページの外部 JavaScript はゼロ。テーマトグルは数百バイトのインラインのみで、インクは gzip 3.5KB、トップページにしか載りません。
- **流体シミュレーションを、無理のない範囲で。** GPU 上の Navier–Stokes。ピクセル比は 1.5 倍で頭打ち、画面外では停止、`prefers-reduced-motion` や WebGL2 非対応の環境では起動せず静的なグラデーションが代わりに出ます。
- **スキーマ付きのコンテンツコレクション。** 日付の書き忘れやタグの型崩れはページではなくビルドで落ちます。Markdown も MDX も使えます。
- **SEO は最初から。** canonical、Open Graph、Twitter Card、JSON-LD（`WebSite` / `BlogPosting`）、サイトマップ、RSS、`robots.txt`、`llms.txt`。
- **記事ごとの OG 画像。** satori でビルド時に生成します。墨地に朱の罫線、等幅の組み。
- **コードハイライトも明暗対応。** Shiki が両方のパレットを出力し、トグルで一緒に切り替わります。
- **アクセシビリティ。** セマンティックなランドマーク、スキップリンク、フォーカスリング、明暗どちらでもコントラストを確認済み。

## はじめかた

```bash
git clone https://github.com/kpab/astro-sumi.git
cd astro-sumi
npm install
npm run dev
```

**Node.js 22.12 以上**が必要です。Astro は奇数バージョンの Node を対象外としているため、22 か 24 を使ってください。

| コマンド          | 内容                                    |
| ----------------- | --------------------------------------- |
| `npm run dev`     | `localhost:4321` で開発サーバーを起動   |
| `npm run build`   | `./dist` へビルド                       |
| `npm run preview` | ビルド結果をローカルで確認              |
| `npm run check`   | `astro check` で型チェック              |

## 設定

書き換える必要があるのは [`src/config.ts`](./src/config.ts) だけです。

```ts
export const SITE = {
  url: "https://your-domain.com", // 末尾スラッシュなし
  title: "Sumi",
  titleMark: "墨", // 空文字にすると日本語のアクセントが消える
  tagline: "An Astro theme in ink and paper",
  description: "…",
  lang: "en",
  locale: "en_US",
  defaultOgImage: "/og-default.png",
};

export const AUTHOR = { name: "…", url: "…", bio: "…" };
export const NAV = [{ label: "Blog", href: "/blog" } /* … */];
export const SOCIAL = [{ label: "GitHub", href: "…" }];

export const BLOG = {
  postsPerPage: 4, // 実運用では 8〜12 くらいが妥当
  postsOnHome: 4,
  wordsPerMinute: 220,
  showReadingTime: true,
  showTableOfContents: true,
  tocMinHeadings: 3,
};

export const INK = {
  hero: true, // ヒーロー背面の全画面シミュレーション
  divider: true, // セクション間の細い帯
  strength: 1, // 0.3〜2.5
  autoFlow: true, // カーソル待ちにせず自分でも滲ませる
};

export const OG = { enabled: true, width: 1200, height: 630 };
```

`INK` の両方を `false` にすると、外部 JavaScript が完全にゼロのサイトになります。ヒーローには静的な墨のグラデーションが残ります。

### インクのコスト

Lighthouse の既定のモバイル条件（CPU 4 倍スロットリング、低速 4G）で、無圧縮の `npm run preview` に対して測った値です。

| ページ                        | Performance | Accessibility | Best practices | SEO |
| ----------------------------- | ----------: | ------------: | -------------: | --: |
| 記事                          |       85〜96 |           100 |            100 | 100 |
| トップ（`INK.hero: true`）    |       74〜81 |           100 |            100 | 100 |
| トップ（`INK.hero: false`）   |          93 |           100 |            100 | 100 |

トップページの LCP はどちらでも 1.9 秒、CLS は 0 です。シミュレーションはブラウザが空くまで起動を遅らせてあるので、初回描画を止めません。数値の差はシェーダのコンパイル中のブロッキング時間で、トップが記事より低いのはそのためです。圧縮の効く実際のホスティングと、4 倍スロットリングされていない実機では、これより良い値になります。

トップページも 90 台後半にしたい場合は `INK.hero` を切ってください。記事側の幅は、その記事に含まれるコードの量で変わります。

日本語で書く場合は `SITE.lang` を `"ja"`、`SITE.locale` を `"ja_JP"` に変えてください。本文の明朝は最初からシステムフォントを参照しているので、そのまま日本語が読める組版になります。

## 記事を書く

記事は `src/content/blog/` に置く Markdown か MDX です。ファイル名がそのまま URL になります。

```markdown
---
title: "The Grammar of Negative Space"
description: "一覧・meta description・OG 画像に使われます"
pubDate: 2026-07-28
updatedDate: 2026-08-01 # 任意
tags: ["design", "craft"]
draft: false # 下書きは dev では見えて、ビルドからは外れる
heroImage: ./cover.jpg # 任意。astro:assets で最適化される
heroImageAlt: "…"
---

本文。
```

スキーマは [`src/content.config.ts`](./src/content.config.ts) にあります。ファイル名が `_` で始まるものは読み込み対象から外れます。

なお Astro 7 は Markdown 処理系を remark / rehype から [Sätteri](https://satteri.bruits.org/) に置き換えたため、remark プラグインは使えません。このテーマはプラグインに依存しない作りにしてあります。目次は Astro が返す見出し情報から、読了時間は本文から直接計算しています。

## 構成

```
src/
├── config.ts              ← 触るのはここだけ
├── content.config.ts      コレクションのスキーマ
├── content/blog/          記事
├── assets/fonts/          OG 画像描画用の TTF（配信されない）
├── components/            ヘッダー・フッター・カード・インク・SEO head
├── layouts/               BaseLayout, PostLayout
├── pages/
│   ├── index.astro        ヒーローと最新記事
│   ├── blog/              一覧・ページ送り・記事
│   ├── tags/              タグ一覧とアーカイブ
│   ├── og/                記事ごとの OG 画像
│   └── rss.xml.ts  llms.txt.ts  robots.txt.ts
├── scripts/fluid-ink.ts   WebGL のインク（カスタム要素）
├── styles/                トークン・グローバル・フォント・本文組版
└── utils/                 記事・日付・読了時間・OG 描画
public/fonts/              同梱の woff2 と OFL ライセンス
```

## カスタマイズ

**色。** すべて [`src/styles/tokens.css`](./src/styles/tokens.css) にあり、`light-dark(明, 暗)` の形で一度だけ宣言しています。パレットのブロックを書き換えれば両テーマが同時に変わります。インクも同じファイルの `--ink-canvas-bg` / `--ink-pigment` / `--ink-accent` を読み、背景の輝度から「紙に墨を置く」か「黒地に光らせる」かを判断するので、配色を変えても追加の作業は要りません。

**書体。** 同じファイルの `--font-serif` と `--font-mono`。欧文を差し替えるなら `public/fonts/` に woff2 を置いて [`src/styles/fonts.css`](./src/styles/fonts.css) を更新してください。システム明朝ではなく日本語の Web フォントを使いたい場合も、`@font-face` をここに足します。

**インク。** [`src/scripts/fluid-ink.ts`](./src/scripts/fluid-ink.ts) で調整します。解像度、圧力計算の反復回数（22 回）、減衰、周期的な滲みの間隔は、いずれもフレームループの先頭付近にまとまっています。

**コードの色。** [`astro.config.ts`](./astro.config.ts) の `markdown.shikiConfig`。トグルで切り替えるために `defaultColor: false` は残してください。

## デプロイ

静的ファイルを吐くだけなので、どのホスティングでも動きます。

**Cloudflare Pages** — リポジトリを接続して次を設定します。

```
ビルドコマンド:      npm run build
出力ディレクトリ:    dist
Node バージョン:     24
```

**Netlify** — 同じ値を設定するか、`netlify.toml` を置きます。

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "24"
```

**Vercel** — Astro は自動で認識されます。出力先が `dist`、Node が 24 になっていることだけ確認してください。

どこに置く場合も、先に `src/config.ts` の `SITE.url` を公開先のオリジンに変えておきます。canonical、サイトマップ、フィード、OG 画像の URL はすべてこの値から組み立てられます。

## クレジット

- [Source Serif 4](https://github.com/adobe-fonts/source-serif)（Adobe）と [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono)（JetBrains）。いずれも SIL Open Font License 1.1（[`public/fonts/LICENSE.txt`](./public/fonts/LICENSE.txt)）
- コードの配色は Shiki 経由の [Vitesse](https://github.com/antfu/vscode-theme-vitesse)
- OG 画像は [satori](https://github.com/vercel/satori) と [resvg](https://github.com/yisibl/resvg-js) で描画

## ライセンス

MIT © [kpab](https://github.com/kpab)
