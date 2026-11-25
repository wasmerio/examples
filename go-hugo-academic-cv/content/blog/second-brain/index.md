---
title: 🧠 Sharpen your thinking with a second brain
summary: Create a personal knowledge base and share your knowledge with your peers.
date: 2023-10-26
authors:
  - me
tags:
  - Second Brain
  - Markdown
image:
  caption: 'Image credit: [**Unsplash**](https://unsplash.com)'
cover:
  image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2560"
  position:
    x: 50
    y: 40
  overlay:
    enabled: true
    type: "gradient"
    opacity: 0.4
    gradient: "bottom"
  fade:
    enabled: true
    height: "80px"
  icon:
    name: "✨"
---


Create a personal knowledge base and share your knowledge with your peers.

Hugo Blox web framework empowers you with one of the most flexible note-taking capabilities out there.

Create a powerful knowledge base that works on top of a local folder of plain text Markdown files.

Use it as your second brain, either publicly sharing your knowledge with your peers via your website, or via a private GitHub repository and password-protected site just for yourself.

## Mindmaps

Hugo Blox supports a Markdown extension for mindmaps.

With this open format, can even edit your mindmaps in other popular tools such as Obsidian.

Simply insert a Markdown code block labelled as `markmap` and optionally set the height of the mindmap as shown in the example below.

Mindmaps can be created by simply writing the items as a Markdown list within the `markmap` code block, indenting each item to create as many sub-levels as you need:

<div class="highlight">
<pre class="chroma">
<code>
```markmap {height="200px"}
- Hugo Modules
  - Hugo Blox
  - netlify
  - netlify-cms
  - slides
```
</code>
</pre>
</div>

renders as

```markmap {height="200px"}
- Hugo Modules
  - Hugo Blox
  - netlify
