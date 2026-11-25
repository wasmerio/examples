import type { AboutData } from '@/types/about';

const about = {
  title: 'About Solitude',
  sections: [
    {
      type: 'intro',
      greeting: 'Hello, welcome to Solitude',
      name_prefix: 'This is',
      name: 'Solitude',
      description: 'An Astro theme for stories and ideas.',
      pursuit: {
        label: 'Our focus',
        lines: ['Make room', 'for your story'],
        rotating_words: ['Fast', 'Reliable', 'Native', 'Extensible'],
      },
    },
    {
      type: 'skills_career',
      skills: {
        label: 'The toolkit',
        title: 'From words to pages',
        items: [
          {
            name: 'Astro',
            icon: 'lucide:zap',
            color: '#ff4088',
          },
          {
            name: 'Astro Components',
            icon: 'lucide:code',
            color: '#00add8',
          },
          {
            name: 'TypeScript',
            icon: 'simple-icons:typescript',
            color: '#3178c6',
          },
          {
            name: 'CSS',
            icon: 'simple-icons:css',
            color: '#264de4',
          },
          {
            name: 'Markdown',
            icon: 'simple-icons:markdown',
            color: '#111827',
          },
          {
            name: 'Vite',
            icon: 'lucide:settings',
            color: '#7c3aed',
          },
          {
            name: 'Taxonomies',
            icon: 'lucide:tags',
            color: '#16a34a',
          },
          {
            name: 'Search',
            icon: 'lucide:search',
            color: '#f59e0b',
          },
          {
            name: 'RSS',
            icon: 'lucide:rss',
            color: '#f26522',
          },
          {
            name: 'Accessibility',
            icon: 'lucide:accessibility',
            color: '#8b5cf6',
          },
          {
            name: 'Performance',
            icon: 'lucide:gauge',
            color: '#059669',
          },
          {
            name: 'Git',
            icon: 'simple-icons:git',
            color: '#f05032',
          },
        ],
      },
      career: {
        label: 'The journey',
        title: 'Always evolving',
        summary: [
          {
            name: '2023, Solitude demo',
            color: '#425aef',
          },
          {
            name: '2026, Native Astro',
            color: '#ff4088',
          },
          {
            name: 'Today, growing together',
            color: '#16a34a',
          },
        ],
        timeline: {
          start: 2023,
          end: 2027,
          start_label: 2023,
          end_label: 'Next',
          track_label: 'SOLITUDE',
          aria_label:
            'Solitude timeline from the original demo to a native Astro theme',
          events: [
            {
              label: 'First demo',
              from: 2023,
              to: 2025,
              color: '#425aef',
            },
            {
              label: 'Move to Astro',
              from: 2025,
              to: 2026,
              color: '#ff4088',
            },
            {
              label: 'Keep improving',
              from: 2026,
              to: 2027,
              color: '#16a34a',
            },
          ],
        },
      },
    },
    {
      type: 'personality_photo',
      personality: {
        label: 'Personality',
        title: 'Protagonist',
        type: 'ENFJ-A',
        color: '#56ad83',
        image: '/img/demo/about/personality-enfj-v2.png',
        image_alt: 'Low-poly illustration of a protagonist holding a sword',
        link: {
          text: 'Explore the Protagonist profile',
          url: 'https://www.16personalities.com/enfj-personality',
          external: true,
        },
      },
      photo: {
        image: '/img/brand/creative-space.webp',
        alt: 'Paper-cut creative workspace with a notebook and paper airplane',
        badge: '/img/brand/paper-plane-badge.webp',
      },
    },
    {
      type: 'values',
      motto: {
        label: 'A little motto',
        prefix: 'Stay curious.',
        content: 'Keep creating.',
      },
      expertise: {
        label: 'What we do',
        prefix: 'Built for',
        specialist: 'great reading',
        content: 'Thoughtful',
        level: 'details',
      },
    },
    {
      type: 'interests',
      items: [
        {
          variant: 'game',
          label: 'Off the clock',
          title: 'League of Legends',
          background: '/img/demo/about/game-aram-v2.webp',
          mode: {
            name: 'ARAM',
            tooltip: 'All Random All Mid',
            image: '/img/demo/about/mode-aram-v2.webp',
          },
          heroes: [
            {
              name: 'Twitch',
              image: '/img/demo/about/hero-twitch-v2.webp',
            },
            {
              name: 'Neeko',
              image: '/img/demo/about/hero-neeko-v2.webp',
            },
            {
              name: 'Hwei',
              image: '/img/demo/about/hero-hwei-v2.webp',
            },
            {
              name: 'Mel',
              image: '/img/demo/about/hero-mel-v2.webp',
            },
            {
              name: 'Smolder',
              image: '/img/demo/about/hero-smolder-v2.webp',
            },
            {
              name: 'Aurelion Sol',
              image: '/img/demo/about/hero-aurelion-sol-v2.webp',
            },
          ],
          right_text: 'One more game',
          right_tip: 'A few favorite champions for a quick match',
        },
        {
          variant: 'media',
          label: 'On repeat',
          title_lines: ['Rap, folk,', 'and pop'],
          subtitle: 'A soundtrack for an afternoon of writing',
          background: '/img/demo/about/music-listening-v2.webp',
          button: {
            text: 'Explore more',
            url: '/archives/',
            icon: 'lucide:circle-chevron-right',
            external: false,
          },
        },
      ],
    },
    {
      type: 'story',
      label: 'Our story',
      title: 'Why Solitude?',
      content: `Solitude is a place to collect ideas and tell stories at your own pace. Each post deserves a clear structure, comfortable reading, and a home where it can be found again.

The Astro edition keeps the familiar visual style while using content collections, Astro components, and a static build pipeline. Node.js powers development and builds; the generated website can be served by a static host.

This demo is a working starting point. Replace its stories and sample profile with your own, then explore the homepage, posts, friends, equipment, and short updates. Comments and online music are available when you choose to configure them.

Solitude keeps improving around **reading, accessibility, performance, and long-term maintenance**. The features are here to support what you want to share.
`,
    },
  ],
} satisfies AboutData;

export default about;
