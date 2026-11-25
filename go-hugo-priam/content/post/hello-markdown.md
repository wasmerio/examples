---
title: Markdown Rules
description: This article offers a sample of basic Markdown syntax that can be used in Hugo content files.
author: Fabston
date: '2021-01-13'
lastmod: 0
toc: true
categories:
  - Markdown
  - Hugo
tags:
  - Hugo
  - Markdown
---

You can write regular [markdown](http://markdowntutorial.com/) here and [Hugo](https://gohugo.io) will automatically convert it to a nice webpage.  I strongly encourage you to [take 5 minutes to learn how to write in markdown](http://markdowntutorial.com/) - it'll teach you how to transform regular text into bold/italics/headings/tables/etc.

# Sample Text

## Second-level header

### Third-level header

#### Fourth-level header

A paragraph (with a footnote):

**Lorem ipsum** dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore _magna aliqua_. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.^[I'm sure you are bored by the text here.]

A blockquote (a blue bar at the left and lightgray background):

> Quisque mattis volutpat lorem vitae feugiat. Praesent porta est quis porta imperdiet. Aenean porta, mi non cursus volutpat, mi est mollis libero, id suscipit orci urna a augue. In fringilla euismod lacus, vitae tristique massa ultricies vitae. Mauris accumsan ligula tristique, viverra nulla sed, porta sapien. Vestibulum facilisis nec nisl blandit convallis. Maecenas venenatis porta malesuada. Ut ac erat tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla sodales quam sit amet tincidunt egestas. In et turpis at orci vestibulum ullamcorper. Aliquam sed ante libero. Sed hendrerit arcu lacus.

Here's a code chunk with <mark>Syntax</mark> and <mark>Line Highlighting</mark>:

```js {linenos=table, hl_lines=["6-9"]}
(function() {
  var quotes = document.getElementsByTagName('blockquote'), i, quote;
  for (i = 0; i < quotes.length; i++) {
    quote = quotes[i];
    var n = quote.children.length;
    if (n === 0) continue;
    var el = quote.children[n - 1];
    if (!el || el.nodeName !== 'P') continue;
    // right-align a quote footer if it starts with ---
    if (/^—/.test(el.textContent)) el.style.textAlign = 'right';
  }
})();
```

A table (centered by default):

| Sepal.Length| Sepal.Width| Petal.Length| Petal.Width|Species |
|------------:|-----------:|------------:|-----------:|:-------|
