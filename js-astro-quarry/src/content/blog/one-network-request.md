---
title: 'One network request'
description: 'What Quarry sends over the network: a single update check, and nothing else.'
pubDate: 2026-06-02
tags: ['privacy']
author: 'Ada Example'
---

Quarry makes exactly one network request: an update check. Everything else, indexing, searching, snippets, saved searches, happens entirely on your machine, reading and writing files under your home directory. Nothing is uploaded, and nothing is synced.

## What the update check sends

Once a day at most, Quarry asks a small endpoint for the current version number. The request carries the installed version and the operating system, macOS or Linux, and nothing else: no file paths, no search history, no index contents, no identifier tied to you or your machine. The response is a version string and, if a newer release exists, a URL to the release notes.

## Turning it off

The update check can be switched off entirely in settings. With it off, Quarry makes zero network requests during normal use. You will need to check the release notes yourself to know when a new version ships, but nothing about search, indexing or any other feature depends on the check running.

## Why this is the whole story

There is no server component to Quarry beyond the update check and, for Pro and Team, license verification at activation. No account system holds your data, because there is no account beyond a license key. No telemetry runs in the background collecting usage patterns. The HTTP endpoint, which Pro plans can turn on for editor plugins, binds to `127.0.0.1` only and is unreachable from outside your machine.

This is a design decision, not an oversight. Quarry indexes files you have not chosen to put anywhere else, and the tool should not be the thing that moves them off your disk. The request carries the current version and the platform, and nothing else; `quarry update --dry-run` prints exactly what would be sent. If you want to confirm this on your own machine, a network monitor will show a single outbound connection, once a day, and nothing else while you index and search.

## What Pro and Team add

License verification for Pro and Team happens once, at activation, and is separate from the daily update check described above. It confirms a license key against a small licensing service and does not run again on a schedule. Beyond that one activation call, Pro and Team behave exactly like Free with respect to the network: the HTTP endpoint they can turn on is local only, and Team's shared rule files sync between a group's own machines through whatever mechanism the group already uses for that, not through anything Quarry operates. Quarry does not become more networked as you move up plans; the extra features a paid plan turns on stay local either way.
