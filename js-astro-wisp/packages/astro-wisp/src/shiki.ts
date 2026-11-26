import type { ShikiConfig } from '@astrojs/markdown-remark';
import type { Element, ElementContent } from 'hast';
import type { WispConfig } from './config';

type ShikiTransformer = NonNullable<ShikiConfig['transformers']>[number];

/** 取节点内第一个文本字符（穿透嵌套 span） */
function firstChar(node: ElementContent): string | undefined {
  if (node.type === 'text') return node.value[0];
  if (node.type === 'element') {
    for (const child of node.children) {
      const result = firstChar(child);
      if (result) return result;
    }
  }
}

type WispFrame = { lines: number; fold?: number };
type WispMeta = {
  __wispDiff?: Map<number, string>;
  __wispFrame?: WispFrame;
};

// 行尾标记：[!code ++] / [!code --]，前缀可为 //、# 或块注释起始符
const MARK = /\s*(?:\/\/|#|\/\*)\s*\[!code (\+\+|--)\]\s*(?:\*\/)?\s*$/;

/** 剥掉 diff 标记并记录行号；语言为 diff 的块按首字符 +/- 着色 */
export function wispDiffTransformer(): ShikiTransformer {
  return {
    name: 'wisp:diff',
    preprocess(code) {
      const marks = new Map<number, string>();
      const out = code.split('\n').map((l, i) => {
        const m = MARK.exec(l);
        if (!m) return l;
        marks.set(i + 1, m[1]!);
        return l.replace(MARK, '');
      });
      (this.meta as WispMeta).__wispDiff = marks;
      return out.join('\n');
    },
    line(node, line) {
      let kind = (this.meta as WispMeta).__wispDiff?.get(line);
      if (!kind && this.options.lang === 'diff') {
        const c = firstChar(node);
        if (c === '+') kind = '++';
        else if (c === '-') kind = '--';
      }
      if (kind) this.addClassToHast(node, kind === '++' ? 'diff add' : 'diff remove');
    },
  };
}

/**
 * github 主题中在 --wisp-code-bg 上对比度 < 4.5:1 的前景色（小写）：
 * 注释 #6a737d（light 4.45 / dark 3.72）、#22863a 4.28、#d73a49 4.23、#e36209 3.23。
 * 命中的 span 加 class `tok-low`，由 code.css 与 --wisp-fg 混色提亮对比度。
 * 这里只是识别主题输出的色值，不产生任何颜色。
 */
const LOW_CONTRAST = new Set(['#6a737d', '#22863a', '#d73a49', '#e36209']);

export function wispContrastTransformer(): ShikiTransformer {
  return {
    name: 'wisp:contrast',
    span(node, _line, _col, _lineNode, token) {
      const st = (token.htmlStyle ?? {}) as Record<string, string>;
      const hit = [st['--shiki-light'], st['--shiki-dark']].some(
        (c) => c && LOW_CONTRAST.has(c.toLowerCase()),
      );
      if (hit) this.addClassToHast(node, 'tok-low');
    },
  };
}

export type CodeFoldOptions = { enabled: boolean; maxLines: number; previewLines: number };

/**
 * 解析代码块 meta 中的折叠指令：`fold`、`nofold`、`fold=8`。
 * 返回 undefined 表示未指定（按行数阈值自动决定）。
 */
export function parseFoldMeta(
  raw: string | undefined,
): { fold: false } | { fold: true; lines?: number } | undefined {
  let r: ReturnType<typeof parseFoldMeta>;
  for (const t of (raw ?? '').split(/\s+/)) {
    if (t === 'nofold') r = { fold: false };
    else if (t === 'fold') r = { fold: true };
    else {
      const m = /^fold=(\d+)$/.exec(t);
      if (m && +m[1]! > 0) r = { fold: true, lines: +m[1]! };
    }
  }
  return r;
}

/** 给 pre 加语言信息，并包一层 div.wisp-code（语言标签 + 复制按钮的定位容器）。
 *  codeCopy 为真时给容器加 wisp-code--copy 修饰类，让 CSS 无需等客户端脚本
 *  插入按钮后再用 :has() 探测，避免语言标签位置跳变（CLS）。
 *  codeWrap 为真时加 wisp-code--wrap：站点默认自动换行（无 JS 也生效）；
 *  读者的选择写在 html[data-wisp-code-wrap="on|off"] 上，优先于这个默认值（见 code.css）。 */
export function wispFrameTransformer(
  lineNumbers: boolean,
  fold?: CodeFoldOptions,
  codeCopy?: boolean,
  codeWrap?: boolean,
): ShikiTransformer {
  return {
    name: 'wisp:frame',
    pre(node) {
      const lang = this.options.lang || 'text';
      node.properties.dataLanguage = lang;
      this.addClassToHast(node, 'wisp-pre');
      if (lineNumbers) this.addClassToHast(node, 'wisp-ln');
      // 无 JS 时可键盘横向滚动；有 JS 时只有确实溢出的代码块保留 tabindex（Base 布局的脚本按 data-wisp-tab 接管）
      node.properties.tabindex = 0;
      node.properties['data-wisp-tab'] = '';
      // 行数与折叠标记（不含 JS 时仍完整显示，脚本负责实际折叠）
      const code = node.children.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'code',
      );
      const lines =
        code?.children.filter(
          (c): c is Element => c.type === 'element' && c.properties.class === 'line',
        ).length ?? 0;
      (this.meta as WispMeta).__wispFrame = { lines };
      if (fold?.enabled) {
        const m = parseFoldMeta(this.options.meta?.__raw);
        const preview = m?.fold ? (m.lines ?? fold.previewLines) : fold.previewLines;
        const on = m ? m.fold : lines > fold.maxLines;
        if (on && lines > preview) (this.meta as WispMeta).__wispFrame!.fold = preview;
      }
    },
    root(root) {
      const pre = root.children[0];
      if (!pre || pre.type !== 'element') return;
      const lang = String(pre.properties.dataLanguage ?? 'text');
      const fr = (this.meta as WispMeta).__wispFrame ?? { lines: 0 };
      const extra: Record<string, string | number> = {};
      if (fr.lines) extra['data-lines'] = fr.lines;
      if (fr.fold) extra['data-fold'] = fr.fold;
      root.children = [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: ['wisp-code', codeCopy && 'wisp-code--copy', codeWrap && 'wisp-code--wrap']
              .filter(Boolean)
              .join(' '),
            'data-language': lang,
            ...extra,
          },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'wisp-lang', 'aria-hidden': 'true' },
              children: [{ type: 'text', value: lang === 'plaintext' ? 'text' : lang }],
            },
            pre,
          ],
        },
      ];
    },
  };
}

/**
 * 可直接放入 Astro `markdown.shikiConfig` 的对象。
 * Astro 7 的 unified 与 MDX 处理器共享 markdown.shikiConfig（rehype-shiki 读取它）。
 */
export function wispShikiConfig(config: WispConfig) {
  return {
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false as const,
    // 换行由 code.css 按读者偏好切换（悬挂缩进、行号只标逻辑行），不用 Shiki 的内联 white-space
    wrap: false as const,
    transformers: [
      wispDiffTransformer(),
      wispContrastTransformer(),
      wispFrameTransformer(
        config.features.lineNumbers,
        config.features.codeFold,
        config.features.codeCopy,
        config.features.codeWrap,
      ),
    ],
  };
}
