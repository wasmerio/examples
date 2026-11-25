import type { UserConfig } from './types'

export const defaultConfig: UserConfig = {
  title:       'Patrika',
  description: 'A field notebook, kept in the open',
  url:         'https://example.com',
  locale:      'en',

  author: {
    name: 'Your Name',
  },

  navigation: [
    { title: 'Essays',  url: '/posts' },
    { title: 'Notes',   url: '/notes' },
    { title: 'Archive', url: '/archive' },
    { title: 'About',   url: '/about' },
  ],

  footerLinks: [
    { title: 'Now',      url: '/now' },
    { title: 'Colophon', url: '/colophon' },
    { title: 'RSS',      url: '/rss.xml' },
  ],

  social: [],

  heroText:     'A field notebook, kept in the open',
  tagline:      'attention · craft · slowness',
  postsPerPage: 10,
  recentPosts:  5,
  showLogo:     false,

  // Generic, no assumed keys — real indexes are configured per-site (see config.yaml).
  browse: {
    years:   true,
    indexes: [],
  },
}