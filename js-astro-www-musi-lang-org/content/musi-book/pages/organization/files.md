---
title: "Files"
description: "Keep related names in one file."
group: "Organization"
section: "Organization"
order: 1
slug: "files"
summary: "A file is the first unit a reader opens. Keep it small and focused."
examples: "chapter-files"
---

# Files

A file should hold names that belong together. A small file is easier to scan than a large mixed file.

{{snippet:chapter-files}}

Put receipt rules near receipt data. Put route rules near route data. Do not make one file a drawer for every helper.

A file is like one page in a binder. If the page needs many unrelated headings, it likely wants to become more than one page.

Use exports only for names another file needs.

## File boundary

One file should have one clear reason to change.

```musi
export let defaultServer := { host := "localhost", port := 8080 };

export let defaultPort := defaultServer.port;
```

Keep private helper names private. Export values and functions that other files actually use.

## Split point

Split a file when it mixes unrelated data, unrelated effects, or unrelated public APIs. A file named `server.ms` should not also own payment rules.
