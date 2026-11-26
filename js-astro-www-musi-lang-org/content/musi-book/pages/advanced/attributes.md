---
title: "Attributes"
description: "Attach a small note to a name."
group: "Advanced forms"
section: "Advanced forms"
order: 1
slug: "attributes"
summary: "Attributes add extra information to declarations."
examples: "chapter-attributes"
---

# Attributes

An attribute adds a note to a declaration. It starts with `@`.

{{snippet:chapter-attributes}}

Use attributes when a name needs extra information that is not part of the normal value. A native link name or target condition can live there.

Attributes should be rare in normal app code. If a note is business data, put it in a normal value instead.

## Attribute shape

Attributes attach metadata to the declaration that follows them.

```musi
@link(symbol := "sys.target.os")
native "musi" let targetOsIntrinsic () : String;
```

The attribute is not the value. It tells the compiler or tooling how to treat the declaration.

## Use attributes narrowly

Use attributes for compiler links, native bindings, and target gates. Do not use them as a replacement for records, options, or normal configuration values.
