export type CategoryMeta = {
  slug: string;
  title: string;
  description: string;
};

function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function toTitleFromSlug(slug: string): string {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

// Customize category SEO here
const categoryMetaBySlug: Record<string, Partial<CategoryMeta>> = {
  'growth': {
    title: 'Growth',
    description: 'Frameworks and tactics for sustainable product growth.',
  },
  'engineering': {
    title: 'Engineering',
    description: 'Notes on building reliable, fast web products.',
  },
};

export function getCategoryMeta(slugOrName: string): CategoryMeta {
  const slug = toSlug(slugOrName);
  const custom = categoryMetaBySlug[slug] ?? {};
  const fallbackTitle = toTitleFromSlug(slug);
  return {
    slug,
    title: custom.title ?? fallbackTitle,
    description: custom.description ?? `${fallbackTitle} articles and notes.`,
  };
}

export function slugifyCategory(name: string): string { return toSlug(name); }

