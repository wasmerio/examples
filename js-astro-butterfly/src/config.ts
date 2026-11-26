/**
 * Site configuration — the only file most people need to edit.
 * Everything a visitor sees that isn't a post lives here.
 *
 * Features backed by a third-party service (comments, weather, music, visitor
 * counters) switch themselves off while their key / id is empty, so a fresh
 * clone builds and runs without any account. Docs: docs/configuration.md
 */

export const site = {
  /** Production origin, no trailing slash. Used for canonical links, feed, sitemap. */
  url: 'https://example.com',
  /**
   * Sub-path the site is served from: '/' for a domain of its own, '/repo' for
   * GitHub project pages (https://user.github.io/repo/).
   */
  base: '/',
  title: 'Astro Butterfly',
  subtitle: '一个 Butterfly 风格的 Astro 博客主题',
  description: 'A Butterfly-style blog theme for Astro: fast, accessible, no build-time surprises.',
  keywords: ['博客', 'Astro', 'Butterfly'],
  author: 'Your Name',
  email: 'you@example.com',
  /** <html lang>; the UI strings are Simplified Chinese */
  lang: 'zh-CN',
  timezone: 'Asia/Shanghai',
  /** first year shown in the footer © */
  since: 2024,
  /** start of the "已运行时间" counter in the aside */
  publishDate: '2024-01-01',
  logo: '/img/favicon.svg',
  avatar: '/img/avatar.svg',
  /** default banner for pages without their own `top_img` */
  topImg: '/img/banner.svg',
  /** cover for posts without `cover` */
  defaultCover: '/img/covers/default.svg',
  error404Img: '/img/404.svg',
} as const;

export const pagination = {
  /** posts per home page */
  home: 12,
  /** archives / tags / categories */
  list: 10,
};

export type NavItem = { label: string; href?: string; icon: string; children?: NavItem[] };

/** Icons: any Iconify name from fa6-solid / fa6-regular / fa6-brands. */
export const nav: NavItem[] = [
  { label: '主页', href: '/', icon: 'fa6-solid:house' },
  { label: '归档', href: '/archives/', icon: 'fa6-solid:box-archive' },
  { label: '标签', href: '/tags/', icon: 'fa6-solid:tags' },
  { label: '分类', href: '/categories/', icon: 'fa6-solid:folder-open' },
  {
    label: '更多',
    icon: 'fa6-solid:list',
    children: [
      { label: '友链', href: '/link/', icon: 'fa6-solid:link' },
      { label: '关于', href: '/about/', icon: 'fa6-solid:heart' },
    ],
  },
  { label: '留言板', href: '/comments/', icon: 'fa6-solid:comment-dots' },
];

/** Round icons under the author card. `color` is the hover background. */
export const social = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'fa6-brands:github', color: '#4078c0' },
  { label: 'Email', href: 'mailto:you@example.com', icon: 'fa6-solid:envelope', color: '#39c7f3' },
  { label: 'RSS', href: '/atom.xml', icon: 'fa6-solid:rss', color: '#d68650' },
];

export const aside = {
  followMe: { text: 'Follow Me', href: 'https://github.com/', icon: 'fa6-brands:github' },
  /** HTML allowed */
  announcement: '欢迎来到 <span class="hl-label">Astro Butterfly</span>！这是一段公告，在 <code>src/config.ts</code> 里修改。',
  recentPosts: 5,
  categories: 8,
  tags: 30,
  archives: 8,
};

/**
 * Aside clock (successor of hexo-butterfly-clock). The clock itself needs nothing;
 * the weather line appears once `qweatherKey` is set.
 *
 * Location = the visitor's own public IP, looked up from their browser, in order:
 *   amap  — Amap IP API: mainland-China IPs only, Chinese city names (needs `amapKey`)
 *   ipwho — ipwho.is: worldwide, no key (free for non-commercial sites)
 *   ipsb  — api.ip.sb/geoip: worldwide, no key
 * QWeather GeoAPI then names the place in Chinese (日本·东京) and "weather now"
 * works worldwide. Both are public browser keys: restrict them to your domain in
 * each console. If your QWeather account has its own API host, put it in
 * `qweatherHost` / `geoHost`.
 */
