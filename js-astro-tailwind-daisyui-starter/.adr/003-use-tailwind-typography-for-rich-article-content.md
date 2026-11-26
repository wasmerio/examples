# 3. Use Tailwind Typography for rich article content

Status: Accepted
Status Date: 2026-04-21
Driver: Alexander Holbreich
Contributors: —

## Context

The starter includes a blog and content-first pages. Rich article content needs
readable defaults for:

- headings
- paragraphs
- lists
- code blocks
- images
- blockquotes

An earlier approach used a custom `.content-rich` class in `src/styles/global.css`
to style rendered Markdown and MDX content.

Problems with the custom approach:

- It created a starter-specific article styling layer that developers had to
  learn before they could adapt blog content.
- It duplicated styling concerns already covered by Tailwind's official
  Typography plugin.
- It drifted away from the repository's preferred styling order:
  DaisyUI components first, Tailwind utilities second, custom CSS last.

The project already uses DaisyUI as the default UI layer and Tailwind CSS 4 for
layout and utilities.

## Decision

Use Tailwind Typography for rendered article content.

Specifically:

- enable `@tailwindcss/typography`
- render blog post bodies with `prose`
- keep page-level layout in Tailwind utilities
- avoid a custom rich-text stylesheet unless a concrete gap appears that cannot
  be solved cleanly with DaisyUI classes, Typography plugin output, or a small
  local utility

### Consequences

- Article content gets predictable and well-supported defaults from the official
  Tailwind plugin.
- The starter stays closer to documented DaisyUI and Tailwind patterns.
- Developers can recognize and adapt the content styling more quickly than they
  could with a starter-specific `.content-rich` layer.
- Rich article styling remains easy to remove or customize because it is driven
  by one plugin and page markup rather than a growing custom stylesheet.

## Options considered

### Option 1: Keep a custom `.content-rich` class

Works, but adds maintenance burden and introduces a project-specific styling
layer for something Tailwind already supports well.

### Option 2: Use Tailwind Typography with DaisyUI and Tailwind utilities (chosen)

Matches the intended styling hierarchy of the starter and relies on maintained,
well-understood tooling.

### Option 3: Leave article content mostly unstyled

Reduces dependencies slightly, but produces a worse out-of-the-box reading
experience for a starter that explicitly includes blog/content support.

## Advices

When adjusting article presentation in this repository:

1. start with `prose` and its utility modifiers
2. use DaisyUI classes around the article shell where helpful
3. add custom CSS only for narrow gaps that are hard to express otherwise
