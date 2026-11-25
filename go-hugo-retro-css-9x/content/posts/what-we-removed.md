---
title: "What we removed in 3.0, and why"
date: 2026-07-30
description: "A changelog entry about deletion, which is the part of a release nobody advertises."
categories: ["Changelog"]
tags: ["releases", "maintenance"]
cover: "images/covers/release.svg"
---


## The `!important` on the radius reset

It was load-bearing by accident. Dropping it woke thirty-one dormant radius
declarations and rounded eleven components — which is why 3.0.0 was followed by
3.0.1 the same week.

## A documentation renderer

Unmaintained since 2022, its output was never published, and it accounted for
every security advisory in the dependency tree. The SassDoc comments stayed;
only the renderer left.

## What deletion buys

Every line you remove is a line that cannot break, cannot need patching, and
cannot surprise the next person reading the file.

