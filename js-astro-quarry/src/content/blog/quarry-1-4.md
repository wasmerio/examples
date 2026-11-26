---
title: 'Quarry 1.4: saved searches with live counts'
description: 'Quarry 1.4 adds live counts to saved searches and speeds up snippet extraction across the board.'
pubDate: 2026-09-11
tags: ['release', 'saved-searches']
author: 'Ada Example'
---

Quarry 1.4 is out today. The main addition is live counts on saved searches: a saved search now shows how many files currently match, and that number updates as your index changes, in both the desktop app and the CLI. Snippet extraction is also noticeably faster. The full list of changes ships with the release notes.

## What a saved search is

A saved search is a query you keep around instead of retyping. You give it a name, Quarry stores the query text, and it shows up in the sidebar of the app and in `quarry saved` on the command line. Before 1.4, running a saved search meant opening it and waiting for results like any other search. There was no way to know how many files matched without doing that.

## Live counts

Now each saved search shows a count next to its name. The count updates when the index changes, not on a timer, so it reflects the folder as it stands right now. If you keep a saved search for "TODO" across a notes vault, you see the number drop as you clear items, without opening the search.

On the command line, `quarry saved --watch` prints the same counts and keeps them updating in the terminal. This is useful for a quick check before a meeting, or as an input to a shell script that only needs the number, not the paths.

```sh
quarry saved --watch
```

## Why this took a while

Counting is not free. Naively, a live count means running the full query every time a watched file changes, which is wasteful if you have several saved searches and a folder that changes often. 1.4 adds a narrower path: when a file changes, Quarry checks which saved searches could plausibly be affected, based on the terms in each query, and only re-runs those. Most file changes touch zero saved searches, so most updates cost nothing.

## Faster snippets

The other change worth calling out is snippet extraction. A snippet is the short piece of text shown around a match in your results. Building good snippets used to mean reading a chunk of every matching file, even results near the bottom of a long list that a person is unlikely to look at. 1.4 defers snippet extraction until ranking is done, and only extracts for the hits actually being returned. On a result set of a few hundred matches trimmed to twenty, this cuts a meaningful amount of work.

You will notice this most in the HTTP endpoint, since it already has a `limit` parameter capping the returned set. Editor plugins that call the endpoint with a small `limit` should see faster responses without any change on their end.

## Saved search limits

Free plan users get more room here too: the saved search limit on Free goes from 3 to 10 with this release. Pro remains unlimited.

## What stayed the same

The query syntax itself did not change in 1.4, and neither did the index format, so there is no `quarry reindex` step required after upgrading, unlike the move to index format v2 back in 1.1.0. Existing saved searches keep working exactly as written; the only difference is that opening the sidebar or running `quarry saved` now shows a count next to each one instead of just a name.

The HTTP endpoint's request and response shape is also unchanged, so the VS Code and Neovim plugins need no update to keep working against a 1.4 daemon. If you build against the endpoint directly, nothing in this release should require touching your code.

## A small note on scope

Live counts are a small feature on paper, a number next to a name, but they came out of a specific complaint: people were opening saved searches just to check whether anything new had shown up, then closing them again without reading a single result. The count answers that question without opening anything. That is the kind of change we tend to make: narrow, aimed at a specific habit we saw people fall into, rather than a broad new surface.

## Getting 1.4

If auto-update is on, the app will offer this release on its own. From the CLI, `quarry` checks for updates the same way the app does, controlled by the same setting. Saved searches are created with `quarry save <name> <query>`, run with `quarry run <name>`, and listed with `quarry saved`.
