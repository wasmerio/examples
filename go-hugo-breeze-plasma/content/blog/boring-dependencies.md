---
title: The quiet value of boring dependencies
date: 2025-09-03
description: Every dependency is a small bet on someone else's future. I prefer the bets that have already paid off for a decade.
tags: [engineering, culture]
---


When I pick a library, I now ask three questions before I read the README.

## How old is it?

A library that has been maintained for ten years will probably be maintained next year. A library that appeared last month might not be.

## How small is it?

Small dependencies are easy to read, easy to vendor, and easy to replace. Large ones become part of your architecture whether you like it or not.

## Who else depends on it?

If thousands of serious projects rely on it, its bugs are found by someone else first.

> The best code is the code you don't have to own.

None of this means *never use new things*. It means new things should earn their place.
