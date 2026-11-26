---
title: テーマインストールガイド
categories: [テーマ紹介]
description: Star Readは優れていて、シンプルで洗練されたAstroブログテーマです。複数のインストール方法を提供し、プロジェクト構造が明確で、モダンなUI、検索サポート、レスポンシブデザイン、テーマ切り替えなどの機能を備えています。また、検索、テーマカスタマイズ、コメントシステムの詳細な設定も提供します。
cover: /cover/2c614caca4dd46a2.avif
date: 2026-06-30 12:58:33
---

<div align="center">
  <img src="/logo.png" alt="starread" border="0">
  🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 中国語ドキュメント | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>

# Star Read - Astroブログテーマ

>星の光のように輝きながら、シンプルで高級感のあるAstroテーマ

## 🚀 特徴

- 🎨 モダンなUIデザイン
- 🔍 ローカルインデックスを自動作成、ローカルオフライン検索とAlgoliaオンライン検索をサポート
- 📱 レスポンシブデザイン、携帯電話、PCに対応
- 🌙 ダーク/ライトテーマの自動切り替え
- 🏷️ タグとカテゴリのサポート
- 📊 記事統計と著者情報の表示

## 📂 プロジェクト構造

```text
/
├── src/
│   ├── components/     # コンポーネントファイル
│   ├── content/        # コンテンツ設定
│   ├── layouts/        # レイアウトテンプレート
│   ├── pages/          # ページルート
│   └── styles/         # スタイルファイル
├── public/             # 静的リソース
└── dist/               # ビルド出力
```

## 📦 インストール

### 方法1：CLIツールで初期化

| パッケージマネージャー | 推奨コマンド |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` または `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (Yarn v2+が必要) |

>[!note]
>ユーザーが指定したフォルダにテーマを作成できるよう、`create`コマンドを提供しています

1. プロジェクトを作成：使用しているパッケージマネージャーに応じて、以下のコマンドのいずれかを選択してください：

```bash
# pnpmを使用
pnpm create astro-theme-starread my-blog

# npmを使用
npx create-astro-theme-starread my-blog

# yarnを使用
yarn create astro-theme-starread my-blog

# cnpmを使用
cnpm init astro-theme-starread my-blog
```

2. プロジェクトディレクトリに移動：

```bash
cd my-blog
```

3. 依存関係をインストール：

```bash
pnpm install
```

4. 開発サーバーを起動：

```bash
pnpm dev
```

### 方法2：`astro`テンプレートを使用してインストール

>[!warning]
>この方法はGithubリポジトリへのアクセスが必要です。ネットワーク接続を確認してください。

| パッケージマネージャー | コマンド |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### 方法3：ソースコードインストール

>[!warning]
>この方法はGithubリポジトリへのアクセスが必要です。ネットワーク接続を確認してください。

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>インストールが完了したら、開発サーバーを実行してください：
```bash
pnpm dev
```

### 方法4：既存のAstroプロジェクトに依存関係としてインストール

テーマを依存関係として既存のAstroプロジェクトにインストールし、node_modulesから直接コンポーネント、レイアウト、ページを使用できます。

1. **テーマパッケージをインストール**：

```bash
# pnpmを使用
pnpm add astro-theme-starread

# npmを使用
npm install astro-theme-starread

# yarnを使用
yarn add astro-theme-starread
```

2. **node_modulesから直接コンポーネントをインポートして使用**：

```astro
---
// node_modulesのテーマから直接コンポーネントをインポート
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>私のAstroブログ</title>
    <!-- テーマスタイルを使用する必要がある場合 -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- node_modulesのNavBarコンポーネントを使用 -->
    <NavBar />
    
    <!-- node_modulesのThemeToggleコンポーネントを使用 -->
    <ThemeToggle />
    
    <article>
      <!-- 属性付きのArticleInfoコンポーネントを使用 -->
      <ArticleInfo 
        title="私の記事"
        date="2024-01-01"
        author="著者名"
      />
      <p>記事の内容...</p>
    </article>
    
    <aside>
      <!-- サイドバーコンポーネントを使用 -->
      <AuthorWidget />
      <TagCloud />
    </aside>
  </body>
</html>
```

3. **node_modulesから直接レイアウトを使用**：

```astro
---
// node_modulesのテーマから直接レイアウトをインポート
import { article as ArticleLayout } from 'astro-theme-starread';

// node_modulesのレイアウトを適用
export const layout = ArticleLayout;

// あなたのコンテンツ
export const content = {
  title: "私のブログ記事",
  date: "2024-01-01",
  author: "著者名",
  tags: ["技術", "ブログ"]
};
---

<!-- このコンテンツはnode_modulesのレイアウトでレンダリングされます -->
<main>
  <p>これは私のブログ記事の内容です。テーマの記事レイアウトでレンダリングされます。</p>
</main>
```

## 🧞 コマンド

| コマンド | 説明 |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | 依存関係をインストール |
| `pnpm dev`               | ローカル開発サーバーを起動 `localhost:4321` |
| `pnpm preview`           | ビルド結果をローカルでプレビュー |
| `pnpm algolia`           | Algolia検索にデータをプッシュ |
| `pnpm release`           | バージョン管理（バージョン番号の更新、コミットの生成など） |

## 🔍 検索

[検索](/search)に移動

## ⚙️ カスタム設定

[カスタム設定](/configure)に移動


## 🔧 Twikooコメント

>[!tip]
>twikooを有効にする場合は、`src/compponents/Comment.astro`の13行目の`envId`をあなたの[twikoo環境アドレス](https://twikoo.js.org/backend.html)に変更してください。

```js
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.twikoo) {
      window.twikoo.init({
        envId: 'https://example.com',// あなたの環境アドレス
        el: '#tcomment',
        path: window.location.pathname
      });
    } else {
      console.error('Twikooの読み込みに失敗しました。twikooのローカル位置またはCDNアドレスを確認してください');
    }
  });
</script>
```
