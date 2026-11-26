/**
 * Not found, always. This file exists only so EmDash does not add its own
 * per-collection sitemaps: /sitemap.xml lists every page.
 */
import type { APIRoute } from "astro";

export const getStaticPaths = () => [];

export const GET: APIRoute = () => new Response(null, { status: 404 });
