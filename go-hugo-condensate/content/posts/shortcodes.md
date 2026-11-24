---
title: "Shortcodes"
date: 2026-10-25T17:00:00
tags: ["Features"]
description: A demo of the shortcodes Condensate supports for images, gists and video.
toc: true
---

Shortcodes let a post embed things that plain Markdown can't. This page shows each one the theme supports.

<!--more-->

The gist, YouTube and Vimeo embeds are click-to-load. Nothing is requested from GitHub, YouTube or Vimeo until you click a card, and the content then runs in a sandboxed iframe. That keeps readers' browsing private by default.

## Image

A full-width image with a caption:

```
{{</* figure src="/images/condensate.svg" alt="Soft circles condensing into a droplet" caption="Vapor, condensing." */>}}
```

{{< figure src="/images/condensate.svg" alt="Soft circles condensing into a droplet" caption="Vapor, condensing." >}}

The same image at a smaller size, using `width`:

```
{{</* figure src="/images/condensate.svg" alt="Soft circles condensing into a droplet" width="320" caption="A smaller image." */>}}
```

{{< figure src="/images/condensate.svg" alt="Soft circles condensing into a droplet" width="320" caption="A smaller image." >}}

Images are served from the same site. Hosting them yourself, instead of linking to another site, means a reader's browser never contacts a third party just to see a picture. Plain Markdown works too: `![alt text](/images/condensate.svg)`.

## GitHub Gist

```
{{</* gist spf13 7896402 */>}}
```

{{< gist spf13 7896402 >}}

To show a single file from a gist, add `file`: `{{</* gist user="spf13" id="7896402" file="gist.go" */>}}`.

## YouTube video

```
