+++
title = "A note on recursion"
date = 2026-07-26
draft = false
topics = ["Writing", "Reference"]
+++

To understand recursion, first understand recursion.

A base case stops the descent; everything else defers to a smaller version of
the same problem. Factorial is the usual teaching example:

```python
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)
```

Closed form, for comparison:

$$n! = \prod_{k=1}^{n} k$$

The recursive version reads like the definition. That is the whole appeal.
