---
title: "Math Formulas in Your Posts"
date: 2025-02-15
draft: false
tags: [Spectra, KaTeX, Math]
math: true
cover: ""
toc: true
description: "Write inline and block math formulas with KaTeX — from simple to complex."
series: [Spectra Feature Tour]
---


## How to Enable It

Add `math: true` to your front matter. That's it. Spectra will load KaTeX automatically — no extra setup needed.

## Inline Formulas

Wrap a formula in two `$` signs and it shows up right in the middle of your text.

For example, Euler's identity $e^{i\pi} + 1 = 0$ is often called the most beautiful equation in math. And $E = mc^2$ is probably the most famous physics formula out there.

Inline formulas don't line-break, so if yours is getting long, use block format instead.

## Block Formulas

Wrap a formula in `$$` and it gets its own line, centered.

The Gaussian integral:

$$\int_{-\infty}^{\infty} e^{-x^2}\, dx = \sqrt{\pi}$$

This result is pretty wild — an integral involving $e$ and the answer has $\pi$ in it.

## Common Formula Examples

### Bayes' Theorem

You can't escape this one in statistics or machine learning:

$$P(A \mid B) = \frac{P(B \mid A)\, P(A)}{P(B)}$$

In plain terms: how you should update your belief about something after seeing new evidence.

### Quadratic Formula

You learned this one in school, but it looks extra official in LaTeX:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

