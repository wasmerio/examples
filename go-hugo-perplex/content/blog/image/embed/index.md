---
authors: [Georg Makowski]
title: Embedded images
description: Demo for enhanced inline images
subtitle: false
featured: micro
date: 2023-03-23T10:10:51+01:00
categories: [markdown]
tags: [image, embedded]
series: [images]
---


Demo for the layout options of enhanced embedded images.
{.p-first}
<!--more-->

The documentation of the Markdown syntax is filed under [basic image](https://perplex.desider.at/doc/basic/image) and [enhanced image](https://perplex.desider.at/doc/enhancing/image/syntax). The [concept demo](https://perplex.desider.at/doc/enhancing/image/embed) contains width parameters.

## At the beginning of a text block

### Small width (default)

![](small-left?anchor=Center) {{% pangram 15 %}}
{.placeholder data-pagefind-ignore="all"}

![](small-right) {{% pangram 15 %}}
{.placeholder data-pagefind-ignore="all"}

### Tiny width

![](tiny-left) {{% pangram 15 %}}
{.placeholder data-pagefind-ignore="all"}

![](tiny-right) {{% pangram 15 %}}
{.placeholder data-pagefind-ignore="all"}

### Micro width

![](micro) {{% pangram 9 %}}
{.placeholder data-pagefind-ignore="all"} 

![](micro?ph=right) {{% pangram 9 %}}
{.placeholder data-pagefind-ignore="all"}

## In the middle of a text block

Small and tiny images need some additional spacing when they are placed in the middle of a text block:

{{% pangram 4 %}} ![](small-left?pv=middle) {{% pangram 6 %}}
{.placeholder data-pagefind-ignore="all"}
