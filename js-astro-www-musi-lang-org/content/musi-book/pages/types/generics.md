---
title: "Generics"
description: "Write one form that works with many types."
group: "Types"
section: "Types"
order: 5
slug: "generics"
summary: "Generics let code keep one shape while the item type changes."
examples: "chapter-forall-types"
---

# Generics

A generic form works with more than one type. It keeps the same idea and changes the item type.

{{snippet:chapter-forall-types}}

A box can hold an `Int` or a `String`. The box idea stays the same. The item type changes.

Generics help remove copied code. Use them when the rule is truly the same for many types.

`partial` marks a definition that is not complete yet. Use it only as a clear edge while a type-level idea is still being filled in. Normal app code should prefer complete definitions.

{{snippet:chapter-dependent-types}}

Use generics when one rule really works for many item types. If the rule changes by type, prefer separate names or a shape.
