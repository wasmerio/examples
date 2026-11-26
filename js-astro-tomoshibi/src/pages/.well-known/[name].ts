import type { APIRoute, GetStaticPaths } from 'astro'
import { site } from '../../data/site'

/**
 * RFC 9116 security.txt, generated only when `site.security` is set. The
 * route is dynamic so that an unset config produces no file at all.
 */
export const getStaticPaths = (() =>
  site.security ? [{ params: { name: 'security.txt' } }] : []) satisfies GetStaticPaths

export const GET: APIRoute = ({ site: origin }) => {
  const security = site.security
  if (!security) return new Response(null, { status: 404 })

  const days = security.expiresInDays ?? 365
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
  const lines = [
    `Contact: ${security.contact}`,
    `Expires: ${expires}`,
    security.preferredLanguages && `Preferred-Languages: ${security.preferredLanguages}`,
    `Canonical: ${new URL('/.well-known/security.txt', origin).href}`,
  ].filter(Boolean)

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
