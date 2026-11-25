import { defineSolitudeConfig } from './src/config';

export default defineSolitudeConfig({
  site: 'https://example.org',
  title: 'Solitude',
  description:
    'Write and create with Astro. A thoughtful home for your stories.',
  locale: 'en',
  timeZone: 'UTC',
  author: { name: 'Solitude' },
  menus: [
    {
      name: 'Library',
      icon: 'lucide:library',
      children: [
        { name: 'All posts', url: '/archives/', icon: 'lucide:folder' },
        { name: 'Categories', url: '/categories/', icon: 'lucide:copy' },
        { name: 'Tags', url: '/tags/', icon: 'lucide:tags' },
      ],
    },
    { name: 'Friends', url: '/links/', icon: 'lucide:users-round' },
    {
      name: 'Explore',
      icon: 'lucide:compass',
      children: [
        { name: 'About the theme', url: '/about/', icon: 'lucide:info' },
        { name: 'My equipment', url: '/equipment/', icon: 'lucide:monitor' },
        {
          name: 'Short updates',
          url: '/brevity/',
          icon: 'lucide:message-circle',
        },
      ],
    },
  ],
  theme: {
    loading: { fullpage: true, image: '/img/brand/profile-avatar.webp' },
    lightbox: 'fancybox',
    nav: {
      group: {
        Project: [
          {
            name: 'Astro Solitude',
            url: 'https://github.com/everfu/astro-solitude',
            icon: '/img/logo.png',
          },
        ],
      },
    },
    hometop: {
      banner: {
        title: 'Write and create with Solitude',
        desc: 'An Astro theme with guides, examples, and content components.',
      },
    },
    aside: {
      home: { noSticky: 'about', Sticky: 'allInfo' },
      post: { noSticky: 'about', Sticky: 'newestPost,allInfo' },
      page: { noSticky: 'about', Sticky: 'newestPost,allInfo' },
      my_card: {
        cover: '/img/brand/profile-portrait.webp',
        description: 'An expressive Astro theme for your personal blog.',
        content: 'Let your content take center stage.',
        witty_words: ['Capture life in words', 'Create something with code'],
        information: [
          {
            name: 'GitHub',
            url: 'https://github.com/everfu/astro-solitude',
            icon: 'simple-icons:github',
          },
          { name: 'o@efu.me', url: 'mailto:o@efu.me', icon: 'lucide:mail' },
        ],
      },
    },
    footer: {
      information: {
        left: [
          {
            name: 'GitHub',
            url: 'https://github.com/everfu/astro-solitude',
            icon: 'simple-icons:github',
          },
        ],
        right: [{ name: 'RSS', url: '/index.xml', icon: 'lucide:rss' }],
      },
      group: {
        Explore: [
          { name: 'Posts', url: '/archives/' },
          { name: 'Categories', url: '/categories/' },
        ],
        About: [
          { name: 'Theme', url: '/about/' },
          { name: 'Friends', url: '/links/' },
        ],
      },
    },
    capsule: {
      enable: true,
      id: '7298728834454061071',
      type: 'playlist',
      server: 'qishui',
    },
    post: {
      meta: { locate: false },
      covercolor: { enable: true, mode: 'local' },
    },
    brevity: { enable: true },
    keyboard: {
      enable: true,
      list: [
        { modifier: 'shift', key: 'D', action: 'toggleTheme' },
        { modifier: 'mod', key: 'F', action: 'openSearch' },
        { modifier: 'shift', key: 'K', action: 'toggleKeyboard' },
      ],
    },
    search: { tags: ['Astro', 'Solitude', 'MDX'], local: { preload: true } },
    pwa: { enable: true },
  },
});
