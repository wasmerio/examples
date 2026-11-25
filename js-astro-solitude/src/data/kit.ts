import type { KitData } from '@/types/page-data';

const kit = {
  groups: [
    {
      name: 'Creative tools',
      description: 'Sample equipment to replace with your own everyday tools.',
      items: [
        {
          name: 'Laptop',
          specification: 'Portable workstation',
          description: 'Write code, organize photos, and capture ideas.',
          image: '/img/demo/cover-getting-started-v2.webp',
          link: 'https://astro.build/',
        },
        {
          name: 'E-reader',
          specification: 'Everyday reading',
          description: 'Read, reflect, and keep the ideas worth revisiting.',
          image: '/img/demo/cover-pagination-v2.webp',
        },
      ],
    },
  ],
} satisfies KitData;

export default kit;
