import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import Integrations from '../views/Integrations.astro';
import Detail from '../views/IntegrationDetail.astro';
import Card from './IntegrationCard.astro';

const integration = {
  slug: 'editor',
  locale: 'en' as const,
  name: 'Example Editor',
  description: 'An example.',
  category: 'editor' as const,
  icon: 'lucide:terminal',
  homepage: 'https://example.com',
  featured: true,
  body: '',
};

it('renders replaceable content and local detail URL', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Card, { props: { integration } });
  expect(html).toContain('Example Editor');
  expect(html).toContain('/integrations/editor');
  expect(html).not.toContain('/ports/');
});

it('omits the screenshot when the integration has none', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Detail, { props: { integration } });
  expect(html).not.toContain('<img');
  expect(html).toContain('https://example.com');
});

it('announces an empty catalogue', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Integrations, { props: { items: [] } });
  expect(html).toContain('No example integrations yet.');
  expect(html).not.toContain('/ports/');
});
