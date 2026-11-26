---
title: "Localized from day one"
date: 2026-02-02
description: "A demo of the per-page fallback that keeps missing translations from 404-ing."
tags: ["i18n"]
---

# Localized from day one

Every page has an English default and a Chinese shell. When a Chinese version is
missing, the hub renders the English body inside the Chinese layout and shows a
small notice — instead of a 404.

This post has no `zh-Hans` counterpart, so visiting `/zh-Hans/posts/localized-sample/`
shows exactly that fallback behavior. Ship your default language first, then
translate incrementally.
