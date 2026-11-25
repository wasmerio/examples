import type { APIRoute, GetStaticPaths } from 'astro';
import { collection, json } from '@api/envelope';
import { paginate, totalPages } from '@api/pagination';
import { summary } from '@api/serialize';
import { categories, PER_PAGE, toolsByCategory } from '@api/repositories/tools';

export const prerender = true;

const path = (id: string) => (n: number) =>
    n === 1 ? `/api/v1/tools/category/${id}.json` : `/api/v1/tools/category/${id}/page/${n}.json`;

export const getStaticPaths: GetStaticPaths = () => {
    const paths = [];
    for (const c of categories()) {
        const pages = totalPages(toolsByCategory(c.id).length, PER_PAGE);
        for (let n = 2; n <= pages; n++) paths.push({ params: { id: c.id, n: String(n) } });
    }
    return paths;
};

export const GET: APIRoute = ({ params }) => {
    const id = String(params.id);
    const { slice, meta, links } = paginate(
        toolsByCategory(id),
        Number(params.n),
        PER_PAGE,
        path(id),
    );
    return json(collection(slice.map(summary), meta, links));
};
