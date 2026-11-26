<div align="center">
 <img src="/public/logo.png" alt="starread" border="0">
  <p>
     <img src="https://img.shields.io/npm/v/astro-theme-starread?logo=npm" alt="NPM Version">
    <img src="https://img.shields.io/npm/dy/astro-theme-starread?logo=npm&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fastro-theme-starread
" alt="NPM Downloads">
    <img src="https://img.shields.io/github/last-commit/passwordgloo/astro-theme-starread?logo=github&labelColor=purple&link=https%3A%2F%2Fgithub.com%2Fpasswordgloo%2Fastro-theme-starread
" alt="Last Commit">
    <img src="https://img.shields.io/github/v/tag/passwordgloo/astro-theme-starread?logo=git" alt="GitHub Tag">
    <img src="https://img.shields.io/github/license/passwordgloo/astro-theme-starread?logo=github" alt="License">
</p>
  🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMECN.md">中文文档</a> | 
  🇯🇵 日本語ドキュメント | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>

# Star Read - Astroブログテーマ

>星のように輝き、简洁かつ高級感のあるAstroテーマです

## 🚀 特徴

- 🎨 現代的なUIデザインです
- 🔍 自働的にローカルインデックスを作成し、ローカルオフライン検索とAlgoliaネット検索をサポートします。
- 📱レスポンシブデザインで携帯電話やPCにも対応します
- 🌙 ダーク/パステルカラーのテーマが自働的に切り替えられます
− 🏷️ ラベルと分類支持
- 📊 記事の統計と著者情報を表示します。

## 📂 プロジェクト構造

```text
/
├── src/
│   ├── components/     # コンポーネントファイル
│   ├── content/        # コンテンツ設定
│   ├── layouts/        # レイアウトテンプレート
│   ├── pages/          # ページルート
│   └── styles/         # スタイルファイル
├── public/             # 静的資産
└── dist/               # ビルド出力
```

## 📦 インストール

### 方法1：CLIツールを介して初期化

| パッケージマネージャー | 推奨コマンド                                  |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` または `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init`（Yarn v2+ が必要） |

>[!note]
>`create`コマンドを提供しており、ユーザーが指定したフォルダにテーマを作成することができます

1. プロジェクトの作成： 使用しているパッケージマネージャーに応じて、以下のコマンドのいずれかを選択してください：

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

2. プロジェクトディレクトリに入る：

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
>この方法ではGithubリポジトリへのアクセスが必要です。ネットワーク接続が正常であることを確認してください。

| パッケージマネージャー | コマンド                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### 方法3：ソースコードからインストール

>[!warning]
>この方法ではGithubリポジトリへのアクセスが必要です。ネットワーク接続が正常であることを確認してください。

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>インストールが完了したら、開発サーバーを実行します：
```bash
pnpm dev
```

### 方法4：既存の Astro プロジェクトに依存関係としてインストール

テーマを既存の Astro プロジェクトに依存関係としてインストールし、node_modules から直接コンポーネント、レイアウト、ページを使用することができます。

1. **テーマパッケージをインストール**：

```bash
# pnpm を使用
pnpm add astro-theme-starread

# npm を使用
npm install astro-theme-starread

# yarn を使用
yarn add astro-theme-starread
```

2. **node_modules から直接コンポーネントをインポートして使用**：

```astro
---
// node_modules のテーマからコンポーネントを直接インポート
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>私の Astro ブログ</title>
    <!-- テーマのスタイルを使用する場合 -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- node_modules の NavBar コンポーネントを使用 -->
    <NavBar />
    
    <!-- node_modules の ThemeToggle コンポーネントを使用 -->
    <ThemeToggle />
    
    <article>
      <!-- 属性を持つ ArticleInfo コンポーネントを使用 -->
      <ArticleInfo 
        title="私の記事"
        date="2024-01-01"
        author="作者名"
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

3. **node_modules から直接レイアウトを使用**：

```astro
---
// node_modules のテーマからレイアウトを直接インポート
import { article as ArticleLayout } from 'astro-theme-starread';

// node_modules からのレイアウトを適用
export const layout = ArticleLayout;

// コンテンツ
export const content = {
  title: "私のブログ記事",
  date: "2024-01-01",
  author: "作者名",
  tags: ["技術", "ブログ"]
};
---

<!-- このコンテンツは node_modules のレイアウト内でレンダリングされます -->
<main>
  <p>これは私のブログ記事の内容です。テーマの記事レイアウト内でレンダリングされます。</p>
</main>
```

## 🧞 コマンド

| コマンド                 | 説明                                           |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | 依存関係をインストール                           |
| `pnpm dev`               | ローカル開発サーバー `localhost:4321` を起動する |
| `pnpm preview`           | ローカルでビルド結果をプレビューする               |
| `pnpm algolia`           | データをAlgolia検索にプッシュする                  |
| `pnpm release`           | バージョン管理（バージョン番号の更新、コミットの生成など） |

## 🔍 検索

### ローカル検索

デフォルトはローカルサーチを使用して、ローカル端のオフライン使用に適して、ユーザーの配置が必要ありません。

### Algolia検索

>[!important]
>本番環境では、コードに機密情報が公開されないように、環境変数による設定を推奨します。

1. `starread.config.ts`を編集してAlgolia検索を選択します
```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // 検索サービスプロバイダー: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. ルートディレクトリに`.env`ファイルを作成して編集します

>[!note]
>Algolia検索には、AlgoliaアプリケーションID、検索キー、インデックス名、および管理者APIキーが必要です。

>[!tip]
>Algoliaアカウントをお持ちでない場合は、先に登録してアプリケーションを作成する必要があります。

```txt
PUBLIC_ALGOLIA_APP_ID=あなたのAlgoliaアプリケーションID
PUBLIC_ALGOLIA_SEARCH_KEY=あなたのAlgolia検索キー
PUBLIC_ALGOLIA_INDEX_NAME=あなたのインデックス名
ALGOLIA_WRITE_API_KEY=あなたの書き込みAPIキー（インデックスアップロード用）
```

3. インデックスをAlgoliaにプッシュします

`pnpm algolia`を実行してローカルインデックスをAlgoliaにプッシュします

## ⚙️ カスタム設定

ルートディレクトリの`starread.config.ts`ファイルを編集することで、ウェブサイトのタイトル、ナビゲーションメニュー、作者情報、サイドバーコンポーネントの表示など、テーマ設定をカスタマイズできます。

設定例：
```typescript
// ウェブサイトのタイトルを変更
site: {
  title: '私のブログ',
  // ...その他の設定
}

// ナビゲーションメニューをカスタマイズ
nav: [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  // ...その他のメニュー項目
]
```

## 🔧 Twikooコメント設定

Twikooコメントシステムを有効にするには、`src/components/Comment.astro`ファイルの13行目の`envId`の値をあなたの[Twikoo環境アドレス](https://twikoo.js.org/backend.html)に変更してください。

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
      console.error('Twikooのロードに失敗しました。Twikooのローカル位置またはCDNアドレスを確認してください');
    }
  });
</script>
```