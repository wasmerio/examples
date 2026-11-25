import type { Config } from '@type/config';

const config: Config = {
  title: '✍️ Kani Nayuta',
  author: 'Kani Nayuta',
  avatar: '/assets/images/avatar.png',
  description:
    'Genius Light Novelist | Author of "The Landscape Series" | Operating principle: 100% Love for Itsuki Hashima',
  site_url: 'https://nayuta.kani.dev',
  theme: 'nayuta',
  since: '2024-01-01',
  postsPerPage: 10,
  copyright: { enabled: true, license: 'CC BY-NC-SA 4.0' },
  links: [
    {
      text: 'Posts',
      url: '/posts',
      icon: {
        type: 'icon',
        name: 'fa-solid fa-file-lines',
      },
    },
    {
      text: 'Friends',
      url: '/friend',
      icon: {
        type: 'icon',
        name: 'fa-solid fa-users',
      },
    },
    {
      url: 'https://twitter.com/imotosae_anime',
      target: '_blank',
      ariaLabel: 'Twitter / X',
      iconOnly: true,
      icon: {
        type: 'icon',
        name: 'fa-brands fa-x-twitter',
      },
    },
    {
      url: 'https://imotosae.com',
      target: '_blank',
      ariaLabel: 'Official GF Bunko / Imoutosae Portal',
      iconOnly: true,
      icon: {
        type: 'svg',
        raw: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>',
      },
    },
  ],
};

export default config;
