import type { Locale } from './i18n';

export const siteConfig = {
  name: 'Astro Narrow',
  shortName: 'Astro Narrow',
  description: 'A content-focused Astro theme inspired by Hugo Narrow.',
  author: {
    name: 'Astro Narrow',
    title: {
      en: 'A clean and minimal Astro theme',
      'zh-cn': '一个干净克制的 Astro 主题'
    },
    description: {
      en: 'Writing, projects, and notes — a compact space for ideas that keep their shape.',
      'zh-cn': '写作、项目与笔记 —— 一个保持克制、注重结构感的内容空间。'
    },
    avatar: '/favicon.svg',
    social: [
      { name: 'GitHub', url: 'https://github.com/', icon: 'simple-icons:github' },
      { name: 'Email', url: 'mailto:hello@example.com', icon: 'lucide:mail' }
    ]
  },
  contentWidth: '56rem',
  ui: {
    dock: {
      enabled: true
    },
    toc: {
      // Keep the TOC panel open when the dock sits beside the article.
      // `ASTRO_TOC_PIN` overrides it at build time; a visitor's own pin toggle
      // wins from then on. Entries opt out with `toc: false` frontmatter.
      defaultPin: false
    }
  },
  // Items are either a registered route id ('posts' | 'projects' | 'archives')
  // or an inline link. Inline links accept internal paths and external URLs:
  // { label: 'Astro', href: 'https://astro.build/', icon: 'lucide:rocket' }
  // { label: { en: 'About', 'zh-cn': '关于' }, href: '/about/' }
  nav: ['posts', 'projects', 'archives'],
  home: {
    recentPosts: {
      enabled: true,
      limit: 3
    }
  },
  list: {
    pageSize: 10
  },
  comments: {
    enabled: false,
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme'
    }
  },
  analytics: {
    enabled: false,
    provider: 'umami',
    umami: {
      src: '',
      websiteId: '',
      domains: ''
    }
  },
  gallery: {
    enabled: true,
    defaultLayout: 'justified',
    gap: 10,
    targetRowHeight: 220,
    lastRowBehavior: 'center',
    columnWidth: 220,
    columns: 'auto'
  },
  lightbox: {
    enabled: true
  },
  post: {
    relatedCount: 3,
    license: {
      enabled: true,
      name: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      description:
        'This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.'
    }
  }
} satisfies {
  name: string;
  shortName: string;
  description: string;
  author: {
    name: string;
    title: Record<Locale, string>;
    description: Record<Locale, string>;
    avatar: string;
    social: Array<{ name: string; url: string; icon: string }>;
  };
  contentWidth: `${number}rem`;
  ui: {
    dock: {
      enabled: boolean;
    };
    toc: {
      defaultPin: boolean;
    };
  };
  nav: Array<string | { label: string | Record<Locale, string>; href: string; icon?: string }>;
  home: {
    recentPosts: { enabled: boolean; limit: number };
  };
  list: {
    pageSize: number;
  };
  comments: Record<string, any>;
  analytics: Record<string, any>;
  gallery: Record<string, any>;
  lightbox: Record<string, any>;
  post: Record<string, any>;
};