export const clock = {
  enable: true,
  /** Optional weather Worker endpoint, e.g. '/api/weather/local'. */
  weatherEndpoint: '',
  amapKey: '',
  qweatherKey: '',
  qweatherHost: 'devapi.qweather.com',
  geoHost: 'geoapi.qweather.com',
  ipLookup: ['amap', 'ipwho', 'ipsb'] as const,
  /** used when every lookup fails (or always, with `fixedLocation`) */
  fallback: { city: '杭州市', location: '120.155070,30.274085' },
  fixedLocation: false,
  /** minutes the weather is reused; the location is kept 6 hours */
  cacheMinutes: 30,
};

/** Twikoo (https://twikoo.js.org). Empty envId = no comment box, no "最新评论" card. */
export const comments = {
  twikoo: { envId: '' },
  newest: 5,
};

/**
 * Floating APlayer, fed by a Meting API. Off until you set a playlist id.
 * The default API is a free public instance; self-host one
 * (https://github.com/injahow/meting-api) for anything serious.
 */
export const music = {
  global: { id: '', server: 'netease', type: 'playlist' },
  api: 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r',
};

/**
 * A post's "updated" date is the later of its front matter `updated:` and the last
 * git commit that touched it, so it never needs maintaining by hand. Commits that
 * only reformat or migrate posts go in .git-blame-ignore-revs. Docs: docs/writing.md
 */
export const dates = {
  /**
   * Ignore git history before this ISO date. Leave empty for a blog that started
   * here; set it to the move date when importing posts from Hexo or elsewhere.
   */
  gitSince: '',
};

/** Atom feed at /atom.xml (all posts, newest first). */
export const feed = {
  /**
   * Origin used in entry <id>s. Leave empty. Set it only when moving a blog whose old
   * feed used a different origin (e.g. Hexo `url: http://example.com`), so subscribers
   * don't see every post again. See docs/migrate-from-hexo.md.
   */
  idOrigin: '',
};

export const copyright = {
  license: 'CC BY-NC-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
};

/** Guestbook envelope (a page with `type: envelope`), after hexo-butterfly-envelope. */
export const envelope = {
  cover: '/img/envelope/violet.jpg',
  line: '/img/envelope/line.png',
  before: '/img/envelope/before.png',
  after: '/img/envelope/after.png',
  message: ['有什么想问的？', '有什么想说的？', '有什么想吐槽的？', '哪怕是有什么想吃的，都可以告诉我哦~'],
  bottom: '自动书记人偶竭诚为您服务！',
};

/** shields.io badges in the footer; an empty array hides the row */
/** Footer badges. `width` is the badge's width at 20px high (open the image to read it); it reserves the space before the image loads. */
export const footerBadges: { href: string; title: string; img: string; width?: number }[] = [
  { href: 'https://astro.build/', title: '博客框架为 Astro', img: 'https://img.shields.io/badge/Frame-Astro-ff5d01?style=flat&logo=astro', width: 101 },
  { href: 'https://github.com/nova1751/astro-butterfly', title: '本站主题为 Astro Butterfly', img: 'https://img.shields.io/badge/Theme-Astro%20Butterfly-49b1f5?style=flat&logo=astro&logoColor=white', width: 155 },
  { href: 'https://creativecommons.org/licenses/by-nc-sa/4.0/', title: '本站采用 CC BY-NC-SA 4.0 许可协议', img: 'https://img.shields.io/badge/Copyright-BY--NC--SA%204.0-d42328?style=flat&logo=Claris', width: 167 },
];

/** Optional effects carried over from Butterfly. */
export const features = {
  /** "this post may be outdated" notice after N days (0 = off) */
  outdatedNoticeDays: 365,
  /** activate_power_mode: sparks from the caret while typing */
  powerMode: { enable: true, colorful: true, shake: false, mobile: false },
  /** Use { endpoint: 'https://stats.example.com/api/count' } for self-hosted statistics. */
  busuanzi: false as boolean | 'busuanzi.cc' | { endpoint: string },
  /** Simplified ⇄ Traditional button in the rightside panel (content is Simplified) */
  translate: true,
  /** alt text shown as a caption under images */
  photoCaption: true,
};
