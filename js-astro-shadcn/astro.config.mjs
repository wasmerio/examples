// 組み込みモジュール
import { promises as fs } from 'fs';
import { URL } from 'node:url';

// 外部ライブラリ/フレームワーク
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import glob from 'fast-glob';

// プロジェクト内モジュール
import { ASSETS_URL, getCurrentAssetsUrl, getCurrentBaseUrl, getCurrentSiteUrl } from './src/lib/constants.ts';
import htmlBeautifier from './src/lib/htmlFormatter.js';
import { captureException, initSentry } from './src/lib/sentry';

// SentryをAstro起動時に初期化
initSentry();

// ビルド環境に合わせた内容を取得
const siteUrl = getCurrentSiteUrl();
const baseUrl = getCurrentBaseUrl();
const assetsUrl = getCurrentAssetsUrl();
const outDirUrl = `./dist${getCurrentBaseUrl()}`; // 最後のスラッシュは削除

// ASSETS_URLが有効な場合のアセット出力先を設定
const assetsDir = ASSETS_URL.STATUS ? new URL(assetsUrl).pathname.replace(/^\//, '') : '_astro';

export default defineConfig({
  site: process.env.PUBLIC_BASE_URL ? 'https://n-tong009.github.io' : siteUrl,
  base: process.env.PUBLIC_BASE_URL ? process.env.PUBLIC_BASE_URL : baseUrl,
  outDir: process.env.PUBLIC_BASE_URL ? './dist' : outDirUrl,
  compressHTML: false, // htmlを圧縮するか否か デフォルトでは圧縮を解除しています。
  build: {
    // スタイルシートをインライン化するかどうか
    inlineStylesheets: 'never',
    // アセットディレクトリを明示的に指定
    assets: assetsDir,
    // アセットのプレフィックスを指定
    assetsPrefix: ASSETS_URL.STATUS ? assetsUrl : undefined,
    // HTMLの圧縮を無効化し、整形されたHTMLを出力
    format: 'file',
  },
  integrations: [
    react(),
    // HTML整形プラグインを追加
    htmlBeautifier({
      parser: 'html',
      tabWidth: 2,
      useTabs: true,
      printWidth: 120,
      htmlWhitespaceSensitivity: 'css',
    }),
    {
      // ビルド後のフォルダをクリーンアップするプラグイン名
      name: 'clean-dist-folder',
      hooks: {
        // Astroビルドプロセス完了後に実行されるフック
        'astro:build:done': async ({ dir }) => {
          try {
            // 不要なシステムファイルをglobパターンで検索
            // .DS_Store: macOSのフォルダメタデータファイル
            // Thumbs.db: Windowsのサムネイルキャッシュ
            // Desktop.ini: Windowsフォルダの表示設定ファイル
            const junkFiles = await glob(`${dir.pathname}/**/{.DS_Store,Thumbs.db,Desktop.ini}`);
            console.log(`Found ${junkFiles.length} junk files to delete`);

            // 検出した不要ファイルを一つずつ削除
            for (const file of junkFiles) {
              await fs.unlink(file); // fsモジュールのunlinkメソッドでファイル削除
            }

            // macOS特有の隠しディレクトリを検索
            // __MAXCOSXディレクトリはzipファイル解凍時などに生成される不要ディレクトリ
            const macosxDirs = await glob(`${dir.pathname}/**/__MACOSX`);
            console.log(`Found ${macosxDirs.length} __MACOSX directories to delete`);

            // 検出した__MAXCOSXディレクトリを一つずつ削除
            for (const dirPath of macosxDirs) {
              // ディレクトリであることを確認してから削除処理
              const stats = await fs.stat(dirPath);
              if (stats.isDirectory()) {
                // recursive: true - ディレクトリ内のすべてのファイル・ディレクトリを再帰的に削除
                // force: true - 読み取り専用ファイルなども強制的に削除
                await fs.rm(dirPath, { recursive: true, force: true });
              }
            }

            // クリーンアップ成功メッセージを出力
            console.log('Clean-up completed successfully');
          } catch (error) {
            // エラー発生時のハンドリング
            // コンソールに詳細なエラー情報を出力
            console.error('--- Clean-up Dist Folder Error ---');
            console.error(`Error Message: ${error.message}`); // エラーメッセージ
            console.error(`Stack Trace: ${error.stack}`); // スタックトレース情報
            console.error('-----------------------------------');

            // Sentryにエラーを送信（本番環境で詳細なエラー追跡ができるよう）
            // src/lib/sentry.tsで定義されたcaptureExceptionメソッドを使用
            captureException(error);
          }
        },
      },
    },
  ],
  devToolbar: {
    enabled: false, // Astro標準搭載のツールバー表示有無
  },
  server: e => ({
    port: e.command === 'dev' ? 4000 : 4321,
    host: true, // ローカルネットワーク上の他のデバイスからもアクセス可能にしています。
    open: true, // サーバー起動時に自動的にブラウザを開くかどうかの設定
  }),
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: process.env.NODE_ENV === 'production', // コードを圧縮するかどうか
      assetsInlineLimit: 0, // 4KB以下の時に自動的にインラインで埋め込まれてしまうのを防ぐ
      rollupOptions: {
        output: {
          entryFileNames: entryInfo => {
            return `assets/js/[name].js`; // 必要に応じて.[hash]もつけれます。
          },
          // アセットファイル名のカスタマイズ（必要に応じて）
          assetFileNames: assetInfo => {
            if (ASSETS_URL.STATUS) {
              // ASSETS_URLが有効な場合、特定のパス構造を維持
              const info = assetInfo.name.split('.');
              const extType = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                return `assets/images/[name][extname]`;
              } else if (/css/i.test(extType)) {
                return `assets/css/[name]-[hash][extname]`;
              } else if (/js/i.test(extType)) {
                return `assets/js/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            } else {
              // デフォルトの出力パターン
              return `_astro/[name].[hash][extname]`;
            }
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Deprecation [legacy-js-api]が出るので対処
          api: 'modern-compiler',
          // additionalData: `@use '@/assets/stylesheets/app.scss' as app;`
        },
      },
    },
    // 本番ビルドでのみconsole、debuggerを非表示する設定
    esbuild: process.env.NODE_ENV === 'production' ? { drop: ['console', 'debugger'] } : {},
  },
});
