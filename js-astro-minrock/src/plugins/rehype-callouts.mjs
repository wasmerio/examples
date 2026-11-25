/**
 * 🪨 Minrock — Native Obsidian & GitHub Callouts Plugin for Sätteri (Astro 7)
 * Converts Markdown blockquotes like `> [!TIP]` into semantic `<aside class="callout" data-callout="...">`
 * with vector SVG icons and proper accessibility roles.
 */

const DEFAULT_TITLES = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
  danger: 'Danger',
  info: 'Info',
};

const TYPE_ALIASES = {
  hint: 'tip',
  attention: 'warning',
  alert: 'warning',
  bug: 'danger',
  error: 'danger',
  todo: 'note',
  seealso: 'note',
  abstract: 'info',
  summary: 'info',
  tldr: 'info',
};

const commonSvgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function createCalloutIconNode(type) {
  switch (type) {
    case 'tip':
      return {
        type: 'element',
        tagName: 'svg',
        properties: commonSvgProps,
        children: [
          {
            type: 'element',
            tagName: 'path',
            properties: { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' },
            children: [],
          },
          {
            type: 'element',
            tagName: 'path',
            properties: { d: 'M9 18h6' },
            children: [],
          },
          {
            type: 'element',
            tagName: 'path',
            properties: { d: 'M10 22h4' },
            children: [],
          },
        ],
      };

    case 'important':
      return {
        type: 'element',
        tagName: 'svg',
        properties: commonSvgProps,
        children: [
          {
            type: 'element',
            tagName: 'circle',
            properties: { cx: 12, cy: 12, r: 10 },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 8, x2: 12, y2: 12 },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 16, x2: 12.01, y2: 16 },
            children: [],
          },
        ],
      };

    case 'warning':
      return {
        type: 'element',
        tagName: 'svg',
        properties: commonSvgProps,
        children: [
          {
            type: 'element',
            tagName: 'path',
            properties: { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 9, x2: 12, y2: 13 },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 17, x2: 12.01, y2: 17 },
            children: [],
          },
        ],
      };

    case 'caution':
    case 'danger':
      return {
        type: 'element',
        tagName: 'svg',
        properties: commonSvgProps,
        children: [
          {
            type: 'element',
            tagName: 'polygon',
            properties: { points: '7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2' },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 8, x2: 12, y2: 12 },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 16, x2: 12.01, y2: 16 },
            children: [],
          },
        ],
      };

    case 'note':
    case 'info':
    default:
      return {
        type: 'element',
        tagName: 'svg',
        properties: commonSvgProps,
        children: [
          {
            type: 'element',
            tagName: 'circle',
            properties: { cx: 12, cy: 12, r: 10 },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 16, x2: 12, y2: 12 },
            children: [],
          },
          {
            type: 'element',
            tagName: 'line',
            properties: { x1: 12, y1: 8, x2: 12.01, y2: 8 },
            children: [],
          },
        ],
      };
  }
}

const CALLOUT_REGEX = /^\s*\[!([a-zA-Z]+)\][+-]?(?:[ \t]+([^\r\n]*))?(?:\r?\n|$)/;

export function rehypeCallouts() {
  return {
    name: 'rehype-callouts',
    element: {
      filter: ['blockquote'],
      visit(node, ctx) {
        const p = node.children?.find((c) => c.tagName === 'p');
        if (!p) return;

        const textNode = p.children?.find((c) => c.type === 'text');
        if (!textNode || typeof textNode.value !== 'string') return;

        const match = textNode.value.match(CALLOUT_REGEX);
        if (!match) return;

        const rawType = match[1].toLowerCase();
        const normalizedType = TYPE_ALIASES[rawType] || rawType;
        const customTitle = match[2]?.trim();
        const title = customTitle || DEFAULT_TITLES[normalizedType] || (rawType.charAt(0).toUpperCase() + rawType.slice(1));

        const newText = textNode.value.slice(match[0].length);
        if (newText.trim() === '') {
          ctx.removeNode(textNode);
        } else {
          ctx.replaceNode(textNode, { type: 'text', value: newText });
        }

        const iconSvg = createCalloutIconNode(normalizedType);
        const titleNode = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['callout-title'] },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['callout-icon'], ariaHidden: 'true' },
              children: [iconSvg],
            },
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['callout-title-text'] },
              children: [{ type: 'text', value: title }],
            },
          ],
        };

        ctx.replaceNode(node, {
          type: 'element',
          tagName: 'aside',
          properties: {
            className: ['callout', `callout-${normalizedType}`],
            'data-callout': normalizedType,
            'data-type': normalizedType,
            role: 'note',
            ariaLabel: title,
          },
          children: [titleNode, ...node.children],
        });
      },
    },
  };
}
