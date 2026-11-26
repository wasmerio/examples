---
title: "Laws"
description: "Write rules behavior should keep."
group: "Abstractions"
section: "Abstractions"
order: 3
slug: "laws"
summary: "A law states an expected rule for a shape or behavior."
examples: "chapter-laws"
---

# Laws

A law records a rule that implementations should obey.

{{snippet:chapter-laws}}

## Laws document behavior

```musi
export let Eq [T] := shape {
  let eq (left : T, right : T) : Bool;

  law reflexive (value : T) := eq(value, value);
  law symmetric (left : T, right : T) := eq(left, right) = eq(right, left);
};
```

The law says every value should equal itself. That rule belongs near the behavior, not in a distant comment.

## Use laws for promises callers depend on

Good laws are small and testable: equality is reflexive, ordering is stable, encoding can round trip.

Do not use a law for a vague preference. Use plain docs for that.

## Law inputs

A law takes the values needed to state the rule. `reflexive` needs one value. `symmetric` needs two values.

The law body should be small. If the rule is hard to read, split helper behavior into named members before writing the law.
