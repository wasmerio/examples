---
title: "Why I Stopped Using a Monorepo for Personal Projects"
date: 2026-04-22T10:00:00+08:00
draft: false
tags: [engineering, craft]
---


Going back to separate repos is about one thing: pace shouldn't be synchronized by tooling.

## The original temptation

A monorepo seems to solve everything: shared dependencies, unified linting, one build. For a team, those things matter.

For one person? They become friction.

## What changed my mind

When every project is in the same repo, every commit feels heavier. You start thinking about the side effects on other projects. You start writing tighter commit messages. You start *not* shipping the half-baked thing.

That last one sounds good — until you realize the half-baked thing was the whole point of doing personal projects.

