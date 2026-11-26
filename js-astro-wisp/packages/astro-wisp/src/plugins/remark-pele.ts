import { render, PeleError } from 'pele';
import { visit } from 'unist-util-visit';
import type { Code, Html, Root, Parent } from 'mdast';
import type { Plugin } from 'unified';
import type { VFile } from 'vfile';
import { figureCaptionHtml } from './figure-caption';

export interface RemarkPeleOptions {
  /** true：渲染失败时抛错（构建失败）。 */
  strict?: boolean;
  /** 开发模式：错误提示中附带 Pele 的源码片段。 */
  dev?: boolean;
  /** 站点语言（默认 'zh-CN'）；文章 frontmatter 的 lang 优先 */
  lang?: string;
}

const TYPE_NAMES: Record<string, string> = {
  flowchart: '流程图',
  sequence: '时序图',
  class: '类图',
  state: '状态图',
  er: 'ER 图',
  pie: '饼图',
  gantt: '甘特图',
  gitGraph: 'Git 图',
  mindmap: '思维导图',
  timeline: '时间线',
  journey: '用户旅程图',
  xychart: 'XY 图表',
  quadrantChart: '象限图',
  requirement: '需求图',
  c4: 'C4 图',
  sankey: '桑基图',
  block: '块图',
  packet: '数据包图',
  kanban: '看板',
  architecture: '架构图',
  radar: '雷达图',
  treemap: '矩形树图',
};

const TYPE_NAMES_EN: Record<string, string> = {
  flowchart: 'Flowchart',
  sequence: 'Sequence diagram',
  class: 'Class diagram',
  state: 'State diagram',
  er: 'ER diagram',
  pie: 'Pie chart',
  gantt: 'Gantt chart',
  gitGraph: 'Git graph',
  mindmap: 'Mindmap',
  timeline: 'Timeline',
  journey: 'User journey',
  xychart: 'XY chart',
  quadrantChart: 'Quadrant chart',
  requirement: 'Requirement diagram',
  c4: 'C4 diagram',
  sankey: 'Sankey diagram',
  block: 'Block diagram',
  packet: 'Packet diagram',
  kanban: 'Kanban',
  architecture: 'Architecture diagram',
  radar: 'Radar chart',
  treemap: 'Treemap',
};

const escAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Pele 把 accTitle/accDescr 写成 <title>/<desc>（内容已转义），这里直接取出。 */
function textOf(svg: string, tag: 'title' | 'desc'): string {
  const m = svg.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m
    ? m[1]
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
}

/** SVG 的原始宽度写成 --pele-w，CSS 据此限制最小缩放比例（见 figure.css）。 */
function widthStyle(svg: string): string {
  const w = Number(svg.match(/<svg\b[^>]*?\swidth="([\d.]+)"/)?.[1]);
  return Number.isFinite(w) && w > 0 ? ` style="--pele-w:${Math.round(w)}px"` : '';
}

/**
 * 题注写在围栏的 meta 里：```mermaid caption="图 3：调度流程"```（也接受 title=，单双引号均可）。
 * 与图片、图表共用题注语法（图号拆成 .wisp-fig-no）。
 */
export function captionOf(meta: string | null | undefined): string {
  const m = /(?:^|\s)(?:caption|title)=(?:"([^"]*)"|'([^']*)')/.exec(meta ?? '');
  return (m?.[1] ?? m?.[2] ?? '').trim();
}

export function remarkPele(options: RemarkPeleOptions = {}): ReturnType<Plugin<[], Root>> {
  const { strict = false, dev = false, lang: defaultLang = 'zh-CN' } = options;
  return (tree: Root, file: VFile) => {
    const fm = (file.data as { astro?: { frontmatter?: { lang?: unknown } } }).astro?.frontmatter;
    const lang = typeof fm?.lang === 'string' && fm.lang ? fm.lang : defaultLang;
    const zh = /^zh\b/i.test(lang);
    const jobs: Array<{ parent: Parent; index: number; node: Code }> = [];
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang === 'mermaid' && parent && index !== undefined)
        jobs.push({ parent, index, node });
    });
    // 倒序处理，插入节点不会影响前面的索引
    for (const [i, { parent, index, node }] of [...jobs.entries()].reverse()) {
      try {
        // idPrefix 保证同页多图的 <title id> 不冲突；用文档内序号，输出是确定的
        const seq = i;
        const r = render(node.value, { idPrefix: `pele${seq}-` });
        const label =
          textOf(r.svg, 'title') ||
          textOf(r.svg, 'desc') ||
          (zh ? TYPE_NAMES[r.type] || '图表' : TYPE_NAMES_EN[r.type] || 'Diagram');
        const caption = captionOf(node.meta);
        const html: Html = {
          type: 'html',
          value:
            // 可横向滚动的容器需要能被键盘聚焦（WCAG scrollable-region-focusable），
            // 所以 role=img + aria-label 放在可聚焦的滚动容器上，而不是 figure 上
            `<figure class="wisp-figure wisp-pele">` +
            `<div class="wisp-pele-body" tabindex="0" role="img" aria-label="${escAttr(label)}"${widthStyle(r.svg)}>${r.svg}</div>` +
            (caption ? `<figcaption>${figureCaptionHtml(caption)}</figcaption>` : '') +
            `</figure>`,
        };
        parent.children[index] = html;
      } catch (err) {
        const e = err as Partial<PeleError> & Error;
        const where = file.path ?? '<unknown>';
        const codeLine = node.position?.start.line;
        // 围栏起始行 + 1 = 代码第一行；Pele 的 line 从 1 开始
        const line = codeLine !== undefined ? codeLine + (e.line ?? 1) : undefined;
        const loc = line !== undefined ? `${where}:${line}` : where;
        const first = (e.message ?? String(err)).split('\n')[0];
        if (strict) {
          const prefix = zh ? 'Mermaid 渲染失败' : 'Mermaid render failed';
          throw new Error(`${prefix} (${loc}): ${e.message ?? err}`, { cause: err });
        }
        console.warn(
          zh
            ? `[wisp] Mermaid 渲染失败 (${loc}): ${first}`
            : `[wisp] Mermaid render failed (${loc}): ${first}`,
        );
        const detail = dev ? (e.message ?? first) : first;
        const note: Html = {
          type: 'html',
          value: `<div class="wisp-pele-error" role="note">${zh ? 'Mermaid 渲染失败：' : 'Mermaid render failed: '}${escText(detail)}</div>`,
        };
        parent.children.splice(index, 0, note);
      }
    }
  };
}

export default remarkPele;
