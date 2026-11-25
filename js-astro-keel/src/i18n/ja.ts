// Japanese UI dictionary — shipped as a reference translation alongside `en`.
// Copy this file to add your own locale; `UIStrings` makes a missing key a
// type error, so nothing can silently fall back to English.
//
// Scope is UI chrome only — see the note at the top of `en.ts`.
import type { UIStrings } from './en';

export const ja: UIStrings = {
  // Header, footer, and other chrome
  'nav.home': 'ホーム',
  'nav.about': 'プロフィール',
  'nav.works': '制作物',
  'nav.blog': 'ブログ',
  'nav.search': '検索',
  'nav.label': 'メインナビゲーション',
  'nav.brandHome': '{site} のホーム',
  'theme.toggle': '配色テーマを切り替える',
  'footer.notes': 'ノート',
  'social.label': 'ソーシャルリンク',

  // Pagination
  'pagination.label': 'ページ送り',
  'pagination.newer': '← 新しい記事',
  'pagination.older': '古い記事 →',
  'pagination.status': '{total} ページ中 {current} ページ目',

  // Home
  'home.primaryLinks': '主要リンク',
  'home.viewWorks': '制作物を見る',
  'home.readNotes': 'ノートを読む',
  'home.overviewLabel': 'テーマの概要',
  'home.latestWorksEyebrow': '最新の制作物',
  'home.allWorks': 'すべての制作物',
  'home.workTech': '{title} の使用技術',
  'home.worksEmpty':
    '<code>src/content/works</code> に制作物を追加すると、ここに最新のプロジェクトが並びます。',
  'home.latestBlogEyebrow': '最新のブログ',
  'home.allPosts': 'すべての記事',
  'home.postsEmpty':
    '<code>src/content/blog</code> に記事を追加すると、ここに最新のノートが並びます。',

  // Blog index
  'blog.title': 'ブログ',
  'blog.titlePaged': 'ブログ · {page} ページ目',
  'blog.eyebrow': 'ブログ',
  'blog.listLabel': 'ブログ記事',
  'blog.tagsEyebrow': 'タグ',
  'blog.tagsNavLabel': 'ブログのタグ',

  // Tag archive
  'tag.title': '「{tag}」タグの記事',
  'tag.titlePaged': '「{tag}」タグの記事 · {page} ページ目',
  'tag.description': '{site} の「{tag}」タグが付いたブログ記事。',
  'tag.eyebrow': 'タグ',
  'tag.lead': '「{tag}」タグにまとめたノート。',
  'tag.listLabel': '「{tag}」タグの記事',
  'tag.moreTagsEyebrow': 'ほかのタグ',
  'tag.otherTagsNavLabel': 'ほかのブログタグ',
  'tag.allPosts': 'すべての記事',

  // Blog post
  'post.eyebrow': 'ブログ',
  'post.readingTime': '約{minutes}分で読めます',
  'post.tocLabel': '目次',
  'post.contentsEyebrow': '目次',
  'post.adjacentLabel': '前後の記事',
  'post.previous': '前の記事',
  'post.next': '次の記事',
  'post.relatedEyebrow': '関連記事',
  'post.breadcrumbHome': 'ホーム',
  'post.breadcrumbBlog': 'ブログ',

  // Comments (rendered only when GISCUS.enabled)
  'comments.eyebrow': 'コメント',
  'comments.failed': 'コメントを読み込めませんでした。スレッドは {link} にあります。',
  'comments.failedLink': 'GitHub Discussions ↗',
  'comments.noscript':
    'コメントの表示には JavaScript が必要です。スレッドは GitHub Discussions にあります。',

  // Works
  'works.title': '制作物',
  'works.eyebrow': '制作物',
  'works.listLabel': '厳選した制作物',
  'work.eyebrow': '制作物',
  'work.visit': 'プロジェクトを見る',
  'work.repository': 'リポジトリを見る',
  'work.stackEyebrow': '技術構成',

  // About
  'about.title': 'プロフィール',
  'about.eyebrow': 'プロフィール',
  'about.ledgerLabel': '経歴の概要',

  // Search
  'search.title': '検索',
  'search.eyebrow': '検索',
  'search.sectionLabel': 'サイト内検索',
  'search.fallback':
    '検索インデックスはビルド時に生成されます。<code>npm run build</code> を実行し、プレビューでお試しください。開発サーバーでは利用できません。',

  // 404
  'notFound.title': 'ページが見つかりません',
  'notFound.description': 'お探しのページは存在しません。',
  'notFound.eyebrow': '404 — 見つかりません',
  'notFound.heading': 'このページは航路から外れました。',
  'notFound.lead':
    'アドレスが変わったか、はじめから存在しなかったのかもしれません。下のキールラインが、穏やかな水域へ戻る道です。',
  'notFound.linksLabel': '復帰用リンク',
  'notFound.home': 'ホームへ戻る',
  'notFound.blog': 'ブログを読む',
  'notFound.works': '制作物を見る',
};
