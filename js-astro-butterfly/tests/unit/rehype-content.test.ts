import { describe, expect, it } from 'vitest';
import type { Root } from 'hast';
import rehypeContent from '../../src/plugins/rehype-content';

describe('rehype content', () => {
  it('lazy-loads iframes written as elements or as raw HTML', () => {
    // `raw` nodes (HTML in Markdown) come from mdast-util-to-hast and aren't in hast's types
    const tree = {
      type: 'root',
      children: [
        { type: 'element', tagName: 'iframe', properties: { src: 'https://a.example/' }, children: [] },
        { type: 'raw', value: '<iframe src="https://b.example/"></iframe><iframe loading="eager" src="https://c.example/"></iframe>' },
      ],
    } as unknown as Root;
    rehypeContent()(tree);
    expect((tree.children[0] as { properties: Record<string, unknown> }).properties.loading).toBe('lazy');
    expect((tree.children[1] as { value: string }).value).toBe('<iframe loading="lazy" src="https://b.example/"></iframe><iframe loading="eager" src="https://c.example/"></iframe>');
  });
});
