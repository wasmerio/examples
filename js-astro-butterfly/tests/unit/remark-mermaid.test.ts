import { describe, expect, it } from 'vitest';
import type { Root } from 'mdast';
import remarkMermaid from '../../src/plugins/remark-mermaid';

describe('remark mermaid', () => {
  it('turns mermaid fences into diagram nodes and leaves other code alone', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'code', lang: 'mermaid', value: 'flowchart TD\n  A --> B' },
        { type: 'code', lang: 'ts', value: 'const a = 1;' },
      ],
    } as Root;
    remarkMermaid()(tree);
    const [diagram, code] = tree.children as unknown as { type: string; data?: { hName: string; hProperties: { className: string[] }; hChildren: { value: string }[] } }[];
    expect(diagram.data?.hName).toBe('div');
    expect(diagram.data?.hProperties.className).toContain('mermaid-diagram');
    expect(diagram.data?.hChildren[0].value).toBe('flowchart TD\n  A --> B');
    expect(code.type).toBe('code');
  });
});
