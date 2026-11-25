import { defineMiddleware } from 'astro:middleware';
import { contentUrls } from './lib/content-urls';
import config from './lib/config';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html'))
    return response;
  const html = contentUrls(
    await response.text(),
    context.url,
    new URL(config.site.url),
  );
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
