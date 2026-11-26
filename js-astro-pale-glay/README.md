<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Pale Glay](https://github.com/hilava999/PaleGlay) Astro theme by hilava999, copied from commit `99032d9dcf9907116bfa19a629b03677e1f95af8` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-pale-glay.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 3 images over 300 KB to at most 1600 px wide, keeping file names and formats.
- **Environment variables:** None.
- **Credit:** theme by [hilava999](https://github.com/hilava999), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# PaleGlay
Astroで作られた、夢書きさんのための次世代・夢小説サイト用テーマです。
「隠れ家」としての安心感と、スマホからポチポチ更新できる現代の快適さを両立させました。

[🖥️デモサイトを見に行く](https://paleglay-demo.pages.dev/)

![トップページ](/doc/4.jpg)

## ✨ 特徴 (Features)

* **爆速の名前変換機能（ドリーム機能）**
クライアントサイドの localStorage を活用し、ページ遷移しても名前を保持。別タブでの変更にも自動連動します。名前登録時の「○○さま、よい夢を。」の確認モーダル付き
* **PagesCMS連携でスマホから簡単執筆**
ターミナルやGitの操作は一切不要。GitHubアカウントでPagesCMSにログインするだけで、携帯サイト感覚でスマホからサクサク小説を投稿・管理できます
* **小説の文字数を自動カウント**
本文（Markdown）から記法を自動で間引き、フロントマターで簡易文字数を自動計算して一覧に表示します
* **エモい読書環境を標準装備**
縦書き表示、フォント変更、フォントサイズ調整、カラーテーマ（ダークモード等）切り替えが最初から揃っています
* **徹底した「隠れ家」スピリッツ（デフォルト検索避け）**
メタタグ（noindex, nofollow, noarchive）、robots.txt、さらにAI学習クローラーのブロックまでデフォルトで完全装備。安心して妄想を爆発させられます
* **ミニマルな簡易ブログ（Memo）機能**
日々のつぶやきや業務連絡、拍手お返事に最適なタイムライン形式のメモ機能を搭載

## 🚀 はじめかた (Get Started)

1. 画面右上にある **[Use this template]** ボタンを押して、自分のGitHubアカウントにリポジトリをコピー（Fork）します。
2. [PagesCMS](https://pagescms.org/) にアクセスし、作成したリポジトリを連携します。
3. これだけで、ブラウザやスマホから小説の執筆がスタートできます！

※詳細なステップバイステップのマニュアルは現在整備中です。

## ✒️名前変換について
名前を変換させたい場所に \{{name}} と入力してください。

## 📷️スクリーンショット
![トップページ](/doc/4.jpg)

![トップページ](/doc/5.jpg)

![トップページ](/doc/6.jpg)

![トップページ](/doc/7.jpg)

![トップページ](/doc/8.jpg)


## 🙏 技術スタック / 使用ライブラリ
- Astro
- Astro Icon
- Pages CMS
- NovelViewerTemplate


## 📄 ライセンス (License)
This theme is released under the MIT License.

## 🛠️ 開発者情報 - Hilava
しがない絵描きです。たまに開発もします。創作とゲームとゲーム音楽が好き。  
崩壊：スターレイルの夢女（ブートヒル、刃、景元）です。

[![x](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/hilava_gkb)
[![pixiv](https://img.shields.io/badge/pixiv-0096FA?style=for-the-badge&logo=pixiv&logoColor=white)](https://www.pixiv.net/users/3337344)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hilava999)
[![Wavebox](https://img.shields.io/badge/Wavebox-6B46C1?style=for-the-badge&logo=homeassistant&logoColor=white)](https://wavebox.me/wave/6f0sa4hla3csl7op/)

## ⭐️ 最後に
かつてHTMLタグを必死に手打ちしていた世代も、新しく個人サイトを作ってみたい世代も、みんなが楽しく「自分の城」を持てるきっかけになれば嬉しいです。このテーマが皆さんの創作活動のお役に立てますように！