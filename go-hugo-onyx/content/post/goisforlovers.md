+++
title = "(Hu)go Template Primer"
date = 2014-04-02
tags = ["go", "golang", "development", "templates", "themes"]
categories = ["Development", "golang"]
draft = false
[menu.main]
  weight = 2002
  identifier = "hu--go-template-primer"
+++

Hugo uses the excellent [go](https://golang.org/) [html/template](https://golang.org/pkg/html/template/) library for its template
engine. It is an extremely lightweight engine that provides a very
small amount of logic. In our experience that it is just the right
amount of logic to be able to create a good static website. If you
have used other template systems from different languages or
frameworks you will find a lot of similarities in go templates.

This document is a brief primer on using go templates. The [go docs](https://golang.org/pkg/html/template/)
provide more details.


## Introduction to Go Templates {#introduction-to-go-templates}

Go templates provide an extremely simple template language. It adheres
to the belief that only the most basic of logic belongs in the
template or view layer. One consequence of this simplicity is that go
templates parse very quickly.

A unique characteristic of go templates is they are content aware.
Variables and content will be sanitized depending on the context of
where they are used. More details can be found in the [go docs](https://golang.org/pkg/html/template/).


## Basic Syntax {#basic-syntax}

Go lang templates are html files with the addition of variables and
functions.

**Go variables and functions are accessible within {{ }}**
