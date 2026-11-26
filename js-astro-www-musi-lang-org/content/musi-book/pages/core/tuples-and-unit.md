---
title: "Tuples and unit"
description: "Use tuples for fixed groups and `()` for no data."
group: "Core expressions"
section: "Core expressions"
order: 2
slug: "tuples-and-unit"
summary: "A tuple groups values by position. Unit means no useful value."
examples: "chapter-tuples-and-unit"
---

# Tuples and unit

A tuple groups a few values by position. Use it when the group is small and the order is obvious.

{{snippet:chapter-tuples-and-unit}}

A pair like `(8080, "ready")` can work for a quick return value. If the values need names, use a record instead.

`()` is unit. It means there is no useful data to carry. You may see it when an action matters more than a returned value.

A tuple is like holding two tickets in one hand. Unit is like an empty hand.

## Tuple positions

Tuple values are read by position, not by field name. Keep tuples small so the positions stay obvious.

```musi
let server := (8080, "ready");
let fallback := (3000, "fallback");
```

Use a tuple when the meaning is clear from the surrounding code. A return like `(port, label)` is fine inside a small helper. A value that travels across files should usually be a record.

## Unit

`()` is a real value. It says "nothing useful is returned."

```musi
let empty := ();
empty;
```

Use unit when the expression has no useful data to carry.
