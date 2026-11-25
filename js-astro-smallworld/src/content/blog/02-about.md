---
title: About this template
description: This Markdown cheat sheet provides a quick overview of all the Markdown syntax elements.
pubDate: 2025-01-17
tags:
  - astro
  - template
---

This template is based on a few key principles for my own site:

- I wanted a basic website with a single-author blog.
- The website should incorporate accessible and usable elements.
- Complex systems should be avoided in favor of simpler ones.
- I should be able to easily understand what I see.

The result is an Astro template that heavily limits the use of CSS classes, and maximizes the use of semantic HTML.

## Features

### Pico CSS

The template uses Pico CSS to benefit from good-looking default settings with responsive layouts. It needs almost no classes to work well, which is the goal.

I use the SASS version of Pico CSS to remove unnecessary styles and reduce the final CSS size.

### Semantic HTML

This template tries to maximize the use of semantic HTML tags over generic ones like `<div>`. Semantic HTML has significant benefits:

1. HTML source is easier to read and write.
2. Semantic HTML is recommended over ARIA attributes for accessibility.
3. Semantic styling works well with Pico CSS.

### Static output

The template tries to not go beyond static HTML. No client JavaScript, no cookies.

### Limited NPM packages

The template limits the number of NPM packages to those I found useful, such as:

- Prettier, for code readability
- SASS and Pico CSS, to avoid having to think about CSS
- The Astro RSS integration

### Quality-of-life features

The template has a few features that seemed like a good idea, even though they're not as minimal:

- A styled RSS feed
- An Open Graph image for social networks
- Post tags and tag pages
- A post and page template
- Absolute imports in `tsconfig.json`

## Future developments

There are more things I would like to implement:

- [] Figure out where to put the Tags page.
- [] Add a `pages` content collection.
- [] Add a navigation link component
- [] Organize Astro components better
- [] Integrate icons
- [] More...?

## Acknowledgments

- The [Astro Pico](https://github.com/san-ghun/astro-pico) template, for introducing me to Pico CSS.
- The [Astronaut](https://github.com/stevefrenzel/astro-naut) template, for helping me learn better responsiveness principles.
