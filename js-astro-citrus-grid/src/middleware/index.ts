import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()
  if (import.meta.env.DEV && response.headers.get('content-type')?.includes('text/html')) {
    response.headers.set('Cache-Control', 'no-store')
  }
  return response
})
