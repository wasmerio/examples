import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import InstallTabs from './InstallTabs.astro';

const items = [
  { id: 'npm', label: 'npm example', command: 'npm install example-package' },
  { id: 'pnpm', label: 'pnpm example', command: 'pnpm add <example> & "quoted"' },
];

it('renders two instances with unique ids, escaped commands and valid aria-controls', async () => {
  const container = await AstroContainer.create();
  const first = await container.renderToString(InstallTabs, { props: { id: 'home', items } });
  const second = await container.renderToString(InstallTabs, { props: { id: 'docs', items } });

  expect(first).toContain('id="home-tab-npm"');
  expect(first).toContain('aria-controls="home-panel-npm"');
  expect(first).toContain('id="home-panel-npm"');
  expect(second).toContain('id="docs-tab-npm"');
  expect(first).not.toContain('id="docs-tab-npm"');
  expect(first).toContain('npm install example-package');
  expect(first).toContain('&lt;example&gt;');
  expect(first).toContain('&amp;');
  expect(first).not.toContain('<example>');
  expect(first).not.toContain('/ports/');
});
