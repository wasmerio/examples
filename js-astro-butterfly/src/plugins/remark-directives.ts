import type { Root, Parent, PhrasingContent, RootContent } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import { visit, SKIP } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { iconUri, faToIconify } from '../theme/icons-css';
import { music } from '../config';

/**
 * Renders the blog's directive vocabulary (replacing Butterfly tag plugins).
 * Markup uses the Hexo-era class names (Butterfly + hexo-butterfly-tag-plugins-plus)
 * so styles/tag-plugins.css can reproduce their original look.
 *
 *   :::note{.default .flat icon="fas fa-x"}   → Butterfly note variants GitHub alerts can't express
 *   :::tip{type=home .faa-horizontal .animated} → tip callout with icon badge
 *   :::details[title]{.green open} … :::      → native <details>
 *   ::::tabs / :::tab[label] … ::: / ::::     → accessible tab set
 *   :span[text]{.red .center .logo .h3}        → coloured / display text
 *   :radio[text]{.cyan checked}  :checkbox[…] → read-only option marks
 *   :spoiler[text]                            → hidden until hover/focus
 *   :tooltip[word]{tip="…" color="#71a4e3"}   → speech-bubble note (tag-plugins-plus bubble)
 *   ::music{id server type}                   → APlayer playlist (hydrated client-side)
 *   ::site{name url screenshot avatar description} → site card
 *
 * Unknown directives are turned back into plain text, so prose like `中文:abc`
 * never silently disappears.
 */

type Directive = ContainerDirective | LeafDirective | TextDirective;
type Props = Record<string, unknown>;

const classes = (d: Directive) => (d.attributes?.class ?? '').split(/\s+/).filter(Boolean);

function setH(d: { data?: unknown }, hName: string, hProperties: Props = {}) {
  d.data = { ...((d.data as object) ?? {}), hName, hProperties };
}

/** Remove and return the `[label]` paragraph of a container directive. */
function takeLabel(d: ContainerDirective): PhrasingContent[] | undefined {
  const first = d.children[0];
  if (first?.type === 'paragraph' && (first.data as { directiveLabel?: boolean } | undefined)?.directiveLabel) {
    d.children.shift();
    return first.children;
  }
  return undefined;
}

/** A paragraph node rendered as an arbitrary element. */
const el = (hName: string, hProperties: Props, children: PhrasingContent[]) =>
  ({ type: 'paragraph', data: { hName, hProperties }, children }) as unknown as RootContent;

/** Flow content wrapped in an arbitrary element (blockquote can hold blocks). */
const wrap = (hName: string, hProperties: Props, children: RootContent[]) =>
  ({ type: 'blockquote', data: { hName, hProperties }, children }) as unknown as RootContent;

const span = (className: string, children: PhrasingContent[]) =>
  ({ type: 'emphasis', data: { hName: 'span', hProperties: { className: [className] } }, children }) as PhrasingContent;

const img = (url: string, className: string) =>
  ({ type: 'image', url, alt: '', data: { hProperties: { className: [className], loading: 'lazy', decoding: 'async' } } }) as PhrasingContent;

function restoreText(node: Directive, parent: Parent, index: number) {
  const label = node.type === 'textDirective' ? node.children : [];
  const attrs = node.attributes && Object.keys(node.attributes).length
    ? `{${Object.entries(node.attributes).map(([k, v]) => (v ? `${k}="${v}"` : k)).join(' ')}}`
    : '';
  const prefix = node.type === 'textDirective' ? ':' : node.type === 'leafDirective' ? '::' : ':::';
  const inline: PhrasingContent[] = [
    { type: 'text', value: `${prefix}${node.name}${label.length ? '[' : ''}` },
    ...label,
    { type: 'text', value: `${label.length ? ']' : ''}${attrs}` },
  ];
  if (node.type === 'textDirective') {
    parent.children.splice(index, 1, ...(inline as never[]));
  } else {
    const rest = node.type === 'containerDirective' ? node.children : [];
    parent.children.splice(index, 1, { type: 'paragraph', children: inline } as never, ...(rest as never[]));
  }
}

