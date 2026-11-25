import type { LinksData } from '@/types/page-data';

const links = {
  links: [
    {
      class_name: 'Official resources',
      class_desc: 'Documentation, source code, and updates',
      type: 'card',
      link_list: [
        {
          name: 'Astro Docs',
          link: 'https://docs.astro.build/',
          avatar: '/img/logo.png',
          topimg: '/img/demo/cover-getting-started-v2.webp',
          descr: 'Official Astro documentation',
          tag: 'Docs',
        },
        {
          name: 'Solitude GitHub',
          link: 'https://github.com/everfu/astro-solitude',
          avatar: '/img/logo.png',
          topimg: '/img/demo/cover-shortcodes-v2.webp',
          descr: 'Theme source, changes, and issue tracking',
          tag: 'Source',
        },
      ],
    },
    {
      class_name: 'Built with',
      class_desc: 'Open tools behind Astro Solitude',
      type: 'item',
      link_list: [
        {
          name: 'Astro',
          link: 'https://astro.build/',
          avatar: '/img/logo.png',
          descr: 'A fast, flexible site builder',
        },
        {
          name: 'TypeScript',
          link: 'https://www.typescriptlang.org/',
          avatar: 'https://www.typescriptlang.org/favicon-32x32.png',
          descr: 'Typed browser interactions',
        },
      ],
    },
  ],
} satisfies LinksData;

export default links;
