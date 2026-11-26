import { describe, expect, it } from 'vitest';
import { ExpressiveCode, loadShikiTheme } from 'astro-expressive-code';
import type { Element } from 'hast';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import config from '../../ec.config.mjs';

const source = 'const nested = wrap([item(1), [2, 3]]);\nconst text = "([not code])";\n// ([comment])';

async function renderLines(colorize: boolean) {
  const engine = new ExpressiveCode({
    ...config,
    themes: [await loadShikiTheme('one-dark-pro')],
    shiki: colorize ? config.shiki : { transformers: [] },
  });
  const { renderedGroupAst } = await engine.render({ code: source, language: 'ts' });
  const lines: Element[] = [];
  visit(renderedGroupAst, 'element', (node) => {
    if ((node.properties.className as string[] | undefined)?.includes('code')) lines.push(node);
  });
  return lines;
}

const tokens = (line: Element) => line.children
  .filter((node): node is Element => node.type === 'element')
  .map((node) => ({ text: toString(node), color: String(node.properties.style).toLowerCase() }));

describe('code bracket highlighting', () => {
  it('colours nested parentheses and square brackets while keeping each pair matched', async () => {
    const lines = await renderLines(true);
    const brackets = tokens(lines[0]).filter((token) => /^[()[\]]$/.test(token.text));
    expect(brackets.map((token) => token.text).join('')).toBe('([()[]])');
    expect(new Set(brackets.map((token) => token.color)).size).toBeGreaterThan(1);
    const stack: typeof brackets = [];
    for (const token of brackets) {
      if ('(['.includes(token.text)) stack.push(token);
      else {
        const opener = stack.pop()!;
        expect(opener.text).toBe(token.text === ')' ? '(' : '[');
        expect(token.color).toBe(opener.color);
      }
    }
    expect(stack).toHaveLength(0);
    expect(lines.map((line) => toString(line)).join('\n')).toBe(source);
  });

  it('preserves the normal highlighting of brackets inside strings and comments', async () => {
    const [colored, baseline] = await Promise.all([renderLines(true), renderLines(false)]);
    expect(tokens(colored[1])).toEqual(tokens(baseline[1]));
    expect(tokens(colored[2])).toEqual(tokens(baseline[2]));
  });
});

describe('code block size', () => {
  const render = async (lines: number) => {
    const engine = new ExpressiveCode({ ...config, themes: [await loadShikiTheme('one-dark-pro')] });
    const { renderedGroupAst } = await engine.render({ code: Array.from({ length: lines }, (_, i) => `line ${i}`).join('\n'), language: 'txt' });
    return renderedGroupAst.properties;
  };

  it('collapses long blocks in the HTML and records every block line count', async () => {
    const short = await render(17);
    expect(short.className).not.toContain('is-limited');
    expect(String(short.style)).toContain('--ec-lines:17');
    const long = await render(18);
    expect(long.className).toEqual(expect.arrayContaining(['is-limited', 'has-expand']));
    expect(String(long.style)).toContain('--ec-lines:18');
  });
});
