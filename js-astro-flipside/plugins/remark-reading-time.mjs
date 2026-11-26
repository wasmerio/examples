import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

// Astro's official reading-time recipe: computed from the rendered Markdown
// tree (post-remark, pre-rehype), so it counts the same text readers see.
// `reading-time` counts CJK text per character rather than per word, so
// Chinese posts still get a sane estimate. Exposed on
// `remarkPluginFrontmatter.minutesRead`, consumed by [...slug].astro.
export function remarkReadingTime() {
  return (tree, { data }) => {
    const readingTime = getReadingTime(toString(tree));
    data.astro.frontmatter.minutesRead = Math.max(
      1,
      Math.round(readingTime.minutes),
    );
  };
}
