import type { PageLinks, PageMeta } from './pagination';

export interface Collection<T> {
    data: T[];
    meta: PageMeta;
    links: PageLinks;
}

export interface Resource<T> {
    data: T;
}

export function collection<T>(data: T[], meta: PageMeta, links: PageLinks): Collection<T> {
    return { data, meta, links };
}

export function resource<T>(data: T): Resource<T> {
    return { data };
}

// Minified JSON for machine consumers; charset pinned so nosniff can't be worked around.
export function json(body: unknown): Response {
    return new Response(JSON.stringify(body), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
}
