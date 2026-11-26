import { describe, expect, it } from 'vitest';
import { cssVariables } from './palette';
import { renderMarkdown } from './markdown';

describe('standalone visual resources', () => {
  it('loads both palettes locally', () => {
    expect(cssVariables('dark')['--tn-surface-base']).toBe('#0B0B0C');
    expect(cssVariables('light')['--tn-surface-base']).toBe('#FBFAF7');
  });

  it('highlights code without parent ports', async () => {
    expect(await renderMarkdown('```ts\nconst value = 1;\n```')).toContain('shiki');
  });
});
