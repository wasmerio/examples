---
date: 2025-04-04 12:00:00 +00:00
params:
  icon: 🧑‍🎨
  list_title: Posts
---

A simple and minimal single-author theme with configurable big emoji as the header link, and configurable background colors, which can be chosen for each post or page. [Sample craziness](/colors/).

![Sample](/images/repo-card.webp "{style='box-shadow: 5px 5px black;'}")

## The Idea

The main idea of [Hugo Theme Emojification](https://github.com/michaelnordmeyer/hugo-theme-emojification) is to create a bold but minimal theme for single-author blogs, which can be configured in its appearance *for each post or page*; mainly the background color and the emoji.

It uses only a single color, the background color, and uses only white and black for the text on the page. White for headings 1 to 3, black for the rest. Links are in the same color as the black body text, but underlined in white. Visited links are underlined in black. Especially saturated colors work well with the white and black text.

And if that much color is not your thing but you like the rest, there is a black and a white variant called “colorless”.

## Previews

This demo has two categories each having the same style. [Features in gold](/features/) and [manuals in hotpink](/manuals/), while the rest of the site is colorless, meaning light during the day and dark during the night with auto-switching.

In the [posts from 2023 below](#2023) are a variety of color-matching emoji. Matching was done with Apple emoji, YMMW.

## Special Cases

The color grey has only a single foreground color and links are colored in a two-tone style, which was derived from the appearance of Apple’s interpretation of Unicode’s [“teacup without handle”](https://emojipedia.org/teacup-without-handle#designs). Visited links are less saturated. The contrast is not great, though.

I run the grey theme on [my home page](https://michaelnordmeyer.com/).

## Limited, But Useful Features

- Clean, minimalist design
  - Single-column
  - Single-author
  - No visible authors, categories, or tags on posts or pages
  - No header, footer, or menu
  - No pagination for the home page or any other index page to effectively be the archive and allow for searching all titles in-browser
  - System fonts without the dependence on possibly tracking third-parties
- Posts
- Pages
- Fancy category pages
- Styled redirection and error pages
- Built-in Atom feed and sitemap.xml creation without category and tag pages so they don't compete on search engine result pages with post content
- Theme-color-matching favicons
