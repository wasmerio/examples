import type { APIRoute } from 'astro';
import yaml from '@api/openapi.yaml?raw';

export const prerender = true;

// Served verbatim as text; no YAML parser ships to the site.
export const GET: APIRoute = () =>
    new Response(yaml, {
        headers: { 'content-type': 'application/yaml; charset=utf-8' },
    });
