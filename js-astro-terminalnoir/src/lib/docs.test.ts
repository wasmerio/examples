import { expect, it } from 'vitest';
import { getDocSource } from './docs';

const en = '../content/docs/en/getting-started.md';
const pt = '../content/docs/pt-br/getting-started.md';
const files = { [en]: '# English guide', [pt]: '# Guia em português' };
it('loads the exact guide, ignoring unrelated Markdown files', () => {
  expect(getDocSource({ '../content/docs/en/extra.md': 'wrong', ...files }, 'en')).toBe(files[en]);
  expect(getDocSource(files, 'pt-br')).toBe(files[pt]);
});
it.each([en, pt])('fails for a missing translation: %s', missing => {
  const input = { ...files };
  delete input[missing as keyof typeof input];
  expect(() => getDocSource(input, 'en')).toThrow(missing);
});
