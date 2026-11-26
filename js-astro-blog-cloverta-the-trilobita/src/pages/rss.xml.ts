import type { APIRoute } from 'astro';
import { feed } from '../lib/feed';
export const GET: APIRoute = ({ site }) => feed('zh', site);
