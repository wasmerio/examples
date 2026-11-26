import { expect, it } from 'vitest';
import { asset, route, alternate } from './urls';

it.each([
  ['/', 'en', '/', '/'],
  ['/toolkit/', 'en', '/docs', '/toolkit/docs'],
  ['/toolkit/', 'pt-br', '/integrations/editor', '/toolkit/pt-br/integrations/editor'],
  ['/toolkit/', 'pt-br', '/docs#install', '/toolkit/pt-br/docs#install'],
] as const)('composes %s %s %s', (base, locale, path, result) => expect(route(path, locale, base)).toBe(result));

it('switches locale without duplicating the base', () => {
  expect(alternate('/toolkit/pt-br/docs/', 'en', '/toolkit/')).toBe('/toolkit/docs');
  expect(alternate('/toolkit/docs', 'pt-br', '/toolkit/')).toBe('/toolkit/pt-br/docs');
});

it('resolves assets from the base without a locale prefix', () => {
  expect(asset('/favicon.svg', '/')).toBe('/favicon.svg');
  expect(asset('/images/example.svg', '/toolkit/')).toBe('/toolkit/images/example.svg');
});
