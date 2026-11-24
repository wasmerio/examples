+++
title = "(Hu)go Template Primer"
displayInMenu = false
displayInList = true
draft = false
tags = [
    "go",
    "golang",
    "templates",
    "themes",
    "development",
]
date = "2014-04-02"
categories = [
    "Development",
    "golang",
]
[resources]
name = "featuredImage"
src = "lucas-benjamin-565254-unsplash.jpg"

[resources.params]
description = "A jellyfish with neon colors with a dark background"
+++

Hugo uses the excellent [Go][] [html/template][gohtmltemplate] library for
its template engine. It is an extremely lightweight engine that provides a very
small amount of logic. In our experience that it is just the right amount of
logic to be able to create a good static website. If you have used other
template systems from different languages or frameworks you will find a lot of
similarities in Go templates.

This document is a brief primer on using Go templates. The [Go docs][gohtmltemplate]
provide more details.

## Introduction to Go Templates

Go templates provide an extremely simple template language. It adheres to the
belief that only the most basic of logic belongs in the template or view layer.
One consequence of this simplicity is that Go templates parse very quickly.
