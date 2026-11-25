import { describe, expect, it } from 'vitest';
import { allTools, categories, toolBySlug, toolsByCategory, PER_PAGE } from '@api/repositories/tools';
import { full, summary } from '@api/serialize';
import { paginate, totalPages } from '@api/pagination';
import openapi from '@api/openapi.json';
import slugMap from '../../data/slug-map.json';

const SUMMARY_KEYS = [
    'slug', 'title', 'description', 'url', 'siteUrl', 'tag',
    'dateAdded', 'ogImage', 'githubUrl', 'category', 'featured',
].sort();
const FULL_KEYS = [...SUMMARY_KEYS, 'body', 'related'].sort();

describe('repository', () => {
    it('publishes the tools.json set, deduped and sorted newest-first', () => {
        const tools = allTools();
        expect(tools.length).toBe(Object.keys(slugMap).length);
        expect(new Set(tools.map((t) => t.slug)).size).toBe(tools.length);
        for (let i = 1; i < tools.length; i++) {
            const prev = tools[i - 1];
            const cur = tools[i];
            expect(
                prev.dateAdded > cur.dateAdded ||
                    (prev.dateAdded === cur.dateAdded && prev.slug < cur.slug),
            ).toBe(true);
        }
    });

    it('resolves related[] only to published slugs', () => {
        const published = new Set(allTools().map((t) => t.slug));
        for (const t of allTools()) {
            for (const r of t.related) expect(published.has(r)).toBe(true);
        }
    });

    it('category pages are a subset of the whole set', () => {
        const total = categories().reduce((sum, c) => sum + toolsByCategory(c.id).length, 0);
        // a tool can be in several categories, so the sum is >= the unique count
        expect(total).toBeGreaterThanOrEqual(allTools().length);
    });
});

describe('serialize allowlist', () => {
    it('summary exposes only allowlisted keys (no body/related leak)', () => {
        const s = summary(allTools()[0]);
        expect(Object.keys(s).sort()).toEqual(SUMMARY_KEYS);
    });

    it('full exposes exactly the full allowlist', () => {
        const f = full(allTools()[0]);
        expect(Object.keys(f).sort()).toEqual(FULL_KEYS);
    });
});

describe('pagination', () => {
    it('builds path-based links with correct boundaries', () => {
        const path = (n: number) => (n === 1 ? '/api/v1/tools.json' : `/api/v1/tools/page/${n}.json`);
        const pages = totalPages(allTools().length, PER_PAGE);
        const first = paginate(allTools(), 1, PER_PAGE, path);
        expect(first.meta.perPage).toBe(PER_PAGE);
        expect(first.meta.totalPages).toBe(pages);
        expect(first.links.prev).toBeNull();
        expect(first.links.next).toBe('/api/v1/tools/page/2.json');
        expect(first.links.last).toBe(`/api/v1/tools/page/${pages}.json`);

        const last = paginate(allTools(), pages, PER_PAGE, path);
        expect(last.links.next).toBeNull();
    });
});

describe('openapi', () => {
    it('declares every phase-1 route', () => {
        const paths = Object.keys((openapi as { paths: Record<string, unknown> }).paths);
        for (const p of [
            '/index.json', '/tools.json', '/tools/page/{n}.json', '/tools-all.json',
            '/tools/{slug}.json', '/tools/category/{id}.json',
            '/tools/category/{id}/page/{n}.json', '/categories.json', '/search-index.json',
        ]) {
            expect(paths).toContain(p);
        }
    });
});
