import type { APIRoute } from 'astro';
import searchIndex from '../../../../public/search-index.json?raw';

export const prerender = true;

// Raw Fuse index, re-served byte-for-byte from public/search-index.json (not enveloped).
export const GET: APIRoute = () =>
    new Response(searchIndex, {
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
