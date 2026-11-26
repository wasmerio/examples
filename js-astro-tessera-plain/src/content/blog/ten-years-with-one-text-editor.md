---
title: "Ten years with one text editor"
description: "Everything I write starts as plain text in the same small program. Here is why that has not changed."
date: 2026-02-15
tags: [tools, writing]
---

Every piece I have written in the last ten years, including this one, started in the same place: a plain text editor with a grey window, no toolbar, and nothing to click. It is not a fashionable choice. Writers I know use writing apps with typewriter modes and word count goals and gentle animations, and they write good things in them. I keep coming back to the empty window.

## Plain text, and why

The argument for plain text is old and I will keep it short. The files are small, they open in anything, they will still open in anything in twenty years, and they contain nothing but what I typed. When I send a draft to an editor I convert it at the last moment. Until then it is a `.md` file in a folder, and the folder is backed up in three places without any help from a company.

There is a second reason, less practical. A plain window has no opinion. It does not suggest a synonym, count my words unless I ask, or tell me my sentence is hard to read. Sometimes a sentence should be hard to read. I would rather find that out myself, on the second pass, than be nudged out of it on the first.

## The whole setup

People ask what the configuration looks like, expecting something elaborate. Here it is, in its entirety:

```text
font: a monospaced face, 15px
line length: 72 columns, soft wrap
spell check: on
everything else: off
```

The editor has hundreds of settings and I have changed four of them. The important one is the line length. Seventy-two columns is about the width of a typed page, and it keeps me from writing the long, looping sentences I fall into when the line runs to the edge of the screen.[^1]

<figure>
  <img src="/images/editor.svg" alt="A line drawing of a plain editor window with a few lines of text and a block cursor at the end of the last line" width="800" height="500" loading="lazy" decoding="async">
  <figcaption>The whole interface. The cursor is the only thing that moves.</figcaption>
</figure>

## What it is bad at

Honesty requires a list:

- Footnotes are a chore, and I use a lot of them.
- Tables are worse.
- Sharing a draft with someone who wants to comment in the margin means leaving the editor, and I resent it every time.
- There is no way to see two versions side by side without opening a second window and squinting.

None of these have been bad enough to make me move. The alternatives fix one of them and add three habits I do not want.

## Ten years

A carpenter I know has used the same hand plane since he was an apprentice. He said something about it that I wrote down at the time:

> A tool you never think about is a tool you can finally use.

That is the whole appeal. I no longer see the editor. I see the sentence, and whether it is right, and that is the only thing I want a writing tool to leave me with.

[^1]: Soft wrap matters here. The file has no line breaks in it; the editor just draws the text at seventy-two columns. Send the file to anyone and it reflows to whatever width they have.
