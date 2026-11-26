import type { APIRoute } from 'astro'
import { cv } from '@/data/cv'
import { asset } from '@/data/site'

export const prerender = true

export const GET: APIRoute = () => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  const localIcon = cv.site.favicon.startsWith('/') && !cv.site.favicon.startsWith('//')
    ? asset(cv.site.favicon)
    : `${base}favicon.svg`
  const iconType = localIcon.endsWith('.svg')
    ? 'image/svg+xml'
    : localIcon.endsWith('.png')
      ? 'image/png'
      : undefined

  return new Response(JSON.stringify({
    id: base,
    name: cv.site.seo.title || cv.basics.name,
    short_name: cv.basics.name,
    description: cv.site.seo.description || cv.basics.summary || '',
    lang: cv.site.lang,
    start_url: base,
    scope: base,
    display: 'browser',
    background_color: '#f2eadb',
    theme_color: '#f2eadb',
    icons: [
      {
        src: localIcon,
        ...(iconType
          ? { type: iconType }
          : {}),
        ...(iconType === 'image/svg+xml'
          ? { sizes: 'any' }
          : {}),
        purpose: 'any',
      },
    ],
  }), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  })
}
