---
title: notegrep
description: Ranked full-text search for a folder of Markdown notes. Ten thousand notes, answers in 27 ms, no server.
repo: https://github.com/alexrivera/notegrep
updated: 2026-07-30
---

![Terminal running notegrep "postgres vacuum" with four ranked hits, highlighted matches and index stats](/images/demo/projects/notegrep.webp "Four ranked hits in 27 ms.")

notegrep is a command-line search for plain-text notes. It builds an inverted index of your notes folder the first time you run it, keeps it up to date on every search, and ranks results with BM25 so the note you want is first.

```sh
npx notegrep "postgres vacuum"
```

## Features

- **Ranked results.** Titles count more than body text, and recent notes get a small boost.
- **Always current.** Changed files are re-indexed on the next search. There is no daemon to run.
- **Small.** The index for 10,412 notes is 9 MB and builds in 4 seconds.
- **Plain output.** `--json` prints results for scripts and editor plugins.

## Options

| Flag | Default | What it does |
| --- | --- | --- |
| `--top <n>` | `10` | Number of results |
| `--dir <path>` | `.` | Notes folder to search |
| `--since <date>` | none | Only notes changed after this date |
| `--json` | off | Print JSON instead of text |
| `--stats` | off | Show index size and timings |

How it works, with benchmarks against grep and ripgrep: [Searching ten thousand notes in 27 ms](/blog/searching-ten-thousand-notes).
