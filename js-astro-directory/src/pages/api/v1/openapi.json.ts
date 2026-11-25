import type { APIRoute } from 'astro';
import doc from '@api/openapi.json';

export const prerender = true;

// The one pretty-printed payload (humans read this); imports the committed JSON, no runtime YAML parse.
export const GET: APIRoute = () =>
    new Response(JSON.stringify(doc, null, 2), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
