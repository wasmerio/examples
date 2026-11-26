import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import Layout from './Layout.astro';
import { site } from '../config/site';

it('renders configured identity and repository', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Layout, { request: new Request('https://example.com/') });
  expect(html).toContain(site.terminalLabel);
  expect(html).toContain(site.repository);
  expect(html).not.toContain(['terminalnoir', 'web.app'].join('.'));
});

it.each(['/', '/pt-br'])('credits the theme author in the footer on %s', async pathname => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Layout, {
    request: new Request(`https://example.com${pathname}`),
  });
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] ?? '';
  expect(footer).toMatch(
    /by\s*<a\b[^>]*href="https:\/\/github\.com\/nandomoreirame"[^>]*>\s*nandomoreira\.dev\s*<\/a>/,
  );
  const authorLink = footer.match(/<a\b[^>]*href="https:\/\/github\.com\/nandomoreirame"[^>]*>/)?.[0] ?? '';
  expect(authorLink).toContain('target="_blank"');
  expect(authorLink).toContain('rel="noopener noreferrer"');
});
