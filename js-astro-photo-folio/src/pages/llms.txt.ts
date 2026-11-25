import type { APIRoute } from 'astro';
import { site as siteInfo, social } from '../config';

// llms.txt — a curated, Markdown index that points AI tools at the most useful
// pages. (Curation, not access control — the crawler stance lives in robots.txt.)
// Spec: https://llmstxt.org/
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => (site ? new URL(path, site).href : path);

  const body = `# ${siteInfo.name}

> ${siteInfo.description} The site has three photo galleries, two blogs (a Tech Blog and a Photo Blog), and a short biography. Content may be cited with attribution; please do not use the images or text to train machine-learning models.

## Galleries
- [Digital](${url('/')}): digital photographs.
- [Analog](${url('/analog')}): film photographs.
- [Calendar](${url('/calendar')}): one photograph per month, each captioned with the month and location.

## Blog
- [Tech Blog](${url('/blog/tech')}): writing on engineering, edge & cloud systems, and building for the web.
- [Photo Blog](${url('/blog/photography')}): field notes on light, places, and the craft of photography.

## About
- [About](${url('/about')}): a short biography of ${siteInfo.name}.
- [Contact](${url('/contact')}): ways to follow and reach out.

## Elsewhere
- Instagram: ${social.instagram}
- LinkedIn: ${social.linkedin}
- GitHub: ${social.github}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
