export const docsParentCategories = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    description: 'Set up Compass, learn the content model, and publish your first docs updates.',
  },
  {
    slug: 'integrations',
    name: 'Integrations',
    description: 'Extend Compass with analytics, editorial systems, and optional tools around your docs workflow.',
  },
] as const;

/** `icon` is a file name from `src/icons/lucide`. */
export const docsCategories = [
  {
    name: 'Start Here',
    slug: 'start-here',
    parent: 'getting-started',
    description: 'Install the project, understand the file structure, and shape your first publishing workflow.',
    icon: 'rocket',
  },
  {
    name: 'Compass Docs',
    slug: 'compass-docs',
    parent: 'getting-started',
    description: 'Manage article collections, sidebar structure, and search-friendly content patterns.',
    icon: 'book-open',
  },
  {
    name: 'Components',
    slug: 'components',
    parent: 'getting-started',
    description: 'Build reusable callouts, headings, and content blocks that make docs feel polished and consistent.',
    icon: 'blocks',
  },
  {
    name: 'Channels & Apps',
    slug: 'channels-and-apps',
    parent: 'integrations',
    description: 'Cover analytics, CMS-backed editing, embedded support surfaces, and other tools around your docs.',
    icon: 'plug',
  },
] as const;
