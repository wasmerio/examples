---
title: 'LaTeX Math Support in Astro Scholar'
description: 'Demonstrating the new LaTeX math rendering capabilities using remark-math and rehype-katex.'
pubDate: '2026-04-04'
tags: ['LaTeX', 'Math', 'Features']
---

Welcome to the new LaTeX math support in Astro Scholar! This post demonstrates the various ways you can write mathematical equations in your markdown files.

## Inline Math

You can easily write inline math equations by wrapping them in single dollar signs. For example, the famous mass-energy equivalence formula is $E = mc^2$.

Here are some more inline examples:

* The area of a circle: $A = \pi r^2$
* The Pythagorean theorem: $a^2 + b^2 = c^2$
* A simple limit: $\lim_{x \to 0} \frac{\sin x}{x} = 1$

## Block Math

For larger or more complex equations, you can use block math by wrapping them in double dollar signs. This will center the equation on its own line.

Here is the quadratic formula:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

### Calculus

Let's look at some calculus examples:

**Derivative:**

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

**Integral:**

$$
\int_{a}^{b} x^2 dx = \left[ \frac{x^3}{3} \right]_{a}^{b} = \frac{b^3 - a^3}{3}
$$

### Matrices

You can also render matrices:

$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

### Summation and Products

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} i = n!
$$

Enjoy writing beautiful math equations in your blog posts!
