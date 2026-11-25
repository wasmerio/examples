---
title: "Building a component that is square on purpose"
date: 2026-08-28
description: "Corners are a token, not a decision made 40 times."
categories: ["Components"]
tags: ["css", "components"]
cover: "images/covers/components.svg"
---


## One token

Every component routes its corners through `--retro-border-radius`, so one
declaration rounds the whole framework.

## The exceptions

Pills are named for their shape, and tables ignore `border-radius` outright
because `border-collapse: collapse` merges their cell borders.

