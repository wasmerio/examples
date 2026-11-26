import type { APIRoute } from 'astro'
import { projects } from '../data/projects'

/**
 * Element names for the cross-document view transition (card cover → page
 * cover), one per project. Generated here so that adding a project needs no
 * CSS, and served as a file so the CSP can stay at `style-src 'self'`.
 */
export const GET: APIRoute = () => {
  const body = projects
    .map((project) => `#cover-${project.slug}{view-transition-name:cover-${project.slug}}`)
    .join('\n')
  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/css; charset=utf-8' } })
}
