import type { APIRoute } from 'astro';
import { collection, json } from '@api/envelope';
import { paginate } from '@api/pagination';
import { summary } from '@api/serialize';
import { allTools, PER_PAGE } from '@api/repositories/tools';

export const prerender = true;

const path = (n: number) => (n === 1 ? '/api/v1/tools.json' : `/api/v1/tools/page/${n}.json`);

export const GET: APIRoute = () => {
    const { slice, meta, links } = paginate(allTools(), 1, PER_PAGE, path);
    return json(collection(slice.map(summary), meta, links));
};
