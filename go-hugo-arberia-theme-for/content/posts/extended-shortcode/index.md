---
title: Extended Shortcode
subtitle: Specific theme shortcode
date: 2022-08-03T10:53:18+02:00
lastmod: 2022-08-03T10:53:18+02:00
draft: false
weight: 940

author: author name
authorLink: /about
avatar: /img/me.png
description: 

tags:
  - shortcode
  - hugo
categories:
  - theme-usage

hiddenFromHomePage: false
hiddenFromSearch: false

resources:
  - name: featured-image
    src: extended-shortcodes.webp

type: # Nothing for default, or video 
  null
featured: false
sidebar: true
toc: true
math:
  enable: false
lightgallery: false
license: ""
slug: extended-shortcode
---


**Arberia Theme** provides multiple built-in shortcodes for author convenience and to keep your markdown content clean. To expand your possibility this is an example list of all provided shortcodes.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
## Alert

Shortcode to inset varius alert on markdown post use this code:

```markdown
{{</* alert-info "[**Click here to get an example of info alert**](https://antedoro.it/) followed in this tutorial."*/>}}
{{</* alert-success "[**Click here to get an example of info alert**](https://antedoro.it/) followed in this tutorial."*/>}}
{{</* alert-warning "[**Click here to get an example of info alert**](https://antedoro.it/) followed in this tutorial."*/>}}
{{</* alert-danger "[**Click here to get an example of info alert**](https://antedoro.it/) followed in this tutorial."*/>}}
{{</* alert-dark "[**Click here to get an example of info alert**](https://antedoro.it/) followed in this tutorial."*/>}}
```

{{< alert-info "[**Click here to get an example of info alert**](https://antedoro.it/) followed in this tutorial.">}}

{{< alert-success"[**Click here to get an example of success alert**](https://antedoro.it/) followed in this tutorial.">}}

{{< alert-warning"[**Click here to get an example of warning alert**](https://antedoro.it/) followed in this tutorial.">}}

{{< alert-danger"[**Click here to get an example of danger alert**](https://antedoro.it/) followed in this tutorial.">}}

{{< alert-dark "[**Click here to get an example of dark alert**](https://antedoro.it/) followed in this tutorial.">}}

## List Element

{{< list-element  title="Who I am?"  link="/about/" photo="featured-image.png" summary="My name is Vincenzo Antedoro. I was born and grew up in south of Italy. In my challenge of creativity, I was ispired from near ancient greek culture and mediterranean in general.">}}

## Gallery

{{< gallery dir= "img" >}}

## Image

{{< image "artwork.webp" "Caption">}} 

## Video 
