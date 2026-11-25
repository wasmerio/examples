---
title: 'Showcase'
description: 'This article offers a sample of basic Markdown syntax that can be used in Astro content files, also it shows whether basic HTML elements are decorated with CSS in the Astro Terminal theme.'
pubDate: 2019-03-11
author: 'Hugo Authors, Radek'
tags: []
---

This article offers a sample of basic Markdown syntax that can be used in Astro content files, also it shows whether basic HTML elements are decorated with CSS in the Astro Terminal theme.

## Headings

The following HTML `<h1>`—`<h6>` elements represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest.

# H1
## H2
### H3
#### H4
##### H5
###### H6

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Images

![Terminal Theme Preview](https://raw.githubusercontent.com/panr/hugo-theme-terminal/refs/heads/master/images/terminal-theme.png?raw=true)

### Figure with a caption

<figure>
  <img src="https://raw.githubusercontent.com/panr/hugo-theme-terminal/refs/heads/master/images/terminal-theme.png?raw=true" alt="Terminal Theme Preview">
  <figcaption>
    <p>Terminal Theme Preview</p>
  </figcaption>
</figure>

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

### Blockquote without attribution

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use *Markdown syntax* within a blockquote.

### Blockquote with attribution

> Don't communicate by sharing memory, share memory by communicating.  
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## Buttons and links

<button>Button</button>
<a href="#">Link</a>

## Tables

Tables aren't part of the core Markdown spec, but Astro supports them out-of-the-box.

### Basic Table

| Name | Age |
| ---- | --- |
| Bob | 27 |
| Alice | 23 |

### Inline Markdown within tables

| Italics | Bold | Code |
| ------- | ---- | ---- |
| *italics* | **bold** | `code` |

## Forms

<fieldset>
  <input type="text" placeholder="Type something"><br>
  <input type="number" placeholder="Insert number"><br>
  <input type="text" value="Input value"><br>
  <select>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </select><br>
  <textarea placeholder="Insert a comment..."></textarea><br>
  <label>
    <input type="checkbox"> I understand<br>
  </label>
  <button type="submit">Submit</button>
</fieldset>

## Code Blocks

### Code block with backticks

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```

For more examples for different programming languages, please go to [code showcase](/blog/code-blocks-examples/).

## List Types

### Ordered List

1. First item
2. Second item
3. Third item

### Unordered List

* List item
* Another item
* And another item

### Nested list

* Fruit
  * Apple
  * Orange
  * Banana
* Dairy
  * Milk
  * Cheese

## Other Elements — abbr, sub, sup, kbd, mark

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.