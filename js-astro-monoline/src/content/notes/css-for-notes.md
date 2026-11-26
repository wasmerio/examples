---
title: CSS for a notes site, for someone who isn't a developer
date: 2026-04-14
updated: 2026-05-02
description: Four lines of CSS I changed on my own notes page, and what each one did.
tags: [tools, writing]
---

I am not a developer. I can read CSS well enough to change a value and break nothing, which is about the level I need to run a small notes page. Last month I wanted the text to feel less cramped, so I opened the stylesheet and changed four lines.

```css
body {
  max-width: 62ch;
  line-height: 1.6;
  font-size: 18px;
  color: #222;
}
```

The `ch` unit was new to me. Wren, who writes code for a living, explained that it is roughly the width of a zero in the current font, so `62ch` means a line that holds about 62 characters. That is close to the length that books use, and it is the single change that made the page feel calmer.

## What I tried and reverted

I tried a font size of 20px and it looked like a children's book. I tried pure black text and it felt harsh on a white page, so I settled on a very dark grey. I also tried `line-height: 1.8` and the paragraphs began to look like separate sentences.

Each of those experiments took about a minute. What I like about this is that nothing feels irreversible. I keep the old values in a comment, and every few weeks I tidy them away.

For the habit of keeping things as plain files, see [quiet tools](/notes/quiet-tools). For the typography, I read [Butterick's Practical Typography](https://practicaltypography.com) over two evenings and used about a tenth of it.
