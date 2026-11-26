---
title: 'Searching ten years of notes'
description: 'A guide to setting up one Quarry index over an old notes archive: what to exclude, and which queries actually pay off.'
pubDate: 2026-07-08
updatedDate: 2026-08-02
tags: ['guide', 'query-syntax']
author: 'Ada Example'
---

If you have been taking notes for a decade, you probably have a folder that has outgrown any app you have opened it in: old exports, half-finished drafts, a few years of a different note format, maybe a dumped export from a tool you stopped using. This is a good use case for Quarry, and this post walks through setting one index over that kind of archive.

## Step 1: point Quarry at the top-level folder

Start with one index over the whole archive rather than splitting it up by year or by old app. A single index makes it possible to search across the whole history in one query, which is usually the point of doing this in the first place.

```sh
quarry index ~/notes-archive
```

This kicks off an initial scan. Depending on how many files and how large your archive is, this can take a few minutes. `quarry status` shows progress while it runs.

## Step 2: figure out what to exclude

Old note archives accumulate things that are not notes: exported attachments, thumbnail caches from whatever app generated the export, and sometimes a full copy of an app's internal database file sitting next to the readable content. None of that is useful to search, and indexing it wastes disk space and time.

Add a `.quarryignore` file at the root of the archive, using the same syntax as a `.gitignore`:

```
*.sqlite
*.db
_attachments/
Thumbs.db
.DS_Store
```

Run `quarry reindex` after adding or changing `.quarryignore` so the exclusions take effect. Patterns that should apply everywhere rather than to one folder go in the settings file instead, under `exclude`.

## Step 3: check what actually got indexed

Before relying on the index, check that it covers what you expect. `quarry status` reports a file count; compare it against a rough count from `find` or your file manager. A number far lower than expected usually means a `.quarryignore` pattern is too broad, or a chunk of the archive is in a binary format Quarry cannot extract text from, such as scanned images without a text layer.

## Step 4: learn the handful of queries that pay off

A decade of notes rewards a few specific query patterns more than free-text search alone.

1. **Phrase search for names and terms you know you used consistently.** Quoting a phrase, `"project kickoff"`, narrows results to that exact sequence, which matters once free-text search on a large archive starts returning too much.
2. **`AND` between a topic and a date-adjacent word.** If you tag entries by year in the text itself, `budget AND 2019` narrows a broad topic to a specific period without needing separate indexes per year.
3. **Field-free searches for identifiers.** Ticket numbers, order numbers, and similar short unique tokens tend to be rare enough in an archive that a plain search for the token alone is precise, no phrase or boolean operator needed.
4. **Excluding a noisy term.** If a recurring word clutters results, for example a template header repeated in every daily note, `notes AND NOT template header` filters it out.

Boolean operators, phrase search and wildcards all work here too, in more depth than fits in this post.

## Step 5: save the queries you run more than once

Once you find a query pattern that works for a recurring lookup, such as everything tagged with a particular project, save it. Saved searches show up in both the app and `quarry saved` on the command line, so a query you would otherwise retype every few weeks becomes a single click or command.

## What this is not good for

An archive-wide index is good at finding a document you know exists but cannot place, or a term you remember but cannot remember where you wrote it. It is not a replacement for organizing the archive itself. Quarry does not move, rename or restructure your files, and a badly organized archive stays badly organized after indexing. What changes is that you no longer need to open every folder to find something in it.

## One index or several

It is worth being explicit about why one index over the whole archive is usually the right call rather than one index per year or per old app. A query against a single index is one command and one set of results, ranked together. Splitting the archive into several indexes means running the same query against each one and combining results yourself, which defeats a lot of the point of indexing the archive in the first place. The exception is a genuinely separate collection, work notes versus a personal journal, say, where you never want the two mixed in results; that is a reasonable case for two indexes, each named clearly, rather than one.

## Keeping it current

Once the initial index is built, the daemon watches the archive for changes the same way it would for any other folder, so new notes you add going forward show up within seconds without a manual step. If the archive lives on an external drive that is not always connected, searches against it will simply return nothing while the drive is unplugged; nothing breaks, there is just nothing to search until the folder is available again. `quarry status` will show the index as present but unreachable in that case, rather than reporting an error.

## A note on old formats

If parts of the archive are in a format Quarry cannot read text from, such as a proprietary export with no plain-text or Markdown equivalent, that content will not show up in results no matter how the index is configured. Converting those files to Markdown or plain text before indexing is the only fix; Quarry does not do format conversion itself.
