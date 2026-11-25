export type TagMeta = {
  slug: string;
  title: string;
  description: string;
};

function toTitleCaseFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

// Customize specific tags here as needed
const tagMetaBySlug: Record<string, Partial<TagMeta>> = {
  astro: {
    title: 'Astro',
    description: 'Posts about building fast, content-focused sites with Astro.',
  },
};

export function getTagMeta(slug: string): TagMeta {
  const baseTitle = toTitleCaseFromSlug(slug);
  const custom = tagMetaBySlug[slug] ?? {};
  return {
    slug,
    title: custom.title ?? `#${baseTitle}`,
    description: custom.description ?? `Articles tagged ${baseTitle}.`,
  } as TagMeta;
}


