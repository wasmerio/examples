import type { APIRoute, GetStaticPaths } from 'astro';
import { json, resource } from '@api/envelope';
import { full } from '@api/serialize';
import { allTools, toolBySlug } from '@api/repositories/tools';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
    allTools().map((t) => ({ params: { slug: t.slug } }));

export const GET: APIRoute = ({ params }) => {
    const tool = toolBySlug(String(params.slug));
    if (!tool) return new Response(null, { status: 404 });
    return json(resource(full(tool)));
};
