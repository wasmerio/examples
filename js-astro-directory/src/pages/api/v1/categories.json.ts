import type { APIRoute } from 'astro';
import { json } from '@api/envelope';
import { categories } from '@api/repositories/tools';

export const prerender = true;

export const GET: APIRoute = () => json({ data: categories() });
