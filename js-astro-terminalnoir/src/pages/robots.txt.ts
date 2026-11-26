import type { APIRoute } from 'astro';
import { robotsBody } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Missing site origin');
  return new Response(robotsBody(site.origin, import.meta.env.BASE_URL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
