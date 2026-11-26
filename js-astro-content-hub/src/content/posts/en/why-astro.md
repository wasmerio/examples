---
title: "Why a static site generator"
date: 2026-01-19
description: "Notes on why a static site fits a content hub better than a database-backed CMS."
tags: ["meta", "architecture"]
---

# Why a static site generator

A content hub does not need a server. Every page can be rendered at build time
and served as plain files from GitHub Pages or Cloudflare Pages — for free.

Static output also means:

- **Fast**: no server-side rendering per request.
- **Safe**: no database to breach, no runtime to patch.
- **Portable**: the `dist/` folder is plain HTML, CSS, and JS.

That is why this template is built on a static-site generator and deployed to
free static hosts.
