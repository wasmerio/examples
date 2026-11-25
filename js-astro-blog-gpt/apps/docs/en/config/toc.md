# Table of Contents and Code Blocks

Long technical posts are much easier to read with a responsive outline and readable code blocks. You can configure both in `blog.config.ts`.

## Table of Contents (`article.toc`)

BlogGPT automatically extracts headings (`<h2>` through `<h4>` by default) from your Markdown posts to build an interactive, collapsible table of contents:

```ts
export default {
  article: {
    toc: {
      enabled: true, // Enable the table of contents globally
      minDepth: 2, // Highest heading level to include (2 = <h2>)
      maxDepth: 4, // Lowest heading level to include (4 = <h4>)
      expandDelay: 1000, // Hover/interaction delay (ms) before auto-expanding
      hideDelay: 800, // Delay (ms) before collapsing after pointer leaves
    },
  },
};
```

To hide the table of contents on a specific short post or page, add `toc: false` to its YAML frontmatter.

## Code Blocks (`appearance`)

Syntax highlighting is powered by **Expressive Code** (Shiki), with automatic light/dark theme switching and a one-click copy button on every code block:

```ts
export default {
  appearance: {
    codeThemes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    showCodeLineNumbers: false, // Set to true to show line numbers by default
  },
};
```

### Tips for Markdown Code Blocks

- **Language label & syntax highlighting**: Specify the language right after the opening backticks (e.g., ` ```ts ` or ` ```bash `).
- **File title header**: Add `title="blog.config.ts"` after the language tag to render a clean filename bar above the code block.
- **Line highlighting**: Use `{2,4-6}` after the language tag to highlight specific lines.
