export interface PageMeta {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface PageLinks {
    self: string;
    next: string | null;
    prev: string | null;
    first: string;
    last: string;
}

export interface Paginated<T> {
    slice: T[];
    meta: PageMeta;
    links: PageLinks;
}

export function totalPages(total: number, perPage: number): number {
    return Math.max(1, Math.ceil(total / perPage));
}

// `path(n)` maps a page number to its published URL so links stay path-based.
export function paginate<T>(
    items: T[],
    page: number,
    perPage: number,
    path: (n: number) => string,
): Paginated<T> {
    const total = items.length;
    const pages = totalPages(total, perPage);
    const start = (page - 1) * perPage;
    const slice = items.slice(start, start + perPage);
    return {
        slice,
        meta: { total, page, perPage, totalPages: pages },
        links: {
            self: path(page),
            next: page < pages ? path(page + 1) : null,
            prev: page > 1 ? path(page - 1) : null,
            first: path(1),
            last: path(pages),
        },
    };
}
