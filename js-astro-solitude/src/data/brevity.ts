import type { BrevityData } from '@/types/page-data';

const brevity = {
  items: [
    {
      date: '2026-08-25 10:00:00+08:00',
      content:
        'The Astro Solitude demo now uses native Astro content. Explore the guides and make it your own.',
      location: 'Project repository',
      image: ['/img/demo/cover-getting-started-v2.webp'],
    },
    {
      date: '2026-08-23 10:00:00+08:00',
      content:
        'About, friends, equipment, and short updates are all managed with local data files.',
      location: 'exampleSite',
      link: '/p/components/',
    },
    {
      date: '2026-08-21 10:00:00+08:00',
      content:
        'The homepage, posts, taxonomies, search index, and assets now run on Astro.',
      location: 'hugo',
      image: ['/img/demo/cover-legacy-url-v2.webp'],
    },
    {
      date: '2023-04-20 00:00:00+08:00',
      content:
        'The Solitude demo started collecting features, configuration examples, and practical notes.',
      location: 'Solitude',
    },
  ],
} satisfies BrevityData;

export default brevity;
