import type { Project } from './types'

/**
 * Side projects, newest first. Each entry becomes a card on the home page
 * and a page at /projects/<slug>/. Screenshots are 1600×900 WebP files in
 * public/screenshots/.
 */
export const projects: Project[] = [
  {
    slug: 'sample-one',
    status: '公開中',
    kind: 'PWA',
    title: 'Pocket Timer',
    summary: 'オフラインでも動く、作業用の小さなタイマー',
    tech: ['TypeScript', 'Web Audio API', 'Service Worker'],
    why: [
      '作業の区切りに使うタイマーが欲しかったのですが、既存のアプリは通知や同期など使わない機能が多く、起動も遅く感じていました。ブラウザで開いてすぐ使えて、電波の無い場所でも動くものを自分で作りました。',
    ],
    decisions: [
      'フレームワークを使わず、TypeScript と DOM API だけで実装しました。画面が 1 つしかないので、状態管理の層を足す理由がありませんでした。',
      '終了音は音声ファイルを同梱せず、Web Audio API で生成しています。キャッシュする資産がアプリ本体だけになり、オフライン対応が単純になりました。',
      'タイマーの残り時間は端末内の localStorage に保存し、タブを閉じても再開できるようにしました。サーバーは持っていません。',
    ],
    techGroups: [
      { label: '言語', items: ['TypeScript'] },
      { label: 'UI', items: ['DOM API', 'CSS'] },
      { label: '外部API', items: ['Web Audio API', 'Service Worker'] },
      { label: 'ビルド・配布', items: ['Vite', 'vite-plugin-pwa'] },
      { label: 'テスト・品質', items: ['Vitest', 'Biome', 'GitHub Actions'] },
    ],
    screenshot: {
      src: '/screenshots/sample-one.webp',
      alt: 'Pocket Timer の画面。黒い背景の中央に残り時間が大きく表示されている',
    },
    link: { label: 'timer.example.com', href: 'https://timer.example.com' },
  },
  {
    slug: 'sample-two',
    status: '公開中',
    kind: 'CLI',
    title: 'notes',
    summary: 'Markdown のメモを日付ごとに整理して検索するコマンドラインツール',
    tech: ['Rust', 'SQLite'],
    why: [
      'メモを Markdown で書き溜めていましたが、ファイルが増えると目的のメモを探すのに時間がかかるようになりました。エディタを開かずに、ターミナルから全文検索できるツールを作りました。',
    ],
    decisions: [
      '検索の索引は SQLite の FTS5 で作っています。外部のサービスやデーモンを動かさずに済み、索引ファイルを消せば元に戻せます。',
      'メモの保存形式は変えず、ファイル名から日付を読み取るだけにしました。既存のメモをそのまま使えて、ツールをやめても何も失いません。',
      '配布は GitHub Releases に置いた単一バイナリだけです。インストール手順を短くするためで、パッケージマネージャへの登録はしていません。',
    ],
    techGroups: [
      { label: '言語', items: ['Rust'] },
      { label: 'データベース', items: ['SQLite (FTS5)'] },
      { label: 'ビルド・配布', items: ['cargo', 'GitHub Releases'] },
      { label: 'テスト・品質', items: ['cargo test', 'clippy', 'GitHub Actions'] },
    ],
    screenshot: {
      src: '/screenshots/sample-two.webp',
      alt: 'ターミナルで notes search を実行し、日付付きの検索結果が 3 件表示されている',
    },
    link: { label: 'example.com/notes', href: 'https://example.com/notes' },
  },
]
