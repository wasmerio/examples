+++
title = 'HTML Page Support'
summary = 'Learn how to use HTML syntax for your Pages'
date = 2023-02-15T10:00:00-07:00
draft = false
tags = ['HTML', 'markup']
+++

Single pages and lists allow content to be specified as HTML or Markdown.

Markdown content, by default, is pre-wrapped to work out of the box with no configuration.

If you want to be able to have control over your page content, this theme will serve your content without pre-wrapping.

## Configuring HTML Markup on Pages

Given the following page content

```md
---
title: 'HTML Support'
markup: 'md'
---

My Content
```

The generated HTML will look like this:

```html
<section class="wrapper style5">
  <div class="inner">
    <p>My Content</p>
  </div>
</section>
```

To achieve the same thing with markup set to HTML, you would need to include the section and div attrs:

```md
