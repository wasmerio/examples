import type { APIRoute } from 'astro';
import { json } from '@api/envelope';
import { latestDate } from '@api/repositories/tools';

export const prerender = true;

export const GET: APIRoute = () =>
    json({
        name: 'Rise of Machine Tools API',
        version: '1.0.0',
        updated: latestDate(),
        links: {
            tools: '/api/v1/tools.json',
            toolsAll: '/api/v1/tools-all.json',
            categories: '/api/v1/categories.json',
            searchIndex: '/api/v1/search-index.json',
            openapi: '/api/v1/openapi.json',
            openapiYaml: '/api/v1/openapi.yaml',
        },
    });
