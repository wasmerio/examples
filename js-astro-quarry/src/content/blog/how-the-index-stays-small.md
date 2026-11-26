---
title: 'How the index stays small'
description: 'A look at the postings file and the snippet store, and why a Quarry index runs about 4% of the size of what it indexes.'
pubDate: 2026-08-20
tags: ['engineering', 'index']
author: 'Ada Example'
---

People sometimes expect a search index to be roughly the same size as the files it covers, maybe larger once you account for indexing overhead. Quarry's index usually lands around 4% of the size of the source folder. This post covers the two structures that make that possible, the postings file and the snippet store, and the tradeoffs behind each.

## Three files, one index

Each index Quarry builds, stored under `~/.local/share/quarry/<index-name>/`, is made of three pieces: a postings file, a document table, and a snippet store. All three are rebuildable from the source files, which is why the whole directory is safe to delete; `quarry reindex` recreates it from scratch.

| File           | Holds                       | Typical share of index size |
| -------------- | --------------------------- | --------------------------- |
| Postings file  | Term to document mappings   | ~55%                        |
| Document table | Paths, sizes, timestamps    | ~15%                        |
| Snippet store  | Text fragments for previews | ~30%                        |

## The postings file

A postings file is the classic inverted index structure: for every term that appears anywhere in your files, it stores a list of which documents contain that term and where. The naive version of this is large, because storing a document ID and a position for every single occurrence of every word adds up fast on a large corpus.

Quarry keeps this small in a few ways. Terms are stored once, in a sorted list, and each posting is a delta against the previous document ID rather than the ID itself, which compresses well because document IDs within a posting list tend to cluster. Position data, used for phrase queries, is stored separately from the base postings, so a query that does not need positions does not pay to skip over them.

```json
{
  "term": "invoice",
  "df": 412,
  "postings": [
    { "doc_delta": 3, "positions": [12, 340] },
    { "doc_delta": 7, "positions": [8] }
  ]
}
```

That is a simplified view of the logical structure. On disk it is packed with variable-length integers, not JSON, but the shape is the same. Common terms compress especially well because their posting lists are long and their deltas are small.

The arithmetic is short. A posting stores the gap $g_i = d_i - d_{i-1}$ instead of the document ID $d_i$, and a variable-length integer spends one byte on every seven bits of it:

$$
\text{bytes}(g) = \left\lceil \frac{\lfloor \log_2 g \rfloor + 1}{7} \right\rceil
$$

Any gap under 128 fits in one byte. In a long posting list almost every gap does, where a raw 32-bit ID would take four.

## The document table

The document table is the smallest of the three and the least interesting to optimize, since it is one fixed-size record per file: a path, a size, a modification time, and a content hash used to detect changes without re-reading the file. Its size scales with the number of files, not their content, so it stays proportionally tiny even on a folder with a few very large files.

## The snippet store

The snippet store is where the size tradeoff gets more interesting. A snippet is the short piece of text shown around a match, and building one on the fly from the original file at search time would mean an open and a read of that file for every hit, every search. That is slow enough to matter, especially on a spinning disk or a network mount, so Quarry precomputes candidate snippets at index time and stores them.

Storing every possible snippet for every term would be enormous, so the snippet store only keeps text around positions likely to be queried: the start of each document, section or paragraph breaks where the format allows detecting them, and a bounded window around less common terms, which are the ones most likely to be searched for specifically. Very common terms, such as "the" or "and", get no stored snippet at all, since a search for those alone is rare and Quarry falls back to reading the file directly in that case.

Snippets are also stored compressed, using the same general-purpose compression as the rest of the index, and truncated to a maximum length. A very long paragraph containing a match does not produce a proportionally long stored snippet; it produces a fixed-size window around the match.

## Why 4%

Put together, a source folder heavy on plain text and Markdown, the common case, produces an index around 4% of the source size. Three things drive that ratio down:

1. Delta encoding and compression in the postings file, which shrinks the largest of the three structures the most.
2. A document table that scales with file count rather than file size.
3. A snippet store that stores fragments, not full copies of every file.

The ratio moves depending on content. Source code, with its high ratio of distinct short tokens to file size, tends to push the postings file larger relative to the source, since more of the file's bytes turn into indexable terms. A folder of large PDFs with sparse text layers tends to produce a smaller index relative to source size, since a lot of the PDF's bytes are not text at all.

## Why not just compress the source files

An obvious alternative would be to skip building separate structures and instead just keep a compressed copy of the source alongside a simple term list. That would be less code, but it would not answer a search quickly. Finding every file containing a term, in a compressed blob of the original files, means decompressing and scanning, which does not scale past a small folder. The postings file exists specifically so a search is a lookup, not a scan: read the entry for a term, walk its list of document deltas, done. The size cost of maintaining that structure separately from the source is the price of that lookup being fast.

The snippet store is a similar tradeoff in miniature. Skipping it entirely and reading the source file at search time would save the 30% of index size it typically uses, at the cost of a file read per hit on every search. For a folder on local disk, that cost is small but non-zero; for a folder on a network mount or an external drive, it is often the slowest part of a search. Precomputing snippets moves that cost to index time, once per file, instead of paying it on every search that happens to match.

## Rebuilding versus updating

Both the postings file and the snippet store support incremental updates: when a single file changes, Quarry does not rebuild the whole index, it updates the entries touched by that file. This matters for the size story too, because an index format that only supported full rebuilds would need extra headroom for a rebuild-in-place strategy, or would need to write a full second copy before discarding the old one. Incremental updates avoid both, which is part of why `quarry reindex` after an index format change, like the one in 1.1.0, is the exception rather than the normal path; day to day, the index updates itself in place as files change.

## What this means day to day

The practical upshot is that indexing does not need much headroom on disk. A 50 GB notes and documents folder, at 4%, is roughly 2 GB of index. That is small enough to sit on the same disk as the source with room to spare, and small enough that `quarry reindex` after an index format change, like the one in 1.1.0, is a matter of minutes rather than an event you plan around.

If you want to see the actual numbers for your own index, `quarry status` reports on-disk size per index alongside file counts. The three files are laid out in the order they are read, and `quarry status --verbose` prints the rest of what it knows about each one.
