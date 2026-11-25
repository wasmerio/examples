import type { APIRoute } from 'astro';
import { collection, json } from '@api/envelope';
import { full } from '@api/serialize';
import { allTools } from '@api/repositories/tools';

export const prerender = true;

// Whole published set in one request (full records) so agents skip 45 paged round-trips.
export const GET: APIRoute = () => {
    const data = allTools().map(full);
    const self = '/api/v1/tools-all.json';
    return json(
        collection(data, { total: data.length, page: 1, perPage: data.length, totalPages: 1 }, {
            self,
            next: null,
            prev: null,
            first: self,
            last: self,
        }),
    );
};
