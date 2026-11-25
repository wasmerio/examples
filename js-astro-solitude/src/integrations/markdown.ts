import type { SiteConfig } from '@/config';
import type {
  HastPluginDefinition,
  MdastPluginDefinition,
  MdastVisitorContext,
} from 'satteri';
import katex from 'katex';
import { iconToHTML, iconToSVG } from '@iconify/utils';
import lucide from '@iconify-json/lucide/icons.json';
export function solitudeMarkdown(config: SiteConfig): HastPluginDefinition {
  const link = iconToSVG(lucide.icons.link);
  const linkIcon = iconToHTML(link.body, {
    ...link.attributes,
    class: 'solitude-icon',
    'data-icon': 'lucide:link',
    'aria-hidden': 'true',
    focusable: 'false',
  });
  return {
    name: 'solitude-content',
    element: {
      filter: ['pre', 'code', 'a', 'img'],
      visit(node, ctx) {
        const properties = node.properties ?? {};
        if (node.tagName === 'a' || node.tagName === 'img') {
          const classes = properties.className;
          if (
            node.tagName === 'a' &&
            Array.isArray(classes) &&
            classes.includes('headerlink')
          ) {
            ctx.appendChild(node, { type: 'raw', value: linkIcon });
          }
          const field = node.tagName === 'a' ? 'href' : 'src';
          const value = properties[field];
          if (
            typeof value === 'string' &&
            value.startsWith('/') &&
            !value.startsWith('//') &&
            config.base !== '/' &&
            !value.startsWith(config.base)
          )
            ctx.setProperty(node, field, config.base + value.slice(1));
          if (node.tagName === 'img') {
            ctx.setProperty(node, 'loading', 'lazy');
          }
          return;
        }
        const classes = Array.isArray(properties.className)
          ? properties.className
          : [];
        const child =
          node.tagName === 'pre'
            ? node.children?.find(
                (n) => n.type === 'element' && n.tagName === 'code',
              )
            : undefined;
        const childClasses =
          child?.type === 'element' && Array.isArray(child.properties.className)
            ? child.properties.className
            : [];
        const math =
          classes.includes('math-inline') ||
          classes.includes('math-display') ||
          classes.includes('language-math') ||
          childClasses.includes('language-math');
        if (
          math &&
          config.theme.katex.enable &&
          (
            ctx.data.astro as
              import('@astrojs/markdown-satteri').SatteriAstroData | undefined
          )?.frontmatter?.katex !== false
        ) {
          if (
            node.tagName === 'code' &&
            (() => {
              const parent = ctx.parent(node);
              return parent?.type === 'element' && parent.tagName === 'pre';
            })()
          )
            return;
          return {
            type: 'raw',
            value: katex.renderToString(ctx.textContent(node), {
              displayMode:
                node.tagName === 'pre' || classes.includes('math-display'),
              throwOnError: false,
              trust: false,
            }),
          };
        }
      },
    },
  };
}
export function solitudeMath(config: SiteConfig): MdastPluginDefinition {
  const render = (
    node: { value: string },
    ctx: MdastVisitorContext,
    displayMode: boolean,
  ): ReturnType<NonNullable<MdastPluginDefinition['math']>> => {
    if (
      !config.theme.katex.enable ||
      (
        ctx.data.astro as
          import('@astrojs/markdown-satteri').SatteriAstroData | undefined
      )?.frontmatter?.katex === false
    )
      return;
    if (ctx.sourceFormat === 'mdx')
      return {
        type: displayMode ? 'mdxJsxFlowElement' : 'mdxJsxTextElement',
        name: 'SolitudeMath',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'code', value: node.value },
          {
            type: 'mdxJsxAttribute',
            name: 'display',
            value: String(displayMode),
          },
        ],
        children: [],
      };
    return {
      type: 'html',
      value: katex.renderToString(node.value, {
        displayMode,
        throwOnError: false,
        trust: false,
      }),
    };
  };
  return {
    name: 'solitude-math',
    math: (node, ctx) => render(node, ctx, true),
    inlineMath: (node, ctx) => render(node, ctx, false),
  };
}
