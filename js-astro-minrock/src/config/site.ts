/** @access public - generic open-source template config (neutral defaults only) */
/**
 * Granular Feature Flags ("Complete by default, minimalist on demand")
 *
 * All flags default to `true` when omitted.
 * Minimalist or purist technical writers can set any flag to `false`
 * to completely eliminate markup, styles, and scripts during SSG build.
 */
export interface SiteFeatures {
  /** Full-text search modal + Ctrl/Cmd+K shortcuts + header triggers */
  search?: boolean;
  /** Sticky sidebar table of contents in blog posts */
  tableOfContents?: boolean;
  /** "X min read" badge in post headers */
  readingTime?: boolean;
  /** Accessible text-to-speech audio reader in blog posts and project details */
  audioPlayer?: boolean;
  /** Tag badges in post headers, article cards, and tag clouds */
  tags?: boolean;
  /** Notion-style share modal and trigger bar in blog posts */
  socialShare?: boolean;
  /** Theme toggle dropdown (White, Cream, Slate, Midnight) */
  themeSwitcher?: boolean;
  /** Floating smooth-scroll back-to-top button */
  backToTop?: boolean;
  /** Medium-style smooth image zoom modal on click */
  imageZoom?: boolean;
  /** Interactive blog comments powered by ScatterLeaf */
  comments?: boolean;
}

export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  author: string;
  siteUrl: string;
  defaultTheme: 'white' | 'cream' | 'slate' | 'midnight';
  features?: SiteFeatures;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  navLinks: {
    title: string;
    href: string;
  }[];
  comments?: {
    enabled: boolean;
    provider: 'scatterleaf';
    repo: string;
    category?: string;
    theme?: 'auto' | 'light' | 'dark' | 'cream' | 'midnight' | 'slate' | 'white' | 'clean-white';
    lang?: string;
    broker?: string;
    clientId?: string;
    order?: 'oldest' | 'newest';
    features?: {
      reactions?: boolean;
      skinTone?: boolean;
      sorting?: boolean;
      codeScroll?: boolean;
      preview?: boolean;
      search?: boolean;
      images?: boolean;
    };
  };
}

export const siteConfig: SiteConfig = {
  title: 'Minrock',
  tagline: 'Raw ideas from your personal vault, finely polished into an ultra-fast static blog.',
  description: 'Minimalist, typography-first Astro 7 theme crafted for technical writers and Obsidian vaults. Pure SSG, zero bloat.',
  author: 'Renato Rezende',
  // Substitua pelo seu domínio de produção (usado para SEO Canônico, OpenGraph e RSS)
  // Replace with your production domain (used for Canonical SEO, OpenGraph and RSS feeds)
  // Can be overridden via environment variable (e.g. Vercel: SITE_URL=https://yourdomain.com)
  siteUrl: (typeof process !== 'undefined' && process.env?.SITE_URL) || (import.meta as any).env?.SITE_URL || 'https://minrock.vercel.app',
  defaultTheme: 'cream',
  // Granular Feature Flags — "Complete by default, minimalist on demand"
  // Toggle any feature to false to completely omit markup & scripts in static build
  features: {
    search: true,
    tableOfContents: true,
    readingTime: true,
    audioPlayer: true,
    tags: true,
    socialShare: true,
    themeSwitcher: true,
    backToTop: true,
    imageZoom: true,
    comments: true
  },
  socialLinks: {
    github: 'https://github.com/rnt-rez/minrock',
    linkedin: 'https://example.com/',
    email: 'https://example.com/'
  },
  navLinks: [
    { title: 'Home', href: '/' },
    { title: 'Blog', href: '/blog' },
    { title: 'Projects', href: '/projects' },
    { title: 'Tags', href: '/tags' },
    { title: 'About', href: '/about' }
  ],
  comments: {
    enabled: true,
    provider: 'scatterleaf',
    repo: 'rnt-rez/minrock',
    category: 'General',
    theme: 'auto',
    lang: 'auto',
    clientId: 'Iv23liZHApvnx6e6wtMJ',
    // 🍃 DEFAULT: Showcase Mode (broker: '')
    // Out of the box, broker defaults to '' (empty). ScatterLeaf runs in an interactive,
    // safe sandbox with simulated mock comments in browser memory — zero external setup,
    // zero tokens, and zero spam posted to your GitHub repository.
    //
    // 🚀 TO ENABLE LIVE DISCUSSIONS:
    // Deploy your Cloudflare Edge Broker Worker and supply its URL via the
    // PUBLIC_SCATTERLEAF_BROKER environment variable (e.g. in Vercel / Cloudflare project settings).
    broker: (typeof process !== 'undefined' && process.env?.PUBLIC_SCATTERLEAF_BROKER) || (import.meta as any).env?.PUBLIC_SCATTERLEAF_BROKER || '',
    features: {
      images: true
    }
  }
};
