---
title: 👩🏼‍🏫 Teach academic courses
summary: Embed videos, podcasts, code, LaTeX math, and even test students!
date: 2023-10-24
math: true
authors:
  - me
tags:
  - Hugo
  - HugoBlox Kit
  - Markdown
image:
  caption: 'Embed rich media such as videos and LaTeX math'
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


[HugoBlox Kit](https://hugoblox.com) is designed to give technical content creators a seamless experience. You can focus on the content and the HugoBlox Kit which this template is built upon handles the rest.

**Embed videos, podcasts, code, LaTeX math, and even test students!**

On this page, you'll find some examples of the types of technical content that can be rendered with Hugo Blox.

## Citation

Here's an example of citing a publication using the cite shortcode:

{{< cite page="/publications/preprint" view="citation" >}}

You can also use the default view by omitting the view parameter:

{{< cite page="/publications/conference-paper" >}}

## Video

Teach your course by sharing videos with your students. Choose from one of the following approaches:

**Youtube**:

    {{</* youtube D2vj0WcvH5c */>}}

{{< youtube D2vj0WcvH5c >}}

**Bilibili**:

    {{</* bilibili BV1WV4y1r7DF */>}}


**Video file**

Videos may be added to a page by either placing them in your `assets/media/` media library or in your [page's folder](https://gohugo.io/content-management/page-bundles/), and then embedding them with the _video_ shortcode:

    {{</* video src="my_video.mp4" controls="yes" */>}}

## Podcast
