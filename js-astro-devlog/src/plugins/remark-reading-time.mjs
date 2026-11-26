import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro = data.astro || {};
    data.astro.frontmatter = data.astro.frontmatter || {};
    data.astro.frontmatter.readingTime = readingTime.text;
    data.astro.frontmatter.words = readingTime.words;
    data.astro.frontmatter.minutes = Math.max(1, Math.ceil(readingTime.minutes));
  };
}

