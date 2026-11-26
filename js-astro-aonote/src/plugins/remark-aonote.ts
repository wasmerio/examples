import { preprocessMarkdown } from '../utils/markdown-preprocess';
import { remarkCodeMeta } from './remark-code-meta';
import remarkDeflist from 'remark-deflist';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Root } from 'mdast';

/** Re-parse markdown after Aonote-specific string preprocessing. */
export function remarkAonotePreprocess() {
  return (tree: Root, file: { value?: unknown }) => {
    const source = String(file.value ?? '');
    const processed = preprocessMarkdown(source);
    const normalize = (value: string) => value.replace(/\s+$/, '');
    if (normalize(processed) === normalize(source)) return;

    const parsed = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkDeflist)
      .use(remarkDirective)
      .use(remarkEmoji)
      .parse(processed) as Root;

    tree.children = parsed.children;
  };
}

export { remarkTableCaptions } from './remark-table-captions';

export {
  remarkCodeMeta,
  remarkDeflist,
  remarkDirective,
  remarkDirectiveRehype,
  remarkEmoji,
  remarkGfm,
  remarkMath,
};
