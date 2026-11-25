import type { FriendsConfig } from './src/types/config';

/** Ordered friend groups. Page headings and introductory text live in content/pages/links/. */
const friends: FriendsConfig = [
  {
    title: {
      zh: '示例站点',
      en: 'Example sites',
    },
    description: {
      zh: '以下站点均为虚构样本，网址使用 example.com 占位。',
      en: 'Fictional samples with example.com placeholder URLs.',
    },
    links: [
      {
        name: 'Alpha Studio',
        description: {
          zh: '一个展示作品集的虚构站点。',
          en: 'A fictional portfolio site.',
        },
        url: 'https://example.com/alpha',
        avatar: '/images/covers/poolside.webp',
      },
      {
        name: 'Beta Journal',
        description: {
          zh: '一个用于展示长文阅读的虚构站点。',
          en: 'A fictional long-form journal.',
        },
        url: 'https://example.com/beta',
        avatar: '/images/illustrations/blue-flow.webp',
      },
      {
        name: 'Gamma Notes',
        description: {
          zh: '一个用于整理知识卡片的虚构站点。',
          en: 'A fictional collection of knowledge notes.',
        },
        url: 'https://example.com/gamma',
        avatar: '/images/covers/emerald-night.webp',
      },
    ],
  },
  {
    title: {
      zh: '主题帮助',
      en: 'Theme help',
    },
    description: {
      zh: '主题源码、使用指南与构建博客时常用的技术文档。',
      en: 'Theme source, usage guides and technical references for building a blog.',
    },
    links: [
      {
        name: {
          zh: 'BlogGPT GitHub 仓库',
          en: 'BlogGPT GitHub repository',
        },
        description: {
          zh: '主题源码、问题反馈与社区贡献。',
          en: 'Theme source, issue reports and community contributions.',
        },
        url: 'https://github.com/Raincarnator/BlogGPT',
        avatar: '/favicon.svg',
      },
      {
        name: {
          zh: 'BlogGPT 文档',
          en: 'BlogGPT documentation',
        },
        description: {
          zh: '配置、写作与部署的完整说明。',
          en: 'Complete configuration, writing and deployment guides.',
        },
        url: 'https://bloggpt.reincarnatey.net',
        avatar: '/favicon.svg',
      },
      {
        name: {
          zh: 'Astro 文档',
          en: 'Astro documentation',
        },
        description: {
          zh: 'Astro 官方文档。',
          en: 'Official Astro documentation.',
        },
        url: 'https://docs.astro.build/',
        avatar: '/images/friends/astro.png',
      },
      {
        name: 'MDN',
        description: {
          zh: '开放网页技术文档。',
          en: 'Documentation for the open web.',
        },
        url: 'https://developer.mozilla.org/',
        avatar: '/images/friends/mdn.png',
      },
    ],
  },
  {
    title: {
      zh: '图标资源',
      en: 'Icon resources',
    },
    description: {
      zh: '本项目使用的图标库，分别提供界面操作图标与社交平台标识。',
      en: 'The icon libraries used by this project for interface controls and social brands.',
    },
    links: [
      {
        name: 'Lucide',
        description: {
          zh: '主题使用的界面图标库。',
          en: 'The interface icon library used by the theme.',
        },
        url: 'https://lucide.dev/',
        avatar: '/images/friends/lucide.svg',
      },
      {
        name: 'Simple Icons',
        description: {
          zh: '社交与分享按钮使用的品牌图标库。',
          en: 'Brand icons for social and sharing buttons.',
        },
        url: 'https://simpleicons.org/',
        avatar: '/images/friends/simple-icons.svg',
      },
    ],
  },
  {
    title: {
      zh: '参考博客',
      en: 'Theme inspirations',
    },
    description: {
      zh: 'BlogGPT 在设计和构建时参考了以下博客主题。',
      en: 'BlogGPT referenced the following blog themes during its design and development.',
    },
    links: [
      {
        name: 'Stack',
        description: {
          zh: 'Hugo 的卡片式博客主题。',
          en: 'A card-based blog theme for Hugo.',
        },
        url: 'https://stack.cai.im/',
        avatar: '/images/friends/stack.png',
      },
      {
        name: 'Fuwari',
        description: {
          zh: '简洁明亮的 Astro 博客主题。',
          en: 'A clean and bright blog theme for Astro.',
        },
        url: 'https://fuwari.vercel.app/',
        avatar: '/images/friends/fuwari.png',
      },
      {
        name: 'AstroPaper',
        description: {
          zh: '注重可访问性与阅读体验的 Astro 主题。',
          en: 'An Astro theme focused on accessibility and reading.',
        },
        url: 'https://astro-paper.pages.dev/',
        avatar: '/images/friends/astropaper-author.png',
      },
    ],
  },
];

export default friends;
