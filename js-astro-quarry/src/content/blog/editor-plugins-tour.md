---
title: 'A tour of the editor plugins'
description: 'What the VS Code and Neovim plugins do, what they deliberately leave out, and how they talk to Quarry.'
pubDate: 2026-05-14
tags: ['plugins', 'editors']
author: 'Mireu Sandoval'
---

Quarry has two editor plugins, one for VS Code and one for Neovim. Both do the same job from different editors: put a search box in front of you without leaving the editor, and open a result at the right line. Neither plugin re-implements search. They are thin clients over the HTTP endpoint, which does the actual work.

## What they do

Both plugins add a command that opens a search prompt inside the editor. Type a query, results appear as you type or on submit depending on the editor's conventions, and selecting a result opens the file at the matched line with the surrounding text visible. That is the core of it.

The VS Code plugin adds a sidebar view listing your saved searches, with the same live counts introduced in Quarry 1.4, so you can see how many files match without running the search. The Neovim plugin, added in 1.3.0, exposes the same data through a Lua API rather than a built-in view, since Neovim users tend to want to build their own surface for this kind of thing.

```lua
require('quarry').search('invoice AND q3', function(hits)
  for _, hit in ipairs(hits) do
    print(hit.path, hit.score)
  end
end)
```

That callback-based API is what the bundled picker integration uses internally, and it is available to anyone who wants a different picker or a custom keybinding built on top of it.

## What they do not do

Neither plugin indexes anything on its own. They assume an index already exists, built by the app or the CLI, and they read from it. If you open a folder in your editor that Quarry has never indexed, searches will come back empty, not because the plugin is broken but because there is nothing to search yet. `quarry index` is a separate step.

Neither plugin writes anything back to the index, or to your files. A search is a GET request against a read-only endpoint; there is no path from either plugin that creates, deletes or modifies a file, changes settings, or triggers a rebuild. That is a property of the endpoint itself, not something the plugins add on top.

Neither plugin does its own matching or ranking. Results, their order and their scores come directly from Quarry's ranking, the same ranking you would get from `quarry search` or a raw request to the endpoint. The plugins format what comes back; they do not second-guess it.

## Setup

Both plugins need the HTTP endpoint turned on, which is a Pro feature; see [/pricing](/pricing) for plan details. With the endpoint on and the daemon running, each plugin needs only the port, which defaults to 7433 and rarely needs changing unless something else on your machine already uses it.

```sh
quarry daemon --serve
```

Point the plugin at that port following its own setup instructions, and confirm the wiring with a plain request:

```sh
curl '127.0.0.1:7433/search?q=test'
```

A response with a `hits` array, even an empty one, means the plugin has something to talk to.

## Why the plugins are this thin

It would be possible to build a plugin that keeps its own copy of search state, caches results locally, or reimplements parts of ranking to feel more responsive inside the editor. We have deliberately not done that. Every bit of logic duplicated in a plugin is logic that can drift from what the CLI and the app do, and a search that behaves differently depending on where you typed it is worse than a plugin with fewer features. Keeping the plugins as thin clients over the same endpoint means a fix or a ranking change in Quarry itself shows up in the editor automatically, with no plugin update required.

## What is not covered yet

There is no JetBrains plugin at the time of writing, and no plans to announce one on a specific date. If you use an editor without a dedicated plugin, the HTTP endpoint is a plain read-only API, and the curl example above works the same regardless of what is calling it; a short script bound to a keyboard shortcut in your editor of choice covers a fair amount of the same ground.
