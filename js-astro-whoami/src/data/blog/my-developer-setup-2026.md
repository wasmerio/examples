---
title: "My Developer Setup in 2026"
description: "Tools, editors, and workflows I use daily for software development."
pubDate: 2026-01-10
tags: ["tools", "productivity"]
featured: false
---

Every year I take stock of the tools I actually use day-to-day. Not the ones I tried for a week, but the ones that stuck. Here's the current lineup.

## Editor

**VS Code** remains my primary editor. I've tried alternatives, but the extension ecosystem and the integrated terminal keep pulling me back. Key extensions:

- GitHub Copilot for inline completions
- ESLint and Prettier for formatting
- GitLens for blame annotations

## Terminal

**Warp** replaced iTerm2 for me this year. The AI command suggestions are genuinely useful, and the block-based output makes it easier to parse long build logs.

My shell is `zsh` with a minimal prompt showing the current directory and git branch. I avoid heavy frameworks like oh-my-zsh in favor of a hand-rolled config.

## Languages and Frameworks

The tools I reach for most often:

- **TypeScript** for anything web-related
- **Python** for data work and scripting
- **Astro** for static sites (like this one)
- **Tailwind CSS** for styling

## Workflow

I keep it simple:

1. Plan in markdown files
2. Build in short iterations
3. Commit frequently with conventional commits
4. Deploy through CI/CD pipelines

The theme across all of this is reducing friction. Every tool I use should make the path from idea to shipped code shorter. Anything that adds ceremony without value gets dropped.
