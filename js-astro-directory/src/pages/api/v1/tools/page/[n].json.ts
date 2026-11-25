import type { APIRoute, GetStaticPaths } from 'astro';
import { collection, json } from '@api/envelope';
import { paginate, totalPages } from '@api/pagination';
import { summary } from '@api/serialize';
import { allTools, PER_PAGE } from '@api/repositories/tools';

export const prerender = true;

const path = (n: number) => (n === 1 ? '/api/v1/tools.json' : `/api/v1/tools/page/${n}.json`);

export const getStaticPaths: GetStaticPaths = () => {
    const pages = totalPages(allTools().length, PER_PAGE);
    const paths = [];
    for (let n = 2; n <= pages; n++) paths.push({ params: { n: String(n) } });
    return paths;
};

export const GET: APIRoute = ({ params }) => {
    const { slice, meta, links } = paginate(allTools(), Number(params.n), PER_PAGE, path);
    return json(collection(slice.map(summary), meta, links));
};
