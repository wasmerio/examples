import temml from 'temml';
import type { Element, ElementContent, Root, RootContent } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

function isElement(node: unknown): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as { type: string }).type === 'element'
  );
}

function toElementContent(children: RootContent[]): ElementContent[] {
  return children.filter((child): child is ElementContent => child.type !== 'doctype');
}

function isMathCode(node: Element): boolean {
  const lang = node.properties?.className;
  const classes = Array.isArray(lang) ? lang : lang ? [lang] : [];
  return classes.some(
    (c) => typeof c === 'string' && (c === 'language-math' || c === 'math-inline' || c === 'math-display'),
  );
}

function wrapMathml(mathml: string, display: boolean): Element {
  const fragment = fromHtml(mathml, { fragment: true });
  const math = fragment.children.find(
    (c): c is Element => c.type === 'element' && c.tagName === 'math',
  );
  if (math) {
    math.properties = { ...math.properties, display: display ? 'block' : 'inline' };
  }
  return {
    type: 'element',
    tagName: display ? 'div' : 'span',
    properties: { className: ['arithmatex'] },
    children: (() => {
      const content = toElementContent(fragment.children);
      return content.length ? content : [{ type: 'text', value: mathml }];
    })(),
  };
}

/** Static MathML output (upstream arithmatex + latex2mathml), no KaTeX runtime CSS. */
export function rehypeAonoteMathml() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (!parent || index == null || node.tagName !== 'code' || !isMathCode(node)) return;

      const latex = toString(node).trim();
      if (!latex) return;

      if (!isElement(parent)) return;

      const display = parent.tagName === 'pre';
      let mathml: string;
      try {
        mathml = temml.renderToString(latex, { displayMode: display });
      } catch {
        return;
      }

      const wrapper = wrapMathml(mathml, display);
      if (display && parent.tagName === 'pre') {
        parent.children[index] = wrapper;
      } else {
        parent.children[index] = wrapper;
      }
    });
  };
}
