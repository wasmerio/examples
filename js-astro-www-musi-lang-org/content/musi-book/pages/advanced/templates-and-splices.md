---
title: "Templates and splices"
description: "Put values inside text."
group: "Advanced forms"
section: "Advanced forms"
order: 4
slug: "templates-and-splices"
summary: "Templates build text from fixed parts and values."
examples: "chapter-templates-and-splices"
---

# Templates and splices

A template builds text from fixed parts and values.

{{snippet:chapter-templates-and-splices}}

Use templates for labels, messages, and small formatted strings. The text stays visible, and the inserted value has a clear place.

This is like writing a shipping label with one blank box for the order number.

Do not build large documents with one long template. Use smaller named pieces.

## Template shape

A template keeps fixed text and inserted values together.

```musi
let port := 8080;
let label := `server:${port}`;
```

Use templates for messages, labels, and simple generated text. The literal text stays visible, and each inserted value has one clear slot.

## Splice policy

Name inserted values before using them when the expression is more than a simple name.

```musi
let displayPort := port + 1;
let label := `next:${displayPort}`;
```

This makes the template about formatting, not hidden computation.
