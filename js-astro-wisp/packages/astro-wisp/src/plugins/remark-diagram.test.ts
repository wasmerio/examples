import { rmSync } from 'node:fs';
import { join } from 'node:path';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { makeRepo } from '../lib/render-diagram.fixture';
import { renderDiagram } from '../lib/render-diagram';
import { remarkDiagram, FROM_ATTR, SEQ_ATTR } from './remark-diagram';

let repo: ReturnType<typeof makeRepo>;
beforeAll(() => {
  repo = makeRepo();
});
afterAll(() => rmSync(repo.root, { recursive: true, force: true }));

type TreeNode = {
  type: string;
  value?: string;
  children?: TreeNode[];
  attributes?: Array<{ name: string; value: unknown }>;
};
type Tree = { children: TreeNode[] };
type FileData = { astro: { frontmatter: Record<string, unknown> } };

function child(node: Tree, index: number): TreeNode;
function child(node: TreeNode, index: number): TreeNode;
function child(node: Tree | TreeNode, index: number): TreeNode {
  const value = node.children?.[index];
  if (!value) throw new Error(`missing tree child at ${index}`);
  return value;
}

function run(md: string, opts: object = {}, mdx = false) {
  const proc = unified().use(remarkParse);
  if (mdx) proc.use(remarkMdx);
  proc.use(remarkDiagram, { root: repo.root, siteUrl: 'https://blog.dev', ...opts });
  const file = new VFile({ path: repo.post, value: md });
  const tree = proc.runSync(proc.parse(md), file) as unknown as Tree;
  const data = file.data as FileData;
  return { tree, fm: data.astro.frontmatter };
}

describe('remarkDiagram', () => {
  it('replaces a lone image paragraph with an html figure (no <p><figure>)', () => {
    const { tree, fm } = run('前文\n\n![自注意力](./diagrams/flow.excalidraw "图 1")\n\n后文\n');
    expect(tree.children.map((c) => c.type)).toEqual(['paragraph', 'html', 'paragraph']);
    const expected = renderDiagram(
      {
        src: './diagrams/flow.excalidraw',
        from: repo.post,
        alt: '自注意力',
        caption: '图 1',
        seq: 1,
      },
      { dev: false, root: repo.root, siteUrl: 'https://blog.dev' },
    ).html;
    expect(tree.children[1].value).toBe(expected);
    expect(fm).toMatchObject({ hasDiagram: true, hasHandDiagram: true });
  });

  it('splits paragraphs when the image is mixed with text', () => {
    const { tree } = run('看这张图 ![x](./diagrams/flow.excalidraw) 然后继续\n');
    expect(tree.children.map((c) => c.type)).toEqual(['paragraph', 'html', 'paragraph']);
    expect(child(child(tree, 0), 0).value).toBe('看这张图 ');
  });

  it('supports #page= and leaves ordinary images alone', () => {
    const { tree, fm } = run('![](./diagrams/model.drawio#page=encoder)\n\n![p](./a.png)\n');
    expect(tree.children[0].type).toBe('html');
    expect(child(tree, 0).value).toContain('data-page="encoder"');
    expect(child(child(tree, 1), 0).type).toBe('image');
    expect(fm).toMatchObject({ hasDiagram: true, hasHandDiagram: false });
  });

  it('numbers diagrams per document so the same diagram twice has unique ids', () => {
    const { tree } = run('![](./diagrams/flow.excalidraw)\n\n![](./diagrams/flow.excalidraw)\n');
    const ids = tree.children.flatMap((c) =>
      typeof c.value === 'string' ? [...c.value.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]) : [],
    );
    expect(ids.length).toBeGreaterThan(4);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks no-diagram documents', () => {
    expect(run('纯文字\n').fm).toMatchObject({ hasDiagram: false, hasHandDiagram: false });
  });

  it('build mode throws on missing outputs; dev mode shows a placeholder', () => {
    expect(() => run('![](./diagrams/none.excalidraw)\n')).toThrow(/pnpm diagram build/);
    const { tree } = run('![](./diagrams/none.excalidraw)\n', { dev: true });
    expect(tree.children[0].value).toContain('wisp-diagram-missing');
  });

  it('injects file path and shared sequence into <Diagram> in MDX', () => {
    const { tree, fm } = run(
      '![](./diagrams/flow.excalidraw)\n\n<Diagram src="./diagrams/model.drawio" page="encoder" />\n',
      {},
      true,
    );
    const el = tree.children[1];
    expect(el.type).toBe('mdxJsxFlowElement');
    const attrs = Object.fromEntries((el.attributes ?? []).map((a) => [a.name, a.value])) as Record<
      string,
      unknown
    >;
    expect(attrs[FROM_ATTR]).toBe(repo.post);
    expect(attrs[SEQ_ATTR]).toBe('2');
    expect(fm).toMatchObject({ hasDiagram: true, hasHandDiagram: true });
  });

  it('resolves relative to file.path', () => {
    const { tree } = run('![](../../shared/diagrams/shared-flow.excalidraw)\n');
    expect(tree.children[0].value).toContain('href="/diagrams/shared/shared-flow.excalidraw"');
    expect(join(repo.root)).toBeTruthy();
  });
});
