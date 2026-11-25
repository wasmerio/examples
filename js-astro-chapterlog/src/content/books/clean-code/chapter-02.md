---
sections:
  - "2.1 Use Intention-Revealing Names"
  - "2.2 Avoid Disinformation"
  - "2.3 Make Meaningful Distinctions"
---

## Use Intention-Revealing Names

The name of a variable, function, or class should tell you **why it exists, what it does, and how it's used**. If a name requires a comment, the name doesn't reveal its intent.

```java
// Bad
int d; // elapsed time in days

// Good
int elapsedTimeInDays;
```

## Avoid Disinformation

Don't use names that could mislead. For example, don't call a grouping of accounts `accountList` unless it's actually a `List`. Use `accounts` or `accountGroup` instead.

## Make Meaningful Distinctions

Number-series naming (`a1`, `a2`, `a3`) and noise words (`ProductInfo` vs `ProductData`) are meaningless distinctions. If names must be different, they should mean something different.
