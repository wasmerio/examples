---
categories:
  - "Development"
  - "golang"
date: 2014-04-02
description: 'This document is a brief primer on using go templates'
tags: ['go', 'golang', 'templates', 'themes', 'development']
title: '(Hu)go Template Primer'
author: 'Hugo'
---


Hugo uses the excellent [go][] [html/template][gohtmltemplate] library for
its template engine. It is an extremely lightweight engine that provides a very
small amount of logic. In our experience that it is just the right amount of
logic to be able to create a good static website. If you have used other
template systems from different languages or frameworks you will find a lot of
similarities in go templates.

This document is a brief primer on using go templates. The [go docs][gohtmltemplate]
provide more details.

## Introduction to Go Templates

Go templates provide an extremely simple template language. It adheres to the
belief that only the most basic of logic belongs in the template or view layer.
One consequence of this simplicity is that go templates parse very quickly.

A unique characteristic of go templates is they are content aware. Variables and
content will be sanitized depending on the context of where they are used. More
details can be found in the [go docs][gohtmltemplate].

## Basic Syntax

Go lang templates are html files with the addition of variables and
functions. 

**Go variables and functions are accessible within {{ }}**

Accessing a predefined variable "foo":

    {{ foo }}

**Parameters are separated using spaces**

Calling the add function with input of 1, 2:

    {{ add 1 2 }}

**Methods and fields are accessed via dot notation**
