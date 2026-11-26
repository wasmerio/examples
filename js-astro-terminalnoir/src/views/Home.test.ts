import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import Home from './Home.astro';
import { site } from '../config/site';

it('presents a developer tool instead of a terminal palette', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Home, { request: new Request('https://example.com/') });
  expect(html).toContain(site.hero.en.title);
  expect(html).toContain('/integrations');
  expect(html).not.toContain('Bats');
  expect(html).not.toContain('/ports');
});

it('hides featured content when the catalogue is empty', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Home, { props: { items: [] } });
  expect(html).not.toContain('featured-integrations');
});

it('hides featured content when no items are featured', async () => {
  const container = await AstroContainer.create();
  const items = [
    {
      slug: 'editor',
      locale: 'en',
      name: 'Editor',
      description: 'Example',
      category: 'editor',
      icon: 'lucide:terminal',
      homepage: 'https://example.com',
      featured: false,
      body: '',
    },
  ];
  const html = await container.renderToString(Home, { props: { items } });
  expect(html).not.toContain('featured-integrations');
});
