import type { APIRoute } from 'astro';

import { site } from '../data/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const origin = new URL(site.seo.url).origin;

  const body = `/* TEAM */\nName: ${site.profile.name}\nTwitter: ${site.seo.twitterCreator}\nSite: ${origin}\n\n/* SITE */\nLanguage: Spanish\nGenerator: Astro\n`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
