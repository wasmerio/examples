---
title: "Images, Covers and Captions"
date: 2026-09-02T18:30:00+02:00
description: "Cover images, responsive images inside posts, and figures with captions."
image: cover.jpg
imageAlt: "Red and white diagonal stripes on black, with a white panel in the middle."
categories: [Guides]
tags: [images, hugo]
---


A post with `image: cover.jpg` in its front matter gets a cover under the title, a thumbnail on its note in the home page, and uses the image as its link preview instead of the generated card.

## Images in the text

Images that live next to the post (a *page bundle*) get their width and height, so the page does not jump while they load, and a `srcset` so phones download a smaller file:

![A halftone of black dots fading into a red corner.](halftone.png)

## Figures with a caption

A standalone image with a title becomes a figure when Hugo renders block images (`markup.goldmark.parser.wrapStandAloneImageWithinParagraph = false`). Otherwise the title is kept as a tooltip.

![The same halftone, this time with a title.](halftone.png "Halftone, drawn for this example")

## Remote images

Images from another site (an absolute URL) are left as they are, lazy-loaded. Hugo cannot measure them, so give them room in your layout.

