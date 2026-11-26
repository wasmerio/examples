---
title: 検索機能
categories: [ヘルプドキュメント]
date: 2026-06-30 12:58:33
cover: /cover/2d4cf471f4882dc2.avif
---

>この記事は私の[Vuepress 2 0から1までのナニー級上級チュートリアル — 全文検索編（Algolia、meilisearch含む）](https://blog.csdn.net/passwordgloo/article/details/134687291)から抜粋したものです



# 検索

### ローカル検索

デフォルトでローカル検索が使用され、ローカルオフラインでの使用に適しており、ユーザー設定は不要です。

### Algolia検索

>[!important]
>本番環境では環境変数方式で設定することを推奨します。コード内に機密情報が露出するのを避けるためです。

1. `starread.config.ts`を編集してAlgolia検索を選択してください

```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // 検索サービスプロバイダー: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. ルートディレクトリに`.env`ファイルを作成して編集してください。機密情報をサーバーにコミットしないでください

>[!note]
>Algolia検索には、AlgoliaアプリケーションID、検索キー、インデックス名、管理者APIキーが必要です。

>[!tip]
>Algoliaアカウントをお持ちでない場合は、先に登録してアプリケーションを作成する必要があります。チュートリアルは[Vuepress 2 0から1までのナニー級上級チュートリアル — 全文検索編（Algolia、meilisearch含む）](https://blog.csdn.net/passwordgloo/article/details/134687291)をご覧ください

```txt
PUBLIC_ALGOLIA_APP_ID=あなたのAlgoliaアプリケーションID
PUBLIC_ALGOLIA_SEARCH_KEY=あなたのAlgolia検索キー
PUBLIC_ALGOLIA_INDEX_NAME=あなたのインデックス名
ALGOLIA_WRITE_API_KEY=あなたの書き込みAPIキー（インデックスアップロード用）
```

3. インデックスをAlgoliaにプッシュ

`pnpm algolia`を実行してローカルインデックスをAlgoliaにプッシュしてください
