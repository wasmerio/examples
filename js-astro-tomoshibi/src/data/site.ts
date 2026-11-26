import type {
  AboutConfig,
  ContactConfig,
  FooterConfig,
  HeroConfig,
  NavItem,
  SiteConfig,
  UiLabels,
} from './types'

/**
 * Site-wide copy and settings. Together with projects.ts this is the only
 * file you need to edit. Set `url` first: canonical URLs, the sitemap and
 * robots.txt are built from it and the build fails without it.
 */
export const site: SiteConfig = {
  url: 'https://example.com',
  name: 'tomoshibi',
  author: 'Your Name',
  title: 'tomoshibi - Your Name の個人サイト',
  description:
    'Your Name の個人サイト。仕事では TypeScript と PostgreSQL で業務システムを作り、個人ではブラウザだけで動く小さなツールを公開しています。作ったものの一覧と連絡先。',
  email: 'hello@example.com',
  lang: 'ja',
  ogLocale: 'ja_JP',
  links: {
    github: 'https://github.com',
    // blog: 'https://blog.example.com',
    // x: 'https://x.com',
  },
  // Any RSS 2.0 feed, e.g. 'https://blog.example.com/rss.xml'. null hides the section.
  feedUrl: null,
  person: {
    name: 'Your Name',
    alternateName: 'your-handle',
    jobTitle: 'ソフトウェアエンジニア',
  },
  // Delete this block to skip /.well-known/security.txt.
  security: {
    contact: 'mailto:hello@example.com',
    preferredLanguages: 'ja, en',
  },
}

/** Header navigation. In-page anchors first, external sites last. */
export const nav: NavItem[] = [
  { label: 'Projects', href: '/#projects', external: false },
  { label: 'About', href: '/#about', external: false },
  // { label: 'Blog', href: 'https://blog.example.com', external: true, icon: 'posts' },
  { label: 'GitHub', href: 'https://github.com', external: true, icon: 'code' },
]

export const hero: HeroConfig = {
  eyebrow: 'example.com',
  name: 'Your Name',
  handle: 'your-handle',
  lead: [
    'ソフトウェアエンジニアです。仕事では TypeScript と PostgreSQL を使った業務システムの開発を、設計から運用まで担当しています。',
    '個人では、ブラウザだけで動く小さなツールを作って公開しています。',
  ],
  actions: {
    primary: { label: '作ったものを見る', href: '#projects' },
    secondary: { label: '連絡する', href: '#contact' },
  },
  facts: [
    { label: '仕事', value: 'Web / TypeScript / PostgreSQL' },
    { label: '個人開発', value: 'PWA と CLI / TypeScript / Rust' },
    { label: '拠点', value: '東京' },
  ],
}

export const about: AboutConfig = {
  lead: [
    '2020年から Web 系の受託開発会社で、TypeScript と PostgreSQL を使った業務システムの開発に携わっています。バックエンドを中心に、フロントエンドの実装と CI の整備も担当しています。',
    '個人では、自分が困ったことを解決する小さなツールを作って公開しています。作ったものはこのサイトにまとめています。',
  ],
  next: [
    '本番運用まで通して見られる開発',
    'アクセシビリティを前提にした UI の実装',
    'OSS への継続的な貢献',
  ],
  facts: [
    { label: '言語', items: ['TypeScript', 'SQL', 'Rust'] },
    { label: 'フレームワーク', items: ['Hono', 'React', 'Astro'] },
    { label: 'データベース', items: ['PostgreSQL', 'SQLite'] },
    { label: 'テスト・CI', items: ['Vitest', 'Playwright', 'GitHub Actions'] },
    { label: 'その他', items: ['Docker', 'Terraform'] },
  ],
}

export const contact: ContactConfig = {
  heading: '仕事の相談や感想は、メールで受け付けています。',
  note: '返信には数日かかることがあります',
}

export const footer: FooterConfig = {
  tagline: 'Your Name の個人サイト',
}

/** Fixed UI strings. Swap the values to change the language of the whole site. */
export const ui: UiLabels = {
  skipToContent: '本文へ移動',
  header: { homeAria: 'ホーム', mainNavAria: 'メイン', externalNavAria: '外部リンク' },
  footer: { navAria: 'フッター', builtWith: 'Built with Astro' },
  projects: { eyebrow: 'Projects', heading: '作ったもの' },
  posts: { eyebrow: 'Blog', heading: '最近の記事', viewAll: 'ブログをすべて見る' },
  about: { eyebrow: 'About', heading: '経歴', nextHeading: '次に関わりたい領域' },
  contact: { eyebrow: 'Contact' },
  project: {
    breadcrumbAria: '現在位置',
    home: 'Home',
    projects: 'Projects',
    why: '作った理由',
    decisions: '技術的な判断',
    stack: '技術スタック',
    otherAria: '他のプロジェクト',
    prev: '← 前',
    next: '次 →',
    backToList: '← 一覧',
    toList: '一覧 →',
    listTitle: '作ったもの',
  },
  notFound: {
    title: 'ページが見つかりません',
    description: 'お探しのページは存在しないか、移動しました。',
    home: 'トップへ戻る',
    blog: 'ブログへ',
  },
}
