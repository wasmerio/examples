---
title: 代码块示例
date: 2024-06-03 10:00:00
updated: 2024-06-03 10:00:00
abbrlink: 3c4d5e6f
tags: [指南, 代码]
categories: [开始]
cover: /img/covers/4.svg
description: Mac 风格代码块、标题、行高亮、增删标记、长代码折叠。
---

代码块由 [Expressive Code](https://expressive-code.com/) 在构建时渲染，主题为 One Dark Pro，带有 Butterfly 风格的 Mac 标题栏。右上角可以复制代码或折叠整个代码块。

## 基本用法

```ts
interface Post {
  title: string;
  tags: string[];
}

export const byDate = (a: Post & { date: Date }, b: Post & { date: Date }) => b.date.getTime() - a.date.getTime();
```

## 标题、行高亮与增删

```js title="astro.config.mjs" {3} ins={5} del={6}
import { defineConfig } from 'astro/config';

export default defineConfig({
  trailingSlash: 'always',
  prefetch: true,
  prefetch: false,
});
```

## Shell

Shell 类语言默认不显示行号：

```bash
pnpm install
pnpm dev
```

## 长代码自动折叠

超过 360px 的代码块会收起，底部的展开条点开后显示全部，再点收起：

```python
def fibonacci(n: int) -> list[int]:
    """Return the first n Fibonacci numbers."""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True


if __name__ == "__main__":
    nums = fibonacci(30)
    primes = [x for x in nums if is_prime(x)]
    print("fibonacci:", nums)
    print("primes among them:", primes)
    for i, x in enumerate(nums):
        print(f"{i:>2}: {x}")
```
