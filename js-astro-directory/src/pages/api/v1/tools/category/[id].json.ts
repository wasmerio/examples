import type { APIRoute, GetStaticPaths } from 'astro';
import { collection, json } from '@api/envelope';
import { paginate } from '@api/pagination';
import { summary } from '@api/serialize';
import { categories, PER_PAGE, toolsByCategory } from '@api/repositories/tools';

export const prerender = true;

const path = (id: string) => (n: number) =>
    n === 1 ? `/api/v1/tools/category/${id}.json` : `/api/v1/tools/category/${id}/page/${n}.json`;

export const getStaticPaths: GetStaticPaths = () =>
    categories().map((c) => ({ params: { id: c.id } }));

export const GET: APIRoute = ({ params }) => {
    const id = String(params.id);
    const { slice, meta, links } = paginate(toolsByCategory(id), 1, PER_PAGE, path(id));
    return json(collection(slice.map(summary), meta, links));
};
