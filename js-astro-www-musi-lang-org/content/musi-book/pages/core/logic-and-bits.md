---
title: "Logic and bits"
description: "Use word operators for Boolean checks and integer bit work."
group: "Core expressions"
section: "Core expressions"
order: 6
slug: "logic-and-bits"
summary: "`and`, `or`, `xor`, and `not` combine checks. `shl` and `shr` shift integer bits."
---

# Logic and bits

Musi uses words for logic and bit-like integer operations. Word operators keep condition lines readable.

## Boolean logic

Use logic operators with Boolean values.

| Operator | Meaning                                      |
| -------- | -------------------------------------------- |
| `and`    | produce `.True` only when both sides pass    |
| `or`     | produce `.True` when at least one side passes |
| `xor`    | produce `.True` when exactly one side passes |
| `not`    | flip `.True` to `.False`, or `.False` to `.True` |

```musi
let hasHost := host /= "";
let hasPort := port > 0;
let canConnect := hasHost and hasPort;
let useFallback := not canConnect;
```

Name checks when they explain a rule. `hasHost and hasPort` is easier to trust than one long condition.

## Integer bit operations

Use `shl` and `shr` for shifting integer bits left or right.

```musi
let readBit := 1 shl 0;
let writeBit := 1 shl 1;
let mask := readBit or writeBit;
let high := mask shr 1;
```

Use bit operators for flags, masks, and packed integer data. Do not use them as a replacement for records when fields have names.

## Grouping

Use parentheses when `and` and `or` appear together.

```musi
let allowed := isLocal or (hasToken and not expired);
```

The parentheses show that the token must exist and must not be expired.
