import type { APIRoute, GetStaticPaths } from 'astro';
import lemma from '../../lemma.config.mjs';

// The IndexNow key file, /<key>.txt (lemma.config.mjs, deploy.indexNow): it
// shows search engines that the URLs bun run deploy submits are this site's.
export const getStaticPaths = (() => {
  const key = lemma.deploy.indexNow;
  return key ? [{ params: { indexnow: key } }] : [];
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(params.indexnow, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
