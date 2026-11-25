import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

// Injects `minutesRead` — a *number* — into every Markdown/MDX entry's
// frontmatter, exposed at render time via `remarkPluginFrontmatter`.
//
// The plugin deliberately does not format the value: `reading-time`'s own
// `.text` is hard-coded English ("3 min read"), which would survive every
// `SITE.locale` change. Templates render it through `t('post.readingTime')`.
export function remarkReadingTime() {
  return (tree, { data }) => {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // `Math.ceil`, matching what `reading-time`'s own `.text` reported before,
    // with a floor of 1 so a one-line note never reads "0 min".
    data.astro.frontmatter.minutesRead = Math.max(1, Math.ceil(readingTime.minutes));
  };
}
