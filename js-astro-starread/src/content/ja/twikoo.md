---
title: Twikooコメントシステム
cover: /cover/2ca3dc68e9893bd1.avif
categories: [ヘルプドキュメント]
date: 2026-06-30 12:58:33
---

## クラウド関数デプロイ

Twikooをホスティングするか、指定されたサイトに自分でデプロイしてください

| デプロイ方式 | 推奨度 | 説明 |
| :----------------------------------------------------------- | :----- | :----------------------------------------------------------- |
| [Tencent Cloudワンクリックデプロイ](https://twikoo.js.org/backend.html#tencent-cloudワンクリックデプロイ) | ★☆☆☆☆  | 便利ですが、従量課金環境のみをサポートしています — つまり、**ワンクリックデプロイの環境は、無料リソースが使い果たされると料金が発生します**。また、従量課金環境は年間/月額環境に切り替えることはできません。無料枠のデータベース読み取り操作は1日500回しかなく、**Twikooの運用要件をサポートできません**。 |
| [Tencent Cloud手動デプロイ](https://twikoo.js.org/backend.html#tencent-cloud手動デプロイ) | ★★☆☆☆  | Tencent Cloud CloudBase環境に手動でデプロイし、中国本土でのアクセス速度が速いです。デプロイするには環境を有料で購入する必要があります。 |
| [Tencent Cloud CLIデプロイ](https://twikoo.js.org/backend.html#tencent-cloud-cliデプロイ) | ★☆☆☆☆  | Node.jsの経験がある開発者向けです。 |
| [Vercelデプロイ](https://twikoo.js.org/backend.html#vercel-デプロイ) | ★★★☆☆  | 無料でデプロイしたいユーザーに適しており、中国本土ではアクセス速度が遅いかアクセスできない場合があります。独自のドメインをバインドするとアクセス速度を向上させることができます。 |
| [Railwayデプロイ](https://twikoo.js.org/backend.html#railway-デプロイ) | ★★☆☆☆  | 無料枠はありますが、1ヶ月間の連続運用をサポートするには不十分です。デプロイが簡単で、グローバルアクセスに適しています。 |
| [Zeaburデプロイ](https://twikoo.js.org/backend.html#zeabur-デプロイ) | ★☆☆☆☆  | Alipayまたはクレジットカードのバインドが必要です。デプロイが簡単で、中国本土からのアクセスに適しています。無料プランの環境はいつでも削除される可能性があります。 |
| [Netlifyデプロイ](https://twikoo.js.org/backend.html#netlify-デプロイ) | ★★★★☆  | 十分な無料枠があり、中国本土でのアクセス速度も良好です。 |
| [Hugging Faceデプロイ](https://twikoo.js.org/backend.html#hugging-face-デプロイ) | ★★★★☆  | 無料で、中国本土でのアクセス速度も良好です。Cloudflare Tunnelsを介したカスタムドメインを許可します。 |
| [AWS Lambdaデプロイ](https://twikoo.js.org/backend.html#aws-lambda-デプロイ) | ★★★☆☆  | 世界最大のクラウドプラットフォームで、すでにAWSフルセットを使用しているユーザーに適しています。 |
| [Cloudflare Workersデプロイ](https://twikoo.js.org/backend.html#cloudflare-workers-デプロイ) | ★★☆☆☆  | デプロイにはコマンドラインが必要で、コールドスタート時間が短く、一部の機能に制限があります。 |
| [プライベートデプロイ](https://twikoo.js.org/backend.html#プライベートデプロイ) | ★★☆☆☆  | サーバーを持っているユーザーに適しており、自分でHTTPS証明書を申請する必要があります。 |
| [プライベートデプロイ (Docker)](https://twikoo.js.org/backend.html#プライベートデプロイ-docker) | ★★★☆☆  | サーバーを持っているユーザーに適しており、自分でHTTPS証明書を申請する必要があります。 |

## フロントエンドデプロイ

👆上記のクラウド関数環境アドレスを導入するだけです

### Hexoで使用する

#### [Hexo Butterfly](https://github.com/jerryc127/hexo-theme-butterfly)テーマで使用する

[Butterflyインストール文書(4) テーマ設定-2](https://butterfly.js.org/posts/ceeb73f/#comments)を参照して設定してください

#### [Hexo Keep](https://github.com/XPoet/hexo-theme-keep)テーマで使用する

[hexo-theme-keep/_config.yml](https://github.com/XPoet/hexo-theme-keep/blob/master/_config.yml)を参照して設定してください

#### [Hexo Volantis](https://github.com/volantis-x/hexo-theme-volantis)テーマで使用する

[hexo-theme-volantis/_config.yml](https://github.com/volantis-x/hexo-theme-volantis/blob/master/_config.yml)を参照して設定してください

#### [Hexo Ayer](https://github.com/Shen-Yu/hexo-theme-ayer)テーマで使用する

[hexo-theme-ayer/_config.yml](https://github.com/Shen-Yu/hexo-theme-ayer/blob/master/_config.yml)を参照して設定してください

#### [Hexo NexT](https://github.com/next-theme/hexo-theme-next)テーマで使用する

**NexT 8以下のバージョンはまだサポートされていません**、先にNexT 8にアップグレードしてください。その後、Hexoプロジェクトルートディレクトリで実行してください

```bash
# NexTバージョン >= 8.0.0 && < 8.4.0用
npm install hexo-next-twikoo@1.0.0
# NexTバージョン >= 8.4.0用
npm install hexo-next-twikoo@1.0.3
```

次に設定に追加してください

```yaml
twikoo:
  enable: true
  visitor: true
  envId: xxxxxxxxxxxxxxx # Tencent Cloud環境はenvIdを記入; Vercel環境はアドレスを記入 (https://xxx.vercel.app)
  # region: ap-guangzhou # 環境地域、デフォルトap-shanghai、Tencent Cloud環境はap-shanghaiまたはap-guangzhouを記入; Vercel環境は記入しないでください
```

#### [Hexo Matery](https://github.com/blinkfox/hexo-theme-matery)テーマで使用する

[hexo-theme-matery/_config.yml](https://github.com/blinkfox/hexo-theme-matery/blob/develop/_config.yml)を参照して設定してください

#### [Hexo Icarus](https://github.com/ppoffice/hexo-theme-icarus)テーマで使用する

异次元de机智君💯の[Tencent Cloudをベースに、あなたのIcarusブログにTwikooコメントシステムを装備する](https://www.anzifan.com/post/icarus_to_candy_2/)を参照してください

#### [Hexo MengD](https://github.com/lete114/hexo-theme-MengD)テーマで使用する

[hexo-theme-MengD/_config.yml](https://github.com/lete114/hexo-theme-MengD/blob/master/_config.yml)を参照して設定してください

#### [hexo-theme-fluid](https://github.com/fluid-dev/hexo-theme-fluid)テーマで使用する

[設定ガイド - コメント](https://hexo.fluid-dev.com/docs/guide/#comments)を参照して設定してください

#### [hexo-theme-cards](https://github.com/ChrAlpha/hexo-theme-cards)テーマで使用する

[hexo-theme-cards/_config.yml](https://github.com/ChrAlpha/hexo-theme-cards/blob/master/_config.yml)を参照して設定してください

#### [maupassant-hexo](https://github.com/tufu9441/maupassant-hexo)テーマで使用する

[maupassant-hexo/_config.yml](https://github.com/tufu9441/maupassant-hexo/blob/master/_config.yml)を参照して設定してください

#### [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine)テーマで使用する

[Redefine公式ドキュメント #comment](https://redefine-docs.ohevan.com/docs/configuration-guide/comment#twikoo)を参照して設定してください

#### [Hexo-Theme-Solitude](https://github.com/valor-x/hexo-theme-solitude)テーマで使用する

[Solitudeドキュメント](https://solitude-docs.efu.me/comments/twikoo)を参照して設定してください

### Hugoで使用する

#### [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack)テーマで使用する

[コメント | Stack](https://stack.jimmycai.com/config/comments)と[hugo-theme-stack/config.yaml#L83](https://github.com/CaiJimmy/hugo-theme-stack/blob/master/config.yaml#L83)を参照して設定してください

#### [FixIt](https://github.com/hugo-fixit/FixIt)テーマで使用する

[入門編 - FixIt #テーマ設定](https://fixit.lruihao.cn/zh-cn/documentation/basics/#theme-configuration)と[hugo-fixit/FixIt/config.toml#L613-L624](https://github.com/hugo-fixit/FixIt/blob/8bb2a35dcc4c54fc3e0fb968df063d6be1daabf3/config.toml#L613-L624)を参照して設定してください

### VitePressで使用する

[VitePress twikoo統合参考ソリューション](https://github.com/twikoojs/twikoo/issues/715)を参照して設定してください。

### CDN経由で導入する

使用しているブログテーマがTwikooをサポートしておらず、Twikooを導入する方法がわからない場合は、ブログテーマ開発者に適応リクエストを送信できます

```html
<div id="tcomment"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js"></script>
<script>
twikoo.init({
  envId: 'あなたの環境id', // Tencent Cloud環境はenvIdを記入; Vercel環境はアドレスを記入 (https://xxx.vercel.app)
  el: '#tcomment', // コンテナ要素
  // region: 'ap-guangzhou', // 環境地域、デフォルトap-shanghai、Tencent Cloud環境はap-shanghaiまたはap-guangzhouを記入; Vercel環境は記入しないでください
  // path: location.pathname, // 異なる記事を区別するためのカスタムjsパス、記事のパスがlocation.pathnameでない場合は、このパラメータを渡す必要があります
  // lang: 'zh-CN', // コメントエリアの言語を手動で設定するために使用、サポートされている言語リスト https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
})
</script>
```

#### 異なるバージョン間の違い

- `twikoo.all.min.js`: Tencent Cloud CloudBase（tcb）を含む完全バージョン、Tencent Cloud CloudBaseを使用してデプロイする場合はこのバージョンを選択してください
- `twikoo.min.js`: Tencent Cloud CloudBase（tcb）を削除した簡易バージョン、サイズが小さく、Tencent Cloud CloudBaseでデプロイしないすべてのユーザーに適しています
- `twikoo.nocss.js`: 完全バージョンからスタイルを分離したバージョン、正常に表示するには同時に`twikoo.css`を導入する必要があり、コメントエリアのスタイルを自由に変更したいユーザーに適しています

#### CDNミラーの交換

デフォルトのCDNの読み込み速度が遅い場合は、他のCDNミラーに交換できます。以下は選択可能なパブリックCDNです。一部のCDNは最新バージョンを同期するのに数日かかる場合があります：

#### 中国での使用に推奨

- `https://registry.npmmirror.com/twikoo/1.6.44/files/dist/twikoo.min.js`
- `https://s4.zstatic.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### グローバルでの使用に推奨

- `https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js`

#### バックアップオプション

- `https://s4.zstatic.net/ajax/libs/twikoo/1.6.41/twikoo.min.js`
- `https://lib.baomitu.com/twikoo/1.6.39/twikoo.min.js`

CDNでTwikooを導入するユーザーは、今後のTwikooアップグレード時に非互換性の更新の影響を受けないよう、リンクアドレスでバージョンを固定することをお勧めします。

CDNでTwikooを導入するユーザーは、完全性を確保するためにコードに[SRI](https://developer.mozilla.org/ja/docs/Web/Security/Subresource_Integrity)を追加することをお勧めします。例：

```js
<script
  src="https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js"
  integrity="sha384-4KfOjEinLSkv1i1J8TzlkC/RTnuiLoR1OLerVgjEKoH5djYtbf7mzEFsz9p3nfuA"
  crossorigin="anonymous">
</script>
```

ここで`integrity`の値は[SRI Hash Generator](https://www.srihash.org/)で照会できます。
