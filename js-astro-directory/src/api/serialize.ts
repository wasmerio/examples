import type { ToolModel } from './repositories/tools';

// Explicit allowlist — responses are built by picking these keys, never by spreading the record,
// so a future internal field in metadata.json / tool-metadata can't silently leak.
const SUMMARY_FIELDS = [
    'slug',
    'title',
    'description',
    'url',
    'siteUrl',
    'tag',
    'dateAdded',
    'ogImage',
    'githubUrl',
    'category',
    'featured',
] as const;

const FULL_FIELDS = [...SUMMARY_FIELDS, 'body', 'related'] as const;

export type ToolSummary = Pick<ToolModel, (typeof SUMMARY_FIELDS)[number]>;
export type ToolFull = Pick<ToolModel, (typeof FULL_FIELDS)[number]>;

function pick<T extends object, K extends readonly (keyof T)[]>(
    source: T,
    keys: K,
): Pick<T, K[number]> {
    const out = {} as Pick<T, K[number]>;
    for (const key of keys) out[key] = source[key];
    return out;
}

export function summary(tool: ToolModel): ToolSummary {
    return pick(tool, SUMMARY_FIELDS);
}

export function full(tool: ToolModel): ToolFull {
    return pick(tool, FULL_FIELDS);
}
