+++
title = "A syntax highlighting sampler"
date = 2026-07-27
draft = false
topics = ["Reference"]
+++

A page that does nothing but hold code, so the theme's token colours have
somewhere to show off. Switch themes from the console (`theme set dracula`,
`theme set paper`) and watch the keywords, strings, and numbers re-tint.

## Python

Comments, decorators, f-strings, and builtins all get their own hue.

```python
from functools import lru_cache


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    """Classic memoised Fibonacci."""
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


class Ring:
    """A tiny fixed-size ring buffer."""

    def __init__(self, size: int = 8) -> None:
        self.size = size
        self._buf: list[int] = []

    def push(self, x: int) -> None:
        self._buf.append(x)
        if len(self._buf) > self.size:
            self._buf.pop(0)


