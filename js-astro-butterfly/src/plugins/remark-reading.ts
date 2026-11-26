import type { Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { countWords } from '../lib/wordcount';

/** Expose word count and reading minutes to `remarkPluginFrontmatter`. */
export default function remarkReading() {
  return (tree: Root, file: { data: { astro?: { frontmatter?: Record<string, unknown> } } }) => {
    const stats = countWords(toString(tree));
    const fm = (file.data.astro ??= {}).frontmatter ??= {};
    fm.wordcount = stats.words;
    fm.minutes = stats.minutes;
  };
}