export default function remarkDirectives() {
  return (tree: Root, file: { message?: (m: string) => unknown }) => {
    let tabsCounter = 0;

    visit(tree, (node, index, parent) => {
      if (node.type !== 'containerDirective' && node.type !== 'leafDirective' && node.type !== 'textDirective') return;
      const d = node as Directive;
      const attrs = d.attributes ?? {};
      const cls = classes(d);

      switch (`${d.type}:${d.name}`) {
        case 'containerDirective:note': {
          // Butterfly: style defaults to the theme's `note.style` (flat)
          const style = ['flat', 'modern', 'simple', 'disabled'].some((x) => cls.includes(x)) ? [] : ['flat'];
          const c = d as ContainerDirective;
          if (attrs.icon) {
            c.children.unshift({
              type: 'paragraph',
              data: {
                hName: 'i',
                hProperties: { className: ['note-icon'], style: `--note-icon:${iconUri(faToIconify(attrs.icon))}`, ariaHidden: 'true' },
              },
              children: [],
            } as never);
          }
          setH(d, 'div', { className: ['note', ...cls, ...style, ...(attrs.icon ? ['icon-padding'] : [])], role: 'note' });
          return;
        }

        case 'containerDirective:tip': {
          setH(d, 'div', { className: ['tip', attrs.type || 'info', ...cls], role: 'note' });
          return;
        }

        case 'containerDirective:details': {
          // tag-plugins-plus folding: colour is an attribute, body sits in div.content
          const c = d as ContainerDirective;
          const label = takeLabel(c) ?? [{ type: 'text', value: '展开' }];
          const color = cls.find((x) => x !== 'open');
          c.children = [
            el('summary', {}, label) as never,
            wrap('div', { className: ['content'] }, c.children as RootContent[]) as never,
          ];
          setH(d, 'details', { className: ['folding-tag'], dataColor: color, open: 'open' in attrs ? true : undefined });
          return;
        }

        case 'containerDirective:tabs': {
          const c = d as ContainerDirective;
          const id = `tabs-${++tabsCounter}`;
          const tabs = c.children.filter(
            (x): x is ContainerDirective => x.type === 'containerDirective' && x.name === 'tab',
          );
          const buttons = tabs.map((tab, i) => {
            const label = takeLabel(tab) ?? [{ type: 'text', value: `Tab ${i + 1}` } as PhrasingContent];
            setH(tab, 'div', {
              className: ['tab-panel'], role: 'tabpanel', id: `${id}-p${i}`,
              ariaLabelledBy: `${id}-t${i}`, tabIndex: 0, hidden: i === 0 ? undefined : true,
            });
            return {
              type: 'emphasis',
              data: {
                hName: 'button',
                hProperties: {
                  type: 'button', role: 'tab', id: `${id}-t${i}`, ariaControls: `${id}-p${i}`,
                  ariaSelected: i === 0 ? 'true' : 'false', tabIndex: i === 0 ? 0 : -1,
                },
              },
              children: label,
            } as PhrasingContent;
          });
          c.children = [el('div', { className: ['tab-list'], role: 'tablist' }, buttons) as never, ...tabs];
          setH(d, 'div', { className: ['tabs'], dataTabs: '' });
          return;
        }

        case 'containerDirective:tab':
          return; // handled by tabs

        case 'textDirective:span':
          setH(d, 'span', { className: ['p', ...cls] });
          return;

        case 'textDirective:radio':
        case 'textDirective:checkbox': {
          // tag-plugins-plus: <div class="checkbox cyan checked"><input type="radio" checked><p>…</p></div>
          const t = d as TextDirective;
          const checked = 'checked' in attrs;
          const input = {
            type: 'emphasis',
            data: { hName: 'input', hProperties: { type: d.name, checked, disabled: true, tabIndex: -1, ariaHidden: 'true' } },
            children: [],
          } as unknown as PhrasingContent;
          const label = {
            type: 'emphasis',
            data: { hName: 'span', hProperties: { className: ['checkbox-label'] } },
            children: t.children,
          } as unknown as PhrasingContent;
          t.children = [input, label];
          setH(d, 'span', {
            className: ['checkbox', ...cls.filter((x) => x !== 'checked'), ...(checked ? ['checked'] : [])],
            role: d.name, ariaChecked: String(checked), ariaReadOnly: 'true',
          });
          return;
        }

        case 'textDirective:spoiler':
          setH(d, 'span', { className: ['psw'], tabIndex: 0, title: '悬停或聚焦以显示' });
          return;

        case 'textDirective:tooltip': {
          // tag-plugins-plus bubble: the word, then a notched speech bubble that flips in on hover
          if (!parent || typeof index !== 'number') return;
          setH(d, 'span', { className: ['bubble-content'], tabIndex: 0 });
          const bubble = {
            type: 'emphasis',
            data: { hName: 'span', hProperties: { className: ['bubble-notation'] } },
            children: [
              {
                type: 'emphasis',
                data: {
                  hName: 'span',
                  hProperties: { className: ['bubble-item'], role: 'tooltip', style: `background-color:${attrs.color || '#71a4e3'}` },
                },
                children: [{ type: 'text', value: attrs.tip ?? '' }],
              },
            ],
          } as unknown as PhrasingContent;
          (parent as Parent).children.splice(index + 1, 0, bubble as never);
          return [SKIP, index + 2];
        }

        case 'leafDirective:music': {
          setH(d, 'div', {
            className: ['music-embed'], dataMeting: '',
            dataId: attrs.id, dataServer: attrs.server ?? 'netease', dataType: attrs.type ?? 'playlist', dataApi: music.api,
          });
          (d as LeafDirective).children = [{ type: 'text', value: '歌单加载中…' }];
          return;
        }

        case 'leafDirective:site': {
          const l = d as LeafDirective;
          // tag-plugins-plus site card: a.site-card > .img > img + .info > img + .title + .desc
          setH(l, 'a', { className: ['site-card'], href: attrs.url, target: '_blank', rel: 'noopener' });
          l.children = [
            span('img', [img(attrs.screenshot ?? '', 'site-card-shot')]),
            span('info', [
              ...(attrs.avatar ? [img(attrs.avatar, 'site-card-avatar')] : []),
              span('title', [{ type: 'text', value: attrs.name ?? '' }]),
              span('desc', [{ type: 'text', value: attrs.description ?? '' }]),
            ]),
          ];
          return;
        }

        default: {
          if (!parent || typeof index !== 'number') return;
          if (d.type !== 'textDirective') file.message?.(`Unknown directive "${d.name}" (${toString(d).slice(0, 40)})`);
          restoreText(d, parent as Parent, index);
          return [SKIP, index];
        }
      }
    });
  };
}
