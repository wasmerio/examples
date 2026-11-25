---
title: "A type scale for interfaces that shout"
date: 2026-08-07
description: "Seven steps, one ratio, and why the body size is 16px even in a 1995 costume."
categories: ["Typography"]
tags: ["typography", "tokens", "css"]
cover: "images/covers/typography.svg"
---


Windows 95 shipped at 96 DPI with an 8pt UI font. Reproducing that number today
produces text nobody can read on a phone, which is the difference between an
homage and a re-enactment.

## Steps, not sizes

`--retro-font-size-xs` through `-3xl`, all in `rem`, all derived from one body
size. A component asks for a step, never a pixel value, so a site that raises
the base size moves everything with it.

## Where the costume stops

The chrome is authentic: square corners, bevels lit from the top-left, a grey
chassis. The reading experience is not negotiable — 16px body text, a line
height near 1.5, and a measure that stops around 72 characters.

