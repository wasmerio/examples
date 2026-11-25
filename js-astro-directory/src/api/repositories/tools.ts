import type { Category, MetadataMap, SlugMap, ToolsConfig } from '../../types';
import toolsJson from '../../data/tools.json';
import metadataJson from '../../data/metadata.json';
import slugMapJson from '../../data/slug-map.json';
import categoryIndexJson from '../../data/category-index.json';

export const SITE = 'https://riseofmachine.com';
export const PER_PAGE = 24;

export interface ToolModel {
    slug: string;
    title: string;
    body: string;
    description: string;
    url: string;
    siteUrl: string;
    tag: string;
    dateAdded: string;
    ogImage: string | null;
    githubUrl: string | null;
    featured: boolean;
    category: string[];
    related: string[];
}

export interface CategoryModel {
    id: string;
    title: string;
    count: number;
}

const toolsData = toolsJson as ToolsConfig;
const metadata = metadataJson as MetadataMap;
const slugMap = slugMapJson as SlugMap;
const categoryIndex = categoryIndexJson as Record<string, { title: string; count: number }>;

// `related[]` is baked into each tool-metadata file (derived via scripts/lib/related.ts).
// Loaded by slug; the published set still comes from tools.json, so orphan files are never emitted.
const relatedModules = import.meta.glob<{ related?: string[] }>(
    '../../data/tool-metadata/*.json',
    { eager: true, import: 'default' },
);
const relatedBySlug = new Map<string, string[]>();
for (const [filePath, mod] of Object.entries(relatedModules)) {
    const slug = filePath.split('/').pop()!.replace(/\.json$/, '');
    relatedBySlug.set(slug, mod.related ?? []);
}

// Published set = tools.json (deduped by slug, first occurrence wins).
const bySlug = new Map<string, ToolModel>();
for (const category of toolsData.tools as Category[]) {
    for (const tool of category.content) {
        const slug = tool.slug;
        if (!slug || bySlug.has(slug)) continue;
        const meta = metadata[slug] ?? { slug };
        bySlug.set(slug, {
            slug,
            title: tool.title,
            body: tool.body,
            description: meta.description ?? tool.body,
            url: tool.url,
            siteUrl: `${SITE}/tools/${slug}`,
            tag: tool.tag ?? '',
            dateAdded: tool['date-added'] ?? '',
            ogImage: meta.ogImage ?? null,
            githubUrl: meta.githubUrl ?? null,
            featured: meta.featured ?? false,
            category: slugMap[slug] ?? [],
            related: [],
        });
    }
}

// Resolve related[] against the published set only, so alternatives never point at an orphan.
for (const model of bySlug.values()) {
    model.related = (relatedBySlug.get(model.slug) ?? []).filter((s) => bySlug.has(s));
}

// Deterministic order: newest first, slug as a stable tiebreaker.
const sorted = [...bySlug.values()].sort(
    (a, b) => b.dateAdded.localeCompare(a.dateAdded) || a.slug.localeCompare(b.slug),
);

const categoryList: CategoryModel[] = Object.entries(categoryIndex).map(([id, c]) => ({
    id,
    title: c.title,
    count: c.count,
}));

export function allTools(): ToolModel[] {
    return sorted;
}

export function toolBySlug(slug: string): ToolModel | undefined {
    return bySlug.get(slug);
}

export function toolsByCategory(id: string): ToolModel[] {
    return sorted.filter((t) => t.category.includes(id));
}

export function categories(): CategoryModel[] {
    return categoryList;
}

// Single freshness marker for /api/v1/index.json, derived from data (not wall-clock build time).
export function latestDate(): string {
    return sorted[0]?.dateAdded ?? '';
}
