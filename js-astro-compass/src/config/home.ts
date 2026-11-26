export const home = {
  hero: {
    eyebrow: 'Compass documentation',
    title: 'How can we help?',
    description: 'Guides, references, and answers for setting up, writing, and publishing your docs.',
    placeholder: 'Search the docs...',
  },
  /** The chips under the hero search and the suggestions shown before anyone types. */
  popular: {
    label: 'Popular',
    categories: ['start-here'],
    limit: 4,
  },
  recent: {
    title: 'Recently updated',
    description: 'The latest changes across every section.',
    limit: 5,
  },
  /** The closing band. Remove an action to drop its button. */
  support: {
    title: "Can't find what you need?",
    description: 'Open an issue on GitHub or browse the starter guides to find your way around.',
    actions: [
      { label: 'Open an issue', href: 'https://github.com/xocothemes/compass/issues', variant: 'primary' },
      { label: 'Start here', href: '/getting-started/start-here', variant: 'secondary' },
    ],
  },
} as const;
