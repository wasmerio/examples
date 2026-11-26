import { isAbsolute, resolve } from 'node:path';
import type { Html, Image, Paragraph, PhrasingContent, Root, RootContent } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import {
  isDiagramUrl,
  renderDiagram,
  styleOf,
  parseDiagramUrl,
  type DiagramEnv,
} from '../lib/render-diagram';

export interface RemarkDiagramOptions {
  /** dev：产物缺失/过期时显示占位块；否则构建失败 */
  dev?: boolean;
  /** features.diagramDownload */
  downloads?: boolean;
  /** Astro site（用于“在 draw.io 中打开”） */
  siteUrl?: string;
  /** Astro base */
  base?: string;
  /** 测试用 */
  root?: string;
  manifestPath?: string;
}

interface AstroFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

/** MDX 中的 <Diagram> 元素（mdast-util-mdx-jsx），只声明用到的字段，避免依赖其类型包。 */
interface JsxAttr {
  type: string;
  name?: string;
  value?: unknown;
}
interface JsxElement {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement';
  name: string | null;
  attributes: JsxAttr[];
}

/** 注入给 Diagram.astro 的内部属性：引用方文件和页面内序号。 */
export const FROM_ATTR = '__wispFrom';
export const SEQ_ATTR = '__wispSeq';

function filePath(file: VFile): string | undefined {
  const p = file.path ?? file.history[0];
  if (!p) return undefined;
  return isAbsolute(p) ? p : resolve(file.cwd ?? process.cwd(), p);
}

const isDiagramImage = (n: { type: string; url?: string }): n is Image =>
  n.type === 'image' && isDiagramUrl(n.url ?? '');

/**
 * remark-diagram：把指向 .excalidraw / .drawio 的图片替换为内联 SVG 的 <figure>（diagrams.md §5.1）。
 * - 段落中只有这张图（允许空白）时替换整个段落；与文字混排时把段落拆开，避免 <p><figure>。
 * - MDX 中的 <Diagram> 元素：注入引用方文件路径和序号，渲染交给组件（同一个 renderDiagram）。
 * - 写入 frontmatter：hasDiagram / hasHandDiagram，布局据此按需加载样式与 Excalifont。
 */
export function remarkDiagram(options: RemarkDiagramOptions = {}): ReturnType<Plugin<[], Root>> {
  const env: DiagramEnv = {
    dev: options.dev ?? false,
    downloads: options.downloads,
    siteUrl: options.siteUrl,
    base: options.base,
    root: options.root,
    manifestPath: options.manifestPath,
  };
  return (tree: Root, file: VFile) => {
    const from = filePath(file);
    let seq = 0;
    let hasDiagram = false;
    let hasHand = false;
    const mark = (src: string) => {
      hasDiagram = true;
      if (styleOf(parseDiagramUrl(src).path) === 'hand') hasHand = true;
    };

    const render = (node: Image): Html => {
      mark(node.url);
      const r = renderDiagram(
        {
          src: node.url,
          from,
          alt: node.alt ?? undefined,
          caption: node.title ?? undefined,
          seq: ++seq,
        },
        env,
      );
      return { type: 'html', value: r.html, position: node.position };
    };

    // 文档顺序遍历：图片与 <Diagram> 共用序号
    visit(tree, (node, index, parent) => {
      const nodeType = (node as { type: string }).type;
      if (nodeType === 'mdxJsxFlowElement' || nodeType === 'mdxJsxTextElement') {
        const el = node as unknown as JsxElement;
        if (el.name !== 'Diagram') return;
        const src = el.attributes.find(
          (a) => a.type === 'mdxJsxAttribute' && a.name === 'src',
        )?.value;
        if (typeof src === 'string' && isDiagramUrl(src)) mark(src);
        else hasDiagram = true;
        el.attributes = el.attributes.filter((a) => a.name !== FROM_ATTR && a.name !== SEQ_ATTR);
        if (from) el.attributes.push({ type: 'mdxJsxAttribute', name: FROM_ATTR, value: from });
        el.attributes.push({ type: 'mdxJsxAttribute', name: SEQ_ATTR, value: String(++seq) });
        return;
      }
      if (node.type !== 'paragraph' || !parent || index === undefined) return;
      const para = node as Paragraph;
      if (!para.children.some(isDiagramImage)) return;

      const out: RootContent[] = [];
      let buf: PhrasingContent[] = [];
      const flush = () => {
        // 丢弃只剩空白/换行的片段
        const meaningful = buf.some(
          (c) => !(c.type === 'text' && !c.value.trim()) && c.type !== 'break',
        );
        if (meaningful) out.push({ type: 'paragraph', children: buf });
        buf = [];
      };
      for (const child of para.children) {
        if (isDiagramImage(child)) {
          flush();
          out.push(render(child));
        } else buf.push(child);
      }
      flush();
      (parent.children as RootContent[]).splice(index, 1, ...out);
      return index + out.length;
    });

    // 不在段落里的图片（理论上不会出现，例如表格单元格、链接内）：原地替换为 html
    visit(tree, 'image', (node, index, parent) => {
      if (!parent || index === undefined || !isDiagramImage(node)) return;
      (parent.children as unknown[])[index] = render(node);
    });

    const data = file.data as AstroFileData;
    data.astro ??= {};
    data.astro.frontmatter ??= {};
    data.astro.frontmatter.hasDiagram = hasDiagram;
    data.astro.frontmatter.hasHandDiagram = hasHand;
  };
}

export default remarkDiagram;
